==============
Memory caching
==============

You can significantly improve your Nextcloud server performance with memory 
caching, where frequently-requested objects are stored in memory for faster 
retrieval. There are two types of caches to use: a PHP opcode cache, which is 
commonly called *opcache*, and data cache for your web server, commonly called
"memcache".

.. note:: If you do not install and enable a local memcache you will see a
   warning on your Nextcloud admin page. **A memcache is not required. You
   may safely ignore the warning if you prefer.** If you enable only a
   distributed cache (``memcache.distributed``) in your ``config.php`` and not
   a local cache (``memcache.local``) you will still see the cache warning.

A **PHP opcache** stores compiled PHP scripts, so they don't need to be re-compiled 
every time they are called. PHP bundles the Zend OPcache in core since version 
5.5, so you don't need to install an opcache manually.

**Data caching** is supplied by the user. Nextcloud supports multiple memory
caching backends, so you can choose the type of memcache that best fits your
needs. The supported caching backends are:

* `APCu <https://pecl.php.net/package/APCu>`_, APCu 4.0.6 and up required.
   A local cache for systems.
* `Redis <http://redis.io/>`_, server 4.0.0 and up required.
   For local and distributed caching, as well as transactional file locking.
* `Memcached <https://www.memcached.org/>`_
   For distributed caching.
   
Data caches, or memcaches, must be explicitly configured in Nextcloud by installing
and enabling your desired cache, and then adding the appropriate entry to 
``config.php`` (See :doc:`config_sample_php_parameters` for an overview of
all possible config parameters).


Recommendations based on type of deployment
-------------------------------------------

You may use both a local and a distributed cache. Recommended caches are APCu 
and Redis. After installing and enabling your chosen memcache (data cache),
verify that it is active by running :ref:`label-phpinfo`.

.. note:: See specific cache configuration options under the appropriate section further down.

Small/Private home server
^^^^^^^^^^^^^^^^^^^^^^^^^

Only use APCu::

    'memcache.local' => '\OC\Memcache\APCu',

Organizations with single-server
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Use Redis for everything except local memcache::

  'memcache.local' => '\OC\Memcache\APCu',
  'memcache.distributed' => '\OC\Memcache\Redis',
  'memcache.locking' => '\OC\Memcache\Redis',
  'redis' => [
       'host' => 'localhost',
       'port' => 6379,
  ],

Organizations with clustered setups
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Use APCu for local cache and either Redis cluster ...::

  'memcache.local' => '\OC\Memcache\APCu',
  'memcache.distributed' => '\OC\Memcache\Redis',
  'memcache.locking' => '\OC\Memcache\Redis',
  'redis.cluster' => [
      'seeds' => [ // provide some/all of the cluster servers to bootstrap discovery, port required
         'cache-cluster:7000',
         'cache-cluster:7001',
      ],
   ],

... or Memcached cluster ...::

  'memcache.local' => '\OC\Memcache\APCu',
  'memcache.distributed' => '\OC\Memcache\Memcached',
  'memcache.locking' => '\OC\Memcache\Memcached',
  'memcached_servers' => [
      [ 'server1.example.com', 11211 ],
      [ 'server2.example.com', 11211 ],
   ],

... for distributed and locking caches.

.. note:: If you run multiple web servers and enable a distributed cache in
    your ``config.php`` (``memcache.distributed``) or a file locking provider
    (``memcache.locking``) you need to make sure that they are referring to the
    very same memcache server/cluster and not to ``localhost`` or a unix socket.

Additional notes for Redis vs. APCu on memory caching
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

APCu is faster at local caching than Redis. If you have enough memory, use APCu for Memory Caching
and Redis for File Locking. If you are low on memory, use Redis for both.


APCu
----

APCu is a data cache, and it is available in most
Linux distributions. On Red Hat/CentOS/Fedora systems install
``php-pecl-apcu``. On Debian/Ubuntu/Mint systems install ``php-apcu``.

After restarting your Web server, add this line to your ``config.php`` file::

 'memcache.local' => '\OC\Memcache\APCu',
 
Refresh your Nextcloud admin page, and the cache warning should disappear.  

.. warning:: APCu is disabled by default on CLI which could cause issues with nextcloud's
   cron jobs. Please make sure you set the ``apc.enable_cli`` to ``1`` on your ``php.ini``
   config file or append ``--define apc.enable_cli=1`` to the cron job call.


Redis
-----

Redis is an excellent modern memcache to use for distributed caching, and
as a key-value store for :doc:`Transactional File Locking
<../configuration_files/files_locking_transactional>` because it guarantees 
that cached objects are available for as long as they are needed.

The Redis PHP module must be version 2.2.6+. If you are running a Linux
distribution that does not package the supported versions of this module, or 
does not package Redis at all, see :ref:`install_redis_label`.

On Debian/Ubuntu/Mint, install ``redis-server`` and ``php-redis``. The installer
will automatically launch ``redis-server`` and configure it to launch at 
startup.

On CentOS and Fedora, install ``redis`` and ``php-pecl-redis``. It will not 
start automatically, so you must use your service manager to start 
``redis``, and to launch it at boot as a daemon.
 
You can verify that the Redis daemon is running with ``ps ax``::
 
 ps ax | grep redis
 22203 ? Ssl    0:00 /usr/bin/redis-server 127.0.0.1:6379 

Restart your Web server, add the appropriate entries to your ``config.php``, and 
refresh your Nextcloud admin page.

Redis configuration in Nextcloud (config.php)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

For best performance, use Redis for file locking by adding this::

  'memcache.locking' => '\OC\Memcache\Redis',

Additionally, you should use Redis for the distributed server cache:: 

  'memcache.distributed' => '\OC\Memcache\Redis',

Furthermore, you could use Redis for the local cache like so, but it's not recommended (see warning below):: 

  'memcache.local' => '\OC\Memcache\Redis',

.. warning:: Using Redis for local cache on a multi-server setup can cause issues. Also, even on a single-server setup, APCu (see section above) should be faster.

When using Redis for any of the above cache settings, you also need to
specify either the ``redis`` or ``redis.cluster`` configuration in ``config.php``.

The following options are available to configure when using a single redis server (all but ``host`` and ``port`` are optional. For the latter two, see the next sections)::

   'memcache.locking' => '\OC\Memcache\Redis',
   'memcache.distributed' => '\OC\Memcache\Redis',
   'memcache.local' =>'\OC\Memcache\Redis' ,
   'redis' => [
      // 'host'      => see connection parameters below
      // 'port'      => see connection parameters below
     'user'          => 'nextcloud',
     'password'      => 'password',
     'dbindex'       => 0,
     'timeout'       => 1.5,
     'read_timeout'  => 1.5,
   ],

The following options are available to configure when using a redis cluster (all but ``seeds`` are optional)::

   'memcache.locking' => '\OC\Memcache\Redis',
   'memcache.distributed' => '\OC\Memcache\Redis',
   'memcache.local' =>'\OC\Memcache\Redis' ,
   'redis.cluster' => [
      'seeds' => [ // provide some/all of the cluster servers to bootstrap discovery, port required
         'cache-cluster:7000',
         'cache-cluster:7001',
         'cache-cluster:7002',
         'cache-cluster:7003',
         'cache-cluster:7004',
         'cache-cluster:7005'
      ],
      'failover_mode'   => \RedisCluster::FAILOVER_ERROR,
      'timeout'         => 0.0,
      'read_timeout'    => 0.0,
      'user'            => 'nextcloud',
      'password'        => 'password',
      'dbindex'         => 0,
   ],
      
.. note:: The port is required as part of the server URL. However, it is not necesarry to list all servers: for example, if all servers are load balanced via the same DNS name, only that server name is required.

Connecting to single Redis server over TCP
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To connect to a remote or local Redis server over TCP use::

   'redis' => [
      'host' => 'redis-host.example.com',
      'port' => 6379,
   ],

Connecting to single Redis server over TLS
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
To connect via TCP over TLS, add the following  configuration::

   'redis' => [
      'host' => 'tls://127.0.0.1',
      'port' => 6379,
      'ssl_context' => [
         'local_cert' => '/certs/redis.crt',
         'local_pk' => '/certs/redis.key',
         'cafile' => '/certs/ca.crt',
         'verify_peer_name' => false,
      ],
   ],

Connecting to Redis cluster over TLS
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
To connect via TCP over TLS, add the following  configuration::

   'redis.cluster' => [
      'seeds' => [ // provide some/all of the cluster servers to bootstrap discovery, port required
         'cache-cluster:7000',
         'cache-cluster:7001',
      ],
      'ssl_context' => [
         'local_cert' => '/certs/redis.crt',
         'local_pk' => '/certs/redis.key',
         'cafile' => '/certs/ca.crt',
         'verify_peer_name' => false,
      ],
   ],

Connecting to single Redis server over UNIX socket
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you want to connect to Redis configured to listen on an Unix socket (which is
recommended if Redis is running on the same system as Nextcloud) use this example
``config.php`` configuration::

   'redis' => [
      'host'     => '/run/redis/redis-server.sock',
      'port'     => 0,
   ],

Only "host" and "port" variables are required, the other ones are optional.

Update the redis configuration in ``/etc/redis/redis.conf`` accordingly: uncomment Unix socket options and ensure the "socket" and "port" settings match your Nextcloud configuration.

Be sure to set the right permissions on redis.sock so that your webserver can
read and write to it. For this you typically have to add the webserver user
to the redis group::

  usermod -a -G redis www-data

And modify the ``unixsocketperm`` of the ``redis.conf`` accordingly::

  unixsocketperm 770

You might need to restart apache and redis for the changes to take effect::

 systemctl restart apache2
 systemctl restart redis-server

Redis is very configurable; consult `the Redis documentation 
<http://redis.io/documentation>`_ to learn more.

Using the Redis session handler
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you are using Redis for locking and/or caching,
you may also wish to use Redis for session management. Redis can be used for centralized
session management across multiple Nextcloud application servers, unlike the standard
`files` handler. If you use the Redis handler, though, you *MUST* ensure that session
locking is enabled. As of this writing, the Redis session handler does *NOT* enable
session locking by default, which can lead to session corruption in some Nextcloud apps
that make heavy use of session writes such as Talk. In addition, even when session locking
is enabled, if the application fails to acquire a lock, the Redis session handler does not
currently return an error. Adding the following settings in your ``php.ini`` file will
prevent session corruption when using Redis as your session handler: ::

  redis.session.locking_enabled=1
  redis.session.lock_retries=-1
  redis.session.lock_wait_time=10000

More information on configuration of phpredis session handler can be found on the
`PhpRedis GitHub page <https://github.com/phpredis/phpredis>`_

..  _install_redis_label:


Memcached
---------

Memcached is a reliable oldtimer for shared caching on distributed servers,
and performs well with Nextcloud with one exception: it is not suitable to use
with :doc:`Transactional File Locking <../configuration_files/files_locking_transactional>`
because it does not store locks, and data can disappear from the cache at any time
(Redis is the best memcache for this).

.. note:: Be sure to install the **memcached** PHP module, and not memcache, as
   in the following examples. Nextcloud supports only the **memcached** PHP
   module.

Setting up Memcached is easy. On Debian/Ubuntu/Mint install ``memcached`` and
``php-memcached``. The installer will automatically start ``memcached`` and
configure it to launch at startup.

On Red Hat/CentOS/Fedora install ``memcached`` and
``php-pecl-memcached``. It will not start automatically, so you must use
your service manager to start ``memcached``, and to launch it at boot as a
daemon.

You can verify that the Memcached daemon is running with ``ps ax``::

 ps ax | grep memcached
 19563 ? Sl 0:02 /usr/bin/memcached -m 64 -p 11211 -u memcache -l
 127.0.0.1

Restart your Web server, add the appropriate entries to your
``config.php``, and refresh your Nextcloud admin page.

Memcached configuration in Nextcloud (config.php)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This example uses APCu for the local cache, Memcached as the distributed memcache,
and lists all the servers in the shared cache pool with their port numbers::

 'memcache.local' => '\OC\Memcache\APCu',
 'memcache.distributed' => '\OC\Memcache\Memcached',
 'memcache.locking' => '\OC\Memcache\Memcached',
 'memcached_servers' => [
      [ 'server0.example.com', 11211 ],
      [ 'server1.example.com', 11211 ],
      [ 'server2.example.com', 11211 ],
  ],


Cache Directory location
------------------------

The cache directory defaults to ``data/$user/cache`` where ``$user`` is the 
current user. You may use the ``'cache_path'`` directive in ``config.php``
(See :doc:`config_sample_php_parameters`) to select a different location.
