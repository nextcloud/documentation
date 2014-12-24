Installation Wizard
===================

When ownCloud prerequisites are fulfilled and all ownCloud files are installed
on the server, the last step to complete the installation is
running the Installation Wizard.

* Open your web browser
* Navigate to your ownCloud instance.

  * If you are installing ownCloud on the same machine as you are accessing the
    install wizard from, the URL will be ``http://localhost/owncloud``, or ``https://localhost/owncloud`` if you have enabled SSL.
  * If you are installing ownCloud on a different machine, you'll have to access
    it by its hostname or IP address, e.g. ``http://example.com/owncloud``.
  * If you are using a self-signed certificate, you will be presented with a
    security warning about the issuer of the certificate not being trusted which
    you can ignore.

* You will be presented with the setup screen:

.. image:: images/install-wizard.png
   :scale: 75%

Required Settings
~~~~~~~~~~~~~~~~~

Under ``create an admin account`` you must enter a username and
password for the administrative user account. You may choose any username and
password that you want.

Storage & Database
~~~~~~~~~~~~~~~~~~

* Click ``Storage & Database`` to see all of your database options, and to optionally change the default data storage directory.

* The database you want to use must already be installed, and you must have a database admin user and password.

* Enter any arbitrary name for the Database name. This must be a database that does not already exist.

* If you are not using Apache as the web server, it is highly
  recommended to configure the data directory to a location outside of
  the document root. Otherwise all user data is potentially publicly
  visible!

.. image:: images/install-wizard-advanced.png
   :scale: 75%

Database Choice
~~~~~~~~~~~~~~~

* For a guideline on which database system to choose, and on pointers how to
  set them up for being available for PHP/ownCloud, see
  :doc:`../configuration/database_configuration`

* Note that you will only be able to choose among the PHP database connectors
  which are actually installed on the system.

* It is not easily possible to migrate to another database system once you have
  set up your ownCloud to use a specific one. So make sure to carefully
  consider which database system to use.

* When using MySQL/MariaDB or PostgreSQL you have two options regarding the database
  name and user account you specify:

  * You can specify either an admin or the root user, and the name of a database
    which does not yet exist. This lets ownCloud create its own database; it
    will also create a database user account with restricted rights (with the
    same username as you specified for the administrative user, plus an
    ``oc_`` prefix) and will use that for all subsequent database access.

  * There are restrictions as to what characters a database name
      may or may not contain, see the
      `MySQL Schema Object Names documentation`_ for details);

Finish Installation
~~~~~~~~~~~~~~~~~~~

* Once you've entered all settings, click "Finish Setup"
* ownCloud will set up your cloud according to the given settings
* When it's finished, it will log you in as administrative user and present the
  "Welcome to ownCloud" screen.

Trusted Domains
~~~~~~~~~~~~~~~

ownCloud will take the URL used to access the Installation Wizard and insert
that into the ``config.php`` file for the ``trusted_domains`` setting.
All needed domain names of the ownCloud server go into the
``trusted_domains`` setting. Users will only be able to log into ownCloud when they point their browsers to a domain name listed in the ``trusted_domains`` setting. An IPv4 address can be
specified instead of a domain name. A typical configuration looks like this::

 'trusted_domains' => 
   array (
    0 => 'localhost', 
    1 => 'server1', 
    2 => '192.168.1.50',
 ),

In the event that a load balancer is in place there will be no issues as long
as it sends the correct X-Forwarded-Host header.

The loopback address, ``127.0.0.1``, is whitelisted and
therefore users on the ownCloud server who access ownCloud with the loopback
interface will be able to successfully login.
In the event that an improper URL is used, the
following error will appear:

.. image:: images/untrusted-domain.png
   :scale: 75%
   
For configuration examples, refer to the :file:`config/config.sample.php`
document.



.. _MySQL Schema Object Names documentation: http://dev.mysql.com/doc/refman/5.5/en/identifiers.html
