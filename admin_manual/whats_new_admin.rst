===================================
What's New for Admins in ownCloud 8
===================================

New Packaging
-------------

We are introducing a new packaging system. Instead of two editions, Community 
and Enterprise, we now offer Server to replace the old Community edition, and
Enterprise Subscription replaces the old Enterprise Edition.

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

No More PHP 5.3
---------------

PHP 5.3 is not supported in ownCloud 8, and PHP 5.4 is required.

Improved Admin and Settings UI
------------------------------

The ownCloud Admin and Settings pages have been streamlined and re-organized, 
and include a new sidebar for accessing configuration options more quickly.

Simplified App Management
-------------------------

Installing, upgrading, and removing apps is easier, and includes a new 
dependency feature to automatically resolve installation dependendencies.

New Updater Layout
------------------

The Updater app (Server only) is more intelligent, and detects errors before 
they happen and rolls the update back. Status and error messages are more 
informative.

More Powerful User Management
-----------------------------

In addition to the existing filter and text string searchable user management, 
an entirely new set of features has been added to ownCloud. Admins can now edit 
email addresses for system users and send email notification to newly created
system users.

LDAP Improvements, Including LDAP User Cleanup
----------------------------------------------

ownCloud has significantly improved LDAP and AD performance, provided additional 
configuration options and expert modes, and added a new utility for verifying 
and removing users from ownCloud that are no longer active in LDAP or AD.

Improved and Open-Sourced Provisioning API
------------------------------------------

Remote management of ownCloud users is enabled with the Provisioning API. 
Previously limited to the Enterprise edition, it is now open source and 
available to the community.

Favorites
---------

Users can now assign a favorite icon to files and folders. Look for 
improvements in this feature in future ownCloud editions to make finding and 
managing files even easier.

Improved Server-to-Server Sharing
---------------------------------

Server-to-Server Sharing, introduced in ownCloud 7, allows you to mount file 
shares from remote ownCloud servers, and create a "cloud of ownClouds". In 
ownCloud 8 the process for creating a new Server-to-Server link is easier and more 
streamlined.

Improved Search
---------------

The search interface has been streamlined and simplified, with more features
including enhanced result set reporting and additional search parameters.

Web Interface Enhancements
--------------------------

The ownCloud Web interface has been improved to make it easier for all users to 
access, edit, sync and share their files.

Download Broker Improves Performance
------------------------------------

When ownCloud delivers universal file access to end users, files from many 
different document sources are aggregated into a single interface and served to 
end users. In some cases, passing all of the files aggregated in this interface 
through a single server, ownCloud, slows down data access. ownCloud now 
supports direct downloads of files from select storage back-ends, reducing the 
load on the ownCloud server without sacrificing control over the files that are 
stored in the various back end systems.
