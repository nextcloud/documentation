============
Installation
============

Download
--------

You can download the latest version of the Nextcloud Desktop Synchronization Client
from the `Nextcloud download page`_. Clients are available for Linux, macOS, and
Microsoft Windows.

You will also find links to source code archives and older versions on the
download page.

Supported server versions
-------------------------

Each desktop client release supports the latest three stable Nextcloud server
major versions at the time of release. See the `Nextcloud Server release schedule`_
for supported major versions.

System Requirements
-------------------

- Windows 10+ (64-bits only)
- macOS 12.0+ (64-bits only)
- Linux (Ubuntu 24.04 or openSUSE 15.5 or Alma 8 or ...) (64-bits only)

  For Linux distributions, we support, if technically feasible, the current
  LTS releases. For BSD, we support them if technically feasible, but we do not
  test them.

.. note::
   We do not support Citrix.

   - We will do our best to advise Citrix users from the desktop client point of view.
   - We will fix issues that are also reproducible on the standard supported systems.
   - Everything else is outside of our scope.

Install on macOS and Windows
----------------------------

Installation on macOS and Windows is the same as for any other software
application: download the program and then double-click it to launch the
installation, and then follow the installation wizard. After it is installed and
configured the desktop client will automatically keep itself updated; see
:doc:`autoupdate` for more information.

For administrator-focused deployment options such as advanced Windows MSI
configuration, non-interactive account provisioning, and command-line wizard
preconfiguration, see the Admin Manual chapter on desktop client deployment and
setup.

Install on Linux
----------------

For Linux, Nextcloud officially provides the desktop client as an AppImage on
the `Nextcloud download page`_.

Some Linux distributions also provide the Nextcloud desktop client through their
package managers. These packages are maintained by the distribution or community,
not by Nextcloud. If you prefer a package-managed installation, refer to your
distribution's documentation.

Linux users must also have a password manager enabled, such as GNOME Keyring or
KWallet, so that the desktop client can log in automatically.

Initial Setup
-------------

After installation, the initial setup wizard is triggered. In the setup wizard,
you can log in to your server, create an account with a provider, and configure
which folders to sync. The wizard will guide you step-by-step through the
essential configuration options and basic account setup.

You can also choose to only install the client itself by using the following command::

  msiexec /passive /i Nextcloud-x.y.z-x64.msi ADDDEFAULT=Client

If you for instance want to install everything but the ``DesktopShortcut`` and the ``ShellExtensions`` feature, you have two possibilities:

1. You explicitly name all the features you actually want to install (whitelist) where ``Client`` is always installed anyway::

    msiexec /passive /i Nextcloud-x.y.z-x64.msi ADDDEFAULT=StartMenuShortcuts

2. You pass the ``NO_DESKTOP_SHORTCUT`` and ``NO_SHELL_EXTENSIONS`` properties::

    msiexec /passive /i Nextcloud-x.y.z-x64.msi NO_DESKTOP_SHORTCUT="1" NO_SHELL_EXTENSIONS="1"

.. NOTE::
    The Nextcloud ``.msi`` remembers these properties, so you don't need to specify them on upgrades.

.. NOTE::
    You cannot use these to change the installed features, if you want to do that, see the next section.

Changing Installed Features
^^^^^^^^^^^^^^^^^^^^^^^^^^^

You can change the installed features later by using ``REMOVE`` and ``ADDDEFAULT`` properties.

1. If you want to add the desktop shortcut later, run the following command::

    msiexec /passive /i Nextcloud-x.y.z-x64.msi ADDDEFAULT="DesktopShortcut"

2. If you want to remove it, simply run the following command::

    msiexec /passive /i Nextcloud-x.y.z-x64.msi REMOVE="DesktopShortcut"

Windows keeps track of the installed features and using ``REMOVE`` or ``ADDDEFAULT`` will only affect the mentioned features.

Compare `REMOVE <https://msdn.microsoft.com/en-us/library/windows/desktop/aa371194(v=vs.85).aspx>`_
and `ADDDEFAULT <https://msdn.microsoft.com/en-us/library/windows/desktop/aa367518(v=vs.85).aspx>`_
on the Windows Installer Guide.

.. NOTE::
    You cannot specify ``REMOVE`` on initial installation as it will disable all features.

Installation Folder
^^^^^^^^^^^^^^^^^^^

You can adjust the installation folder by specifying the ``INSTALLDIR``
property like this::

  msiexec /passive /i Nextcloud-x.y.z-x64.msi INSTALLDIR="C:\Program Files\Non Standard Nextcloud Client Folder"

Be careful when using PowerShell instead of ``cmd.exe``, it can be tricky to get
the whitespace escaping right there.
Specifying the ``INSTALLDIR`` like this only works on first installation, you cannot simply re-invoke the ``.msi`` with a different path. If you still need to change it, uninstall it first and reinstall it with the new path.

Disabling Automatic Updates
^^^^^^^^^^^^^^^^^^^^^^^^^^^

To disable automatic updates, you can pass the ``SKIPAUTOUPDATE`` property.::

    msiexec /passive /i Nextcloud-x.y.z-x64.msi SKIPAUTOUPDATE="1"

Launch After Installation
^^^^^^^^^^^^^^^^^^^^^^^^^

To launch the client automatically after installation, you can pass the ``LAUNCH`` property.::

    msiexec /i Nextcloud-x.y.z-x64.msi LAUNCH="1"

This option also removes the checkbox to let users decide if they want to launch the client
for non passive/quiet mode.

.. NOTE::
    This option does not have any effect without GUI.

No Reboot After Installation
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The Nextcloud Client schedules a reboot after installation to make sure the Explorer extension is correctly (un)loaded.
If you're taking care of the reboot yourself, you can set the ``REBOOT`` property::

    msiexec /i Nextcloud-x.y.z-x64.msi REBOOT=ReallySuppress

This will make ``msiexec`` exit with error ``ERROR_SUCCESS_REBOOT_REQUIRED`` (3010).
If your deployment tooling interprets this as an actual error and you want to avoid that, you may want to set the ``DO_NOT_SCHEDULE_REBOOT`` instead::

    msiexec /i Nextcloud-x.y.z-x64.msi DO_NOT_SCHEDULE_REBOOT="1"

Installation Wizard
-------------------

The installation wizard takes you step-by-step through configuration options and
account setup. First, you need to enter the URL of your Nextcloud server.

.. image:: images/wizard_welcome.png
   :alt: form for choosing between login and registering

If you already have an account on a Nextcloud instance, click ``Login to your
Nextcloud``. If you do not yet have a Nextcloud instance or an account, you may
need to create one first. Alternatively, you might want to register an account
with a provider. Press ``Create account with Provider`` in that case.

.. note::
   The desktop client build you are using may have been built without provider
   support. In that case, you won't see this page and will immediately see the
   next page.

.. image:: images/wizard_setup.png
   :alt: form for entering Nextcloud server URL

Enter the URL for your Nextcloud instance. The URL is the same URL that
you type into your browser when you try to access your Nextcloud
instance.

.. image:: images/wizard_flow2.png
   :alt: form waiting for authorization

Now your web browser should open and prompt you to log in to your
Nextcloud instance. Enter your username and password in your web
browser and click *Grant access* when prompted. After you do that,
go back to the wizard.

.. note::
   You might not need to enter your username and password if you are
   already logged in to your web browser.

.. image:: images/wizard_advanced.png
   :alt: Select which remote folders to sync, and which local folder to store
    them in.

On the local folder options screen, you may sync all of your files on
the Nextcloud server, or select individual folders. The default local
sync folder is ``Nextcloud``, in your home directory. You may change
this as well.

When you have completed selecting your sync folders, click the *Connect*
button at the bottom right. The client will attempt to connect to your
Nextcloud server. If it is successful, the wizard will close itself. You
can then observe the sync activity and open the main dialog by clicking
on the tray icon.

.. Links

.. _Nextcloud download page: https://nextcloud.com/download/#install-clients

.. _Nextcloud Server release schedule: https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule
