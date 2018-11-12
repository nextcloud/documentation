=========================================
Installing PHP 7.0 on RHEL 7 and CentOS 7
=========================================

PHP 5.4 has been end-of-life since September 2015 and is no longer supported by the PHP team. RHEL 7 still ships with PHP 5.4, and Red Hat supports it. Nextcloud 14+ requires PHP 7.0 or newer, so upgrading to 7.0 is required.

RHEL 7 Upgrade to PHP 7.0
-------------------------

To upgrade to PHP 7.0, you must use the Software Collections (SCL) repository to be in compliance with your RHEL support contract, and not any other third-party repository. Follow these steps to install PHP 7.0 from SCL. First you must use your Subscription Manager to enable SCL::

 subscription-manager repos --enable rhel-server-rhscl-7-eus-rpms
 
Then install PHP 7.0 and these modules::

 yum install rh-php70 rh-php70-php rh-php70-php-gd rh-php70-php-mbstring

You must also install the updated database module for your database. This installs the new PHP 7.0 module for MySQL/MariaDB:: 
 
 yum install rh-php70-php-mysqlnd
 
If you are using the Nextcloud LDAP app, you need this module::

 yum install rh-php70-php-ldap
 
Disable loading the old PHP Apache modules by changing their names::

 mv /etc/httpd/conf.d/php.conf /etc/httpd/conf.d/php54.off
 mv /etc/httpd/conf.modules.d/10-php.conf /etc/httpd/conf.modules.d/10-php54.off
 
Symlink the PHP 7.0 Apache modules into place::

 ln -s /opt/rh/httpd24/root/etc/httpd/conf.d/rh-php70-php.conf /etc/httpd/conf.d/
 ln -s /opt/rh/httpd24/root/etc/httpd/conf.modules.d/15-rh-php70-php.conf /etc/httpd/conf.modules.d/
 ln -s /opt/rh/httpd24/root/etc/httpd/modules/librh-php70-php7.so /etc/httpd/modules/

Then restart Apache::
 
 service httpd restart

Verify with ``phpinfo`` that your Apache server is using PHP 7.0 and loading the 
correct modules; see :ref:`label-phpinfo` to learn how to use phpinfo.


CentOS 7 Upgrade to PHP 7.0
---------------------------

To upgrade to PHP 7.0, use the Red Hat Software Collections (SCL) repository.

Follow these steps to install PHP 7.0 from SCL. First install the SCL repository::

 yum install centos-release-scl
 
Then install PHP 7.0 and these modules::

 yum install rh-php70 rh-php70-php rh-php70-php-gd rh-php70-php-mbstring

You must also install the updated database module for your database. This installs the new PHP 7.0 module for MySQL/MariaDB:: 
 
 yum install rh-php70-php-mysqlnd
 
If you are using the Nextcloud LDAP app, you need this module::

 yum install rh-php70-php-ldap 
  
Disable loading the old PHP Apache modules by changing their names::

 mv /etc/httpd/conf.d/php.conf /etc/httpd/conf.d/php54.off
 mv /etc/httpd/conf.modules.d/10-php.conf /etc/httpd/conf.modules.d/10-php54.off
 
Symlink the PHP 7.0 Apache modules into place::

 ln -s /opt/rh/httpd24/root/etc/httpd/conf.d/rh-php70-php.conf /etc/httpd/conf.d/
 ln -s /opt/rh/httpd24/root/etc/httpd/conf.modules.d/15-rh-php70-php.conf /etc/httpd/conf.modules.d/
 ln -s /opt/rh/httpd24/root/etc/httpd/modules/librh-php70-php7.so /etc/httpd/modules/

Then restart Apache::
 
 service httpd restart

Verify with ``phpinfo`` that your Apache server is using PHP 7.0 and loading the 
correct modules; see :ref:`label-phpinfo` to learn how to use ``phpinfo``.
