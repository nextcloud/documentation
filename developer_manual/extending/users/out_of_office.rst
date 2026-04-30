=====================
Out-of-office periods
=====================

.. versionadded:: 28.0

Since Nextcloud 28, users may set their out-of-office periods in their personal settings. The data
can be accessed and modified by Nextcloud Apps via OCP and by clients via OCS. Nextcloud Apps can
also listen to events emitted by the out-of-office feature.

The OCS API is documented in the :ref:`client section<ocs-out-of-office-api>`.

Access data from within a Nextcloud App via OCP
-------------------------------------------------

The out-of-office data can be accessed through the `OCP\\User\\IAvailabilityCoordinator`
interface. It provides the following methods:

.. code-block:: php

	/**
	 * Check if the feature is enabled on this instance
	 */
	public function isEnabled(): bool;

.. code-block:: php

	/**
	 * Get the user's ongoing out-of-office data, if any
	 */
	public function getCurrentOutOfOfficeData(IUser $user): ?IOutOfOfficeData;

.. code-block:: php

	/**
	 * Reset the absence cache to null
	 */
	public function clearCache(string $userId): void;

.. code-block:: php

	/**
	 * Is the absence in effect at this moment
	 */
	public function isInEffect(IOutOfOfficeData $data): bool;

Listening to events
-------------------

All events have one common method to retrieve data about the  affected out-of-office period.

.. code-block:: php

	public function getData(): IOutOfOfficeData;


The following events are emitted by the out-of-office feature:

* ``OCP\User\Events\OutOfOfficeScheduledEvent`` If a new out-of-office period is scheduled for a
  user. This event is only emitted once when there was no out-of-office period before.
* ``OCP\User\Events\OutOfOfficeChangedEvent`` If the out-of-office data of a user is changed.
* ``OCP\User\Events\OutOfOfficeDeletedEvent`` If the out-of-office period of a user is deleted.
* ``OCP\User\Events\OutOfOfficeStartedEvent`` If an out-of-office period starts. This event is only
  emitted once and not if a period starting in the past is created.
* ``OCP\User\Events\OutOfOfficeEndedEvent`` If an out-of-office period ends. This event is only
  emitted once and not if a period ending in the past is created.

Common data structure
---------------------

The OCP API and emitted events share a common data structure `OCP\\User\\IOutOfOfficeData`. The
start and end dates are represented as UNIX timestamps.

.. code-block:: php

    interface IOutOfOfficeData extends JsonSerializable {
        /**
         * Get the unique token assigned to the current out-of-office event
         */
        public function getId(): string;

        public function getUser(): IUser;

        /**
         * Get the accurate out-of-office start date
         *
         * This event is not guaranteed to be emitted exactly at start date
         */
        public function getStartDate(): int;

        /**
         * Get the (preliminary) out-of-office end date
         */
        public function getEndDate(): int;

        /**
         * Get the short summary text displayed in the user status and similar
         */
        public function getShortMessage(): string;

        /**
         * Get the long out-of-office message for auto responders and similar
         */
        public function getMessage(): string;

        /**
         * Get the replacement user id for auto responders and similar
         */
        public function getReplacementUserId(): ?string;

        /**
         * Get the replacement user displayName for auto responders and similar
         */
        public function getReplacementUserDisplayName(): ?string;
    }

It can be serialized to a JSON object with the following structure:

.. code-block::

    {
        id: string,
        userId: string,
        startDate: int,
        endDate: int,
        shortMessage: string,
        message: string,
        replacementUserId: string|null,
        replacementUserDisplayName: string|null
    }
