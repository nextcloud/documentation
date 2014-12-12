============
App Metadata
============

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

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
      <requiremin>5</requiremin>

      <types>
          <type>filesystem</type>
      </types>


      <documentation>
          <user>http://doc.owncloud.org</user>
          <admin>http://doc.owncloud.org</admin>
      </documentation>

      <website>http://www.owncloud.org</website>

      <!-- deprecated, just for reference -->
      <public>
          <file id="caldav">appinfo/caldav.php</file>
      </public>

      <remote>
          <file id="caldav">appinfo/caldav.php</file>
      </remote>

      <standalone />

      <default_enable />
      <shipped>true</shipped>

      <dependencies>
          <php min-version="5.4" max-version="5.5"/>
          <database>sqlite</database>
          <database>mysql</database>
          <command os="linux">grep</command>
          <command os="windows">notepad.exe</command>
          <lib min-version="1.2">xml</lib>
          <lib max-version="2.0">intl</lib>
          <lib>curl</lib>
          <os>Linux</os>
          <owncloud min-version="6.0.4" max-version="8"/>
      </dependencies>
  </info>

id
--
**Required**: This field contains the internal app name, and has to be the same as the folder name of the app. This id needs to be unique in ownCloud, meaning no other app should have this id.

name
----
**Required**: This is the human-readable name/title of the app that will be displayed in the app overview page.

description
-----------
**Required**: This contains the description of the app which will be shown in the apps overview page.

version
-------
Contains the version of your app. Please also provide the same version in the :file:`appinfo/version`.

licence
-------
**Required**: The licence of the app. This licence must be compatible with the AGPL and **must not be proprietary**, for instance:

* AGPL 3 (recommended)
* MIT

If a proprietary/non AGPL compatible licence should be used, the `ownCloud Enterprise Edition <https://owncloud.com/overview/enterprise-edition>`_ must be used.

author
------
**Required**: The name of the app author or authors.

requiremin
----------
**Required**: The minimal version of ownCloud.

types
-----
ownCloud allows to specify four kind of "types". Currently supported "types":

* **prelogin**: apps which needs to load on the login page

* **filesystem**: apps which provides filesystem functionality (e.g. files sharing app)

* **authentication**: apps which provided authentication backends

* **logging**: apps which implement a logging system

documentation
-------------
link to 'admin' and 'user' documentation

website
-------
link to project web page

Dependencies
============
All tags within the dependencies tag define a set of requirements which have to be fulfilled in order to operate
properly. As soon as one of these requirements is not met the app cannot be installed.

php
---
Defines the minimum and the maximum version of php which is required to run this app.

database
--------
Each supported database has to be listed in here. Valid values are sqlite, mysql, pgsql, oci and mssql. In the future
it will be possible to specify versions here as well.
In case no database is specified it is assumed that all databases are supported.

command
-------
Defines a command line tool to be available. With the attribute 'os' the required operating system for this tool can be
specified. Valid values for the 'os' attribute are as returned by the php function `php_uname http://php.net/manual/en/function.php-uname.php`_.

lib
---
Defines a required php extension with required minimum and/or maximum version.

os
--
Defines the required target operating system the app can run on. Valid values are as returned by the php function `php_uname http://php.net/manual/en/function.php-uname.php`_.

owncloud
--------
Defines minimum and maximum versions of the ownCloud core. In case undefined the values will be taken from the tag 'requiremin'.


Deprecated
==========

The following sections are just listed for reference and should not be used because

* **public/remote**: Use :doc:`api` instead because you'll have to use :doc:`../core/externalapi` which is known to be buggy (works only properly with GET/POST)
* **standalone/default_enable**: They tell core what do on setup, you will not be able to even activate your app if it has those entries. This should be replaced by a config file inside core.

public
------
Used to provide a public interface (requires no login) for the app. The id is appended to the URL **/owncloud/index.php/public**. Example with id set to 'calendar'::

    /owncloud/index.php/public/calendar

Also take a look at :doc:`../core/externalapi`.

remote
------
Same as public but requires login. The id is appended to the URL **/owncloud/index.php/remote**. Example with id set to 'calendar'::

    /owncloud/index.php/remote/calendar

Also take a look at :doc:`../core/externalapi`.


standalone
----------
Can be set to true to indicate that this app is a webapp. This can be used to tell GNOME Web for instance to treat this like a native application.

default_enable
--------------
**Core apps only**: Used to tell ownCloud to enable them after the installation.

shipped
-------
**Core apps only**: Used to tell ownCloud that the app is in the standard release.

Please note that if this attribute is set to *FALSE* or not set at all, every time you disable the application, all the files of the application itself will be *REMOVED* from the server!
