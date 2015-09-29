==========================
Configuring Memory Caching
==========================

https://owncloud.org/blog/making-owncloud-faster-through-caching/
http://www.simplemachines.org/community/index.php?topic=354914.0

You can significantly improve your ownCloud server performance with memory 
caching, where frequently-requested objects are stored in memory for faster 
retrieval. There are two types of caches to use: PHP opcache, and data caching 
for your Web server. If you do not install a memcache you will see a warning on 
your ownCloud admin page. (A memcache is not required and you may ignore the warning if you prefer.)

A PHP opcache stores compiled PHP scripts so they don't need to be re-compiled 
every time they are called. PHP bundles an opcache since version 5.5, so you 
don't need to install or configure it.

If you are using PHP 5.4, which is the oldest supported PHP version for 
ownCloud, you may install the Alternative PHP Cache (APC). This is both an 
opcache and data cache. APC has not been updated since 2012 and is essentially 
dead, and PHP 5.4 is very old and lags far behind later releases. If it is possible 
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
and configuring your desired cache, and then adding the appropriate entry to 
``config.php``.

You may use both a local and a distributed cache. Recommended caches are APCu 
and Redis.
   
APC
---

APC is only for systems running PHP 5.4 and older. The oldest supported PHP 
version in ownCloud is 5.4.

.. note:: RHEL 6 and CentOS 6 ship with PHP 5.3. See :doc:`php_54_installation`.

This example installs APC on Red Hat/CentOS/Fedora systems running PHP 5.4::

 yum install php-pecl-apc
 
This example install APC on Debian/Ubuntu/Mint systems running PHP 5.4::

 apt-get install php-apc

After installing APC you must restart your Web server. This example restarts 
Apache on Red Hat/CentOS/Fedora systems::

 systemctl restart httpd.service
 
This example restarts Apache on Debian/Ubuntu/Mint systems::

 service apache2 restart
 
After restarting your Web server, add this line to your ``config.php`` file::

 'memcache.local' => '\OC\Memcache\APC',
 
Refresh your ownCloud admin page, and the cache warning should disappear.

APCu
----

PHP 5.5 and up includes an opcache, so you don't need to install or configure 
it. However, it does not bundle a data cache. APCu is a data cache, and it is 
available in most Linux distributions. This example installs APCu on Red 
Hat/CentOS/Fedora systems running PHP 5.5 and up::

 yum install php-pecl-apcu
 
This example install APC on Debian/Ubuntu/Mint systems running PHP 5.5 and up::

 apt-get install php5-apcu

After installing APCu you must restart your Web server. This example restarts 
Apache on Red Hat/CentOS/Fedora systems::

 systemctl restart httpd.service
 
This example restarts Apache on Debian/Ubuntu/Mint systems::

 service apache2 restart
 
After restarting your Web server, add this line to your ``config.php`` file::

 'memcache.local' => '\OC\Memcache\APCu',
 
Refresh your ownCloud admin page, and the cache warning should disappear.

Memcached
---------

Memcached is a reliable oldtimer for shared caching on distributed servers, 
and performs well with ownCloud with one exception: it is not suitable to use 
with :doc:`Transactional File Locking <../configuration_files/files_locking_transactional>` because it does not 
store locks, and data can disappear from the cache at any time (Redis is 
the best for this). 

Setting up Memcached is easy. This example shows how to install it on 
Debian/Ubuntu/Mint::

 apt-get install memcached php5-memcached

This example shows how to install and launch it on Red Hat/CentOS/Fedora::

 yum install memcached php-pecl-memcached
 systemctl enable memcached
 systemctl start memcached
 
You can verify that the Memcached daemon is running with ``ps``::

 ps ax |grep memcached
 19563 ? Sl 0:02 /usr/bin/memcached -m 64 -p 11211 -u memcache -l 
 127.0.0.1

Then add the appropriate entries to your ``config.php``. This example uses APCu 
for the local cache, Memcached as the distributed memcache, and all the 
servers in the shared cache pool with their port numbers::

 'memcache.local' => '\OC\Memcache\Memcached',
 'memcache.distributed' => '\OC\Memcache\Memcached',
 'memcached_servers' => array(
      array('localhost', 11211),
      array('server1.example.com', 11211),
      array('server2.example.com', 11211), 
      ), 

Redis
-----

Redis is an excellent modern memcache to use for both distributed caching, and 
with :doc:`Transactional File Locking <../configuration_files/files_locking_transactional>` because it guarantees 
that cached objects are available for as long as they are needed. 

This example shows how to install it on Debian/Ubuntu/Mint::

 apt-get install redis-server php5-redis

This example shows how to install and launch it on Red Hat/CentOS/Fedora::

 yum install redis php-pecl-redis
 systemctl enable redis
 systemctl start redis
 
You can verify that the redis daemon is running with ``ps``::

 22203 ? Ssl    0:00 /usr/bin/redis-server 127.0.0.1:6379 
 
This example ``config.php`` configuration uses APCu for the local server cache, 
and sets up three distributed servers:: 

 'memcache.local' => '\OC\Memcache\APCu',
 'memcache.distributed' => '\OC\Memcache\Redis',     
 'redis' => array(
	'host' => 'localhost', 
        // optionally, use a Unix socket
        //'host' => '/tmp/redis.sock',
	'port' => 6379,
	'timeout' => 0.0,
         ),      
      
 'memcached_servers' => array(
         array('localhost', 6379),
         array('server.example.com', 6379),
         array('server2.example.com', 6379),
         ),

Redis is very configurable; consult `the Redis documentation <http://redis.io/documentation>`_ to learn more.

Cache Directory Location
------------------------

The cache directory defaults to ``data/$user/cache`` where ``$user`` is the 
current user. You may use the ``'cache_path'`` directive in ``config.php`` to select a different 
location.