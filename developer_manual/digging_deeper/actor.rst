.. _actor_api:

=========
Actor API
=========

.. versionadded:: 36

The Actor API describes who performs an operation. Use it instead of a user ID or an ``\OCP\IUser`` when the party
performing an operation is not always a logged-in user, for example a public share visitor, a Talk guest, a bot,
a federated user or a background job.

The API consists of three classes in the ``\OCP\Actor`` namespace:

``\OCP\Actor\Principal``
    The identity of a single party, for example the user ``alice`` or the retention job of the Versions app.

``\OCP\Actor\Actor``
    Whose authority is claimed for an operation: a principal, and optionally a delegate acting on the principal's
    behalf.

``\OCP\Actor\PrincipalType``
    The kind of a principal: ``User``, ``Anonymous``, ``Bot`` or ``System``.

All three are immutable value objects. Creating them does not authenticate anybody and does not check any permission.

Principals
----------

Create a principal with one of the static factory methods of ``\OCP\Actor\Principal``. Every principal has a ``type``,
an ``id``, an optional ``origin`` and an optional ``source``. The meaning of these properties depends on the type:

``User``
    ``id`` is the user ID. ``origin`` is the remote instance of a federated user, or ``null`` for a local user.
    ``source`` is always ``null``.

``Anonymous``
    ``id`` is the scope the visitor was granted access through, for example a share token. ``origin`` is an optional
    visitor ID within the scope. ``source`` is the kind of anonymous user in the form ``appid:kind``.

``Bot``
    ``id`` is the bot ID, unique within the owning app. ``origin`` is always ``null``. ``source`` is the ID of the app
    owning the bot.

``System``
    ``id`` is the component name, unique within the owning app. ``origin`` is always ``null``. ``source`` is the ID of
    the app owning the component, or ``core``.

The factory methods throw an ``\InvalidArgumentException`` if a value is not valid. App IDs are only checked for their
format. The app does not need to be installed or enabled.

Users
^^^^^

``Principal::user()`` identifies a local user or, if you pass a remote instance, a federated user:

.. code-block:: php

    use OCP\Actor\Principal;

    $alice = Principal::user('alice');
    $bob = Principal::user('bob', 'cloud.example');

The remote instance is normalized the same way as in cloud IDs: a leading ``https://`` and a trailing slash are removed,
an explicit ``http://`` is kept. ``https://cloud.example/`` and ``cloud.example`` therefore identify the same remote
instance.

Anonymous users
^^^^^^^^^^^^^^^

``Principal::anonymous()`` identifies somebody without an account, for example a visitor of a public share or a Talk
guest. Pass the scope the visitor was granted access through and the kind of anonymous user:

.. code-block:: php

    // A visitor of a public share
    $visitor = Principal::anonymous($share->getToken(), 'files_sharing:visitor');

    // A Talk guest, identified within the room
    $guest = Principal::anonymous($room->getToken(), 'spreed:guest', $guestId);

The kind must have the form ``appid:kind``, where ``appid`` is the ID of your app and ``kind`` consists of lowercase
letters, digits, ``_`` and ``-``. The app that owns the kind defines how the scope is interpreted.

The visitor ID is optional. If you pass one, it must stay stable for the same visitor, for example a guest ID or a
session ID.

.. warning::

    Never use the nickname a visitor entered as the visitor ID. Visitors choose nicknames freely: two visitors can pick
    the same nickname, and one visitor can change it at any time.

Bots
^^^^

``Principal::bot()`` identifies a non-human client, for example a Talk bot or an integration. Pass the bot ID and the ID
of the app owning the bot:

.. code-block:: php

    $bot = Principal::bot('summarizer', 'assistant');

System components
^^^^^^^^^^^^^^^^^

``Principal::system()`` identifies a component of an app that acts without a user, for example a background job or an
``occ`` command. Pass the component name and the ID of the owning app, or ``core`` for components of the server:

.. code-block:: php

    $retention = Principal::system('retention', 'files_versions');
    $occ = Principal::system('occ', 'core');

Actors
------

``Actor::of()`` creates an actor for a principal acting as itself:

.. code-block:: php

    use OCP\Actor\Actor;
    use OCP\Actor\Principal;

    $actor = Actor::of(Principal::user('alice'));

Acting on behalf of someone else
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When one party performs an operation for another, call ``onBehalfOf()`` with the party the operation is performed for:

.. code-block:: php

    // The summarizer bot performs an operation for alice
    $actor = Actor::of(Principal::bot('summarizer', 'assistant'))
        ->onBehalfOf(Principal::user('alice'));

    $actor->principal; // alice
    $actor->delegate;  // the summarizer bot
    $actor->isDelegated(); // true

The returned actor has the target as its principal, and the original principal as its delegate:

- The **principal** is the party whose authority is claimed. Check permissions against the principal.
- The **delegate** is the party that actually performs the operation. Keep it for logging and auditing. The delegate
  never grants additional permissions.

Delegation has exactly one level. Calling ``onBehalfOf()`` on an actor that already has a delegate throws a
``\LogicException``. Acting on behalf of the actor's own principal throws an ``\InvalidArgumentException``.

Using an actor
--------------

Accept an ``\OCP\Actor\Actor`` in your service methods when the caller is not always a logged-in user. Check the
principal, and deny any principal type your code does not handle:

.. code-block:: php

    use OCP\Actor\Actor;
    use OCP\Actor\PrincipalType;

    public function deleteNote(Actor $actor, int $noteId): void {
        $principal = $actor->principal;
        $note = $this->mapper->find($noteId);

        $allowed = match ($principal->type) {
            PrincipalType::User => $principal->origin === null
                && $note->getOwner() === $principal->id,
            default => false,
        };
        if (!$allowed) {
            throw new NotPermittedException();
        }

        $this->mapper->delete($note);
        $this->logger->info('Note deleted', ['actor' => $actor->key()]);
    }

.. important::

    New principal types may be added in later Nextcloud versions. Always handle unknown types, for example with a
    ``default`` branch that denies the operation.

Comparing actors and principals
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Use ``equals()`` to compare two principals or two actors. Two actors are equal if both their principals and their
delegates are equal.

``key()`` returns a stable string for logs and cache keys. Different principals and actors always have different keys:

.. list-table::
   :header-rows: 1
   :widths: 55 45

   * - Value
     - ``key()``
   * - ``Principal::user('alice')``
     - ``user|alice``
   * - ``Principal::user('bob', 'cloud.example')``
     - ``user|bob@cloud.example``
   * - ``Principal::anonymous('sharetoken', 'files_sharing:visitor')``
     - ``anonymous|sharetoken|files_sharing:visitor``
   * - ``Principal::anonymous('roomtoken', 'spreed:guest', 'guestid')``
     - ``anonymous|roomtoken@guestid|spreed:guest``
   * - ``Principal::bot('summarizer', 'assistant')``
     - ``bot|summarizer|assistant``
   * - ``Principal::system('retention', 'files_versions')``
     - ``system|retention|files_versions``
   * - The bot acting on behalf of ``alice``
     - ``user|alice#bot|summarizer|assistant``

The characters ``|``, ``@``, ``#`` and ``%`` are percent-encoded within the parts. For example, the local user
``bob@cloud.example`` has the key ``user|bob%40cloud.example``.

Storing and passing actors
--------------------------

``jsonSerialize()`` returns a plain array and ``fromArray()`` restores the object from it, so you can store an actor or
pass it to a background job:

.. code-block:: php

    $this->jobList->add(CleanupJob::class, [
        'actor' => Actor::of(Principal::user($userId))->jsonSerialize(),
    ]);

    // In CleanupJob::run($argument)
    $actor = Actor::fromArray($argument['actor']);

``fromArray()`` throws an ``\InvalidArgumentException`` if the data is invalid. This also happens for a principal type
that was added in a later Nextcloud version, for example when data written by a newer server is read after a
downgrade. Handle the exception when you read stored data.

.. warning::

    An actor proves nothing about who sent it. Never use an actor restored from request data for authorization. Only
    use actors your code created from the authenticated session, or that your app stored itself, for example in a
    background job argument.
