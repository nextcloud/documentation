===================
System requirements
===================

Memory
------

Memory requirements for running an Nextcloud server are greatly variable, 
depending on the numbers of users and files, and volume of server activity. 
Nextcloud needs a minimum of 128MB RAM, and we recommend a minimum of 512MB.

Recommended setup for running Nextcloud
---------------------------------------

For best performance, stability, and functionality we recommend:

* Red Hat Enterprise Linux 7 / Ubuntu 16.04 LTS
* MySQL/MariaDB
* PHP 7.0 +
* Apache 2.4 with mod_php

For a Nextcloud installation with efficient and reliable scaling over ~100 users, see our `deployment recommendations <https://portal.nextcloud.com/article/nextcloud-deployment-recommendations-7.html>`

Working platforms
-----------------

* Server: Linux (Debian 8/9, SUSE Linux Enterprise Server 11 SP3 & 12, 
  Red Hat Enterprise Linux/CentOS 6.5 and 7 (7 is 64-bit only), Ubuntu 14.04 LTS, 16.04 LTS)
* Web server: Apache 2 (mod_php, php-fpm) or Nginx (php-fpm) 
* Databases: MySQL/MariaDB 5.5+; PostgreSQL 9, 10; Oracle 11g (currently only possible 
  as part of an `enterprise subscription <https://nextcloud.com/enterprise>`) 
* PHP 5.6 + required
* Hypervisors: Hyper-V, VMware ESX, Xen, KVM
* Desktop: Windows 7+, Mac OS X 10.7+ (64-bit only), Linux ( CentOS 6.5, 7 (7 is 64-bit only),
  Ubuntu 14.04 LTS, 16.04 LTS, 16.10+, Fedora 21+, openSUSE 13+, Debian 8+).
* Mobile apps: iOS 7+, Android 5+
* Web browser: IE11+, Microsoft Edge, Firefox 15+, Chrome 20+, Safari 7+

See :doc:`source_installation` for minimum software versions for installing 
Nextcloud. If you encounter problems, check our `home user forums <https://help.nextcloud.com>`
or `enterprise support portal <https://portal.nextcloud.com.>`

Database requirements for MySQL / MariaDB
-----------------------------------------

The following is currently required if you're running Nextcloud together with a MySQL / MariaDB database:

* Disabled or BINLOG_FORMAT = MIXED configured Binary Logging
* InnoDB storage engine (MyISAM is not supported)
* "READ COMMITED" transaction isolation level (See: :ref:`db-transaction-label`)

Emoji (UTF8 4-byte) support with MySQL / MariaDB
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you want to use UTF8 4-byte characters such as Emojis on your server, the database needs to be created with character set ``utf8mb4`` and collate ``utf8mb4_general_ci``, e.g.::

  CREATE DATABASE nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

Additionally the following InnoDB settings need to be set::

  [mysqld]
  innodb_large_prefix=on
  innodb_file_format=barracuda
  innodb_file_per_table=true

See :doc:`../configuration_database/mysql_4byte_support` for more information.
