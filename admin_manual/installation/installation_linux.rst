Linux Distributions
-------------------

This section describes the installation process for different
distributions. If there are pre-made packages from ownCloud,
you are encouraged to prefer those over the vendor-provided
ones, since they usually are more up-to-date.

Archlinux
~~~~~~~~~

There are two AUR packages for ownCloud:

-  `stable version`_
-  `development version`_

openSUSE
~~~~~~~~

.. note:: ready-to-use SLES and openSUSE RPM packages are available
          in the openSUSE Build Service `ownCloud repository`_.

1. Copy ownCloud to Apache's server directory : ``/srv/www/htdocs``
2. Give the web server the necessary permissions:
   ``sudo chown -R wwwrun owncloud``

   -  If you do not use "sudo" then you have to become root and
      execute: ``chown -R wwwrun owncloud`` in the directory.
   -  (If you’re using mysql, you have to set the database character set
      to something else then utf~8, for example latin1 otherwise some
      keys will be to long for mysql)

3. Open the folder in a browser and complete the setup wizard

If have followed the steps above and want to try it out, run this
command in a terminal to start Apache if it’s not already running:

1. ``sudo /etc/init.d/apache2 start``
2. Go to ``http://servername/owncloud`` and walk through the setup.

Fedora
~~~~~~

.. note:: ready-to-use RPM packages are available
          in the openSUSE Build Service `ownCloud repository`_.

Make sure SELinux is disabled or else the installation process will fail
with the following message: ``Config file (config/config.php) is not
writable for the webserver``.

Configure Apache:

1. If you already have a website running from Document Root but would
   still like to install OwnCloud you can use a Name-based virtual host
   entry and subdomain.
2. Edit your DNS record following this example: ``point owncloud.foo.com >
   ip.ip.ip.ip``

.. todo::

CentOS 5 & 6
~~~~~~~~~~~~

.. note:: ready-to-use CentOS RPM packages are available
          in the openSUSE Build Service `ownCloud repository`_.

1. Create a new file in ``/etc/httpd/conf/`` and call it ``owncloud.conf``.
2. You can use the following as an example:

::

    <IfModule mod_alias.c>
    Alias /owncloud /var/www/owncloud/
    </IfModule>
    <Directory /var/www/owncloud/>
       Options None
       Order allow,deny
       allow from all
    </Directory>
    <VirtualHost *:80>
        ServerAdmin foo@foofarm.com
        DocumentRoot /var/www/html/owncloud
        ServerName owncloud.foo.com
        ErrorLog logs/owncloud.foo.info-error_log
        CustomLog logs/owncloud.foo.info-access_log common

    </VirtualHost>

3. Now edit your httpd.conf file which is usually located in
   ``/etc/httpd/conf/httpd.conf``
4. Add the following to the bottom:
   ``Include /etc/httpd/conf/owncloud.conf``
5. Restart apache and now when you point your browser to
   ``owncloud.foo.com`` it should properly load without disturbing *foo.com*

Gentoo
~~~~~~

Basically do everything like for a standard web server (see
above). Change permissions: ``chown -R apache:apache owncloud``\
Allow .htaccess, modify ``/etc/apache2/vhosts.d/00_default_vhost.conf`` and
make sure this is in

::

    <Directory /var/www/localhost/htdocs/owncloud>
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
        Order allow,deny
        allow from all
    </Directory>

PCLinuxOS
~~~~~~~~~

Follow the Tutorial `ownCloud, installation and setup`_ on the PCLinuxOS web site.

Ubuntu / Debian
~~~~~~~~~~~~~~~
Go to the `linux package sources`_ page and execute the steps as described there
for your distribution.


.. _stable version: http://aur.archlinux.org/packages.php?ID=47585
.. _development version: http://aur.archlinux.org/packages.php?ID=38767
.. _ownCloud repository: http://software.opensuse.org/search?q=owncloud&baseproject=ALL&lang=de
.. _ownCloud, installation and setup: http://pclinuxoshelp.com/index.php/Owncloud,_installation_and_setup
.. _linux package sources: http://software.opensuse.org/download.html?project=isv:ownCloud:community&package=owncloud
