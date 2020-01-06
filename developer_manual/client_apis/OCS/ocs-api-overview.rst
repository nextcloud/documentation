=================
OCS APIs overview
=================

This document provides a quick overview of the OCS API endpoints supported in Nextcloud.

All requests need to provide authentication information, either as a Basic Auth header or by passing a set of valid session cookies, if not stated otherwise.


Testing requests with curl
--------------------------

All OCS requests can be easily tested out using :code:`curl` by specifying the request method (:code:`GET`, :code:`PUT`, etc) and setting a request body where needed.

For example: you can perform a :code:`GET` request to get information about a user:


.. code-block:: bash

    curl -u username:password -X GET 'https://cloud.example.com/ocs/v1.php/...' -H "OCS-APIRequest: true"


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
			<enabled>1</enabled>
			<storageLocation>/path/to/storage/location/userid</storageLocation>
			<id>userid</id>
			<lastLogin>1578283711000</lastLogin>
			<backend>Database</database>
			<subadmin/>
			<quota>
				<free>20632824998</free>
				<used>842011482</used>
				<total>21474836480</total>
				<relative>3.92</relative>
				<quota>21474836480</quota>
			</quota>
			<email>user@foo.de</email>
			<displayname>John Doe</displayname>
			<phone></phone>
			<address></address>
			<website>https://example.com</website>
			<twitter></twitter>
			<groups>
				<element>1st group</element>
				<element>2nd group</element>
				<element>3rd group</element>
				<element>... group</element>
			</groups>
			<language>de</language>
			<locale>de_DE</locale>
			<backendCapabilities>
				<setDisplayName>1</setDisplayName>
				<setPassword>1</setPassword>
			</backendCapabilities>
		</data>
	</ocs>


User metadata - List user IDs
-----------------------------

This request returns a list containing all user IDs. Only admin users can query the list.

.. code::

	GET /ocs/v1.php/cloud/users


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
			<users>
				<element>1st_user</element>
				<element>2nd_user</element>
				<element>3rd_user</element>
				<element>..._user</element>
			</users>
		</data>
	</ocs>



Capabilities API
----------------

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
				<major>17</major>
				<minor>0</minor>
				<micro>2</micro>
				<string>17.0.2</string>
				<edition></edition>
				<extendedSupport></extendedSupport>
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

Values of the theming app are exposed through the capabilities API, allowing client developers to adjust the look of clients to the theming of different Nextcloud instances.

.. code:: xml

	<theming>
		<name>Nextcloud</name>
		<url>https://nextcloud.com</url>
		<slogan>A safe home for all your data</slogan>
		<color>#0082c9</color>
		<color-text>#ffffff</color-text>
		<color-element>#006295</color-element>
		<logo>http://cloud.example.com/index.php/apps/theming/logo?v=1</logo>
		<background>http://cloud.example.com/index.php/apps/theming/logo?v=1</background>
		<background-plain></background-plain>
		<background-default></background-default>
	</theming>


The background value can either be an URL to the background image or a hex color value.

Direct Download
---------------

It might be required to give a 3rd party access to a file however you do not
want to hand over credentials to the 3rd party. An example of this is playing
files in an external media player on mobile devices.

To solve this issue there is a way to request a unique public link to a single file.
This link will be valid for 24 hours afterwards it will be removed.

To obtain a direct link:

.. code::

	POST /ocs/v2.php/apps/dav/api/v1/direct

With the :code:`fileId` in the body (so :code:`fileId=42` for example).
This will then return you the link to use to obtain the file.

Notifications
-------------

There is also the `Notifications API <https://github.com/nextcloud/notifications/blob/master/docs/ocs-endpoint-v2.md>`_
As well as documentation on how to `Register a device for push notifications <https://github.com/nextcloud/notifications/blob/5a2d3607952bad675e4057620a9c7de8a7f84f0b/docs/push-v3.md>`_
