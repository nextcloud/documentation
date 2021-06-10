====================
Encryption migration
====================

Encryption format
-----------------

Nextcloud still supports the legacy encryption scheme used for server side encryption.
However it is recommended to check if you have to still support this scheme.

Starting with version 20 for new installations the legacy encryption will be off by default.
However if you are upgrading there is a migration path to check if you can disable legacy encryption.

Checking for old files
^^^^^^^^^^^^^^^^^^^^^^

On the command line run:

 occ encryption:scan:legacy-format

The command will tell you if you can remove the legacy encryption mode.
If so remove the `encryption.legacy_format_support` from your config.php or set it to `false`.


