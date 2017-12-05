===================
System Requirements
===================

Memory
------

Memory requirements for running an Nextcloud server are greatly variable, 
depending on the numbers of users and files, and volume of server activity. 
Nextcloud needs a minimum of 128MB RAM, and we recommend a minimum of 512MB.

Recommended Setup for Running Nextcloud
---------------------------------------

For best performance, stability, support, and full functionality we recommend:

* Red Hat Enterprise Linux 7
* MySQL/MariaDB
* PHP 5.4 + (PHP 7.1 + not supported)
* Apache 2.4 with mod_php

Supported Platforms
-------------------

* Server: Linux (Debian 7, SUSE Linux Enterprise Server 11 SP3 & 12, 
  Red Hat Enterprise Linux/Centos 6.5 and 7 (7 is 64-bit only), Ubuntu 12.04 
  LTS, 14.04 LTS, 14.10)
* Web server: Apache 2 with mod_php
* Databases: MySQL/MariaDB 5.5+; PostgreSQL; Oracle 11g (currently only possible 
  if you `contact us <https://nextcloud.com/enterprise>` as part of a subscription)
* PHP 5.4 + required (PHP 7.1 + not supported)
* Hypervisors: Hyper-V, VMware ESX, Xen, KVM
* Desktop: Windows XP SP3 (EoL Q2 2015), Windows 7+, Mac OS X 10.7+ (64-bit 
  only), Linux (CentOS 6.5, 7 (7 is 64-bit only), Ubuntu 12.04 LTS, 14.04 LTS, 
  14.10, Fedora 20, 21, openSUSE 12.3, 13, Debian 7 & 8).
* Mobile apps: iOS 7+, Android 4+
* Web browser: IE9+ (except Compatibility Mode), Firefox 14+, Chrome 18+, 
  Safari 5+

See :doc:`source_installation` for minimum software versions for installing 
Nextcloud.

Database Requirements for MySQL / MariaDB
-----------------------------------------

The following is currently required if you're running Nextcloud together with a MySQL / MariaDB database:

* Disabled or BINLOG_FORMAT = MIXED configured Binary Logging (See: :ref:`db-binlog-label`)
* InnoDB storage engine (MyISAM is not supported)
* "READ COMMITED" transaction isolation level (See: :ref:`db-transaction-label`)
