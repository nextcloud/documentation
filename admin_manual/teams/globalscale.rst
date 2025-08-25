===============
Federated Teams
===============




Global Scale
------------

Teams is compatible with the Nextcloud Global Scale technology, allowing the grouping of entities from multiple instances.
We call Federated Team when a Team is set up to be functional on multiple instances and the only limit to it is that a Federated Team cannot be a member of a Team.

From a technical point of view, the instance that host the Team Owner account is considered to be the main instance for that Federated Team.
Every operations in relation to a Federated Team are initiated by a request to the Main Instance that will confirm permissions and broadcast the operation to
the rest of the instances of the Global Scale.

.. note::
	While `Federated Teams` is available and working, some front-end elements might need some improvement. We are still working on
	improving user experience when managing Teams over Global Scale.

.. note::
	Global Scale requires to run Nextcloud Loopup Server v1.1.0 or above

Setup
-----

Each request between instance are authentified and a public/private key pairs needs to be generated on each instance of the Global Scale.
This is done by setting a unique url to reach the instance:

>     ./occ circles:check --type internal

The configuration tool will ask for the internal address of the instance. This address needs to be reachable by all other instances of the Global Scale.
It also provide a way to test the address before saving. The operation require the administrator to execute few curl requests from another instance:


.. code-block::

	$ ./occ circles:check --type internal
	### Testing internal address.
	. The internal setting should only be enabled if you are willing to use Circles in a GlobalScale setup on a local network.
	. The address you need to define here is the local address of your Nextcloud, reachable by all other instances of our GlobalScale.
	- Do you want to enable this feature ? (y/N) y

	Please write down a new internal address to test: https://node1.example.com/
	Do you want to check the validity of this internal address? (Y/n) y

	You will need to run this curl command from a terminal on your local network and paste its result:
	     curl -L "https://node1.example.com/.well-known/webfinger?resource=http://nextcloud.com/&test=Lh9Zw3tyUYNbMHB"
	paste the result here:
	[pasting result from curl request #1]

	First step seems fine.
	Next step, please run this curl command from a terminal on your local network and paste its result:
    	 curl -L "https://node1.example.com/index.php/apps/circles/?test=Lh9Zw3tyUYNbMHB" -H "Accept: application/json"
	paste the result here:
	[pasting result from curl request #2]

	* Internal address looks good

	- Do you want to save https://node1.example.com as your internal address ? (y/N) y
	- Address https://node1.example.com is now used as internal

.. note:: This needs to be executed on every instance of the Global Scale



Authentication
--------------

Once every instance have their internal address and public/private key pairs set, you need to link each instance to the rest of the Global Scale.
This command needs to be executed on each instance of the Global Scale:

>     ./occ circles:remote

.. code-block::

	$ ./occ circles:remote
	Adding node1.example.com: instance is local
	Adding node2.example.com: ok
	Adding node3.example.com: ok
	+-------------------+-------------+-------------+--------------------+--------------------+-----------------------+
	| Instance          | Type        | iface       | UID                | Authed             | Aliases               |
	+-------------------+-------------+-------------+--------------------+--------------------+-----------------------+
	| node2.example.com | GlobalScale | internal    | 328b31d2b1e8fab5a8 | 328b31d2b1e8fab5a8 | ["node2.example.com"] |
	| node3.example.com | GlobalScale | internal    | ad3f46495b1897893b | ad3f46495b1897893b | ["node3.example.com"] |
	+-------------------+-------------+-------------+--------------------+--------------------+-----------------------+


.. note:: In the future when adding a new instance to the Global Scale the ``./occ circles:remote`` needs to be executed on all instance, previously configured and freshly installed.


Federated Teams
---------------

When using Global Scale and a fully configured Circles/Teams app, every Team are considered Federated by default:


.. code-block::
	node1$ ./occ circles:manage:create --type user admin1 "team_001"
	Id: 3Il6hIXeOQbSfw5v26cDtBupRnIYbV3
	Name: team_001
	Owner: admin1

.. code-block::
	node2$ ./occ circles:manage:list
	+---------------------------------+----------+--------+--------+--------+------------------------------+------------+
	| Single Id                       | Name     | Config | Source | Owner  | Instance                     | Population |
	+---------------------------------+----------+--------+--------+--------+------------------------------+------------+
	| 3Il6hIXeOQbSfw5v26cDtBupRnIYbV3 | team_001 | []     | Circle | admin1 | slave1.gs.artificial-owl.com | 1/-1 (1)   |
	+---------------------------------+----------+--------+--------+--------+------------------------------+------------+

.. code-block::
	node1$ ./occ circles:member:add 3Il6hIXeOQbSfw5v26cDtBupRnIYbV3 user21@node2.example.com --type user
	node1$ ./occ circles:members:list 3Il6hIXeOQbSfw5v26cDtBupRnIYbV3
	+---------------------------------+-------------+---------------------------------+---------------------------------+------+-------------------+--------------------------+--------+------------+
	| Circle Id                       | Circle Name | Member Id                       | Single Id                       | Type | Source            | Username                 | Level  | Invited By |
	+---------------------------------+-------------+---------------------------------+---------------------------------+------+-------------------+--------------------------+--------+------------+
	| 3Il6hIXeOQbSfw5v26cDtBupRnIYbV3 | team_001    | QhNdcj1EqfgZJOS1VVIAreb6KutqBaZ | s6XHTZs2TnVateDEYp6Pfjzch1664GE | user | Nextcloud Account | admin1                   | Owner  | occ        |
	| 3Il6hIXeOQbSfw5v26cDtBupRnIYbV3 | team_001    | UZELfc9zADPzJYYFD1kWpJCxB3vrCy9 | ahmhWEKPuoFNCQnERij2jk7MTR9XHeM | user |                   | user21@node2.example.com | Member | occ        |
	+---------------------------------+-------------+---------------------------------+---------------------------------+------+-------------------+--------------------------+--------+------------+

.. code-block::
	node2$ ./occ circles:members:list 3Il6hIXeOQbSfw5v26cDtBupRnIYbV3
	+---------------------------------+-------------+---------------------------------+---------------------------------+------+-------------------+--------------------------+--------+------------+
	| Circle Id                       | Circle Name | Member Id                       | Single Id                       | Type | Source            | Username                 | Level  | Invited By |
	+---------------------------------+-------------+---------------------------------+---------------------------------+------+-------------------+--------------------------+--------+------------+
	| 3Il6hIXeOQbSfw5v26cDtBupRnIYbV3 | team_001    | QhNdcj1EqfgZJOS1VVIAreb6KutqBaZ | s6XHTZs2TnVateDEYp6Pfjzch1664GE | user | Nextcloud Account | admin1                   | Owner  | occ        |
	| 3Il6hIXeOQbSfw5v26cDtBupRnIYbV3 | team_001    | UZELfc9zADPzJYYFD1kWpJCxB3vrCy9 | ahmhWEKPuoFNCQnERij2jk7MTR9XHeM | user |                   | user21@node2.example.com | Member | occ        |
	+---------------------------------+-------------+---------------------------------+---------------------------------+------+-------------------+--------------------------+--------+------------+

.. code-block::
	$ ./occ circles:member:list 3Il6hIXeOQbSfw5v26cDtBupRnIYbV3
	+---------------------------------+-------------+---------------------------------+---------------------------------+------+-------------------+--------------------------+--------+----------------------------------+
	| Circle Id                       | Circle Name | Member Id                       | Single Id                       | Type | Source            | Username                 | Level  | Invited By                       |
	+---------------------------------+-------------+---------------------------------+---------------------------------+------+-------------------+--------------------------+--------+----------------------------------+
	| 3Il6hIXeOQbSfw5v26cDtBupRnIYbV3 | team_001    | QhNdcj1EqfgZJOS1VVIAreb6KutqBaZ | s6XHTZs2TnVateDEYp6Pfjzch1664GE | user |                   | admin1@node1.example.com | Owner  | occ@slave1.gs.artificial-owl.com |
	| 3Il6hIXeOQbSfw5v26cDtBupRnIYbV3 | team_001    | UZELfc9zADPzJYYFD1kWpJCxB3vrCy9 | ahmhWEKPuoFNCQnERij2jk7MTR9XHeM | user | Nextcloud Account | user21                   | Member | occ@slave1.gs.artificial-owl.com |
	+---------------------------------+-------------+---------------------------------+---------------------------------+------+-------------------+--------------------------+--------+----------------------------------+

.. note::
	Now, any file shared to the Team ``team_001`` by any its member will be available to every members of the Team.

