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
| Operating System | - **Ubuntu 18.04 LTS** (recommended)                                  |
|                  | - **Red Hat Enterprise Linux 7** (recommended)                        |
|                  | - Debian 8 (Jessie), 9 (Stretch)                                      |
|                  | - SUSE Linux Enterprise Server 11 with SP3 & 12                       |
|                  | - openSUSE Leap 42.1+                                                 |
|                  | - CentOS 7                                                            |
+------------------+-----------------------------------------------------------------------+
| Database         | - **MySQL or MariaDB 5.5+** (recommended)                             |
|                  | - Oracle Database 11g (*only as part of an enterprise subscription*)  |
|                  | - PostgreSQL 9.5/9.6/10                                               |
|                  | - SQLite (*only recommended for testing and minimal-instances*)       |             
+------------------+-----------------------------------------------------------------------+
| Webserver        | - **Apache 2.4 with** ``mod_php`` **or** ``php-fpm`` (recommended)    |
|                  | - nginx with ``php-fpm``                                              |
+------------------+-----------------------------------------------------------------------+
| PHP Runtime      | - 7.1                                                                 |
|                  | - **7.2** (*recommended*)                                             |
|                  | - **7.3** (*recommended*)                                             |
+------------------+-----------------------------------------------------------------------+

See :doc:`source_installation` for minimum PHP-modules and additional software for installing Nextcloud.

Memory
^^^^^^

Memory requirements for running a Nextcloud server are greatly variable,
depending on the numbers of users, apps, files and volume of server activity.

Nextcloud needs a minimum of **128MB** RAM, and we recommend a minimum of **512MB**.

Database requirements for MySQL / MariaDB
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The following is currently required if you're running Nextcloud together with a MySQL / MariaDB database:

* InnoDB storage engine (MyISAM is not supported)
* "READ COMMITED" transaction isolation level (See: :ref:`db-transaction-label`)
* Disabled or BINLOG_FORMAT = ROW configured Binary Logging (See: https://dev.mysql.com/doc/refman/5.7/en/binary-log-formats.html)
* For **Emoji (UTF8 4-byte) support** see :doc:`../configuration_database/mysql_4byte_support`

Desktop client
--------------

We strongly recommend using the latest version of your operating system to get the full and most stable experience out
of our clients.

* **Windows** 7+
* **macOS** Lion (10.7)+ (64-bit only)
* **Linux** (CentOS 6.5+, Ubuntu 14.04+, Fedora 21+, openSUSE 13, SUSE Linux Enterprise 11 SP3+, Debian 8 (Jessie)+, Red Hat
  Enterprise Linux 7)

Mobile apps
-----------

We strongly recommend using the latest version of your mobile operating system to get the full and most stable experience out
of our mobile apps.

- **iOS** 10.x+
- **Android** 4.x+

.. note:: The separate Nextcloud Talk app requires iOS 10.x+ or Android 5.x+.

Web browser
-----------

For the best experience with the Nextcloud web interface, we recommend that you use the latest and supported version
of a browser from this list, or one based on those:

- Microsoft **Internet Explorer 11** (latest version)
- Microsoft **Edge**
- Mozilla **Firefox**
- Google **Chrome**/Chromium
- Apple **Safari**

.. note:: If you want to use Nextcloud Talk you should use Mozilla **Firefox** 52+ or Google **Chrome**/Chromium 49+ to have 
          the full experience with video calls and screensharing. Google Chrome/Chromium requires a additional plugin for 
          screensharing.
