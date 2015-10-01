==========================
Transactional File Locking
==========================

ownCloud's new transactional file locking mechanism operates differently than 
the old File Locking application, and will eventually replace it. If you elect 
to use the new file locking mechanism make sure you disable the File Locking 
app.

The new file locking mechanism has these capabilities:

* Operates at a higher level than the filesystem, so you don't need to use a 
  filesystem that supports locking
* Locks parent directories so they cannot be renamed during any activity on 
  files inside the directories
* Releases locks after file transactions are interrupted, for 
  example when a sync client loses the connection during an upload
* Manages locking and releasing locks correctly on shared files during changes 
  from multiple users
* Manages locks correctly on external storage mounts
* Manages encrypted files correctly

You must install the Redis server and corresponding PHP module for the new file 
locking to work. (See :doc:`../configuration_server/caching_configuration`.)

After installing Redis you must enter a configuration in your ``config.php`` 
file like this example::

  'filelocking.enabled' => 'true',
  'memcache.locking' => '\OC\Memcache\Redis',
  'redis' => array(
       'host' => 'localhost',
       'port' => 6379,
       'timeout' => 0.0,
        ),

The **Server status** section on your ownCloud Admin page indicates whether 
experimental file locking is enabled or disabled.

.. figure:: ../images/transactional-locking-1.png

.. figure:: ../images/transactional-locking-2.png

See ``config.sample.php`` to see configuration examples for Redis, and for all 
supported memcaches.

Learn more about Reds at `Redis <http://redis.io/>`_. Memcached, the popular 
distributed memory caching system, is not suitable for the new file locking 
because it is not designed to store locks, and data can disappear from the cache 
at any time. Redis is a key-value store, and it guarantees that cached objects 
are available for as long as they are needed. 
