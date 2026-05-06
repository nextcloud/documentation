.. _gdpr_subject_rights:

=====================================
Responding to data subject requests
=====================================

GDPR grants individuals several rights over their personal data. This page
describes how to fulfil the most common requests using Nextcloud's built-in
tools.

You must respond to subject access requests within **one month**. If a request
is complex or you receive a high volume, you can extend this by a further two
months, but you must inform the requester within the first month that an
extension is needed and explain why. You cannot charge a fee for complying
unless a request is manifestly unfounded or excessive.

Right of access (Article 15)
-----------------------------

A user can view most of their own personal data directly in Nextcloud:

* **Profile and account info** — Personal Settings → Personal Info.
* **Files** — the Files app shows all stored files.
* **Activity log** — the Activity app shows file and sharing events.
* **Sharing history** — the Sharing section in Personal Settings.
* **Connected clients and app passwords** — Personal Settings → Security.

As an administrator you can retrieve a summary of an account's metadata using::

  sudo -E -u www-data php occ user:info <uid>

This outputs display name, email, last login, quota, groups, and backend.

Right to erasure (Article 17)
------------------------------

To permanently delete a user account and all associated data:

.. code-block:: bash

  sudo -E -u www-data php occ user:delete <uid>

This removes the account, all files owned by the user, their profile data,
authentication tokens, and groupware data (contacts, calendars).

.. warning::
   **Comments must be deleted manually before running** ``user:delete``.
   File comments and Talk messages are stored in ``oc_comments`` and
   ``oc_comments_read_markers``. These are not removed by ``user:delete``
   and will be left attributed to "unknown/anonymous user" if not cleaned
   up first. Run these SQL queries before deleting the account:

   .. code-block:: sql

      DELETE FROM oc_comments
        WHERE actor_type = 'users' AND actor_id = '$USERID';

      DELETE FROM oc_comments_read_markers
        WHERE user_id = '$USERID';

   Replace ``$USERID`` with the account's username. To find all comment
   types on your instance (file comments, Talk, etc.) run:

   .. code-block:: sql

      SELECT DISTINCT object_type FROM oc_comments;

.. note::
   **What else is not automatically removed:**

   * Files the user has shared with others remain accessible to recipients
     until the recipient or an administrator deletes them.
   * Federated shares the user accepted from other instances are held on those
     remote servers and must be removed there separately.
   * Entries in the system audit log (``admin_audit``) are retained as they
     form part of the administrative record. Consult your legal team on the
     appropriate retention period for audit logs.
   * Chat messages in Talk conversations are retained in the conversation
     history. Use the Talk admin panel to delete individual conversations if
     needed.
   * Data in backups — see :doc:`data_retention` for guidance.

Before deleting the account you may want to transfer file ownership to
another user so that shared files remain available::

  sudo -E -u www-data php occ files:transfer-ownership <uid> <destination-uid>

Right to data portability (Article 20)
---------------------------------------

Users can export their own data directly from Nextcloud:

* **Files** — downloadable as a ZIP from the Files app, or accessible in full
  via WebDAV at ``https://<your-server>/remote.php/dav/files/<uid>/``.
* **Contacts** — exportable as a ``.vcf`` file from the Contacts app
  (select all → Export).
* **Calendar** — exportable as an ``.ics`` file from the Calendar app
  (Calendar settings → Export).
* **Personal data export** — users can request a full data export in
  Personal Settings → Personal Info → scroll to the bottom → **Download your
  data**. This produces a ZIP archive containing files, contacts, and
  calendar data.

As an administrator you can export a user's calendar from the command line::

  sudo -E -u www-data php occ dav:export-calendar <uid> <calendar-name> <output-file>

Right to rectification (Article 16)
-------------------------------------

Users can correct their own profile data in Personal Settings → Personal Info.
Administrators can update display name, email, and other profile fields using::

  sudo -E -u www-data php occ user:setting <uid> settings email <new-email>
  sudo -E -u www-data php occ user:setting <uid> settings displayname <new-name>

For fields stored in a connected LDAP or SAML directory, corrections must be
made in the upstream directory rather than in Nextcloud.

Right to restriction of processing (Article 18)
-------------------------------------------------

To suspend processing without deleting an account, disable it::

  sudo -E -u www-data php occ user:disable <uid>

A disabled account cannot log in and no background jobs run for it. The
account and all its data remain intact and can be re-enabled at any time::

  sudo -E -u www-data php occ user:enable <uid>
