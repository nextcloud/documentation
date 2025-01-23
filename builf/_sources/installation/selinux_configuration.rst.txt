.. _selinux-config-label:

=====================
SELinux configuration
=====================

When you have SELinux enabled on your Linux distribution, you may run into
permissions problems after a new Nextcloud installation, and see ``permission
denied`` errors in your Nextcloud logs.

The following settings should work for most SELinux systems that use the
default distro profiles. Run these commands as root, and remember to adjust the filepaths
in these examples for your installation::

 semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud/data(/.*)?'
 semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud/config(/.*)?'
 semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud/apps(/.*)?'
 semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud/.htaccess'
 semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud/.user.ini'
 semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud/3rdparty/aws/aws-sdk-php/src/data/logs(/.*)?'

 restorecon -Rv '/var/www/html/nextcloud/'

If you uninstall Nextcloud you need to remove the Nextcloud directory labels. To do
this execute the following commands as root after uninstalling Nextcloud::

 semanage fcontext -d '/var/www/html/nextcloud/data(/.*)?'
 semanage fcontext -d '/var/www/html/nextcloud/config(/.*)?'
 semanage fcontext -d '/var/www/html/nextcloud/apps(/.*)?'
 semanage fcontext -d '/var/www/html/nextcloud/.htaccess'
 semanage fcontext -d '/var/www/html/nextcloud/.user.ini'
 semanage fcontext -d '/var/www/html/nextcloud/3rdparty/aws/aws-sdk-php/src/data/logs(/.*)?'

 restorecon -Rv '/var/www/html/nextcloud/'

If you have customized SELinux policies and these examples do not work, you must give the
HTTP server write access to these directories::

 /var/www/html/nextcloud/data
 /var/www/html/nextcloud/config
 /var/www/html/nextcloud/apps

Enable updates via the web interface
------------------------------------

To enable updates via the web interface, you may need this to enable writing to the directories::

 setsebool httpd_unified on

When the update is completed, disable write access::

 setsebool -P  httpd_unified  off

Disallow write access to the whole web directory
------------------------------------------------

For security reasons it's suggested to disable write access to all folders in /var/www/ (default)::

 setsebool -P  httpd_unified  off

Allow access to a remote database
---------------------------------

An additional setting is needed if your installation is connecting to a remote database::

 setsebool -P httpd_can_network_connect_db on

Allow access to LDAP server
---------------------------

Use this setting to allow LDAP connections::

 setsebool -P httpd_can_connect_ldap on

Allow access to remote network
------------------------------

Nextcloud requires access to remote networks for functions such as Server-to-Server sharing, external storages or
the app store. To allow this access use the following setting::

 setsebool -P httpd_can_network_connect on

Allow access to network memcache
--------------------------------

This setting is not required if ``httpd_can_network_connect`` is already on::

 setsebool -P httpd_can_network_memcache on

Allow access to SMTP/sendmail
-----------------------------

If you want to allow Nextcloud to send out e-mail notifications via sendmail you need
to use the following setting::

 setsebool -P httpd_can_sendmail on

Allow access to CIFS/SMB
------------------------

If you have placed your datadir on a CIFS/SMB share use the following setting::

 setsebool -P httpd_use_cifs on

Allow access to FuseFS
----------------------

If your data folder resides on a Fuse Filesystem (e.g. EncFS etc), this setting is required as well::

 setsebool -P httpd_use_fusefs on

Allow access to GPG for Rainloop
--------------------------------

If you use a the rainloop webmail client app which supports GPG/PGP, you might need this::

 setsebool -P httpd_use_gpg on

Troubleshooting
---------------

For general Troubleshooting of SELinux and its profiles try to install the
package ``setroubleshoot`` and run::

 sealert -a /var/log/audit/audit.log > /path/to/mylogfile.txt

to get a report which helps you configuring your SELinux profiles.

Another tool for troubleshooting is to enable a single ruleset for your
Nextcloud directory::

 semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud(/.*)?'
 restorecon -RF /var/www/html/nextcloud

It is much stronger security to have a more fine-grained ruleset as in the
examples at the beginning, so use this only for testing and troubleshooting. It
has a similar effect to disabling SELinux, so don't use it on production
systems.
