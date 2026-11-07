================================
Server-side encryption migration
================================

Encryption format
-----------------

Nextcloud still supports the legacy encryption scheme used for server side encryption where the encrypted files did not contain header information. This may still be used for installations that still have encrypted files from <= ownCloud 6. Files will be updated to the new encryption format once they are written again. However it is recommended to check if you have to still support this scheme.

Starting with version 20 for new installations the legacy encryption will be off by default.
However if you are upgrading there is a migration path to check if you can disable legacy encryption.

Checking for old files
^^^^^^^^^^^^^^^^^^^^^^

On the command line run:

 occ encryption:scan:legacy-format

.. note:: This command is provided by the **Default encryption module** app
   (``encryption``). If that app is disabled, ``occ`` reports that there are no
   commands in the ``encryption:scan`` namespace. Temporarily enable it with
   ``occ app:enable encryption``, run the scan, then disable it again if you do
   not otherwise use server-side encryption. This is **not** the separate
   End-to-end encryption app.

The command will tell you if you can remove the legacy encryption mode.
If so set the `encryption.legacy_format_support` in your config.php to 'false'.

