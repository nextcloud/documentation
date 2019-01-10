===============================
Utilisation de l'authentification à deux facteurs
===============================

L'authentification à deux facteurs (2FA) est un moyen de protéger votre compte Nextcloud contre les accès non autorisés. Cela fonctionne en exigeant deux "preuves" différentes de votre identité. Par exemple, un mot de passe et une clé physique. Généralement, le premier facteur est un mot de passe comme vous connaissez déjà et le second peut être un message texte que vous recevrez ou un code que vous générerez sur votre téléphone ou un autre appareil. Nextcloud prend en charge divers facteurs d'authentification et vous pouvez en ajouter davantage.

Une fois que votre administrateur a activé l'application d'authentification à deux facteurs, vous pouvez l'activer et la configurer dans: doc: `userpreferences`. Vous pouvez voir comment ci-dessous.

Configuration de l'authentification à deux facteurs
-------------------------------------

Dans vos paramètres personnels, recherchez le paramètre d'authentification du second facteur. Dans cet exemple, il s'agit de TOTP, un code temporel compatible avec Google Authenticator.

.. figure:: images/totp_enable.png
     :alt: TOTP configuration.


Vous verrez votre code TOTP secret et un code QR qui peut être scanné par l'application TOTP.
sur votre téléphone (ou un autre appareil). En fonction de l'application ou de l'outil, tapez le
code ou scannez le QR et votre appareil affichera un code de connexion qui changera
toutes les 30 secondes.

Codes de récupération en cas de perte de votre deuxième facteur
-----------------------------------------------

Vous devriez toujours générer des codes de sauvegarde pour 2FA. Si votre appareil à facteur 2 est
volé ou ne fonctionne pas, vous pourrez utiliser l’un de ces codes pour
déverrouiller votre compte. Il fonctionne efficacement comme un deuxième facteur de sauvegarde. Pour
récupérez les codes de sauvegarde, allez dans vos paramètres personnels et regardez sous Deuxième facteur
Paramètres d'authentification. Choisissez * Générer des codes de sauvegarde *.

.. figure:: images/2fa_backupcode_1.png
     :alt: Générateur de code de sauvegarde 2FA.

On vous présentera ensuite une liste de codes de sauvegarde à usage unique.
     
.. figure:: images/2fa_backupcode_2.png
     :alt: Codes de sauvegarde 2FA.

Vous devrez mettre ces codes dans un endroit sûr, quelque part où vous pouvez les retrouver. Ne pas
les mettre ensemble avec votre deuxième facteur comme votre téléphone portable, mais assurez-vous que
si vous en perdez un, vous avez toujours l'autre. Les garder à la maison est probablement
la meilleure chose à faire.

Se connecter avec une authentification à deux facteurs
-----------------------------------------

Une fois que vous vous êtes déconnecté et que vous devez vous reconnecter, vous verrez apparaître une demande de
de code TOTP dans votre navigateur. Si vous activez le facteur TOTP
et un autre, vous verrez un écran de sélection sur lequel vous pourrez choisir quelle
méthode à deux facteurs sera utilisée pour cette connexion. Sélectionnez TOTP.

.. figure:: images/totp_login_1.png
     :alt: Choisir une méthode d'authentification à deux facteurs.

Maintenant, entrez votre code:

.. figure:: images/totp_login_2.png
     :alt: Saisie du code TOTP à la connexion.

Si le code est correct, vous serez redirigé vers votre compte Nextcloud.

.. note:: Since the code is time-based, it’s important that your server’s and
  your smartphone’s clock are almost in sync. A time drift of a few seconds
  won’t be a problem.

Utilisation d'applications client avec une authentification à deux facteurs
--------------------------------------------------------

Une fois que vous avez activé 2FA, vos clients ne pourront plus se connecter 
seulement avec leur mot de passe, à moins qu'ils ne prennent également en charge l'authentification à deux facteurs.
Pour résoudre ce problème, vous devez générer des mots de passe spécifiques à l'appareil. Voir
:doc:`session_management` pour plus d'informations sur comment faire cela.

