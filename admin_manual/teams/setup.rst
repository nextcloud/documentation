============
Introduction
============


Concept
-------

Teams is a feature allowing your users to create their own group of users, including local and external accounts. This is the list of what can be set as member of a Team:

- users from local Nextcloud,
- groups from local Nextcloud,
- mail addresses,
- other Teams.

Teams offers different levels to allow certain actions:

- members - normal member of the team
- moderators - can invite and remove team members,
- administrators - can edit team's settings,
- owner - can delete the team. Each Team must have one single owner.

.. note::
	When adding a Nextcloud Group or an other Team into a Team, as member, the grade applied to this membership is inherited
	to all members of the invited Nextcloud Group or Team, cascading recursively if this sub Team contains itself more Groups/Teams.

Teams is compatible with the Global Scale technology and permit the grouping of Nextcloud Accounts across multiple instances.

.. note::
    While Teams can be managed with the `./occ` command by administrators, the Nextcloud Contacts app is advised for a better user experience

First steps
-----------

To avoid running heavy process and damage the user experience, the Teams app requires to send an HTTP request on itself, like a loopback.
While the loopback address is easily detectable by the app it might require, on some setup, a human intervention.

If you are facing unresponsive behavior when managing your Teams, or want to ensure a correct setup, please run this command:


.. code-block::

	$ ./occ circles:check --type loopback
	### Checking loopback address.
	. The loopback setting is mandatory and can be checked locally.
	. The address you need to define here must be a reachable url of your Nextcloud from the hosting server itself.
	. By default, the App will use the entry 'overwrite.cli.url' from 'config/config.php'.

	* testing current address: https://cloud.example.net
	- GET request on https://cloud.example.net/index.php/csrftoken: 200
	- POST request on https://cloud.example.net/index.php/apps/circles/async/test-dummy-token/: 200
	- Creating async FederatedEvent f9a69f7c-2eb5-4018-ab4b-f983fb38ded8 (took 99ms)
	- Waiting for async process to finish (5s)
	- Checking status on FederatedEvent verify=17 manage=42
	* Loopback address looks good


Configuration
-------------

Configuration is done using the ``./occ`` command, and Teams comes with a list of config keys:

- **limit_circle_creation** ``<singleId>`` - limit the creation of new Teams to an entity, using entity single id.
- **hard_moderation** ``[0 (default), 1, 2]`` - define if a moderator/admin/owner can promote/demote an other entity to its own same level.
  ``0`` means initiator needs to be same level than action and recipient: a moderator can promote another member moderator,
  ``1`` means initiator needs to overrank the recipient: only an admin can demote a moderator,
  ``2`` means initiator needs to overrank the action: only an admin can promote a moderator.

- **frontend_enabled** ``[0, 1 (default)]`` - disable the OCS API.
- **keyhole_cfg_request** ``[0 (default), 1]`` - non members of a Team can access its members list.
- **route_to_circle** - setup the app+route to display details about a Team.
- **enforce_password** ``[0 (default), 1]`` - enforce the generation of a password for external members on share, for all teams.
- **creation_activity** ``[0 (default), 1]`` - create a new activity on Team creation.
- **members_limit** - limit the number of members per Team
- **self_signed_cert** ``[0 (default), 1]`` - allow self signed certificate (in global scale setup).


.. note::
    Configuration is applied with this format:
        ``./occ config:app:set circles <config_key> --value <config_value>``


