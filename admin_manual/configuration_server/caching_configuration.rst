==========================
Configuring Memory Caching
==========================

You can significantly improve your ownCloud server performance with memory 
caching, where frequently-requested objects are stored in memory for faster 
retrieval. There are two types of caches to use: a PHP opcode cache, which is 
commonly called *opcache*, and data caching for your Web server. If you do not 
install and enable a local memcache you will see a warning on your ownCloud 
admin page. A memcache is not required and you may ignore the warning if you 
prefer.

.. note:: If you enable only a distributed cache in 
   your ``config.php`` (``memcache.distributed``) and not a 
   local cache (``memcache.local``) you will still see the cache warning.

A PHP opcache stores compiled PHP scripts so they don't need to be re-compiled 
every time they are called. PHP bundles the Zend OPcache in core since version 
5.5, so you don't need to install an opcache.

If you are using PHP 5.4, which is the oldest supported PHP version for 
ownCloud, you may install the Alternative PHP Cache (APC). This is both an 
opcache and data cache. APC has not been updated since 2012 and is essentially 
dead, and PHP 5.4 is old and lags behind later releases. If it is possible 
to upgrade to a later PHP release that is the best option.

Data caching is supplied by the Alternative PHP Cache, user (APCu) in PHP 
5.5+, Memcached, or Redis.

ownCloud supports multiple memory caching backends, so you can choose the type 
of memcache that best fits your needs. The supported caching backends are:

* `APC <http://php.net/manual/en/book.apc.php>`_ 
   A local cache for systems running PHP 5.4.
* `APCu <https://pecl.php.net/package/APCu>`_ 
   A local cache for systems running PHP 5.5 and up, APCu 4.06 or better required.
* `Memcached <http://www.memcached.org/>`_ 
   Distributed cache for multi-server ownCloud installations.
* `Redis <http://redis.io/>`_ 
   For distributed caching, and required for Transactional File Locking.

These are supported but not recommended:

* `XCache <http://xcache.lighttpd.net/>`_ 
* `ArrayCache <http://www.arbylon.net/projects/knowceans-tools/doc/org/knowceans/util/ArrayCache.html>`_
   
Memcaches must be explicitly configured in ownCloud 8.1 and up by installing 
and enabling your desired cache, and then adding the appropriate entry to 
``config.php``.

You may use both a local and a distributed cache. Recommended caches are APCu 
and Redis. After installing and enabling your chosen memcache, verify that it is 
active by running :ref:`label-phpinfo`.
   
APC
---

APC is only for systems running PHP 5.4 and older. The oldest supported PHP 
version in ownCloud is 5.4.

.. note:: RHEL 6 and CentOS 6 ship with PHP 5.3 and must be upgraded to PHP 
   5.4 to run ownCloud. See :doc:`../installation/php_54_installation`.

On Red Hat/CentOS/Fedora systems running PHP 5.4, install ``php-pecl-apc``. On 
Debian/Ubuntu/Mint systems install ``php-apc``. Then restart your Web server. 
 
After restarting your Web server, add this line to your ``config.php`` file::

 'memcache.local' => '\OC\Memcache\APC',
 
Refresh your ownCloud admin page, and the cache warning should disappear.

APCu
----

PHP 5.5 and up includes the Zend OPcache in core, and on most Linux 
distributions it is enabled by default. However, it does 
not bundle a data cache. APCu is a data cache, and it is available in most 
Linux distributions. On Red Hat/CentOS/Fedora systems running PHP 5.5 and up 
install ``php-pecl-apcu``. On Debian/Ubuntu/Mint systems install ``php5-apcu``. 
Then restart your Web server.
 
After restarting your Web server, add this line to your ``config.php`` file::

 'memcache.local' => '\OC\Memcache\APCu',
 
Refresh your ownCloud admin page, and the cache warning should disappear.

.. finish this later. too vexing to bother with now.
.. Enabling PHP opcache
.. ^^^^^^^^^^^^^^^^^^^^
..
.. Use :ref:`label-phpinfo` to see if your PHP opcache is already enabled by 
.. searching for ``opcache.enable``. If it says ``on`` then it is enabled and 
.. you don't need to do anything. Figure 1 is from Linux Mint 17; the Zend 
.. OPcache is enabled by default and ``phpinfo`` displays status and statistics.
..
.. .. figure:: images/cache-1.png
..   :alt: The Zend OPcache section displays opcode cache status and statistics.
..  
..   *Figure 1: Zend OPcache status in phpinfo*
..   
.. If it is not enabled, then go into    

Memcached
---------

Memcached is a reliable oldtimer for shared caching on distributed servers, 
and performs well with ownCloud with one exception: it is not suitable to use 
with :doc:`Transactional File Locking <../configuration_files/files_locking_transactional>` because it does not 
store locks, and data can disappear from the cache at any time (Redis is 
the best for this). 

.. note:: Be sure to install the **memcached** PHP module, and not memcache, as 
   in the following examples. ownCloud supports only the **memcached** PHP 
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
``config.php``, and refresh your ownCloud admin page. This example uses APCu 
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
as a local cache with :doc:`Transactional File Locking 
<../configuration_files/files_locking_transactional>` because it guarantees 
that cached objects are available for as long as they are needed.

The Redis PHP module must be version 2.2.5 or better.

On Debian/Ubuntu/Mint install ``redis-server`` and ``php5-redis``. The installer 
will automatically launch ``redis-server`` and configure it to launch at 
startup.

On Red Hat/CentOS/Fedora install ``redis`` and ``php-pecl-redis``. It will not 
start automatically, so you must use your service manager to start 
``memcached``, and to launch it at boot as a daemon.
 
You can verify that the Redis daemon is running with ``ps ax``::
 
 ps ax | grep redis
 22203 ? Ssl    0:00 /usr/bin/redis-server 127.0.0.1:6379 
 
Restart your Web server, add the appropriate entries to your ``config.php``, and 
refresh your ownCloud admin page. This example ``config.php`` configuration uses 
Redis for the local server cache::

  'memcache.local' => '\OC\Memcache\Redis',
  'redis' => array(
       'host' => 'localhost',
       'port' => 6379,
       'timeout' => 0.0,
        ),

Redis is very configurable; consult `the Redis documentation 
<http://redis.io/documentation>`_ to learn more.

Cache Directory Location
------------------------

The cache directory defaults to ``data/$user/cache`` where ``$user`` is the 
current user. You may use the ``'cache_path'`` directive in ``config.php`` to 
select a different location.
