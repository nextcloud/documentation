========
Overview
========

Circles is a Nextcloud App that allow Nextcloud users to generate their own grouping of users and contacts.



Types of Circles
^^^^^^^^^^^^^^^^

.. note::
 Once the Circles app is enabled, your users can creates 2 types of Circles: `Circle` and `Personal Circle`.
 There is no way to switch from `Circle` to `Personal Circle` and vice versa.
 `Personal Circle` are really specific and will be treated separately.


When creating a Circle, its default configuration makes it 'Closed' and `Hidden`, meaning that no one
can see it or join it but the Circle can already be used as an entity to share files and content.
The user that created the Circle is the first and only Member and will have Owner rights that allows him/her to:

- add/remove Members,
- edit members' Levels,
- change the settings of the Circle,
- change its configuration

.. _app_overview_type_circles:

The configuration is done by enabling/disabling some flag that define the way other people view and join the Circle:

 - **Visible** (8): Visible to everyone, if not visible, people have to know its name to be able to find
   it.

 - **Open** (16): Circle is open, people can join it.

 - **Invite** (32): Adding a Member generate an invitation that needs to be accepted.

 - **Request** (64): A request to join the Circle needs to be validated by a Moderator.

 - **Friend** (128): Members of the Circle can invite their friends.

 - **Password Protected** (256): a Password is required to join or request to join the Circle.

 - **Federated** (8192): Circle is Federated. (cf. :doc:`federated_overview`)

Mixed, those flags can generate some interesting configurations:

 - **Open** + **Request**: Anyone can initiate a request to join the circle, Moderator can add Members

 - **Open** + **Invite**: Everyone can enter, Moderators must send invitation.

 - **Open** + **Invite** + **Request**: Everyone send a request, Moderator must send Invitation.

 - **Request** + **Friend**: No one can join the Circle, but all members can request a moderator to accept
   new members.

 - **Friend** + **Invite**: No one can join the Circle, but all members can add new member. An invitation
   will be generated.

 - **Friend** + **Invite** + **Request**: No one can join the Circle, but all members can request a moderator
   to accept new Member. An invitation will be generated.


Personal Circles
^^^^^^^^^^^^^^^^

A Personal Circle is a Circle that can only be managed, **and used**, by the Owner of the Circle. No one
else, beside its creator, will have access to the Circle or be able to share any files and content to it.

There is no possible configuration of a Personal Circle.


System Circles
^^^^^^^^^^^^^^


- **Single** (1): Circle that only contains a single Member. This circle have no configuration option available
  and it is only managed by the Circles App itself. It is used to generate a SingleId to identify a Member
  as FederatedUser.
  (cf. `FederatedUser <https://docs.nextcloud.com/server/latest/go.php?to=developer-manual>`)
  [TODO: generate a link to the page related to circles developer manual]

The Circles Apps provide a large variety of tools to Nextcloud Apps to generate and manage a group of users.
With those tools comes also more types of Circles that are not directly available to users:

 - **No Owner** (512): Circle have no owner (Not yet implemented)

 - **Hidden** (1024): The generated Circle is not displayed in the listing of existing Circles, even to the
   Owner of the Circle. However, the Circle will appears in the list of available entities when sharing a
   files or any content.

 - **Backend** (2048): Completely hidden, Circle will not appears in any 'Shares to' dropdown.

 - **Root** (4096): Circle cannot be a member of another Circle.




.. _app_overview_level_members:

Members Level
^^^^^^^^^^^^^

- **Member**: Lowest Level, user is a Member of the Circle.
- **Moderator**: Can `add`, `invite`, `accept`, `reject`, `remove` Members from/to the Circle.
- **Admin**: Same as **Moderator**, can edit Circle's configuration and also give or revoke Moderator
  rights to a Member.
- **Owner**: Same as **Admin**, can edit any Level and have the ability to destroy the Circle. Only one
  Owner per Circle.

.. note:: Ownership can be transferred to any other member of the Circle. Current Owner will end up Admin
   of the Circle at the end of the procedure.

   When a Nextcloud account is destroyed, and the user had the status of Owner in one of multiple Circle,
   a new Owner will be put in place for each Circle. The selection of the new Owner will be based on the
   Level of the Member (Admin first, Moderator if no Admin, Member of no Moderator), and the longevity of
   its membership (Older member first)



.. _app_overview_type_members:

Types of members
^^^^^^^^^^^^^^^^

Beside others **Nextcloud Users**, a Member of the Circle can also come from different sources:

- **Mail Address**: When adding a mail address as Member of a Circle, any file shared to this Member will
  generate a link and send it in a mail to the recipient.

- **Contact**: Working like a **Mail Address**. The Id of the contact is stored, meaning that changing the mail
  address of a contact will be taken into account when a mail needs to be send to this Member.

- **Circle**: A Circle can be a Member of an other Circle. Every Members of the Circle-as-Member will have the
  same Level as the Circle-as-Member itself.



SingleID, CircleID & MemberID
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In this documentation, we will often refer to 3 different of unique Ids, all generated the same way: a case
sensitive 15 character alphanumeric string.

- **SingleID** represents a single user, based on the account name, its type and eventually its source.
- **CircleID** represents a Circle, as a group of members.

**SingleID** and **CircleID** are mainly used to identify the entity set as the recipient of a share.

- **MemberID** identify a specific Member of a Circle. This ID is only used to manage/remove the rights of
  a member inside a Circle
