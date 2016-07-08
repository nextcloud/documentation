.. _selinux-config-label:

=====================
SELinux Configuration
=====================

When you have SELinux enabled on your Linux distribution, you may run into 
permissions problems after a new Nextcloud installation, and see ``permission 
denied`` errors in your Nextcloud logs. 

The following settings should work for most SELinux systems that use the 
default distro profiles. Run these commands as root, and remember to adjust the filepaths 
in these examples for your installation::

 semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud/data(/.*)?'
 restorecon -v -R '/var/www/html/nextcloud/data'
 semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud/config(/.*)?'
 restorecon -v -R '/var/www/html/nextcloud/config'
 semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/nextcloud/apps(/.*)?'
 restorecon -v -R '/var/www/html/nextcloud/apps'
 
If you uninstall Nextcloud you need to remove the Nextcloud directory labels. To do 
this execute the following commands as root after uninstalling Nextcloud::

 semanage fcontext -d -t httpd_sys_rw_content_t '/var/www/html/nextcloud/data(/.*)?'
 restorecon -v -R '/var/www/html/nextcloud/data'
 semanage fcontext -d -t httpd_sys_rw_content_t '/var/www/html/nextcloud/config(/.*)?'
 restorecon -v -R '/var/www/html/nextcloud/config'
 semanage fcontext -d -t httpd_sys_rw_content_t '/var/www/html/nextcloud/apps(/.*)?'
 restorecon -v -R '/var/www/html/nextcloud/apps'

If you have customized SELinux policies and these examples do not work, you must give the 
HTTP server write access to these directories::

 /var/www/html/nextcloud/data
 /var/www/html/nextcloud/config
 /var/www/html/nextcloud/apps

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

Allow access to SMTP/sendmail
-----------------------------

If you want to allow Nextcloud to send out e-mail notifications via sendmail you need
to use the following setting::

 setsebool -P httpd_can_sendmail on

Allow access to CIFS/SMB
------------------------

If you have placed your datadir on a CIFS/SMB share use the following setting::

 setsebool -P httpd_use_cifs on

Troubleshooting
---------------

For general Troubleshooting of SELinux and its profiles try to install the package ``setroubleshoot`` and run::

 sealert -a /var/log/audit/audit.log > /path/to/mylogfile.txt

to get a report which helps you configuring your SELinux profiles.
