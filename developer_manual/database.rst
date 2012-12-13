Database
========

ownCloud uses a database abstraction layer on top of either MDB2 or PDO, depending on the availability of PDO on the server.

Apps should always use prepared statements when accessing the database as seen in the following example:

.. code-block:: php
  
  $query=OC_DB::prepare('SELECT foo,bar FROM *PREFIX*mytable' WHERE user=?');
  $result=$query->execute(array($userId));
  $data=$result->fetchAll();

*'PREFIX'* in the query string will be replaced by the configured database table prefix while preparing the query. Arguments for the prepared statement are denoted by a '?' in the query string and passed during execution in an array.
For more information about MDB2 style prepared statements, please see the official MDB2 documentation `here`_

If an app requires additional tables in the database they can be automatically created and updated by specifying them inside appinfo/database.xml using MDB2's `xml scheme notation`_ where the placeholders *'dbprefix'* and *'dbname'* can be used for the configured database table prefix and database name. To update the tables used by the app, simply adjust the database.xml file and increase the app version number to trigger an update.

.. _here: http://pear.php.net/package/MDB2/
.. _xml scheme notation: http://www.sulc.edu/sulcalumni/app/lib/pear/docs/MDB2_Schema/docs/xml_schema_documentation.html
