=====
Teams
=====

Teams are user-defined groups of accounts, provided by the **Teams** app (app id ``circles``). Apps do not store
anything in a team themselves: they *contribute* to it, by telling the server which of their own resources are shared
with a given team. A team's overview is assembled from every app that does so.

The API lives in the ``OCP\Teams`` namespace and has been available since Nextcloud 29.

Contributing resources to a team
--------------------------------

Implement ``OCP\Teams\ITeamResourceProvider`` and register it from your ``Application`` class:

.. code-block:: php

    <?php
    namespace OCA\MyApp\AppInfo;

    use OCA\MyApp\Teams\MyAppResourceProvider;
    use OCP\AppFramework\App;
    use OCP\AppFramework\Bootstrap\IBootContext;
    use OCP\AppFramework\Bootstrap\IBootstrap;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;

    class Application extends App implements IBootstrap {
        public function register(IRegistrationContext $context): void {
            $context->registerTeamResourceProvider(MyAppResourceProvider::class);
        }

        public function boot(IBootContext $context): void {
        }
    }

The provider answers three questions about your app's resources:

.. code-block:: php

    interface ITeamResourceProvider {
        public function getId(): string;                 // your provider id, e.g. 'deck'
        public function getName(): string;               // translated, shown to users
        public function getIconSvg(): string;            // inline SVG

        /** @return TeamResource[] resources of yours shared with this team */
        public function getSharedWith(string $teamId): array;

        public function isSharedWithTeam(string $teamId, string $resourceId): bool;

        /** @return string[] team ids a resource of yours is shared with */
        public function getTeamsForResource(string $resourceId): array;
    }

Each resource is returned as an ``OCP\Teams\TeamResource``, carrying the provider, an id, a label, a URL and an icon
- as inline SVG, a URL or an emoji.

.. note::

    A resource contributed this way is still owned by whoever created it. Nothing about registering a provider makes
    the team the owner of anything.

Reading teams and their resources
---------------------------------

``OCP\Teams\ITeamManager`` is the consumer side:

.. code-block:: php

    $providers = $teamManager->getProviders();                                   // since 29.0.0
    $provider  = $teamManager->getProvider('deck');                              // since 29.0.0
    $resources = $teamManager->getSharedWith($teamId, $userId);                   // since 29.0.0
    $teams     = $teamManager->getTeamsForResource('deck', $boardId, $userId);    // since 29.0.0
    $teams     = $teamManager->getTeamsForUser($userId);                          // since 33.0.0
    $lists     = $teamManager->getSharedWithList($teams, $userId, $resourceId);   // since 33.0.0
    $members   = $teamManager->getMembersOfTeam($teamId, $userId);                // since 34.0.0

``getSharedWithList()`` gained its ``$resourceId`` parameter in 34.0.0, so guard for the server version if your app
supports older releases.

The team folder provider
------------------------

Since Nextcloud 35 a team can also have **one exclusive folder** - a team space. That folder is supplied by an
implementation of ``OCP\Teams\ITeamFolderProvider``, which extends ``ITeamResourceProvider``:

.. code-block:: php

    interface ITeamFolderProvider extends ITeamResourceProvider {
        public function getTeamFolder(string $teamId): ?TeamFolder;
        public function createTeamFolder(Team $team, int $quota = 0): TeamFolder;   // quota 0 = unlimited
        public function getLinkableTeamFolders(string $circleId): array;
        public function linkTeamFolder(string $circleId, int $folderId): TeamFolder;
        public function updateTeamFolderQuota(string $teamId, int $quota): TeamFolder;
        public function unlinkTeamFolder(string $teamId): ?TeamFolder;             // keeps the folder
        public function removeTeamFolder(string $teamId): bool;                    // deletes the folder
    }

Implementations are registered the same way as any other resource provider, through
``registerTeamResourceProvider()``. Retrieve the active one with ``ITeamManager::getTeamFolderProvider()``, which
returns ``null`` when no app provides team folders - always handle that case.

.. warning::

    ``unlinkTeamFolder()`` ends the relationship and preserves the folder and its contents; ``removeTeamFolder()``
    deletes them. If you expose either in a user interface, make the difference obvious.

Implementations to look at
--------------------------

- **Files** - ``FileSharingTeamResourceProvider`` in the ``circles`` app, for files and folders shared with a team.
- **Talk** - ``TalkTeamResourceProvider`` in ``spreed``, for conversations.
- **Deck** - ``DeckTeamResourceProvider``, for boards.
- **Team folders** - ``TeamSpaceProvider`` in ``groupfolders``, the reference implementation of
  ``ITeamFolderProvider``.
