.. _resource_permissions:

====================
Resource permissions
====================

.. versionadded:: 36

.. warning::

   This API is experimental. It lives in the ``NCU`` namespace and its PHP
   signatures may still change. Permission IDs and resource type IDs are stable:
   once released they never change.

The resource permission API lets one app restrict what another app allows on
its resources, without knowing what those resources or permissions are.

Three kinds of apps take part:

* The **owning app** owns resources, for example tables or mails. It declares
  its resource types and permissions, asks which permissions are left for an
  actor, and enforces the answer.
* A **restricting app** restricts permissions, for example based on a label
  attached to a resource or on the role a user has in a team. It never needs
  code specific to the owning app.
* The **server** holds the declarations, asks every restricting app and
  combines the answers.

The API only restricts. Whether an actor has access to a resource at all, as
owner or through a share, is decided by the owning app.

Concepts
--------

Permissions
^^^^^^^^^^^

A permission is something that is either allowed or restricted on a resource.
It has a stable ID in the format ``appid:name``, a translated display name and
an optional hint. A permission has the same meaning wherever it is used.

The server ships five core permissions, available as cases of
``\NCU\Resource\Permission\CorePermission``:

.. list-table::
   :header-rows: 1
   :widths: 40 60

   * - ID
     - Enum case
   * - ``core:read``
     - ``CorePermission::Read``
   * - ``core:update``
     - ``CorePermission::Update``
   * - ``core:create``
     - ``CorePermission::Create``
   * - ``core:delete``
     - ``CorePermission::Delete``
   * - ``core:share``
     - ``CorePermission::Share``

The core permissions are independent of each other. A file drop, for example,
allows to create without allowing to read. If your resources need a
dependency, such as "nothing works without read", apply it yourself when you
enforce the result.

Every other permission is a **kind of** exactly one core permission. Whenever a
core permission is restricted, all permissions that are a kind of it are
restricted as well. This is how a restricting app can restrict permissions it
has never heard of: a role that only allows reading restricts ``core:share``
and with it, for example, a ``mail:forward`` permission of the Mail app.

The server also ships ``core:download`` (``CorePermission::DOWNLOAD``), which
is a kind of ``core:read``. Restricting download does not restrict read, but
restricting read restricts download.

Prefer the core permissions. Register an own permission only if your app has
an action whose meaning is not covered by them.

Resources
^^^^^^^^^

A resource is identified by a ``\NCU\Resource\ResourceReference``: the ID of its
resource type (``appid:type``), the ID of the resource within that type and,
optionally, its owner as an ``\OCP\Actor\Principal``. Only the owning app knows
what the ID refers to.

A resource type lists the permissions that apply to its resources. An app can
register several types, for example one for tables and one for rows. There is
no hierarchy between resources: a restriction on a table does not apply to its
rows unless the restricting app returns it for the rows as well.

Actors
^^^^^^

Every check is made for an ``\OCP\Actor\Actor``, see :ref:`actor_api`.
For a logged-in user:

.. code-block:: php

    use OCP\Actor\Actor;
    use OCP\Actor\Principal;

    $actor = Actor::of(Principal::user($user->getUID()));

For a visitor without an account, build an anonymous principal from your own
token, for example the token of a public link.

Access entries
^^^^^^^^^^^^^^

Some restrictions only apply to access gained in a certain way. A user who is
a visitor in a team should only be able to read what is shared with that team,
but keeps full access to a resource that is also shared with them directly.

To make this possible, the owning app can pass the shares that give the actor
access, as it stores them. Each ``\NCU\Resource\Permission\AccessEntry`` names
the recipient of the share and the permissions it grants. The recipient is a
kind and an ID:

.. list-table::
   :header-rows: 1
   :widths: 40 60

   * - Kind
     - ID
   * - ``AccessEntry::RECIPIENT_USER``
     - The user ID
   * - ``AccessEntry::RECIPIENT_GROUP``
     - The group ID
   * - ``AccessEntry::RECIPIENT_TEAM``
     - The team ID
   * - ``appid:kind``
     - Defined by your app, for example a link token

You do not need to resolve group or team memberships or roles. Pass the entry
as it is stored; the restricting app knows what to do with it.

For owning apps
---------------

Registering permissions
^^^^^^^^^^^^^^^^^^^^^^^

If the core permissions are not enough, extend
``\NCU\Resource\Permission\APermission``. The ID has to start with the ID of
your app.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\Tables\Resource;

    use NCU\Resource\Permission\APermission;
    use NCU\Resource\Permission\CorePermission;
    use OCP\IL10N;

    class ExportPermission extends APermission {
        public const ID = 'tables:export';

        public function __construct(
            private IL10N $l10n,
        ) {
        }

        public function getId(): string {
            return self::ID;
        }

        public function getDisplayName(): string {
            return $this->l10n->t('Export');
        }

        public function getKindOf(): CorePermission {
            // Exporting hands the data to someone else
            return CorePermission::Share;
        }
    }

Registering resource types
^^^^^^^^^^^^^^^^^^^^^^^^^^

Implement ``\NCU\Resource\IResourceType`` for every type of resource your app
owns and list the permissions that apply to it.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\Tables\Resource;

    use NCU\Resource\IResourceType;
    use NCU\Resource\Permission\CorePermission;
    use OCP\IL10N;

    class TableResourceType implements IResourceType {
        public const ID = 'tables:table';

        public function __construct(
            private IL10N $l10n,
        ) {
        }

        public function getId(): string {
            return self::ID;
        }

        public function getDisplayName(): string {
            return $this->l10n->t('Table');
        }

        public function getPermissionIds(): array {
            return [
                CorePermission::Read->value,
                CorePermission::Update->value,
                CorePermission::Delete->value,
                CorePermission::Share->value,
                ExportPermission::ID,
            ];
        }
    }

Register both in the ``register`` method of your ``Application`` class:

.. code-block:: php

    public function register(IRegistrationContext $context): void {
        $context->registerResourcePermission(ExportPermission::class);
        $context->registerResourceType(TableResourceType::class);
    }

Registrations with an invalid ID, an ID that is already taken or an ID that
does not start with the ID of your app are logged and skipped.

Checking a resource
^^^^^^^^^^^^^^^^^^^

Ask ``\NCU\Resource\Permission\IPermissionManager`` which permissions are left
for the actor. The simplest form passes only the resource:

.. code-block:: php

    use NCU\Resource\Permission\CorePermission;
    use NCU\Resource\Permission\IPermissionManager;
    use NCU\Resource\ResourceReference;
    use OCP\Actor\Principal;

    $resource = new ResourceReference(
        TableResourceType::ID,
        (string)$table->getId(),
        Principal::user($table->getOwnership()),
    );

    $permissions = $this->permissionManager->check($actor, $resource);
    if (!$permissions->isAllowed(CorePermission::Update)) {
        // Not allowed by another app
    }

Without access entries the result starts from all permissions that apply to
the resource type. It tells you what other apps restrict, not what the actor
may do: intersect it with the access your app grants.

With access entries the result is what is left of the permissions granted by
the entries, so it can be used directly:

.. code-block:: php

    use NCU\Resource\Permission\AccessEntry;

    $entries = [];
    foreach ($this->shareMapper->findSharesFor($table, $userId) as $share) {
        $entries[] = new AccessEntry(
            $share->getReceiverType() === 'circle'
                ? AccessEntry::RECIPIENT_TEAM
                : AccessEntry::RECIPIENT_USER,
            $share->getReceiver(),
            $this->toPermissionIds($share),
        );
    }

    $permissions = $this->permissionManager->check($actor, $resource, $entries);

Pass an entry for every way the actor has access, including ownership if your
app treats the owner like a recipient. Restrictions that only apply to one
recipient, such as a team role, can only take effect if you pass entries.

Permissions in an entry that do not apply to the resource type are ignored
and logged.

Checking many resources
^^^^^^^^^^^^^^^^^^^^^^^

For listings use ``checkAll``. The resources can be of different types, the
actor is the same for all of them. The result is keyed by
``ResourceReference::key()``.

.. code-block:: php

    use NCU\Resource\Permission\ResourceAccess;

    $accesses = [];
    foreach ($rows as $row) {
        $accesses[] = new ResourceAccess(
            new ResourceReference(RowResourceType::ID, (string)$row->getId()),
        );
    }

    $results = $this->permissionManager->checkAll($actor, $accesses);
    foreach ($accesses as $access) {
        $canDelete = $results[$access->resource->key()]
            ->isAllowed(CorePermission::Delete);
    }

``check`` and ``checkAll`` throw an ``InvalidArgumentException`` if a resource
type is not registered. ``checkAll`` also throws if the same resource is
passed more than once.

Enforcing the result
^^^^^^^^^^^^^^^^^^^^

The server does not enforce anything for you. Use the result in both places:

* when you show a resource, to hide or disable what is not allowed, and to
  include the effective permissions in your API responses;
* when an action happens, to refuse it on the server side.

Results are remembered while the process runs, so checking again when the
action happens is cheap.

Rules that depend on who receives something, such as "must not be shared with
external recipients", are not covered by this API. They are handled by the
``\OCP\Interaction\RestrictInteractionEvent``.

For restricting apps
--------------------

Implement ``\NCU\Resource\Permission\IRestrictionProvider``. The provider
receives the actor and all resources of one check, and returns the permissions
it restricts.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\Governance\Resource;

    use NCU\Resource\Permission\CorePermission;
    use NCU\Resource\Permission\IRestrictionProvider;
    use NCU\Resource\Permission\Restriction;
    use OCA\Governance\Service\LabelService;
    use OCP\Actor\Actor;

    class LabelRestrictionProvider implements IRestrictionProvider {
        public function __construct(
            private LabelService $labelService,
        ) {
        }

        public function getRestrictions(Actor $actor, array $accesses): iterable {
            foreach ($accesses as $access) {
                $resource = $access->resource;
                if ($resource->owner?->equals($actor->principal)) {
                    continue;
                }

                $label = $this->labelService->getLabel($resource->type, $resource->id);
                if ($label?->forbidsDownload()) {
                    yield Restriction::forResource($resource, [CorePermission::DOWNLOAD]);
                }
            }
        }
    }

Register it in the ``register`` method of your ``Application`` class:

.. code-block:: php

    $context->registerResourceRestrictionProvider(LabelRestrictionProvider::class);

Things to know:

* The provider is called for resources of every type. Return nothing for
  resources you have no rules for.
* A restriction is a list of permission IDs. Restricting a core permission
  also restricts every permission that is a kind of it. Unknown IDs are
  ignored.
* To allow only some core permissions, restrict the others.
  ``CorePermission::cases()`` gives you all of them.
* Load your data for the whole batch at once where possible, a listing can
  contain hundreds of resources.
* Whether the owner of a resource, administrators or system actors are exempt
  is up to you.
* Results are remembered while the process runs. Call
  ``IPermissionManager::clearCache()`` whenever your restrictions change, for
  example when a label is assigned or a role is changed, so that later checks
  in the same process see the change.

Restricting one recipient
^^^^^^^^^^^^^^^^^^^^^^^^^

``Restriction::forResource`` restricts permissions however the actor has
access. ``Restriction::forRecipient`` restricts only the access the actor has
through one recipient, which the owning app passed as an access entry:

.. code-block:: php

    use NCU\Resource\Permission\AccessEntry;

    foreach ($accesses as $access) {
        foreach ($access->entries as $entry) {
            if ($entry->recipientKind !== AccessEntry::RECIPIENT_TEAM) {
                continue;
            }
            if ($this->isVisitor($actor, $entry->recipientId)) {
                yield Restriction::forRecipient(
                    $access->resource,
                    $entry->recipientKind,
                    $entry->recipientId,
                    [
                        CorePermission::Update->value,
                        CorePermission::Create->value,
                        CorePermission::Delete->value,
                        CorePermission::Share->value,
                    ],
                );
            }
        }
    }

If the same resource is also shared with the user directly, that entry is not
restricted and the user keeps the permissions it grants.

Listing permissions
^^^^^^^^^^^^^^^^^^^

To let users configure restrictions, for example in an editor for labels or
roles, read the registered permissions and resource types from the manager:

.. code-block:: php

    foreach ($this->permissionManager->getResourceTypes() as $resourceType) {
        foreach ($resourceType->getPermissionIds() as $permissionId) {
            $permission = $this->permissionManager->getPermission($permissionId);
            // $permission->getDisplayName(), $permission->getHint(), $permission->getKindOf()
        }
    }

Store the permission IDs, never class names.

How results are combined
------------------------

For every resource the server

#. takes the permissions that apply to the resource type,
#. without access entries starts from all of them; with access entries takes,
   for each entry, the granted permissions without those restricted for the
   recipient of the entry, and merges the entries,
#. removes the permissions restricted for the resource as a whole.

A permission restricted by one restricting app is restricted, no matter what
other restricting apps say.

If a restricting app is disabled, its restrictions no longer apply. If a
restriction provider throws an exception during a check or cannot be loaded,
every permission on all resources of that check is restricted and the error
is logged.
