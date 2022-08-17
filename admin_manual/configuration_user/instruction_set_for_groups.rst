==========================
Instruction set for groups
==========================  

Search/get groups
-----------------

Retrieves a list of groups from the Nextcloud server. Authentication is done by 
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
::

  $ curl -X GET http://admin:secret@example.com/ocs/v1.php/cloud/groups?search=adm

* Returns list of groups matching the search string.

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
      <groups>
        <element>admin</element>
      </groups>
    </data>
  </ocs>

Create a group
--------------

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
::

  $ curl -X POST http://admin:secret@example.com/ocs/v1.php/cloud/groups -d groupid="newgroup"

* Adds a new group called ``newgroup``

XML output
^^^^^^^^^^

.. code-block:: xml

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
    <data/>
  </ocs>

Get members of a group
----------------------

Retrieves a list of group members. Authentication is done by sending a Basic 
HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/groups/{groupid}**

* HTTP method: GET

Status codes:

* 100 - successful

Example
^^^^^^^
::

  $ curl -X GET http://admin:secret@example.com/ocs/v1.php/cloud/groups/admin

* Returns a list of users in the ``admin`` group

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
      <users>
        <element>Frank</element>
      </users>
    </data>
  </ocs>
  
Get subadmins of a group
------------------------

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
::

  $ curl -X GET https://admin:secret@example.com/ocs/v1.php/cloud/groups/mygroup/subadmins

* Return the subadmins of the group: ``mygroup``

XML output
^^^^^^^^^^

.. code-block:: xml

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

Edit data of a single group
---------------------------

Edits attributes related to a group. Authentication
is done by sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/groups/{groupid}**

* HTTP method: PUT
* PUT argument: key, string - the field to edit:

  + displayname

* PUT argument: value, string - the new value for the field

Status codes:

* 100 - successful
* 101 - not supported by backend

Examples
^^^^^^^^

::

  $ curl -X PUT http://admin:secret@example.com/ocs/v1.php/cloud/groups/mygroup -d key="displayname" -d value="My Group Name"

* Updates the display name for the group ``mygroup``

XML output
^^^^^^^^^^

.. code-block:: xml

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
    <data/>
  </ocs>

Delete a group
--------------

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
::

  $ curl -X DELETE http://admin:secret@example.com/ocs/v1.php/cloud/groups/mygroup

* Delete the group ``mygroup``

XML output
^^^^^^^^^^

.. code-block:: xml

  <?xml version="1.0"?>
  <ocs>
    <meta>
      <statuscode>100</statuscode>
      <status>ok</status>
    </meta>
    <data/>
  </ocs>
