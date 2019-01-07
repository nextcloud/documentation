======================================
Accéder aux fichiers Nextcloud avec WebDAV
======================================

Nextcloud prend entièrement en charge le protocole WebDAV, et vous pouvez vous connecter et synchroniser
vos fichiers Nextcloud via WebDAV. Dans ce chapitre, vous apprendrez comment
connectez des périphériques Linux, macOS, Windows et mobiles à votre serveur Nextcloud via
WebDAV. Avant de commencer à configurer WebDAV, jetons un coup d’œil à la
manière recommandée de connecter les périphériques clients à vos serveurs Nextcloud.

.. note:: Dans les exemples suivants, vous devez ajuster ** example.com / ** à l'URL
	de votre installation de serveur Nextcloud. Et USERNAME est l'ID utilisateur du
   	connexion utilisateur.

   Voir l’URL webdav (en bas à gauche, paramètres) sur votre Nextcloud.

Nextcloud Desktop et clients mobiles
------------------------------------

La méthode recommandée pour synchroniser un ordinateur de bureau avec un serveur Nextcloud consiste à:
utiliser `Nextcloud / ownCloud clients de synchronisation <https://nextcloud.com/install/#install-clients>` _. 
Vous pouvez configurer le client pour enregistrer des fichiers dans n’importe quel répertoire local et vous pouvez choisir quels
répertoires sur le serveur Nextcloud avec lesquels synchroniser. Le client affiche
l'état actuel de la connexion et enregistre toute l'activité, de sorte que vous sachiez toujours lequels
des fichiers distants ont été téléchargés sur votre PC et vous pouvez vérifier que ces fichiers
créés et mis à jour sur votre PC local sont correctement synchronisés avec le serveur.

La méthode recommandée pour synchroniser le serveur Nextcloud avec Android et
Les appareils Apple iOS est en utilisant les `applications mobiles
<https://nextcloud.com/install/> `_.

Pour connecter votre application mobile à un serveur Nextcloud, utilisez l'URL 
de base et dossier uniquement ::

    example.com/nextcloud

Outre les applications mobiles fournies par Nextcloud ou ownCloud, vous pouvez utiliser d’autres applications pour vous
connectez à Nextcloud depuis votre appareil mobile à l'aide de WebDAV. `WebDAV Navigator`_ est
une bonne application (propriétaire) pour les «appareils Android» et les «iPhones »_. L'URL à utiliser sur ceux-ci est ::

    example.com/nextcloud/remote.php/dav/files/USERNAME/

Configuration de WebDAV
--------------------

Si vous préférez, vous pouvez également connecter votre ordinateur de bureau à votre serveur Nextcloud en
utilisant le protocole WebDAV plutôt qu’une application cliente spéciale. Web
WebDAV (Distributed Authoring and Versioning) est un protocole de transfert hypertexte
(HTTP) qui facilite la création, la lecture et la modification de fichiers sur le Web, 
les serveurs. Avec WebDAV, vous pouvez accéder à vos partages Nextcloud sous Linux, macOS et
Windows de la même manière que tout partage réseau distant et restez synchronisé.


Accéder aux fichiers sous Linux
---------------------------

Vous pouvez accéder aux fichiers des systèmes d'exploitation Linux à l'aide des méthodes suivantes.

Gestionnaire de fichiers Nautilus
^^^^^^^^^^^^^^^^^^^^

Utilisez le protocole `` davs: // `` pour connecter le gestionnaire de fichiers Nautilus à votre
Partage Nextcloud ::

  davs://example.com/nextcloud/remote.php/dav/files/USERNAME/

.. note:: Si votre connexion au serveur n'est pas sécurisée par HTTPS, utilisez `dav: //` à la place.
   de `davs: //`.

.. image:: ../images/webdav_gnome3_nautilus.png
   :alt: capture d'écran de la configuration du gestionnaire de fichiers Nautilus pour utiliser WebDAV

Accéder aux fichiers avec KDE et le gestionnaire de fichiers Dolphin
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Pour accéder à vos fichiers Nextcloud à l’aide du gestionnaire de fichiers Dolphin dans KDE, utilisez
le `` webdav: // `` protocol ::

    webdav://example.com/nextcloud/remote.php/dav/files/USERNAME/

.. image:: ../images/webdav_dolphin.png
   :alt: capture d'écran de la configuration du gestionnaire de fichiers Dolphin pour l'utilisation de WebDAV

Vous pouvez créer un lien permanent vers votre serveur Nextcloud:

#. Ouvrez Dolphin et cliquez sur "Réseau" dans la colonne de gauche "Lieux".
#. Cliquez sur l'icône intitulée ** Ajouter un dossier réseau **.
   La boîte de dialogue résultante doit apparaître avec WebDAV déjà sélectionné.
#. Si WebDAV n'est pas sélectionné, sélectionnez-le.
#. Cliquez sur Suivant**.
#. Entrez les paramètres suivants:

   * Nom: Le nom que vous voulez voir dans le signet ** Lieux **, par exemple Nextcloud.

   * Utilisateur: nom d'utilisateur Nextcloud que vous avez utilisé pour vous connecter, par exemple admin.

   * Serveur: le nom de domaine Nextcloud, par exemple ** exemple.com ** (sans
     ** http: // ** avant ou les répertoires après).
   * Dossier - Entrez le chemin `` nextcloud / remote.php / dav / files / USERNAME / ``.
#. (Facultatif) Cochez la case "Créer une icône" pour qu'un signet apparaisse dans le
   Colonne Places.
#. (Facultatif) Indiquez des paramètres spéciaux ou un certificat SSL dans l'onglet "Port &
   "Crypté".

Création de montages WebDAV à l'aide de ligne de commande Linux
------------------------------------------------

Vous pouvez créer des montages WebDAV à partir de la ligne de commande Linux. Ceci est utile si vous
préférez accéder à Nextcloud de la même manière que tout autre montage de système de fichiers distant.
L'exemple suivant montre comment créer un montage personnel et le faire monter
automatiquement chaque fois que vous vous connectez à votre ordinateur Linux.

1. Installez le pilote du système de fichiers WebDAV `` davfs2``, qui vous permet de monter
   le partage WebDAV comme tout autre système de fichiers distant. Utilisez cette commande pour
   l'installer sur Debian / Ubuntu ::

    apt-get install davfs2

2. Utilisez cette commande pour l’installer sur CentOS, Fedora et openSUSE ::

    yum install davfs2

3. Ajoutez-vous au groupe `` davfs2`` ::

    usermod -aG davfs2 <username>

3. Créez ensuite un répertoire `nextcloud`` dans votre répertoire personnel pour le
   point de montage et ``.davfs2 /`` pour votre fichier de configuration personnel ::

    mkdir ~/nextcloud
    mkdir ~/.davfs2

4. Coopiez ``/etc/davfs2/secrets`` verrs ``~/.davfs2``::

    cp  /etc/davfs2/secrets ~/.davfs2/secrets

5. Définissez-vous comme propriétaire et configurez les autorisations en lecture / écriture uniquement pour le propriétaire ::

    chown <username>:<username> ~/.davfs2/secrets
    chmod 600 ~/.davfs2/secrets

6. Ajoutez vos identifiants de connexion Nextcloud à la fin du fichier ``secrets``,
   en utilisant votre URL de serveur Nextcloud et votre nom d'utilisateur et mot de passe Nextcloud ::

    example.com/nextcloud/remote.php/dav/files/USERNAME/ <username> <password>

7. Ajoutez les informations de montage dans ``/etc/fstab`` ::

    example.com/nextcloud/remote.php/dav/files/USERNAME/ /home/<username>/nextcloud
    davfs user,rw,auto 0 0

8. Puis testez le montage et l’authentification en exécutant la commande suivante.
   Si vous le configurez correctement, vous n’avez pas besoin d’autorisations root:

    mount ~/nextcloud

9. Vous devriez aussi pouvoir le démonter:::

    umount ~/nextcloud

Maintenant, chaque fois que vous vous connecterez à votre système Linux, votre partage Nextcloud devrait
 se monter automatiquement via WebDAV dans votre répertoire ``~/nextcloud``. Si vous préfèrez
le monter manuellement, remplacez ``auto`` par ``noauto`` dans ``/etc/fstab``.


Problèmes connus
------------

Problème
^^^^^^^
ressource temporairement indisponible

Solution
^^^^^^^^
Si vous rencontrez des problèmes lorsque vous créez un fichier dans le répertoire,
editez ``/etc/davfs2/davfs2.conf`` et ajoutez::

    use_locks 0

Problème
^^^^^^^
Avertissements de certificat

Solution
^^^^^^^^

Si vous utilisez un certificat auto-signé, vous recevrez un avertissement. À
changez cela, vous devez configurer ``davfs2`` pour reconnaître votre certificat.
Copiez ``mycertificate.pem`` vers ``/etc/davfs2/certs/``. Puis éditez
``/etc/davfs2/davfs2.conf`` et décommentez la ligne ``servercert``. Maintenant, ajoutez le
chemin de votre certificat comme dans cet exemple::

 servercert /etc/davfs2/certs/mycertificate.pem

Accéder aux fichiers avec macOS
---------------------------

.. note:: Le Finder macOS souffre d'une `série de problèmes d'implémentation
   <http://sabre.io/dav/clients/finder/> `_ et ne doit être utilisé que si le
   Le serveur Nextcloud fonctionne sur **Apache** et **mod_php**, ou **Nginx 1.3.8+**.

Pour accéder aux fichiers via le Finder macOS:

1. Choisissez ** Aller> Se connecter au serveur **.

  La fenêtre "Connexion au Serveur" s'ouvre.

2. Spécifiez l'adresse du serveur dans le champ ** Adresse du serveur **.

  .. image:: ../images/osx_webdav1.png
     :alt: Capture d'écran de la saisie de l'adresse de votre serveur Nextcloud sur macOS

  Par exemple, l'URL utilisée pour se connecter au serveur Nextcloud
  à partir du Finder MacOS est ::

    https://example.com/nextcloud/remote.php/dav/files/USERNAME/

  .. image:: ../images/osx_webdav2.png

3. Cliquez sur **Connect**.

  L'appareil se connecte au serveur.

Pour plus d'informations sur la connexion à un serveur externe à l'aide de macOS,
vérifier la `documentation du vendeur
<http://docs.info.apple.com/article.html?path=Mac/10.6/fr/8160.html> `_.

Accéder aux fichiers avec Microsoft Windows
---------------------------------------

Si vous utilisez l’implémentation Windows native, vous pourrez mapper Nextcloud à un nouveaux
lecteur. Le mappage sur un lecteur vous permet de parcourir les fichiers stockés sur un Nextcloud
serveur comme vous le feriez pour des fichiers stockés sur un lecteur réseau mappé.

L'utilisation de cette fonctionnalité nécessite une connectivité réseau. Si vous voulez stocker vos
fichiers hors ligne, utilisez le client de bureau pour synchroniser tous les fichiers de votre
Nextcloud sur un ou plusieurs répertoires de votre disque dur local.
.. note:: Avant de mapper votre lecteur, vous devez autoriser l’utilisation de
  l'Authentification dans le registre Windows. La procédure est documentée dans
  KB841215_ et diffère entre Windows XP / Server 2003 et Windows Vista / 7.
  Veuillez suivre l’article de la base de connaissances avant de poursuivre et suivre les instructions
  Instructions Vista si vous exécutez Windows 7.

.. _KB841215: https://support.microsoft.com/kb/841215

Montage des lecteurs en ligne de commande
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

L'exemple suivant montre comment mapper un lecteur à l'aide de la ligne de commande. Pour monter
le lecteur:

1. Ouvrez l'invite de commande dans Windows.
2. Entrez la ligne suivante dans l'invite de commande pour mapper le lecteur Z sur l'ordinateur::

    net use Z: https://<drive_path>/remote.php/dav/files/USERNAME/ /user:"votre nom d'utilisateur"
    "votre mot de passe"

  Ou<drive_path> est l'URL de votre serveur Nextcloud.

Par exemple: ``net use Z: https://example.com/nextcloud/remote.php/dav/files/USERNAME/
/user:"votre nom d'utilisateur" "votre mot de passe"``

 L’ordinateur mappe les fichiers de votre compte Nextcloud sur la lettre de lecteur Z.

.. note:: Bien que cela ne soit pas recommandé, vous pouvez également monter le serveur Nextcloud
     en utilisant HTTP, en laissant la connexion non cryptée. Si vous envisagez d'utiliser HTTP
     connexions sur des appareils se situant dans un lieu public, nous vous recommandons vivement
     d'utiliser un Tunnel VPN pour assurer la sécurité nécessaire.

Une syntaxe de commande alternative::

  net use Z: \\example.com@ssl\nextcloud\remote.php\dav /user:"votre nom d'utilisateur" "votre mot de passe"

Monter des lecteurs avec Windows Explorer
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Pour monter un lecteur à l'aide de l'explorateur Microsoft Windows:

1. Cliquez sur votre ordinateur dans l'Explorateur Windows.
2. Cliquez avec le bouton droit sur l’entrée ** Ordinateur ** et sélectionnez ** Connecter un lecteur réseau ... ** à partir du
   menu déroulant.
3. Choisissez un lecteur de réseau local auquel vous souhaitez mapper Nextcloud.
4. Spécifiez l'adresse de votre instance Nextcloud, suivie de
   **/remote.php/dav/files/USERNAME/**

  Par exemple::

    https://example.com/nextcloud/remote.php/dav/files/USERNAME/

.. note:: Pour les serveurs protégés par SSL, cochez ** Se reconnecter lors de la connexion ** pour vous assurer que
     que le mappage est persistant lors des redémarrages ultérieurs. Si vous souhaitez vous
     connectez au serveur Nextcloud en tant qu'utilisateur différent, cochez ** Se connecter à l'aide d'informations d'identification différentes**.

.. figure:: ../images/explorer_webdav.png
   :scale: 80%
   :alt: capture d'écran d'un montagee WebDAV sur l'Explorateur Windows

5. Cliquez sur le bouton ``Terminer``.

  L'Explorateur Windows mappe le lecteur réseau, rendant ainsi votre instance Nextcloud
  disponible.

Accéder aux fichiers avec Cyberduck
-------------------------------

`Cyberduck <https://cyberduck.io/?l=fr>` _ est un serveur FTP et SFTP à code source ouvert,
WebDAV, OpenStack Swift et le navigateur Amazon S3 conçus pour les transferts de fichiers sur
MacOS et Windows.

.. note:: Cet exemple utilise Cyberduck version 4.2.1.

Pour utiliser Cyberduck:

1. Spécifiez un serveur sans aucune information de protocole avancée. Par exemple:

  ``example.com``

2. Spécifiez le port approprié. Le port que vous choisissez dépend de la prise en 
charge du protocôle SSL votre serveur Nextcloud . Cyberduck nécessite que vous sélectionniez un
type de connexion différent si vous envisagez d’utiliser SSL. Par exemple:

  80 (for WebDAV)

  443 (for WebDAV (HTTPS/SSL))

3. Utilisez le menu déroulant "Autres options" pour ajouter le reste de votre URL WebDAV dans
le champ 'Path'. Par exemple:

  ``remote.php/dav/files/USERNAME/``

Cyberduck permet maintenant l’accès aux fichiers du serveur Nextcloud.

Accès aux partages publics via WebDAV
-----------------------------------

Nextcloud offre la possibilité d'accéder aux partages publics via WebDAV.

Pour accéder au partage publique, ouvrez ::

  https://example.com/nextcloud/public.php/webdav

Dans un client WebDAV, utilisez le jeton de partage comme nom d'utilisateur et le mot de passe de partage (facultatif)
comme mot de passe.

.. note:: ``Paramètres → Administration → Partage → Autoriser les utilisateurs sur ce 
   serveur à envoyer des partages à d'autres serveurs`` doit être activé afin
   d'avoir accès à cette fonctionnalité.

Problèmes connus
--------------

Problème
^^^^^^^
Windows ne se connecte pas via HTTPS.

Solution 1
^^^^^^^^^^

Le client Windows WebDAV peut ne pas prendre en charge l’indication de nom de serveur (SNI) sur des
connexions cryptées. Si vous rencontrez une erreur lors du montage d’une instance Nextcloud crypté SSL
, contactez votre fournisseur pour l'attribution d'une adresse IP dédiée pour votre serveur basé sur SSL.

Solution 2
^^^^^^^^^^

Le client Windows WebDAV peut ne pas prendre en charge les connexions TSLv1.1 / TSLv1.2. Si
vous avez restreint la configuration de votre serveur pour ne fournir que TLSv1.1 et plus,
la connexion à votre serveur pourrait échouer. Veuillez vous référer à la documentation WinHTTP_
pour plus d'informations.

.. _WinHTTP: https://msdn.microsoft.com/en-us/library/windows/desktop/aa382925.aspx#WinHTTP_5.1_Features

Problème
^^^^^^^

Le message d'erreur suivant vous s'affiche: ** Erreur 0x800700DF: La taille du fichier
dépasse la limite autorisée et ne peut pas être sauvegardé. **

Solution
^^^^^^^^

Windows limite la taille maximale d'un fichier transféré depuis ou vers un partage WebDAV.
Vous pouvez augmenter la valeur **FileSizeLimitInBytes** dans
**HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\WebClient\\Parameters**
en cliquant sur **Modifier**.

Pour augmenter la limite jusqu'à la valeur maximale de 4 Go, sélectionnez**Decimal**,entrer une
valeur de**4294967295**, et redémarrez Windows ou redémarrez le **WebClient**
service.

Problème
^^^^^^^

L'accès à vos fichiers à partir de Microsoft Office via WebDAV échoue.

Solution
^^^^^^^^

Les problèmes connus et leurs solutions sont décrits dans l'article KB2123563_.

Problème
^^^^^^^
Impossible de mapper Nextcloud en tant que lecteur WebDAV sous Windows à l'aide d'un certificat auto-signé.

Solution
^^^^^^^^

  #. Accédez à votre instance Nextcloud via votre navigateur Web préféré.
  #. Cliquez jusqu'à ce que vous obteniez l'erreur de certificat dans la ligne d'état du navigateur.
  #. Affichez le certificat, puis sous l’onglet Détails, sélectionnez Copier dans un fichier.
  #. Enregistrez-le  sur le bureau avec un nom quelconque, par exemple ``myNextcloud.pem``.
  #. Démarrer, Exécuter, MMC.
  #. Fichier, Ajouter / Supprimer un composant logiciel enfichable.
  #. Sélectionnez Certificats, cliquez sur Ajouter, Mon compte utilisateur, puis sur Terminer, puis sur OK.
  #. Cochez pour faire confiance aux autorités de certification racines, aux certificats.
  #. Cliquez avec le bouton droit sur Certificat, sélectionnez toutes les tâches, importer.
  #. Sélectionnez le certificat sauvegarder sur le bureau.
  #. Sélectionnez Placer tous les certificats dans le magasin suivant, cliquez sur Parcourir,
  #. Cochez la case indiquant Afficher les magasins physiques, développez la racine de confiance
     Autorités de certification et sélectionnez Ordinateur local à cet endroit, cliquez sur OK,
     Terminez l'importation.
  #. Vérifiez la liste pour vous assurer que le certificat apparaît. Vous aurez probablement besoin d'actualiser
     avant de le voir. Quittez MMC.
  #. Ouvrez le navigateur, sélectionnez Outils, Supprimer l'historique de navigation.
  #. Sélectionnez tout sauf les données de filtrage privé, puis terminez.
  #. Allez dans Options Internet, onglet Contenu, Effacer l'état SSL.
  #. Fermez le navigateur, puis rouvrez et testez.

Problème
^^^^^^^

Vous ne pouvez pas télécharger plus de 50 Mo ou télécharger des fichiers volumineux lorsque le téléchargement prend
plus de 30 minutes avec Web Client sous Windows 7.

Solution
^^^^^^^^

Les solutions de contournement sont décrites dans l'article KB2668751_.


Accéder aux fichiers avec cURL
--------------------------

WebDAV étant une extension de HTTP, cURL peut être utilisé pour les opérations de script de fichier.

Pour créer un dossier avec la date actuelle comme nom:

.. code-block:: bash

	$ curl -u user:pass -X MKCOL "https://example.com/nextcloud/remote.php/dav/files/USERNAME/$(date '+%d-%b-%Y')"

Pour charger un fichier ``error.log`` dans ce répertoire:

.. code-block:: bash

	$ curl -u user:pass -T error.log "https://example.com/nextcloud/remote.php/dav/files/USERNAME/$(date '+%d-%b-%Y')/error.log"

Pour déplacer un fichier:

.. code-block:: bash

	$ curl -u user:pass -X MOVE --header 'Destination: https://example.com/nextcloud/remote.php/dav/files/USERNAME/target.jpg' https://example.com/nextcloud/remote.php/dav/files/USERNAME/source.jpg

Pour obtenir les propriétés des fichiers dans le dossier racine:

.. code-block:: bash

	$ curl -X PROPFIND -H "Depth: 1" -u user:pass https://example.com/nextcloud/remote.php/dav/files/USERNAME/ | xml_pp
	<?xml version="1.0" encoding="utf-8"?>
    <d:multistatus xmlns:d="DAV:" xmlns:oc="http://nextcloud.org/ns" xmlns:s="http://sabredav.org/ns">
      <d:response>
        <d:href>/nextcloud/remote.php/dav/files/USERNAME/</d:href>
        <d:propstat>
          <d:prop>
            <d:getlastmodified>Tue, 13 Oct 2015 17:07:45 GMT</d:getlastmodified>
            <d:resourcetype>
              <d:collection/>
            </d:resourcetype>
            <d:quota-used-bytes>163</d:quota-used-bytes>
            <d:quota-available-bytes>11802275840</d:quota-available-bytes>
            <d:getetag>"561d3a6139d05"</d:getetag>
          </d:prop>
          <d:status>HTTP/1.1 200 OK</d:status>
        </d:propstat>
      </d:response>
      <d:response>
        <d:href>/nextcloud/remote.php/dav/files/USERNAME/welcome.txt</d:href>
        <d:propstat>
          <d:prop>
            <d:getlastmodified>Tue, 13 Oct 2015 17:07:35 GMT</d:getlastmodified>
            <d:getcontentlength>163</d:getcontentlength>
            <d:resourcetype/>
            <d:getetag>"47465fae667b2d0fee154f5e17d1f0f1"</d:getetag>
            <d:getcontenttype>text/plain</d:getcontenttype>
          </d:prop>
          <d:status>HTTP/1.1 200 OK</d:status>
        </d:propstat>
      </d:response>
    </d:multistatus>


.. _KB2668751: https://support.microsoft.com/kb/2668751
.. _KB2123563: https://support.microsoft.com/kb/2123563
.. _WebDAV Navigator: http://seanashton.net/webdav/
.. _Android devices: https://play.google.com/store/apps/details?id=com.schimera.webdavnavlite
.. _iPhones: https://itunes.apple.com/app/webdav-navigator/id382551345
.. _BlackBerry devices: http://appworld.blackberry.com/webstore/content/46816
