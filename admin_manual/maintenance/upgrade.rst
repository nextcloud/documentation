==============================
Upgrading Your ownCloud Server
==============================

Updating and upgrading your ownCloud installation are two different tasks. 
Updating means updating to the next point release, which is indicated 
by the third digit of the version number. For example, 7.0.4 and 
8.0.4 are point releases. (Look at the bottom of your Admin page to see your 
version number.) Please see :doc:`update` for instructions on using the 
Updater app. (The Updater app is available only in the Server edition, and not 
included in the Enterprise Subscription.)

Upgrading your ownCloud server means upgrading to the next major ownCloud 
release. Major releases are indicated by the first and second digits. So 6.0, 
7.0 and 8.0 are major releases. You may use the Updater app for staying current 
with new point releases (Server only), but not for upgrading to a major 
release.

.. note:: Before upgrading to a new major release, always first review any 
   third-party apps you have installed for compatibility with  
   the new ownCloud release. Any apps that are not developed by ownCloud show a 
   3rd party designation. Install unsupported apps at your own risk.Then, 
   before the upgrade, they must all be disabled. After the upgrade is 
   complete you may re-enable them.

Preferred Upgrade Method
------------------------

The best method for keeping your ownCloud server on Linux servers current is by 
configuring your system to use the `openSUSE Build Service 
<http://software.opensuse.org/download.html?project=isv:ownCloud:community&
package=owncloud>`_, and then stay current by using your package manager to 
upgrade. You should still maintain regular backups (see :doc:`backup`), and make 
a backup before every update/upgrade.

Windows server admins must use the manual upgrade procedure.

You cannot skip major releases; for example, upgrading from 5.0 to 7.0. This is 
unsupported, and you'll experience unpredictable results. It is best to install 
all upgrades and updates in order.

Manual Upgrade Procedure
------------------------

Start by putting your server in maintenance mode. Do this by entering your 
``config.php`` file and changing ``'maintenance' => false,`` to ``'maintenance' 
=> true,``. This prevents new logins, and logged-in users can't make any 
further requests.

1. Ensure that you are running the latest point release of your current major 
   ownCloud version.
2. Deactivate all third party applications (not core apps), and review them for 
   compatibility with your new ownCloud version.
3. Back up your existing ownCloud Server database, data directory, and 
   ``config.php`` file. (See :doc:`backup`.)
4. Download and unpack the latest ownCloud Server version from `owncloud.org/install/ 
   <https://owncloud.org/install/>`_ into an empty directory outside 
   of your current installation. For example, if your current ownCloud is 
   installed in ``/var/www/owncloud/`` you could create a new directory called
   ``/var/www/owncloud2/``
5. Stop your web server.

Depending on your environment, you will be running either an Apache server or 
a Windows IIS server. To stop an Apache server, refer to the following table for 
specific commands to use in different Linux operating systems:

  +-----------------------+-----------------------------------------+
  | Operating System      | Command (as root)                       |
  +=======================+=========================================+
  | CentOS/ Red Hat       |  ``apachectl stop``                     |         
  +-----------------------+-----------------------------------------+
  | Debian                |                                         |
  | or                    | ``/etc/init.d/apache2 stop``            |
  | Ubuntu                |                                         |
  +-----------------------+-----------------------------------------+
  | SUSE Enterprise       |                                         |
  | Linux 11              | ``/usr/sbin/rcapache2 stop``            |       
  |                       |                                         |
  | openSUSE 12.3 and up  | ``systemctl stop apache2``              |
  +-----------------------+-----------------------------------------+

To stop the Windows IIS web server, you can use either the user interface (UI) 
or command line method as follows:

  
 +----------------------+---------------------------------------------------+
 | Method               | Procedure                                         |   
 |                      |                                                   |
 +======================+===================================================+
 | User Interface (UI)  | 1. Open IIS Manager and navigate to the           |
 |                      |    web server node in the tree.                   |  
 |                      |                                                   |
 |                      | 2. In the **Actions** pane, click **Stop**.       |  
 +----------------------+---------------------------------------------------+
 | Command Line         | 1. Open a command line window as                  |
 |                      |    administrator.                                 |
 |                      |                                                   |
 |                      | 2. At the command prompt, type **net stop WAS**   |
 |                      |    and press **ENTER**.                           |
 |                      |                                                   |
 |                      | 3. (Optional) To stop W3SVC, type **Y** and       |
 |                      |    then press **ENTER**.                          |
 +----------------------+---------------------------------------------------+

6. Rename or move your current ownCloud directory (named ``owncloud/`` if 
   installed using defaults) to another location.

7. Unpack your new tarball:

    ``tar xjf owncloud-latest.tar.bz2``
    
   In Microsoft Windows environments, you can unpack the release tarball using 
   WinZip or a similar tool (for example, Peazip). Always unpack server code 
   into an empty directory. Unpacking the server code into an existing, 
   populated directory is not supported and will cause all kinds of errors. 
    
8. This creates a new ``owncloud/`` directory populated with your new server 
   files. Copy this directory and its contents to the original location of your 
   old server, for example ``/var/www/``, so that once again you have 
   ``/var/www/owncloud`` .

9. Copy and paste the ``config.php`` file from your old version of 
   ownCloud to your new ownCloud version.

10. If you keep your ``data/`` directory in your ``owncloud/`` directory, copy 
    it from your old version of ownCloud to the ``owncloud/`` directory of your 
    new ownCloud version. If you keep it outside of ``owncloud/`` then you 
    don't have to do anything with it.

.. note:: We recommend storing your ``data/`` directory in a location other 
   than your ``owncloud/`` directory. If you have your ``data/`` directory 
   already stored in another location, you can skip this step. If you want to 
   do so, now is a good time to change the location of your ``data/`` directory. 
   See the "Advanced Options" chapter in 
   :doc:`../installation/installation_wizard` for more information about    
   changing the default database or data directory.

11. Restart your web server.

Depending on your environment, you will be running either an Apache server or a 
Windows IIS server. In addition, when running your server in a Linux 
environment, the necessary commands for stopping the Apache server might differ 
from one Linux operating system to another.

To start an Apache server, refer to the following table for specific commands 
to use in different Linux operating systems:

  +-----------------------+-----------------------------------------+
  | Operating System      | Command (as root)                       |
  +=======================+=========================================+
  | CentOS/ Red Hat       |  ``apachectl start``                    |         
  +-----------------------+-----------------------------------------+
  | Debian                |                                         |
  | or                    | ``/etc/init.d/apache2 start``           |
  | Ubuntu                |                                         |
  +-----------------------+-----------------------------------------+
  | SUSE Enterprise       |                                         |
  | Linux 11              | ``/usr/sbin/rcapache2 start``           |       
  |                       |                                         |
  | openSUSE 12.3 and up  | ``systemctl start apache2``             |
  +-----------------------+-----------------------------------------+
  
To start the Windows IIS web server, you can use either the user interface 
(UI) or command line method as follows:
  
 +----------------------+---------------------------------------------------+
 | Method               | Procedure                                         |   
 |                      |                                                   |
 +======================+===================================================+
 | User Interface (UI)  | 1. Open IIS Manager and navigate to the           |
 |                      |    web server node in the tree.                   |
 |                      |                                                   |
 |                      | 2. In the **Actions** pane, click **Stop**.       |   
 +----------------------+---------------------------------------------------+
 | Command Line         | 1. Open a command line window as                  |
 |                      |    administrator.                                 | 
 |                      |                                                   |
 |                      | 2. At the command prompt, type **net stop WAS**   |
 |                      |    and press **ENTER**.                           |
 |                      |                                                   |
 |                      | 3. (Optional) To stop W3SVC, type **Y** and       |
 |                      |    then press **ENTER**.                          |
 +----------------------+---------------------------------------------------+

12. Now you should be able to open a web browser to your ownCloud server and 
    log in as usual. You have a couple more steps to go: You should see a 
    **Start Update** screen. Review the prequisites, and if you have followed 
    all the steps click the **Start Update** button. 
    
    
    If you are an enterprise customer, or are running a large installation with 
    a lot of files and users, you should launch the update from the command 
    line using ``occ`` to avoid timeouts, like this example on Ubuntu Linux::
    
     $ sudo -u www-data php occ upgrade
     
    Please see :doc:`../configuration_server/occ_command` to learn more about 
    ``occ``.
    
13. The upgrade operation takes a few minutes, depending on the size of your 
    installation. When it is finished you will see a success message, or an 
    error message that will tell where it went wrong.   

Assuming your upgrade succeeded, take a look at the bottom of the Admin page to 
verify the version number. Check your other settings to make sure they're 
correct. Go to the Apps page and review the core apps to make sure the right 
ones are enabled.

Now you can review your third-party apps, and upgrade and enable them.