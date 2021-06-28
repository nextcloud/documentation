��          �               <  :   =  �   x  b   :  �   �  /   V     �  �  �     .  [   5  ]  �  1   �  B   !  *   d  �   �  �   	  �   
  #  �
  �  �  H   �  �     w     �   {  G   U     �  0  �  
   �  �   �  �  �  H   @  ^   �  A   �  �   *  I  �    .  H  :   But User3 will not have a copy of "sub" in their trash bin Deleted files are not counted against your storage quota. Only your personal files count against your quota, not files which were shared with you. (See :doc:`quota` to learn more about quotas.) Deleting files gets a little complicated when they are shared files, as this scenario illustrates: Find your deleted files by clicking on the **Deleted files** button on the Files page of the Nextcloud Web interface. You'll have options to either restore or permanently delete files. How the deleted files app manages storage space Managing deleted files Nextcloud checks the age of deleted files every time new files are added to the deleted files. By default, deleted files stay in the trash bin for 30 days. The Nextcloud server administrator can adjust this value in the ``config.php`` file by setting the ``trashbin_retention_obligation`` value. Files older than the ``trashbin_retention_obligation`` value will be deleted permanently. Additionally, Nextcloud calculates the maximum available space every time a new file is added. If the deleted files exceed the new maximum allowed space Nextcloud will permanently delete those trashed files with the soonest expiration until the space limit is met again. Quotas The folder "sub" will be moved to the trash bin of both User1 (owner) and User2 (recipient) To ensure that users do not run over their storage quotas, the Deleted Files app allocates a maximum of 50% of their currently available free space to deleted files. If your deleted files exceed this limit, Nextcloud deletes the oldest files (files with the oldest timestamps from when they were deleted) until it meets the memory usage limit again. User1 shares a folder "test" with User2 and User3 User2 (the recipient) deletes a file/folder "sub" inside of "test" What happens when shared files are deleted When User1 deletes "sub" then it is moved to User1's trash bin. It is deleted from User2 and User3, but not placed in their trash bins. When you delete a file in Nextcloud, it is not immediately deleted permanently, only moved into the trash bin. It is not permanently deleted until you manually delete it, or when the Deleted Files app deletes it to make room for new files. When you share files, other users may copy, rename, move, and share them with other people, just as they can for any computer files; Nextcloud does not have magic powers to prevent this. Your administrator may have configured the trash bin retention period to override the storage space management. See `admin documentation <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#deleted-items-trash-bin>`_ for more details. Project-Id-Version: Nextcloud latest User Manual latest
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2020-10-05 20:47+0000
PO-Revision-Date: 2019-11-07 20:29+0000
Last-Translator: claude deheneffe <claude.deheneffe@gmail.com>, 2020
Language: fr
Language-Team: French (https://www.transifex.com/nextcloud/teams/64236/fr/)
Plural-Forms: nplurals=2; plural=(n > 1)
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.9.1
 Mais Utilisateur3 n'aura pas une copie du sous-dossier dans sa corbeille Les fichiers supprimés ne sont pas comptabilisés dans votre quota de stockage. Seulement vos fichiers personnel sont comptabilisés dans votre quota et non les fichiers partagés avec vous. (Voir :doc:`quota` pour en savoir plus sur les quotas.) La suppression de fichiers devient un peu compliquée quand il s’agit de fichiers partagés, ce scénario l'illustre: Trouvez vos fichiers supprimés en cliquant sur le bouton **Fichiers supprimés** de la page Fichiers de l'interface Web Nextcloud. Vous aurez des options pour soit restaurer ou supprimer définitivement des fichiers. Comment l'application de fichiers supprimés gère l'espace de stockage Gérer les fichiers supprimés Nextcloud vérifie l'age des fichiers supprimés chaque fois que de nouveaux fichiers sont ajoutés à la corbeille. Par défaut, les fichiers supprimés sont conservés 30 jours dans la corbeille. L'administrateur du serveur Nextcloud peut modifier  ce paramètre dans "config.php"  en changeant la valeur  de "trashbin_retention_obligation". Les fichiers plus vieux  que la valeur  de "trashbin_retention_obligation" seront supprimés de manière définitive. De plus,  Netxcloud calcule  le montant de l'espace disponible à chaque création de nouveau fichier. Si l'espace occupé par des fichiers supprimés excède la nouvelle valeur d'espace alloué, Nexcloud supprimera de manière définitive les fichiers supprimés dont la date d'expiration est la plus grande jusqu'à cette limite soit à nouveau remplie Les quotas Le dossier "Sub" sera déplacé dans la corbeille des utilisateurs Utilisateur1  (le propriétaire) et Utilisateur2 (le destinataire).  Pour vous assurer que les utilisateurs ne dépassent pas leurs quotas de stockage, le programme Fichiers supprimés alloue un maximum de 50% de l’espace libre disponible au fichiers supprimés. Si vos fichiers supprimés dépassent cette limite, Nextcloud supprime les fichiers les plus anciens (fichiers avec les horodatages les plus anciens depuis leur suppression) jusqu'à ce qu'il respecte à nouveau la limite d'utilisation de la mémoire. Utilisateur1 partage un dossier "test" avec Utilisateur2 et Utilisateur3 Utilisateur2 (le destinataire) supprime un fichier / un sous-dossier à l'intérieur de "test" Que se passe-t-il lorsque des fichiers partagés sont supprimés? Lorsque Utilisateur1 supprime le sous-dossier, il est déplacé vers la corbeille de Utilisateur1. Il est supprimé de Utilisateur2 et Utilisateur3, mais non placé dans leur corbeille. Lorsque vous supprimez un fichier dans Nextcloud, il il n'est pas supprimé de manière définitive, mais déplacé dans la corbeille. Il n'est pas supprimé de manière définitive jusqu'à vous le supprimiez  manuellement ou si l'application Fichiers Supprimés le fasse pour récupérez de la place pour les nouveaux fichiers. Lorsque vous partagez des fichiers, d'autres utilisateurs peuvent les copier, les renommer, les déplacer et les partager avec d'autres personnes, comme elles le peuvent pour tous les fichiers informatiques; Nextcloud n'a pas de pouvoirs magiques pour empêcher cela. Votre administrateur pourrait avoir configuré la période de rétention de la corbeille pour passer outre la gestion de l'espace de stockage. Voir `admin documentation <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#deleted-items-trash-bin>`_ pour plus de détails. 