Files Encryption
================

ownCloud ships a encryption app, which enables encryption of all files stored in
your ownCloud. Once the encryption app is enabled by the admin, all your files
will be encrypted automatically. Encryption and decryption always happens
server-side. This enables the user to continue to use all the other apps to
view and edit their data. But this also means that the server administrator could
intercept your data. Server-Side encryption is especially useful if you
use external storages. This way you can make sure that the storage provider is
not able to read your data.

Please remember. Once the encryption app is enabled your log-in password is required
to decrypt and access your data. By default your data will be lost if
you lose your log-in password. If you want to protect yourself against password
loss, store your log-in password in a secure place or enable the recovery-key
feature as described below.

What gets encrypted
-------------------

The current version encrypts all your files stored in ownCloud except the following:

- old files in the trash bin (files which were deleted before the encryption app was enabled)
- image thumbnails from the gallery app and previews from the files app
- search index from the full text search app

All this data is stored directly on your ownCloud server, so you don't have to worry about exposing
your data to a third party storage provider.

Decrypt your data again
-----------------------

If the encryption app is disabled after users have already stored encrypted data, users
will be promted to decrypt their files again in their personal settings. After this is
done, they can continue to use their ownCloud without encryption.

Settings
--------

Once the encryption app is enabled, you will find some additional settings on
your personal settings page.

Recovery Key
~~~~~~~~~~~~

If the admin enabled the recovery-key feature you can decide for yourself if
you want to use this feature for your account. If you enable "Password recovery"
the admin will be able to read your data with a special password. This allows
him to recover your files in the event you lose your password. If the recovery-key
is not enabled than there is no way to restore your files if you lose your log-in
password.

Change Private Key Password
~~~~~~~~~~~~~~~~~~~~~~~~~~~

This option will be only available if your log-in password but not your
encryption password was changed by your admin. This can happen if your ownCloud
provider uses a external user back-end, e.g. LDAP, and changed your log-in
password there. In this case you can set your encryption password to your new
log-in password by providing your old and new log-in password. The encryption
app only works if log-in password and encryption password is identical.
