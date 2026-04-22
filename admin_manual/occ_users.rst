=====================
User & group commands
=====================

.. _user_commands_label:

User commands
-------------

The ``user`` commands create and remove users, reset passwords, manage authentication tokens / sessions, display a simple
report showing how many users you have, and when a user was last logged in::

 user
  user:add                            adds a user
  user:add-app-password               adds a app password named "cli" (deprecated: alias for user:auth-tokens:add)
  user:auth-tokens:add                Add app password for the named account
  user:auth-tokens:delete             Deletes an authentication token
  user:auth-tokens:list               List authentication tokens of an user
  user:clear-avatar-cache             clear avatar cache
  user:delete                         deletes the specified user
  user:disable                        disables the specified user
  user:enable                         enables the specified user
  user:info                           shows information about the specific user
  user:keys:verify                    Verify if the stored public key matches the stored private key
  user:lastseen                       shows when the user was logged in last time
  user:list                           shows list of all registered users
  user:profile                        Read and modify user profile data
  user:report                         shows how many users have access
  user:resetpassword                  Resets the password of the named user
  user:setting                        Read and modify user settings

user:add
^^^^^^^^

You can create a new user with their display name, login name, and any group
memberships with the ``user:add`` command. The syntax is::

 user:add [--password-from-env] [--generate-password] [--display-name[="..."]] [-g|--group[="..."]] [--email EMAIL]
 uid

The ``display-name`` corresponds to the **Full Name** on the Users page in your
Nextcloud Web UI, and the ``uid`` is their **Username**, which is their
login name. This example adds new user Layla Smith, and adds them to the
**users** and **db-admins** groups. Any groups that do not exist are created::

 sudo -E -u www-data php occ user:add --display-name="Layla Smith"
   --group="users" --group="db-admins" layla
   Enter password:
   Confirm password:
   The user "layla" was created successfully
   Display name set to "Layla Smith"
   User "layla" added to group "users"
   User "layla" added to group "db-admins"

Go to your Users page, and you will see your new user.

``password-from-env`` allows you to set the user's password from an environment
variable. This prevents the password from being exposed to all users via the
process list, and will only be visible in the history of the user (root)
running the command. This also permits creating scripts for adding multiple new
users.

To use ``password-from-env`` you must run as "real" root, rather than ``sudo``,
because ``sudo`` strips environment variables. This example adds new user Fred
Jones::

 export OC_PASS=newpassword
 sudo -E -u www-data php occ user:add --password-from-env --display-name="Fred Jones" --group="users" fred
 The user "fred" was created successfully
 Display name set to "Fred Jones"
 User "fred" added to group "users"

``generate-password`` allows you to set a securely generated password for the user.
This is never shown in the output and can be used to create users with temporary
passwords. This can be used in conjunction with the ``email`` option to create
users with a temporary password and send a welcome email to the user's email
address without user interaction::

 sudo -E -u www-data php occ user:add layla --generate-password --email layla@example.tld
   The account "layla" was created successfully
   Welcome email sent to layla@example.tld

The ``email`` option allows you to set the user's email address when creating
the user. A welcome email will be sent to the user's email address if
``newUser.sendEmail`` is set to ``yes`` in ``core``'s app config or not set at all::

 sudo -E -u www-data php occ user:add layla --email layla@example.tld
   Enter password:
   Confirm password:
   The account "layla" was created successfully
   Welcome email sent to layla@example.tld

user:resetpassword
^^^^^^^^^^^^^^^^^^

You can reset any user's password, including administrators (see
:doc:`../configuration_user/reset_admin_password`)::

 sudo -E -u www-data php occ user:resetpassword layla
   Enter a new password:
   Confirm the new password:
   Successfully reset password for layla

It is possible to clear a user's passwords with ``--no-password`` ::

 sudo -E -u www-data php occ user:resetpassword --no-password layla
   Are you sure you want to clear the password for layla?
   Successfully reset password for layla

You may also use ``password-from-env`` to reset passwords::

 export OC_PASS=newpassword
 sudo -E -u www-data php occ user:resetpassword --password-from-env layla
   Successfully reset password for layla

user:delete
^^^^^^^^^^^

You can delete users::

 sudo -E -u www-data php occ user:delete fred

user:lastseen
^^^^^^^^^^^^^

View a specific user's most recent login::

 sudo -E -u www-data php occ user:lastseen layla
   layla's last login: 2024-03-20 17:18

View a list of all users' most recent login::

 sudo -E -u www-data php occ user:lastseen --all
   albert's last login: 2024-03-18 10:30
   bob has never logged in.
   layla's last login: 2024-03-20 17:18
   stephanie's last login: 2024-01-11 13:26

user:profile
^^^^^^^^^^^^

Read user profile properties::

  sudo -E -u www-data php occ user:profile admin
    - displayname: admin
    - address: Berlin
    - email: admin@example.net
    - profile_enabled: 1
    - pronouns: they/them

Get a single profile property for a user::

    sudo -E -u www-data php occ user:profile address
      Berlin

Set a profile property::

    sudo -E -u www-data php occ user:profile address Stuttgart

Delete a profile property::

    sudo -E -u www-data php occ user:profile address --delete

user:setting
^^^^^^^^^^^^

Read user settings::

 sudo -E -u www-data php occ user:setting layla
   - core:
     - lang: en
   - login:
     - lastLogin: 1465910968
   - settings:
     - email: layla@example.tld

Filter by app::

 sudo -E -u www-data php occ user:setting layla core
   - core:
     - lang: en

Get a single setting::

 sudo -E -u www-data php occ user:setting layla core lang
 en

Set a setting::

 sudo -E -u www-data php occ user:setting layla settings email "new-layla@example.tld"

Delete a setting::

 sudo -E -u www-data php occ user:setting layla settings email --delete

user:report
^^^^^^^^^^^

Generate a simple report that counts all users, including users on external user
authentication servers such as LDAP::

 sudo -E -u www-data php occ user:report
 +------------------+----+
 | User Report      |    |
 +------------------+----+
 | Database         | 12 |
 | LDAP             | 86 |
 |                  |    |
 | total users      | 98 |
 |                  |    |
 | user directories | 2  |
 | active users     | 15 |
 | disabled users   | 0  |
 +------------------+----+

`active users` shows the number of users which logged in at least once.
`disabled users` shows the number of users which are disabled.

There might be a discrepancy between the total number of users compared to the number of active users and the number of disabled users.
Users that have never logged in before are not counted as active or disabled users.
Some user backends also do not allow a count for the number of users.

user:list
^^^^^^^^^

You can use the command ``user:list`` to list users. By default it will limit the output to 500 users but you can override that with options ``--limit`` and ``--offset``. Use ``--disabled`` to only list disabled users.

user:info
^^^^^^^^^

With the ``user:info`` command, you can access an account information such as: user id, display name, quota, groups, storage usage... and many more

.. code-block::

  user:info admin
    - user_id: admin
    - display_name: admin
    - email: admin@domain.com
    - cloud_id: admin@cloud.domain.com
    - enabled: true
    - groups:
      - admin
      - users
    - quota: none
    - storage:
      - free: 162409623552
      - used: 1110
      - total: 162409624662
      - relative: 0
      - quota: -3
    - first_seen: 2025-03-14T08:44:46+00:00
    - last_seen: 2025-03-25T20:21:13+00:00
    - user_directory: /var/www/nextcloud/data/admin
    - backend: Database

.. _group_commands_label:

Group commands
--------------

The ``group`` commands create and remove groups, add and remove users in
groups, display a list of all users in a group::

 group
  group:add                           add a group
  group:delete                        remove a group
  group:adduser                       add a user to a group
  group:removeuser                    remove a user from a group
  group:list                          list configured groups

You can create a new group with the ``group:add`` command. The syntax is::

 group:add [gid]

The ``gid`` corresponds to the group name you entering after clicking
"Add group" on the Users page in your Nextcloud Web UI. This example adds new
group "beer"::

 sudo -E -u www-data php occ group:add beer

Add one or more existing users to the specified group with the ``group:adduser``
command. The syntax is::

 group:adduser <gid> <uid1> [uid2 ... uidN]

This example adds the user "denis" to the existing group "beer"::

 sudo -E -u www-data php occ group:adduser beer denis

This example adds the users "denis", "dora" and "daisy" to the existing group "beer"::

 sudo -E -u www-data php occ group:adduser beer denis dora daisy

You can remove one or more users from the group with the ``group:removeuser`` command.
This example removes the existing user "denis" from the existing
group "beer"::

 sudo -E -u www-data php occ group:removeuser beer denis

This example removes the existing user "denis", "dora" and "daisy" from the existing
group "beer"::

 sudo -E -u www-data php occ group:removeuser beer denis dora daisy

Remove a group with the ``group:delete`` command. Removing a group doesn't
remove users in a group. You cannot remove the "admin" group. This example
removes the existing group "beer"::

 sudo -E -u www-data php occ group:delete beer

List configured groups via the ``group:list`` command. The syntax is::

 group:list [-l|--limit [LIMIT]] [-o|--offset [OFFSET]] [-i|--info] [--output [OUTPUT]]

``limit`` allows you to specify the number of groups to retrieve (default: ``500``).

``offset`` is an offset for retrieving groups.

``info`` Show additional info (backend).

``output`` Output format: ``plain``, ``json`` or ``json_pretty`` (default: ``plain``).


.. _two_factor_auth_label:

Two-factor authentication
-------------------------
If a two-factor provider app is enabled, it is enabled for all users by default
(though the provider can decide whether or not the user has to pass the challenge).
In the case of a user losing access to the second factor (e.g. lost phone with
two-factor SMS verification), the admin can try to disable the two-factor
check for that user via the occ command::

 sudo -E -u www-data php occ twofactorauth:disable <uid> <provider_id>

.. note:: This is not supported by all providers.

To re-enable two-factor auth again use the following command::

 sudo -E -u www-data php occ twofactorauth:enable <uid> <provider_id>

.. note:: This is not supported by all providers.

.. _disable_user_label:

Disable users
-------------
Admins can disable users via the occ command too::

 sudo -E -u www-data php occ user:disable <username>

Use the following command to enable the user again::

 sudo -E -u www-data php occ user:enable <username>

Note that once users are disabled, their connected browsers will be disconnected.


.. _system_tags_commands_label:

System Tags
-----------

List tags::

  sudo -E -u www-data php occ tag:list

Add a tag::

  sudo -E -u www-data php occ tag:add <name> <access>

Edit a tag::

  sudo -E -u www-data php occ tag:edit --name <name> --access <access> <id>

`--name` and `--access` are optional.

Delete a tag::

  sudo -E -u www-data php occ tag:delete <id>

Access level

========== ======== ==========
Level      Visible¹ Assignable²
========== ======== ==========
public     Yes      Yes
restricted Yes      No
invisible  No       No
========== ======== ==========

| ¹ User can see the tag
| ² User can assign the tag to a file


