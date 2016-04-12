=====================================
Accessing ownCloud Files Using WebDAV
=====================================

ownCloud fully supports the WebDAV protocol, and you can connect and synchronize 
with your ownCloud files over WebDAV.  In this chapter you will learn how to 
connect Linux, Mac OS X, Windows, and mobile devices to your ownCloud server via 
WebDAV. Before we get into configuring WebDAV, let's take a quick look at the 
recommended way of connecting client devices to your ownCloud servers.

ownCloud Desktop and Mobile Clients
-----------------------------------

The recommended method for keeping your desktop PC synchronized with your 
ownCloud server is by using the `ownCloud Desktop Client 
<https://owncloud.org/install/#install-clients>`_. You can configure the ownCloud client 
to save files in any local directory you want, and you choose which directories 
on the ownCloud server to sync with. The client displays the current connection 
status and logs all activity, so you always know which remote files have been 
downloaded to your PC, and you can verify that files created and updated on your 
local PC are properly synchronized with the server.

The recommended method for syncing your ownCloud server with Android and 
Apple iOS devices is by using the `ownCloud mobile apps 
<https://owncloud.org/install/#install-clients>`_.

To connect to your ownCloud server with the **ownCloud** mobile apps, use the 
base URL and folder only::

    example.com/owncloud

In addition to the mobile apps provided by ownCloud, you can use other apps to 
connect to ownCloud from your mobile device using WebDAV. `WebDAV Navigator`_ is 
a good (proprietary) app for `Android devices`_, `iPhones`_, and `BlackBerry 
devices`_. The URL to use on these is::

    example.com/owncloud/remote.php/dav/files/USERNAME/
    
WebDAV Configuration
--------------------

If you prefer, you may also connect your desktop PC to your ownCloud server by 
using the WebDAV protocol rather than using a special client application. Web 
Distributed Authoring and Versioning (WebDAV) is a Hypertext Transfer Protocol 
(HTTP) extension that makes it easy to create, read, and edit files on Web 
servers. With WebDAV you can access your ownCloud shares on Linux, Mac OS X and 
Windows in the same way as any remote network share, and stay synchronized.

.. note:: In the following examples, You must adjust **example.com/** to the
   URL of your ownCloud server installation.

Accessing Files Using Linux
---------------------------

You can access files in Linux operating systems using the following methods.

Nautilus File Manager
^^^^^^^^^^^^^^^^^^^^^

Use the ``davs://`` protocol to connect the Nautilus file manager to your 
ownCloud share::

  davs://example.com/owncloud/remote.php/dav/files/USERNAME/

.. note:: If your server connection is not HTTPS-secured, use `dav://` instead 
   of `davs://`.

.. image:: ../images/webdav_gnome3_nautilus.png
   :alt: screenshot of configuring Nautilus file manager to use WebDAV

Accessing Files with KDE and Dolphin File Manager
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To access your ownCloud files using the Dolphin file manager in KDE, use 
the ``webdav://`` protocol::

    webdav://example.com/owncloud/remote.php/dav/files/USERNAME/

.. image:: ../images/webdav_dolphin.png
   :alt: screenshot of configuring Dolphin file manager to use WebDAV

You can create a permanent link to your ownCloud server:

#. Open Dolphin and click "Network" in the left hand "Places" column.
#. Click on the icon labeled **Add a Network Folder**.
   The resulting dialog should appear with WebDAV already selected.
#. If WebDAV is not selected, select it.
#. Click **Next**.
#. Enter the following settings:

   * Name: The name you want to see in the **Places** bookmark, for example ownCloud.

   * User: The ownCloud username you used to log in, for example admin.
   
   * Server: The ownCloud domain name, for example **example.com** (without 
     **http://** before or directories afterwards).
   * Folder -- Enter the path ``owncloud/remote.php/dav/files/USERNAME/``.
#. (Optional) Check the "Create icon checkbox" for a bookmark to appear in the 
   Places column.
#. (Optional) Provide any special settings or an SSL certificate in the "Port & 
   Encrypted" checkbox.

Creating WebDAV Mounts on the Linux Command Line
------------------------------------------------

You can create WebDAV mounts from the Linux command line. This is useful if you 
prefer to access ownCloud the same way as any other remote filesystem mount.  
The following example shows how to create a personal mount and have it mounted 
automatically every time you log in to your Linux computer.

1. Install the ``davfs2`` WebDAV filesystem driver, which allows you to mount 
   WebDAV shares just like any other remote filesystem. Use this command to 
   install it on Debian/Ubuntu::
   
    apt-get install davfs2
    
2. Use this command to install it on CentOS, Fedora, and openSUSE::

    yum install davfs2    

3. Add yourself to the ``davfs2`` group::

    usermod -aG davfs2 <username>

3. Then create an ``owncloud`` directory in your home directory for the 
   mountpoint, and ``.davfs2/`` for your personal configuration file::
   
    mkdir ~/owncloud
    mkdir ~/.davfs2
    
4. Copy ``/etc/davfs2/secrets`` to ``~/.davfs2``:: 

    cp  /etc/davfs2/secrets ~/.davfs2/secrets 
   
5. Set yourself as the owner and make the permissions read-write owner only::
    
    chown <username>:<username>  ~/.davfs2/secrets
    chmod 600 ~/.davfs2/secrets
 
6. Add your ownCloud login credentials to the end of the ``secrets`` file, 
   using your ownCloud server URL and your ownCloud username and password::

    example.com/owncloud/remote.php/dav/files/USERNAME/ <username> <password>

7. Add the mount information to ``/etc/fstab``::

    example.com/owncloud/remote.php/dav/files/USERNAME/ /home/<username>/owncloud 
    davfs user,rw,auto 0 0

8. Then test that it mounts and authenticates by running the following 
   command. If you set it up correctly you won't need root permissions::

    mount ~/owncloud
    
9. You should also be able to unmount it::
 
    umount ~/owncloud
    
Now every time you login to your Linux system your ownCloud share should 
automatically mount via WebDAV in your ``~/owncloud`` directory. If you prefer 
to mount it manually, change ``auto`` to ``noauto`` in ``/etc/fstab``.

Known Issues
------------

Problem
^^^^^^^
Resource temporarily unavailable

Solution
^^^^^^^^
If you experience trouble when you create a file in the directory, 
edit ``/etc/davfs2/davfs2.conf`` and add::

    use_locks 0

Problem
^^^^^^^ 
Certificate warnings

Solution
^^^^^^^^ 

If you use a self-signed certificate, you will get a warning. To 
change this, you need to configure ``davfs2`` to recognize your certificate. 
Copy ``mycertificate.pem`` to ``/etc/davfs2/certs/``. Then edit 
``/etc/davfs2/davfs2.conf`` and uncomment the line ``servercert``. Now add the 
path of your certificate as in this example::

 servercert   /etc/davfs2/certs/mycertificate.pem

Accessing Files Using Mac OS X
------------------------------

.. note:: The Mac OS X Finder suffers from a `series of implementation problems 
   <http://sabre.io/dav/clients/finder/>`_ and should only be used if the 
   ownCloud server runs on **Apache** and **mod_php**, or **Nginx 1.3.8+**.

To access files through the Mac OS X Finder:

1. Choose **Go > Connect to Server**.

  The "Connect to Server" window opens.

2. Specify the address of the server in the **Server Address** field.

  .. image:: ../images/osx_webdav1.png
     :alt: Screenshot of entering your ownCloud server address on Mac OS X

  For example, the URL used to connect to the ownCloud server 
  from the Mac OS X Finder is::

    https://example.com/owncloud/remote.php/dav/files/USERNAME/

  .. image:: ../images/osx_webdav2.png

3. Click **Connect**.

  The device connects to the server.

For added details about how to connect to an external server using Mac OS X, 
check the `vendor documentation 
<http://docs.info.apple.com/article.html?path=Mac/10.6/en/8160.html>`_

Accessing Files Using Microsoft Windows
---------------------------------------

It is best to use a suitable WebDAV client from the
`WebDAV Project page <http://www.webdav.org/projects/>`_ .

If you must use the native Windows implementation, you can map ownCloud to a new 
drive. Mapping to a drive enables you to browse files stored on an ownCloud 
server the way you would files stored in a mapped network drive.

Using this feature requires network connectivity. If you want to store your 
files offline, use the ownCloud Desktop Client to sync all files on your 
ownCloud to one or more directories of your local hard drive.

.. note:: Prior to mapping your drive, you must permit the use of Basic
  Authentication in the Windows Registry. The procedure is documented in
  KB841215_ and differs between Windows XP/Server 2003 and Windows Vista/7.
  Please follow the Knowledge Base article before proceeding, and follow the
  Vista instructions if you run Windows 7.

.. _KB841215: http://support.microsoft.com/kb/841215

Mapping Drives With the Command Line
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The following example shows how to map a drive using the command line.  To map 
the drive:

1. Open a command prompt in Windows.
2. Enter the following line in the command prompt to map to the computer Z 
   drive::

    net use Z: https://<drive_path>/remote.php/dav/files/USERNAME/ /user:youruser 
    yourpassword

  where <drive_path> is the URL to your ownCloud server.

For example: ``net use Z: https://example.com/owncloud/remote.php/dav/files/USERNAME/ 
/user:youruser yourpassword``

  The computer maps the files of your ownCloud account to the drive letter Z.

.. note:: Though not recommended, you can also mount the ownCloud server
     using HTTP, leaving the connection unencrypted.  If you plan to use HTTP
     connections on devices while in a public place, we strongly recommend using a 
     VPN tunnel to provide the necessary security.

An alternative command syntax is::

  net use Z: \\example.com@ssl\owncloud\remote.php\dav /user:youruser 
  yourpassword

Mapping Drives With Windows Explorer
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To map a drive using the Microsoft Windows Explorer:

1. Migrate to your computer in Windows Explorer.
2. Right-click on **Computer** entry and select **Map network drive...** from 
   the drop-down menu.
3. Choose a local network drive to which you want to map ownCloud.
4. Specify the address to your ownCloud instance, followed by 
   **/remote.php/dav/files/USERNAME/**.

  For example::

    https://example.com/owncloud/remote.php/dav/files/USERNAME/

.. note:: For SSL protected servers, check **Reconnect at logon** to ensure
     that the mapping is persistent upon subsequent reboots. If you want to 
     connect to the ownCloud server as a different user, check **Connect using 
     different credentials**.

.. figure:: ../images/explorer_webdav.png
   :scale: 80%
   :alt: screenshot of mapping WebDAV on Windows Explorer

5. Click the ``Finish`` button.

  Windows Explorer maps the network drive, making your ownCloud instance 
  available.

Accessing Files Using Cyberduck
-------------------------------

`Cyberduck <https://cyberduck.io/?l=en>`_ is an open source FTP and SFTP, 
WebDAV, OpenStack Swift, and Amazon S3 browser designed for file transfers on 
Mac OS X and Windows.

.. note:: This example uses Cyberduck version 4.2.1.

To use Cyberduck:

1. Specify a server without any leading protocol information. For example:

  ``example.com``

2. Specify the appropriate port.  The port you choose depends on whether or not
your ownCloud server supports SSL. Cyberduck requires that you select a
different connection type if you plan to use SSL.  For example:

  80 (for WebDAV)
  
  443 (for WebDAV (HTTPS/SSL))

3. Use the 'More Options' drop-down menu to add the rest of your WebDAV URL into 
the 'Path' field. For example:

  ``remote.php/dav/files/USERNAME/``

Now Cyberduck enables file access to the ownCloud server.

Accessing public shares over WebDAV
-----------------------------------

ownCloud provides the possibility to access public shares over WebDAV.

To access the public share, open::

  https://example.com/owncloud/public.php/dav

in a WebDAV client, use the share token as username and the (optional) share password
as password.

Known Problems
--------------

Problem
^^^^^^^
Windows does not connect using HTTPS.

Solution 1
^^^^^^^^^^

The Windows WebDAV Client might not support Server Name Indication (SNI) on 
encrypted connections. If you encounter an error mounting an SSL-encrypted 
ownCloud instance, contact your provider about assigning a dedicated IP address 
for your SSL-based server.

Solution 2
^^^^^^^^^^

The Windows WebDAV Client might not support TSLv1.1 / TSLv1.2 connections. If 
you have restricted your server config to only provide TLSv1.1 and above the 
connection to your server might fail. Please refer to the WinHTTP_ documentation 
for further information.

.. _WinHTTP: https://msdn.microsoft.com/en-us/library/windows/desktop/aa382925.aspx#WinHTTP_5.1_Features

Problem
^^^^^^^

You receive the following error message: **Error 0x800700DF: The file size 
exceeds the limit allowed and cannot be saved.**

Solution
^^^^^^^^

Windows limits the maximum size a file transferred from or to  a WebDAV share 
may have.  You can increase the value **FileSizeLimitInBytes** in 
**HKEY_LOCAL_MacHINE\\SYSTEM\\CurrentControlSet\\Services\\WebClient\\Parameters
** by clicking on **Modify**.

To increase the limit to the maximum value of 4GB, select **Decimal**, enter a 
value of **4294967295**, and reboot Windows or restart the **WebClient** 
service.

Problem
^^^^^^^

Accessing your files from Microsoft Office via WebDAV fails.

Solution
^^^^^^^^

Known problems and their solutions are documented in the KB2123563_ article.
  
Problem
^^^^^^^
Cannot map ownCloud as a WebDAV drive in Windows using self-signed certificate.

Solution
^^^^^^^^

  #. Go to the your ownCloud instance via your favorite Web browser.
  #. Click through until you get to the certificate error in the browser status 
     line.
  #. View the cert, then from the Details tab, select Copy to File.
  #. Save to the desktop with an arbitrary name, for example ``myOwnCloud.cer``.
  #. Start, Run, MMC.
  #. File, Add/Remove Snap-In.  
  #. Select Certificates, Click Add, My User Account, then Finish, then OK.
  #. Dig down to Trust Root Certification Authorities, Certificates.
  #. Right-Click Certificate, Select All Tasks, Import.
  #. Select the Save Cert from the Desktop.
  #. Select Place all Certificates in the following Store, Click Browse,
  #. Check the Box that says Show Physical Stores, Expand out Trusted Root 
     Certification Authorities, and select Local Computer there, click OK, 
     Complete the Import.
  #. Check the list to make sure it shows up. You will probably need to Refresh 
     before you see it. Exit MMC.
  #. Open Browser, select Tools, Delete Browsing History.
  #. Select all but In Private Filtering Data, complete.
  #. Go to Internet Options, Content Tab, Clear SSL State.
  #. Close browser, then re-open and test.
  
Problem
^^^^^^^

You cannot download more than 50 MB or upload large Files when the upload takes 
longer than 30 minutes using Web Client in Windows 7.

Solution
^^^^^^^^

Workarounds are documented in the KB2668751_ article.


Accessing Files Using cURL
--------------------------

Since WebDAV is an extension of HTTP cURL can be used to script file operations.
	
To create a folder with the current date as name:

.. code-block:: bash

	$ curl -u user:pass -X MKCOL "https://example.com/owncloud/remote.php/dav/files/USERNAME/$(date '+%d-%b-%Y')"

To upload a file ``error.log`` into that directory:

.. code-block:: bash

	$ curl -u user:pass -T error.log "https://example.com/owncloud/remote.php/dav/files/USERNAME/$(date '+%d-%b-%Y')/error.log"

To move a file:

.. code-block:: bash

	$ curl -u user:pass -X MOVE --header 'Destination: https://example.com/owncloud/remote.php/dav/files/USERNAME/target.jpg' https://example.com/owncloud/remote.php/dav/files/USERNAME/source.jpg

To get the properties of files in the root folder:

.. code-block:: bash

	$ curl -X PROPFIND -H "Depth: 1" -u user:pass https://example.com/owncloud/remote.php/dav/files/USERNAME/ | xml_pp
	<?xml version="1.0" encoding="utf-8"?>
    <d:multistatus xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:s="http://sabredav.org/ns">
      <d:response>
        <d:href>/owncloud/remote.php/dav/files/USERNAME/</d:href>
        <d:propstat>
          <d:prop>
            <d:getlastmodified>Tue, 13 Oct 2015 17:07:45 GMT</d:getlastmodified>
            <d:resourcetype>
              <d:collection/>
            </d:resourcetype>
            <d:quota-used-bytes>163</d:quota-used-bytes>
            <d:quota-available-bytes>11802275840</d:quota-available-bytes>
            <d:getetag>"561d3a6139d05"</d:getetag>
          </d:prop>
          <d:status>HTTP/1.1 200 OK</d:status>
        </d:propstat>
      </d:response>
      <d:response>
        <d:href>/owncloud/remote.php/dav/files/USERNAME/welcome.txt</d:href>
        <d:propstat>
          <d:prop>
            <d:getlastmodified>Tue, 13 Oct 2015 17:07:35 GMT</d:getlastmodified>
            <d:getcontentlength>163</d:getcontentlength>
            <d:resourcetype/>
            <d:getetag>"47465fae667b2d0fee154f5e17d1f0f1"</d:getetag>
            <d:getcontenttype>text/plain</d:getcontenttype>
          </d:prop>
          <d:status>HTTP/1.1 200 OK</d:status>
        </d:propstat>
      </d:response>
    </d:multistatus>


.. _KB2668751: https://support.microsoft.com/kb/2668751
.. _KB2123563: https://support.microsoft.com/kb/2123563
.. _in your file manager: http://en.wikipedia.org/wiki/Webdav#WebDAV_client_applications
.. _ownCloud sync clients: https://doc.owncloud.org/desktop/2.1/
.. _Mount ownCloud to a local folder without sync: https://owncloud.org/use/webdav/
.. _Android: https://github.com/owncloud/android
.. _WebDAV Navigator: http://seanashton.net/webdav/
.. _Android devices: https://play.google.com/store/apps/details?id=com.schimera.webdavnavlite
.. _iPhones: https://itunes.apple.com/app/webdav-navigator/id382551345
.. _BlackBerry devices: http://appworld.blackberry.com/webstore/content/46816
