Performance Considerations
==========================

.. sectionauthor:: Frank Karlitschek <frank@karlitschek.com>

This document introduces some common considerations and tips on improving performance of Nextcloud. Speed of Nextcloud is important - nobody likes to wait and often, what is *just slow* for a small amount of data will become *unusable* with a large amount of data. Please keep these tips in mind when developing for Nextcloud and consider reviewing your app to make it faster.

.. note::**Tips welcome**: More tips and ideas on performance are very welcome!

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
  slow_query_log = /var/log/mysql/mysql-slow.log
  long_query_time=1

If a query takes more than a second we have a serious problem of course. You can watch it with `tail -f /var/log/mysql/mysql-slow.log` while using Nextcloud.

2. log all queries.

If you reduce the long_query_time to zero then every statement is logged. This is super helpful to see what is going on. Just do a `tail -f` on the logfile and click around in the interface or access the WebDAV interface::

  slow_query_log = 1
  slow_query_log = /var/log/mysql/mysql-slow.log
  long_query_time=0

3. log queries without an index.

If you increase the long_query_time to 100 and add log-queries-not-using-indexes, all the queries that are not using an index are logged. Every query should always use an index. So ideally there should be no output::

  log-queries-not-using-indexes
  slow_query_log = 1
  slow_query_log = /var/log/mysql/mysql-slow.log
  long_query_time=100

Measuring performance
~~~~~~~~~~~~~~~~~~~~~

If you do bigger changes in the architecture or the database structure you should always double check the positive or negative performance impact. There are a `few nice small scripts <https://github.com/owncloud/administration/tree/master/performance-tests>`_ that can be used for this.

The recommendation is to automatically do 10000 PROPFINDs or file uploads, measure the time and compare the time before and after the change.

Getting help
------------
If you need help with performance or other issues please ask on our `forums <https://help.nextcloud.com>`_ or on our IRC channel **#nextcloud-dev** on **irc.freenode.net**.
