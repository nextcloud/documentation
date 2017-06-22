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
      <namespace>YourAppsNamespace</namespace>

      <types>
          <filesystem/>
      </types>


      <documentation>
          <user>https://docs.nextcloud.org</user>
          <admin>https://docs.nextcloud.org</admin>
          <developer>https://docs.nextcloud.org</developer>
      </documentation>

      <category>tool</category>

      <website>https://example.org</website>

      <bugs>https://github.com/nextcloud/theapp/issues</bugs>

      <repository type="git">https://github.com/nextcloud/theapp.git</repository>

      <ocsid>1234</ocsid>

      <dependencies>
          <php min-version="5.6" max-version="7.1"/>
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
      
      <settings>
          <admin-section>OCA\YourAppsNamespace\Settings\AdminSection</admin-section>
          <admin>OCA\YourAppsNamespace\Settings\AdminSettings</admin>
      </settings>

      <!-- deprecated, just for reference -->
      <requiremin>5</requiremin>
      <public>
          <file id="caldav">appinfo/caldav.php</file>
      </public>

      <remote>
          <file id="caldav">appinfo/caldav.php</file>
      </remote>

      <standalone />

      <default_enable />
      <shipped>true</shipped>
      <!-- end deprecated -->
  </info>

id
--
**Required**: This field contains the internal app name, and has to be the same as the folder name of the app. This id needs to be unique in Nextcloud, meaning no other app should have this id.

name
----
**Required**: This is the human-readable name/title of the app that will be displayed in the app overview page.

description
-----------
**Required**: This contains the description of the app which will be shown in the app overview page.

version
-------
Contains the version of your app.

licence
-------
**Required**: The licence of the app. This licence must be compatible with the AGPL and **must not be proprietary**, for instance:

* AGPL 3 (recommended)
* MIT

author
------
**Required**: The name of the app author or authors.

namespace
---------
Required if routes.php returns an array. If your app is namespaced like **\\OCA\\MyApp\\Controller\\PageController** the required namespace value is **MyApp**. If not given it tries to default to the first letter upper cased app id, e.g. **myapp** would be tried under **Myapp**

types
-----
Nextcloud allows to specify four kind of ``types``. Currently supported ``types``:

* **prelogin**: apps which need to load on the login page

* **filesystem**: apps which provide filesystem functionality (e.g. files sharing app)

* **authentication**: apps which provide authentication backends

* **logging**: apps which implement a logging system

* **prevent_group_restriction**: apps which can not be enabled for specific groups (e.g. notifications app).

.. note::

  Due to technical reasons apps of any type listed above can not be enabled for specific groups only.

documentation
-------------
Link to 'admin', 'user', 'developer' documentation

website
-------
Link to project web page

repository
----------
Link to the version control repo

bugs
----
Link to the bug tracker

category
--------
Category on the app store. Can be one of the following:

* auth
* customization
* files
* games
* integration
* monitoring
* multimedia
* office
* organization
* social
* tools

ocsid
-----
The app's id on the app store, e.g.: https://apps.owncloud.com/content/show.php/QOwnNotes?content=168497 would have the ocsid **168497**. If given helps users to install and update the same app from the app store

Dependencies
------------
All tags within the dependencies tag define a set of requirements which have to be fulfilled in order to operate
properly. As soon as one of these requirements is not met the app cannot be installed.

php
===
Defines the minimum and the maximum version of PHP which is required to run this app.

database
========
Each supported database has to be listed in here. Valid values are sqlite, mysql, pgsql, oci and mssql. In the future
it will be possible to specify versions here as well.
In case no database is specified it is assumed that all databases are supported.

command
=======
Defines a command line tool to be available. With the attribute 'os' the required operating system for this tool can be
specified. Valid values for the 'os' attribute are as returned by the PHP function `php_uname <http://php.net/manual/en/function.php-uname.php>`_.

lib
===
Defines a required PHP extension with required minimum and/or maximum version. The names for the libraries have to match the result as returned by the PHP function  `get_loaded_extensions <http://php.net/manual/en/function.get-loaded-extensions.php>`_.
The explicit version of an extension is read from `phpversion <http://php.net/manual/de/function.phpversion.php>`_ - with some exception as to be read up in the `code base <https://github.com/nextcloud/server/blob/master/lib/private/App/PlatformRepository.php>`_

os
==
Defines the required target operating system the app can run on. Valid values are as returned by the PHP function `php_uname <http://php.net/manual/en/function.php-uname.php>`_.

owncloud
========
**Required**: Defines minimum and maximum versions of the Nextcloud core. In case undefined the values will be taken from the tag `requiremin`_.

.. note:: Currently this tag is also used to check for the nextcloud version number.
          Thereby the following "translation" is made:

          * ownCloud 9.0 matches Nextcloud 9
          * ownCloud 9.1 matches Nextcloud 10
          * ownCloud 9.2 matches Nextcloud 11

settings
--------

When your app has admin settings, this is the place to register the corresponding classes.

admin-section
=============

In case the app needs to register a new section on the admin settings page, it needs to implement the \OCP\Settings\ISection interface. The implementing class needs to be specified here.

admin
=====

In case the app has its own admin related settings, it needs to implement the \OCP\Settings\ISettings interface. The implementing class needs to be specified here.
          
          
Deprecated
----------

The following sections are just listed for reference and should not be used because

requiremin
==========
Deprecated in favor of the **<dependencies>** tag.

public
======
Used to provide a public interface (requires no login) for the app. The id is appended to the URL **/index.php/public**. Example with id set to 'calendar'::

    /index.php/public/calendar

Also take a look at :doc:`../core/externalapi`.

remote
======
Same as public but requires login. The id is appended to the URL **/index.php/remote**. Example with id set to 'calendar'::

    /index.php/remote/calendar

Also take a look at :doc:`../core/externalapi`.


standalone
==========
Can be set to true to indicate that this app is a webapp. This can be used to tell GNOME Web for instance to treat this like a native application.

default_enable
==============
**Core apps only**: Used to tell Nextcloud to enable them after the installation.

shipped
=======
**Core apps only**: Used to tell Nextcloud that the app is in the standard release.

Please note that if this attribute is set to *FALSE* or not set at all, every time you disable the application, all the files of the application itself will be *REMOVED* from the server!
