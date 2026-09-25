============================
Team folders and team spaces
============================

Team folders are folders that are mounted for a set of groups or teams rather than owned by one account. They are
provided by the **Team folders** app, whose app id is ``groupfolders`` - the name you will see in :command:`occ`
commands, in the app store and in log entries.

A **team space** is a team folder in an exclusive relationship with a single team: it belongs to that team, follows
the team's membership, and has its own quota. Team spaces were introduced in Nextcloud 35.

Team folder or team space?
--------------------------

.. list-table::
    :header-rows: 1
    :widths: 30 35 35

    * -
      - Team folder
      - Team space
    * - Mounted for
      - any number of groups and teams
      - exactly one team
    * - Created by
      - an administrator or a delegated group
      - the team owner, or an administrator
    * - Membership follows
      - the groups and teams you assign
      - the team's own membership
    * - Quota
      - set per folder
      - set per space

Which teams can have a space
----------------------------

A team is not eligible for a team space if it is:

- a **personal** team,
- a **hidden** team,
- a **system** team, or
- a team provided by an **external backend**.

For every other team, the **owner** or a server administrator can add a space. Members, moderators and team admins
cannot.

Configuration
-------------

Team space provisioning is controlled by two app settings of the ``circles`` app. Neither is exposed in the
administration interface, so set them with :command:`occ`:

.. code-block:: bash

    # allow teams to be created with a space, and existing teams to be upgraded (default: yes)
    occ config:app:set circles team_folder_auto_create --value=1 --type=boolean

    # default quota in bytes for a new team space; 0 means unlimited (default: 0)
    occ config:app:set circles team_folder_default_quota --value=0 --type=integer

With provisioning disabled, requests to create or upgrade a team space are refused, and existing spaces are left
untouched.

.. note::

    A team space is only created at team-creation time if the person creating the team asks for one. Teams created
    without a space are not upgraded automatically; someone has to upgrade them deliberately.

Detaching versus deleting
-------------------------

.. warning::

    These two actions look similar and are not.

**Detaching** ends the exclusive relationship and **keeps the folder and its contents**. The folder remains as an
ordinary team folder that you can reassign to groups, teams or nobody. This is the intended way to recover access to
the contents of a team that is being disbanded.

**Deleting** removes the team folder and everything in it.

How team folders interact with other features
---------------------------------------------

Team folders behave differently from ordinary user storage in several areas that are documented elsewhere:

- :doc:`encryption_configuration` - encrypting team folders and other non-home mount points.
- :doc:`primary_storage` - how team folder contents are stored on object storage.
- :doc:`trashbin_configuration` - deleted files from a team folder go to the team folder's own trash.
- :doc:`../configuration_server/activity_configuration` - activities for team folders, and why they can be missing.

Frequently asked questions
--------------------------

**What is the difference between a team folder and a team space?**
    A team folder is mounted for any number of groups and teams and is administered centrally. A team space is a team
    folder in an **exclusive** relationship with one team: it belongs to that team, follows its membership, and has
    its own quota. See the comparison above.

**A user says their team cannot own any files. Is that expected?**
    Yes. A team is a membership list; anything shared with it stays owned by the account that shared it. For storage
    owned by the team, the team needs a space, which its owner can add if provisioning is enabled.

**Why is the option to add a space missing for one particular team?**
    Either provisioning is disabled server-wide, or the team is not eligible - personal, hidden, system and
    backend-provided teams cannot have a space. The person asking may also not be the team's owner.

**Can I convert an existing team folder into a team's space?**
    Yes. An existing team folder can be linked to a team instead of creating a new one, which is the way to migrate a
    folder that predates team spaces.

**How do I take a space away from a team without losing the data?**
    Detach it. The folder and its contents survive; only the exclusive relationship ends.

**Does a team space count against the members' quotas?**
    No. It has its own quota, set per space, where zero means unlimited.

**Can I limit the size of a team space?**
    Yes. A new space is created with the quota from ``team_folder_default_quota``, and the quota of an existing space
    can be changed afterwards. Zero means unlimited.

**Which apps can contribute resources to a team?**
    Files, Talk and Deck out of the box, and any app implementing the team resource provider interface described in
    the developer manual under *Digging deeper* → *Teams*.
