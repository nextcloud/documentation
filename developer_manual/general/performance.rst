Performance Considerations
==========================

.. sectionauthor:: Frank Karlitschek <frank@owncloud.org>

This document introduces some common considerations and tips on improving performance of ownCloud. Speed of ownCloud is important - nobody likes to wait and often, what is *just slow* for a small amount of data will become *unusable* with a large amount of data. Please keep these tips in mind when developing for ownCloud and consider reviewing your app to make it faster.

.. note::**Tips welcome**: More tips and ideas on performance are very welcome!

Database performance
--------------------
The database plays an important role in ownCloud performance. The general rule is: database queries are very bad and should be avoided if possible. The reasons for that are:

* Roundtrips: Bigger ownCloud installations have the database not installed on the application server but on a remote dedicated database server. The problem is that database queries than go over the network. This roundtrips can add up significantly if you have a lot of queries. 
* Speed. A lot of people think that databases are fast. This is not always true if you compare it with handing data internally in PHP or in the filesystem or even use key/value based storages. So every developer should always double check if the database is really the best place for the data.
* Scalability. If you have a big ownCloud cluster setup than you usually have several ownCloud/webservers in parallel and a central database and a central storage. This mean that everything that happens on the ownCloud/PHP side can parallelize and can be scaled. Stuff that is happening in the database and in the storage is critical because it only exists once and can't be scaled so easily.

We can reduce the load on the database by:

1. Making sure that always an index is used.
2. Reducing the overall numbers of queries.

There a several ways to monitor which queries are actually executed on the database.

With MySQL is is very easy with just a bit of configuration:

1. Slow query log.

If you put this into your my.cnf file than every query that takes longer than one second is logged to a logfile::

  log_slow_queries = 1 
  log_slow_queries = /var/log/mysql/mysql-slow.log 
  long_query_time=1 

If a query takes over one second than we have a serious problem of course. You can watch it with `tail -f /var/log/mysql/mysql-slow.log` while using ownCloud.

2. log all queries.

If you reduce the long_query_time to zero than every statement is logged. This is super helpful to see what is going on. Just do a `tail -f` on the logfile and click around in the interface or access the WebDAV interface::

  log_slow_queries = 1
  log_slow_queries = /var/log/mysql/mysql-slow.log
  long_query_time=0

3. log queries without an index.

If you increase the long_query_time to 100 and add log-queries-not-using-indexes than all the queries that are not using an index are logged. Every query should always use an index. So ideally there should be no output::

  log-queries-not-using-indexes
  log_slow_queries = 1
  log_slow_queries = /var/log/mysql/mysql-slow.log
  long_query_time=100

Measuring performance
~~~~~~~~~~~~~~~~~~~~~

If you do bigger changes in the architecture or the the database structure you should always double check the positive or negative performance impact. There are a `few nice small scripts <https://github.com/owncloud/administration/tree/master/performance-tests>`_ than can be used for this.

The recommendation is to automatically do 10000 PROPFINDs or file uploads, measure the time and compare the time before and after the change.

Getting help
------------
If you need help with performance or other issues please ask on our `mailing list <http://mailman.owncloud.org/mailman/listinfo/devel>`_ or on our IRC channel **#owncloud-dev** on **irc.freenode.net**.
