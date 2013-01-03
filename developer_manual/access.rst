.. _granting_access:

Granting Access to your App
===========================

ownCloud's architecture has two major interfaces for apps that need to deal
with access beyond the web browser or authenticated users: ``public.php``
and ``remote.php`` serve this purpose.

Public Sharing
--------------

The file ``public.php`` is used for *public sharing* like public file sharing,
public gallery sharing and public calendar sharing.

To register an app for ``public.php`` you just have to put the following lines
into your app’s ``appinfo/info.xml``. 

Example from our source code::

  <public>
    <calendar>share.php</calendar>
    <caldav>share.php</caldav>
  </public>

Now you can reach the file ``/apps/calendar/share.php`` through
``/public.php?service=calendar`` and through ``/public.php?service=caldav``.
In a more abstract description, given this snippet::

  <public>
    <servicename>phpfileforsharing.php</servicename>
  </public>

you can reach the file ``/apps/appid/phpfileforsharing.php`` by calling
``/public.php?service=servicename``.

Remote Services
---------------

Sometimes apps provide specific protocols that can be handled via HTTP, but are
meant to be used with native applications, such as WebDAV (file manager), CalDAV
(calendar), CardDAV (address book) and Ampache (media player) rather than the
web browser itself. Such services can be exposed via the ``remote.php``
interface.

To register an app for ``remote.php`` you just have use your app's
``appinfo/info.xml``, along the lines of the ``public.php`` syntax:: 

  <remote>
    <calendar>appinfo/remote.php</calendar>
    <caldav>appinfo/remote.php</caldav>
  </remote>

Now you can reach the file ``/apps/calendar/appinfo/remote.php`` through
``/remote.php/calendar`` and through ``/remote.php/caldav/``. Again, with
a more abstract syntax, this means that the snippet::

   <remote>
     <servicename>phpfileforremote.php</servicename>
   </remote>

will grant access to ``/apps/appid/phpfileforremote.php`` through
``/remote.php/servicename/``.
