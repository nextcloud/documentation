App Metadata
============
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
          <filesystem/>
      </types>
  </info>

id
--
This field contains the internal app name, and has to be the same as the foldername of the app. This id needs to be unique in ownCloud, meaning no other app should have this id.

name
----
This is the human-readable name/title of the app that will be displayed in the app overview page.

description
-----------
This contains the description of the app which will be shown in the apps overview page.

version
-------
Contains the version of your app

licence
-------
The licence of the app. This licence must be compatible with the AGPL and **must not be proprietary**, for instance:

* AGPL 3 (recommended)
* MIT

If a proprietary/non AGPL compatible licence should be used, the `ownCloud Enterprise Edition <https://owncloud.com/overview/enterprise-edition>`_ must be used.

types
-----
ownCloud allows to specify four kind of "types" in the file:`appinfo/info.xml` of a app. The type doesn't have to be specified if the app doesn't match any of them.

Currently supported "types":

* **prelogin**: apps which needs to load on the login page

* **filesystem**: apps which provides filesystem functionality (e.g. files sharing app)

* **authentication**: apps which provided authentication backends

* **logging**: apps which implement a logging system