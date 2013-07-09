Files Encryption
================

ownCloud ships a encryption app, which allows to encrypt all files stored in
your ownCloud. Once the encryption app was enabled by the admin all your files
will be encrypted automatically. Encryption and decryption always happens
server-side. This enables the user to continue to use all the other apps to
view and edit his data. But this also means that the server administrator could
intercept your data. Server-Side encryption is especially interesting if you
use external storages. This way you can make sure that the storage provider is
not able to read your data.

Please remember. Once the encryption app is enabled you need your log-in
password to decrypt and access your data. By default your data will be lost if
you loss your log-in pasword. If you want to protect yourself against password
loss store your log-in password on a secure place or enable the recovery key
as described below.

What gets encrypted
-------------------

The current version encrypts all your files stored in ownCloud.

At the moment we don't encrypt:

- old versions (versions created before the encryption app was enabled)
- old files in the trash bin (files which were deleted before the encryption app was enabled)
- image thumbnails from the gallery app
- search index from the full text search app

All this data is stored directly on your ownCloud server, so you don't have to worry to expose
your data to a third party storage provider.

Decrypt your data again
-----------------------

Corrently there is no way to decrypt your files directly on the server if you decide to stop
using the encryption app. The only way to get a comlete copy of your unencrypted data is
to download/sync all files as long as the encryption app is enabled. After the encryption
app was disabled you can upload your unencrypted data again.

It is already planned to add a option to switch from encrypted to unencrypted files
directly on the server.

Settings
--------

Once the encryption app is enabled you will find some additional settings on
your personal settings page.

Recovery Key
~~~~~~~~~~~~

If the admin enabled the recovery-key you can decide by your own if you
want to use this feature for your account. If you enable "Password recovery"
the admin will be able to read your data with a special password. This allows
him to recover your files in case of password loss. If the recovery-key is not
enabled than there is no way to restore your files if you loss your log-in
password.

Change Private Key Password
~~~~~~~~~~~~~~~~~~~~~~~~~~~

This option will be only available if your log-in password but not your
encryption password was changed by your admin. This can happen if your ownCloud
provider uses a external user back-end, e.g. LDAP, and changed your log-in
password there. In this case you can set your encryption password to your new
log-in password by providing your old and new log-in password. The encryption
app only works if log-in password and encryption password is identical.
