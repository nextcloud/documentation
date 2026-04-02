===============
How to test ...
===============

This page should explain how to test given features in Nextcloud.

Email sending
-------------

::

    docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
    occ config:system:set mail_smtpmode --value=smtp
    occ config:system:set mail_smtphost --value=127.0.0.1
    occ config:system:set mail_smtpport --value=1025 --type=integer

Then after having Nextcloud send some emails, open http://127.0.0.1:8025 to view them.

Redis
-----

First you need to install the `phpredis extension <https://github.com/phpredis/phpredis>`_ . There is a install document available `inside the repo <https://github.com/phpredis/phpredis/blob/develop/INSTALL.markdown>`_ and many linux distribtutions ship it in their repositories as well.


   pecl install redis

Redis Cluster
-------------

For a local Redis cluster setup there are some docker script collected in `this repository <https://github.com/Grokzen/docker-redis-cluster>`_. It boils down to clone the repo and run `make up`. Then the redis cluster is available at ``localhost:7000``.

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

Primary object store with S3
----------------------------

::

    docker run -p 9000:9000 minio/minio server /data

The edit ``config.php`` and add the following section::

    'objectstore' =>
        array (
            'class' => 'OC\\Files\\ObjectStore\\S3',
            'arguments' =>
            array (
                'bucket' => 'nextcloud-dev',
                'key' => 'minioadmin',
                'secret' => 'minioadmin',
                'hostname' => 'localhost',
                'port' => '9000',
                'use_ssl' => false,
                'use_path_style' => true,
            ),
        ),

S3 external storage
-------------------

::

    occ app:enable files_external

    docker run -p 9000:9000 minio/minio server /data

Then add an external storage in the web UI using the following configuration:

- Authentication type: Access key
- Access key: minioadmin
- Secret key: minioadmin
- Bucket: nextcloud-dev
- Hostname: localhost
- Port: 9000
- Region: leave empty
- Storage class: leave empty
- Enable SSL: false
- Enable path style: yes

SMB external storage
--------------------

SMB external storage can be tested with Docker. The following commands create an SMB server with a public (shared) directory and user home directories for the credentials ``smb1:pwd1`` and ``smb2:pwd2``.

::

    occ app:enable files_external

    mkdir -p /tmp/samba/{public,home/{smb1,smb2}}
    chmod a+rw /tmp/samba/home/smb*
    docker run -it -p 139:139 -p 445:445 \
        -v /tmp/samba/public:/smbpublic \
        -v /tmp/samba/home:/smbhome \
        dperson/samba \
        -u "smb1;pwd1" \
        -u "smb2;pwd2" \
        -s "public;/smbmount;yes;no;yes" \
        -s "home;/smbhome/%U;yes;no;no;all;none"

Make sure that smbclient is installed on your Nextcloud server and has the following configuration:

::

    # /etc/samba/smb.conf
    [global]
    client min protocol = SMB2
    client max protocol = SMB3
    hide dot files = no

The setup can be verified with

::

    smbclient //127.0.0.1/public -U smb1                 # Shared storage for all users
    smbclient //127.0.0.1/home -U smb1 --password=pwd1   # Home storage

SAML setup with onelogin
------------------------

- create dev account on onelogin.com

- log into onelogin.com

- create new app: SAML Test Connector (Advanced)

    - go to "Configuration"

        - Audience: https://localhost/apps/user_saml/saml/metadata
        - Recipient: https://localhost/apps/user_saml/saml/acs
        - ACS (Consumer) URL Validator: https://localhost/apps/user_saml/saml/acs
    
    - go to "Parameters"
    
        - Add "User.email" -> email (and add to assertion)
        - Add "User.FirstName" -> first name (and add to assertion)
        - Add "User.LastName" -> last name (and add to assertion)

- open Nextcloud SAML settings

    - Select SAML
    - Configure it according to https://portal.nextcloud.com/article/configuring-single-sign-on-10.html


Collabora without SSL
---------------------

**1) Start Collabora in a docker container**

::

    docker run -p 127.0.0.1:9980:9980 -e 'domain=172.17.0.1' \
        -e 'username=admin' -e 'password=487903ffcf4' \
        -e extra_params='--o:ssl.enable=false' \
        --restart always --cap-add MKNOD collabora/code

- 172.17.0.1 is localhost, which is default by Docker
- get IP of Collabora container: docker inspect --format='{{ .NetworkSettings.IPAddress }}' $containerName

**2) Configure Nextcloud**
    - go to your local cloud (e.g. 172.17.0.1/nc) -> Settings -> Collabora
        - set URL to IP you found out above, e.g: http://172.17.0.2:9980
        - check "Disable certificate verification (insecure)

**3) Use**
    - please note that you cannot use it with localhost, but you have to enter a valid IP address of localhost
    - with this approach you can also use it with mobile clients
**4) Troubleshoot**
    - http://172.17.0.2:9980/hosting/capabilities should give you:

::

    {"convert-to":{"available":false},"hasMobileSupport":true,"hasTemplateSaveAs":true,"productName":"Collabora Online Development Edition"}

OnlyOffice
----------

1. Create self signed cert, should be on a permanent path::

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

2. Start docker, important: do not use certs folder, but parent folder::

    docker run --name=ONLYOFFICEDOCKER -i -t -d -p 4433:443 \
    -e JWT_ENABLED='true' -e JWT_SECRET='secret' --restart=always \
    -v /tmp/oo/:/var/www/onlyoffice/Data onlyoffice/documentserver

3. Go into docker container:

    - docker exec -it ONLYOFFICEDOCKER /bin/bash
    - apt-get update
    - apt-get install vim -y
    - vim /etc/onlyoffice/documentserver/default.json
        - change rejectUnauthorized to false
    - vim /etc/onlyoffice/documentserver/local.json
        - change token -> inbox -> header to "AuthorizationJWT"
        - change token -> outbox -> header to "AuthorizationJWT"
    - Add the following to your config.php

    ::

        'onlyoffice' => array (
            'verify_peer_off' => true,
            'jwt_secret' => 'secret',
            'jwt_header' => 'AuthorizationJWT'
        ),

Test with local ip: https://localhost:4433
    - accept cert warning
    - verify that "Document Server is running" is shown

Test with Nextcloud
    - download & enable OnlyOffice app
    - configure:
        - Document Editing Service address: https://localhost:4433/
        - Secret key : secret (as above)
        - Document Editing Service address for internal requests from the server: https://localhost:4433/
        - Server address for internal requests from the Document Editing Service: http://192.168.1.95/nc16/ (needs to be real IP address, as localhost points to docker)

WebAuthn without SSL
--------------------

`Chrome has the option to test WebAuthn with a fake device <https://developer.chrome.com/docs/devtools/webauthn/>`__. Browsers support WebAuthn on HTTPS protected sites and localhost domains. Unfortunately this is not supported by the used PHP library where the check for HTTPS needs to be commented for testing on non-HTTPS localhost development environments.

::

    diff --git a/3rdparty/web-auth/webauthn-lib/src/AuthenticatorAssertionResponseValidator.php b/3rdparty/web-auth/webauthn-lib/src/AuthenticatorAssertionResponseValidator.php
    index 8400ba9c..49279cc7 100644
    --- a/3rdparty/web-auth/webauthn-lib/src/AuthenticatorAssertionResponseValidator.php
    +++ b/3rdparty/web-auth/webauthn-lib/src/AuthenticatorAssertionResponseValidator.php
    @@ -152,7 +152,7 @@ class AuthenticatorAssertionResponseValidator
                 Assertion::isArray($parsedRelyingPartyId, 'Invalid origin');
                 if (!in_array($facetId, $securedRelyingPartyId, true)) {
                     $scheme = $parsedRelyingPartyId['scheme'] ?? '';
    -                Assertion::eq('https', $scheme, 'Invalid scheme. HTTPS required.');
    +                #Assertion::eq('https', $scheme, 'Invalid scheme. HTTPS required.');
                 }
                 $clientDataRpId = $parsedRelyingPartyId['host'] ?? '';
                 Assertion::notEmpty($clientDataRpId, 'Invalid origin rpId.');
    diff --git a/3rdparty/web-auth/webauthn-lib/src/AuthenticatorAttestationResponseValidator.php b/3rdparty/web-auth/webauthn-lib/src/AuthenticatorAttestationResponseValidator.php
    index f3e5a15d..3927bf23 100644
    --- a/3rdparty/web-auth/webauthn-lib/src/AuthenticatorAttestationResponseValidator.php
    +++ b/3rdparty/web-auth/webauthn-lib/src/AuthenticatorAttestationResponseValidator.php
    @@ -150,7 +150,7 @@ class AuthenticatorAttestationResponseValidator
     
                 if (!in_array($facetId, $securedRelyingPartyId, true)) {
                     $scheme = $parsedRelyingPartyId['scheme'] ?? '';
    -                Assertion::eq('https', $scheme, 'Invalid scheme. HTTPS required.');
    +                #Assertion::eq('https', $scheme, 'Invalid scheme. HTTPS required.');
                 }
     
                 /* @see 7.1.6 */

