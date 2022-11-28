============
occ commands
============


Using **--initiator**
^^^^^^^^^^^^^^^^^^^^^

While each command used to manage the Circles of your Nextcloud comes with its own list of arguments and
options, one option is availble to almost all of them: **--initiator**

This option allows you to run the command from the point of view of another user. This is useful if you
want to verify if a user have access to a Circle and its Members, or to a specific operation within a
Circle (add.remove a member, edit its configuration)

The syntax is ``--initiator <userId>``, with userId the account of the user you need to emulate.


Commands related to Circles
^^^^^^^^^^^^^^^^^^^^^^^^^^^


occ circles:manage:create
-------------------------

The first command you need to know; how to create a new Circle!
The command is followed by the local Nextcloud user account that will be the owner of the Circle, and the
name of the Circle itself::

 $ occ circles:manage:create cult "Each one teach one"
 {
     "reading": {
         "message": "Circle '%s' have been created",
         "params": {
             "circleName": "Each one teach one"
         },
         "fail": false,
         "translated": "Circle 'Each one teach one' have been created"
     },
     "data": {
         "circle": {
             "id": "MKGmspLrYoXCx81",
             "name": "Each one teach one",
             "owner": {
                 "id": "KImB12zJpFW4Eff",
                 "circle_id": "MKGmspLrYoXCx81",
                 "single_id": "NkdMRgx64n2qAWp",
                 "user_id": "cult",
                 "user_type": 1,
                 "instance": "cloud.example.net",
                 "level": 9,
                 "status": "Member"
             },
             "initiator": {
                 "id": "KImB12zJpFW4Eff",
                 "circle_id": "MKGmspLrYoXCx81",
                 "single_id": "NkdMRgx64n2qAWp",
                 "user_id": "cult",
                 "user_type": 1,
                 "instance": "cloud.example.net",
                 "level": 9,
                 "status": "Member"
             }
         }
     }
 }





occ circles:manage:list
-----------------------

Once a first Circle is created, you can display the list of available Circles on your instance of Nextcloud::

 $ occ circles:manage:list
 +-----------------+--------------------+------+-------+----------+-------+-------------+
 | ID              | Name               | Type | Owner | Instance | Limit | Description |
 +-----------------+--------------------+------+-------+----------+-------+-------------+
 | MKGmspLrYoXCx81 | Each one teach one | []   | cult  |          | -1    |             |
 +-----------------+--------------------+------+-------+----------+-------+-------------+

.. note :: The ID of the Circle (**MKGmspLrYoXCx81** in this example) is unique and will be used in other `occ commands`
 in this documentation when referring to this Circle.

By default, the Circle is not marked as VISIBLE. Meaning that while you can see it when running the occ
command, it should not be available to a user that is not a member of the Circle.

Let's try this, using the ``--initiator`` option::

 $ occ circles:manage:list --initiator user1
 +----+------+------+-------+----------+-------+-------------+
 | ID | Name | Type | Owner | Instance | Limit | Description |
 +----+------+------+-------+----------+-------+-------------+

occ circles:manage:config
-------------------------

This command will helps you to change the :ref:`types of a Circle <app_overview_type_circles>`.

As can be seen in the list above, the Circle have been created with its default configuration: No one can
join it, but new member can be added by a Moderator.
We will edit this configuration so that:
- anyone knowing the name of the Circle (or its ID) can send a Request to join the Circle,
- adding a member will generate an Invitation that needs to be approved by the recipient.

The command is followed by ID of the Circle, and the list of configuration we want to enable::

 $ occ circles:manage:config MKGmspLrYoXCx81 OPEN JOINREQUEST INVITE
 {
     "reading": {
         "message": "Configuration have been updated",
         "params": [],
         "fail": false,
         "translated": "Configuration have been updated"
     },
     "data": {
         "circle": {
             "id": "MKGmspLrYoXCx81",
             "name": "Each one teach one",
             "creation": 1613828553,
             "owner": {
                 "id": "KImB12zJpFW4Eff",
                 "circle_id": "MKGmspLrYoXCx81",
                 "single_id": "NkdMRgx64n2qAWp",
                 "user_id": "cult",
                 "user_type": 1,
                 "instance": "cloud.example.net",
                 "level": 9,
                 "status": "Member",
                 "cached_update": 1613828553,
                 "joined": 1613828553
             },
             "initiator": {
                 "id": "KImB12zJpFW4Eff",
                 "circle_id": "MKGmspLrYoXCx81",
                 "single_id": "NkdMRgx64n2qAWp",
                 "user_id": "cult",
                 "user_type": 1,
                 "instance": "cloud.example.net",
                 "level": 9,
                 "status": "Member",
                 "cached_update": 1613828553,
                 "joined": 1613828553
             }
         }
     }
 }


If no type is specified during the execution of the command, the current configuration will be returned::

 $ occ circles:manage:config MKGmspLrYoXCx81
 [
     "Open",
     "Invite",
     "Join Request"
 ]

We will now change the configuration of a Circle that `that generate an Invitation when a new member is
directly added by a moderator, and open to everyone that knows the name of the Circle and is willing to
send a Request` to a `Circle that is freely accessible and visible to everyone`::

 $ occ circles:manage:config MKGmspLrYoXCx81 _INVITE _JOINREQUEST VISIBLE
 {
     "reading": {
         "message": "Configuration have been updated",
         "params": [],
         "fail": false,
         "translated": "Configuration have been updated"
     },
     "data": {
         "circle": {
             "id": "MKGmspLrYoXCx81",
             "name": "Each one teach one",
             "config": 24,
             "creation": 1613828553,
             "owner": {
                 [...]
             },
             "initiator": {
                 [...]
             }
         }
     }
 }


.. note:: You can set a list of multiple types to add, or to remove by using an underscore as a first character.
 This is the list of available types that can be used with this command:

 - VISIBLE
 - OPEN
 - INVITE
 - JOINREQUEST
 - FRIENDS
 - PASSWORDPROTECTED
 - FEDERATED

.. note:: Some important information about the FEDERATED type:

 - A Federated Circles cannot be a member of another Circle,
 - When a Circle is a member of another Circle and is set to FEDERATED, all its memberships will be definitively reset,
 - When removing the type FEDERATED to a Federated Circle, All remote members are definitively removed from the Circle.


Now that the Circle is set to be VISIBLE, we can try again to use the ``--inititator`` option to emulate
the point of view of a non-member::

 $ occ circles:manage:list --initiator user1
 +-----------------+--------------------+-----------+-------+----------+-------+-------------+
 | ID              | Name               | Type      | Owner | Instance | Limit | Description |
 +-----------------+--------------------+-----------+-------+----------+-------+-------------+
 | MKGmspLrYoXCx81 | Each one teach one | ["V","O"] | cult  |          | -1    |             |
 +-----------------+--------------------+-----------+-------+----------+-------+-------------+

As it can be seen, the Circle is now available in the listing even for non-member.


occ circles:manage:details
--------------------------

[TODO: DOCUMENTATION ABOUT THIS COMMAND]

Commands related to Members
^^^^^^^^^^^^^^^^^^^^^^^^^^^


occ circles:members:add
-----------------------

Let's add a member to our Circle with this first command related to Members management!

This command require the ID of the Circle and the username of the future member::

 $ occ circles:members:add MKGmspLrYoXCx81 user1
 {
     "reading": {
         "message": "User '%s' have been added to Circle",
         "params": {
             "userId": "user1"
         },
         "fail": false,
         "translated": "User 'user1' have been added to Circle"
     },
     "data": {
         "member": {
             "id": "af186f8eb7844e9",
             "circle_id": "MKGmspLrYoXCx81",
             "single_id": "rJveWMecFCxR6dh",
             "user_id": "user1",
             "user_type": 1,
             "instance": "cloud.example.net",
             "level": 1,
             "status": "Member"
         }
     }
 }


.. note :: The :ref:`type of the Member <app_overview_type_members>` can be specified using the
 option ``--type``::
  $ occ circles:members:add MKGmspLrYoXCx81 test@example.net --type mail

 List of available types:

 - USER
 - CIRCLE
 - SINGLE
 - MAIL
 - CONTACT


.. note :: The SingleID that locally identify the account, the type of account and the instance of the account
 can be used as a username in the command::
  $ occ circles:members:add MKGmspLrYoXCx81 rJveWMecFCxR6dh

 While it is better to specify the type with ``--type`` please note that, if the option is not used, the App
 will first check if the username is a local Nextcloud userId, then check if the username is a valid SingleId



occ circles:members:list
------------------------

This command will returns the list of current members to a circle::

 $ occ circles:members:list MKGmspLrYoXCx81
 +-----------------+-----------------+------+----------+----------+--------+
 | ID              | Single ID       | Type | Username | Instance | Level  |
 +-----------------+-----------------+------+----------+----------+--------+
 | KImB12zJpFW4Eff | NkdMRgx64n2qAWp | user | cult     |          | Owner  |
 | af186f8eb7844e9 | rJveWMecFCxR6dh | user | user1    |          | Member |
 +-----------------+-----------------+------+----------+----------+--------+

The column ``ID`` shows the **MemberId** for each member. They will be used to manage members' level or to
remove a member of the Circle.


We saw previously that a Circle can be a member of another Circle.
In case you want a resume of all the members with access to content shared to a Circle, you
can have a nice display of indirect access using the ``--tree`` option::

 $ ./occ circles:members:list MKGmspLrYoXCx81 --tree
 Name: Each one teach one
 Owner: cult@cloud.example.net
 Config: Visible, Open

 MKGmspLrYoXCx81
  │
  ├── cult (Owner)
  ├── 9V5NUTLdeBtXgMO (Member) Name: This is a test
  │   Owner: user2 Config: Visible, Open, Password Protected
  │    │
  │    ├── user2 (Owner)
  │    ├── VCGzH5x9LCalArV (Member) Name: Admins
  │    │   Owner: cult@cloud.example.net
  │    │    │
  │    │    ├── cult (Owner)
  │    │    ├── admin1 (Member)
  │    │    ├── admin2 (Member)
  │    │    └── admin3 (Member)
  │    ├── user4 (Member)
  │    ├── user8 (Member)
  │    └── user9 (Member)
  ├── admin1 (Member)
  ├── gh6AcMgmUGB5cjh (Member) Name: Another Circle
  │   Owner: user2 Config: Open, Join Request
  │    │
  │    ├── user2 (Owner)
  │    ├── user6 (Member)
  │    ├── user7 (Member)
  │    └── user8 (Member)
  ├── user1 (Member)
  ├── user3 (Member)
  ├── user4 (Member)
  └── user5 (Member)

.. note :: The example above have been generated by temporary adding more members to more circles, and
 adding circles as members. This is not the current state of the Circle **MKGmspLrYoXCx81** we are
 using as an example since the beginning of this documentation.


occ circles:members:level
-------------------------

To change the :ref:`level for a member <app_overview_level_members>`, the command must be followed by the
**MemberId** and the desired level to assign to the member::


 $ ./occ circles:members:level af186f8eb7844e9 moderator
 {
     "reading": {
         "message": "Level for member '%s' have been updated",
         "params": [
             "userId": "user1"
         ],
         "fail": false,
         "translated": "Level for member 'user1' have been updated"
     },
     "data": {
         "member": {
             "id": "af186f8eb7844e9",
             "circle_id": "MKGmspLrYoXCx81",
             "single_id": "rJveWMecFCxR6dh",
             "user_id": "user1",
             "user_type": 1,
             "instance": "cloud.example.net",
             "level": 4,
             "status": "Member",
             "circle": {
                 "id": "MKGmspLrYoXCx81",
                 "name": "Each one teach one",
                 "config": 24,
                 "creation": 1613828553,
                 "owner": {
                     [...]
                 },
                 "initiator": {
                     [...]
                 }
             }
         }
     }
 }


Now that ``user1`` is a moderator of the Circle, we will emulate this account to add a new member::

 $ ./occ circles:members:add MKGmspLrYoXCx81 user2 --initiator user1
 {
     "reading": {
         "message": "User '%s' have been added to Circle",
         "params": {
             "userId": "user2"
         },
         "fail": false,
         "translated": "User 'user2' have been added to Circle"
     },
     "data": {
         "member": {
             "id": "d6a99b673f314e1",
             "circle_id": "MKGmspLrYoXCx81",
             "single_id": "JNGDIDFgkSbQAYE",
             "user_id": "user2",
             "user_type": 1,
             "instance": "documentation.local",
             "level": 1,
             "status": "Member"
         }
     }
 }

.. note :: This is only doable because ``user1`` is a moderator, if we emulate the account of ``user2``
 (which is now a member) to add another member, the command would returns an error message '`Insufficient
 rights`'


occ circles:members:remove
--------------------------

This is the current state of our Circle::

 $ occ circles:members:list MKGmspLrYoXCx81
 +-----------------+-----------------+------+----------+----------+-----------+
 | ID              | Single ID       | Type | Username | Instance | Level     |
 +-----------------+-----------------+------+----------+----------+-----------+
 | KImB12zJpFW4Eff | NkdMRgx64n2qAWp | user | cult     |          | Owner     |
 | af186f8eb7844e9 | rJveWMecFCxR6dh | user | user1    |          | Moderator |
 | d6a99b673f314e1 | JNGDIDFgkSbQAYE | user | user2    |          | Member    |
 +-----------------+-----------------+------+----------+----------+-----------+

To remove the member ``user2``, we will use its **MemberId**::

 $ ./occ circles:members:remove d6a99b673f314e1
 {
     "reading": {
         "message": "Member '%s' have been removed",
         "params": [
             'userId' => 'user2'
         ],
         "fail": false,
         "translated": "Member 'user2' have been removed"
     },
     "data": []
 }


.. note :: While this is not used in our example, we could have use `--initiator` to emulate the account
 of a Moderator like ``user1`` for this command


occ circles:memberships
-----------------------

It is always nice to have a resume of all memberships of a user: who belongs to which Circle ?
Even more when you start to have a lot of Circles, some of which members of other Circles::

 $ ./occ circles:memberships user8
 Id: user8
 Instance: cloud.example.net
 Type: user
 SingleId: Wtu4WVrYjLpiOzW

 Memberships:
 (database not updated)
 - 9V5NUTLdeBtXgMO (Member)
 - MKGmspLrYoXCx81 (Member)
 - gh6AcMgmUGB5cjh (Member)

 Wtu4WVrYjLpiOzW
  │
  ├── 9V5NUTLdeBtXgMO (This is a test) Level: Member
  │   Owner: user2 Config: Visible, Open, Password Protected
  │    │
  │    └── MKGmspLrYoXCx81 (Each one teach one) Level: Member
  │        Owner: cult Config: Visible, Open
  │
  └── gh6AcMgmUGB5cjh (Another Circle) Level: Member
      Owner: user2 Config: Open, Join Request
       │
       └── MKGmspLrYoXCx81 (Each one teach one) Level: Member
           Owner: cult Config: Visible, Open

.. note :: The example above have been generated by temporary adding more members to more circles, and
 adding circles as members. This is not the current state of the Circle **MKGmspLrYoXCx81** we are
 using as an example since the beginning of this documentation.


Commands related to Federated Circles
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

occ circles:remote
------------------

Run this command to add a Remote Instance that can be used later to add member belonging to this Remote
Instance to a Federated Circle.

The command can be completed by the option ``--type`` to assign a :ref:`Trust Level <federated_overview_trust_level>`
to the Remote Instance::

 $ ./occ circles:remote other.example.net --type PASSIVE
 [...]

 The remote instance other.example.net looks good.
 Would you like to identify this remote instance as 'Passive' ? (y/N)


.. note :: The command will check the validity of the identity of the Remote Instance.
 Your terminal will be flooded with (a lot of) data that can be used to debug in case of problem.
 At the end, you should only needs to confirm that you really wants to add the Remote Instance to your database.

 You can find more details about this in our :ref:`Advanced documentation about Federated Circles <federated_advanced>`.

.. note :: List of available types:

 - UNKNOWN
 - PASSIVE
 - EXTERNAL
 - TRUSTED
 - GLOBALSCALE


occ circles:manage:sync
-----------------------

[TODO: DOCUMENTATION ABOUT THE SYNC COMMAND]


Miscellaneous
^^^^^^^^^^^^^

occ circles:clean
-----------------

[TODO: DOCUMENTATION ABOUT THE CLEAN COMMAND]


