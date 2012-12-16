User Account Migration
======================

User account migration support is provided by the user_migrate app. It is important to note that only data from apps that support migration will be migrated. While we encoruage all apps to support migration, it is not a requirement and it the responsibility of the app developer.

Export
------
To export your user account, simply visit Settings > Personal and click on the 'Export' button. A compressed zip file will be generated on the fly and downloaded to your computer. This file includes all of your files and application data that was stored on your ownCloud account. You may use this as a method of backing up your personal account.

Import
------
To import your user account, you must first have an existing account on your new ownCloud install. Then follow this procedure:

#. Login to your new account on the new ownCloud instance
#. Navigate to the Settings > Personal page
#. Select the 'Import' button, and locate the zip file that you downloaded from your old ownCloud instance
#. Wait for the file to be uploaded and imported

.. note:: Your user account credentials will **not** be migrated.