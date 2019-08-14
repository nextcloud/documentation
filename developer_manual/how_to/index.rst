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

Collabora without SSL
-----

1) start Collabora
    - docker run -p 127.0.0.1:9980:9980 -e 'domain=172.17.0.1' -e 'username=admin' -e 'password=487903ffcf4' -e extra_params='--o:ssl.enable=false' --restart always --cap-add MKNOD collabora/code
    - 172.17.0.1 is localhost, which is default by Docker
    - get IP of Collabora container: docker inspect --format='{{ .NetworkSettings.IPAddress }}' $containerName

2) configure Nextcloud
    - go to your local cloud (e.g. 172.17.0.1/nc) -> Settings -> Collabora
        - set URL to IP you found out above, e.g: http://172.17.0.2:9980
        - check "Disable certificate verification (insecure)

3) use
    - please note that you cannot use it with localhost, but you have to enter a valid IP address of localhost
    - with this approach you can also use it with mobile clients
4) troubleshoot
    - http://172.17.0.2:9980/hosting/capabilities should give you:
    {"convert-to":{"available":false},"hasMobileSupport":true,"hasTemplateSaveAs":true,"productName":"Collabora Online Development Edition"}