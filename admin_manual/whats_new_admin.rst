===========================================
What's New for Admins in ownCloud |version|
===========================================

See the `ownCloud 8.2 
Features page <https://github.com/owncloud/core/wiki/ownCloud-8.2-Features>`_ 
on Github for a comprehensive list of new features and updates.

Some of the improvements of interest to ownCloud admins are:

* Configurable temporary directory
* Many new occ commands for logging, encryption, and apps 
* Unavailable external storages are not rechecked every request; rather, their 
  failed state is saved and they are tried again after 10 minutes
* External storages now support modular authentication mechanisms
* Transactional file locking prevents data corruption and race conditions on 
  concurrent access
* Files app new sidebar shows details about files
* Admins can define custom mimetype mappings and aliases
* Mimetypes in the database can be updated when changed
* Downgrades are prevented because they are unsupported  
* Admin page warning for EOL PHP version 
* Show apps that will be updated on the DB update page

There are many security enhancements, including:

* $.get and $.post cannot be used to execute remote JavaScript
* Referers are not sent anymore to prevent leaking of potential sensitive 
  information within the URL such as the filename
* Autoloader will only allow loading files from enabled apps
* Encrypt session data to ensure that sensitive data such as remote storage 
  passwords or encryption keys are not written on disk
* If the shareAPI is disabled link shares no longer work