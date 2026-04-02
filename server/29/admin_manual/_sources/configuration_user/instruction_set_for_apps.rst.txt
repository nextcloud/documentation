========================
Instruction set for apps
========================

Get list of apps
----------------

Returns a list of apps installed on the Nextcloud server. Authentication is done 
by sending a Basic HTTP Authorization 
header.

**Syntax: ocs/v1.php/cloud/apps/**

* HTTP method: GET
* url argument: filter, string - optional (``enabled`` or ``disabled``)

Status codes:

* 100 - successful
* 101 - invalid input data

Example
^^^^^^^
::

  $ curl -X GET http://admin:secret@example.com/ocs/v1.php/cloud/apps?filter=enabled -H "OCS-APIRequest: true"

* Gets enabled apps

XML output
^^^^^^^^^^

.. code-block:: xml

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
    <data>
      <apps>
        <element>files</element>
        <element>provisioning_api</element>
      </apps>
    </data>
  </ocs>

Get app info
------------

Provides information on a specific application. Authentication is done by 
sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/apps/{appid}**

* HTTP method: GET

Status codes:

* 100 - successful

Example
^^^^^^^
::

  $ curl -X GET http://admin:secret@example.com/ocs/v1.php/cloud/apps/files -H "OCS-APIRequest: true"

* Get app info for the ``files`` app

XML output
^^^^^^^^^^

.. code-block:: xml

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
    <data>
      <info/>
      <remote>
        <files>appinfo/remote.php</files>
        <webdav>appinfo/remote.php</webdav>
        <filesync>appinfo/filesync.php</filesync>
      </remote>
      <public/>
      <id>files</id>
      <name>Files</name>
      <description>File Management</description>
      <licence>AGPL</licence>
      <author>Robin Appelman</author>
      <require>4.9</require>
      <shipped>true</shipped>
      <active>true</active>
      <standalone></standalone>
      <default_enable></default_enable>
      <types>
        <element>filesystem</element>
      </types>
    </data>
  </ocs>

Enable an app
-------------

Enable an app.  Authentication is done by sending a Basic HTTP Authorization 
header.

**Syntax: ocs/v1.php/cloud/apps/{appid}**

* HTTP method: POST

Status codes:

* 100 - successful

Example
^^^^^^^
::

  $ curl -X POST http://admin:secret@example.com/ocs/v1.php/cloud/apps/files_texteditor -H "OCS-APIRequest: true"

* Enable the ``files_texteditor`` app

XML output
^^^^^^^^^^

.. code-block:: xml

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
  </ocs>

Disable an app
--------------

Disables the specified app. Authentication is
done by sending a Basic HTTP Authorization header.


**Syntax: ocs/v1.php/cloud/apps/{appid}**

* HTTP method: DELETE

Status codes:

* 100 - successful

Example
^^^^^^^
::

  $ curl -X DELETE http://admin:secret@example.com/ocs/v1.php/cloud/apps/files_texteditor -H "OCS-APIRequest: true"

* Disable the ``files_texteditor`` app

XML output
^^^^^^^^^^

.. code-block:: xml

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
  </ocs>
  
