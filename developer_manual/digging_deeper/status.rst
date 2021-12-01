===========
User Status
===========

Nextcloud allows user to publish their current status. The status is then
available in various part of the user interface (e.g. participants list in
a Talk room).

Query Status
------------

Using the `OCP\\UserStatus\\IManager` interface, it is possible to query
the user status, for a group of users.

.. code-block:: php

    <?php

    namespace OCA\MyGreatApp\Service;

    use OCP\UserStatus\IManager as IStatusManager;
    use OCP\UserStatus\IUserStatus;

    class MyService {
        /** @var IStatusManager $statusManager */
        public $statusManager;

        public function __construct(IStatusManager $statusManager) {
            $this->statusManager = $statusManager;
        }

        /**
         * @param string[] $userIds
         * @return IUserStatus[]
         */
        public function queryStatusForUsers(array $userIds): array {
            return $this->statusManager->getUserStatuses($userIds);
        }
    }

Updating the status programmatically
------------------------------------

A Nextcloud application can change the user status programmatically. This feature
`setUserStatus` from the `OCP\\UserStatus\\IManager` interface when for example an
user execute an action in the UI.

If the status is supposed to be reverted with an upcoming action from the
user, `setUserStatus` will require to be called with `$createBackup = true`.

This then can be reverted with a call to `revertUserStatus` with the same
`$messageId` and `$status`.

.. code-block:: php

    <?php

    namespace OCA\MyGreatApp\Status;

    use OCA\MyGreatApp\MyEvents;
    use OCA\MyGreatApp\CoolStartEvent;
    use OCA\MyGreatApp\CoolEndEvent;
    use OCP\UserStatus\IManager as IStatusManager;
    use OCP\UserStatus\IUserStatus;

    class Listener {
        /** @var IStatusManager $statusManager */
        public $statusManager;

        public function __construct(IStatusManager $statusManager) {
            $this->statusManager = $statusManager;
        }

        public static function register(IEventDispatcher $dispatcher): void {
            $dispatcher->addListener(MyEvents::COOL_EVENT_STARTED, static function (CoolStartEvent $event) {
                /** @var self $listener */
                $listener = \OC::$server->get(self::class);
                $listener->setUserStatus($event);
            });

            $dispatcher->addListener(MyEvents::COOL_EVENT_FINISHED, static function (CoolEndEvent $event) {
                /** @var self $listener */
                $listener = \OC::$server->get(self::class);
                $listener->revertUserStatus($event);
            });
        }

        public function setUserStatus(ModifyParticipantEvent $event): void {
            $this->statusManager->setUserStatus($event->getUserId(), 'meeting', IUserStatus::AWAY, true);
        }

        public function revertUserStatus(ModifyParticipantEvent $event): void {
            $this->statusManager->revertUserStatus($event->getUserId(), 'meeting', IUserStatus::AWAY);
        }

