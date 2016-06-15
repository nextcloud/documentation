=========================================
Installing PHP 5.5 on RHEL 7 and CentOS 7
=========================================

PHP 5.4 has been end-of-life since September 2015 and is no longer supported by the PHP team. RHEL 7 still ships with PHP 5.4, and Red Hat supports it. ownCloud also supports PHP 5.4, so upgrading is not required. However, it is highly recommended to upgrade to PHP 5.5+ for best security and performance. 

**Before upgrading, evaluate all of your PHP apps for compatibility with PHP 5.5.**

RHEL 7 Upgrade to PHP 5.5
-------------------------

To upgrade to PHP 5.5, you must use the Software Collections (SCL) repository to be in compliance with your RHEL support contract, and not any other third-party repository. Follow these steps to install PHP 5.5 from SCL. First you must use your Subscription Manager to enable SCL::

 subscription-manager repos --enable rhel-server-rhscl-7-eus-rpms
 
Then install PHP 5.5 and these modules::

 yum install php55 php55-php php55-php-gd php55-php-mbstring

You must also install the updated database module for your database. This installs the new PHP 5.5 module for MySQL/MariaDB:: 
 
 yum install php55-php-mysqlnd
 
If you are using the ownCloud LDAP app, you need this module::

 yum install php55-php-ldap
 
Disable loading the old PHP Apache modules by changing their names::

 mv /etc/httpd/conf.d/php.conf /etc/httpd/conf.d/php54.off
 mv /etc/httpd/conf.modules.d/10-php.conf /etc/httpd/conf.modules.d/10-php54.off
 
Copy the PHP 5.5 Apache modules into place::

 cp /opt/rh/httpd24/root/etc/httpd/conf.d/php55-php.conf /etc/httpd/conf.d/
 cp /opt/rh/httpd24/root/etc/httpd/conf.modules.d/10-php55-php.conf /etc/httpd/conf.modules.d/
 cp /opt/rh/httpd24/root/etc/httpd/modules/libphp55-php5.so /etc/httpd/modules/

Then restart Apache::
 
 service httpd restart

Verify with ``phpinfo`` that your Apache server is using PHP 5.5 and loading the 
correct modules; see :ref:`label-phpinfo` to learn how to use phpinfo.


CentOS 7 Upgrade to PHP 5.5
---------------------------

To upgrade to PHP 5.5, use the Red Hat Software Collections (SCL) repository.

**Before upgrading, evaluate all of your PHP apps for compatibility with PHP 5.5.**

Follow these steps to install PHP 5.5 from SCL. First install the SCL repository::

 yum install centos-release-scl
 
Then install PHP 5.5 and these modules::

 yum install php55 php55-php php55-php-gd php55-php-mbstring

You must also install the updated database module for your database. This installs the new PHP 5.5 module for MySQL/MariaDB:: 
 
 yum install php55-php-mysqlnd
 
If you are using the ownCloud LDAP app, you need this module::

 yum install php55-php-ldap 
  
Disable loading the old PHP Apache modules by changing their names::

 mv /etc/httpd/conf.d/php.conf /etc/httpd/conf.d/php54.off
 mv /etc/httpd/conf.modules.d/10-php.conf /etc/httpd/conf.modules.d/10-php54.off
 
Copy the PHP 5.5 Apache modules into place::

 cp /opt/rh/httpd24/root/etc/httpd/conf.d/php55-php.conf /etc/httpd/conf.d/
 cp /opt/rh/httpd24/root/etc/httpd/conf.modules.d/10-php55-php.conf /etc/httpd/conf.modules.d/
 cp /opt/rh/httpd24/root/etc/httpd/modules/libphp55-php5.so /etc/httpd/modules/

Then restart Apache::
 
 service httpd restart

Verify with ``phpinfo`` that your Apache server is using PHP 5.5 and loading the 
correct modules; see :ref:`label-phpinfo` to learn how to use ``phpinfo``.
