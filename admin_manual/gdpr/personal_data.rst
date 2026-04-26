.. _gdpr_personal_data:

======================
Personal data stored
======================

This page gives an overview of the categories of personal data that Nextcloud
stores, to help you prepare your Records of Processing Activities (RoPA) and
privacy notices as required under GDPR Article 30.

Account data
------------

Every user account holds the following data:

* **Username** — the unique identifier used to log in.
* **Display name** — the name shown to other users.
* **Email address** — used for notifications, password resets, and sharing invitations.
* **Password hash** — stored using a one-way hash; the plaintext password is never stored.
* **Last login timestamp** — the date and time of the user's most recent login.
* **Account creation timestamp** — when the account was created.
* **Authentication tokens** — long-lived tokens created for clients and app passwords.

Profile data
------------

Nextcloud stores additional profile fields that users may populate:

* Phone number
* Address
* Website URL
* Fediverse handle, Bluesky handle
* Biography
* Profile picture (avatar)

Each field has a configurable **scope** that controls who can see it:
private, local (visible to other users on the same instance), federated
(shared with trusted federation partners), or published (shared with the
public lookup server). Administrators can restrict or enforce these scopes
server-wide. See :doc:`../configuration_user/profile_configuration` for details.

Files and metadata
------------------

* **File contents** — all files stored by users, including files in external
  storage mounts.
* **File metadata** — filename, path, size, MIME type, creation time,
  modification time, and owner.
* **File share records** — who has shared what with whom, including public
  share tokens and passwords.
* **Trash bin** — deleted files and their original paths, retained according
  to the configured retention policy.
* **File versions** — previous versions of modified files, retained according
  to the configured retention policy.

Activity and audit logs
-----------------------

* **Activity log** — a per-user record of file and sharing events (uploads,
  downloads, shares, edits). Retained for the number of days configured via
  ``activity_expire_days`` (default: 365 days).
* **System audit log** — if the ``admin_audit`` app is enabled, a server-wide
  log of administrative actions and login events is written to the Nextcloud
  log file.

Groupware data
--------------

When the groupware apps are enabled:

* **Contacts** — vCards including names, email addresses, phone numbers,
  physical addresses, photos, and any other fields users add.
* **Calendar events** — event titles, times, locations, descriptions, and
  attendee lists.
* **Tasks** — task titles, descriptions, due dates, and completion status.

Talk (chat and calls)
---------------------

When the Talk app is enabled:

* **Chat messages** — text messages and reactions in one-to-one and group
  conversations.
* **Call metadata** — call participants and timestamps (call recordings, if
  enabled, are stored as files in the initiating user's storage).
* **Conversation membership** — which accounts belong to which conversations.

Server and web server logs
--------------------------

Personal data is also present in server logs, independent of what users intentionally store:

* **Web server access logs** — your web server (Apache, nginx) records the IP
  address, timestamp, and URL of every request. IP addresses are personal data
  under GDPR.
* **Nextcloud application log** — records errors, warnings, and (at higher log
  levels) user actions including IP addresses.
* **Brute-force protection list** — Nextcloud temporarily stores the IP
  address of failed login attempts. These are deleted automatically after
  24 hours or upon a successful login.

Storing logs indefinitely is not considered legitimate usage under GDPR.
Rotate logs at a reasonable interval and consider encrypting them, as they
contain personal data you are responsible for securing. See :doc:`data_retention`
for guidance on log rotation.

Session data
------------

Nextcloud stores the following data client-side as cookies (see :doc:`cookies`
for the full list) and server-side in the session store:

* PHP session data — a random session identifier and an encrypted session
  passphrase.
* Remember-me tokens — stored if the user selected "Remember me" at login.
  Lifetime is controlled by ``remember_login_cookie_lifetime`` (default: 15
  days).

Data held by third-party services
----------------------------------

Some optional features transmit personal data outside the server:

* **Public lookup server** — profile fields with "Published" scope are sent to
  ``lookup.nextcloud.com`` (or a custom server configured via ``lookup_server``)
  to enable cross-instance user discovery. This can be disabled by setting
  ``lookup_server`` to an empty string.
* **Push notifications** — Talk and other apps may route notification payloads
  through Nextcloud's push notification proxy. The payload contains the
  account name and a notification message.
* **Federated sharing** — when sharing files with users on other Nextcloud
  instances, the sharer's display name and email are transmitted to the
  remote server.
