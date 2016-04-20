================================
ownCloud |version| Release Notes
================================


Changes in 9.0
--------------

9.0 requires .ico files for favicons. This will change in 9.1, which will 
use .svg files. See `Changing favicon 
<https://doc.owncloud.org/server/9.0/developer_manual/core/theming.html#changing
-favicon>`_ in the Developer Manual.

Home folder rule is enforced in the user_ldap application in new ownCloud installations; see
:doc:`configuration_user/user_auth_ldap`. This affects ownCloud 8.0.10, 8.1.5 and 8.2.0 and up.

The Calendar and Contacts apps have been rewritten and the CalDAV and CardDAV backends of these
apps were merged into ownCloud core. During the upgrade existing Calendars and Addressbooks
are automatically migrated. As a fallback for failed upgrades or an option to test a migration
``dav:migrate-calendars`` and/or ``dav:migrate-addressbooks`` scripts are available via the
``occ`` command. See :doc:`configuration_server/occ_command`.

Updates on systems with large datasets will take longer, due to the addition of checksums to the
oC database. See `<https://github.com/owncloud/core/issues/22747>`_.

Linux packages are available from our `official download repository <https://download.owncloud.org/download/repositories/stable/owncloud/>`_ .
New in 9.0: split packages. ``owncloud`` installs ownCloud plus dependencies, including Apache
and PHP. ``owncloud-files`` installs only ownCloud. This is useful for custom LAMP stacks, and
allows you to install your own LAMP apps and versions without packaging conflicts with ownCloud.
See :doc:`installation/linux_installation`.

New option for the ownCloud admin to enable or disable sharing on individual external mountpoints
(see :ref:`external_storage_mount_options_label`). Sharing on such mountpoints is disabled by default.

Enterprise 9.0
--------------

``owncloud-enterprise`` packages are no longer available for CentOS6, RHEL6, 
Debian7, or any version of Fedora. A new package, 
``owncloud-enterprise-files``, is available for all supported platforms. This 
new package comes without dependencies, and is installable on a larger number of 
platforms. System administrators on these older distros must install their own 
LAMP stacks and databases. On newer supported distros, install 
``owncloud-enterprise`` as usual. See 
:doc:`enterprise_installation/linux_installation`.

Changes in 8.2
--------------

New location for Linux package repositories; ownCloud admins must manually 
change to the new repos. See :doc:`maintenance/upgrade`

PHP 5.6.11+ breaks the LDAP wizard with a 'Could not connect to LDAP' error. See https://github.com/owncloud/core/issues/20020. 

``filesystem_check_changes`` in ``config.php`` is set to 0 by default. This 
prevents unnecessary update checks and improves performance. If you are using 
external storage mounts such as NFS on a remote storage server, set this to 1 
so that ownCloud will detect remote file changes.

XSendFile support has been removed, so there is no longer support for `serving 
static files
<https://doc.owncloud.org/server/8.1/admin_manual/configuration_files/
serving_static_files_configuration.html>`_ from your ownCloud server.

LDAP issue: 8.2 uses the ``memberof`` attribute by default. If this is not 
activated on your LDAP server your user groups will not be detected, and you 
will see this message in your ownCloud log: ``Error PHP Array to string 
conversion at /var/www/html/owncloud/lib/private/template/functions.php#36``. 
Fix this by disabling the ``memberof`` attribute on your ownCloud server with 
the ``occ`` command, like this example on Ubuntu Linux::

 sudo -u www-data php occ ldap:set-config "s01" useMemberOfToDetectMembership 0
 
Run ``sudo -u www-data php occ ldap:show-config`` to find the correct ``sNN`` 
value; if there is not one then use empty quotes, ``""``. (See 
:doc:`configuration_server/occ_command`.)

Users of the Linux Package need to update their repository setup as described
in this `blogpost <https://owncloud.org/blog/upgrading-to-owncloud-server-8-2/>`_.

Changes in 8.1
--------------

Use APCu only if available in version 4.0.6 and higher. If you install an older version,
you will see a ``APCu below version 4.0.6 is installed, for stability and performance
reasons we recommend to update to a newer APCu version`` warning on your ownCloud admin page.

SMB external storage now based on ``php5-libsmbclient``, which must be downloaded 
from the ownCloud software repositories (`installation instructions 
<https://software.opensuse.org/download.html?project=isv%3AownCloud%3Acommunity% 
3A8.1&package=php5-libsmbclient>`_).
  
"Download from link" feature has been removed.

The ``.htaccess`` and ``index.html`` files in the ``data/`` directory are now 
updated after every update. If you make any modifications to these files they 
will be lost after updates.

The SabreDAV browser at ``/remote.php/webdav`` has been removed.

Using ownCloud without a ``trusted_domain`` configuration will not work anymore.

The logging format for failed logins has changed and considers now the proxy 
configuration in ``config.php``.

A default set of security and privacy HTTP headers have been added to the 
ownCloud ``.htaccess`` file, and ownCloud administrators may now customize which 
headers are sent.

More strict SSL certificate checking improves security but can result in
"cURL error 60: SSL certificate problem: unable to get local issuer certificate"
errors with certain broken PHP versions. Please verify your SSL setup, update your
PHP or contact your vendor if you receive these errors.

The persistent file-based cache (e.g. used by LDAP integration) has been dropped and 
replaced with a memory-only cache, which must be explicitly configured. See 
:doc:`configuration_user/user_auth_ldap`. Memory cache configuration for the 
ownCloud server is no longer automatic, requiring installation of 
your desired cache backend and configuration in 
``config.php`` (see :doc:`configuration_server/caching_configuration`.) 

The OC_User_HTTP backend has been removed. Administrators are encouraged to use 
the ``user_webdavauth`` application instead.

ownCloud ships now with its own root certificate bundle derived from Mozilla's 
root certificates file. The system root certificate bundle will not be used 
anymore for most requests.
  
When you upgrade from ownCloud 8.0, with encryption enabled, to 8.1, you must 
enable the new encryption backend and migrate your encryption keys. See 
:ref:`upgrading_encryption_label`.

Encryption can no longer be disabled in ownCloud 8.1. It is planned to re-add
this feature to the command line client for a future release.

It is not recommended to upgrade encryption-enabled systems from ownCloud Server 8.0
to version 8.1.0 as there is a chance the migration will break. We recommend 
migrating to the first bugfix release, ownCloud Server 8.1.1.

Due to various technical issues, by default desktop sync clients older than 
1.7 are not allowed to connect and sync with the ownCloud server. This is 
configurable via the ``minimum.supported.desktop.version`` switch in 
``config.php``.

Previews are now generated at a maximum size of 2048 x 2048 pixels. This is configurable
via the ``preview_max_x`` and ``preview_max_y`` switches in ``config.php``.

The ownCloud 8 server is not supported on any version of Windows.

The 8.1.0 release has a minor bug which makes app updates fail at first try. Reload the
apps page and try again, and the update will succeed.

The ``forcessl`` option within the ``config.php`` and the ``Enforce SSL`` option 
within the Admin-Backend was removed. This now needs to be configured like 
described in :ref:`use_https_label`.

WebDAV file locking was removed in oC 8.1 which causes Finder on Mac OS X to mount WebDAV read-only.

Enterprise 8.1 Only
-------------------

The SharePoint Drive app does not verify the SSL certificate of the SharePoint 
server or the ownCloud server, as it is expected that both devices are in the 
same trusted environment.

ownCloud 8.0
------------

Manual LDAP Port Configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When you are configuring the LDAP user and group backend application, ownCloud 
may not auto-detect the LDAP server's port number, so you will need to enter it 
manually.

.. https://github.com/owncloud/core/pull/16748

No Preview Icon on Text Files
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

There is no preview icon displayed for text files when the file contains fewer than six characters.

.. https://github.com/owncloud/core/issues/16556#event-316503097

Remote Federated Cloud Share Cannot be Reshared With Local Users
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When you mount a Federated Cloud share from a remote ownCloud server, you cannot re-share it with
your local ownCloud users. (See :doc:`configuration_files/federated_cloud_sharing_configuration`
to learn more about federated cloud sharing)

Manually Migrate Encryption Keys after Upgrade
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you are using the Encryption app and upgrading from older versions of 
ownCloud to ownCloud 8.0, you must manually migrate your encryption keys.
See :ref:`upgrading_encryption_label`.

Windows Server Not Supported
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Windows Server is not supported in ownCloud 8.

PHP 5.3 Support Dropped
^^^^^^^^^^^^^^^^^^^^^^^

PHP 5.3 is not supported in ownCloud 8, and PHP 5.4 or better is required.

Disable Apache Multiviews
^^^^^^^^^^^^^^^^^^^^^^^^^

If Multiviews are enabled in your Apache configuration, this may cause problems 
with content negotiation, so disable Multiviews by removing it from your Apache 
configuration. Look for lines like this:: 

 <Directory /var/www/owncloud>
 Options Indexes FollowSymLinks Multiviews
 
Delete ``Multiviews`` and restart Apache.

.. https://github.com/owncloud/core/issues/9039

ownCloud Does Not Follow Symlinks
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

ownCloud's file scanner does not follow symlinks, which could lead to 
infinite loops. To avoid this do not use soft or hard links in your ownCloud 
data directory.

.. https://github.com/owncloud/core/issues/8976

No Commas in Group Names
^^^^^^^^^^^^^^^^^^^^^^^^

Creating an ownCloud group with a comma in the group name causes ownCloud to 
treat the group as two groups.

.. https://github.com/owncloud/core/issues/10983

Hebrew File Names Too Large on Windows
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

On Windows servers Hebrew file names grow to five times their original size 
after being translated to Unicode.

.. https://github.com/owncloud/core/issues/8938

Google Drive Large Files Fail with 500 Error
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Google Drive tries to download the entire file into memory, then write it to a 
temp file, and then stream it to the client, so very large file downloads from 
Google Drive may fail with a 500 internal server error.

.. https://github.com/owncloud/core/issues/8810

Encrypting Large Numbers of Files
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When you activate the Encryption app on a running server that has large numbers 
of files, it is possible that you will experience timeouts. It is best to 
activate encryption at installation, before accumulating large numbers of files 
on your ownCloud server.

.. https://github.com/owncloud/core/issues/10657


Enterprise 8.0 Only
-------------------

Sharepoint Drive SSL Not Verified
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The SharePoint Drive app does not verify the SSL certificate of the SharePoint 
server or the ownCloud server, as it is expected that both devices are in the 
same trusted environment.

No Federated Cloud Sharing with Shibboleth
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Federated Cloud Sharing (formerly Server-to-Server file sharing)does not work 
with Shibboleth .

.. https://github.com/owncloud/user_shibboleth/issues/28

Direct Uploads to SWIFT do not Appear in ownCloud
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When files are uploaded directly to a SWIFT share mounted as external storage 
in ownCloud, the files do not appear in ownCloud. However, files uploaded to 
the SWIFT mount through ownCloud are listed correctly in both locations.

.. https://github.com/owncloud/core/issues/8633

SWIFT Objectstore Incompatible with Encryption App
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The current SWIFT implementation is incompatible with any app that uses direct 
file I/O and circumvents the ownCloud virtual filesystem. Using the Encryption 
app on a SWIFT object store incurs twice as many HTTP requests and increases 
latency significantly.

.. https://github.com/owncloud/core/issues/10900

App Store is Back
^^^^^^^^^^^^^^^^^

The ownCloud App Store has been re-enabled in oC 8. Note that third-party apps 
are not supported.

ownCloud 7 Release Notes
------------------------

Manual LDAP Port Configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When you are configuring the LDAP user and group backend application, ownCloud 
may not auto-detect the LDAP server's port number, so you will need to enter it 
manually.

.. https://github.com/owncloud/core/pull/16748

LDAP Search Performance Improved
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Prior to 7.0.4, LDAP searches were substring-based and would match search 
attributes if the substring occurred anywhere in the attribute value. Rather, 
searches are performed on beginning attributes. With 7.0.4, searches will match 
at the beginning of the attribute value only. This provides better performance 
and a better user experience.

Substring searches can still be performed by prepending the search term with 
"*".For example, a search for ``te`` will find Terri, but not Nate::
 
 occ ldap:search "te"

If you want to broaden the search to include 
Nate, then search for ``*te``::

 occ ldap:search "*te"

Refine searches by adjusting the ``User Search Attributes`` field of the 
Advanced tab in your LDAP configuration on the Admin page. For example, if your 
search attributes are ``givenName`` and ``sn`` you can find users by first name 
+ last name very quickly. For example, you'll find Terri Hanson by searching for 
``te ha``. Trailing whitespaces are ignored.

.. https://github.com/owncloud/core/issues/12647

Protecting ownCloud on IIS from Data Loss
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Under certain circumstances, running your ownCloud server on IIS could be at 
risk of data loss. To prevent this, follow these steps.

In your ownCloud server configuration file, ``owncloud\config\config.php``, set 
``config_is_read_only`` to true.
    
Set the ``config.php`` file to read-only.
    
When you make server updates ``config.php`` must be made writeable. When your 
updates are completed re-set it to read-only.

Antivirus App Modes
^^^^^^^^^^^^^^^^^^^

The Antivirus App offers three modes for running the ClamAV anti-virus scanner: 
as a daemon on the ownCloud server, a daemon on a remote server, or an 
executable mode that calls ``clamscan`` on the local server. We recommend using 
one of the daemon modes, as they are the most reliable.

"Enable Only for Specific Groups" Fails
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Some ownCloud applications have the option to be enabled only for certain 
groups. However, when you select specific groups they do not get access to the 
app.

Changes to File Previews
^^^^^^^^^^^^^^^^^^^^^^^^

For security and performance reasons, file previews are available only for 
image files, covers of MP3 files, and text files, and have been disabled for 
all other filetypes. Files without previews are represented by generic icons 
according to their file types. 

4GB Limit on SFTP Transfers
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Because of limitations in ``phpseclib``, you cannot upload files larger than 
4GB over SFTP.

"Not Enough Space Available" on File Upload
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Setting user quotas to ``unlimited`` on an ownCloud installation that has 
unreliable free disk space reporting-- for example, on a shared hosting 
provider-- may cause file uploads to fail with a "Not Enough Space Available" 
error. A workaround is to set file quotas for all users instead of 
``unlimited``.

No More Expiration Date On Local Shares
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In older versions of ownCloud, you could set an expiration date on both local 
and public shares. Now you can set an expiration date only on public shares, 
and 
local shares do not expire when public shares expire.

Zero Quota Not Read-Only
^^^^^^^^^^^^^^^^^^^^^^^^

Setting a user's storage quota should be the equivalent of read-only, however, 
users can 
still create empty files.

Enterprise 7 Only
-----------------

No Federated Cloud Sharing with Shibboleth
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Federated Cloud Sharing (formerly Server-to-Server file sharing) does not work 
with Shibboleth .

Windows Network Drive
^^^^^^^^^^^^^^^^^^^^^
Windows Network Drive runs only on Linux servers because it requires the Samba 
client, which is included in all Linux distributions. 

``php5-libsmbclient`` is also required, and there may be issues with older 
versions of ``libsmbclient``; see Using External Storage > Installing and 
Configuring the Windows Network Drive App in the Enterprise Admin manual for 
more information. 

By default CentOS has activated SELinux, and the ``httpd`` process can not make 
outgoing network connections. This will cause problems with curl, ldap and samba 
libraries. Again, see Using External Storage > Installing and Configuring the 
Windows Network Drive App in the Enterprise Admin manual for instructions.

Sharepoint Drive SSL
^^^^^^^^^^^^^^^^^^^^

The SharePoint Drive app does not verify the SSL certificate of the SharePoint 
server or the ownCloud server, as it is expected that both devices are in the 
same trusted environment.

Shibboleth and WebDAV Incompatible
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Shibboleth and standard WebDAV are incompatible, and cannot be used together in 
ownCloud. If Shibboleth is enabled, the ownCloud client uses an extended WebDAV 
protocol

No SQLite
^^^^^^^^^

SQLite is no longer an installation option for ownCloud Enterprise Edition, as 
it not suitable for multiple-user installations or managing large numbers of 
files.

No App Store
^^^^^^^^^^^^

The App Store is disabled for the Enterprise Edition.

LDAP Home Connector Linux Only
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The LDAP Home Connector application requires Linux (with MySQL, MariaDB, 
or PostgreSQL) to operate correctly.
