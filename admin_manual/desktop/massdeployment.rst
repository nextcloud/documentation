====================================
Mass Deployment and Account Creation
====================================

The Nextcloud Desktop client supports non-interactive account provisioning from the command line.

This is primarily intended for mass deployment and other managed-installation scenarios where an administrator wants to preconfigure a client account during or immediately after installation.

When the required parameters are provided, the client attempts to create an account and store it in the client's normal configuration so that subsequent launches behave as if the account had been added through the graphical user interface.

If account creation succeeds, the client exits with code ``0``.
If account creation fails, the client exits with code ``1``.

Detailed status and failure information is written to the desktop client logs.

.. note::

   This feature is distinct from the wizard-preconfiguration options
   ``--overrideserverurl`` and ``--overridelocaldir``.

   Those options are intended to prefill or constrain the interactive setup
   wizard, not to directly provision an account for mass deployment.

   For those options, see :doc:`Command-line Account Setup <accountcommand>`.

Required parameters
-------------------

The following parameters are required for non-interactive account creation:

``--userid``
   The user ID to configure in the desktop client.

``--apppassword``
   The app password to use for authentication.

   App passwords should be used instead of a user's regular login password.
   See the server documentation for the login flow and app password generation process.

``--serverurl``
   The base URL of the Nextcloud server to use for the account.

Optional parameters
-------------------

``--localdirpath``
   The local path to use for the sync folder.

   If omitted, the desktop client chooses its normal default sync-folder location for the platform.

   If this option is provided and the target directory already exists and is not empty, account creation fails.

   If this option is provided and the directory does not yet exist, the client attempts to create it.

``--remotedirpath``
   The remote path to sync.

   If omitted, the default is ``/`` (the server root for that account).

   Example: if the server contains folders such as ``/Photos``, ``/Documents``, and ``/Music``, specifying ``/Music`` creates a sync connection for that remote subfolder instead of the entire account root.

``--isvfsenabled``
   Controls whether the created sync connection should use virtual files.

   Use ``1`` to enable virtual files and ``0`` to disable them.

   Virtual file support depends on the client build, operating system, and runtime availability of the required VFS functionality.
   Supplying this option does not guarantee that virtual files are available on every platform or deployment.

Behavior
--------

When started with the required parameters, the desktop client attempts to:

1. validate the provided command-line parameters,
2. create the local sync folder if needed,
3. authenticate to the server using the provided app password,
4. verify server access, and
5. store the resulting account in the client's normal configuration.

On later launches, the configured account is available as a normal desktop-client account.

Common failure cases
--------------------

Account creation can fail for reasons including:

* one or more required parameters are missing or invalid,
* an account for the same user and server already exists,
* the specified local sync folder already exists and is not empty,
* the specified local sync folder could not be created,
* the server URL is incorrect,
* the app password is invalid,
* the authenticated request is redirected unexpectedly,
* the server denies access to the configured account, or
* the server returns an invalid response to the authenticated WebDAV request.

In all of these cases, the client exits with code ``1`` and writes more detailed information to the logs.

Examples
--------

Windows:

.. code-block:: powershell

   "C:\Program Files\Nextcloud\nextcloud.exe" ^
     --userid admin ^
     --apppassword Jliy12356785jxnHa2ZCiZ9MX48ncECwDso95Pq3a5HABjY34ZvhZiXrPfpKWUg7aOHAX5 ^
     --serverurl https://cloud.example.com ^
     --localdirpath "D:\Nextcloud-sync-folder" ^
     --remotedirpath /Music ^
     --isvfsenabled 1

Linux:

.. code-block:: bash

   nextcloud \
     --userid admin \
     --apppassword Jliy12356785jxnHa2ZCiZ9MX48ncECwDso95Pq3a5HABjY34ZvhZiXrPfpKWUg7aOHAX5 \
     --serverurl https://cloud.example.com \
     --localdirpath "/home/admin/Nextcloud-sync-folder" \
     --remotedirpath /Music \
     --isvfsenabled 0

macOS:

.. code-block:: bash

   nextcloud \
     --userid admin \
     --apppassword Jliy12356785jxnHa2ZCiZ9MX48ncECwDso95Pq3a5HABjY34ZvhZiXrPfpKWUg7aOHAX5 \
     --serverurl https://cloud.example.com \
     --localdirpath "/Users/admin/Nextcloud-sync-folder" \
     --remotedirpath /Music \
     --isvfsenabled 1

Recommendations
---------------

For reliable mass deployment:

* use app passwords rather than regular user passwords,
* ensure that the server URL is the correct base URL for the Nextcloud instance,
* use a new or empty local sync directory,
* validate that the target remote path exists and is accessible to the user, and
* verify virtual-file support on the target platform before enabling ``--isvfsenabled``.

Related options
---------------

The desktop client also supports these separate options for interactive setup scenarios:

``--overrideserverurl``
   Stores a server URL override used by the account setup wizard.

``--overridelocaldir``
   Stores a local-directory override used by the account setup wizard.

These options are useful when guiding users through a constrained setup flow, but they should not be confused with direct non-interactive account provisioning.
