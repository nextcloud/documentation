======================
Database Best Practice
======================

Currently ownCloud supports the following relational database management 
systems:

- MySQL
- MariaDB
- PostgreSQL
- SQLite
- Oracle

SQLite is not supported in the Enterprise edition, and is not recommended 
except for systems with very light workloads, and for testing ownCloud.

We are using the `doctrine database abstraction layer`_ and schema evolution 
with a `MDB2 Schema`_ based table description in XML.

.. _doctrine database abstraction layer: 
   http://www.doctrine-project.org/projects/dbal.html

.. _MDB2 Schema: 
   https://raw2.github.com/pear/MDB2_Schema/master/docs/
   xml_schema_documentation.html

Using MariaDB/MySQL instead of SQLite
-------------------------------------

MySQL or MariaDB are preferred because of the `performance limitations of 
SQLite with highly concurrent applications 
<http://www.sqlite.org/whentouse.html>`_, like ownCloud.

On large instances you could consider `running MySQLTuner 
<https://github.com/major/MySQLTuner-perl/>`_ to optimize the database.

See the section :doc:`../../configuration_database/linux_database_configuration` 
for how to configure ownCloud for MySQL or MariaDB. If your installation is 
already 
running on
SQLite then it is possible to convert to MySQL or MariaDB using the steps 
provided in :doc:`../../configuration_database/db_conversion`.

Improve slow performance with MySQL on Windows
----------------------------------------------

On Windows hosts running MySQL on the same system changing the parameter 
``dbhost`` in your ``config/config.php``
from ``localhost`` to ``127.0.0.1`` could improve the page loading time.

See also `this forum thread 
<https://forum.owncloud.org/viewtopic.php?f=17&t=7559>`_.

Other performance improvements
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

MySQL: compare https://tools.percona.com/wizard to your current settings
MariaDB: https://mariadb.com/kb/en/optimization-and-tuning/

Postgresql
----------

Alternative to MariaDB/MySQL. Used in production by a few core developers.

Requires at least Postgresql 9.0

Other performance improvements
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

See http://wiki.postgresql.org/wiki/Performance_Optimization

Oracle Database
---------------

Usage scenario: Existing enterprise installations. Only core apps are supported 
and tested. Not recommended because it involves compiling the oci8

Other performance improvements
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

http://de.slideshare.net/cjorcl/best-practices-php-and-the-oracle-database and 
ask your DBA.

Problems
^^^^^^^^

When ORA-56600 occurs (Oracle Bug 8467564) set this php.ini setting:
`oci8.statement_cache_size=1000`, see `oracle forum discussion`_

.. _oracle forum discussion: 
   https://community.oracle.com/message/3468020#3468020
