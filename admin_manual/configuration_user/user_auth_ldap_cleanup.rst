=================
LDAP user cleanup
=================

Overview
--------

LDAP User Cleanup is a feature in the Nextcloud LDAP application. LDAP User Cleanup periodically and automatically runs in the background, checking the Nextcloud LDAP user mappings and verifying if mapped users are still available in your LDAP directory. Any accounts that are no longer found in LDAP are **marked for deletion** within Nextcloud—this prevents login for those users but does not immediately remove their data.

.. note::

   LDAP User Cleanup does *not* immediately delete user accounts or data. When users are no longer found in LDAP, their accounts are **marked for deletion** within Nextcloud. At this stage, all account data—including files, folders, preferences, and group memberships—remains in place. The user is simply prevented from logging in.

   Actual removal of user data occurs only when you manually delete the account (with ``occ user:delete [username]``). 

   Marking for deletion provides a safe review step for administrators prior to any irreversible action.

How LDAP User Cleanup Works
---------------------------

When a user mapped in Nextcloud can no longer be found in the LDAP directory, their account is automatically marked for deletion by the cleanup job. This disables their login, but all files and account data remain present.

There are two prerequisites for LDAP User Cleanup to operate:

1. Set ``ldapUserCleanupInterval`` in ``config.php`` to your desired check 
   interval in minutes. The default is 51 minutes.

2. All configured LDAP connections are enabled and operating correctly. As users 
   can exist on multiple LDAP servers, you want to be sure that all of your 
   LDAP servers are available so that a user on a temporarily disconnected LDAP 
   server is not marked as ``deleted``.
   
The background process examines 50 users at a time, and runs at the interval you 
configure with ``ldapUserCleanupInterval``. 

For example, if you have 200 LDAP 
users and your ``ldapUserCleanupInterval`` is 20 minutes, the process will 
examine the first 50 users, then 20 minutes later the next 50 users, and 20 
minutes later the next 50, and so on.

The amount of users to check can be set to a custom value via OCC. The
following example sets it to 300:

``occ config:app:set --value=300 user_ldap cleanUpJobChunkSize``

Reviewing Accounts Marked for Deletion
--------------------------------------

To review which accounts have been marked for deletion, you can use the following OCC command:

``occ ldap:show-remnants``

This command will display a list of user accounts that have been flagged by LDAP User Cleanup. You can check this list before proceeding with account removal.

This example shows what a table of users marked for deletion looks like::

 $ sudo -E -u www-data php occ ldap:show-remnants
 +-----------------+-----------------+------------------+--------------------------------------+
 | Nextcloud name  | Display Name    | LDAP UID         | LDAP DN                              |
 +-----------------+-----------------+------------------+--------------------------------------+
 | aaliyah_brown   | aaliyah brown   | aaliyah_brown    | uid=aaliyah_brown,ou=people,dc=com   |
 | aaliyah_hammes  | aaliyah hammes  | aaliyah_hammes   | uid=aaliyah_hammes,ou=people,dc=com  |
 | aaliyah_johnston| aaliyah johnston| aaliyah_johnston | uid=aaliyah_johnston,ou=people,dc=com|
 | aaliyah_kunze   | aaliyah kunze   | aaliyah_kunze    | uid=aaliyah_kunze,ou=people,dc=com   |
 +-----------------+-----------------+------------------+--------------------------------------+

Following flags can be specified additionally:

* ``--short-date``: formats the dates for ``Last login`` and ``Detected on`` in a short Y-m-d format (e.g. 2019-01-14)
* ``--json``: instead of a table, the output is json-encoded. **This makes it easy to process the data programmatically if desired**.

Manually Deleting User Accounts
------------------------------

After reviewing the users that have been marked for deletion, you can manually remove an account and all its data using:

``occ user:delete [username]``

This command will permanently delete the specified user’s data from Nextcloud. Be sure to only run this on users you intend to fully remove.

For example, given the earlier example remnants output you might choose to run ``occ user:delete aaliyah_brown`` to delete user ``aaliyah_brown``. You must use the user's Nextcloud name.

What Gets Deleted
-----------------

The following items are removed **only when you manually delete** a user account that has been marked for deletion by the LDAP User Cleanup process:

* Local Nextcloud group assignments
* User preferences (DB table ``oc_preferences``)
* User's Nextcloud home folder
* User's corresponding entry in ``oc_storages``
* Other app specific data (app implementation dependent)
