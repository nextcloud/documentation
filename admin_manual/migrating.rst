Migrating ownCloud Installations
================================

To migrate an ownCloud install there are three things you need to retain:

#. The config.php file found in config/config.php
#. The data folder
#. The database (found in the data folder for sqlite installs)

To restore an ownCloud instance:

#. Extract ownCloud to your webserver
#. Copy over your config.php to config/config.php
#. Copy over your data folder
#. Import your database
#. Update config.php of any changes to your database connection