====================================
Installation example on Ubuntu 20.04
====================================

Import signing keys:
********************

.. code-block:: bash

    cd /usr/share/keyrings && sudo wget https://collaboraoffice.com/downloads/gpg/collaboraonline-release-keyring.gpg

Add repository:
***************

.. code-block:: bash

    sudo echo "deb https://www.collaboraoffice.com/repos/CollaboraOnline/CODE-ubuntu2004 ./" > /etc/apt/sources.list.d/collaboraonline.sources

Install packages
****************

.. code-block:: bash

    sudo apt update && sudo apt install coolwsd code-brand

Configuration
*************

Edit /etc/coolwsd/coolwsd.xml. Collabora Online (coolwsd) service runs via systemd. After editing the configuration file, you have to restart the service:

.. code-block:: bash

    sudo systemctl restart coolwsd

The default configuration is looking for an SSL certificate and key, which are not present, so probably it’s the best to disable SSL, and optionally enable SSL termination, then set up the reverse proxy.

.. seealso::
  Full configuration examples for reverse proxy setup can be found in the Collabora Online documentation:
  https://sdk.collaboraonline.com/docs/installation/Proxy_settings.html


.. code-block:: bash

    sudo coolconfig set ssl.enable false
    sudo coolconfig set ssl.termination true
    sudo coolconfig set storage.wopi.host nextcloud.example.com
    sudo coolconfig set-admin-password
    sudo systemctl restart coolwsd
    systemctl status coolwsd

