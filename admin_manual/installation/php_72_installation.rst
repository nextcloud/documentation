=========================================
Installing PHP 7.2 on RHEL 7 and CentOS 7
=========================================

PHP 5.4 has been end-of-life since September 2015 and is no longer supported by the PHP team. RHEL 7 still ships with PHP 5.4, and Red Hat supports it. However, seeing as PHP 7.0 has also now reached EOL, and from Nextcloud 14 onwards the Nextcloud team suggests using PHP 7.1+, it is strongly advised to upgrade your PHP version to 7.2.

RHEL 7 Upgrade to PHP 7.2
-------------------------

To upgrade to PHP 7.2, you must use the Software Collections (SCL) repository to be in compliance with your RHEL support contract, and not any other third-party repository. Follow these steps to install PHP 7.2 from SCL. First you must use your Subscription Manager to enable SCL::

 subscription-manager repos --enable rhel-server-rhscl-7-eus-rpms
 
Then install PHP 7.2 and these modules::

 yum install rh-php72 rh-php72-php rh-php72-php-gd rh-php72-php-mbstring rh-php72-php-intl rh-php72-php-pecl-apcu

You must also install the updated database module for your database. This installs the new PHP 7.2 module for MySQL/MariaDB:: 

 yum install rh-php72-php-mysqlnd

If you are using the Nextcloud LDAP app, you need this module::

 yum install rh-php72-php-ldap

Disable loading the old PHP Apache modules by changing their names, for example::

 mv /etc/httpd/conf.d/php.conf /etc/httpd/conf.d/php54.off
 mv /etc/httpd/conf.modules.d/10-php.conf /etc/httpd/conf.modules.d/10-php54.off

Note: change your version number in the above command to correspond to the current php
version installed, for example "php70.off"

Symlink the PHP 7.2 Apache modules into place::

 ln -s /opt/rh/httpd24/root/etc/httpd/conf.d/rh-php72-php.conf /etc/httpd/conf.d/
 ln -s /opt/rh/httpd24/root/etc/httpd/conf.modules.d/15-rh-php72-php.conf /etc/httpd/conf.modules.d/
 ln -s /opt/rh/httpd24/root/etc/httpd/modules/librh-php72-php7.so /etc/httpd/modules/

Then restart Apache::

 systemctl restart httpd.service

Verify with ``phpinfo`` that your Apache server is using PHP 7.2 and loading the 
correct modules; see :ref:`label-phpinfo` to learn how to use ``phpinfo``.

If there is no requirement for your old PHP installation, you can remove it::

 yum remove php*
 rm /etc/httpd/conf.modules.d/10-php54.off /etc/httpd/conf.d/php54.off 

After uninstalling, you can symlink the PHP 7.2 binary to use the short path (e.g. for cron)::

 ln -s /opt/rh/rh-php72/root/usr/bin/php /usr/bin/php

Any changes to the configuration of the previous used php installation don't apply to the new installation. Required changes for the new installation can be configured here::

 /etc/opt/rh/rh-php72/


CentOS 7 Upgrade to PHP 7.2
---------------------------

To upgrade to PHP 7.2, use the Red Hat Software Collections (SCL) repository.

Follow these steps to install PHP 7.2 from SCL. First install the SCL repository::

 yum install centos-release-scl

Then install PHP 7.2 and these modules::

 yum install rh-php72 rh-php72-php rh-php72-php-gd rh-php72-php-mbstring rh-php72-php-intl rh-php72-php-pecl-apcu

You must also install the updated database module for your database. This installs the new PHP 7.2 module for MySQL/MariaDB:: 

 yum install rh-php72-php-mysqlnd

If you are using the Nextcloud LDAP app, you need this module::

 yum install rh-php72-php-ldap

Disable loading the old PHP Apache modules by changing their names, for example::

 mv /etc/httpd/conf.d/php.conf /etc/httpd/conf.d/php54.off
 mv /etc/httpd/conf.modules.d/10-php.conf /etc/httpd/conf.modules.d/10-php54.off

Note: change your version number in the above command to correspond to the current php
version installed, for example "php70.off"

Symlink the PHP 7.2 Apache modules into place::

 ln -s /opt/rh/httpd24/root/etc/httpd/conf.d/rh-php72-php.conf /etc/httpd/conf.d/
 ln -s /opt/rh/httpd24/root/etc/httpd/conf.modules.d/15-rh-php72-php.conf /etc/httpd/conf.modules.d/
 ln -s /opt/rh/httpd24/root/etc/httpd/modules/librh-php72-php7.so /etc/httpd/modules/

Then restart Apache::

 systemctl restart httpd.service

Verify with ``phpinfo`` that your Apache server is using PHP 7.2 and loading the 
correct modules; see :ref:`label-phpinfo` to learn how to use ``phpinfo``.

If there is no requirement for your old PHP installation, you can remove it::

 yum remove php*
 rm /etc/httpd/conf.modules.d/10-php54.off /etc/httpd/conf.d/php54.off 

After uninstalling, you can symlink the PHP 7.2 binary to use the short path (e.g. for cron)::

 ln -s /opt/rh/rh-php72/root/usr/bin/php /usr/bin/php

Any changes to the configuration of the previous used php installation don't apply to the new installation. Required changes for the new installation can be configured here::

 /etc/opt/rh/rh-php72/
