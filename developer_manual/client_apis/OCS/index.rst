.. _webdavindex:

=========
OCS API's
=========

This document provides a quick overview of the OCS API endpoints supported in Nextcloud.

All requests need to provide authentication information, either as a Basic Auth header or by passing a set of valid session cookies, if not stated otherwise.


----
Testing requests with curl
----

All OCS requests can be easily tested out using :code:`curl` by specifying the request method (:code:`GET`, :code:`PUT`, etc) and setting a request body where needed.

For example: you can perform a :code:`GET` request to get information about a user:


.. code-block:: bash

    curl -u username:password -X GET 'https://cloud.example.com/ocs/v1.php/...' -H "OCS-APIRequest: true"


-------------
User metadata
-------------

Since: 11.0.2, 12.0.0

This request returns the available metadata of a user. Admin users can see the information of all users, while a default user only can access it's own metadata.

.. code::

	GET /ocs/v1.php/cloud/users/USERID


.. code:: xml

	<?xml version="1.0"?>
	<ocs>
		<meta>
			<status>ok</status>
			<statuscode>100</statuscode>
			<message>OK</message>
			<totalitems></totalitems>
			<itemsperpage></itemsperpage>
		</meta>
		<data>
			<enabled>true</enabled>
			<quota>
				<free>338696790016</free>
				<used>7438874</used>
				<total>338704228890</total>
				<relative>0</relative>
				<quota>-3</quota>
			</quota>
			<email>user@foo.de</email>
			<displayname>admin</displayname>
			<phone></phone>
			<address></address>
			<webpage></webpage>
			<twitter>schiessle</twitter>
		</data>
	</ocs>


----
Capabilities API
----

Clients can obtain capabilities provided by the Nextcloud server and its apps via the capabilities OCS API.

.. code::

	GET /ocs/v1.php/cloud/capabilities
	
	
	
.. code:: xml

    <?xml version="1.0"?>
    <ocs>
     <meta>
      <status>ok</status>
      <statuscode>100</statuscode>
      <message>OK</message>
      <totalitems></totalitems>
      <itemsperpage></itemsperpage>
     </meta>
     <data>
      <version>
       <major>12</major>
       <minor>0</minor>
       <micro>0</micro>
       <string>12.0 beta 4</string>
       <edition></edition>
      </version>
      <capabilities>
       <core>
        <pollinterval>60</pollinterval>
        <webdav-root>remote.php/webdav</webdav-root>
       </core>
      </capabilities>
     </data>
    </ocs>
     
	
Theming capabilities
--------------------

Values of the theming app are exposed though the capabilities API, allowing client developers to adjust the look of clients to the theming of different Nextcloud instances.

.. code:: xml

    <theming>
        <name>Nextcloud</name>
        <url>https://nextcloud.com</url>
        <slogan>A safe home for all your data</slogan>
        <color>#0082c9</color>
        <logo>http://cloud.example.com/index.php/apps/theming/logo?v=1</logo>
        <background>http://cloud.example.com/index.php/apps/theming/logo?v=1</background>
    </theming>


The background value can either be an URL to the background image or a hex color value.

