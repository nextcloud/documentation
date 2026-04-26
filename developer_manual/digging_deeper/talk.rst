================
Talk Integration
================

`Nextcloud Talk <https://apps.nextcloud.com/apps/spreed>`_ is the chat, video and audio conferencing solution in Nextcloud. Apps can access Talk capabilities through a public API.


All communication from an app to the Talk backend is handled through a *broker* ``\OCP\Talk\IBroker``. :ref:`Inject
<dependency-injection>` the Talk broker into your class to make use of it.


Check for Talk existence
------------------------

Talk is an optional app. It has to be installed and enable to be used.

.. code-block:: php

    <?php

    /** @var \OCP\Talk\IBroker $broker */
    if ($broker->hasBackend()) {
        // Do something with it
    } else {
        // Hide Talk integration from a user or use other communication channels, if applicable
    }


Create a conversation
---------------------

A new conversation needs a name and at least one moderator. By default this conversation will be private.

.. code-block:: php

    <?php

    /** @var \OCP\Talk\IBroker $broker */
    /** @var \OCP\IUser $alice */
    /** @var \OCP\IUser $bob */
    $conversation = $broker->createConversation(
        'Weekly 1:1',
        [$alice, $bob]
    );


Customize the conversation
~~~~~~~~~~~~~~~~~~~~~~~~~~

It's possible to adjust the defaults:

- ``setPublic``: Make the conversation public (allowing anyone with the link to access the conversation).
- ``setMeetingDate`` (since Nextcloud 32.0.9, 33.0.3 and 34.0.0): Mark a conversation as related to a meeting.
  This will make Talk automatically expire the conversation 4 weeks (value is configurable)
  after the meeting, unless the owner confirms the conversation should remain.

.. code-block:: php

    <?php

    /** @var \OCP\Talk\IBroker $broker */
    /** @var \OCP\IUser $alice */
    /** @var \OCP\IUser $bob */
    $options = $broker->newConversationOptions();
    $options->setPublic();
    $options->setMeetingDate(
        $this->timeFactory->getDateTime(new \DateTime('2026-04-07 13:00')),
        $this->timeFactory->getDateTime(new \DateTime('2026-04-07 14:00')),
    );

    $conversation = $broker->createConversation(
        'Weekly 1:1',
        [$alice, $bob],
        $options
    );

Delete a conversation
---------------------

A conversation can be deleted by id (token).

.. code-block:: php

    <?php

    /** @var \OCP\Talk\IBroker $broker */
    $broker->deleteConversation('abc123');
