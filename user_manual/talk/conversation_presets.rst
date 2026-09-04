.. SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
.. SPDX-License-Identifier: CC-BY-4.0

======================
Conversation presets
======================

Conversation presets allow administrators to define templates for new conversations, with pre-configured settings such as permissions, lobby rules, and conversation type.

Available presets
-----------------

Depending on your instance configuration, you may see presets when creating a new conversation.
Each preset applies a specific set of defaults suited to a particular use case.

.. image:: images/new-conversation-presets.png
    :alt: Talk new conversation dialog with presets selection
    :width: 400px

Voice room
----------

A permanent call room ("Voice room") is a conversation preset optimized for non-obligatory, always-available meetings.
Any person entering the conversation will be joining the call there, making it easier to start communicating.
Messages in voice room conversation are set to expire after certain time, to keep it lightweight and spontaneous.

Webinar
-------

Moderators can configure a preset to force the lobby, ensuring participants wait for a moderator before joining.
When a conversation uses a forced lobby preset:

- Participants see a waiting room upon joining
- A moderator must allow them to the conversation or lift the lobby
- Useful for webinars, interviews, or controlled meetings

Presentation
------------

Presentation preset is useful for internal meetings, where it is expected to have more listeners than speakers.
Participant permissions are optimized to ensure the best performance and moderation experience, allowing presenters to speak uninterrupted.

Classified conversation
------------------------

A locked-down conversation preset for confidential topics. It cannot be made public, so there is no public link and
no guest access, and SIP dial-in/out and call recording are disabled. Messages expire after one hour by default.

.. TODO: mock screenshot below, replace with a real capture once the feature ships
.. image:: images/new-conversation-presets.png
    :alt: Talk new conversation dialog with the classified conversation preset selected
    :width: 400px

Channel
-------

A broadcast conversation preset for a large audience. Only moderators can post messages; everyone else can only
react, unless a moderator grants individual participants more permissions. Calls are disabled, and the conversation
is searchable and joinable by registered users.

.. TODO: mock screenshot below, replace with a real capture once the feature ships
.. image:: images/new-conversation-presets.png
    :alt: Talk new conversation dialog with the channel preset selected
    :width: 400px

Announcement
------------

An announcement preset works like a channel, with the same posting and call restrictions, but the conversation is
not openly joinable and participants who are added to it cannot leave.

.. TODO: mock screenshot below, replace with a real capture once the feature ships
.. image:: images/new-conversation-presets.png
    :alt: Talk new conversation dialog with the announcement preset selected
    :width: 400px

See also:

- :doc:`conversations`
- :doc:`webinar`
- :doc:`open_conversations`
