=======================
Upgrade to Nextcloud 35
=======================

System requirements
-------------------

- PHP 8.2 is no longer supported.
- The list of officially supported operating system has been updated:

  - The minimum supported version of *SUSE Linux Enterprise Server 15* has been bumped to SP7.
  - The minimum supported version of *Debian Linux* has been bumped to *13 (Trixie)*.
  - The minimum supported version of *Ubuntu Linux* has been bumped to *24.04*.

- The list of officially supported databases has been updated:

  - MariaDB 10.6 is out of support and thus Nextcloud dropped support for it.
    The minimum supported version of MariaDB is now 10.11 LTS.
  - MariaDB 12.3 is released as a new LTS version and is now supported by Nextcloud.
  - MySQL 8.0 is out of support and thus Nextcloud dropped support for it.
    The minimum supported version of MySQL is now 8.4 LTS.
  - MySQL 9.7 is released as a new LTS version and is now supported by Nextcloud.

    .. note:: MySQL 9+ dropped support for MD5, some parts of the Nextcloud ecosystem might stilly rely on it.
      You need to make sure that after upgrading to MySQL 9+ you load the MySQL component for MD5 support, to do so run this on your MySQL 9+ server:

      ``INSTALL COMPONENT 'file://component_classic_hashing';``
