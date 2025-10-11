===============
User management
===============

On the User management page of your Nextcloud Web UI you can:

* Create new users
* View all of your users in a single scrolling window
* Filter users by group
* See what groups they belong to
* Edit their full names and passwords
* See their data storage locations
* View and set quotas
* Create and edit their email addresses
* Send an automatic email notification to new users
* Disable and enable users
* Delete them with a single click

The default view displays basic information about your users.

.. figure:: ../images/user-config.png

The group filters on the left sidebar let you quickly filter users by their
group memberships and create new groups.

.. figure:: ../images/user-config-groups.png

.. note:: User counts for certain groups, such as "All accounts," may not be
   visible when using certain backends such as LDAP/AD/SAML.

Click the gear icon on the lower left sidebar to set a default storage quota,
and to display additional fields: **Show storage location, Show last log in,
Show user backend, Send email to new users,** and **Show email address**.

.. figure:: ../images/user-config-settings.png
  :scale: 75 %

User accounts have the following properties:

*Login Name (Username)*
  The unique ID of a Nextcloud user, which cannot be changed.

*Full Name*
  The user's display name that appears on file shares, the Nextcloud Web
  interface, and emails. Admins and users may change the Full Name at any time. If
  the Full Name is not set, it defaults to the login name.

*Password*
  The admin sets the new user's initial password. Both the user and the admin can
  change the user's password at any time.

*Email address*
  You can set an email address for a user.
  This address can be used when you first set up an account
  so the user receives an email asking them to create a password if none is provided.
  This address can also be used for password reset requests.

*Groups*
  You may create groups and assign group memberships to users. By default, new
  users are not assigned to any groups.

*Group Admin*
  Group admins are granted administrative privileges for specific groups and
  can create and remove users from their groups. This means they can modify the
  username, password, email, quota, etc., of members of the group. Group admins
  are not allowed to add existing users to their groups.

*Quota*
  The maximum disk space assigned to each user. Any user who exceeds the quota
  cannot upload or sync data. You have the option to include external
  storage in user quotas.

*Manager*
  Every user can have one organizational manager. The manager property goes into
  the system address book card of the user and is used for the Contacts app's
  organization chart, for example. Setting a manager does **not** change any
  authorization level of the user or their manager.

Creating a new user
-------------------

To create a user account:

* Enter the new user's **Login Name** and their initial **Password**
* Optionally, assign **Groups** memberships
* Click the **Create** button

.. figure:: ../images/user-config-new-user.png

Login names may contain letters (a-z, A-Z), numbers (0-9), dashes (-),
underscores (_), periods (.), spaces ( ), and at signs (@). After creating the user, you
may fill in their **Full Name** if it is different from the login name, or
leave it for the user to complete.

If you have checked **Send email to new user** in the control panel on the
lower left sidebar, you may also enter the new user's email address, and
Nextcloud will automatically send them a notification with their new login
information. You may edit this email using the email template editor on your
Admin page (see :doc:`../configuration_server/email_configuration`).

Setting the **Send email to new user** checkbox allows you to leave the **Password**
field empty. The user will get an activation email to set their own password.

Reset a user's password
-----------------------

You cannot recover a user's password, but you can set a new one:

* Hover your cursor over the user's **Password** field
* Click on the **pencil icon**
* Enter the user's new password in the password field, and remember to provide
  the user with their password

If you have encryption enabled, there are special considerations for user
password resets. Please see
:doc:`../configuration_files/encryption_configuration`.

Renaming a user
---------------

Each Nextcloud user has two names: a unique **Login Name** used for
authentication, and a **Full Name**, which is their display name. You can edit
the display name of a user, but you cannot change the login name of any user.

To set or change a user's display name:

* Hover your cursor over the user's **Full Name** field
* Click on the **pencil icon**
* Enter the user's new display name

Granting administrator privileges to a user
-------------------------------------------

Nextcloud has two types of administrators: **Super Administrators** and **Group
Administrators**. Group administrators have the rights to create, edit, and
delete users in their assigned groups. Group administrators cannot access
system settings or add or modify users in groups for which they are not **Group
Administrators**. Use the dropdown menus in the **Group Admin** column to
assign group admin privileges.

.. figure:: ../images/user-config-group-admin.png

**Super Administrators** have full rights on your Nextcloud server and can
access and modify all settings. To assign the **Super Administrators** role to
a user, simply add them to the ``admin`` group.

Managing groups
---------------

You can assign new users to groups when you create them and create new groups
when you create new users. You may also use the **Add Group** button at the top
of the left pane to create new groups. New group members will immediately
have access to file shares that belong to their new groups.

Setting storage quotas
----------------------

Click the gear icon on the lower left pane to set a default storage quota. This is
automatically applied to new users. You may assign a different quota to any user
by selecting from the **Quota** dropdown, selecting either a preset value or
entering a custom value. When you create custom quotas, use the standard
abbreviations for your storage values, such as 500 MB, 5 GB, 5 TB, and so on.

You now have a configurable option in ``config.php`` that controls whether
external storage is counted against users' quotas. This is still
experimental and may not work as expected. The default is to not count
external storage as part of user storage quotas. If you prefer to include it,
then change the default ``false`` to ``true``.

::

   'quota_include_external_storage' => false,

.. note:: If an external storage is defined as root, the quota will not
   be calculable and will be **ignored**.

Metadata (such as thumbnails, temporary files, and encryption keys) takes up
about 10% of disk space but is not counted against user quotas. Users can check
their used and available space on their Personal pages. Only files that
originate with users count against their quotas, and not files shared with them
that originate from other users. For example, if you upload files to a
different user's share, those files count against your quota. If you re-share a
file that another user shared with you, that file does not count against your
quota, but the originating user's.

Encrypted files are a little larger than unencrypted files; the unencrypted size
is calculated against the user's quota.

Deleted files that are still in the trash bin do not count against quotas. The
trash bin is set at 50% of quota. Deleted file aging is set at 30 days. When
deleted files exceed 50% of quota, the oldest files are removed until the
total is below 50%.

When version control is enabled, older file versions are not counted
against quotas.

When a user creates a public share via URL and allows uploads, any uploaded
files count against that user's quota.

Disable and enable users
------------------------

.. figure:: ../images/user-config-actions.png

Sometimes you may want to disable a user without permanently deleting their
settings and files. The user can be activated again at any time, without data loss.

Hover your cursor over their name on the **Users** page until the "..." menu icon
appears at the far right. After clicking on it, you will see the **Disable** option.

The user will no longer be able to access their Nextcloud until you enable them again.
Also, all external shares, via public link or email, will not be accessible.
Internal shares will still be working, so other users on Nextcloud can continue working.

If you wish for internal shares to be disabled as well when a user is disabled,
activate the configuration option files_sharing:hide_disabled_user_shares::

 occ config:app:set files_sharing hide_disabled_user_shares --value yes

You will find all disabled users in the **disabled** section on the left pane.
Enabling users is as easy as disabling them. Just click on the "..." menu, and
select **Enable**.

Deleting users
--------------

.. figure:: ../images/user-config-actions.png

Deleting a user is easy: hover your cursor over their name on the **Users** page
until the "..." menu icon appears at the far right. After clicking on it, you will
see the **Delete** option. Clicking on it deletes a user with all their data immediately.

You'll see an undo button at the top of the page, which remains for a few seconds.
When the undo button is gone, you cannot recover the deleted user.

All of the files owned by the user are deleted as well, including all files they
have shared. If you need to preserve the user's files and shares, you must first
download them from your Nextcloud Files page, which compresses them into a zip
file, or use a sync client to copy them to your local computer. See
:doc:`../configuration_files/file_sharing_configuration` to learn how to create
persistent file shares that survive user deletions.

Disabling the "Your email address [...] was changed" email 
----------------------------------------------------------

If an email address of a user is changed by an admin, then it triggers an email
to the user that states "Your email address on [URL] was changed by an
administrator.". In some cases this should not be triggered, because it was a
normal maintenance change. To disable this specific email the appconfig option
``disable_email.email_address_changed_by_admin`` can be set to ``yes``::

	occ config:app:set settings disable_activity.email_address_changed_by_admin --value yes

To disable this behaviour change it to any other value or delete the app config::

	occ config:app:delete settings disable_activity.email_address_changed_by_admin

