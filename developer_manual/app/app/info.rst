App Metadata
============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

The :file:`appinfo/info.xml` contains metadata about the app:

.. code-block:: xml

  <?xml version="1.0"?>
  <info>
      <id>yourappname</id>
      <name>Your App</name>
      <description>Your App description</description>
      <version>1.0</version>
      <licence>AGPL</licence>
      <author>Your Name</author>
      <require>5</require>

      <types>
          <type>filesystem</type>
      </types>

      <remote>
          <file id="caldav">appinfo/caldav.php</file>
      </remote>

      <public>
          <file id="caldav">appinfo/caldav.php</file>
      </public>      

      <standalone />

      <default_enable />
      <shipped>true</shipped>
  </info>

id
--
**Required**: This field contains the internal app name, and has to be the same as the foldername of the app. This id needs to be unique in ownCloud, meaning no other app should have this id.

name
----
**Required**: This is the human-readable name/title of the app that will be displayed in the app overview page.

description
-----------
**Required**: This contains the description of the app which will be shown in the apps overview page.

version
-------
Contains the version of your app. Please the :file:`appinfo/version` which contains the version.

licence
-------
**Required**: The licence of the app. This licence must be compatible with the AGPL and **must not be proprietary**, for instance:

* AGPL 3 (recommended)
* MIT

If a proprietary/non AGPL compatible licence should be used, the `ownCloud Enterprise Edition <https://owncloud.com/overview/enterprise-edition>`_ must be used.

author
------
**Required**: The name of the app author or authors.

require
-------
**Required**: The minimal version of ownCloud.

types
-----
ownCloud allows to specify four kind of "types". Currently supported "types":

* **prelogin**: apps which needs to load on the login page

* **filesystem**: apps which provides filesystem functionality (e.g. files sharing app)

* **authentication**: apps which provided authentication backends

* **logging**: apps which implement a logging system

public
------
Used to provide a public interface (requires no login) for the app. The id is appended to the URL **/owncloud/index.php/public**. Example with id set to 'calendar'::

    /owncloud/index.php/public/calendar

Also take a look at :doc:`externalapi`.

remote
------
Same as public but requires login. The id is appended to the URL **/owncloud/index.php/remote**. Example with id set to 'calendar'::

    /owncloud/index.php/remote/calendar

Also take a look at :doc:`externalapi`.

standalone
----------
Can be set to true to indicate that this app is a webapp. This can be used to tell GNOME Web for instance to treat this like a native application.

default_enable
--------------
**Core apps only**: Used to tell ownCloud to enable them after the installation.

shipped
-------
**Core apps only**: Used to tell ownCloud that the app is in the standard release
