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

OnlyOffice
------

1) Create self signed cert, should be on a permanent path::

    mkdir -p /tmp/oo/certs
    cd /tmp/oo/certs
    openssl genrsa -out onlyoffice.key 4096
    openssl req -new -key onlyoffice.key -out onlyoffice.csr
    openssl x509 -req -days 3650 -in onlyoffice.csr -signkey onlyoffice.key -out onlyoffice.crt
    openssl dhparam -out dhparam.pem 4096
    chmod 400 onlyoffice.key
    chmod 400 onlyoffice.crt
    chmod 400 onlyoffice.csr
    chmod 400 dhparam.pem

2) Start docker, important: do not use certs folder, but parent folder:
docker run --name=ONLYOFFICEDOCKER -i -t -d -p 4433:443 -e JWT_ENABLED='true' -e JWT_SECRET='secret' --restart=always -v /tmp/oo/:/var/www/onlyoffice/Data onlyoffice/documentserver

3) go into docker:
- docker exec -it /bin/bash ONLYOFFICEDOCKER
- apt-get update
- apt-get install vim -y
- vim ./etc/onlyoffice/documentserver/default.json
    - change rejectUnauthorized to false
- vim /etc/onlyoffice/documentserver/local.json
    - change token -> inbox -> header to "AuthorizationJWT"
    - change token -> outbox -> header to "AuthorizationJWT"
- edit config.php of NC server:
    - add::

    'onlyoffice' =>
    array (
            'verify_peer_off' => true,
            'jwt_secret' => 'secret',
            'jwt_header' => 'AuthorizationJWT'
    ),

- test with local ip: https://localhost:4433
    - accept cert warning
    - verify that "Document Server is running" is shown

- on Nextcloud
    - download & enable OnlyOffice app
    -  configure:
        - Document Editing Service address: https://localhost:4433/
        - Secret key : secret (as above)
        - Document Editing Service address for internal requests from the server: https://localhost:4433/
        - Server address for internal requests from the Document Editing Service: http://192.168.1.95/nc16/ (needs to be real IP address, as localhost points to docker)
