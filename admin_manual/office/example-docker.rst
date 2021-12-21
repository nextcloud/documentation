================================
Installation example with Docker
================================

We'll describe how to get Nextcloud Office running on your server and how to integrate it into your Nextcloud using the docker image Nextcloud and Collabora built.


To install it the following dependencies are required:

- A host that can run a Docker container
- A subdomain or a second domain that the Collabora Online server can run on
- An Apache server with some enabled modules
- A valid SSL certificate for the domain that Collabora Online should run on
- A valid SSL certificate for your Nextcloud


1. Install the Collabora Online server
**************************************

The following steps will download the Collabora Online docker, make sure to replace "cloud.nextcloud.com" with the host that your own Nextcloud runs on. Also make sure to escape all dots with double backslashes (\), since this string will be evaluated as a regular expression (and your bash 'eats' the first backslash.) If you want to use the docker container with more than one Nextcloud, you'll need to use 'domain=cloud\\.nextcloud\\.com\|second\\.nextcloud\\.com' instead. (All hosts are separated by \|.)

    docker pull collabora/code
    docker run -t -d -p 127.0.0.1:9980:9980 \
        -e 'domain=cloud\\.example\\.com' \
        --restart always \
        --cap-add MKNOD \
        collabora/code

That will be enough. Once you have done that the server will listen on "localhost:9980". Now we just need to configure the locally installed Apache reverse proxy.

2. Install the Apache reverse proxy
***********************************

On a recent Ubuntu or Debian this should be possible using:

.. code-block:: bash

    apt-get install apache2
    a2enmod proxy proxy_wstunnel proxy_http ssl

Afterward, configure one VirtualHost properly to proxy the traffic. For security reason we recommend to use a subdomain such as office.example.com instead of running on the same domain. An example config can be found below:

.. code-block:: apache2

    <VirtualHost *:443>
        ServerName office.example.com:443

        # SSL configuration, you may want to take the easy route instead and use Lets Encrypt!
        SSLEngine on
        SSLCertificateFile /path/to/signed_certificate
        SSLCertificateChainFile /path/to/intermediate_certificate
        SSLCertificateKeyFile /path/to/private/key
        SSLProtocol             all -SSLv2 -SSLv3
        SSLCipherSuite ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:!DSS
        SSLHonorCipherOrder     on

        # Encoded slashes need to be allowed
        AllowEncodedSlashes NoDecode

        # Container uses a unique non-signed certificate
        SSLProxyEngine On
        SSLProxyVerify None
        SSLProxyCheckPeerCN Off
        SSLProxyCheckPeerName Off

        # keep the host
        ProxyPreserveHost On

        # static html, js, images, etc. served from loolwsd
        # loleaflet is the client part of LibreOffice Online
        ProxyPass           /loleaflet https://127.0.0.1:9980/loleaflet retry=0
        ProxyPassReverse    /loleaflet https://127.0.0.1:9980/loleaflet

        # WOPI discovery URL
        ProxyPass           /hosting/discovery https://127.0.0.1:9980/hosting/discovery retry=0
        ProxyPassReverse    /hosting/discovery https://127.0.0.1:9980/hosting/discovery

        # Main websocket
        ProxyPassMatch "/lool/(.*)/ws$" wss://127.0.0.1:9980/lool/$1/ws nocanon

        # Admin Console websocket
        ProxyPass   /lool/adminws wss://127.0.0.1:9980/lool/adminws

        # Download as, Fullscreen presentation and Image upload operations
        ProxyPass           /lool https://127.0.0.1:9980/lool
        ProxyPassReverse    /lool https://127.0.0.1:9980/lool

        # Endpoint with information about availability of various features
        ProxyPass           /hosting/capabilities https://127.0.0.1:9980/hosting/capabilities retry=0
        ProxyPassReverse    /hosting/capabilities https://127.0.0.1:9980/hosting/capabilities
    </VirtualHost>
			
After configuring these do restart your apache using /etc/init.d/apache2 restart.    

3. Configure the app in Nextcloud
*********************************

Go to the Apps section and choose "Office & text"
Install the "Collabora Online app"
Admin -> Office -> Specify the server you have setup before (e.g. "https://office.example.com")
Congratulations, your Nextcloud has Collabora Online Office integrated!


Updating
********

Occasionally, new versions of this docker image are released with security and feature updates. We will of course let you know when that happens! This is how you upgrade to a new version:

grab new docker image:
    docker pull collabora/code
List docker images:
    docker ps 
from the output you can glean the Container ID of your Collabora Online docker image.
stop and remove the Collabora Online docker image:
    docker stop CONTAINER_ID 
    docker rm CONTAINER_ID
start the new image:
    docker run -t -d -p 127.0.0.1:9980:9980 -e 'domain=cloud\\.nextcloud\\.com' --restart always --cap-add MKNOD collabora/code
