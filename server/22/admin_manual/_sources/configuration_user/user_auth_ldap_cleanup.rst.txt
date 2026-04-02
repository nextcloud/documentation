=================
LDAP user cleanup
=================

LDAP User Cleanup is a new feature in the ``LDAP user and group backend`` 
application. LDAP User Cleanup is a background process that automatically 
searches the Nextcloud LDAP mappings table, and verifies if the LDAP users are 
still available. Any users that are not available are marked as ``deleted`` in 
the ``oc_preferences`` database table. Then you can run a command to display 
this table, displaying only the users marked as ``deleted``, and then you have 
the option of removing their data from your Nextcloud data directory.

These items are removed upon cleanup:

* Local Nextcloud group assignments
* User preferences (DB table ``oc_preferences``)
* User's Nextcloud home folder
* User's corresponding entry in ``oc_storages``

There are two prerequisites for LDAP User Cleanup to operate:

1. Set ``ldapUserCleanupInterval`` in ``config.php`` to your desired check 
   interval in minutes. The default is 51 minutes.

2. All configured LDAP connections are enabled and operating correctly. As users 
   can exist on multiple LDAP servers, you want to be sure that all of your 
   LDAP servers are available so that a user on a temporarily disconnected LDAP 
   server is not marked as ``deleted``.
   
The background process examines 50 users at a time, and runs at the interval you 
configured with ``ldapUserCleanupInterval``. For example, if you have 200 LDAP 
users and your ``ldapUserCleanupInterval`` is 20 minutes, the process will 
examine the first 50 users, then 20 minutes later the next 50 users, and 20 
minutes later the next 50, and so on.

The amount of users to check can be set to a custom value via occ command. The
following example sets it to 300:

``sudo -u www-data php occ config:app:set --value=300 user_ldap cleanUpJobChunkSize``

There are two ``occ`` commands to use for examining a table of users marked as
deleted, and then manually deleting them.  The ``occ`` command is in your 
Nextcloud directory, for example ``/var/www/nextcloud/occ``, and it must be run as 
your HTTP user. To learn more about ``occ``, see 
:doc:`../configuration_server/occ_command`.

These examples are for Ubuntu Linux:

1. ``sudo -u www-data php occ ldap:show-remnants`` displays a table with all 
   users that have been marked as deleted, and their LDAP data.

2. ``sudo -u www-data php occ user:delete [user]`` removes the user's data from the 
   Nextcloud data directory.

This example shows what the table of users marked as ``deleted`` looks like::

 $ sudo -u www-data php occ ldap:show-remnants
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
* ``--json``: instead of a table, the output is json-encoded. This makes it easy to process the data programmatically.


Then you can run ``sudo -u www-data php occ user:delete aaliyah_brown`` to delete 
user aaliyah_brown. You must use the user's Nextcloud name.

Deleting local Nextcloud users
------------------------------

You may also use ``occ user:delete [user]`` to remove a local Nextcloud user; 
this removes their user account and their data.
