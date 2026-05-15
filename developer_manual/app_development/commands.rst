.. _occ_commands:

============
occ commands
============

Nextcloud apps can register custom `occ <https://docs.nextcloud.com/server/latest/admin_manual/occ_command.html>`_ commands that administrators can run from the command line. Commands extend ``OC\Core\Command\Base``, which wraps
`Symfony Console <https://symfony.com/doc/current/console.html>`_ and adds bash completion support, so the full Symfony
Console API is available.


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

Place command classes in ``lib/Command/``. Each class must extend
``OC\Core\Command\Base`` and implement two methods:

- ``configure()`` — declare the name, description, arguments, and options.
- ``execute()`` — run the command logic and return an exit code.

.. code-block:: php
   :caption: lib/Command/Greet.php

   <?php

   declare(strict_types=1);

   namespace OCA\MyApp\Command;

   use OC\Core\Command\Base;
   use OCP\IUserManager;
   use Symfony\Component\Console\Input\InputArgument;
   use Symfony\Component\Console\Input\InputInterface;
   use Symfony\Component\Console\Input\InputOption;
   use Symfony\Component\Console\Output\OutputInterface;

   class Greet extends Base {

       public function __construct(
           private IUserManager $userManager,
       ) {
           parent::__construct();
       }

       #[\Override]
       protected function configure(): void {
           $this
               ->setName('myapp:greet')
               ->setDescription('Print a greeting for a Nextcloud user')
               ->addArgument(
                   'user-id',
                   InputArgument::REQUIRED,
                   'The user to greet',
               )
               ->addOption(
                   'shout',
                   null,
                   InputOption::VALUE_NONE,
                   'Print the greeting in uppercase',
               );
       }

       #[\Override]
       protected function execute(InputInterface $input, OutputInterface $output): int {
           $userId = $input->getArgument('user-id');
           $user = $this->userManager->get($userId);

           if ($user === null) {
               $output->writeln("<error>User \"$userId\" not found.</error>");
               return self::FAILURE;
           }

           $greeting = 'Hello, ' . $user->getDisplayName() . '!';

           if ($input->getOption('shout')) {
               $greeting = strtoupper($greeting);
           }

           $output->writeln($greeting);
           return self::SUCCESS;
       }
   }

Command naming
--------------

Use ``appid:command-name`` as the command name. For apps with many commands, group them
with an extra segment: ``appid:group:command-name``. Names must be lowercase and use
hyphens as word separators.


Arguments and options
---------------------

Arguments are positional. Options are prefixed with ``--``.

+-----------------------------------------+-------------------------------------------+
| Constant                                | Meaning                                   |
+=========================================+===========================================+
| ``InputArgument::REQUIRED``             | Argument must be provided                 |
+-----------------------------------------+-------------------------------------------+
| ``InputArgument::OPTIONAL``             | Argument may be omitted                   |
+-----------------------------------------+-------------------------------------------+
| ``InputArgument::IS_ARRAY``             | Argument accepts multiple values          |
+-----------------------------------------+-------------------------------------------+
| ``InputOption::VALUE_NONE``             | Flag — present or absent, no value        |
+-----------------------------------------+-------------------------------------------+
| ``InputOption::VALUE_REQUIRED``         | Option requires a value                   |
+-----------------------------------------+-------------------------------------------+
| ``InputOption::VALUE_OPTIONAL``         | Option value is optional                  |
+-----------------------------------------+-------------------------------------------+
| ``InputOption::VALUE_IS_ARRAY``         | Option can be repeated                    |
+-----------------------------------------+-------------------------------------------+

See the `Symfony Console documentation <https://symfony.com/doc/current/console/input.html>`_
for the full reference.


Return codes
------------

``execute()`` must return an integer. Use the constants defined by
``OC\Core\Command\Base`` (inherited from Symfony):

- ``self::SUCCESS`` (``0``) — command completed successfully.
- ``self::FAILURE`` (``1``) — command encountered an error.
- ``self::INVALID`` (``2``) — command was called with invalid input.


Interactive commands
--------------------

Commands can ask for confirmation or prompt for values using Symfony's
`question helper <https://symfony.com/doc/current/components/console/helpers/questionhelper.html>`_:

.. code-block:: php

   use Symfony\Component\Console\Helper\QuestionHelper;
   use Symfony\Component\Console\Question\ConfirmationQuestion;

   // In execute():
   /** @var QuestionHelper $helper */
   $helper = $this->getHelper('question');
   $question = new ConfirmationQuestion('Are you sure? (y/n) ', false);

   if (!$helper->ask($input, $output, $question)) {
       $output->writeln('Aborted.');
       return self::FAILURE;
   }

.. note::

   Interactive prompts are skipped when occ is run non-interactively (e.g. from a
   cron job). Guard against this with ``$input->isInteractive()`` or use
   ``--yes``/``--no`` options so administrators can automate the command.
