==================
Speicherkontingent
==================

Ihr Nextcloud-Administrator kann individuell für jeden Nutzer den zur Verfügung
gestellten Speicherplatz anpassen. Unter "Persönlich" können Sie den Ihnen
zugeteilten und bisher genutzten Speicherplatz einsehen.

.. figure:: ../images/quota1.png

Es kann hilfreich sein zu verstehen, wie der verfügbare Speicherplatz berechnet wird.

Metadaten (Miniaturansichten, temporäre Daten, Caches, kryptografische Schlüssel)
belegen ungefähr 10% des Speichers, werden aber nicht vom Speicherkontingent eines
Nutzers abgezogen. Apps wie z.B. die "Kalender"- oder "Kontakte"-App speichern Daten
in der Nextcloud Datenbank. Diese Daten zählen ebenfalls nicht zum benutzten
Speicherplatz eines Nutzers.

Geteilte Dateien zählen zum Speicherkontingent des Nutzers, der diese Dateien geteilt
hat. Wenn das Hochladen in geteilten Ordner erlaubt wird, zählen alle neu
hochgeladenen und editierten Dateien ebenfalls zum Speicherkontingent des Nutzers,
der diesen Ordner geteilt hat.

Verschlüsselte Dateien sind etwas größer als unverschlüsselte Dateien; es wird
lediglich die Größe der unverschlüsselten Originaldatei mit dem Speicherkontingent
verrechnet.

Gelöschte Dateien, die sich noch im Papierkorb befinden, zählen nicht zum genutzten
Speicherplatz. Die Größe des Papierkorbs ist auf 50% des Speicherkontingent eines
Nutzers festgelegt. Dateien werden nach 30 Tagen aus dem Papierkorb gelöscht.
Wenn die maximale Größe des Papierkorbs überschritten wird, werden nach und nach
die ältesten Dateien von dort gelöscht.

Alle mit der Versionsverwaltung erstellten Versionen einer Datei werden nicht
zum Speicherkontingent dazugezählt.
