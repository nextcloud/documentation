========================
Nextcloud Office Desktop
========================

Nextcloud Office Desktop lets you edit documents, spreadsheets, and presentations offline on your computer.
The download links below always point to the latest stable release. Older versions are available from
https://download.nextcloud.com/office/desktopeditors/.

Windows and macOS
-----------------

.. list-table::
    :header-rows: 1

    * - Platform
      - Architecture
      - Download
    * - Windows
      - x64
      - `Installer (.exe) <nco-windows-x64.exe_>`__
    * - Windows
      - ARM64
      - `Installer (.exe) <nco-windows-arm64.exe_>`__
    * - macOS
      - Apple Silicon
      - `Disk image (.dmg) <nco-macos-arm64.dmg_>`__

Linux
-----

Install from the Nextcloud Office package repository, so that updates arrive with regular system updates.

Debian and Ubuntu
^^^^^^^^^^^^^^^^^

.. include:: ../_shared_assets/_nextcloud_office_apt_repository.rst

.. code-block:: bash

    sudo apt-get install nextcloud-office-nextcloudoffice

The installation also offers the Microsoft core fonts, which improve how documents created in Microsoft Office are
displayed. To install them, accept their license when prompted.

Fedora and RHEL
^^^^^^^^^^^^^^^

.. code-block:: bash

    sudo tee /etc/yum.repos.d/nextcloud-office.repo <<'EOF'
    [nextcloud-office]
    name=Nextcloud Office
    baseurl=https://download.nextcloud.com/office/repo/rpm/stable/$basearch
    enabled=1
    gpgcheck=1
    repo_gpgcheck=1
    gpgkey=https://download.nextcloud.com/office/repo/nextcloud-office.asc
    EOF
    sudo dnf install nextcloud-office-nextcloudoffice

During the first installation, ``dnf`` asks you to confirm the repository signing key. Check that its fingerprint is
``C013 F0BE F968 00BB BC4D 93DD E6E7 0E5F A287 C3D0`` before you accept it.

Portable archive
^^^^^^^^^^^^^^^^

On other distributions, use the portable archive. It is not updated automatically.

.. list-table::
    :header-rows: 1

    * - Architecture
      - Download
    * - x64
      - `.tar.xz <nco-linux-x64.tar.xz_>`__
    * - ARM64
      - `.tar.xz <nco-linux-arm64.tar.xz_>`__

.. _nco-windows-x64.exe:
    https://download.nextcloud.com/office/desktopeditors/Nextcloud-Office-DesktopEditors-latest-windows-x64.exe
.. _nco-windows-arm64.exe:
    https://download.nextcloud.com/office/desktopeditors/Nextcloud-Office-DesktopEditors-latest-windows-arm64.exe
.. _nco-macos-arm64.dmg:
    https://download.nextcloud.com/office/desktopeditors/Nextcloud-Office-DesktopEditors-latest-macos-arm64.dmg
.. _nco-linux-x64.tar.xz:
    https://download.nextcloud.com/office/desktopeditors/Nextcloud-Office-DesktopEditors-latest-linux-x64.tar.xz
.. _nco-linux-arm64.tar.xz:
    https://download.nextcloud.com/office/desktopeditors/Nextcloud-Office-DesktopEditors-latest-linux-arm64.tar.xz
