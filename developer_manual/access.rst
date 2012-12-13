public.php and remote.php
=========================

public.php
----------
The public.php is used for public sharing like public file sharing, public gallery sharing and public calendar sharing.

Register:
~~~~~~~~~

To register an app for public.php you just have to put the following lines into your app’s appinfo/info.xml. 

Example from our source code: ``<public> <calendar>share.php</calendar> <caldav>share.php</caldav> </public>``

Now you can reach the file /apps/calendar/share.php through /public.php?service=calendar and through /public.php?service=caldav

Example for syntax: ``<public> <servicename>phpfileforsharing.php</servicename> </public>``

Now you can reach the file */apps/appid/phpfileforsharing.php* through */public.php?service=servicename*

remote.php
----------
The remote.php is used for remote services like webdav, caldav, carddav and ampache.

Register:
~~~~~~~~~

To register an app for remote.php you just have to put the following lines into your app’s appinfo/info.xml. 

Example from our source code: ``<remote> <calendar>appinfo/remote.php</calendar> <caldav>appinfo/remote.php</caldav> </remote>``

Now you can reach the file /apps/calendar/appinfo/remote.php through /remote.php/calendar and through /remote.php/caldav/

Example for syntax: ``<remote> <servicename>phpfileforremote.php</servicename> </remote>``

Now you can reach the file */apps/appid/phpfileforremote.php* through */remote.php/servicename/*