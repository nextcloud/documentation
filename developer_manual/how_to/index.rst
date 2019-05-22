===============
How to test ...
===============

This page should explain how to test given features in Nextcloud.

Redis
-----

First you need to install the `phpredis extension<https://github.com/phpredis/phpredis>`. There is a install document available `inside the repo<https://github.com/phpredis/phpredis/blob/develop/INSTALL.markdown>` and many linux distribtutions ship it in their repositories as well.

..code:
   

   pecl install redis

Cluster
~~~~~~~

For a local Redis cluster setup there are some docker script collected in `this repository<https://github.com/Grokzen/docker-redis-cluster>`. It boils down to clone the repo and run `make up`. Then the redis cluster is available at ``localhost:7000``.

Following ``config.php`` can be used::

   'memcache.distributed' => '\OC\Memcache\Redis',
   'redis.cluster' => [
      'seeds' => [ // provide some/all of the cluster servers to bootstrap discovery, port required
         'localhost:7000',
      ],
      'timeout' => 0.0,
      'read_timeout' => 0.0,
      'failover_mode' => \RedisCluster::FAILOVER_ERROR,
   ],


