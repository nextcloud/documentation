Use Server-Side Encryption
==========================

ownCloud ships a encryption app, which allows to encrypt all files stored in
your ownCloud. Encryption and decryption always happens server-side. This
enables the user to continue to use all the other apps to view and edit his
data.

The app uses the users log-in password as encryption-password. This means that
by default the user will loss access to his files if he loss his log-in
password.

It might be a good idea to make regular backups of all encryption keys. The
encryption keys are sored in following folders:

* data/owncloud_private_key (recovery key, if enabled and public share key)
* data/public-keys (public keys from all users)
* data/<user>/files_encryption (users private key and all other keys necessary to
  decrypt the users files)

Enable File Recovery Feature
----------------------------

The admin can offer the user some kind of protection against password
loss. Therefore you have to enable the recovery key in the admin settings and
provide a strong recovery key password. The admin settings also enables you to
change the recovery key password if you wish. But you should make sure to never
loss this password, because that's the only way to recover users files.

Once the recovery key was enabled every user can choose in his personal
settings to enable this feature or not.

Recover User Files
------------------

If the recovery feature was enabled the admin will see a additional input field
at the top of the user management settings. After entering the recovery-key
password the admin can change the users log-in password which will
automatically recover the users file.

If you use a user back-end which doesn't allow you to change the log-in
password directly within ownCloud, e.g. the LDAP back-end, than you can follow
the same procedure to recover users files. The only difference is that
you need to change the log-in password additionally at your back-end. In this
case make sure to use both times the same password.

LDAP and other external user back-ends
--------------------------------------

if you configure a external user back-end you will be able to change the users log-in password
at the back-end. Since the encryption password must be the same as the users log-in password
this will result in a non-functional encryption system. If the recovery feature was enabled,
the administrator will be able to recover the users files directly over the recovery feature.
See the description above. Otherwise the user will be informed that his log-in password and
his encryption password no longer matchs after his next log-in. In this case the user will be
able to adjust his encryption password in the personal settings by providing both, his old and
his new log-in password.
