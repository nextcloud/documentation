=========================
Instruction set for users
=========================

Add a new user
--------------

Create a new user on the Nextcloud server. Authentication is done by sending a
basic HTTP authentication header.

**Syntax: ocs/v1.php/cloud/users**

* HTTP method: POST
* POST argument: userid - string, the required username for the new user
* POST argument: password - string, the password for the new user, leave empty to send welcome mail
* POST argument: displayName - string, the display name for the new user
* POST argument: email - string, the email for the new user, required if password empty
* POST argument: groups - array, the groups for the new user
* POST argument: subadmin - array, the groups in which the new user is subadmin
* POST argument: quota - string, quota for the new user
* POST argument: language - string, language for the new user

Status codes:

* 101 - invalid argument
* 102 - user already exists
* 103 - cannot create sub-admins for admin group
* 104 - group does not exist
* 105 - insufficient privileges for group
* 106 - no group specified (required for sub-admins)
* 107 - hint exceptions
* 108 - an email address is required, to send a password link to the user.
* 109 - sub-admin group does not exist
* 110 - required email address was not provided
* 111 - could not create non-existing user ID

Example
^^^^^^^
::

  $ curl -X POST http://admin:secret@example.com/ocs/v1.php/cloud/users -d userid="Frank" -d password="frankspassword" -H "OCS-APIRequest: true"

* Creates the user ``Frank`` with password ``frankspassword``
* optionally groups can be specified by one or more ``groups[]`` query parameters:
  ``URL -d groups[]="admin" -D groups[]="Team1"``

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
  <data/>
 </ocs>

Search/get users
----------------

Retrieves a list of users from the Nextcloud server. Authentication is done by
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
::

  $ curl -X GET http://admin:secret@example.com/ocs/v1.php/cloud/users?search=Frank -H "OCS-APIRequest: true"

* Returns list of users matching the search string.

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

Get data of a single user
-------------------------

Retrieves information about a single user. Authentication is done by sending a
Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}**

* HTTP method: GET

Status codes:

* 100 - successful

Example
^^^^^^^

::

  $ curl -X GET http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank -H "OCS-APIRequest: true"

* Returns information on the user ``Frank``

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
      <enabled>true</enabled>
      <id>Frank</id>
      <quota>0</quota>
      <email>frank@example.org</email>
      <displayname>Frank K.</displayname>
      <display-name>Frank K.</display-name>
      <phone>0123 / 456 789</phone>
      <address>Foobar 12, 12345 Town</address>
      <website>https://nextcloud.com</website>
      <twitter>Nextcloud</twitter>
      <groups>
       <element>group1</element>
       <element>group2</element>
      </groups>
    </data>
  </ocs>

Edit data of a single user
--------------------------

Edits attributes related to a user. Users are able to edit email, displayname
and password; admins can also edit the quota value. Further restrictions may apply,
check the `List of editable data fields`_ endpoint. Authentication
is done by sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}**

* HTTP method: PUT
* PUT argument: key, the field to edit:

  + email
  + quota
  + displayname
  + display (**deprecated** use `displayname` instead)
  + phone
  + address
  + website
  + twitter
  + password

* PUT argument: value, the new value for the field

Status codes:

* 101 - invalid argument
* 107 - password policy (hint exception)
* 112 - Setting the password is not supported by the users backend
* 113 - editing field not allowed / field doesn’t exist

Examples
^^^^^^^^

::

  $ curl -X PUT http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank -d key="email" -d value="franksnewemail@example.org" -H "OCS-APIRequest: true"

* Updates the email address for the user ``Frank``

::

  $ curl -X PUT http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank -d key="quota" -d value="100MB" -H "OCS-APIRequest: true"

* Updates the quota for the user ``Frank``

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

.. _editable_field_list:

List of editable data fields
----------------------------

Edits attributes related to a user. Users are able to edit email, displayname
and password; admins can also edit the quota value. Authentication is done by
sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/user/fields**

* HTTP method: GET

Status codes:

* 100 - successful

Examples
^^^^^^^^

::

  $ curl -X GET http://admin:secret@example.com/ocs/v1.php/cloud/user/fields -H "OCS-APIRequest: true"

* Gets the list of fields

XML output
^^^^^^^^^^

.. code-block:: xml

  <?xml version="1.0"?>
  <ocs>
   <meta>
    <status>ok</status>
    <statuscode>100</statuscode>
    <message>OK</message>
   </meta>
   <data>
    <element>displayname</element>
    <element>email</element>
    <element>phone</element>
    <element>address</element>
    <element>website</element>
    <element>twitter</element>
   </data>
  </ocs>


Disable a user
--------------

Disables a user on the Nextcloud server so that the user cannot login anymore.
Authentication is done by sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}/disable**

* HTTP method: PUT

Statuscodes:

* 100 - successful
* 101 - failure

Example
^^^^^^^

::

  $ curl -X PUT http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank/disable -H "OCS-APIRequest: true"

* Disables the user ``Frank``

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
    <data/>
  </ocs>

Enable a user
-------------

Enables a user on the Nextcloud server so that the user can login again.
Authentication is done by sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}/enable**

* HTTP method: PUT

Statuscodes:

* 100 - successful
* 101 - failure

Example
^^^^^^^

::

  $ curl -X PUT http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank/enable -H "OCS-APIRequest: true"

* Enables the user ``Frank``

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
    <data/>
  </ocs>

Delete a user
-------------

Deletes a user from the Nextcloud server. Authentication is done by sending a
Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}**

* HTTP method: DELETE

Statuscodes:

* 100 - successful
* 101 - failure

Example
^^^^^^^

::

  $ curl -X DELETE http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank -H "OCS-APIRequest: true"

* Deletes the user ``Frank``

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

Get user's groups
-----------------

Retrieves a list of groups the specified user is a member of. Authentication is
done by sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}/groups**

* HTTP method: GET

Status codes:

* 100 - successful

Example
^^^^^^^

::

  $ curl -X GET http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank/groups -H "OCS-APIRequest: true"

* Retrieves a list of groups of which ``Frank`` is a member

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
        <element>group1</element>
      </groups>
    </data>
  </ocs>

Add user to group
-----------------

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

::

  $ curl -X POST http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank/groups -d groupid="newgroup" -H "OCS-APIRequest: true"

* Adds the user ``Frank`` to the group ``newgroup``

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

Remove user from group
----------------------

Removes the specified user from the specified group. Authentication is done by
sending a Basic HTTP Authorization header.

**Syntax: ocs/v1.php/cloud/users/{userid}/groups**

* HTTP method: DELETE
* DELETE argument: groupid, string - the group to remove the user from

Status codes:

* 100 - successful
* 101 - no group specified
* 102 - group does not exist
* 103 - user does not exist
* 104 - insufficient privileges
* 105 - failed to remove user from group

Example
^^^^^^^

::

  $ curl -X DELETE http://admin:secret@example.com/ocs/v1.php/cloud/users/Frank/groups -d groupid="newgroup" -H "OCS-APIRequest: true"

* Removes the user ``Frank`` from the group ``newgroup``

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

Promote user to subadmin
------------------------

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

::

  $ curl -X POST https://admin:secret@example.com/ocs/v1.php/cloud/users/Frank/subadmins -d groupid="group" -H "OCS-APIRequest: true"

* Makes the user ``Frank`` a subadmin of the ``group`` group

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

Demote user from subadmin
-------------------------

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

::

  $ curl -X DELETE https://admin:secret@example.com/ocs/v1.php/cloud/users/Frank/subadmins -d groupid="oldgroup" -H "OCS-APIRequest: true"

* Removes ``Frank's`` subadmin rights from the ``oldgroup`` group

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

Get user's subadmin groups
--------------------------

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

::

  $ curl -X GET https://admin:secret@example.com/ocs/v1.php/cloud/users/Frank/subadmins -H "OCS-APIRequest: true"

* Returns the groups of which ``Frank`` is a subadmin

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
      <element>testgroup</element>
    </data>
  </ocs>

Resend the welcome email
------------------------

The request to this endpoint triggers the welcome email for this user again.

**Syntax: ocs/v1.php/cloud/users/{userid}/welcome**

* HTTP method: POST

Status codes:

* 100 - successful
* 101 - email address not available
* 102 - sending email failed

Example
^^^^^^^

::

  $ curl -X POST https://admin:secret@example.com/ocs/v1.php/cloud/users/Frank/welcome -H "OCS-APIRequest: true"

* Sends the welcome email to ``Frank``

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
    <data/>
  </ocs>
