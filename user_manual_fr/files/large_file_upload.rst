==================
Téléversement de gros fichiers
==================

Lors du téléchargement de fichiers via le client web, Nextcloud est limité par les configurations PHP et Apache. Par défaut, PHP est configuré pour accepter seulement 2 mégaoctets de téléversements. Comme cette limite de téléversement par défaut n'est pas très grande, nous recommandons à votre administrateur Nextcloud d'augmenter les variables Nextcloud à une taille plus appropriées pour les utilisateurs.

La modification de certaines variables Nextcloud nécessite un accès administratif. Si vous avez besoin de limites de téléchargement plus élevées que celles fournies par défaut (ou déjà définies par votre administrateur) :

* Contactez votre administrateur pour demander une augmentation de ces variables
* Reportez-vous à la section de la `documentation de l'administrateur <https://docs.nextcloud.org/server/14/admin_manual/configuration_files/big_file_upload_configuration.html>`_ qui décrit comment gérer les limites de taille de téléchargement de fichiers.
