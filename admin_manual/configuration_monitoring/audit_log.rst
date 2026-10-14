===============
Admin audit log
===============

.. _audit-log-reference:

The **admin_audit** app records security and compliance relevant actions, for example logins, file access, sharing,
and user and group management. It answers the question *who did what, and when*. The audit log is kept separate from
the regular Nextcloud log, which is meant for debugging and system status.

Apps other than the ones shipped with Nextcloud can write to the audit log too. Which actions are recorded therefore
depends on the apps installed on your server.

This page describes how to read and maintain the audit log. To enable and configure it, see
:ref:`Admin audit log configuration<config-admin-audit>`.

Viewing the audit log
---------------------

The **logreader** app (*Administration settings → Logging*) only shows the regular Nextcloud log. To show audit
entries there as well, see :ref:`Admin audit log configuration<config-admin-audit>`.

For most purposes, read the audit log with command line tools, or forward it to a log management or SIEM system. Each
entry is a single line of JSON, so it can be filtered with a tool such as ``jq``.

Show all groups that were deleted::

    jq -c 'select(.data.operation == "groups.group.deleted")' /var/www/html/data/audit.log

List time, action and message of everything the user ``alice`` did::

    jq -r 'select(.user == "alice") | [.time, .data.operation, .message] | @tsv' /var/www/html/data/audit.log

Follow the actions of a single request::

    jq -c 'select(.reqId == "eB2rT9vXqN4kLm8sP0aZ")' /var/www/html/data/audit.log

Record format
-------------

With the ``file`` backend, the audit log is a `JSON Lines <https://jsonlines.org/>`_ file: every line is one
complete JSON object describing one action. The ``syslog`` and ``systemd`` backends write the same JSON object as the
message. The ``errorlog`` backend prefixes it with ``[<tag>][admin_audit][1]``.

Example entry, written when the administrator ``alice`` created the group ``marketing`` (formatted for readability):

.. code-block:: json

    {
        "reqId": "eB2rT9vXqN4kLm8sP0aZ",
        "level": 1,
        "time": "2026-10-12T14:26:05+00:00",
        "remoteAddr": "192.0.2.10",
        "user": "alice",
        "userDisplayName": "Alice Auditor",
        "app": "admin_audit",
        "method": "POST",
        "url": "/ocs/v2.php/cloud/groups",
        "scriptName": "/ocs/v2.php",
        "message": "Group created: \"marketing\"",
        "userAgent": "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0",
        "version": "36.0.0.0",
        "data": {
            "app": "admin_audit",
            "operation": "groups.group.created",
            "params": {
                "group": "marketing"
            }
        }
    }

Example entry for an action performed with ``occ``:

.. code-block:: json

    {
        "reqId": "EVhhZeg6hZ6mT7oEwtM3",
        "level": 1,
        "time": "2026-10-12T14:31:17+00:00",
        "remoteAddr": "",
        "user": "--",
        "app": "admin_audit",
        "method": "",
        "url": "--",
        "scriptName": "occ",
        "message": "App \"files_external\" enabled",
        "userAgent": "--",
        "version": "36.0.0.0",
        "occ_command": ["occ", "app:enable"],
        "data": {
            "app": "admin_audit",
            "operation": "apps.app.enabled",
            "params": {
                "app": "files_external"
            }
        }
    }

Field reference
^^^^^^^^^^^^^^^

Empty values are written as two dashes: ``--``. Fields marked as optional are left out when they do not apply.

``reqId``
    Request ID. All entries written during the same request share this value, also across the audit log and the regular
    Nextcloud log.

``level``
    Log level. Always ``1`` (INFO) for audited actions.

``time``
    Date and time of the entry. The format and time zone are set with ``logdateformat`` and ``logtimezone`` in
    :file:`config/config.php`. Defaults to ISO 8601 in UTC.

``remoteAddr``
    IP address of the client. Empty for ``occ`` commands and background jobs.

``user``
    ID of the user who performed the action, or ``--`` when no user is logged in, for example for ``occ`` commands,
    background jobs and failed logins.

``userDisplayName``
    Optional. Display name of the acting user at the time the entry was written. Left out when ``user`` is ``--``.

``app``
    Always ``admin_audit`` in the audit log.

``method``
    HTTP method, for example ``GET``, ``POST`` or ``PROPFIND``. Empty for ``occ`` commands.

``url``
    Request path. ``--`` for ``occ`` commands.

``scriptName``
    PHP script that handled the request, for example ``/remote.php`` or ``occ``.

``message``
    Human readable description of the action. See `Message and structured data`_.

``userAgent``
    User agent of the client. ``--`` for ``occ`` commands.

``version``
    Nextcloud version at the time of the entry.

``clientReqId``
    Optional. Value of the ``X-Request-Id`` HTTP header sent by the client.

``occ_command``
    Optional. The ``occ`` command that was run, as an array of up to two arguments. Only present for actions performed
    on the command line.

``data.app``
    Always ``admin_audit``.

``data.operation``
    Optional for now, will be present in every entry in a future Nextcloud version. Stable identifier of the action.
    See `Operation identifiers`_.

``data.params``
    Optional. The parameters of the action as a JSON object, for example the affected user, group, file path or share
    ID. Left out when the action has no parameters or when the parameters are marked as sensitive.

Message and structured data
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Every entry describes the action twice:

* ``message`` is an English sentence with the parameters inserted, meant to be read by people. Its wording can change
  between Nextcloud versions.
* ``data.operation`` and ``data.params`` describe the same action in a machine readable form.

When you filter, count, or alert on audit entries, use ``data.operation`` and ``data.params`` instead of parsing
``message``.

The keys of ``data.params`` are the parameter names of the action, for example ``group``, ``user``, ``path`` or
``id``. The values are strings, numbers, booleans or ``null``. Dates are written as strings in the format
``YYYY-MM-DD HH:MM:SS``.

Operation identifiers
^^^^^^^^^^^^^^^^^^^^^

``data.operation`` identifies the type of action in the form ``<app>.<entity>.<action>``, for example
``files.file.deleted``, ``sharing.share.created`` or ``auth.login.failed``. The identifier does not change when the
wording of ``message`` changes, so it is safe to use it in filters, alert rules and retention policies.

Apps that write to the audit log can define their own identifiers in the same form. Entries written by apps that do
not provide an identifier have no ``data.operation`` field. Providing an identifier will become required in a future
Nextcloud version, so every entry will then have one.

Log rotation
------------

A background job checks the size of the audit log file every three hours. When the file is larger than
``log_rotate_size`` (see :doc:`../configuration_server/logging_configuration`), it is renamed by appending ``.1``
and a new file is started. An existing ``.1`` file is overwritten, so only one rotated file is kept.

This background job only rotates the default **audit.log** and a file set with the legacy app setting. A file set
with ``logfile_audit`` is not rotated by Nextcloud. Use a tool such as ``logrotate`` for such files, and whenever you
need to keep audit entries for a defined period.

Known limitations
-----------------

* **Coverage depends on the apps.** Only actions that an app explicitly reports are recorded. Actions in apps that do
  not report to the audit log are not recorded at all.
* **No retention management.** Nextcloud keeps at most one rotated file, and does not rotate a file set with
  ``logfile_audit``. Configure ``logrotate``, or forward the entries to a central log system, when you need to keep
  audit entries for a defined period.
* **No viewer in the web interface.** The audit log is only shown in *Administration settings → Logging* when it is
  written to the same file as the regular Nextcloud log.
* **No protection against tampering.** The audit log is a plain file that the web server user can write to. To make
  sure entries cannot be changed after the fact, forward them to a separate system, for example with
  ``log_type_audit`` set to ``syslog`` and a remote syslog server.
* **Display names can change.** ``userDisplayName`` is the display name at the time of the entry. Use ``user`` to
  correlate entries of the same account.
* **Entries depend on the log level.** If the system log level is above INFO and no ``log.condition`` is set for
  **admin_audit**, nothing is written. See :ref:`Admin audit log configuration<config-admin-audit>`.
