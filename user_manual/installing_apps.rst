# Installing Apps in ownCloud

ownCloud functionality can be enhanced by installing apps that run in the server instance and provide additional features such as a music player and server, single file encryption, an RSS aggregator and many more. An app repository can be found at apps.owncloud.com, where apps are listed, ranked, discussed and offered for download. A small subsection of these apps can be downloaded and installed directly from the Apps menu inside ownCloud. The majority of these apps however needs to be installed manually by downloading the zipped app from the app repository, uploading and unpacking it inside the ownCloud server instance. Provided app and ownCloud version are compatible, a refresh of the app section will then show this app in the list of installable apps in a column at the left of the ownCloud web interface.

# Security notice

Only apps listed as installable form within ownCloud have undergone extensive security checks. All other apps are installed at the users' own risk. Manually added apps are parsed by a code checker, apps found to request questionable permissions are blocked from being installed. At the moment, there is no user facing message about this - the app just does not appear in the list of available apps.

# Troubleshooting

If a manual app install fails, this could be due to the fact that

+you have downloaded a version incompatible with the ownCloud version in use

+the app has been rejected by the internal app code checker

+there is a genuine bug in the app that prevents it from running. 

Please refer to the comment section in apps.owncloud.com to check if others have raised similar problems. Note that the score and download numbers of an app are a helpful, but not a sufficient measure of the quality and security of an app.
