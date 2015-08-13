===========================================
What's New for Admins in ownCloud |version|
===========================================

New Packaging
-------------

We are introducing a new packaging system (starting in ownCloud 8.0). Instead of 
two editions, Community and Enterprise, we now offer Server to replace the old 
Community edition, and Enterprise Subscription replaces the old Enterprise 
Edition.

Server includes core file share and synchronization features plus community 
apps, and is community-supported and free of cost. See `owncloud.org 
<https://owncloud.org/>`_ for current information and links to downloads.

ownCloud now offers two levels of paid support:

* ownCloud Standard 
* ownCloud Enterprise

The ownCloud Standard Subscription is for customers who want paid support for 
the core Server, and do not need Enterprise apps. This includes:

* ownCloud Server
* ownCloud desktop and mobile apps (without the custom branding build service)
* ownCloud open-source apps licensed as AGPL (Share Files, 
  Federated Cloud, Versions, Deleted files, LDAP/AD, Antivirus, Encryption, 
  External Storage. etc.), 8x5 support hours

Note: This does not include support for Contacts, Calendar, Tasks, Chat, 
Documents, or any other community-only apps, and it does not include support 
for Enterprise-only apps or services.

The ownCloud Enterprise Subscription replaces the Enterprise Edition. This 
includes the core Server plus Enterprise apps. The Enterprise Subscription 
includes:

* ownCloud Standard Subscription
* ownCloud Enterprise apps (Logging modules, SAML, File Firewall, Sharepoint, 
  Windows Network Drive, Home Directory Mounts, etc) 
* ownBrander for mobile app branding
* ownCloud Commercial License for closed-source customizations
* Up to 24x7 support
* Deployment assistance for the rollout

New customers, or customers upgrading from the old Enterprise Edition will 
install ownCloud 8 from the existing ``owncloud-enterprise`` repository. The 
``owncloud-server`` dependency will be pulled in automatically. Customers using 
the community edition will upgrade via package manager by adding the 
``owncloud-enterprise repository``, and installing ownCloud Enterprise Edition 
apps on top of their ``owncloud-server``.

Visit `owncloud.com <https://owncloud.com/>`_ for more information on the 
Enterprise Subscription.

Improvements and New Features
-----------------------------

ownCloud Server and Enterprise Subscription |version| are shipping with a batch 
of improvements and new features, including:

* Improved performance, with faster file transfers, much faster file deletion, 
  improved scalability through improved handling of parallel requests, and up 
  to 50% more users on each ownCloud server instance. 
* Better file locking
* Updated encryption with support for multiple encryption backends and 
  migration tools for 8.0 -> 8.1
* Improved LDAP configuration wizard
* WebDAV performance enhancements
* SFTP external storage with SSH keys
* SMB external storage is now based on ``libsmbclient``

* Individual settings per external storage mount, including encryption and previews
* Improved performance and better storage space management of preview 
  generation
* UI improvements for configuring external storage
* The ownCloud Appstore shows now different trust levels, and allows enabling 
  experimental apps
* Deleted files & folders now keep the share info after restoring from trashbin 
  (local shares only and not external storage)


* Many more links from the administration UI to the relevant documentation
* ``occ`` command updated to allow installing ownCloud completely from the 
  command line
* User avatars are displayed in share dialogs
* Font preview, 3D pictures media type (previewed as JPEG) and raw media type 
  support without previews 
* A new simple example theme is included
* All shares now have at least read permissions, which prevents unpredictable 
  server behavior
* Support for shortened URLs
* Users may not remove share expiration dates when the admin settings require 
  them
* Auto complete in share dialog works again when sharing is limited to groups
* `Developer changelog 
  <https://doc.owncloud.org/server/8.1/developer_manual/app/changelog.html>`_ 
  is available in the Developer's Manual

* File IDs are now persistent when moving files across storages, deleted to 
  trashbin or restored as version
* Ship ca-bundle.crt to work around issues on systems that experience failed 
  connections to the Appstore
* Introduce new "OC-ETag" header fixing issues with server configs stripping off 
  ETags "No E-Tag received from server" 
