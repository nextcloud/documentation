============================
Nginx Example Configurations
============================

This page covers example Nginx configurations to use with running an Nextcloud 
server. This page is community-maintained. (Thank you, contributors!)


-  You need to insert the following code into **your Nginx configuration file.**
-  The configuration assumes that Nextcloud is installed in 
   ``/var/www/nextcloud`` and that it is accessed via 
   ``http(s)://cloud.example.com``.
-  Adjust **server_name**, **root**, **ssl_certificate** and 
   **ssl_certificate_key** to suit your needs.
-  Make sure your SSL certificates are readable by the server (see `nginx HTTP 
   SSL Module documentation <http://wiki.nginx.org/HttpSslModule>`_).
-  ``add_header`` statements are only taken from the current level and are not 
   cascaded from or to a different level. All necessary ``add_header`` 
   statements must be defined in each level needed. For better readability it 
   is possible to move *common* add header statements into a separate file 
   and include that file wherever necessary. However, each ``add_header`` 
   statement must be written in a single line to prevent connection problems 
   with sync clients.

Example Configurations
----------------------

- :doc:`nginx`

You can use Nextcloud over plain http, but we strongly encourage you to use 
SSL/TLS to encrypt all of your server traffic, and to protect user's logins and 
data in transit.

-  Remove the server block containing the redirect
-  Change **listen 443 ssl** to **listen 80;**
-  Remove **ssl_certificate** and **ssl_certificate_key**.
-  Remove **fastcgi_params HTTPS on;**

Suppressing Log Messages
========================

If you're seeing meaningless messages in your logfile, for example `client 
denied by server configuration: /var/www/data/htaccesstest.txt 
<https://forum.owncloud.org/viewtopic.php?f=17&t=20217>`_, add this section to 
your nginx configuration to suppress them:

.. code-block:: nginx

        location = /data/htaccesstest.txt {
          allow all;
          log_not_found off;
          access_log off;
        }

JavaScript (.js) or CSS (.css) files not served properly
========================================================

A common issue with custom nginx configs is that JavaScript (.js)
or CSS (.css) files are not served properly leading to a 404 (File not found)
error on those files and a broken webinterface.

This could be caused by the:

.. code-block:: nginx

        location ~* \.(?:css|js)$ {

block shown above not located **below** the:

.. code-block:: nginx

        location ~ \.php(?:$|/) {

block. Other custom configurations like caching JavaScript (.js)
or CSS (.css) files via gzip could also cause such issues.
