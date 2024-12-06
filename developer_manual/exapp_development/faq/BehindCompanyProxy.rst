Corporate Proxy - Permanent Settings for PHP CLI
================================================

If you're using our application within a corporate network that requires proxy settings, you might encounter issues when running PHP CLI commands that attempt to access the Internet.

To resolve this, you need to configure permanent proxy settings for the PHP CLI environment.

Symptoms
--------

When running the command:

.. code-block:: bash

   php occ app_api:app:register test-deploy docker_socket_proxy --info-xml https://raw.githubusercontent.com/nextcloud/test-deploy/main/appinfo/info.xml --test-deploy-mode --no-ansi --no-warnings

You may receive an error similar to:

.. code-block:: text

   file_get_contents(https://raw.githubusercontent.com/nextcloud/test-deploy/main/appinfo/info.xml): Failed to open stream: Connection timed out at /var/www/html/custom_apps/app_api/lib/Service/ExAppService.php#277

Cause
-----

This issue occurs because the PHP CLI environment does not have the proxy settings configured, unlike the web PHP environment which may already be using proxy settings specified in your web server configuration.

Permanent Solution
------------------

To permanently configure proxy settings for PHP CLI, you can either modify the PHP CLI ``php.ini`` file or set environment variables system-wide.

Method 1: Edit PHP CLI php.ini File
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

1. **Locate the PHP CLI php.ini File**

   Run the following command to find the loaded configuration file for PHP CLI:

   .. code-block:: bash

      php --ini

   Look for the line:

   .. code-block:: text

      Loaded Configuration File: /path/to/php.ini

2. **Edit the php.ini File**

   Open the ``php.ini`` file in a text editor with the appropriate permissions:

   .. code-block:: bash

      sudo nano /path/to/php.ini

3. **Add Proxy Settings**

   Add the following lines to configure the proxy settings:

   .. code-block:: ini

      [HTTP]
      ; Proxy settings for HTTP
      http.proxy_host = "proxy.example.com"
      http.proxy_port = 8080
      http.proxy_user = "username"
      http.proxy_password = "password"

      [HTTPS]
      ; Proxy settings for HTTPS
      https.proxy_host = "proxy.example.com"
      https.proxy_port = 8080
      https.proxy_user = "username"
      https.proxy_password = "password"

   Replace the placeholders with your actual proxy server details:

   - `proxy.example.com`: Your proxy server address.
   - `8080`: Your proxy server port.
   - `username`: Your proxy username (if required).
   - `password`: Your proxy password (if required).

4. **Save and Close the File**

   Save the changes and exit the text editor.

5. **Verify the Configuration**

   Run the PHP CLI command again:

   .. code-block:: bash

      php occ app_api:app:register

   It should now be able to access the Internet through the proxy.

.. note::
   Not all PHP functions respect the proxy settings in ``php.ini``.
   If issues persist, consider using system-wide environment variables.

Method 2: Set System-Wide Environment Variables
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

1. **Edit Shell Profile**

   For a permanent solution, add the proxy settings to the system-wide environment variables. Open the ``/etc/environment`` file:

   .. code-block:: bash

	  sudo nano /etc/environment

2. **Add Proxy Environment Variables**

   Add the following lines to the file:

   .. code-block:: bash

	  http_proxy="http://proxy.example.com:8080"
	  https_proxy="http://proxy.example.com:8080"

	  # If your proxy requires authentication:
	  http_proxy="http://username:password@proxy.example.com:8080"
	  https_proxy="http://username:password@proxy.example.com:8080"

   Replace the placeholders with your actual proxy details.

3. **Apply the Changes**

   Log out and log back in, or reboot the system to apply the changes.

4. **Verify the Configuration**

   Run the command again:

   .. code-block:: bash

	  php occ app_api:app:register test-deploy docker_socket_proxy --info-xml https://raw.githubusercontent.com/nextcloud/test-deploy/main/appinfo/info.xml --test-deploy-mode --no-ansi --no-warnings

   It should now work without connectivity issues.

.. note::
   This method sets the proxy settings for all users and applications on the system.

Troubleshooting
---------------

- **Incorrect Proxy Details**

  Ensure all proxy details are correct. Incorrect hostnames, ports, or credentials will prevent connectivity.

- **Environment Variables Not Loaded**

  Make sure the environment variables are correctly loaded. A system reboot or re-login may be necessary.

- **Firewall Restrictions**

  Verify with your network administrator that your system is allowed to access the Internet through the proxy.

Contact Support
---------------

If you've followed these steps and still experience issues, please contact our support team for further assistance.
