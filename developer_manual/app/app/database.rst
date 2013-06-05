Database Access
===============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

After the schema has been defined it is possible to query the database. ownCloud uses prepared statements. A simple query would look like this:

.. code-block:: php

  <?php
  
  // *PREFIX* is being replaced with the ownCloud installation prefix
  $sql = 'SELECT * FROM `*PREFIX*myusers` WHERE id = ?';
  $args = array(1);

  $query = \OCP\DB::prepare($sql);
  $result = $query->execute($args);

  while($row = $result->fetchRow()) {
  	  $userName = $row['username'];
  }

If a new element is saved to the database the inserted id can be accessed by using:

.. code-block:: php

  <?php

  $id = \OCP\DB::insertid();


It is also possible to use transactions:

.. code-block:: php

  <?php

  \OCP\DB::beginTransaction();

  $sql = 'SELECT * FROM `*PREFIX*myusers` WHERE id = ?';
  $args = array(1);

  $query = \OCP\DB::prepare($sql);
  $result = $query->execute($args);

  \OCP\DB::commit();
