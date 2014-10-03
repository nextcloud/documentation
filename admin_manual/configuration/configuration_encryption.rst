Use Server-Side Encryption
==========================

ownCloud ships a server side encryption app, which encrypts all files at rest 
on the server. Encryption and decryption always happen on the server-side. 
This enables the user to continue to use all the other apps to view and edit 
data. The Encryption app is meant to protect user data on external storage.

The app uses the user's log-in password as an encryption-password. This means that
by default the user will lose access to his files if he loses his log-in password.

It is recommended that the server admin regularly backup all encryption keys, to 
prevent permanent data loss. The encryption keys are stored in following folders:

* data/owncloud_private_key (recovery key, if enabled and public share key)
* data/public-keys (public keys from all users)
* data/<user>/files_encryption (users' private keys and all other keys necessary to
  decrypt the users' files)

.. note:: Encryption keys are stored only on the ownCloud server, eliminating
   exposure of your data to third party storage providers. The encryption app does **not** 
   protect your data if your ownCloud server is compromised. This would require client side encryption,
   which this app does not provide. Read 
   `this blog post <https://owncloud.org/blog/how-owncloud-uses-encryption-to-protect-your-data/>`_
   for more details.

Enabling the Encryption App
---------------------------

Though ownCloud provides the Encryption app in the server download, it is
disabled by default.  To enable the Encryption app:

1. Access the ownCloud server as administrator.

2. In the Apps Selection Menu, click "+".

   All apps appear in the Apps Information field.

3. Scroll down the apps list and click the Encryption app.

   .. figure:: ../images/encryption_enabling.png

   **Encryption app (Enabling)**

4. Click the :guilabel:`Enable` button.

   The Encryption app is enabled.

Decrypting Encrypted Files
--------------------------

If the Encryption app is disabled after users have already stored encrypted
data, users are prompted to decrypt their files again in their personal
settings. Once done, users can continue to use their ownCloud without
encryption.

Settings
--------

Once the encryption app is enabled, additional settings appear on the Admin
settings page.  These settings include the ability to:

* Set a recovery key password.
* Enable or disable the use of the recovery key password.


Enable File Recovery Feature
----------------------------

The admin can offer the user some kind of protection against password
loss. Therefore, you have to enable the recovery key in the admin settings and
provide a strong recovery key password. The admin settings also enable you to
change the recovery key password if you wish. But you should make sure to never
lose this password because that's the only way to recover users' files.

Once the recovery key was enabled, every user can choose in his personal
settings to enable this feature or not.

Recover User Files
------------------

If the recovery feature was enabled, the admin will see an additional input field
at the top of the user management settings. After entering the recovery-key
password the admin can change the user's log-in password which will
automatically recover the user's file.

If you use a user backend which does not allow you to change the log-in
password directly within ownCloud, e.g. the LDAP back-end, than you can follow
the same procedure to recover a user's files. The only difference is that
you need to change the log-in password additionally at your backend. In this
case make sure to use both times the same password.

LDAP and other external user back-ends
--------------------------------------

If you configure an external user back-end you will be able to change the user's log-in password
at the back-end. Since the encryption password must be the same as the user's log-in password
this will result in a non-functional encryption system. If the recovery feature was enabled,
the administrator will be able to recover the user's files directly over the recovery feature.
See the description above. Otherwise, the user will be informed that his log-in password and
his encryption password no longer matches after his next log-in. In this case, the user will be
able to adjust his encryption password in the personal settings by providing both, his old and
his new log-in password.
