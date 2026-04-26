==============
Uninstallation
==============

It is safe to uninstall the files desktop client by using the built-in tools within your operating system.

General instructions
--------------------
In each operating system:

1. Make sure to *quit the desktop client* before removing it.

2. *Uninstall* the desktop client.

3. You may also need to take into consideration that uninstalling the desktop client will not remove the :doc:`user's
   configuration <configfile>` file and synced data.
    
    For data removal (sync folders), consider using the server feature `remote wipe <https://nextcloud.com/de/blog/nextcloud-desktop-client-2-6-1-brings-remote-wipe-dark-mode-support-to-mac-os-x-and-more/>`_. This feature is available across all clients.

Below are platform specific instructions.

Windows
^^^^^^^
There are two ways of removing the desktop client:

1. Using `Add or Remove Programs`.

2. You can use the `msiexec <https://learn.microsoft.com/en-us/windows/win32/msi/standard-installer-command-line-options>`_ command line options:

.. code-block:: shell

   msiexec /uninstall Nextcloud-x.y.z-x64.msi /quiet``

3. The :doc:`user's configuration <configfile>` is located at ``%APPDATA%\Nextcloud\nextcloud.cfg``.

macOS
^^^^^
Beyond deleting the desktop client from the *Applications* folder, you may also need to remove all related data,
specially if you are using virtual files.

1. To simply uninstall the software: you can do this from the `Launchpad or the Finder <https://support.apple.com/en-us/102610>`_.

2. For the complete removal of all related data, the following commands can be used:

.. code-block:: bash

   rm -rf "$HOME/Library/Application Scripts/com.nextcloud.desktopclient"*  
   rm -f  "$HOME/Library/Application Support/CrashReporter/Nextcloud_"*  
   rm -rf "$HOME/Library/Application Support/Nextcloud"  
   rm -rf "$HOME/Library/Caches/Nextcloud"  
   rm -rf "$HOME/Library/Containers/com.nextcloud.desktopclient"*  
   rm -rf "$HOME/Library/Group Containers/NKUJUXUJ3B.com.nextcloud.desktopclient"  
   rm -rf "$HOME/Library/Group Containers/com.nextcloud.desktopclient"  
   rm -f  "$HOME/Library/LaunchAgents/com.nextcloud.desktopclient.plist"  
   rm -rf "$HOME/Library/Preferences/Nextcloud"  
   rm -f  "$HOME/Library/Preferences/com.nextcloud.desktopclient.plist"

3. From version 33.0.0 the :doc:`user's configuration <configfile>` is located at
   ``$HOME/Library/Containers/com.nextcloud.desktopclient/Data/Library/Preferences/Nextcloud/nextcloud.cfg``.
   On older versions it is located at ``$HOME/Library/Preferences/Nextcloud/nextcloud.cfg``.

Linux
^^^^^
It depends on how you installed the desktop client:

1. If you are running the Nextcloud AppImage, you can simply delete the AppImage file.

2. If you have used your package manager to install the desktop client, you can use it to uninstall the desktop client
   as well. For example, on Ubuntu you can use the following command:

.. code-block:: bash

   sudo apt remove nextcloud-desktop

3. The :doc:`user's configuration <configfile>` is located at *$HOME/.config/Nextcloud/nextcloud.cfg*.

