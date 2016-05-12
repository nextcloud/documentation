===================
Installation Wizard
===================

Quick Start
-----------

When ownCloud prerequisites are fulfilled and all ownCloud files are installed, 
the last step to completing the installation is running the Installation 
Wizard. 
This is just three steps:

#. Point your Web browser to ``http://localhost/owncloud``
#. Enter your desired administrator's username and password.
#. Click **Finish Setup**.

.. figure:: images/install-wizard-a.png
   :scale: 75%
   :alt: screenshot of the installation wizard   
   
You're finished and can start using your new ownCloud server.   

Of course, there is much more that you can do to set up your ownCloud server for 
best performance and security. In the following sections we will cover important 
installation and post-installation steps. Note that you must follow the 
instructions in :ref:`Setting Strong Permissions <strong_perms_label>` in order 
to use the :doc:`occ Command <../configuration_server/occ_command>`.

* :ref:`Data Directory Location <data_directory_location_label>`
* :ref:`Database Choice <database_choice_label>`
* :ref:`Trusted Domains <trusted_domains_label>`
* :ref:`Setting Strong Permissions <strong_perms_label>`

.. _data_directory_location_label:

Data Directory Location
-----------------------

Click **Storage and Database** to expose additional installation configuration 
options for your ownCloud data directory and database.

.. figure:: images/install-wizard-a1.png
   :scale: 75%
   :alt: installation wizard with all options exposed

You should locate your ownCloud data directory outside of your Web root if you 
are using an HTTP server other than Apache, or you may wish to store your 
ownCloud data in a different location for other reasons (e.g. on a storage 
server). It is best to configure your data directory location at installation, 
as it is difficult to move after installation. You may put it anywhere; in this 
example is it located in ``/var/oc_data``. This directory must already exist, 
and must be owned by your HTTP user (see 
:ref:`strong_perms_label`).

.. _database_choice_label:

Database Choice
---------------

SQLite is the default database for ownCloud Server (it is not available and not supported
in the ownCloud Enterprise edition), and it is good only for testing and lightweight single-user
setups without client synchronization. Supported databases are MySQL, MariaDB,
Oracle 11g (ownCloud Enterprise edition only), and PostgreSQL, and we recommend
:doc:`MySQL/MariaDB <system_requirements>`. Your database and PHP connectors 
must be installed before you run the Installation Wizard. When you install 
ownCloud from packages all the necessary dependencies will be satisfied (see 
:doc:`source_installation` for a detailed listing of required and optional PHP 
modules). You will need the root database login, or any administrator login that 
has permissions to create and modify databases, and then enter any name you want 
for your ownCloud database.

After you enter your root or administrator login for your database, the 
installer creates a special database user with privileges limited to the 
ownCloud database. Then ownCloud needs only the special ownCloud database 
user, and drops the root dB login. This user is named for your ownCloud admin 
user, with an ``oc_`` prefix, and then given a random password. The ownCloud 
database user and password are written into ``config.php``::

  'dbuser' => 'oc_molly',
  'dbpassword' => 'pX65Ty5DrHQkYPE5HRsDvyFHlZZHcm',  

Click Finish Setup, and start using your new ownCloud server. 

.. figure:: images/install-wizard-a2.png
   :scale: 75%
   :alt: ownCloud welcome screen after a successful installation

Now we will look at some important post-installation steps.

.. _trusted_domains_label: 

Trusted Domains
---------------

All URLs used to access your ownCloud server must be whitelisted in your 
``config.php`` file, under the ``trusted_domains`` setting. Users 
are allowed to log into ownCloud only when they point their browsers to a 
URL that is listed in the ``trusted_domains`` setting. You may use IP addresses 
and domain names. A typical configuration looks like this::

 'trusted_domains' => 
   array (
    0 => 'localhost', 
    1 => 'server1.example.com', 
    2 => '192.168.1.50',
 ),

The loopback address, ``127.0.0.1``, is automatically whitelisted, so as long 
as you have access to the physical server you can always log in. In the event 
that a load balancer is in place there will be no issues as long as it sends 
the correct X-Forwarded-Host header. When a user tries a URL that 
is not whitelisted the following error appears:

.. figure:: images/install-wizard-a4.png
   :scale: 75%
   :alt: Error message when URL is not whitelisted
  
.. _strong_perms_label:
 
Setting Strong Directory Permissions
------------------------------------

For hardened security we recommend setting the permissions on your ownCloud 
directories as strictly as possible, and for proper server operations. This 
should be done immediately after the initial installation and before running the 
setup. Your HTTP user must own the ``config/``, ``data/`` and ``apps/`` directories 
so that you can configure ownCloud, create, modify and delete your data files, 
and install apps via the ownCloud Web interface. 

You can find your HTTP user in your HTTP server configuration files. Or you can 
use :ref:`label-phpinfo` (Look for the **User/Group** line).

* The HTTP user and group in Debian/Ubuntu is ``www-data``.
* The HTTP user and group in Fedora/CentOS is ``apache``.
* The HTTP user and group in Arch Linux is ``http``.
* The HTTP user in openSUSE is ``wwwrun``, and the HTTP group is ``www``.

.. note:: When using an NFS mount for the data directory, do not change its 
   ownership from the default. The simple act of mounting the drive will set 
   proper permissions for ownCloud to write to the directory. Changing 
   ownership as above could result in some issues if the NFS mount is 
   lost.

The easy way to set the correct permissions is to copy and run this script. 
Replace the ``ocpath`` variable with the path to your ownCloud directory, and 
replace the ``htuser`` and ``htgroup`` variables with your HTTP user and group::

 #!/bin/bash
 ocpath='/var/www/owncloud'
 htuser='www-data'
 htgroup='www-data'
 rootuser='root'

 printf "Creating possible missing Directories\n"
 mkdir -p $ocpath/data
 mkdir -p $ocpath/assets
 mkdir -p $ocpath/updater

 printf "chmod Files and Directories\n"
 find ${ocpath}/ -type f -print0 | xargs -0 chmod 0640
 find ${ocpath}/ -type d -print0 | xargs -0 chmod 0750

 printf "chown Directories\n"
 chown -R ${rootuser}:${htgroup} ${ocpath}/
 chown -R ${htuser}:${htgroup} ${ocpath}/apps/
 chown -R ${htuser}:${htgroup} ${ocpath}/assets/
 chown -R ${htuser}:${htgroup} ${ocpath}/config/
 chown -R ${htuser}:${htgroup} ${ocpath}/data/
 chown -R ${htuser}:${htgroup} ${ocpath}/themes/
 chown -R ${htuser}:${htgroup} ${ocpath}/updater/

 chmod +x ${ocpath}/occ

 printf "chmod/chown .htaccess\n"
 if [ -f ${ocpath}/.htaccess ]
  then
   chmod 0644 ${ocpath}/.htaccess
   chown ${rootuser}:${htgroup} ${ocpath}/.htaccess
 fi
 if [ -f ${ocpath}/data/.htaccess ]
  then
   chmod 0644 ${ocpath}/data/.htaccess
   chown ${rootuser}:${htgroup} ${ocpath}/data/.htaccess
 fi
 
If you have customized your ownCloud installation and your filepaths are 
different than the standard installation, then modify this script accordingly. 

This lists the recommended modes and ownership for your ownCloud directories 
and files:

* All files should be read-write for the file owner, read-only for the 
  group owner, and zero for the world
* All directories should be executable (because directories always need the 
  executable bit set), read-write for the directory owner, and read-only for 
  the group owner
* The :file:`apps/` directory should be owned by ``[HTTP user]:[HTTP group]``
* The :file:`config/` directory should be owned by ``[HTTP user]:[HTTP group]``
* The :file:`themes/` directory should be owned by ``[HTTP user]:[HTTP group]``
* The :file:`assets/` directory should be owned by ``[HTTP user]:[HTTP group]``
* The :file:`data/` directory should be owned by ``[HTTP user]:[HTTP group]``
* The :file:`[ocpath]/.htaccess` file should be owned by ``root:[HTTP group]``
* The :file:`data/.htaccess` file should be owned by ``root:[HTTP group]``
* Both :file:`.htaccess` files are read-write file owner, read-only group and 
  world

These strong permissions prevent upgrading your ownCloud server; 
see :ref:`set_updating_permissions_label` for a script to quickly change 
permissions to allow upgrading.
