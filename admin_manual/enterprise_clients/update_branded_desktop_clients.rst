=======================================================
Updating Your Branded Desktop Clients (Enterprise Only)
=======================================================

The Client Updater Server provides a Web service that will tell an ownCloud 
desktop sync client whether or not an update is available. If an update is 
available, it will also provide metadata for the update, such as the Download 
URL, signatures or a fallback URL that the client can resort to in case the
update goes wrong.

Clients for Mac OS X and Windows will update themselves automatically. Linux 
clients will not. You have two options for your Linux users:

* Set up your own download repository so your Linux users can update your 
  branded clients with their package managers when they receive an update 
  notification.
* Upload new versions of your branded client to your Web server. Your Linux 
  users receive update notifications, then download and install the client 
  manually.

There are times when you may want to disable update notifications. See the 
examples below to learn how to do this.

Prerequisites
-------------

#. Configure "Update URL" in the "Desktop" section of your ownBrander
   account (available for "advanced" users only).

   -  Example:
       https://mycloud.example.com/updates/
       (note the forward slash at the end.)

#. Generate branded clients.
#. Upload branded clients to your Web server.

   -  Windows example:
       https://mycloud.example.com/install/mycloud-2.1.1.240-setup.exe
   
   -  Mac OS X examples:
       https://mycloud.example.com/install/mycloud-2.1.1.787.pkg
       
       https://mycloud.example.com/install/mycloud-2.1.1.787.pkg.tbz
       
       https://mycloud.example.com/install/mycloud-2.1.1.787.pkg.tbz.sig
   
   -  You should have a Web page with links to your branded clients, so your 
      users can find and download them. For example, 
      https://mycloud.example.com/install/ with
      ``Options +Indexes`` in your ownCloud ``.htaccess`` file.

Install client-updater-server
-----------------------------

#. Download ``client-updater-server-0.3.tar.xz`` from
   https://customer.owncloud.com/.
#. Extract ``client-updater-server-0.3.tar.xz`` to your Web server. The
   ``index.php`` must be accessible at
   ``https://mycloud.example.com/updates/index.php``.
#. Copy your ownCloud ``config/default.php`` file, and name it according 
   your **Application short name** as configured in ownBrander.

   -  Example:
       ``config/mycloud.php``

Configure client-updater-server
-------------------------------

All configuration is done in your ``config/mycloud.php``::

    <?php

    $updateInfo = [
        'win32' => [
            'currentVersion' => '2.1.1.240',
            'currentVersionString' => 'MyCloud Client 2.1.1 (build 240)',
            'updateUrl' => 'https://mycloud.example.com/install/',
            'downloadUrl' => 
             'https://mycloud.example.com/install/mycloud-2.1.2.240-setup.exe',
        ],

        'linux' => array(
            'currentVersion' => '2.1.1',
            'currentVersionString' => 'MyCloud Client 2.1.1',
            'updateUrl' => 'https://mycloud.example.com/install/',
        ),

        'macos' => array(
            'currentVersion' => '2.1.1.787',
            'currentVersionString' => 'MyCloud Client 2.1.1 (build 787)',
            'downloadUrl' => 
             'https://mycloud.example.com/install/mycloud-2.1.1.787.pkg.tbz',
            'pubDate' => '2016-02-23',
            'signature' => 
              'MCwCFFedScUKeRXYMS6vKVLw821B+/+lAhRFNXHSvB9GNHOuI5cw==',
            'minimumSystemVersion' => '10.7.0',
        ),

    ];

Disabling Notifications
^^^^^^^^^^^^^^^^^^^^^^^

There may be times when you wish to disable update notifications. To do this, 
make the ``'currentVersion'`` and ``'currentVersionString'`` older than the 
currently installed version. To re-enable notifications, change these to 
release versions that are newer than the currently installed clients.
    
    
Windows
^^^^^^^

-  ``'currentVersion'``
   Exact version of the new client, including the build nr
-  ``'currentVersionString'``.
   Name of the new client, same as "Application name" configured in
   ownBrander.
-  ``'updateUrl'``
   Human-readable Web site with links to your new client files.
-  ``'downloadUrl'``
   Full URL to download the \*.exe file. http\ **s** needed.


Mac OS X
^^^^^^^^

-  ``currentVersion'``
   Exact version of the new client, including the build number.
-  ``'currentVersionString'``
   Name of the new client, same as "Application name" configured in
   ownBrander.
-  ``'downloadUrl'``
   Full URL to download the \*.pkg\ **.tbz** file. http\ **s** needed.
-  ``'pubDate'``
   Currently not used.
-  ``'signature'``
   Content of ``mycloud-2.1.1.787.pkg.tbz.sig``, adds some extra
   security to the Mac OS X updater.
-  ``'minimumSystemVersion'``
   Minimum required Mac OS X version according to
   https://owncloud.org/install/#install-clients.
   
Linux
^^^^^

-  ``'currentVersion'``
   Exact version of the new client, including the build nr
-  ``'currentVersionString'``.
   Name of the new client, same as "Application name" configured in
   ownBrander.
-  ``'updateUrl'``
   Human-readable Web site with links to your new client files to
   manually install new client versions.   

Debugging client-updater-server
-------------------------------

Windows
^^^^^^^

This a example URL of a 2.1.1 client for Mac OS X:
https://mycloud.example.com/updates/?version=2.1.1.140&platform=win32&oem=
mycloud

You should see something like the following in your Web server logs::

 [19/Feb/2016:14:33:35 +0100] "GET 
 /updates/?version=2.1.1.140&platform=win32&oem=mycloud HTTP/1.1" 200 185 "-" 
 "Mozilla/5.0 (Windows) mirall/2.1.1 (mycloud)" microsecs:530450 
 response_size:185 bytes_received:255 bytes_sent:316

The output should look like this if you call the URL manually::

 <?xml version="1.0"?>
    <owncloudclient>
       <version>2.1.1.140</version>
        <versionstring>MyCloud Client 2.1.1 (build 140)</versionstring>
        <web>https://mycloud.example.com/install/</web>   
        <downloadurl>https://mycloud.example.com/install/
         mycloud-2.1.1.140-setup.exe</downloadurl>
    </owncloudclient>

Mac OS X
^^^^^^^^

This a example URL of a 2.1.1 client for Mac OS X::

 https://mycloud.example.com/updates/?version=2.1.1.687&platform=macos&oem=
 mycloud&sparkle=true

You should see something like the following in your Web server logs::

  [19/Feb/2016:14:00:17 +0100] "GET 
  /updates/?version=2.1.1.687&platform=macos&oem=mycloud&sparkle=
  true HTTP/1.1" 200 185 "-" "Mozilla/5.0 (Macintosh) mirall/2.1.1 (mycloud)" 
  microsecs:1071 response_size:2070 bytes_received:306 bytes_sent:2402

The output should look like this if you call the URL manually::

 <?xml version="1.0" encoding="utf-8"?>
   <rss version="2.0" 
   xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle" 
   xmlns:dc="http://purl.org/dc/elements/1.1/">
   <channel>
      <title>Download Channel</title>
      <description>Most recent changes with links to updates.</description>
      <language>en</language><item>
      <title>MyCloud Client 2.1.1 (build 787)</title>
      <pubDate>Mon, 23 Feb 16 00:00:00 -0500</pubDate>
      <enclosure url="https://mycloud.example.com/install/
        mycloud-2.1.1.787.pkg.tbz" sparkle:version="2.1.1.787" 
        type="application/octet-stream" 
        sparkle:dsaSignature="MCwCFFedScUKeRXYMS6vKVLw821B+/+
          lAhRbiCxHNzVVZFNXHSvB9GNHOuI5cw=="/>                                   
       <sparkle:minimumSystemVersion>10.7.0</sparkle:minimumSystemVersion>
    </item>
    </channel>
   </rss> 
