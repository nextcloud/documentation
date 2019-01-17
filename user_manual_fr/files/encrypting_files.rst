=============================================
Chiffrer vos fichiers nextcloud sur le serveur
=============================================

Nextcloud inclut une application de chiffrement côté serveur, et lorsqu'elle est activée par votre administrateur Nextcloud, tous vos fichiers Nextcloud sont automatiquement chiffrés sur le serveur.
Le chiffrement s'applique à l'ensemble du serveur, de sorte que lorsqu'il est activé, vous ne pouvez pas refuser de chiffrer un fichier. Vous n'avez rien à faire de spécial, car il utilise vos identifiants Nextcloud comme mot de passe p comme clef privée de chiffrement unique. Il vous suffit de vous connecter, de vous déconnecter, de gérer et de partager vos fichiers comme vous le faites normalement. Vous pourrez toujours changer votre mot de passe quand vous le souhaiterez.

Its main purpose is to encrypt files on remote storage services that are
connected to your Nextcloud server, such as Dropbox and Google Drive. This is an
easy and seamless way to protect your files on remote storage. You can share
your remote files through Nextcloud in the usual way, however you cannot share
your encrypted files directly from Dropbox, Google Drive, or whatever remote
service you are using, because the encryption keys are stored on your Nextcloud
server, and are never exposed to outside service providers.

If your Nextcloud server is not connected to any remote storage services, then
it is better to use some other form of encryption such as file-level or whole
disk encryption. Because the keys are kept on your Nextcloud server, it is
possible for your Nextcloud admin to snoop in your files, and if the server is
compromised the intruder may get access to your files. (Read
`Encryption in Nextcloud <https://nextcloud.com/blog/encryption-in-nextcloud/>`_
to learn more.)

Chiffrement : FAQ
--------------

Comment enlever la fonctionnalité de chiffrement ?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

La seule façon de déactiver la fonctionnalité de chiffremebtn est de lancer le script `"decrypt all"<https://docs.nextcloud.org/server/14/admin_manual/configuration_server/occ_command.html#encryption-label>`_.
qui va ainsi déchiffrer tous vos fichiers et désactiver la fonctionnalité de chiffrement.

Est-il possible de déactiver le chiffrement avec la clef de récupération ?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Yes, *if* every user uses the `file recovery key
<https://docs.nextcloud.com/server/14/admin_manual/configuration_files/encryption_configuration.html#enabling-users-file-recovery-keys>`_,  `"decrypt all"
<https://docs.nextcloud.org/server/14/admin_manual/configuration_server/occ_command.html#encryption-label>`_ will use it to decrypt all files.

.. TODO ON RELEASE: Update version number above on release

Can encryption be disabled without the user's password?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you don't have the users password or `file recovery key
<https://docs.nextcloud.com/server/14/admin_manual/configuration_files/encryption_configuration.html#enabling-users-file-recovery-keys>`_.

.. TODO ON RELEASE: Update version number above on release

then there is no way to decrypt all files. What's
more, running it on login would be dangerous, because you would most likely run
into timeouts.

Is it planned to move this to the next user login or a background job?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If we did that, then we would need to store your login password in the database.
This could be seen as a security issue, so nothing like that is planned.

Is group Sharing possible with the recovery key?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you mean adding users to groups and make it magically work? No. This only
works with the master key.

Using encryption
----------------

Nextcloud encryption is pretty much set it and forget it, but you have a few
options you can use.

When your Nextcloud admin enables encryption for the first time, you must log
out and then log back in to create your encryption keys and encrypt your files.
When encryption has been enabled on your Nextcloud server you will see a yellow
banner on your Files page warning you to log out and then log back in.

.. figure:: ../images/encryption1.png

When you log back in it takes a few minutes to work, depending on how many
files you have, and then you are returned to your default Nextcloud page.

.. figure:: ../images/encryption2.png


.. note:: You must never lose your Nextcloud password, because you will lose
   access to your files. Though there is an optional recovery option that your
   Nextcloud administrator may enable; see the Recovery Key Password section
   (below) to learn about this.

Partage de fichiers chiffrés.
-----------------------

Only users who have private encryption keys have access to shared encrypted
files and folders. Users who have not yet created their private encryption keys
will not have access to encrypted shared files; they will see folders and
filenames, but will not be able to open or download the files. They will see a
yellow warning banner that says "Encryption App is enabled but your keys are not
initialized, please log-out and log-in again."

Share owners may need to re-share files after encryption is enabled; users
trying to access the share will see a message advising them to ask the share
owner to re-share the file with them. For individual shares, un-share and
re-share the file. For group shares, share with any individuals who can't access
the share. This updates the encryption, and then the share owner can remove the
individual shares.

Recovery key password
^^^^^^^^^^^^^^^^^^^^^

If your Nextcloud administrator has enabled the recovery key feature, you can
choose to use this feature for your account. If you enable "Password recovery"
the administrator can read your data with a special password. This feature
enables the administrator to recover your files in the event you lose your
Nextcloud password. If the recovery key is not enabled, then there is no way to
restore your files if you lose your login password.

.. figure:: ../images/encryption3.png

Fichiers qui ne sont pas chiffrés
-------------------

Seul les données dans vos fichiers sont chiffrées, contrairement aux noms ou à l'arborescence de ceux-ci. Ces fichiers ne sont jamais chiffrés :

- Les vieux fichiers se trouvent dans la corbeille
- Vignettes des images de l'application Gallery.
- Les prévisualisations de l'application Fichiers
- L'index de recherche de l'application de recherche
- Les données d'applications tierces.

Il peut y avoir d'autre fichiers non chiffrés; seuls les fichiers qui sont exposés à des fournisseurs de stockage tiers sont garantis chiffrés.

Changer le mot de passe de la clef privée
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Cette option n'est disponible que si votre mot de passe de connexion, pas celui de la clef de chiffrement, a été changé par votre administrateur.
This option is only available if your log-in password, but not your encryption
password, was changed by your administrator. This can occur if your Nextcloud
provider uses an external user back-end (for example, LDAP) and changed your
login password using that back-end configuration. In this case, you can set
your encryption password to your new login password by providing your old and
new login password. The Encryption app works only if your login password and
your encryption password are identical.
