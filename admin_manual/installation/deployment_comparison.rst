============================
Deployment methods comparison
============================

The following table compares the available Nextcloud deployment methods to help
you choose the one that best suits your needs.

.. list-table::
   :header-rows: 1
   :widths: 30 10 10 10 10 10 10 10

   * - Feature
     - `Nextcloud AIO <https://github.com/nextcloud/all-in-one>`_
     - `Nextcloud VM <https://github.com/nextcloud/vm>`_
     - `NextcloudPi <https://github.com/nextcloud/nextcloudpi>`_
     - `Snap <https://github.com/nextcloud-snap/nextcloud-snap>`_
     - Manual (LAMP/LEMP)
     - Docker Compose (custom)
     - Helm Chart (Kubernetes)
   * - Officially supported by Nextcloud GmbH
     - ✅
     - ❌
     - ❌
     - ❌
     - ✅
     - ❌
     - ❌
   * - Typical deployment platform
     - Docker
     - Virtual machine
     - RPi / SBC / LXC
     - Ubuntu / Debian
     - Bare metal / VM
     - Docker
     - Kubernetes
   * - Easy / guided setup
     - ✅ one command
     - ⚠️ interactive script
     - ✅ image or curl
     - ✅ one command
     - ❌
     - ⚠️
     - ❌
   * - Web management UI (non-Nextcloud)
     - ✅ AIO panel
     - ⚠️ Webmin (optional)
     - ✅ ncp-web
     - ❌
     - ❌
     - ❌
     - ❌
   * - Automatic TLS (Let's Encrypt)
     - ✅
     - ✅ via script
     - ✅
     - ✅
     - ❌
     - ❌
     - ⚠️
   * - Included database
     - ✅ PostgreSQL
     - ✅ PostgreSQL 16
     - ✅ MariaDB
     - ✅ MySQL 8.4
     - ⚠️ User choice
     - ⚠️ User choice
     - ⚠️ User choice
   * - Redis caching included
     - ✅
     - ✅
     - ✅
     - ✅
     - ❌
     - ⚠️
     - ⚠️
   * - APCu caching included
     - ✅
     - ❌
     - ✅
     - ❌
     - ❌
     - ⚠️
     - ⚠️
   * - Built-in backup solution
     - ✅ BorgBackup
     - ❌
     - ✅
     - ❌
     - ❌
     - ❌
     - ❌
   * - Automated updates
     - ✅
     - ✅ via script
     - ✅
     - ✅ (snap)
     - ❌
     - ❌
     - ❌
   * - Nextcloud Office / Collabora
     - ✅ optional
     - ✅ optional
     - ❌
     - ❌
     - ⚠️
     - ⚠️
     - ⚠️
   * - High-performance Talk backend
     - ✅ optional
     - ❌
     - ❌
     - ❌
     - ⚠️
     - ⚠️
     - ⚠️
   * - ClamAV antivirus
     - ✅ optional
     - ❌
     - ❌
     - ❌
     - ⚠️
     - ⚠️
     - ❌
   * - Full-text search
     - ✅ optional
     - ❌
     - ❌
     - ❌
     - ⚠️
     - ⚠️
     - ❌
   * - Fail2Ban included
     - ⚠️ community
     - ⚠️ optional
     - ✅
     - ❌
     - ❌
     - ❌
     - ❌
   * - Hardware transcoding support
     - ✅
     - ❌
     - ❌
     - ❌
     - ⚠️
     - ⚠️
     - ⚠️
   * - Community add-on containers
     - ✅
     - ❌
     - ❌
     - ❌
     - ❌
     - ❌
     - ❌
   * - A+ security score out of the box
     - ✅
     - ✅
     - ✅
     - ⚠️
     - ⚠️
     - ⚠️
     - ⚠️
   * - Docker rootless support
     - ✅
     - ❌
     - ❌
     - ❌
     - ❌
     - ⚠️
     - N/A
   * - Kubernetes / Helm support
     - ⚠️ via Helm chart
     - ❌
     - ❌
     - ❌
     - ❌
     - ❌
     - ✅
   * - Full configuration control
     - ⚠️ limited
     - ✅
     - ✅
     - ⚠️ limited
     - ✅
     - ✅
     - ✅
   * - Suitable for beginners
     - ✅
     - ⚠️
     - ✅
     - ✅
     - ❌
     - ⚠️
     - ❌
   * - Raspberry Pi / SBC support
     - ⚠️ via Docker
     - ⚠️ RPi 4/5
     - ✅ primary target
     - ✅
     - ✅
     - ✅
     - ❌

* ✅ = included / supported out of the box
* ⚠️ = possible but requires manual steps or has caveats
* ❌ = not supported / not included

.. note::

   NextcloudPi and the Snap are community-maintained but hosted under the
   Nextcloud GitHub organisation. The Nextcloud VM is community-maintained
   by Hansson IT; Nextcloud GmbH does not provide official support for it.
   NCP Docker support has been discontinued.
