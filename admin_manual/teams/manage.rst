============
Manage Teams
============

We will overview most of the ``occ`` commands useful to manage the Teams.
Remember that the ``contacts`` app allow your users to manage their own Teams from the web client.


Create a new team
-----------------

Team owner needs to be set at its creation:

.. code-block::

	$ ./occ circles:manage:create <single_id> <team name>

The default type expected for the owner is its Single Id. However, it is possible to use a User Id if owner is a Nextcloud Account:

.. code-block::

	$ ./occ circles:manage:create --type user user1 "My new Team"
	Id: CLPKCiJAec3nh6dVEJpUPd5LashbbBc
	Name: My new team
	Owner: user1

Few options can be added to the command:
 - ``--personal``: to set Team as `Personal` meaning members other than the owner will ever know they belongs to the Team but will still receive shared documents performed by the owner to the Team.
 - ``--local`` `(Global Scale): a local Team will not be made available to other instances of the Global Scale.




Add a new member
----------------

.. code-block::

	$ ./occ circles:members:add <team_id> <single_id>

Like when creating a new circle, the type of the entity can be specified using `--type`. The initiator of the operation can be optionally defined in the command:

.. code-block::

    $ ./occ circles:members:add CLPKCiJAec3nh6dVEJpUPd5LashbbBc user2 --type user --initiator user1 --initiator-type user


List members
------------

You can get the list of current member of a Team

.. code-block::

	$ ./occ circles:members:list <team_id>

.. code-block::

    $ ./occ circles:members:list CLPKCiJAec3nh6dVEJpUPd5LashbbBc
    +---------------------------------+-------------+---------------------------------+---------------------------------+------+-------------------+----------+--------+------------+
    | Circle Id                       | Circle Name | Member Id                       | Single Id                       | Type | Source            | Username | Level  | Invited By |
    +---------------------------------+-------------+---------------------------------+---------------------------------+------+-------------------+----------+--------+------------+
    | CLPKCiJAec3nh6dVEJpUPd5LashbbBc | My new team | gAtwrBVTw23dEeEOSFlgLtI6z29v9wC | HNCBbYcmIqJCJdPraw8iPMFrZcELXvH | user | Nextcloud Account | user1    | Owner  | occ        |
    | CLPKCiJAec3nh6dVEJpUPd5LashbbBc | My new team | A353C2dAQzBPk1vcmHu82EkkDZLJEy8 | kokKuOPeDv38caoGjbpM114mv3Et3XP | user | Nextcloud Account | user2    | Member | occ        |
    | CLPKCiJAec3nh6dVEJpUPd5LashbbBc | My new team | pR15xbRySW6chDP6UopP7c634Z1FPGd | LCdFtrJDzP2b28sYU5gGxfkrbHMwPMp | user | Nextcloud Account | user3    | Member | occ        |
    +---------------------------------+-------------+---------------------------------+---------------------------------+------+-------------------+----------+--------+------------+


List inheritance
----------------

A Team can be a member of an other Team and inheritance can be displayed for a better overview of your Teams.
As an example, we create 4 teams:

.. code-block::

	$ ./occ circles:manage:create --type user user1 "Team A"
	Id: 2AdmCjOXrT3vqqCjG2q7pnjUsNnf8Wy
	Name: Team A
	Owner: user1
	$ ./occ circles:manage:create --type user user2 "Team B"
	Id: oPkpu9EaFIFTH3E9p8wv6xPzb8nutPb
	Name: Team B
	Owner: user2
	$ ./occ circles:manage:create --type user user3 "Team C"
	Id: Vx1fYvIrsom94NOPDI7PKhGopSNJHGg
	Name: Team C
	Owner: user3
	$ ./occ circles:manage:create --type user user4 "Team D"
	Id: dfzo8Nikv4Nqsshr5FLskQhRJ3SR6cS
	Name: Team D
	Owner: user4

We now add ``TeamB`` as a member of ``TeamA`` and ``TeamC``+``TeamD`` as member of ``TeamB``. We also add some users to each teams:

.. code-block::

    $ ./occ circles:members:add 2AdmCjOXrT3vqqCjG2q7pnjUsNnf8Wy oPkpu9EaFIFTH3E9p8wv6xPzb8nutPb
    $ ./occ circles:members:add oPkpu9EaFIFTH3E9p8wv6xPzb8nutPb Vx1fYvIrsom94NOPDI7PKhGopSNJHGg
    $ ./occ circles:members:add oPkpu9EaFIFTH3E9p8wv6xPzb8nutPb dfzo8Nikv4Nqsshr5FLskQhRJ3SR6cS

    $ ./occ circles:members:add 2AdmCjOXrT3vqqCjG2q7pnjUsNnf8Wy --type user user6
    $ ./occ circles:members:add 2AdmCjOXrT3vqqCjG2q7pnjUsNnf8Wy --type user user7
    $ ./occ circles:members:add oPkpu9EaFIFTH3E9p8wv6xPzb8nutPb --type user user8
    $ ./occ circles:members:add oPkpu9EaFIFTH3E9p8wv6xPzb8nutPb --type user user9
    $ ./occ circles:members:add Vx1fYvIrsom94NOPDI7PKhGopSNJHGg --type user user10
    $ ./occ circles:members:add Vx1fYvIrsom94NOPDI7PKhGopSNJHGg --type user user11
    $ ./occ circles:members:add dfzo8Nikv4Nqsshr5FLskQhRJ3SR6cS --type user user12
    $ ./occ circles:members:add dfzo8Nikv4Nqsshr5FLskQhRJ3SR6cS --type user user13

Now we display the list of all inherited members from the top Team ``Team A``:

.. code-block::

	Name: Team A
	Owner: user1@cloud.example.com

	2AdmCjOXrT3vqqCjG2q7pnjUsNnf8Wy
	 │
	 ├── iEw2kbdmULBJUhibSIb6iORRxHjK7e3 (Owner) MemberId: 93Po2zXqRvIDOhZX2aDLL7xYCXdo3Cu Name: user1 Source: Nextcloud Account
	 ├── oPkpu9EaFIFTH3E9p8wv6xPzb8nutPb (Member) MemberId: iY5z6NJKaCLhSAcXySYJwbz85ppKZtQ Name: Team B Source: Circle
	 │   Owner: user2@cloud.example.com
	 │    │
	 │    ├── zEDSMW7Dlx4kj9aNLxWU7usvJs1TPFz (Owner) MemberId: VBtjTRrcZqaaHEztIRFqqDmfzF3s1ji Name: user2 Source: Nextcloud Account
	 │    ├── Vx1fYvIrsom94NOPDI7PKhGopSNJHGg (Member) MemberId: 9Sw6oADEkRVm6FxzBiGbStpZYLecUUU Name: Team C Source: Circle
	 │    │   Owner: user3@cloud.example.com
	 │    │    │
	 │    │    ├── V5KsaUuXSpWo1byC9TC9jyaIVjSS7mS (Owner) MemberId: Dvr7NjiEsGATbuHbdUHUFck9qjzB9C5 Name: user3 Source: Nextcloud Account
	 │    │    ├── t2wuuT2YtYFxg2WTRgf4LVPRT76av5U (Member) MemberId: gqJJHsWC1XGzaBvQKvqpCaSE5W3vjcD Name: user10 Source: Nextcloud Account
	 │    │    └── qRzbgRX9eSV9CBgfXnLAk5ugEUf3XSC (Member) MemberId: A4bkrZPZd8CrDhvYobo6TH2Z1U7keI2 Name: user11 Source: Nextcloud Account
	 │    │
	 │    ├── dfzo8Nikv4Nqsshr5FLskQhRJ3SR6cS (Member) MemberId: Zom2zOUVHkRIPlptlPfClZmNiUYPdPN Name: Team D Source: Circle
	 │    │   Owner: user4@cloud.example.com
	 │    │    │
	 │    │    ├── 5D4cVVuacHdg2naDTqrTdnxMaLidyq4 (Owner) MemberId: LZw6EjleAlOOfhHTfRljcggmrwf6pFS Name: user4 Source: Nextcloud Account
	 │    │    ├── Ky5IUBj2uHSMMxaGXswI8AdhWVILVKH (Member) MemberId: 96rn9rPMO46uNAlmZB7pjtRvplNeueT Name: user12 Source: Nextcloud Account
	 │    │    └── PIDY5McrqMA1FUUBs8oGolDBEmca1u5 (Member) MemberId: M5t7M1YVIY99ZDoBobfWncW3iLQMUcl Name: user13 Source: Nextcloud Account
	 │    │
	 │    ├── iHv31etw5bllowJAj7qTggYhQoWo5kW (Member) MemberId: UQGNHRw9koydXWjojlGWfOSTvi8bI8k Name: user8 Source: Nextcloud Account
	 │    └── dBTv1Vs3fMHYuZbGYAo3D4OSoXPm8Ed (Member) MemberId: 1uh4FPkWWf1fnGB3PsGDsCHMhtIzqxx Name: user9 Source: Nextcloud Account
	 │
	 ├── cWykIF8qxi7I3kLMvdgwoBVZ8GRaWOx (Member) MemberId: uoYjKsopMbgzHFwSFO1x2Mclz9Da3Qi Name: user6 Source: Nextcloud Account
	 └── cEUd7yy6ekwsFBCWdoslz4Hgcb6x1s8 (Member) MemberId: pwnFSpyR8Mxqs7gWGyXejK8RnxFkoaA Name: user7 Source: Nextcloud Account

.. note:: while it is possible to invite a top Team (ie `Team A`) as member of a sub Team (ie `Team B`), the message ``(loop detected)`` will be shown in the tree.


Edit level
----------

Member level can be changed using

.. code-block::

	$ ./occ circles:members:level <member_id> <level>

- `Member Id` is the unique id that idenfied an Entity within a Team
- `Level` accept those definitions: ``Member``, ``Moderator``, ``Admin``, ``Owner``

.. note:: The member level assigned to a sub Team is inherited to all members of the sub Team, and inherited to all members of eventual cascading sub Team
.. note:: An owner cannot be demoted from its ownership. But a new owner can be set as Owner of a Team, replacing the previous Owner.

Remove a member
---------------

Using its `Member Id` a member can be removed from a Team:

.. code-block::

	$ ./occ circles:members:remove <member_id>


List memberships
----------------

It is also possible to list all memberships of an entity using

.. code-block::

	$ ./occ circles:memberships <single_id>>

The result is also display as a tree, in case of inherited memberships:

.. code-block::

	$ ./occ circles:membership --type user user1
	Id: user1
	Instance: cloud.example.com
	Type: user
	SingleId: iEw2kbdmULBJUhibSIb6iORRxHjK7e3

	Memberships:
	(database not updated)
	- 2AdmCjOXrT3vqqCjG2q7pnjUsNnf8Wy (Owner)
	- Vx1fYvIrsom94NOPDI7PKhGopSNJHGg (Member)
	- iEw2kbdmULBJUhibSIb6iORRxHjK7e3 (Owner)
	- oPkpu9EaFIFTH3E9p8wv6xPzb8nutPb (Moderator)

	iEw2kbdmULBJUhibSIb6iORRxHjK7e3
	 │
	 └── 2AdmCjOXrT3vqqCjG2q7pnjUsNnf8Wy (Team A) MemberId: 93Po2zXqRvIDOhZX2aDLL7xYCXdo3Cu Level: Owner
	     Owner: user1@cloud.example.com
	      │
	      └── Vx1fYvIrsom94NOPDI7PKhGopSNJHGg (Team C) MemberId: kEqPRIC7iPC4ihau7RGBw6ou6YvDWRK Level: Member
	          Owner: user3@cloud.example.com
	           │
	           └── oPkpu9EaFIFTH3E9p8wv6xPzb8nutPb (Team B) MemberId: 9Sw6oADEkRVm6FxzBiGbStpZYLecUUU Level: Moderator
	               Owner: user2@cloud.example.com
	                │
	                └── 2AdmCjOXrT3vqqCjG2q7pnjUsNnf8Wy (Team A) MemberId: iY5z6NJKaCLhSAcXySYJwbz85ppKZtQ Level: Member (Owner)
	                    Owner: user1@cloud.example.com
	                    (loop detected)


