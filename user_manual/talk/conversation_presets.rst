.. SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
.. SPDX-License-Identifier: CC-BY-4.0

======================
Conversation Presets
======================

Conversation presets allow administrators to define templates for new conversations, with pre-configured settings such as permissions, lobby rules, and conversation type.

Available Presets
=================

Depending on your instance configuration, you may see presets when creating a new conversation. Each preset applies a specific set of defaults suited to a particular use case.

Permanent Call Rooms
====================

A permanent call room is a conversation preset optimized for ongoing, always-available meetings.

Setting Up a Permanent Call Room
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

1. Create a new conversation
2. Select the "Permanent call room" or "Voice room" preset
3. The conversation is configured as a persistent space for calls
4. Members can start or join calls at any time

Use Cases
~~~~~~~~~

- Always-on rooms for team stand-ups or recurring meetings
- Impromptu voice discussions without scheduling
- Dedicated spaces for a team or project

Force Lobby
===========

Administrators can configure a preset to force the lobby, ensuring participants wait for a moderator before joining.

When a conversation uses a forced lobby preset:

- Participants see a waiting room upon joining
- A moderator must admit them to the conversation
- Useful for webinars, interviews, or controlled meetings

See Also
========

- :doc:`conversations`
- :doc:`webinar`
- :doc:`open_conversations`
