===========================
Gelöschte Dateien verwalten
===========================

Wenn eine Datei in Nextcloud gelöscht wird, wird diese vorerst in den Papierkorb
verschoben. Dieser muss entweder manuell von Ihnen geleert werden, oder wird
automatisch von der "Gelöschte Dateien"-App verwaltet.

Um Dateien aus dem Papierkorb wiederherzustellen oder permanent zu löschen, klicken
Sie auf "Gelöschte Dateien" in der linken Seitenleiste der "Dateien"-App.

Speicherkontingent
------------------

Gelöschte Dateien, die sich noch im Papierkorb befinden, zählen nicht zum genutzten
Speicherplatz. Unter :doc:`quota` finden Sie nähere Informationen zum Speicherkontigent.

Was passiert, wenn geteilte Dateien gelöscht werden
---------------------------------------------------

Es wird etwas komplizierter, wenn geteilte Dateien gelöscht werden. Ein Beispiel:

1. Benutzer 1 teilt einen Ordner "test" mit Benutzer 2 und 3
2. Benutzer 2 (der Empfänger) löscht eine Datei / einen Ordner "hallo.txt" in "test"
3. Diese Datei wird nun in den Papierkorb von Benutzer 1 (Besitzer) und Benutzer 2 (Empfänger) verschoben
4. "hallo.txt" wird aber nicht in den Papierkorb von Benutzer 3 verschoben. Dieser hat keinerlei Zugriff mehr auf "hallo.txt"

Wenn Benutzer 1 (Besitzer) die Datei "hallo.txt" löscht, wird diese in seinen Papierkorb verschoben.
Benutzer 2 und 3 haben nun keinen Zugriff mehr auf diese Datei – nicht einmal über den Papierkorb.

Geteilte Dateien können von anderen Benutzern kopiert, umbenannt, verschoben und erneut mit anderen Personen
geteilt werden; Nextcloud kann dies nicht verhindern.

Wie die "Gelöschte Dateien"-App den Papierkorb verwaltet
--------------------------------------------------------

Um sicherzustellen, dass einem Benutzer nie der freie Speicherplatz ausgeht, löscht die
"Gelöschte Dateien"-App automatisch solange die ältesten Dateien aus dem Papierkorb, bis
wieder mindestens 50% des für den Benutzer verfügbaren Speicherkontingents frei ist.

Standardmäßig verbleiben Dateien 180 Tage im Papierkorb, bevor sie automatisch gelöscht
werden. Ihr Nextcloud-Administrator kann diesen Wert über ``trashbin_retention_obligation``
in ``config.php`` anpassen. Sobald eine neue Datei in den Papierkorb verschoben wird überprüft
Nextcloud, ob in diesem Dateien schon länger als ``trashbin_retention_obligation``-Tage liegen
und löscht diese dann gegebenenfalls.
Der verfügbare Speicherplatz wird neu berechnet, sobald eine Datei hinzugefügt wird.
