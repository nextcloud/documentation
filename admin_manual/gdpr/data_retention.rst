.. _gdpr_data_retention:

==============
Data retention
==============

Nextcloud retains several categories of data beyond the point when a user
considers them "deleted." This page describes the configurable retention
periods and how to align them with your data minimisation obligations under GDPR Article 5(1)(e).

All settings below are configured in ``config/config.php``. See
:doc:`../configuration_server/config_sample_php_parameters` for the full
parameter reference.

Trash bin
---------

When a user deletes a file it moves to the trash bin. The retention policy
is controlled by ``trashbin_retention_obligation``::

  'trashbin_retention_obligation' => 'auto',

Available values:

* ``auto`` (default) — keep deleted files for at least 30 days; remove sooner
  if the user is running low on quota.
* ``D1, auto`` — keep for at least D1 days; remove sooner if quota is low.
* ``auto, D2`` — remove sooner if quota is low; guarantee deletion after D2
  days regardless.
* ``D1, D2`` — keep for at least D1 days; guarantee deletion after D2 days.
* ``disabled`` — never automatically empty the trash bin.

For GDPR purposes, ``disabled`` means deleted files are retained indefinitely
— avoid it unless you have a specific reason. Setting a firm maximum (e.g.
``'30, 60'``) gives users a predictable deletion guarantee.

Users with the appropriate permissions can empty their own trash bin at any
time from the Files app, or an administrator can run::

  sudo -E -u www-data php occ trashbin:cleanup <uid>

To expire files across all users according to the current policy::

  sudo -E -u www-data php occ trashbin:expire

File versions
-------------

The Versions app stores previous copies of modified files. Retention is
controlled by ``versions_retention_obligation``::

  'versions_retention_obligation' => 'auto',

Available values:

* ``auto`` (default) — versions are pruned according to a built-in schedule
  (more versions kept for recent changes, fewer for older ones). See
  :doc:`../configuration_files/file_versioning`.
* ``D, auto`` — keep versions for at least D days, then apply the automatic
  schedule.
* ``auto, D`` — apply the automatic schedule; guarantee deletion after D days.
* ``D1, D2`` — keep for at least D1 days; guarantee deletion after D2 days.
* ``disabled`` — never automatically remove versions.

To remove versions immediately::

  sudo -E -u www-data php occ versions:cleanup <uid>
  sudo -E -u www-data php occ versions:expire <uid>

Activity log
------------

The activity log records file and sharing events per user. Entries older
than the configured number of days are deleted by the daily cron job::

  'activity_expire_days' => 365,

Set this to a lower value to reduce the personal data footprint. Setting it
to ``0`` disables automatic expiry (entries are kept indefinitely).

.. note::
   The activity log is distinct from the system audit log produced by the
   ``admin_audit`` app. Audit log retention is controlled by your log
   rotation configuration, not by this setting.

Remember-me tokens
------------------

When users select "Remember me" at login, Nextcloud stores a long-lived
authentication cookie. Its lifetime is controlled by::

  'remember_login_cookie_lifetime' => 60 * 60 * 24 * 15,

The default is 15 days. Reducing this value means users must re-authenticate
more frequently but limits the exposure window for stolen tokens.

Session lifetime
----------------

Active sessions expire when the browser is closed (session cookies). There
is no server-side session expiry setting in core; sessions are invalidated
when the user logs out or an administrator revokes them via::

  sudo -E -u www-data php occ user:auth-tokens:delete <uid>

Server and web server logs
--------------------------

Web server access logs and the Nextcloud application log contain IP addresses
and other personal data. Storing them indefinitely is not considered legitimate
usage under GDPR. Rotate logs regularly and encrypt archived logs to protect
the personal data they contain.

A minimal ``logrotate`` configuration that rotates daily and keeps logs for a limited period:

.. code-block:: text

   /var/log/nextcloud/*.log {
       daily
       rotate 90
       compress
       shred
       missingok
       notifempty
   }

Adjust the ``rotate`` value to match your legal obligations and security
requirements. If you are legally required to retain logs for a specific period
(e.g. for compliance with national cybersecurity laws), that overrides the
minimisation principle — but you must disclose the retention period in your privacy policy.

.. note::
   Nextcloud's brute-force protection stores IP addresses of failed logins, but
   these are automatically deleted after 24 hours or upon a successful login and
   do not require manual management.

Backups
-------

When you fulfil a right-to-erasure request by deleting an account, the data
also exists in any backups you hold. GDPR's right to erasure extends to backup
copies unless retaining them is required by law or necessary for legal defence.

Practical approaches:

* **Time-limited backups** — set a backup retention policy (e.g. 90 days) so
  that personal data is eventually purged from backups automatically, even if
  you cannot remove it on demand.
* **Isolated backups** — ensure backups can never be restored to a live
  production instance without a deliberate recovery procedure, so that
  deleted data cannot accidentally reappear.
* **Encrypted backups** — encrypt backup media so that the data cannot be read
  if the media is lost or transferred.

.. note::
   Removing a specific user's data from an existing backup is technically
   complex (often impractical for tape or snapshot-based backups) and may
   require rethinking your backup strategy if you are subject to frequent
   erasure requests at scale.

Summary table
-------------

.. list-table::
   :header-rows: 1
   :widths: 30 30 20 20

   * - Data category
     - Config key
     - Default retention
     - Minimum recommended
   * - Trash bin
     - ``trashbin_retention_obligation``
     - 30 days (auto)
     - Set a firm maximum (e.g. ``auto, 60``)
   * - File versions
     - ``versions_retention_obligation``
     - auto schedule
     - Set a firm maximum (e.g. ``auto, 180``)
   * - Activity log
     - ``activity_expire_days``
     - 365 days
     - 90–180 days
   * - Remember-me tokens
     - ``remember_login_cookie_lifetime``
     - 15 days
     - 7–15 days
