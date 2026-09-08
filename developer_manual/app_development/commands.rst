.. _occ_commands:

============
occ commands
============

Nextcloud apps can register custom `occ <https://docs.nextcloud.com/server/latest/admin_manual/occ_command.html>`_
commands that administrators can run from the command line. Commands are plain PHP classes annotated with the
``#[AsCommand]`` attribute from ``OCP\Console``. Nextcloud wires the attribute on top of
`Symfony Console <https://symfony.com/doc/current/console.html>`_ for you, so you get argument parsing, bash
completion, and formatted output without extending a base class.


Registering a command
---------------------

List every command class in ``appinfo/info.xml`` under the ``<commands>`` element:

.. code-block:: xml
   :caption: appinfo/info.xml

   <info>
       ...
       <commands>
           <command>OCA\MyApp\Command\Greet</command>
       </commands>
   </info>

Nextcloud reads this list at startup and wires each class through the dependency
injection container, so constructor injection works automatically.


Creating a command class
------------------------

Place command classes in ``lib/Command/``. Add a ``#[AsCommand]`` attribute to the class and implement a single
``__invoke()`` method that runs the command:

.. code-block:: php
   :caption: lib/Command/Greet.php

   <?php

   declare(strict_types=1);

   namespace OCA\MyApp\Command;

   use OCP\Console\Attribute\Argument;
   use OCP\Console\Attribute\AsCommand;
   use OCP\Console\Attribute\Option;
   use OCP\Console\ExitCode;
   use OCP\Console\IOutput;
   use OCP\IUserManager;

   #[AsCommand(
       name: 'myapp:greet',
       // this short description is shown when running "occ list"
       description: 'Print a greeting for a Nextcloud user.',
       // this is shown when running the command with the "--help" option
       help: 'This command prints a greeting for the given Nextcloud user.',
       // this allows you to show one or more usage examples (no need to add the command name)
       usages: ['bob', 'alice --shout'],
   )]
   class Greet {
       public function __construct(
           private IUserManager $userManager,
       ) {
       }

       public function __invoke(
           IOutput $output,
           #[Argument(description: 'The username of the user')]
           string $userId,
           #[Option(description: 'Print the greeting in uppercase')]
           bool $shout = false,
       ): ExitCode {
           $user = $this->userManager->get($userId);

           if ($user === null) {
               $output->writeln("<error>User \"$userId\" not found.</error>");
               return ExitCode::Failure;
           }

           $greeting = 'Hello, ' . $user->getDisplayName() . '!';

           if ($shout) {
               $greeting = strtoupper($greeting);
           }

           $output->writeln($greeting);
           return ExitCode::Success;
       }
   }

The class itself needs no constructor call and no parent class, the constructor is only used for dependency
injection.

.. note::

   If you need the full Symfony Console API — for example a custom ``configure()`` step or dynamic shell
   completion — you can still extend ``OC\Core\Command\Base`` and implement ``configure()``/``execute()``
   directly, as commands did before Nextcloud 35. The ``#[AsCommand]`` style above is recommended for new
   commands because it needs far less boilerplate.

Multiple commands in one class
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To group related commands that share dependencies, put ``#[AsCommand]`` on individual public methods instead of
on the class. Nextcloud registers one occ command per attributed method:

.. code-block:: php
   :caption: lib/Command/UserCommands.php

   class UserCommands {
       public function __construct(
           private IUserManager $userManager,
       ) {
       }

       #[AsCommand(name: 'myapp:user:create')]
       public function create(
           IOutput $output,
           #[Argument(description: 'The username of the user')]
           string $userId,
       ): ExitCode {
           // ...
           return ExitCode::Success;
       }

       #[AsCommand(name: 'myapp:user:delete')]
       public function delete(
           IOutput $output,
           #[Argument(description: 'The username of the user')]
           string $userId,
       ): ExitCode {
           // ...
           return ExitCode::Success;
       }
   }

Only ``OCA\MyApp\Command\UserCommands`` needs to be listed in ``appinfo/info.xml``, both ``myapp:user:create``
and ``myapp:user:delete`` are registered from it.


Command naming
--------------

Use ``appid:command-name`` as the command name. For apps with many commands, group them
with an extra segment: ``appid:group:command-name``. Names must be lowercase and use
hyphens as word separators.


Arguments and options
----------------------

Arguments are positional and declared with the ``#[Argument]`` attribute on a parameter of ``__invoke()``.
Options are prefixed with ``--`` and declared the same way with ``#[Option]``. Both attributes accept a
``description`` (shown in ``--help``) and an optional ``name``; when ``name`` is omitted it defaults to the
parameter's own name. ``#[Option]`` also accepts a single-letter ``shortcut``, for example ``shortcut: 'b'`` for
``-b``.

The parameter's type and default value — not the attribute — decide whether the argument or option is required,
repeatable, or a flag:

+-------------------------------+-----------------------------------------------------------------------------+
| Parameter declaration         | Behavior                                                                    |
+===============================+=============================================================================+
| ``string $name``              | Required — the command fails if it is not provided.                         |
+-------------------------------+-----------------------------------------------------------------------------+
| ``string $name = 'foo'``      | Optional, defaults to ``'foo'``.                                            |
+-------------------------------+-----------------------------------------------------------------------------+
| ``?string $name = null``      | Optional and nullable, defaults to ``null``.                                |
+-------------------------------+-----------------------------------------------------------------------------+
| ``array $name = []``          | Repeatable — the value can be passed multiple times and is collected        |
|                               | into an array. A variadic argument (``string ...$name``) behaves the same   |
|                               | way.                                                                        |
+-------------------------------+-----------------------------------------------------------------------------+
| ``bool $name = false``        | Flag (option only) — absent means ``false``, present means ``true``.        |
+-------------------------------+-----------------------------------------------------------------------------+
| ``bool $name = true``         | Flag (option only) that is on by default; pass ``--no-name`` to disable     |
|                               | it.                                                                         |
+-------------------------------+-----------------------------------------------------------------------------+

Since PHP parameter names are camelCase but Nextcloud's naming convention for options and arguments uses
lowercase with hyphens, override the default name for such parameters, for example
``#[Option(name: 'object-store')] ?string $objectStore = null``.

.. note::

   A ``bool`` option cannot be nullable when it also has a non-``null`` default value — declare it as a plain
   non-nullable ``bool`` for flags.

The arguments and options handling in Nextcloud covers the common cases of the Symfony Console component.
Consult `its documentation <https://symfony.com/doc/current/console/input.html>`_ for background on how
Symfony itself models arguments and options.


Output, input, and other helpers
---------------------------------

Besides ``#[Argument]`` and ``#[Option]`` parameters, ``__invoke()`` can request the following types by
type-hint alone — no attribute needed, and the parameter order does not matter:

- ``OCP\Console\IOutput``: write output with ``write()``/``writeln()``, check the requested verbosity, or
  emit arrays and tables (see below).
- ``OCP\Console\IInput``: read all given arguments and options with ``getArguments()``/``getOptions()``.
- ``OCP\Console\IQuestionHelper``: prompt the user for confirmation or input, see :ref:`occ_commands_interactive`.
- ``OCP\Console\OutputFormat``: only resolved when ``supportsOutputFormat: true`` is set on ``#[AsCommand]``;
  tells you whether the administrator requested plain text or JSON output.

.. tip::

   Set ``supportsOutputFormat: true`` on ``#[AsCommand]`` to let administrators request machine-readable output
   with ``--output=json`` or ``--output=json_pretty``. Use ``IOutput::writeArrayInOutputFormat()`` or
   ``IOutput::writeTableInOutputFormat()`` to emit data that automatically respects the requested format.


Return codes
------------

``__invoke()`` (or an attributed method) must return an ``OCP\Console\ExitCode`` case, or a plain integer:

- ``ExitCode::Success`` (``0``): command completed successfully.
- ``ExitCode::Failure`` (``1``): command encountered an error.
- ``ExitCode::Invalid`` (``2``): command was called with invalid input.

Returning the enum case is recommended; declare the method's return type as ``ExitCode``.


.. _occ_commands_interactive:

Interactive commands
---------------------

Commands can ask for confirmation or prompt for values using Symfony's
`question helper <https://symfony.com/doc/current/components/console/helpers/questionhelper.html>`_. Request an
``OCP\Console\IQuestionHelper`` as a parameter of ``__invoke()``, the same way as ``IOutput``:

.. code-block:: php

   use OCP\Console\ExitCode;
   use OCP\Console\IOutput;
   use OCP\Console\IQuestionHelper;
   use Symfony\Component\Console\Question\ConfirmationQuestion;

   class Greet {
       public function __invoke(
           IOutput $output,
           IQuestionHelper $questionHelper,
       ): ExitCode {
           $question = new ConfirmationQuestion('Are you sure? (y/n) ', false);

           if (!$questionHelper->ask($question)) {
               $output->writeln('Aborted.');
               return ExitCode::Failure;
           }

           // ...
           return ExitCode::Success;
       }
   }

.. note::

   When occ runs non-interactively (e.g. from a cron job), the question helper returns the question's default
   value instead of prompting. Choose a safe default, or add ``--yes``/``--no`` options so administrators can
   automate the command.
