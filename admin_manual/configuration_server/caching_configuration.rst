==========================
Configuring Memory Caching
==========================

You can significantly improve your Nextcloud server performance with memory 
caching, where frequently-requested objects are stored in memory for faster 
retrieval. There are two types of caches to use: a PHP opcode cache, which is 
commonly called *opcache*, and data caching for your Web server. If you do not 
install and enable a local memcache you will see a warning on your Nextcloud 
admin page. **A memcache is not required and you may safely ignore the warning 
if you prefer.**

.. note:: If you enable only a distributed cache in 
   your ``config.php`` (``memcache.distributed``) and not a 
   local cache (``memcache.local``) you will still see the cache warning.

A PHP opcache stores compiled PHP scripts so they don't need to be re-compiled 
every time they are called. PHP bundles the Zend OPcache in core since version 
5.5, so you don't need to install an opcache manually.

Data caching is supplied by the user (APCu), Memcached or Redis.

Nextcloud supports multiple memory caching backends, so you can choose the type 
of memcache that best fits your needs. The supported caching backends are:

* `APCu <https://pecl.php.net/package/APCu>`_, APCu 4.0.6 and up required.
   A local cache for systems.
* `Memcached <http://www.memcached.org/>`_ 
   Distributed cache for multi-server Nextcloud installations.
* `Redis <http://redis.io/>`_, PHP module 2.2.6 and up required.
   For distributed caching.
   
Memcaches must be explicitly configured in Nextcloud by installing
and enabling your desired cache, and then adding the appropriate entry to 
``config.php`` (See :doc:`config_sample_php_parameters` for an overview of
all possible config parameters).

You may use both a local and a distributed cache. Recommended caches are APCu 
and Redis. After installing and enabling your chosen memcache, verify that it is 
active by running :ref:`label-phpinfo`.

APCu
----

PHP 5.5 and up include the Zend OPcache in core, and on most Linux 
distributions it is enabled by default. However, it does 
not bundle a data cache. APCu is a data cache, and it is available in most 
Linux distributions. On Red Hat/CentOS/Fedora systems install
``php-pecl-apcu``. On Debian/Ubuntu/Mint systems install ``php5-apcu`` or ``php7.0-apcu``.
On Ubuntu 14.04 LTS, the APCu version (4.0.2) is too old to use with Nextcloud (requires 4.0.6+).
You may install 4.0.7 from Ubuntu backports with this command::

  apt-get install php5-apcu/trusty-backports
   
Then restart your Web server.

After restarting your Web server, add this line to your ``config.php`` file::

 'memcache.local' => '\OC\Memcache\APCu',
 
Refresh your Nextcloud admin page, and the cache warning should disappear.  

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
``php5-memcached``. The installer will automatically start ``memcached`` and 
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
``config.php``, and refresh your Nextcloud admin page. This example uses APCu 
for the local cache, Memcached as the distributed memcache, and lists all the 
servers in the shared cache pool with their port numbers::

 'memcache.local' => '\OC\Memcache\APCu',
 'memcache.distributed' => '\OC\Memcache\Memcached',
 'memcached_servers' => array(
      array('localhost', 11211),
      array('server1.example.com', 11211),
      array('server2.example.com', 11211), 
      ), 

Redis
-----

Redis is an excellent modern memcache to use for both distributed caching, and 
as a local cache for :doc:`Transactional File Locking 
<../configuration_files/files_locking_transactional>` because it guarantees 
that cached objects are available for as long as they are needed.

The Redis PHP module must be version 2.2.6+. If you are running a Linux
distribution that does not package the supported versions of this module, or 
does not package Redis at all, see :ref:`install_redis_label`.

On Debian/Ubuntu/Mint install ``redis-server`` and ``php5-redis`` or ``php7.0-redis``. The installer
will automatically launch ``redis-server`` and configure it to launch at 
startup.

On CentOS and Fedora install ``redis`` and ``php-pecl-redis``. It will not 
start automatically, so you must use your service manager to start 
``redis``, and to launch it at boot as a daemon.
 
You can verify that the Redis daemon is running with ``ps ax``::
 
 ps ax | grep redis
 22203 ? Ssl    0:00 /usr/bin/redis-server 127.0.0.1:6379 
 
Restart your Web server, add the appropriate entries to your ``config.php``, and 
refresh your Nextcloud admin page. This example ``config.php`` configuration uses 
Redis for the local server cache::

  'memcache.local' => '\OC\Memcache\Redis',
  'redis' => array(
       'host' => 'localhost',
       'port' => 6379,
        ),

For best performance, use Redis for file locking by adding this::

  'memcache.locking' => '\OC\Memcache\Redis',

If you want to connect to Redis configured to listen on an Unix socket (which is
recommended if Redis is running on the same system as Nextcloud) use this example
``config.php`` configuration::

  'memcache.local' => '\OC\Memcache\Redis',
  'redis' => array(
       'host' => '/var/run/redis/redis.sock',
       'port' => 0,
       'dbindex' => 0,
       'password' => 'secret',
       'timeout' => 1.5,
        ),

Only "host" and "port" variables are required, the other ones are optional.

Redis is very configurable; consult `the Redis documentation 
<http://redis.io/documentation>`_ to learn more.

Cache Directory Location
------------------------

The cache directory defaults to ``data/$user/cache`` where ``$user`` is the 
current user. You may use the ``'cache_path'`` directive in ``config.php``
(See :doc:`config_sample_php_parameters`) to select a different location.

Recommendations Based on Type of Deployment
-------------------------------------------

Small/Private Home Server
^^^^^^^^^^^^^^^^^^^^^^^^^

Only use APCu::

    'memcache.local' => '\OC\Memcache\APCu',

Small Organization, Single-server Setup
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Use APCu for local caching, Redis for file locking::

 'memcache.local' => '\OC\Memcache\APCu',
 'memcache.locking' => '\OC\Memcache\Redis',
  'redis' => array(
       'host' => 'localhost',
       'port' => 6379,
        ),

Large Organization, Clustered Setup
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Use Redis for everything except local memcache::

  'memcache.distributed' => '\OC\Memcache\Redis',
  'memcache.locking' => '\OC\Memcache\Redis',
  'memcache.local' => '\OC\Memcache\APCu',
  'redis' => array(
       'host' => 'localhost',
       'port' => 6379,
        ),

Additional notes for Redis vs. APCu on Memory Caching
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

APCu is faster at local caching than Redis. If you have enough memory, use APCu for Memory Caching
and Redis for File Locking. If you are low on memory, use Redis for both.

..  _install_redis_label:     

Additional Redis Installation Help
----------------------------------

If your version of Mint or Ubuntu does not package the required version of 
``php5-redis``, then try `this Redis guide on Tech and Me 
<https://www.techandme.se/how-to-configure-redis-cache-in-ubuntu-14-04-with-
owncloud/>`_ for a complete Redis installation on Ubuntu 14.04 using PECL. 
These instructions are adaptable for any distro that does not package the 
supported version, or that does not package Redis at all, such as SUSE Linux 
Enterprise Server and Red Hat Enterprise Linux.

The Redis PHP module must be at least version 2.2.6. Please note that
the Redis PHP module versions 2.2.x will only work for PHP 5.6.x.

For PHP 7.0 and PHP 7.1 use Redis PHP module 3.1.x or later.
  
See `<https://pecl.php.net/package/redis>`_

On Debian/Mint/Ubuntu, use ``apt-cache`` to see the available 
``php5-redis`` version, or the version of your installed package::

 apt-cache policy php5-redis
 
On CentOS and Fedora, the ``yum`` command shows available and installed version 
information::

 yum search php-pecl-redis
