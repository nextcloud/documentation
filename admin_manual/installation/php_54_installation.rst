=========================================
Installing PHP 5.4 on RHEL 6 and CentOS 6
=========================================

Red Hat Enterprise Linux and CentOS 6 still ship with PHP 5.3. ownCloud 
requires PHP 5.4 or better. There are several third-party repositories that 
supply PHP 5.4, but you must use the Software Collections (SCL) repository to 
be in compliance with your RHEL support contract, and not any other third-party 
repository.

RHEL 6
------

Follow these steps to install PHP 5.4 from SCL. First you must use 
your Subscription Manager to enable SCL::

 subscription-manager repos --enable rhel-server-rhscl-6-eus-rpms
 
Then install PHP 5.4 and these modules::

 yum install php54 php54-php php54-php-gd php54-php-mbstring

You must also install the updated database module for your database. This 
example installs the new PHP 5.4 module for MySQL/MariaDB:: 
 
 yum install php54-php-mysqlnd
 
Disable loading the old PHP 5.3 Apache module:: 

 mv /etc/httpd/conf.d/php.conf /etc/httpd/conf.d/php53.off
 
You should now have a /etc/httpd/conf.d/php54-php.conf file, which loads the 
correct PHP 5.4 module for Apache.

Then restart Apache::
 
 service httpd restart

Verify with :ref:`label-phpinfo` that your Apache server is using PHP 5.4 and loading 
the correct modules.

CentOS 6
--------

First install the SCL repo::

 yum install centos-release-SCL
 
Then install PHP 5.4 and these modules:: 

 yum install php54 php54-php php54-php-gd php54-php-mbstring
 
You must also install the updated database module. This installs the new PHP 5.4 
module for MySQL/MariaDB:: 
 
 yum install php54-php-mysqlnd
 
Disable loading the old PHP 5.3 Apache module:: 

 mv /etc/httpd/conf.d/php.conf /etc/httpd/conf.d/php53.off
 
You should now have a /etc/httpd/conf.d/php54-php.conf file, which loads the 
correct PHP 5.4 module for Apache.

Finally, restart Apache::
 
 service httpd restart

Verify with :ref:`label-phpinfo` that your Apache server is using PHP 5.4 and loading 
the correct modules.
