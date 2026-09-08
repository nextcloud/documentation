=====
Teams
=====

A team is a group of accounts that any user can create and manage themselves, without an administrator having to set
up a system group. Teams can be shared with in the same places a group can: files and folders, Talk conversations and
Deck boards.

Teams are managed in the **Teams** app, which has its own entry in the app navigation. On servers where that interface
has been disabled, team management appears in the **Contacts** app instead.

What a team is, and what it is not
----------------------------------

A team is a **membership list**, not a storage location. Anything shared with a team stays owned by the account that
shared it, and stops being available to the team when that account removes the share or is deleted.

This surprises people who expect a team to work like a shared drive:

.. note::

    Creating a team does not create any storage. Until the team has a **team space**, there is nowhere to put a file
    that belongs to the team rather than to one of its members.

Team spaces
-----------

A team space is a folder that belongs to the team itself. It follows the team's membership, so a new member gains
access and a removed member loses it, and it has its own storage quota.

A team space can be created in two ways:

- **When the team is created**, by asking for one at the same time.
- **Later**, by upgrading an existing team, if your server allows it.

Only the **team owner** or a server administrator can add a team space to a team. Some teams can never have one:
personal teams, hidden teams, and teams that are managed by the server or by an external backend.

.. warning::

    Detaching a space from a team and deleting it are different actions. **Detaching keeps the folder and everything
    in it** - it simply stops belonging to the team, and an administrator can reassign it. **Deleting removes the
    folder and its contents.**

Team roles
----------

Teams support four roles:

**Member**
    The lowest level of permissions. A member can access the resources shared with the team and see who else is in it.

**Moderator**
    In addition to member permissions, a moderator can invite people, confirm invitations and manage members.

**Admin**
    In addition to moderator permissions, an admin can configure the team's options.

**Owner**
    In addition to admin permissions, an owner can transfer ownership to another member, and is the only role that can
    add a team space. A team has exactly one owner.

Frequently asked questions
--------------------------

**I created a team, but I cannot create files or folders that belong to it.**
    A team is a group of people, not a place to store things. Files, conversations and boards can be *shared with* a
    team, but they remain owned by whoever created them. For storage owned by the team, ask for a **team space** - see
    above. If the option is missing, your administrator has disabled it.

**What is the difference between a team space and a folder I shared with my team?**
    A shared folder belongs to you: it disappears from the team if you unshare it or your account is removed. A team
    space belongs to the team and survives changes in membership, including yours.

**What happens to the files if the space is detached from the team?**
    Nothing is deleted. The folder and its contents remain, and an administrator can attach it to another team or hand
    it back to individual users. Deleting the space is a separate, destructive action.

**Who can add a team space?**
    The team owner, or a server administrator. Moderators and admins of the team cannot.

**Can a team have more than one space?**
    No. The relationship is exclusive: one team, at most one team space.

**Which apps can show things in a team?**
    Any app that integrates with teams. Out of the box this includes Files, Talk and Deck.
