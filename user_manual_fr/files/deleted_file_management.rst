======================
Gérer les fichiers supprimés
=======================

Lorsque vous supprimez un fichier dans Nextcloud, il n'est pas immédiatement supprimé de manière permanente.
Au lieu de cela, il est déplacé dans la corbeille. Il est définitivement supprimé lorsque
vous le supprimez manuellement ou lorsque l'application Supprimée les supprime pour faire de la place
pour les nouveaux fichiers.

Trouvez vos fichiers supprimés en cliquant sur le bouton ** Fichiers supprimés **
de la page Fichiers de l'interface Web Nextcloud. Vous aurez des options pour
soit restaurer ou supprimer définitivement des fichiers.

Les quotas
------

Les fichiers supprimés ne sont pas comptabilisés dans votre quota de stockage. Seulement vos fichiers personnel
sont comptabilisés dans votre quota et non les fichiers partagés avec vous.
(Voir :doc:`quota` pour en savoir plus sur les quotas.)

Que se passe-t-il lorsque des fichiers partagés sont supprimés?
------------------------------------------

La suppression de fichiers devient un peu compliquée quand il s’agit de fichiers partagés, 
ce scénario l'illustre:

1. Utilisateur1 partage un dossier "test" avec Utilisateur2 et Utilisateur3
2. Utilisateur2 (le destinataire) supprime un fichier / un sous-dossier à l'intérieur de "test"
3. Le sous-dossier sera déplacé vers la corbeille de Utilisateur1 (propriétaire) et
   Utilisateur2 (destinataire)
4. Mais Utilisateur3 n'aura pas une copie du sous-dossier dans sa corbeille

Lorsque Utilisateur1 supprime le sous-dossier, il est déplacé vers la corbeille de Utilisateur1. Il est
supprimé de Utilisateur2 et Utilisateur3, mais non placé dans leur corbeille.

Lorsque vous partagez des fichiers, d'autres utilisateurs peuvent les copier, les renommer, les déplacer et les partager avec
d'autres personnes, comme elles le peuvent pour tous les fichiers informatiques; Nextcloud n'a pas de
pouvoirs magiques pour empêcher cela.

Comment l'application de fichiers supprimés gère l'espace de stockage
-----------------------------------------------

Pour vous assurer que les utilisateurs ne dépassent pas leurs quotas de stockage, le programme Fichiers supprimés
alloue un maximum de 50% de l’espace libre disponible au fichiers supprimés. 
Si vos fichiers supprimés dépassent cette limite, Nextcloud supprime les
fichiers les plus anciens (fichiers avec les horodatages les plus anciens depuis leur suppression)
jusqu'à ce qu'il respecte à nouveau la limite d'utilisation de la mémoire.

Nextcloud vérifie l’âge des fichiers supprimés chaque fois que de nouveaux fichiers sont ajoutés à la liste des
fichiers supprimés. Par défaut, les fichiers supprimés restent dans la corbeille pendant 30 jours. 
L’administrateur du serveur Nextcloud peut ajuster cette valeur dans le fichier ``config.php``
en définissant la valeur ``trashbin_retention_obligation``. 
En outre, Nextcloud calcule l'espace disponible maximal chaque fois qu'un nouveau
fichier est ajouté. Si les fichiers supprimés dépassent le nouvel espace maximum autorisé
Nextcloud expirera les anciens fichiers supprimés jusqu'à ce que la limite soit atteinte à nouveau.
