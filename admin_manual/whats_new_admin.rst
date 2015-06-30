=====================================
What's New for Admins in ownCloud 8.1
=====================================

ownCloud Server and Enterprise Subscription 8.1 are shipping with a batch of 
improvements and new features, including:

* Improved performance, with faster file transfers, much faster file deletion, improved scalability   through improved handling of parallel requests, and up to 50% more users on each ownCloud server    instance. 
* Better file locking
* Updated encryption with support for multiple encryption backends and 
  migration tools for 8.0 -> 8.1
* Improved LDAP configuration wizard
* WebDAV performance enhancements
* SFTP external storage with SSH keys
* SMB external storage is now based on ``libsmbclient``
* Improved performance and better storage space management of preview 
  generation
* UI improvements for configurating external storage
* The ownCloud Appstore shows now different trust levels, and allows enabling 
  experimental apps
* Deleted files & folders now keep the share info after restoring from trashbin 
  (local shares only and not external storage)


* Many more links from the administration UI to the relevant documention
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
