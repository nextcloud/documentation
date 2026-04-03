.. _label-php56installation:

=============================================
Installing PHP 5.6 on RHEL 6/7 and CentOS 6/7
=============================================

Red Hat Enterprise Linux and CentOS 6 still ship with PHP 5.3. Nextcloud 
requires PHP 5.6 or better. There are several third-party repositories that 
supply PHP 5.6, but you must use the Software Collections (SCL) repository to 
be in compliance with your RHEL support contract, and not any other third-party 
repository.

RHEL 6
------

Follow these steps to install PHP 5.6 from SCL. First you must use 
your Subscription Manager to enable SCL in RHEL 6::

 subscription-manager repos --enable rhel-server-rhscl-6-eus-rpms

For RHEL 7::

 subscription-manager repos --enable rhel-server-rhscl-7-eus-rpms
 
Then install PHP 5.6 and these modules::

 yum install rh-php56 rh-php56-php rh-php56-php-gd rh-php56-php-mbstring

You must also install the updated database module for your database. This 
installs the new PHP 5.6 module for MySQL/MariaDB:: 
 
 yum install rh-php56-php-mysqlnd
 
If you are using the Nextcloud LDAP app, you need this module::

 yum install rh-php56-php-ldap
 
Disable loading the old PHP 5.3 Apache module:: 

 mv /etc/httpd/conf.d/php.conf /etc/httpd/conf.d/php53.off
 
Copy the PHP 5.6 Apache modules into place::

 cp /opt/rh/httpd24/root/etc/httpd/conf.d/rh-php56-php.conf /etc/httpd/conf.d/
 cp /opt/rh/httpd24/root/etc/httpd/conf.modules.d/10-rh-php56-php.conf /etc/httpd/conf.modules.d/
 cp /opt/rh/httpd24/root/etc/httpd/modules/librh-php56-php5.so /etc/httpd/modules/

Then restart Apache::
 
 service httpd restart

Verify with :ref:`label-phpinfo` that your Apache server is using PHP 5.6 and loading 
the correct modules.

CentOS 6/7
----------

First install the SCL repo::

 yum install centos-release-scl
 
Then install PHP 5.6 and these modules:: 

 yum install rh-php56 rh-php56-php rh-php56-php-gd rh-php56-php-mbstring
 
You must also install the updated database module for your database. This 
installs the new PHP 5.6 module for MySQL/MariaDB:: 
 
 yum install rh-php56-php-mysqlnd
 
If you are using the Nextcloud LDAP app, you need this module::

 yum install rh-php56-php-ldap
 
Disable loading the old PHP 5.3 Apache module:: 

 mv /etc/httpd/conf.d/php.conf /etc/httpd/conf.d/php53.off
 
Copy the PHP 5.6 Apache modules into place::

 cp /opt/rh/httpd24/root/etc/httpd/conf.d/rh-php56-php.conf /etc/httpd/conf.d/
 cp /opt/rh/httpd24/root/etc/httpd/conf.modules.d/10-rh-php56-php.conf /etc/httpd/conf.modules.d/
 cp /opt/rh/httpd24/root/etc/httpd/modules/librh-php56-php5.so /etc/httpd/modules/

Finally, restart Apache::
 
 service httpd restart

Verify with :ref:`label-phpinfo` that your Apache server is using PHP 5.6 and loading 
the correct modules.
