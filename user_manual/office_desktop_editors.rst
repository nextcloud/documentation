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

Individual packages
^^^^^^^^^^^^^^^^^^^

If you cannot use the package repository, download a package directly. These packages are not updated
automatically.

.. list-table::
    :header-rows: 1

    * - Distribution
      - Architecture
      - Download
    * - Debian, Ubuntu
      - x64
      - `.deb <nco-linux-x64.deb_>`__
    * - Debian, Ubuntu
      - ARM64
      - `.deb <nco-linux-arm64.deb_>`__
    * - Fedora, RHEL, openSUSE
      - x64
      - `.rpm <nco-linux-x64.rpm_>`__
    * - Fedora, RHEL, openSUSE
      - ARM64
      - `.rpm <nco-linux-arm64.rpm_>`__
    * - Any distribution (portable)
      - x64
      - `.tar.xz <nco-linux-x64.tar.xz_>`__
    * - Any distribution (portable)
      - ARM64
      - `.tar.xz <nco-linux-arm64.tar.xz_>`__

.. _nco-windows-x64.exe:
    https://download.nextcloud.com/office/desktopeditors/Nextcloud-Office-DesktopEditors-latest-windows-x64.exe
.. _nco-windows-arm64.exe:
    https://download.nextcloud.com/office/desktopeditors/Nextcloud-Office-DesktopEditors-latest-windows-arm64.exe
.. _nco-macos-arm64.dmg:
    https://download.nextcloud.com/office/desktopeditors/Nextcloud-Office-DesktopEditors-latest-macos-arm64.dmg
.. _nco-linux-x64.deb:
    https://download.nextcloud.com/office/desktopeditors/Nextcloud-Office-DesktopEditors-latest-linux-x64.deb
.. _nco-linux-arm64.deb:
    https://download.nextcloud.com/office/desktopeditors/Nextcloud-Office-DesktopEditors-latest-linux-arm64.deb
.. _nco-linux-x64.rpm:
    https://download.nextcloud.com/office/desktopeditors/Nextcloud-Office-DesktopEditors-latest-linux-x64.rpm
.. _nco-linux-arm64.rpm:
    https://download.nextcloud.com/office/desktopeditors/Nextcloud-Office-DesktopEditors-latest-linux-arm64.rpm
.. _nco-linux-x64.tar.xz:
    https://download.nextcloud.com/office/desktopeditors/Nextcloud-Office-DesktopEditors-latest-linux-x64.tar.xz
.. _nco-linux-arm64.tar.xz:
    https://download.nextcloud.com/office/desktopeditors/Nextcloud-Office-DesktopEditors-latest-linux-arm64.tar.xz
