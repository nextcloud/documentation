==================
Versionsverwaltung
==================

Nextcloud hat ein einfaches Versionsverwaltung-System für Dateien. Versionierung
erstellt Backups, welche unter dem "Versions"-Reiter in der Detail-Sidebar zu
finden sind. Dieser Reiter enhält eine komplette Historie aller Änderungen an der
entsprechenden Datei und erlaubt es, jegliche alte Version wiederherzustellen.
Änderungen werden alle zwei Minuten unter data/[user]/versions abgelegt.

.. figure:: ../images/files_versioning.png

Um eine bestimmte Version einer Datei wiederherzustellen, klicken Sie den
Kreispfeil auf der linken Seite. Mit einem Klick auf den Zeitstempel kann die Datei
heruntergeladen werden.

Um Speicherplatz zu sparen, löscht die "Versionen"-App automatisch ältere Versionen nach diesen Regeln:

- In der ersten Sekunde wird einer Version erstellt
- Die ersten 10 Sekunden wird alle 2 Sekunden eine Version erstellt
- Die erste Minute wird alle 10 Sekunden eine Version erstellt
- Die erste Stunde wird jede Minute eine Version erstellt
- Die ersten 24 Stunden wird jede Stunde eine Version erstellt
- Die ersten 30 Tage wird jeden Tag eine Version erstellt
- Nach den ersten 30 Tagen wird jede Woche eine Version erstellt

Sobald eine neue Version erstellt wird, passen sich alle bisher erstellten Versionen
diesem Schema an.

Die "Versionen"-App benutzt nie mehr als 50% des für den Nutzer verfügbaren
Speicherplatzes. Wenn dieses Limit überschritten wird, werden die ältesten
Versionen gelöscht, sobald wieder mindestens 50% Speicher frei sind.
