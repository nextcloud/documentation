=============
Quota d'espace utilisable
=============

L'administrateur de l'instance Nextcloud a un option pour régler la quota d'espace utilisable par les utilisateurs.Regardez sur la page de votre profil pour savoir l'espace que l'administrateur vous a donné et l'espace que vous avez déjà utilisé.

.. figure:: ../images/quota1.png

Il serait intéressant de savoir maintenant comment votre quota est calculé.

Les metadonnées (vignettes, fichiers temporaires, cache et clés de chiffrement) occupent environ 10 % de l'espace disque, mais ne sont pas prises en compte dans les quotas d'utilisateurs. Certaines applications stockent des informations dans la base de données, comme les applications Calendrier et Contacts.
Ces données sont exclues de votre quota.

Quand d'autres personnes partagent des fichiers avec vous, la taille de ces fichiers est amputé au quota de celui qui a partagé le fichier original. Lorsque vous partagez un dossier et que vous autorisez d'autres utilisateurs ou groupes à y télécharger des fichiers, tous les fichiers téléchargés et modifiés sont amputés à votre quota. Lorsque vous partagez à nouveau des fichiers déjà partagés avec vous, la taille de ceux-ci est amputée quand même au quota du propriétaire original de ces fichiers.

Les fichiers chiffrés sont un peu plus grand que des fichiers qui ont été déchiffrés; la taille de ce "déchiffrement" est calculé en fonction de votre quota

Les fichiers qui ont été supprimés, mais qui sont encore dans la corbeille, ne sont pas amputé aux quotas. La corbeille a un taille qui est celle de la moitié du quota de l'utilisateur. La durée avant suppression définitive des fichiers de la corbeille est fixée à 30 jours. Quand es fichiers supprimés dépassent la taille de la corbeille, alors, les fichiers les plus anciens sont supprimés, jusqu'a ce que le total soit en dessous de 50%.

Quand le contrôle de version est activé, les anciennes versions du fichiers ne sont pas amputés aux quotas.

Si vous partagez le fichiers publiquement à travers une URL, tous les fichiers téléversés sont amputés à votre quota.
