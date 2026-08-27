===========
Replication
===========

.. versionadded:: 29

Nextcloud can natively split read and write operations at the level of individual database queries. Read-only
replicas serve reads, while the default (primary) database connection handles writes as well as reads that must be
consistent with a preceding write.

.. note::

    Nextcloud only routes queries to the endpoints you provide. Setting up the replication itself (provisioning the
    replicas, keeping them in sync, and monitoring replication health) is the responsibility of your database
    administrator.

Configuration
-------------

Add the read-only replicas to ``config.php`` with the ``dbreplica`` parameter. Each entry describes one replica and
accepts the same connection options as the primary database connection:

::

    'dbreplica' => [
            ['user' => 'nextcloud', 'password' => 'password1', 'host' => '10.0.3.1', 'dbname' => 'nextcloud'],
            ['user' => 'nextcloud', 'password' => 'password2', 'host' => '10.0.3.2', 'dbname' => 'nextcloud'],
        ],

When more than one replica is configured, Nextcloud picks one of them at random for the reads of a given connection.
There is no load weighting or health checking, so if you need balanced or fault-tolerant read distribution, place the
replicas behind your own load balancer and point ``dbreplica`` at it.

How queries are routed
----------------------

Nextcloud does not inspect the SQL to decide where a query goes. The routing is based on which method sends the query:
read operations are sent to a replica, and write operations are sent to the primary.

To avoid reading stale data right after a change, Nextcloud keeps a request consistent with itself: once a request has
written to the database, its subsequent reads are served from the primary as well. This guarantees *read-your-writes*
consistency: data written earlier in the same request is always read back in its up-to-date state.

Connection scope
----------------

This consistency guarantee is scoped to a single PHP process, that is one web request, one cron execution, or one
``occ`` invocation. It is therefore short-lived and does not carry over to other processes.

A single user operation may span more than one request, and there the guarantee no longer applies. Consider two
requests belonging to the same operation:

1. Request 1 creates a row.
2. Request 2 reads that row.

Request 2 does not know about the write in request 1, so it is free to read from a replica. If the two requests arrive
within a shorter timeframe than the replication lag, the replica may not have received the new row yet, the read
returns nothing, and the application logic fails.

.. warning::

    Because the consistency guarantee does not span multiple requests, the replicas must not lag significantly behind
    the primary. Noticeable replication delay leads to symptoms such as newly created or changed content that seems to
    disappear after a page refresh.

    For this reason the feature works best with a synchronous, always-consistent cluster such as Galera. Setups with
    asynchronous replication are only safe when the replication delay stays negligible.
