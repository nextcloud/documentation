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
| (64-bit)         | - Ubuntu 20.04 LTS                                                    |
|                  | - **Red Hat Enterprise Linux 9** (recommended)                        |
|                  | - Red Hat Enterprise Linux 8                                          |
|                  | - Debian 12 (Bookworm)                                                |
|                  | - SUSE Linux Enterprise Server 15                                     |
|                  | - openSUSE Leap 15.5                                                  |
|                  | - CentOS Stream                                                       |
+------------------+-----------------------------------------------------------------------+
| Database         | - **MySQL 8.0+** or MariaDB 10.3/10.5/**10.6** (recommended)/10.11    |
|                  | - Oracle Database 11g (*only as part of an enterprise subscription*)  |
|                  | - PostgreSQL 10/11/12/13/14/15                                        |
|                  | - SQLite (*only recommended for testing and minimal-instances*)       |
+------------------+-----------------------------------------------------------------------+
| Webserver        | - **Apache 2.4 with** ``mod_php`` **or** ``php-fpm`` (recommended)    |
|                  | - nginx with ``php-fpm``                                              |
+------------------+-----------------------------------------------------------------------+
| PHP Runtime      | - 8.0 (*deprecated*)                                                  |
|                  | - 8.1                                                                 |
|                  | - **8.2** (*recommended*)                                             |
|                  | - 8.3                                                                 |
+------------------+-----------------------------------------------------------------------+

See :doc:`source_installation` for minimum PHP-modules and additional software for installing Nextcloud.

CPU Architecture and OS
^^^^^^^^^^^^^^^^^^^^^^^
A 64-bit CPU, OS and PHP is required for Nextcloud to run well.

32-bit systems are supported, with the following known limitations:

- Dates before Unix Epoch (1970-01-01) are not supported
- Dates after 2038 are not supported

Memory
^^^^^^

Memory requirements for running a Nextcloud server are greatly variable,
depending on the numbers of users, apps, files and volume of server activity.

Nextcloud needs a minimum of **128MB** RAM per process, and we recommend a minimum of **512MB** RAM per process.

In low memory environments, some features or apps may require adjustments to their default 
settings in order to function (or, in some cases, may need to be disabled outright).

.. warning:: To use the built-in Updater, at least 256MB is required.

Database requirements for MySQL / MariaDB
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The following is currently required if you're running Nextcloud together with a MySQL / MariaDB database:

* InnoDB storage engine (MyISAM is not supported)
* "READ COMMITTED" transaction isolation level (See: :ref:`db-transaction-label`)
* Disabled or BINLOG_FORMAT = ROW configured Binary Logging (See: https://dev.mysql.com/doc/refman/5.7/en/binary-log-formats.html)
* For **Emoji (UTF8 4-byte) support** see :doc:`../configuration_database/mysql_4byte_support`

Why we drop old PHP versions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Every year, a new PHP version is added and old PHP versions are deprecated. This also affects our documented recommended PHP version.

We try to support old PHP versions for as long as reasonably possible. However the list of security, performance, and bug fixes will only increase, some of those fixes might be considered critical and thus at some point the deprecation will be inevitable.

Thus it is recommended to keep your PHP version up to date.

Advantages of upgrading PHP
===========================

- **Security**

  PHP deprecates security fixes of old versions. Nextcloud cannot implement security fixes that come with new PHP versions as long as we support deprecated PHP versions, since the syntax that we are allowed to use must be the lowest one of the supported versions, thus the upstream packages of third parties break because they dropped this support.

- **Performance**

  The language continuously improves over time which makes it possible to do more requests in significantly less time.

Long term support
=================

If you are running Nextcloud for an organisation-critical use case, you could consider upgrading your subscription to a premium subscription which comes with 5 years of long term support. This means you continue to receive maintenance releases for high and critical security issues, data loss fixes, and regressions within version over this extended period of time.

Desktop client
--------------

We strongly recommend using the latest version of your operating system to get the full and most stable experience out
of our clients.

* **Windows** 10+
* **macOS** Lion (10.14)+ (64-bits only)
* **Linux** (64-bits only) Should run on any distribution newer than Ubuntu 18.04 with our official AppImage package

Mobile apps
-----------

We strongly recommend using the latest version of your mobile operating system to get the full and most stable experience out
of our mobile apps.

Files App
^^^^^^^^^

- **iOS** 15.0+
- **Android** 7.0+

Talk App
^^^^^^^^

- **iOS** 15.0+
- **Android** 7.0+
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
