===================
Splitting databases
===================

.. warning::

    This is still proof-of-concept level. Use with care.

In order to scale at some point it might make sense to split out some tables or apps
which allow it as they might be better off with a different replication methods, etc.

A first attempt we do right now with the activity table. In order to make use of this,
the app/table needs to match the following criteria:

* No other apps are allowed to have queries directly to the table
* No JOINs are performed between this table and any other tables not on this new separate connection
* The app needs to support a connection parameter prefix

In case of the activity app the prefix is ``activity_``. If a database config is not
specified it falls back to the normal database configuration option for this value:

* ``activity_dbuser`` falling back to ``dbuser``
* ``activity_dbpassword`` falling back to ``dbpassword``
* ``activity_dbname`` falling back to ``dbname``
* ``activity_dbhost`` falling back to ``dbhost``
* ``activity_dbport`` falling back to ``dbport``
* ``activity_dbdriveroptions`` falling back to ``dbdriveroptions``

.. note::

    It is not possible to use a different database type (SQLite, MySQL, PostrgreSQL, Oracle)
    for a split database. Also in case of MySQL and MariaDB the utf8mb4 option needs to be
    the same on both databases.

Initial splitting
-----------------

For the initial split the affected tables have to be copied over to the new database,
in case of the activity app these are:

* ``oc_activity``
* ``oc_activity_mq``

1. Enable maintenance mode
2. Make sure optional database changes are applied:

    1. ``occ db:convert-mysql-charset``
    2. ``occ db:convert-filecache-bigint``
    3. ``occ db:add-missing-columns``
    4. ``occ db:add-missing-indices``
    5. ``occ db:add-missing-primary-keys``

3. Specify the desired configuration values
4. Copy the 2 tables to the new database
5. Disable maintenance mode

Migrations on updates
---------------------

We will try to avoid migrations on those tables in the future, but it might be necessary at some point.
We hope to have a dedicated plan by the time this happens. For now a potential way would be:

1. Enable maintenance mode
2. Update as usual
3. Execute manual queries for schema changes provided by the app authors
4. Execute manual queries for data changes provided by the app authors
5. Disable maintenance mode
