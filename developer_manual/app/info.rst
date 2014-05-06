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
      <version>0.0.1</version>
      <licence>AGPL</licence>
      <author>Your Name</author>
      <require>7</require>

      <types>
          <type>filesystem</type>
      </types>

      <documentation>
          <user>http://doc.owncloud.org</user>
          <admin>http://doc.owncloud.org</admin>
      </documentation>

      <website>http://www.owncloud.org</website>
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

documentation
-------------
link to 'admin' and 'user' documentation

website
-------
link to project webpage

