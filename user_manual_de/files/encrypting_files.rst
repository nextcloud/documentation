======================================
Verschlüsseln Ihrer Daten in Nextcloud
======================================

Wurde in Nextcloud die integrierte Verschlüsselungs-App von Ihrem Administrator
aktiviert, werden all Ihre Daten automatisch verschlüsselt.
Die Verschlüsselung findet serverseitig statt und kann nicht deaktiviert werden,
wenn Ihr Administrator die Funktion aktiviert hat.
Die Verschlüsselung findet automatisch und transparent zu Ihnen statt. Als
Passwort für die Verschlüsselung wird Ihr Nextcloud Login-Passwort verwendet.
Sie können wie gewohnt Ihre Dateien verwalten und teilen und müssen sich auch
beim Ändern Ihres Passworts keine Sorgen machen.

Die Verschlüsselungs-Funktion ist vor allem dann praktisch, wenn Sie Ihre Nextcloud-Daten
bei externen Anbietern wie z.B. Dropbox oder Google Drive gespeichert haben.
Dateien können wie gewohnt über Nextcloud geteilt werden, allerdings können Sie
die Daten nicht direkt von diesen externen Anbietern (z.B. Dropbox oder Google Drive)
aus teilen, da diese nicht die nötigen Passwörter für die Entschlüsselung besitzen.
Die Passwörter liegen einzig und allein auf Ihrem Nextcloud-Server.

Falls Ihr Nextcloud-Server die Daten nicht bei externen Anbietern speichert, ist es
besser, eine andere Art von Verschlüsselung (z.B. eine Festplattenverschlüsselung)
zu wählen. Da die Passwörter für die Entschlüsselung auf Ihrem Nextcloud-Server
gespeichert sind, könnte Ihr Administrator theoretisch all Ihre Daten einsehen.
Auch andere Personen, die Zugriff auf Ihren Nextcloud-Server erlangen, könnten
Ihre Daten einsehen. Weitere Informationen dazu finden Sie in diesem Artikel:
`How Nextcloud uses encryption to protect your data <https://owncloud.org/blog/how-owncloud-uses-encryption-to-protect-your-data/>`_.

Häufig gestellte Fragen zur Verschlüsselung
-------------------------------------------

Wie kann die Verschlüsselung deaktiviert werden?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Um die Verschlüsselung zu deaktivieren müssen Sie das :ref:`"alles entschlüsseln"
<encryption_label>`-Skript ausführen, welches alle Daten wieder entschlüsselt und
die Verschlüsselung anschließend deaktiviert.

Kann die Verschlüsselung mithilfe des Wiederherstellungs-Schlüssels deaktiviert werden?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Ja, *falls* jeder Nutzer den :ref:`Datei-Wiederherstellungs-Schlüssel
<enable-file-recovery-key>` verwendet, können unter Verwendung des :ref:`"alles entschlüsseln"
<encryption_label>`-Skripts alle Daten wieder entschlüsselt werden.

Kann die Verschlüsselung ohne das Passwort eines Nutzers deaktiviert werden?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Sollte das Passwort eines Nutzers oder sein :ref:`Datei-Wiederherstellungs-Schlüssel
<enable-file-recovery-key>` unbekannt sein, können die Daten dieses Nutzers nicht
wieder entschlüsselt werden.
Eine Entschlüsselung unmittelbar nach dem Login wäre gefährlich, da die Entschlüsselung
sehr wahrscheinlich aufgrund einer Zeitüberschreitung abgebrochen werden würde.

Ist es geplant, eine Entschlüsselung nach dem Login zu unterstützen?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Das Passwort des Nutzers müsste dann in der Datenbank gespeichert werden.
Aus Sicherheitsgründen ist diese Funktion deshalb nicht geplant.

# TODO(leon): :(
Is Group Sharing Possible With The Recovery Key?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you mean adding users to groups and make it magically work? No. This only
works with the master key.

Verwenden der Verschlüsselung
-----------------------------

Die Verschlüsselung in Nextcloud ist einfach zu aktivieren und bedarf danach keiner weiteren
Wartung. Beim Aktivieren stehen Ihnen allerdings ein paar Konfigurations-Optionen bereit.

Sobald Ihr Nextcloud-Administrator die Verschlüsselung erstmalig aktiviert hat, müssen
Sie sich einmalig ab- und wieder anmelden, um die Passwörter für die Verschlüsselung zu
generieren und Ihre Daten zu verschlüsseln.
Wenn die Verschlüsselung aktiviert wurde, sehen Sie in der "Dateien"-App einen gelben
Hinweis, der Sie über dieses ab- und wieder anmelden informiert.

.. figure:: ../images/encryption1.png

Die erste Anmeldung kann einige Minuten benötigen, da erst all Ihre Daten verschlüsselt
werden müssen. Ist die Verschlüsselung abgeschlossen, werden Sie automatisch weitergeleitet.

.. figure:: ../images/encryption2.png

.. note:: Ein Verlust Ihres Nextcloud-Passworts ist gleichzusetzen mit dem
   Verlust Ihrer Daten. Deshalb kann ein optionaler Wiederherstellungs-Schlüssel
   von Ihrem Nextcloud-Administrator aktiviert werden; Mehr zu dieser Funktion
   finden Sie weiter unten.

Teilen verschlüsselter Dateien
------------------------------

Nur Nutzer, für die bereits ihre kryptografischen Schlüssel generiert wurden, haben
Zugriff auf geteilte verschlüsselte Daten. Nutzer, für die diese Schlüssel noch
nicht generiert wurden, haben keinen Zugriff auf geteilte verschlüsselte Daten;
Sie sehen lediglich den Namen der geteilten Datei, können diese aber weder öffnen
noch herunterladen. Diesen Nutzern wird folgende Nachricht angezeigt:
"Verschlüsselungs-App ist aktiviert, aber die Schlüssel sind noch nicht initialisiert.
Bitte logge Dich aus und wieder ein."

Geteilte Dateien müssen gegebenenfalls nach einer Verschlüsselung erneut geteilt werden.
Für individuell geteilte Daten reicht es aus, das Teilen dieser Daten zu deaktivieren
und anschließend wieder zu aktivieren.
Mit Gruppen geteilte Daten müssen mit jedem Nutzer erneut geteilt werden, der keinen
Zugriff auf diese Daten mehr hat. Dies aktualisiert die Verschlüsselung, wonach das
Teilen mit diesem Nutzer wieder deaktiviert werden kann.

Wiederherstellungs-Schlüssel
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Wenn Ihr Nextcloud-Administrator die Wiederstellungs-Schlüssel-Funktion aktiviert hat,
können Sie die Funktion für Ihren Account aktivieren. Wenn Sie "Password-Wiederherstellung"
aktiviert haben, kann Ihr Administrator Ihre Daten mit einem speziellen Passwort lesen.
Diese Funktion ermöglicht es Ihrem Administrator Ihre Daten wiederherzustellen, sollten
Sie Ihr Nextcloud-Passwort vergessen haben.
Eine Wiederherstellung Ihrer Daten ist ohne einen Wiederstellungs-Schlüssel nicht möglich.

.. figure:: ../images/encryption3.png

Dateien, die nicht verschlüsselt werden
---------------------------------------

Lediglich der Dateiinhalt wird verschlüsselt. Metadaten wie z.B. der Dateiname oder die
Ordner-Struktur wird nicht verschlüsselt. Weiterhin werden folgende Daten nie verschlüsselt:

- Alte Dateien im Papierkorb.
- Bild-Miniaturansichten der "Galerie"-App.
- Vorschauen der "Dateien"-App.
- Der Such-Index der Volltextsuche.
- Drittanbieter-App Daten.

Es kann weitere Daten geben, die nicht verschlüsselt werden; Daten, die bei externen
Speicheranbietern gesichert werden, sind auf jeden Fall verschlüsselt.

Ändern des Passworts
~~~~~~~~~~~~~~~~~~~~

Diese Option ist verfügbar, sollte Ihr Administrator Ihr Login-Passwort (aber nicht das
Passwort zum Verschlüsseln Ihrer Daten) geändert haben. Dies kann z.B. dann der Fall sein,
wenn Ihre Nextcloud-Instanz ein externes Nutzer-Management (beispielsweise LDAP) verwendet,
und Ihr Login-Passwort dort geändert hat. Sollte dies der Fall sein, können Sie
Ihr Verschlüsselungs-Passwort auf Ihr neues Login-Passwort setzen, indem Sie Ihr altes
und das neue Login-Passwort eingeben. Die Verschlüsselungs-App funktioniert nur dann,
wenn das Login- und Verschlüsselungs-Passwort identisch sind.
