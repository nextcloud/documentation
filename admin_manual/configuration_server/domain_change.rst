=====================
Domain Change
=====================

Changing the domain after the first setup is quite easy. 

First, you should have the new domain ready, including DNS, a valid SSL-certificate and the apropriate virtual host entry in the webserver of your choice (apache2, nginx, etc).

Next, simply edit the main config file under (nextcloud-root)/config/config.php and add the new domain as well as the ipv4-adress (and the ipv6-address if you support ipv6) to the trusted_domains array as follows:

.. code-block::
   :caption: config.php

   'trusted_domains' => 
        array (
        0 => 'localhost',
        # Change these entries
        1 => 'example.com',
        2 => '1.2.3.4',
      ),

Your nextcloud instance should now be fully accessible under the new domain.
