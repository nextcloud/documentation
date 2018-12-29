==========================
Transactional file locking
==========================

Nextcloud's Transactional File Locking mechanism locks files to avoid
file corruption during normal operation. It performs these functions:

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

What Transactional File locking is not for: it will not prevent multiple users
from editing the same document, or give notice that other users are working on
the same document. Multiple users can open and edit a file at the same time and
Transactional File locking does not prevent this. Rather, it prevents
simultaneous file saving.

File locking is enabled by default, using the database locking backend. This
places a significant load on your database. Using ``memcache.locking`` relieves
the database load and improves performance. Admins of Nextcloud servers with
heavy workloads should install a memcache. (See
:doc:`../configuration_server/caching_configuration`.)

To use a memcache with Transactional File Locking, you must install the Redis
server and corresponding PHP module. After installing Redis you must enter a
configuration in your ``config.php`` file like this example::

  'filelocking.enabled' => true,
  'memcache.locking' => '\OC\Memcache\Redis',
  'redis' => array(
       'host' => 'localhost',
       'port' => 6379,
       'timeout' => 0.0,
       'password' => '', // Optional, if not defined no password will be used.
        ),

.. note:: For enhanced security it is recommended to configure Redis to require
   a password. See http://redis.io/topics/security for more information.

If you want to configure Redis to listen on an Unix socket (which is
recommended if Redis is running on the same system as Nextcloud) use this example
``config.php`` configuration::

  'filelocking.enabled' => true,
  'memcache.locking' => '\OC\Memcache\Redis',
  'redis' => array(
       'host' => '/var/run/redis/redis.sock',
       'port' => 0,
       'timeout' => 0.0,
        ),

See ``config.sample.php`` to see configuration examples for Redis, and for all
supported memcaches.

If you are on Ubuntu you can follow `this guide
<https://www.techandme.se/how-to-configure-redis-cache-in-ubuntu-14-04-with-owncloud/>`_ for a complete installation from scratch.

Learn more about Redis at `Redis <http://redis.io/>`_. Memcached, the popular
distributed memory caching system, is not suitable for the new file locking
because it is not designed to store locks, and data can disappear from the cache
at any time. Redis is a key-value store, and it guarantees that cached objects
are available for as long as they are needed.

