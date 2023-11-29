=================
OCS APIs overview
=================

This document provides a quick overview of the OCS API endpoints supported in Nextcloud.

All requests need to provide authentication information, either as a Basic Auth header or by passing a set of valid session cookies, if not stated otherwise.

Authentication
--------------

Authentication can happen either via username / password (or app token) or with OIDC tokens, see the examples below:


Username/Password:

.. code-block:: bash

    curl -u username:password -X GET 'https://cloud.example.com/ocs/v1.php/...' -H "OCS-APIRequest: true"


OIDC Token:

.. code-block:: bash

    curl -X GET 'https://cloud.example.com/ocs/v1.php/...' -H "OCS-APIRequest: true" -H "Authorization: Bearer ID_TOKEN"

Testing requests with curl
--------------------------

All OCS requests can be easily tested out using :code:`curl` by specifying the request method (:code:`GET`, :code:`PUT`, etc) and setting a request body where needed.

For example: you can perform a :code:`GET` request to get information about a user:


.. code-block:: bash

    curl -u username:password -X GET 'https://cloud.example.com/ocs/v1.php/...' -H "OCS-APIRequest: true"


User metadata
-------------

Since: 11.0.2, 12.0.0

This request returns the available metadata of a user. Admin users can see the information of all users, while a default user only can access their own metadata.

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
			<display-name>John Doe</display-name>
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
		<color-element>#0082c9</color-element>
		<color-element-bright>#aaaaaa</color-element-bright>
		<color-element-dark>#555555</color-element-dark>
		<logo>http://cloud.example.com/index.php/apps/theming/logo?v=1</logo>
		<background>http://cloud.example.com/index.php/apps/theming/logo?v=1</background>
		<background-plain></background-plain>
		<background-default></background-default>
	</theming>

For elements like radio buttons, input borders and more, instead of the primary ``color`` value, the ``color-element-bright`` should be used on bright background and ``color-element-dark`` on dark background.
This when the primary color is e.g. set to ``#000000`` the ``color-elemenet-dark`` will be set to ``#555555`` so items are still visible. In the Nextcloud web UI only the top header uses ``color``, everything else uses ``color-element-*``.
Text and icons on these elements should use ``color-text``.


The background value can either be a URL to the background image or a hex color value.

Direct Download
---------------

It might be required to give a 3rd party access to a file however you do not
want to hand over credentials to the 3rd party. An example of this is playing
files in an external media player on mobile devices.

To solve this issue there is a way to request a unique public link to a single file.
This link will be valid for 8 hours afterwards it will be removed.

To obtain a direct link:

.. code::

	POST /ocs/v2.php/apps/dav/api/v1/direct

With the :code:`fileId` in the body (so :code:`fileId=42` for example).
This will then return you the link to use to obtain the file.

Notifications
-------------

There is also the `Notifications API <https://github.com/nextcloud/notifications/blob/master/docs/ocs-endpoint-v2.md>`_
As well as documentation on how to `Register a device for push notifications <https://github.com/nextcloud/notifications/blob/5a2d3607952bad675e4057620a9c7de8a7f84f0b/docs/push-v3.md>`_

Auto-complete and user search
-----------------------------

It is possible to search for users using the auto-complete API, used to auto-complete usernames in comments, chat or to find guest accounts. The code `can be found here <https://github.com/nextcloud/server/blob/master/core/Controller/AutoCompleteController.php#L69>`_

An example curl command would be:

.. code::

     curl -i -u master -X GET -H "OCS-APIRequest: true" 'https://my.nextcloud/ocs/v2.php/core/autocomplete/get?search=JOANNE%40EMAIL.ISP&itemType=%20&itemId=%20&shareTypes[]=8&limit=2'

That would look for JOANNE@EMAIL.ISP as guest user. Maximum 2 results to be returned for a regular user, the
shareTypes array would carry only "8". ``itemType`` and ``itemId`` are left out (set to a white space),
essentially they are to give context about the use case, so sorters can do their work (like who commented last).
It can be an option for filtering on a later stage but you can also leave them out as per the below example.

.. code::

     curl -i -u master -X GET -H "OCS-APIRequest: true" 'https://my.nextcloud/ocs/v2.php/core/autocomplete/get?search=JOANNE%40EMAIL.ISP&shareTypes[]=8&limit=2'

The shareType defaults to regular users if you left it out), the limit defaults to 10.

Filtering the auto-complete results
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In case needed, you can also further filter the auto-complete results on the PHP side using the
``OCP\Collaboration\AutoComplete\AutoCompleteEvent`` event. The event gives you access to the current
result set, the item and share types and some more information that you can use to e.g. limit the autocomplete
results to users that are actually in the current chat conversation.
