========================
Hochladen großer Dateien
========================

Beim Hochladen von Dateien über den Web-Browser wird Nextcloud durch PHP- und
Apache-Konfigurationen begrenzt. Standardmäßig erlaubt PHP nur 2 Megabyte große
Dateien hochzuladen. Da diese standard-Größe sehr klein ist, können viele Ihrer
Daten nicht hochgeladen werden. Ihr Nextcloud-Server-Administrator muss daher
die maximale Größe für Dateien neu einstellen.

Nur der Server-Administrator ist berechtigt, Nextcloud-Variablen zu ändern. Wenn
größere Dateien hochgeladen werden sollen, als von der Standardeinstellung oder
der vom Administrator festgelegten Größe erlaubt wird:

* Wenden Sie sich an Ihren Administrator, um eine Erhöhung dieser Variablen
  anzufordern

* Lesen Sie den Abschnitt in der `Admin-Dokumentation <https://docs.nextcloud.org/server/11/admin_manual/configuration_files/big_file_upload_configuration.html>`_ , in dem beschrieben wird, wie die Größenbeschränkungen für die Dateigröße zu verwalten sind.

.. TODO ON RELEASE: Update version number above on release
