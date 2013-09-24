1 Installation
==============
To install the Provisioning API do the following:
Unpack the tar-file your downloaded as superuser with:

* tar zxvf file.tar.gz	or
* tar jxvf file.tar.bz2
* copy the files into /owncloud/apps

2 Startup
=========
Just klick on the enable button inside apps in the admin backend

3 Instruction set
=================

3.1 users / adduser
---------------

Create a new user on the cloud server. Only authenticated administrator users are allowed to access this method. Authentication is done by sending a basic HTTP authentication header.
* syntax: /v1/cloud/users
* HTTP method: POST
* POST argument: userid - string, the required username for the new user
* POST argument: password - string, the required password for the new user
* Statuscodes:
** 100 - successful
** 101 - invalid input data
** 102 - username already in user
** 103 - unknown error occurred whilst adding the user

::

	Example: 

	* POST http://frank:password@myowncloud.org/ocs/v1.php/cloud/users -d user="Frank" -d password="frankspassword"
	* Creates the user 'Frank' with password 'frankspassword'
	* And the following XML-output

.. code-block::

	**XML-Output:**
	<?xml version="1.0"?>
	<ocs>
		<meta>
			<status>ok</status>
			<statuscode>100</statuscode>
			<message></message>
		</meta>
		<data/>
	</ocs>


3.2 users / getusers
----------------

Retrives a list of users from the cloud server. Only authenticated administrator users are allowed to access this method. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/users
* HTTP method: GET
* url arguments: search - string, optional search string
* url arguments: limit - int, optional limit value
* url arguments: offset - int, optional offset value
* Statuscodes:
** 100 - successful

::

	Example: 
	* GET http://frank:password@myowncloud.org/ocs/v1.php/cloud/users?search=Frank
	* Returns list of users matching the search string.

.. code-block::

	**XML-Output:**
	<?xml version="1.0"?>
	<ocs>
		<meta>
			<statuscode>100</statuscode>
			<status>ok</status>
		</meta>
	<data>
        <users>
            <element>Frank</element>
        </users>
    </data>
</ocs>

3.3 users / getuser
---------------

Retrives information about a single user. Only authenticated administrator users, or the user itself can access this method. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/users/{userid}
* HTTP method: GET
* Statuscodes:
** 100 - successful
** 101 - user not found

::

	Example: 
	* GET http://frank:password@myowncloud.org/ocs/v1.php/cloud/users/Frank
	* Returns information on the user 'Frank'

.. code-block::

	**XML-Output:** 

	<?xml version="1.0"?>
	<ocs>
		<meta>
			<statuscode>100</statuscode>
			<status>ok</status>
		</meta>
		<data>
			<email>frank@example.org</email>
			<quota>0</quota>
			<enabled>true</enabled>
		</data>
	</ocs>

3.4 users / edituser
----------------

Edits attributes related to a user. Only authenticated administrator users, or the user itself can access this method. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/users/{userid}
* HTTP method: PUT
* PUT argument: email, string the new email
* PUT argument: quota, int the new quota in bytes
* PUT argument: enabled, int (0 or 1)
* Statuscodes:
** 100 - successful
** 101 - user not found
** 102 - invalid input data

::

	Example: 
	* PUT http://frank:password@myowncloud.org/ocs/v1.php/cloud/users/Frank -d email="franksnewemail@example.org"
	* Updates the email address for the user 'Frank'

.. code-block::

	**XML-Output:**
	<?xml version="1.0"?>
	<ocs>
		<meta>
			<statuscode>100</statuscode>
			<status>ok</status>
		</meta>
		<data/>
	</ocs>

3.5 users / deleteuser
------------------

Deletes a user from the cloud server. Only authenticated administrator users are allowed to access this method. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/users/{userid}
* HTTP method: DELETE
* Statuscodes:
** 100 - successful
** 101 - failure

::

	Example: 
	* DELETE http://frank:password@myowncloud.org/ocs/v1.php/cloud/users/Frank
	* Deletes the use 'Frank'

.. code-block::

	**XML-Output:**
	<?xml version="1.0"?>
	<ocs>
		<meta>
			<statuscode>100</statuscode>
			<status>ok</status>
		</meta>
		<data/>
	</ocs>

3.6 users / getgroups
-----------------

Retrives a list of groups the specified user is a member of. Only authenticated administrator users and the specified user can access this method. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/users/{userid}/groups
* HTTP method: GET
* Statuscodes:
** 100 - successful

::

	Example: 
	* GET http://frank:password@myowncloud.org/ocs/v1.php/cloud/users/Frank/groups
	* Retrives a list of groups 'Frank' is a member of

.. code-block::

	**XML-Output:**
	<?xml version="1.0"?>
	<ocs>
		<meta>
			<statuscode>100</statuscode>
			<status>ok</status>
		</meta>
		<data>
			<groups>
				<element>admin</element>
				<element>group1</element>
			</groups>
		</data>
	</ocs>

3.7 users / addtogroup
------------------

Adds the specified user to the specified group. Only authenticated administrator users are allowed to access this method. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/users/{userid}/groups
* HTTP method: POST
* POST argument: groupid, string - the group to add the user to
* Statuscodes:
** 100 - successful
** 101 - no group specified
** 102 - group doesnt exist
** 103 - user doesn't exist
** 104 - insufficient priveleges
** 105 - failed to add user to group

::

	Example: 
	* POST http://frank:password@myowncloud.org/ocs/v1.php/cloud/users/Frank/groups -d groupid="newgroup"
	* Adds the user 'Frank' to the group 'newgroup'

.. code-block::

	**XML-Output:**
	<?xml version="1.0"?>
	<ocs>
		<meta>
			<statuscode>100</statuscode>
			<status>ok</status>
		</meta>
		<data/>
	</ocs>

3.8 users / removefromgroup
-----------------------

Removes the specified user from the specified group. Only authenticated administrator users are allowed to access this method. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/users/{userid}/groups
* HTTP method: DELETE
* POST argument: groupid, string - the group to remove the user from
* Statuscodes:
** 100 - successful
** 101 - no group specified
** 102 - group doesnt exist
** 103 - user doesn't exist
** 104 - insufficient privileges
** 105 - failed to remove user from group

::

	Example: 
	* DELETE http://frank:password@myowncloud.org/ocs/v1.php/cloud/users/Frank/groups -d groupid="newgroup"
	* Removes the user 'Frank' from the group 'newgroup'

.. code-block::

	**XML-Output:**

	<?xml version="1.0"?>
	<ocs>
		<meta>
			<statuscode>100</statuscode>
			<status>ok</status>
		</meta>
		<data/>
	</ocs>

3.9 groups / getgroups
------------------

Retrives a list of groups from the cloud server. Only authenticated administrator users are allowed to access this method. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/groups
* HTTP method: GET
* url arguments: search - string, optional search string
* url arguments: limit - int, optional limit value
* url arguments: offset - int, optional offset value
* Statuscodes:
** 100 - successful

::

	Example: 
	* GET http://frank:password@myowncloud.org/ocs/v1.php/cloud/groups?search=adm
	* Returns list of groups matching the search string.

.. code-block::

	**XML-Output:**
	<?xml version="1.0"?>
	<ocs>
		<meta>
			<statuscode>100</statuscode>
			<status>ok</status>
		</meta>
		<data>
			<groups>
				<element>admin</element>
			</groups>
		</data>
	</ocs>

3.10 groups / addgroup
-----------------

Adds a new group. Only authenticated administrator users are allowed to access this method. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/groups
* HTTP method: POST
* POST argument: groupid, string - the new groups name
* Statuscodes:
** 100 - successful
** 101 - invalid input data
** 102 - group already exists
** 103 - failed to add the group

::

	Example: 
	* POST http://frank:password@myowncloud.org/ocs/v1.php/cloud/groups -d groupid="newgroup"
	* Adds a new group called 'newgroup'

.. code-block::

	**XML-Output:**
	<?xml version="1.0"?>
	<ocs>
		<meta>
			<statuscode>100</statuscode>
			<status>ok</status>
		</meta>
		<data/>
	</ocs>

3.11 groups / getgroup
-----------------

Retrives a list of group members. Only authenticated administrator users are allowed to access this method. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/groups/{groupid}
* HTTP method: GET
* Statuscodes:
** 100 - successful
** 101 - group doesn't exist

::

	Example: 
	* POST http://frank:password@myowncloud.org/ocs/v1.php/cloud/groups/admin
	* Returns a list of users in the 'admin' group

.. code-block::

	**XML-Output:**
	<?xml version="1.0"?>
	<ocs>
		<meta>
			<statuscode>100</statuscode>
			<status>ok</status>
		</meta>
		<data>
			<users>
				<element>Frank</element>
			</users>
		</data>
	</ocs>

3.12 groups / deletegroup
--------------------

Removes a group. Only authenticated administrator users are allowed to access this method. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/groups/{groupid}
* HTTP method: DELETE
* Statuscodes:
** 100 - successful
** 101 - group doesn't exist
** 102 - failed to delete group

::

	Example: 
	* DELETE http://frank:password@myowncloud.org/ocs/v1.php/cloud/groups/mygroup
	* Delete the group 'mygroup'

.. code-block::

	**XML-Output:**
	<?xml version="1.0"?>
	<ocs>
		<meta>
			<statuscode>100</statuscode>
			<status>ok</status>
		</meta>
		<data/>
	</ocs>

3.13 apps / getapps
-------------------

Returns a list of apps installed on the cloud server. Only authenticated administrator users are allowed to access this method. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/apps/
* HTTP method: GET
* url argument: filter, string - optional ('enabled' or 'disabled')
* Statuscodes:
** 100 - successful
** 101 - invalid input data

::

	Example: 
	* GET http://frank:password@myowncloud.org/ocs/v1.php/cloud/apps?filter=enabled
	* Gets enabled apps

.. code-block::

	**XML-Output:**
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

3.14 apps / getappinfo
-----------------

Provides information on a specific application. Only authenticated administrator users are allowed to access this method. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/apps/{appid}
* HTTP method: GET
* Statuscodes:
** 100 - successful

::

	Example: 
	* GET http://frank:password@myowncloud.org/ocs/v1.php/cloud/apps/files
	* Get app info for the 'files' app

.. code-block::

	**XML-Output:**
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
			<standalone></standalone>
			<default_enable></default_enable>
			<types>
				<element>filesystem</element>
			</types>
		</data>
	</ocs>

3.15 apps / enable
-------------

Enable an app. Only authenticated administrator users are allowed to access this method. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/apps/{appid}
* HTTP method: POST
* Statuscodes:
* 100 - successful

::

	Example: 
	* POST http://frank:password@myowncloud.org/ocs/v1.php/cloud/apps/files_texteditor
	* Enable the 'files_texteditor' app

.. code-block::

	**XML-Output:**

	<?xml version="1.0"?>
	<ocs>
		<meta>
			<statuscode>100</statuscode>
			<status>ok</status>
		</meta>
	</ocs>

3.16 apps / disable
--------------

Disables the specified app. Only authenticated administrator users are allowed to access this method. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/apps/{appid}
* HTTP method: DELETE
* Statuscodes:
** 100 - successful

::

	Example: 
	* DELETE http://frank:password@myowncloud.org/ocs/v1.php/cloud/apps/files_texteditor
	* Disable the 'files_texteditor' app

.. code-block::

	**XML-Output:**
	<?xml version="1.0"?>
	<ocs>
		<meta>
			<statuscode>100</statuscode>
			<status>ok</status>
		</meta>
	</ocs>

3.17 capabilities
------------

Returns information on the capability of the ownCloud server. Authenticated users only. Authentication is done by sending a Basic HTTP Authorisation header.
* syntax: /v1/cloud/capabilities
* HTTP method: GET
* Statuscodes:
** 100 - successful

::

	Example: 
	* GET http://frank:password@myowncloud.org/ocs/v1.php/cloud/capabilities
	* Returns the capabilties of Frank's server.

.. code-block::

	**XML-Output:**

	<?xml version="1.0"?>
	<ocs>
		<meta>
			<status>ok</status>
			<statuscode>100</statuscode>
			<message/>
		</meta>
		<data>
			<version>4.91.2</version>
			<versionstring>5.0 pre alpha</versionstring>
			<edition/>
			<bugfilechunking>true</bugfilechunking>
			<encryption>false</encryption>
			<versioning>false</versioning>
			<undelete>true</undelete>
			<installedapps>
				<element>files</element>
				<element>user_migrate</element>
				<element>admin_migrate</element>
				<element>files_texteditor</element>
				<element>provisioning_api</element>
			</installedapps>
		</data>
	</ocs>
