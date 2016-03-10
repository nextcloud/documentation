=====================
User Provisioning API
=====================

The Provisioning API application enables a set of APIs that external systems can use to create, 
edit, delete and query user attributes, query, set and remove groups, set quota 
and query total storage used in ownCloud. Group admin users can also query 
ownCloud and perform the same functions as an admin for groups they manage. The 
API also enables an admin to query for active ownCloud applications, application 
info, and to enable or disable an app remotely. HTTP 
requests can be used via a Basic Auth header to perform any of the functions 
listed above. The Provisioning API app is enabled by default.

The base URL for all calls to the share API is **owncloud_base_url/ocs/v1.php/cloud**.

Instruction Set For Users
=========================

**users / adduser**
-------------------

Create a new user on the ownCloud server. Authentication is done by sending a 
basic HTTP authentication header.

**Syntax: ocs/v1.php/cloud/users**

* HTTP method: POST
* POST argument: userid - string, the required username for the new user
* POST argument: password - string, the required password for the new user

Status codes:

* 100 - successful
* 101 - invalid input data
* 102 - username already exists
* 103 - unknown error occurred whilst adding the user

Example
^^^^^^^

* POST ``http://admin:secret@example.com/ocs/v1.php/cloud/users -d 
  userid="Frank" -d password="frankspassword"``
* Creates the user ``Frank`` with password ``frankspassword``

XML Output
^^^^^^^^^^

::

 <?xml version="1.0"?>
 <ocs>
  <meta>
   <status>ok</status>
   <statuscode>100</statuscode>
   <message/>
  </meta>
  <data/>
 </ocs>

**users / getusers**
--------------------

Retrieves a list of users from the ownCloud server. Authentication is done by 
sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users**

* HTTP method: GET
* url arguments: search - string, optional search string
* url arguments: limit - int, optional limit value
* url arguments: offset - int, optional offset value

Status codes:

* 100 - successful

Example
^^^^^^^

* GET ``http://admin:secret@example.com/ocs/v1.php/cloud/users?search=Frank``
* Returns list of users matching the search string.

XML Output
^^^^^^^^^^

::

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

**users / getuser**
-------------------

Retrieves information about a single user. Authentication is done by sending a 
Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}**

* HTTP method: GET

Status codes:

* 100 - successful

Example
^^^^^^^

  * GET ``http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank``
  * Returns information on the user ``Frank``

XML Output
^^^^^^^^^^

::

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

**users / edituser**
--------------------

Edits attributes related to a user. Users are able to edit email, displayname 
and password; admins can also edit the quota value. Authentication is done by 
sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}**

* HTTP method: PUT
* PUT argument: key, the field to edit (email, quota, display, password)
* PUT argument: value, the new value for the field

Status codes:

* 100 - successful
* 101 - user not found
* 102 - invalid input data

Examples
^^^^^^^^

  * PUT ``PUT http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank -d 
    key="email" -d value="franksnewemail@example.org"``
  * Updates the email address for the user ``Frank``
  
  * PUT ``PUT http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank -d 
    key="quota" -d value="100MB"``
  * Updates the quota for the user ``Frank``
  
XML Output
^^^^^^^^^^

::

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
    <data/>
  </ocs>

**users / deleteuser**
----------------------

Deletes a user from the ownCloud server. Authentication is done by sending a 
Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}**

* HTTP method: DELETE

Statuscodes:

* 100 - successful
* 101 - failure

Example
^^^^^^^

  * DELETE ``http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank``
  * Deletes the user ``Frank``

XML Output
^^^^^^^^^^

::

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
    <data/>
  </ocs>

**users / getgroups**
---------------------

Retrieves a list of groups the specified user is a member of. Authentication is 
done by sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}/groups**

* HTTP method: GET

Status codes:

* 100 - successful

Example
^^^^^^^

  * GET  ``http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank/groups``
  * Retrieves a list of groups of which ``Frank`` is a member

XML Output
^^^^^^^^^^

::

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

**users / addtogroup**
----------------------

Adds the specified user to the specified group. Authentication is done by 
sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}/groups**

* HTTP method: POST
* POST argument: groupid, string - the group to add the user to

Status codes:

* 100 - successful
* 101 - no group specified
* 102 - group does not exist
* 103 - user does not exist
* 104 - insufficient privileges
* 105 - failed to add user to group

Example
^^^^^^^

  * POST ``http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank/groups 
    -d groupid="newgroup"``
  * Adds the user ``Frank`` to the group ``newgroup``

XML Output
^^^^^^^^^^

::

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
    <data/>
  </ocs>

**users / removefromgroup**
---------------------------

Removes the specified user from the specified group. Authentication is done by 
sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}/groups**

* HTTP method: DELETE
* POST argument: groupid, string - the group to remove the user from

Status codes:

* 100 - successful
* 101 - no group specified
* 102 - group does not exist
* 103 - user does not exist
* 104 - insufficient privileges
* 105 - failed to remove user from group

Example
^^^^^^^

  * DELETE 
    ``http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank/groups -d 
    groupid="newgroup"``
  * Removes the user ``Frank`` from the group ``newgroup``

XML Output
^^^^^^^^^^

::

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
    <data/>
  </ocs>
  
**users / createsubadmin**
--------------------------

Makes a user the subadmin of a group. Authentication is done by sending a Basic 
HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}/subadmins**

* HTTP method: POST
* POST argument: groupid, string - the group of which to make the user a 
  subadmin

Status codes:

* 100 - successful
* 101 - user does not exist
* 102 - group does not exist
* 103 - unknown failure

Example
^^^^^^^

  * POST 
    ``https://admin:secret@example.com/ocs/v1.php/cloud/users/Frank/subadmins 
    -d groupid="group"``
  * Makes the user ``Frank`` a subadmin of the ``group`` group

XML Output
^^^^^^^^^^

::

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
    <data/>
  </ocs>

**users / removesubadmin**
--------------------------

Removes the subadmin rights for the user specified from the group specified. 
Authentication is done by sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}/subadmins**

* HTTP method: DELETE
* DELETE argument: groupid, string - the group from which to remove the user's 
  subadmin rights

Status codes:

* 100 - successful
* 101 - user does not exist
* 102 - user is not a subadmin of the group / group does not exist
* 103 - unknown failure

Example
^^^^^^^

  * DELETE 
    ``https://admin:secret@example.com/ocs/v1.php/cloud/users/Frank/subadmins 
    -d groupid="oldgroup"``
  * Removes ``Frank's`` subadmin rights from the ``oldgroup`` group

XML Output
^^^^^^^^^^

::

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
    <data/>
  </ocs>
  
**users / getsubadmingroups**
-----------------------------

Returns the groups in which the user is a subadmin. Authentication is done by 
sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}/subadmins**

* HTTP method: GET

Status codes:

* 100 - successful
* 101 - user does not exist
* 102 - unknown failure

Example
^^^^^^^

  * GET 
    ``https://admin:secret@example.com/ocs/v1.php/cloud/users/Frank/subadmins``
  * Returns the groups of which ``Frank`` is a subadmin

XML Output
^^^^^^^^^^

::

  <?xml version="1.0"?>
  <ocs>
    <meta>
        <status>ok</status>
        <statuscode>100</statuscode>
      <message/>
    </meta>
    <data>
      <element>testgroup</element>
    </data>
  </ocs>  
  
Instruction Set For Groups
==========================  

**groups / getgroups**
----------------------

Retrieves a list of groups from the ownCloud server. Authentication is done by 
sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/groups**

* HTTP method: GET
* url arguments: search - string, optional search string
* url arguments: limit - int, optional limit value
* url arguments: offset - int, optional offset value

Status codes:

* 100 - successful

Example
^^^^^^^

  * GET ``http://admin:secret@example.com/ocs/v1.php/cloud/groups?search=adm``
  * Returns list of groups matching the search string.

XML Output
^^^^^^^^^^

::

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

**groups / addgroup**
---------------------

Adds a new group. Authentication is done by
sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/groups**

* HTTP method: POST
* POST argument: groupid, string - the new groups name

Status codes:

* 100 - successful
* 101 - invalid input data
* 102 - group already exists
* 103 - failed to add the group

Example
^^^^^^^

  * POST ``http://admin:secret@example.com/ocs/v1.php/cloud/groups -d 
    groupid="newgroup"``
  * Adds a new group called ``newgroup``

XML Output
^^^^^^^^^^

::

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
    <data/>
  </ocs>

**groups / getgroup**
---------------------

Retrieves a list of group members. Authentication is done by sending a Basic 
HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/groups/{groupid}**

* HTTP method: GET

Status codes:

* 100 - successful

Example
^^^^^^^

  * POST ``http://admin:secret@example.com/ocs/v1.php/cloud/groups/admin``
  * Returns a list of users in the ``admin`` group

XML Output
^^^^^^^^^^

::

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
  
**groups / getsubadmins**
-------------------------

Returns subadmins of the group. Authentication is done by
sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/groups/{groupid}/subadmins**
      
* HTTP method: GET

Status codes:

* 100 - successful
* 101 - group does not exist
* 102 - unknown failure

Example
^^^^^^^

  * GET 
    ``https://admin:secret@example.com/ocs/v1.php/cloud/groups/mygroup/subadmins``
  * Return the subadmins of the group: ``mygroup``

XML Output
^^^^^^^^^^

::

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <status>ok</status>
      <statuscode>100</statuscode>
      <message/>
    </meta>
    <data>
      <element>Tom</element>
    </data>
  </ocs>  

**groups / deletegroup**
------------------------

Removes a group. Authentication is done by
sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/groups/{groupid}**

* HTTP method: DELETE

Status codes:

* 100 - successful
* 101 - group does not exist
* 102 - failed to delete group

Example
^^^^^^^

  * DELETE ``http://admin:secret@example.com/ocs/v1.php/cloud/groups/mygroup``
  * Delete the group ``mygroup``

XML Output
^^^^^^^^^^

::

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
    <data/>
  </ocs>
  
Instruction Set For Apps
=========================  

**apps / getapps**
------------------

Returns a list of apps installed on the ownCloud server. Authentication is done 
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

  * GET ``http://admin:secret@example.com/ocs/v1.php/cloud/apps?filter=enabled``
  * Gets enabled apps

XML Output
^^^^^^^^^^

::

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

**apps / getappinfo**
---------------------

Provides information on a specific application. Authentication is done by 
sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/apps/{appid}**

* HTTP method: GET

Status codes:

* 100 - successful

Example
^^^^^^^

  * GET ``http://admin:secret@example.com/ocs/v1.php/cloud/apps/files``
  * Get app info for the ``files`` app

XML Output
^^^^^^^^^^

::

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

**apps / enable**
-----------------

Enable an app.  Authentication is done by sending a Basic HTTP Authorization 
header.

**Syntax: ocs/v1.php/cloud/apps/{appid}**

* HTTP method: POST

Status codes:

* 100 - successful

Example
^^^^^^^

  * POST ``http://admin:secret@example.com/ocs/v1.php/cloud/apps/files_texteditor``
  * Enable the ``files_texteditor`` app

XML Output
^^^^^^^^^^

::

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
  </ocs>

**apps / disable**
------------------

Disables the specified app. Authentication is
done by sending a Basic HTTP Authorization header.


**Syntax: ocs/v1.php/cloud/apps/{appid}**

* HTTP method: DELETE

Status codes:

* 100 - successful

Example
^^^^^^^

  * DELETE ``http://admin:secret@example.com/ocs/v1.php/cloud/apps/files_texteditor``
  * Disable the ``files_texteditor`` app

XML Output
^^^^^^^^^^

::

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
  </ocs>
  
