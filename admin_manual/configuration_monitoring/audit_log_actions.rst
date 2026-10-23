===============
Audited actions
===============

.. _audit-log-actions:

.. versionadded:: 36

This page lists the actions that Nextcloud server and the apps shipped with it record in the audit log. The
**Event name** is the value of the ``data.operation`` field of the audit log entry. Use it to filter entries or to set
up alerts. See :doc:`audit_log` for the format of the entries and how to read them.

Actions are only recorded when the **admin_audit** app is enabled. See
:ref:`Admin audit log configuration<config-admin-audit>`.

Apps from the App Store document the actions they record in their own documentation or README.

Authentication
--------------

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Login attempt
     - ``auth.login.attempted``
     - A user tried to log in. Recorded before the credentials are checked.
   * - Successful login
     - ``auth.login.succeeded``
     - A user logged in successfully.
   * - Failed login
     - ``auth.login.failed``
     - A login failed, for example because of a wrong password.
   * - Logout
     - ``auth.logout.performed``
     - A user logged out.
   * - Successful two-factor login
     - ``auth.twofactor.passed``
     - A user passed the second factor of a two-factor login.
   * - Failed two-factor login
     - ``auth.twofactor.failed``
     - A user failed the second factor of a two-factor login.
   * - Enable two-factor provider
     - ``auth.twofactor_provider.enabled``
     - A two-factor provider was enabled for a user.
   * - Disable two-factor provider
     - ``auth.twofactor_provider.disabled``
     - A two-factor provider was disabled for a user.
   * - Change two-factor enforcement
     - ``auth.twofactor_enforcement.updated``
     - An administrator changed whether two-factor authentication is enforced, and for which groups.
   * - Add WebAuthn device
     - ``auth.webauthn_device.added``
     - A user added a WebAuthn device, for example a security key, to their account.
   * - Remove WebAuthn device
     - ``auth.webauthn_device.removed``
     - A user removed a WebAuthn device from their account.
   * - Create app password
     - ``auth.app_password.created``
     - An app password was created, in the personal security settings or by a client logging in with the login flow.
   * - Delete app password
     - ``auth.app_password.deleted``
     - An app password was deleted.
   * - Change app password access
     - ``auth.app_password.scope_changed``
     - The filesystem access of an app password was allowed or denied.
   * - Request remote wipe
     - ``auth.remote_wipe.requested``
     - A remote wipe was requested for one app password or for all devices of a user.
   * - Finish remote wipe
     - ``auth.remote_wipe.finished``
     - A device confirmed that its remote wipe was finished.
   * - Request password reset
     - ``auth.password_reset.requested``
     - A password reset email was requested for a user.
   * - Brute force attempt from allow-listed address
     - ``auth.bruteforce.bypassed``
     - A brute force attempt, for example a failed login, came from an IP address on the brute force allow-list, so it
       was not throttled.

Users
-----

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Create user account
     - ``users.user.created``
     - A user account was created, in the user management or with occ.
   * - Delete user account
     - ``users.user.deleted``
     - A user account was deleted.
   * - Enable user account
     - ``users.user.enabled``
     - A disabled user account was enabled.
   * - Disable user account
     - ``users.user.disabled``
     - A user account was disabled.
   * - Change user password
     - ``users.user.password_changed``
     - The password of a user was changed.
   * - Change email address
     - ``users.user.email_changed``
     - The email address of a user was changed.
   * - Change display name
     - ``users.user.display_name_changed``
     - The display name of a user was changed.
   * - Change quota
     - ``users.user.quota_changed``
     - The storage quota of a user was changed.
   * - Change managers
     - ``users.user.managers_changed``
     - The managers of a user were changed.
   * - Change account property
     - ``users.user.account_updated``
     - A property of a user account, for example the phone number or address, was changed through the provisioning API.
   * - Send welcome email
     - ``users.user.welcome_email_sent``
     - A welcome email was sent to a user.
   * - Assign user ID
     - ``users.user.id_assigned``
     - A user ID was assigned to a user of an external user backend, for example LDAP.
   * - Unassign user ID
     - ``users.user.id_unassigned``
     - A user ID was removed from a user of an external user backend.
   * - Allow interaction
     - ``users.interaction.allowed``
     - An interaction of a user with other users or resources, for example sharing, was checked and allowed.
   * - Restrict interaction
     - ``users.interaction.restricted``
     - An interaction of a user with other users or resources was checked and blocked, for example by a policy app.

Groups
------

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Create group
     - ``groups.group.created``
     - A group was created.
   * - Delete group
     - ``groups.group.deleted``
     - A group was deleted.
   * - Change group display name
     - ``groups.group.display_name_changed``
     - The display name of a group was changed.
   * - Add group member
     - ``groups.member.added``
     - A user was added to a group.
   * - Remove group member
     - ``groups.member.removed``
     - A user was removed from a group.
   * - Add group administrator
     - ``groups.subadmin.added``
     - A user was made a subadmin of a group.
   * - Remove group administrator
     - ``groups.subadmin.removed``
     - A user was removed as subadmin of a group.

Files
-----

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Read file
     - ``files.file.read``
     - A file was opened or downloaded.
   * - Create file
     - ``files.file.created``
     - A file or folder was created.
   * - Write file
     - ``files.file.written``
     - A file was written to, for example uploaded or saved.
   * - Rename file
     - ``files.file.renamed``
     - A file or folder was renamed or moved.
   * - Copy file
     - ``files.file.copied``
     - A file or folder was copied.
   * - Delete file
     - ``files.file.deleted``
     - A file or folder was deleted.
   * - Access preview
     - ``files.preview.accessed``
     - A preview image of a file was requested.
   * - Insert file cache entry
     - ``files.cache_entry.inserted``
     - An entry was added to the file cache, for example when a file is found by a scan. Recorded for every file and can
       produce many entries.
   * - Remove file cache entry
     - ``files.cache_entry.removed``
     - An entry was removed from the file cache.
   * - Request ownership transfer
     - ``files.ownership_transfer.requested``
     - A user requested to transfer the ownership of a file or folder to another user.
   * - Accept ownership transfer
     - ``files.ownership_transfer.accepted``
     - The receiving user accepted an ownership transfer.
   * - Reject ownership transfer
     - ``files.ownership_transfer.rejected``
     - The receiving user rejected an ownership transfer.
   * - Transfer ownership
     - ``files.ownership.transferred``
     - The ownership of files was transferred from one user to another, after an accepted request or with occ.

Trash bin and versions
----------------------

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Delete from trash bin
     - ``trashbin.file.deleted``
     - A file was permanently deleted from the trash bin.
   * - Restore from trash bin
     - ``trashbin.file.restored``
     - A file was restored from the trash bin.
   * - Delete file version
     - ``versions.version.deleted``
     - A version of a file was deleted.
   * - Restore file version
     - ``versions.version.restored``
     - A previous version of a file was restored.

Sharing
-------

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Create share
     - ``sharing.share.created``
     - A file or folder was shared, for example with a user, a group, a team, by email or with a public link.
   * - Delete share
     - ``sharing.share.deleted``
     - A share was deleted.
   * - Change share permissions
     - ``sharing.share.permissions_updated``
     - The permissions of a share were changed.
   * - Change share attributes
     - ``sharing.share.attributes_updated``
     - The attributes of a share, for example whether downloads are hidden, were changed.
   * - Change share password
     - ``sharing.share.password_updated``
     - The password of a public share was changed.
   * - Change share expiration date
     - ``sharing.share.expiration_updated``
     - The expiration date of a public share was set or changed.
   * - Remove share expiration date
     - ``sharing.share.expiration_removed``
     - The expiration date of a public share was removed.
   * - Change share link
     - ``sharing.share.token_updated``
     - The token, and with it the link, of a public share was changed.
   * - Access public share
     - ``sharing.share.link_accessed``
     - A public share link was opened.
   * - Accept share
     - ``sharing.share.accepted``
     - A recipient accepted a share.
   * - Leave share
     - ``sharing.share.left``
     - A recipient removed a share that was shared with them.
   * - Restore share
     - ``sharing.share.restored``
     - A recipient restored a share they had removed before.

Unified sharing
---------------

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Create share
     - ``unified_sharing.share.created``
     - A share was created.
   * - Delete share
     - ``unified_sharing.share.deleted``
     - A share was deleted.
   * - Change share state
     - ``unified_sharing.share.state_updated``
     - The state of a share was changed.
   * - Change recipient status
     - ``unified_sharing.share.user_status_updated``
     - A recipient changed their status for a share, for example accepted it.
   * - Add share source
     - ``unified_sharing.source.added``
     - A source, for example a file, was added to a share.
   * - Remove share source
     - ``unified_sharing.source.removed``
     - A source was removed from a share.
   * - Add share recipient
     - ``unified_sharing.recipient.added``
     - A recipient was added to a share.
   * - Remove share recipient
     - ``unified_sharing.recipient.removed``
     - A recipient was removed from a share.
   * - Change recipient secret
     - ``unified_sharing.recipient_secret.updated``
     - The secret of a share recipient, for example the password of a link, was changed.
   * - Change share property
     - ``unified_sharing.property.updated``
     - A property of a share was changed.
   * - Change share permission
     - ``unified_sharing.permission.updated``
     - A permission of a share was granted or revoked.
   * - Change recipient permission
     - ``unified_sharing.recipient_permission.updated``
     - A permission of a single share recipient was granted or revoked.
   * - Select permission preset
     - ``unified_sharing.permission_preset.selected``
     - A permission preset was selected for a share.

Federated sharing
-----------------

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Receive federated share
     - ``federatedfilesharing.share.received``
     - Another server shared a file or folder with a user of this server.
   * - Federated share accepted
     - ``federatedfilesharing.share.accepted``
     - The recipient on another server accepted a share from this server.
   * - Federated share declined
     - ``federatedfilesharing.share.declined``
     - The recipient on another server declined a share from this server.
   * - Federated share removed
     - ``federatedfilesharing.share.unshared``
     - The other server removed a federated share, for example because its owner deleted it.
   * - Federated re-share revoked
     - ``federatedfilesharing.share.revoked``
     - The owner or the re-sharer on another server revoked a federated re-share.
   * - Change federated share permissions
     - ``federatedfilesharing.share.permissions_updated``
     - The other server changed the permissions of a federated share.
   * - Accept federated share
     - ``files_sharing.remote_share.accepted``
     - A user of this server accepted a share from another server.
   * - Decline federated share
     - ``files_sharing.remote_share.declined``
     - A user of this server declined a share from another server.
   * - Remove federated share
     - ``files_sharing.remote_share.removed``
     - A user of this server removed a share from another server.
   * - Receive cloud federation share
     - ``cloud_federation_api.share.received``
     - Another server created a share with this server through the Open Cloud Mesh API.
   * - Receive cloud federation notification
     - ``cloud_federation_api.notification.received``
     - Another server sent a notification about a share through the Open Cloud Mesh API.
   * - Add trusted server
     - ``federation.trusted_server.added``
     - A server was added to the trusted servers.
   * - Remove trusted server
     - ``federation.trusted_server.removed``
     - A server was removed from the trusted servers.
   * - Exchange shared secret
     - ``federation.shared_secret.exchanged``
     - A shared secret was exchanged with a trusted server.

External storage
----------------

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Create external storage
     - ``files_external.storage.created``
     - An external storage was configured.
   * - Change external storage
     - ``files_external.storage.updated``
     - The configuration of an external storage was changed.
   * - Delete external storage
     - ``files_external.storage.deleted``
     - An external storage was removed.
   * - Change global credentials
     - ``files_external.credentials.updated``
     - The global credentials for external storages were changed, by an administrator or for a user.
   * - Change storage credentials
     - ``files_external.user_credentials.updated``
     - A user changed their credentials for an external storage.

Encryption
----------

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Change home storage encryption
     - ``encryption.home_storage.updated``
     - Encryption of the home storages was enabled or disabled.
   * - Enable recovery key
     - ``encryption.recovery_key.enabled``
     - The recovery key was enabled.
   * - Disable recovery key
     - ``encryption.recovery_key.disabled``
     - The recovery key was disabled.
   * - Change recovery key password
     - ``encryption.recovery_key.password_changed``
     - The password of the recovery key was changed.
   * - Change recovery access
     - ``encryption.user_recovery.updated``
     - A user allowed or denied recovering their files with the recovery key.
   * - Recover user files
     - ``encryption.user_files.recovered``
     - The files of a user were recovered with the recovery key.
   * - Change private key password
     - ``encryption.private_key.password_changed``
     - A user changed the password of their private key.
   * - Regenerate encryption keys
     - ``encryption.user_keys.regenerated``
     - The encryption keys of a user were regenerated.

Calendars and contacts
----------------------

Entries for calendar objects and cards only contain their URI, never their content. Changes to the birthday calendar and
to the system address book are not recorded.

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Create calendar
     - ``dav.calendar.created``
     - A calendar was created.
   * - Delete calendar
     - ``dav.calendar.deleted``
     - A calendar was permanently deleted.
   * - Move calendar to trash
     - ``dav.calendar.trashed``
     - A calendar was moved to the trash bin.
   * - Restore calendar
     - ``dav.calendar.restored``
     - A calendar was restored from the trash bin.
   * - Publish calendar
     - ``dav.calendar.published``
     - A calendar was published with a public link.
   * - Unpublish calendar
     - ``dav.calendar.unpublished``
     - The public link of a calendar was removed.
   * - Export calendar
     - ``dav.calendar.exported``
     - A calendar was exported.
   * - Change calendar shares
     - ``dav.calendar_share.updated``
     - A calendar was shared with or unshared from users or groups.
   * - Grant calendar delegation
     - ``dav.calendar_delegation.granted``
     - A user allowed another user to access their calendars as a delegate.
   * - Revoke calendar delegation
     - ``dav.calendar_delegation.revoked``
     - A calendar delegation was removed.
   * - Create calendar object
     - ``dav.calendar_object.created``
     - An event or task was created.
   * - Change calendar object
     - ``dav.calendar_object.updated``
     - An event or task was changed.
   * - Delete calendar object
     - ``dav.calendar_object.deleted``
     - An event or task was permanently deleted.
   * - Move calendar object to trash
     - ``dav.calendar_object.trashed``
     - An event or task was moved to the trash bin.
   * - Restore calendar object
     - ``dav.calendar_object.restored``
     - An event or task was restored from the trash bin.
   * - Move calendar object
     - ``dav.calendar_object.moved``
     - An event or task was moved to another calendar.
   * - Enable birthday calendars
     - ``dav.birthday_calendar.enabled``
     - An administrator enabled the birthday calendars.
   * - Disable birthday calendars
     - ``dav.birthday_calendar.disabled``
     - An administrator disabled the birthday calendars.
   * - Accept federated calendar
     - ``dav.federated_calendar.accepted``
     - A user accepted a calendar shared from another server.
   * - Decline federated calendar
     - ``dav.federated_calendar.declined``
     - A user declined a calendar shared from another server.
   * - Create address book
     - ``dav.addressbook.created``
     - An address book was created.
   * - Delete address book
     - ``dav.addressbook.deleted``
     - An address book was deleted.
   * - Change address book shares
     - ``dav.addressbook_share.updated``
     - An address book was shared with or unshared from users or groups.
   * - Create contact
     - ``dav.card.created``
     - A contact was created.
   * - Change contact
     - ``dav.card.updated``
     - A contact was changed.
   * - Delete contact
     - ``dav.card.deleted``
     - A contact was deleted.
   * - Move contact
     - ``dav.card.moved``
     - A contact was moved to another address book.
   * - Create direct download link
     - ``dav.direct_link.created``
     - A temporary direct download link for a file was created.

Apps and configuration
----------------------

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Enable app
     - ``apps.app.enabled``
     - An app was enabled, for everyone or for some groups.
   * - Disable app
     - ``apps.app.disabled``
     - An app was disabled.
   * - Update app
     - ``apps.app.updated``
     - An app was updated.
   * - Uninstall app
     - ``apps.app.uninstalled``
     - An app was removed.
   * - Change app setting
     - ``config.app_value.updated``
     - An app configuration value was changed through the provisioning API. The value itself is not recorded.
   * - Delete app setting
     - ``config.app_value.deleted``
     - An app configuration value was deleted through the provisioning API.
   * - Run occ command
     - ``console.command.executed``
     - An occ command was run.

Administration settings
-----------------------

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Change mail server settings
     - ``settings.mail.updated``
     - The settings of the email server were changed.
   * - Change mail server credentials
     - ``settings.mail_credentials.updated``
     - The credentials of the email server were changed. The password is not recorded.
   * - Change administration delegation
     - ``settings.delegation.updated``
     - The groups allowed to manage an administration setting were changed.
   * - Change AI settings
     - ``settings.ai.updated``
     - An AI setting, for example the provider of a task type, was changed.
   * - Change app setting form value
     - ``settings.declarative_value.updated``
     - A value of a settings form provided by an app was changed.
   * - Apply configuration preset
     - ``settings.preset.applied``
     - A configuration preset was applied.
   * - Download log file
     - ``settings.log.downloaded``
     - The Nextcloud log file was downloaded.
   * - Change theming setting
     - ``theming.setting.updated``
     - A theming setting, for example the name or a color, was changed.
   * - Reset theming setting
     - ``theming.setting.reset``
     - One or all theming settings were reset to their default values.
   * - Upload theming image
     - ``theming.image.uploaded``
     - A theming image, for example the logo or the background, was uploaded.
   * - Change update channel
     - ``updatenotification.channel.updated``
     - The update channel was changed.
   * - Create updater token
     - ``updatenotification.updater_token.created``
     - A token for the web updater was created.

LDAP
----

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Create LDAP configuration
     - ``user_ldap.config.created``
     - An LDAP server configuration was created.
   * - Copy LDAP configuration
     - ``user_ldap.config.copied``
     - An LDAP server configuration was copied.
   * - Change LDAP configuration
     - ``user_ldap.config.updated``
     - An LDAP server configuration was changed. Only the names of the changed settings are recorded.
   * - Delete LDAP configuration
     - ``user_ldap.config.deleted``
     - An LDAP server configuration was deleted.
   * - Reveal LDAP bind password
     - ``user_ldap.config.password_revealed``
     - The bind password of an LDAP server configuration was shown.
   * - Clear LDAP mappings
     - ``user_ldap.mapping.cleared``
     - The user or group mappings of LDAP were cleared.

Integrations
------------

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Create OAuth 2.0 client
     - ``oauth2.client.created``
     - An OAuth 2.0 client was added.
   * - Delete OAuth 2.0 client
     - ``oauth2.client.deleted``
     - An OAuth 2.0 client was removed.
   * - Create webhook
     - ``webhook_listeners.webhook.created``
     - A webhook was registered.
   * - Change webhook
     - ``webhook_listeners.webhook.updated``
     - A webhook was changed.
   * - Delete webhook
     - ``webhook_listeners.webhook.deleted``
     - A webhook was removed.
   * - Delete webhooks of app
     - ``webhook_listeners.webhook.deleted_by_app``
     - All webhooks registered by an app were removed.
   * - Create Flow rule
     - ``workflowengine.rule.created``
     - A Flow rule was created, by an administrator or a user.
   * - Change Flow rule
     - ``workflowengine.rule.updated``
     - A Flow rule was changed.
   * - Delete Flow rule
     - ``workflowengine.rule.deleted``
     - A Flow rule was deleted.

System tags
-----------

.. list-table::
   :header-rows: 1
   :widths: 25 35 40
   :class: configuration-table

   * - Friendly name
     - Event name
     - Description
   * - Create system tag
     - ``systemtags.tag.created``
     - A system tag was created.
   * - Change system tag
     - ``systemtags.tag.updated``
     - The name, visibility or assignability of a system tag was changed.
   * - Delete system tag
     - ``systemtags.tag.deleted``
     - A system tag was deleted.
   * - Change system tag groups
     - ``systemtags.tag_groups.updated``
     - The groups allowed to assign a restricted system tag were changed.
   * - Assign restricted system tag
     - ``systemtags.tag.assigned``
     - A restricted or invisible system tag was assigned to files.
   * - Unassign restricted system tag
     - ``systemtags.tag.unassigned``
     - A restricted or invisible system tag was removed from files.
   * - Generate backup codes
     - ``twofactor_backupcodes.codes.generated``
     - Two-factor backup codes were generated for a user.
