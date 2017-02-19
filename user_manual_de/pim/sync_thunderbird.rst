Thunderbird - Adressbuch synchronisieren
========================================

Adressbuch
-----------

Diese Anleitung beschreibt Schritt-für-Schritt, wie Sie Ihr Adressbuch über Thunderbird synchroniseren können.
Sie benötigen die folgende Software-Komponenten:

#. `Thunderbird <https://www.mozilla.org/de/thunderbird/>`_
#. `SOGo Connector <https://sogo.nu/download.html#/frontends>`_
#. `Lightning <https://addons.mozilla.org/de/thunderbird/addon/lightning/>`_ (ein Thunderbird Kalender-Add-On)

Es wird im Folgenden davon ausgegangen, dass diese drei Software-Komponenten installiert wurden.

#. Öffnen Sie das Thunderbird Adressbuch. Dieses ist im "Extras"-Menü zu finden.

   -  Klicken Sie auf "Datei > Neu > **Entferntes Adressbuch**" (dieser Eintrag würde von SOGo hinzugefügt) # TODO(leon): Check.
   -  Im "**Name**"-Feld tragen Sie den Namen des neuen Adressbuches ein
   -  Im "**URL**"-Feld tragen Sie die URL ein, die Ihnen in der Nextcloud "Kontakte"-App nach Klick auf das Zahnrad-Symbol angezeigt wird. Dieses Symbol ist im unteren linken Bereich der "Kontakte"-App zu finden.
   - Wenn Sie die Adressen nur in eine Richtigung (von der Nextcloud zu Thunderbird, nicht aber andersherum) synchronisieren möchten, aktivieren Sie "Nur lesen" # TODO(leon): Nur lesen?
   - Bestätigen Sie mit "OK". # TODO(leon): Hinzufügen?

Das Verschieben eines Kontaktes kann ungewollte Folgen haben. Wenn Sie einen Kontakt beispielsweise via Drag & Drop
aus Ihrem Nextcloud-Adressbuch in das lokale Adressbuch verschieben, wird der Kontakt von Ihrer Nextcloud gelöscht
und ist dann nur noch lokal verfügbar. Sie können Ihre Kontakte als VCF-Datei mit der Nextcloud Web-Oberfläche oder
als LDIF per Thunderbird Adressbuch sichern.

Die Bilder Ihrer Kontakte werden ebenfalls synchronisiert!
