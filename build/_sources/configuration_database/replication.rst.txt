===========
Replication
===========

.. versionadded:: 29

Nextcloud can natively split read and write operations on a database query level. Replicas are only used for reads. The default database connection will be used for writes and causal reads.

::

	'dbreplica' => [
            ['user' => 'nextcloud', 'password' => 'password1', 'host' => '10.0.3.1', 'dbname' => 'nextcloud'],
            ['user' => 'nextcloud', 'password' => 'password2', 'host' => '10.0.3.2', 'dbname' => 'nextcloud'],
        ],
