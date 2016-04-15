===========================================
What's New for Admins in ownCloud |version|
===========================================

See the `ownCloud 9.0 Features page 
<https://github.com/owncloud/core/wiki/ownCloud-9.0-Features>`_ on Github for a 
comprehensive list of new features and updates.

ownCloud has many improvements. Some of our new features are:

* Split Linux packaging, dividing ownCloud and dependencies into two separate 
  packages (:doc:`installation/linux_installation`)
* Separate encryption for home storage and remote storage; you may encrypt 
  remote storage without encrypting local storage. 
  (:doc:`configuration_files/encryption_configuration`)
* New command to transfer files from one user to another. 
  (:ref:`transfer_userfiles_label`)
* Streamlined Federation sharing with user and group name auto-fill. See 
  (:ref:`label-direct-share-link`)
* Configurable password reset URL. See 
  (:doc:`configuration_user/reset_user_password`)
* Command-line options added to the Updater app. (:doc:`maintenance/update`)
* Many new ``occ`` commands. (:doc:`configuration_server/occ_command`)
* Admin option to enable and disable sharing on external storage mountpoints. (:ref:`external_storage_mount_options_label`)
* New ``occ`` commands for migrating contacts and calendars from 8.2, 
  if auto-migration during upgrade fails, and new commands for creating 
  addressbooks and calendars (:ref:`dav_label`)
* New optional second name attribute in the LDAP app, so that user names appear 
  as ``User Foo (optional 2nd attribute)`` (:ref:`ldap_directory_settings`)
  
Enterprise Only
---------------

* Advanced tagging management with the Workflow app. 
  (:doc:`enterprise_file_management/files_tagging`)
* Advanced authentication backends. 
  (:doc:`enterprise_external_storage/enterprise_only_auth`)
* Password policy app for share links, for setting password requirements such 
  as minimum length and required characters.
  (:ref:`password_policy_label`)  
