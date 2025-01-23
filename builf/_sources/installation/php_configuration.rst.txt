===========================
PHP Modules & Configuration
===========================

PHP Modules
-----------

This
section lists all required and optional PHP modules.  Consult the `PHP manual
<https://php.net/manual/en/extensions.php>`_ for more information on modules.
You can
check the presence of a module by typing ``php -m | grep -i <module_name>``.
If you get a result, the module is present.

Required:

* PHP (see :doc:`./system_requirements` for a list of supported versions)
* PHP module ctype
* PHP module curl
* PHP module dom
* PHP module fileinfo (included with PHP)
* PHP module filter (only on Mageia and FreeBSD)
* PHP module GD
* PHP module hash (only on FreeBSD)
* PHP module JSON (included with PHP >= 8.0)
* PHP module libxml (Linux package libxml2 must be >=2.7.0)
* PHP module mbstring
* PHP module openssl (included with PHP >= 8.0)
* PHP module posix
* PHP module session
* PHP module SimpleXML
* PHP module XMLReader
* PHP module XMLWriter
* PHP module zip
* PHP module zlib

Database connectors (pick the one for your database):

* PHP module pdo_sqlite (>= 3, usually not recommended for performance reasons)
* PHP module pdo_mysql (MySQL/MariaDB)
* PHP module pdo_pgsql (PostgreSQL)

*Recommended* packages:

* PHP module intl (increases language translation performance and fixes sorting
  of non-ASCII characters)
* PHP module sodium (for Argon2 for password hashing. bcrypt is used as fallback, but if passwords were hashed with Argon2 already and the module is missing, your users can't log in. Included with PHP >= 7.2)

Required for specific apps:

* PHP module ldap (for LDAP integration)
* PHP module smbclient  (SMB/CIFS integration, see
  :doc:`../configuration_files/external_storage/smb`)
* PHP module ftp (for FTP storage / external user authentication)
* PHP module imap (for external user authentication)
* PHP module bcmath (for passwordless login)
* PHP module gmp (for passwordless login)

Recommended for specific apps (*optional*):

* PHP module gmp (for SFTP storage)
* PHP module exif (for image rotation in pictures app)

For enhanced server performance (*optional*) select one or more of the following
caches:

* PHP module apcu (>= 4.0.6)
* PHP module memcached
* PHP module redis (>= 2.2.6, required for Transactional File Locking)

See :doc:`../configuration_server/caching_configuration` to learn how to select
and configure a cache.

For preview generation (*optional*):

* PHP module imagick
* avconv or ffmpeg
* OpenOffice or LibreOffice

.. note::
   If the preview generation of PDF files fails with a "not authorized" error message, you must adjust the imagick policy file.
   See https://cromwell-intl.com/open-source/pdf-not-authorized.html

For command line processing (*optional*):

* PHP module pcntl (enables command interruption by pressing ``ctrl-c``)

.. note::
   You also need to ensure that ``pcntl_signal`` and ``pcntl_signal_dispatch`` are not disabled
   in your php.ini by the ``disable_functions`` option.

For command line updater (*optional*):

* PHP module phar (upgrades Nextcloud by running ``sudo -u www-data php /var/www/nextcloud/updater/updater.phar``)

ini values
----------

The following ini settings should be adapted if needed for Nextcloud:

* ``disable_functions``: avoid disabling functions unless you know exactly what you are doing
* ``max_execution_time``: see :doc:`../configuration_files/big_file_upload_configuration`
* ``memory_limit``: should be at least 512MB. See also :doc:`../configuration_files/big_file_upload_configuration`
* ``opcache.enable`` and friends: See :doc:`../configuration_server/caching_configuration` and :doc:`server_tuning`
* ``open_basedir``: see :doc:`harden_server`
* ``upload_tmp_dir``: see :doc:`../configuration_files/big_file_upload_configuration`

.. _php_ini_tips_label:

php.ini configuration notes
---------------------------

Keep in mind that changes to ``php.ini`` may have to be configured on more than one
ini file. This can be the case, for example, for the ``date.timezone`` setting.
You can search for a parameter with the following command: ``grep -r date.timezone /etc/php``.

**php.ini - used by the Web server:**
::

    /etc/php/8.3/apache2/php.ini
  or
    /etc/php/8.3/fpm/php.ini
  or ...

**php.ini - used by the php-cli and so by Nextcloud CRON jobs:**
::

    /etc/php/8.3/cli/php.ini

.. note:: Path names have to be set in respect of the installed PHP
          (8.1, 8.2, 8.3 or 8.4) as applicable.
