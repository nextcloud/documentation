======================================
Synchronisation avec le calendrier Windows 10
======================================

1. Dans votre navigateur, accédez à l'application Calendrier Nextcloud. Sous "Paramètres et importation", copiez l'"Adresse CalDAV iOS/macOS" dans votre presse-papiers.

2. Lancez l'application Calendrier Windows 10. Ensuite, cliquez sur l'icône des paramètres (icone avec un engrenage) et sélectionnez "Gérer les comptes".

3. Cliquez sur "Ajouter un compte" et choisissez "iCloud".

4. Entrez un courriel, un nom d'utilisateur et un mot de passe. Aucune de ces informations n'a besoin d'être valide - elles seront toutes modifiées au cours des prochaines étapes.

5. Cliquez sur "Terminé". Un message devrait apparaître indiquant que les réglages ont été sauvegardés avec succès.

6. Dans le menu "Gérer les comptes", cliquez sur le compte iCloud créé lors des étapes précédentes et sélectionnez "Modifier les paramètres". Cliquez ensuite sur "Modifier les paramètres de synchronisation de la boîte aux lettres".

7. Faites défiler jusqu'en bas de la boîte de dialogue, sélectionnez "Paramètres avancés de la boîte aux lettres".  Collez l'URL de votre CalDAV dans le champ "Calendar server (CalDAV)".

8. Cliquez sur "Terminé". Entrez votre nom d'utilisateur et votre mot de passe Nextcloud dans les champs appropriés, et changez le nom de votre compte comme vous le souhaitez (par exemple "Nextcloud Calendar"). Cliquez sur "Enregistrer".



Après avoir suivi toutes ces étapes, votre calendrier Nextcloud devrait se synchroniser. Sinon, vérifiez votre nom d'utilisateur et votre mot de passe. Sinon, répétez ces étapes.

**REMARQUE : Vous ne pourrez pas synchroniser votre calendrier si l'authentification à deux facteurs est activée. Suivez les étapes ci-dessous pour obtenir un mot de passe d'application qui peut être utilisé avec l'application Calendar client:**

1. Connectez-vous à Nextcloud. Cliquez sur votre icône d'utilisateur, puis cliquez sur "Paramètres".

2. Cliquez sur "Sécurité", puis localisez un bouton intitulé "Générer mot de passe de l'application". A côté de ce bouton, entrez "Windows 10 Calendar app". Ensuite, cliquez sur le bouton et copiez et collez le mot de passe. Utilisez ce mot de passe au lieu de votre mot de passe Nextcloud pour l'étape 8.

Un merci spécial à cet utilisateur de Reddit pour sa contribution :
https://www.reddit.com/r/Nextcloud/comments/5rcypb/using_the_windows_10_calendar_application_with_with/
