===================
System requirements
===================

Server
------

For best performance, stability and functionality we have documented some recommendations for running a Nextcloud server.

.. note:: If you plan a setup for your organization and you rely on professional deployment consulting (e.g. efficient and
          reliable scaling) and support, we strongly recommend you to check out our `enterprise support
          <https://nextcloud.com/enterprise/>`_.

+------------------+-----------------------------------------------------------------------+
| Platform         | Options                                                               |
+==================+=======================================================================+
| Operating System | - **Ubuntu 22.04 LTS** (recommended)                                  |
| (64bit)          | - Ubuntu 20.04 LTS                                                    |
|                  | - **Red Hat Enterprise Linux 8** (recommended)                        |
|                  | - Debian 10 (Buster)                                                  |
|                  | - SUSE Linux Enterprise Server 15                                     |
|                  | - openSUSE Leap 42.1+                                                 |
|                  | - CentOS Stream                                                       |
+------------------+-----------------------------------------------------------------------+
| Database         | - **MySQL 8.0+ or MariaDB 10.2/10.3/10.4/10.5** (recommended)         |
|                  | - Oracle Database 11g (*only as part of an enterprise subscription*)  |
|                  | - PostgreSQL 10/11/12/13/14                                           |
|                  | - SQLite (*only recommended for testing and minimal-instances*)       |
+------------------+-----------------------------------------------------------------------+
| Webserver        | - **Apache 2.4 with** ``mod_php`` **or** ``php-fpm`` (recommended)    |
|                  | - nginx with ``php-fpm``                                              |
+------------------+-----------------------------------------------------------------------+
| PHP Runtime      | - 7.4                                                                 |
|                  | - 8.0                                                                 |
|                  | - **8.1** (*recommended*)                                             |
+------------------+-----------------------------------------------------------------------+

See :doc:`source_installation` for minimum PHP-modules and additional software for installing Nextcloud.

CPU Architecture and OS
^^^^^^^^^^^^^^^^^^^^^^^
A 64bit CPU and 64bit OS is required for Nextcloud to run well.

Memory
^^^^^^

Memory requirements for running a Nextcloud server are greatly variable,
depending on the numbers of users, apps, files and volume of server activity.

Nextcloud needs a minimum of **128MB** RAM per process, and we recommend a minimum of **512MB** RAM per process.

Database requirements for MySQL / MariaDB
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The following is currently required if you're running Nextcloud together with a MySQL / MariaDB database:

* InnoDB storage engine (MyISAM is not supported)
* "READ COMMITTED" transaction isolation level (See: :ref:`db-transaction-label`)
* Disabled or BINLOG_FORMAT = ROW configured Binary Logging (See: https://dev.mysql.com/doc/refman/5.7/en/binary-log-formats.html)
* For **Emoji (UTF8 4-byte) support** see :doc:`../configuration_database/mysql_4byte_support`

Desktop client
--------------

We strongly recommend using the latest version of your operating system to get the full and most stable experience out
of our clients.

* **Windows** 8.1+
* **macOS** Lion (10.7)+ (64-bit only)
* **Linux** (CentOS 6.5+, Ubuntu 14.04+, Fedora 21+, openSUSE 13, SUSE Linux Enterprise 11 SP3+, Debian 8 (Jessie)+, Red Hat
  Enterprise Linux 7)

Mobile apps
-----------

We strongly recommend using the latest version of your mobile operating system to get the full and most stable experience out
of our mobile apps.

Files App
^^^^^^^^^

- **iOS** 14.0+
- **Android** 6.0+

Talk App
^^^^^^^^

- **iOS** 14.0+
- **Android** 5.0+
- **Nextcloud Server** 14.0+
- **Nextcloud Talk** 4.0+

.. note:: When using Nextcloud Talk 12.0+ please update the Android Talk App to the newest version (or at least to v12.1).

Web browser
-----------

For the best experience with the Nextcloud web interface, we recommend that you use the latest and supported version
of a browser from this list, or one based on those:

- Microsoft **Edge**
- Mozilla **Firefox**
- Google **Chrome**/Chromium
- Apple **Safari**

.. note:: If you want to use Nextcloud Talk you should use Mozilla **Firefox** 52+ or Google **Chrome**/Chromium 49+ to have
          the full experience with video calls and screensharing. Google Chrome/Chromium requires an additional plugin for
          screensharing.
