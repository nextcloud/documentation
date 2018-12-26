===============
Le contrôle de version
===============

Nextcloud supporte le contrôle de version pour les fichiers.
Le contrôle de version crée des sauvegardes des différents fichiers qui son accessible via l'onglet "Versions sur la bar de détail.
Cet onglet contiens l'historique du fichier dans lequel vous pouvez rétrograder un fichier à n'importe quelle version antérieure
Les changement faits à des intervalle de plus de 2 minutes sont sauvegardés dans **data/[user]/versions**.

.. figure:: ../images/files_versioning.png

Pour restaurer une version spécifique d'un fichier, cliquez sur la flèche  vers la gauche
To restore a specific version of a file, cliquez sur la flèche circulaire vers la gauche.
Cliquez sur l'horodatage pour le télécharger.

Les versions plus anciennes se suppriment automatiquement, 
The versioning app expires old versions automatically to make sure that
the user doesn't run out of space. This pattern is used to delete
old versions:

* For the first second we keep one version
* For the first 10 seconds Nextcloud keeps one version every 2 seconds
* For the first minute Nextcloud keeps one version every 10 seconds
* For the first hour Nextcloud keeps one version every minute
* For the first 24 hours Nextcloud keeps one version every hour
* For the first 30 days Nextcloud keeps one version every day
* After the first 30 days Nextcloud keeps one version every week

The versions are adjusted along this pattern every time a new version gets
created.

The version app never uses more that 50% of the user's currently available free
space. If the stored versions exceed this limit, Nextcloud deletes the oldest
versions until it meets the disk space limit again.
