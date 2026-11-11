===================
Send a notification
===================

The Flow Notifications app (``flow_notifications``) provides the
**Send a notification** Flow operation. Users can configure it to receive
notifications when events match their conditions. The operation is available
for personal flows, not system-wide flows.

Prerequisites
-------------

The Flow Notifications and Notifications apps must be installed and enabled.
Personal flows must also be enabled by the administrator.

Configuration
-------------

In personal settings, open Flow and add a **Send a notification** flow.
Choose an event and conditions, and optionally provide a title prefix.
All conditions in a rule group must match for the group to trigger.

For example, select **File updated** and add a MIME type condition of
``application/pdf``. With the optional title "PDF updated", the flow can
notify the user when another user updates a matching PDF they can access.

Considerations
--------------

Notifications are skipped when the current session user is the flow owner.
For example, a user updating a file in their own session will not receive a
notification through their own flow.

For the available Flow conditions, see :ref:`available-rules-label`.
