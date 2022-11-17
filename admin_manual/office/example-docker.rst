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


Install the Collabora Online server
**************************************

The following steps will download the Collabora Online docker. Make sure to replace "cloud.example.com" with the host that your own Nextcloud runs on. Also make sure to escape all dots with double backslashes (`\\`), since this string will be evaluated as a regular expression (and your bash 'eats' the first backslash.) If you want to use the docker container with more than one Nextcloud, you'll need to use `domain=cloud\\.nextcloud\\.com\|second\\.nextcloud\\.com` instead. (All hosts are separated by `\|`.)

.. code-block:: bash

    docker pull collabora/code
    docker run -t -d -p 127.0.0.1:9980:9980 \
        -e 'domain=cloud\\.example\\.com' \
        --restart always \
        --cap-add MKNOD \
        collabora/code

That will be enough. Once you have done that the server will listen on "localhost:9980". Now we just need to configure the locally installed Apache reverse proxy.

Install the Apache reverse proxy
***********************************

On a recent Ubuntu or Debian this should be possible using:

.. code-block:: bash

    apt-get install apache2
    a2enmod proxy proxy_wstunnel proxy_http ssl

Afterward, configure one VirtualHost properly to proxy the traffic. For security reason we recommend to use a subdomain such as office.example.com instead of running on the same domain. An example config can be found below::

    ########################################
    # Reverse proxy for Collabora Online
    ########################################

    AllowEncodedSlashes NoDecode
    SSLProxyEngine On
    ProxyPreserveHost On

    # cert is issued for collaboraonline.example.com and we proxy to localhost
    SSLProxyVerify None
    SSLProxyCheckPeerCN Off
    SSLProxyCheckPeerName Off

    # static html, js, images, etc. served from coolwsd
    # browser is the client part of Collabora Online
    ProxyPass           /browser https://127.0.0.1:9980/browser retry=0
    ProxyPassReverse    /browser https://127.0.0.1:9980/browser

    # WOPI discovery URL
    ProxyPass           /hosting/discovery https://127.0.0.1:9980/hosting/discovery retry=0
    ProxyPassReverse    /hosting/discovery https://127.0.0.1:9980/hosting/discovery

    # Capabilities
    ProxyPass           /hosting/capabilities https://127.0.0.1:9980/hosting/capabilities retry=0
    ProxyPassReverse    /hosting/capabilities https://127.0.0.1:9980/hosting/capabilities

    # Main websocket
    ProxyPassMatch      "/cool/(.*)/ws$"      wss://127.0.0.1:9980/cool/$1/ws nocanon

    # Admin Console websocket
    ProxyPass           /cool/adminws wss://127.0.0.1:9980/cool/adminws

    # Download as, Fullscreen presentation and Image upload operations
    ProxyPass           /cool https://127.0.0.1:9980/cool
    ProxyPassReverse    /cool https://127.0.0.1:9980/cool
    # Compatibility with integrations that use the /lool/convert-to endpoint
    ProxyPass           /lool https://127.0.0.1:9980/cool
    ProxyPassReverse    /lool https://127.0.0.1:9980/cool


After configuring these do restart your apache using ``systemctl restart apache2``.

.. seealso::
  Full configuration examples for reverse proxy setup can be found in the Collabora Online documentation:
  https://sdk.collaboraonline.com/docs/installation/Proxy_settings.html


Configure the app in Nextcloud
*********************************

Go to the Apps section and choose "Office & text"
Install the "Collabora Online app"
Admin -> Office -> Specify the server you have setup before (e.g. "https://office.example.com")
Congratulations, your Nextcloud has Collabora Online Office integrated!


Updating
********

Occasionally, new versions of this docker image are released with security and feature updates. We will of course let you know when that happens! This is how you upgrade to a new version:

Update the docker image:
    .. code-block:: bash

        docker pull collabora/code

List running docker containers:
    .. code-block:: bash

        docker ps

Stop and remove the Collabora Online container with the container id of the running one:
    .. code-block:: bash

        docker stop CONTAINER_ID
        docker rm CONTAINER_ID

Start the new container:
    .. code-block:: bash

        docker run -t -d -p 127.0.0.1:9980:9980 -e 'domain=cloud\\.example\\.com' \
            --restart always --cap-add MKNOD collabora/code

