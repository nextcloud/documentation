=========
Deadlocks
=========

Deadlocks are a classic problem in transactional databases, but **they
are not dangerous unless they are so frequent that you cannot run
certain transactions at all**. Normally, you must write your
applications so that they are always prepared to re-issue a transaction
if it gets rolled back because of a deadlock.

Understanding the locking situation
-----------------------------------

MySQL/MariaDB automatically detects transaction deadlocks and rolls back
a transaction or transactions to break the deadlock. It tries to pick
small transactions to roll back, where the size of a transaction is
determined by the number of rows inserted, updated, or deleted.

In order to fix a deadlock you will need to get an understanding of the
scenarios where deadlocks occur in your application by analyzing the
Nextcloud log for patterns in the deadlock errors. The Nextcloud log
will only show the transaction that was rolled back in this case so in
order to properly understand the deadlock scenario it is required to
obtain further information from the database server. By default you can
find the last detected deadlock in the output of
``SHOW ENGINE INNODB STATUS`` however ``innodb_print_all_deadlocks`` can
be used as a setting to write all occurring deadlocks to the server
logs. Those give detailed insight about which queries are holding a lock
and are causing the query from Nextcloud to run into a deadlock.

Mitigations
-----------

There are basically 3 options on how deadlocks can be handled properly.
It is not critical for all use case to handle them, however as per
recommendation of MySQL/MariaDB the application should be prepared to
handle them properly.

Ignoring deadlocks
^^^^^^^^^^^^^^^^^^

There are some scenarios where a deadlock could be safely ignored, like
when updating a timestamp that is likely already being updated by
another concurrent request. In this case developers can catch the
exception and ignore the failed transaction.

-  Potentially useful API wrapper:
   https://github.com/nextcloud/server/pull/38030
-  Valid case example: https://github.com/nextcloud/server/pull/37820

::

   try {
         // Database transaction that runs into the deadlock
       $qb->executeStatement();
   } catch (DbalException $e) {
         // ignore the failure
           $this->logger->info("Deadlock detected, but ignored", ['exception' => $e]);
   }

Retrying deadlocks
^^^^^^^^^^^^^^^^^^

In other cases it might be feasible to just retry the specific database
transactions. In this case the exception needs to be caught and the
transaction needs to be re-issued. It is recommended to limit the amount
if retries in case the deadlock occurring regularly. In this case you
may follow the next section.

An example how to do that can be found in
https://github.com/nextcloud/server/pull/34302

Starting with Nextcloud 27 there is also a useful helper method
``atomicRetry`` which makes retrying transactions a lot simpler:

::

   class MyClass {
     use \OCP\AppFramework\Db\TTransactional;

     public function myFunction() {
        $this->atomicRetry(function() {
          // Database transaction that runs into the deadlock
          $qb->executeStatement();
        }, $this->connection, 5);
     }
   }

Avoiding deadlocks
^^^^^^^^^^^^^^^^^^

While not always possible due to the concurrency that may happen on
Nextcloud, it might be feasible to refactor logic so that the load of
concurrent writes to a table or columns is reduced or only one request
may hold a lock at a table row at the same time.

References
----------

* https://dev.mysql.com/doc/refman/8.0/en/innodb-deadlocks.html
* https://dev.mysql.com/doc/refman/8.0/en/innodb-deadlocks-handling.html
* https://percona.community/blog/2018/09/24/minimize-mysql-deadlocks-3-steps/
* https://www.percona.com/blog/enable-innodb_print_all_deadlocks-parameter-to-get-all-deadlock-information-in-mysqld-error-log/
