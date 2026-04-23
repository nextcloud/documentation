==========================
Performance considerations
==========================

.. sectionauthor:: Frank Karlitschek <frank@karlitschek.com>

This document introduces some common considerations and tips on improving performance of Nextcloud. Speed of Nextcloud is important - nobody likes to wait and often, what is *just slow* for a small amount of data will become *unusable* with a large amount of data. Please keep these tips in mind when developing for Nextcloud and consider reviewing your app to make it faster.

.. note::**Tips welcome**: More tips and ideas on performance are very welcome!

PHP Performance
---------------

* Autoloader: Consider using an :ref:`optimized class loader<app-custom-classloader>`. The application code does not have to change for this optimization.
* Heavy background jobs: Consider marking :ref:`background jobs <app-backgroundjobs>` as :ref:`time insensitive <app-backgroundjobs-time-sensitivity>` if they can be run at off-peak times with lower system load, e.g. at night.

Database performance
--------------------

The database plays an important role in Nextcloud performance. The general rule is: database queries are very bad and should be avoided if possible. The reasons for that are:

* Roundtrips: Bigger Nextcloud installations have the database not installed on the application server but on a remote dedicated database server. The problem is that database queries then go over the network. These roundtrips can add up significantly if you have a lot of queries.
* Speed. A lot of people think that databases are fast. This is not always true if you compare it with handling data internally in PHP or in the filesystem or even using key/value based storages. So every developer should always double check if the database is really the best place for the data.
* Scalability. If you have a big Nextcloud cluster setup you usually have several Nextcloud/Web servers in parallel and a central database and a central storage. This means that everything that happens on the Nextcloud/PHP side can parallelize and can be scaled. Stuff that is happening in the database and in the storage is critical because it only exists once and can't be scaled so easily.

We can reduce the load on the database by:

1. Making sure that every query uses an index.
2. Reducing the overall number of queries.
3. If you are familiar with cache invalidation you can try caching query results in PHP.

There a several ways to monitor which queries are actually executed on the database.

With MySQL it is very easy with just a bit of configuration:

1. Slow query log.

If you put this into your my.cnf file, every query that takes longer than one second is logged to a logfile::

  slow_query_log = 1
  slow_query_log_file = /var/log/mysql/mysql-slow.log
  long_query_time=1

If a query takes more than a second we have a serious problem of course. You can watch it with `tail -f /var/log/mysql/mysql-slow.log` while using Nextcloud.

2. log all queries.

If you reduce the long_query_time to zero then every statement is logged. This is super helpful to see what is going on. Just do a `tail -f` on the logfile and click around in the interface or access the WebDAV interface::

  slow_query_log = 1
  slow_query_log_file = /var/log/mysql/mysql-slow.log
  long_query_time=0

3. log queries without an index.

If you increase the long_query_time to 100 and add log-queries-not-using-indexes, all the queries that are not using an index are logged. Every query should always use an index. So ideally there should be no output::

  log-queries-not-using-indexes
  slow_query_log = 1
  slow_query_log_file = /var/log/mysql/mysql-slow.log
  long_query_time=100

Writing scalable transactions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Database queries and transactions have to work efficiently no matter the size of the Nextcloud installations. They have to work with simple SQLite, a single node Postgres and a MariaDB Galera cluster to give some examples.

Database clusters
~~~~~~~~~~~~~~~~~

Single instance database offer strong consistency. Clusters can offer it too, but it comes with a performance penalty and admins occasionally choose to relax these guarantees to increase throughput. One of these allowed inconsistencies can happen on read/write split clusters, where some nodes handle only read (SELECT) operations while other can handle read and write (SELECT, INSERT, UPDATE and DELETE). Keeping replica nodes in sync with primary nodes is expensive. Allowing a few milliseconds of delay for the data to propagate from primary to replica allows the primary to process more queries.

.. versionadded:: 29
  Nextcloud installations can have a primary connection and a number of replica connections. The database abstraction will automatically split read and write operations. Reads go to a replica, unless they happen in a transaction. Writes always go to the primary. As soon as a table has been written to, subsequent reads go to the primary too.

Other installations do this split inside the cluster or with a database load balancer that sends queries to one or another node based on criteria, round robin, etc. This means that Nextcloud can't always influence where queries are executed.

It is important for Nextcloud developers to keep this in mind when writing database queries, especially when it is a series of queries. The next sections cover common anti-patterns and solutions.

Reading data that has just been written
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A common pattern that works fine with small databases but falls apart on overloaded clusters are causal reads. These happen when a Nextcloud process INSERTs new data and reads that data right away. This can be obvious to spot in the code, but sometimes this is also obfuscated because of event listeners that react on new data.

There are two patterns to avoid the "dirty" read:

  1. **Wrap the write+read operation in a transaction**. Nextcloud's read/write split, but also other database cluster load balancers will ensure that the queries of a transactions go to one single database node of a cluster. That ensures that data written is instantly available to be read back. This approach guarantees consistency, but puts additional load on the primary node because it has to execute the read operation too. This is best used in contained code blocks. Do not span transactions for event listeners because their execution might lead to :ref:`long transactions<performance-long-transactions>` and locking issues.
  2. **Avoid the read operation**. If the code allows it, avoid the read operation all together. You should know what was just written. If you need the auto increment ID, use the database's *last insert ID* feature. Proceed with this data, pass it to event listeners, etc. This approach guarantees consistency, too, but also improves overall performance.

.. tip::
  Nextcloud can help you identify read after write without the need to set up a cluster for your development environment. If you change the loglevel to 0 (debug), dirty reads will trigger a log entry. Monitor the log when testing your code.

  Look out for messages like ``dirty table reads: SELECT `id` FROM `*PREFIX*jobs` WHERE (`class` = :dcValue1) AND (`argument_hash` = :dcValue2) LIMIT 1``. Use the log entry's *trace* to locate the code that executed the query.

  Be aware that the dirty read detection is not perfect and might wrongly log a dirty read when you write and read unrelated data. As an example, you may read user *alice*, update her data, and then read *bob*'s data and do the same. Even if the database replicates slow, you will not read data that doesn't exist yet. Since Nextcloud tracks on a table level, it still warns.

.. _performance-long-transactions:

Long transactions
~~~~~~~~~~~~~~~~~

Transactions are crucial for changes that belong together but they can cause problems under load. That's because the longer the transaction is open, the more other queries may have to wait for a lock to be released. This can lead to contention, timing out requests and deadlocks. So use transaction wisely and try to keep them as short as possible. Don't mix them database operations with file system operations, for example.

.. tip::
  Nextcloud can help you identify slow transactions. If you change the loglevel to 0 (debug), slow transaction will cause a log message at commit/rollback.

  Look out for messages like ``Transaction took longer than 1s: 7.1270351409912`` and ``Transaction rollback took longer than 1s: 1.2153599501``.

Measuring performance
^^^^^^^^^^^^^^^^^^^^^

If you do bigger changes in the architecture or the database structure you should always double check the positive or negative performance impact.

The recommendation is to automatically do 10000 PROPFINDs or file uploads, measure the time and compare the time before and after the change.

Cached data
-----------

Starting from Nextcloud 26, user and group display names now are cached. Use the ``IUserManager::getDisplayName`` or ``IGroupManager::getDisplayName`` functions to avoid roundtrips to the database.

Getting help
------------

If you need help with performance or other issues please ask on our `forums <https://help.nextcloud.com>`_.
