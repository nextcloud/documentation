===========
Galerie-App
===========

Die "Bilder"-App wurde umgeschrieben, verbessert und wird nun die "Galerie"-App
genannt. Es werden nun mehrere Bildformate, sowie Sortierung, Zoom und Scrollen
unterstützt. Erweiterte Anpassungen können über eine einfache Textdatei
erstellt werden.

Auf Ihrer Nextcloud-Hauptseite befindet sich in der rechten oberen Ecke unter
dem Benutzernamen ein kleines Symbol, mit dem schnell zwischen der Galerie und der
Dateiansicht gewechselt werden kann. Die "Galerie"-App findet automatisch alle
Bilder in Ihren Nextcloud-Ordnern und erstellt eine Miniaturansicht inklusive
dem Ordnernamen. Klicken Sie auf die Ordner mit der Miniaturansicht, um die
Ordner mit den Inhalten zu öffnen. Mit den beiden Symbole an der linken oberen
Ecke, lässt sich der Inhalt alphabetisch oder nach Datum sortieren.

.. figure:: ../images/gallery-1.png
   :alt: Galerie und Miniaturansichten.

Öffnen Sie die "Dateien"-App und wählen Sie ein beliebiges Bild, um es im
Diashow-Modus anzusehen. Der Diashow-Modus hat folgenden Funktionen:
Tasten am linken und rechten Rand um zwischen den Bildern zu wechseln, eine
Diashow-Taste an der unteren rechten Ecke, sowie Tasten zum Löschen oder
Verlassen des Diashow-Modus in der oberen rechten Ecke.

.. figure:: ../images/gallery-2.png
   :alt: Galerie Diashow-Modus.

Benutzerdefinierte Konfiguration
--------------------------------

Ein Galerie-Album kann mit einer einfachen Textdatei namens **gallery.cnf**
angepasst werden. Die Konfigurations-Datei wird mit der Markup-Sprache `Yaml
<https://en.wikipedia.org/wiki/YAML>`_ erstellt. Es können mehrere
**gallery.cnf** erstellt werden. Eine im Stammordner die globale Funktionen
definiert und weitere jeweils in ihren Unterordner.

Eigenschaften
^^^^^^^^^^^^^

Die folgenden allgemeinen Funktionen sind derzeit implementiert:

* Native SVG-Unterstützung.
* Zugang zu externen Freigaben.

Die folgenden Album-Funktionen sind derzeit implementiert:

* Hinzufügen eines Links zu einer Datei mit einer Beschreibung.
* Die Eingabe einer einfachen Copyright-Erklärung direkt in der Konfigurationsdatei.
* Hinzufügen eines Links zu einer Datei, die eine Copyright-Erklärung enthält.
* Definieren der Sortierung und Reihenfolge.
* Definieren der Hintergrundfarbe.
* Definieren, ob Unteralben die Konfiguration übernehmen.

Die folgenden Diashow-Funktionen sind derzeit implementiert:

* Eine Taste, die den Hintergrund im Diashow-Modus auf schwarz oder weiß setzt.
  (für Bilder mit transparenten Hintergründen)

Konfiguration
^^^^^^^^^^^^^

Die Konfigurationsdatei muss **gallery.cnf** lauten, damit diese vom System
erkannt wird. Um die globale Funktionen zu aktivieren, platzieren Sie eine Datei
im Stammordner. Der Stammordner ist in der Web-Oberfläche durch das Haus-Symbol
dargestellt. Weitere Konfigurationsdateien können einzeln auf Unterordner verteilt
werden.

(Dies wird in ``data/<benutzer>/files/`` abgelegt.) Siehe :ref:`Beispiel unten
<supported_variables_label>` in dem Abschnitt **Globale Funktionen**.

.. note:: Damit die Änderungen übernommen werden, muss die Nextcloud-Seite
   neu geladen werden.


Format
^^^^^^

UTF-8, **ohne BOM**. Eine von der Nextcloud Web-Oberfläche erstellte Datei
funktioniert.

Grundgerüst
^^^^^^^^^^^

Sie sollten einen Kommentar in die Datei einfügen, um deren Nutzen kurz zu
erklären. Kommentare beginnen mit einem "#".

Der Abstand wird mit 2 Leerzeichen erstellt. **Verwenden Sie keine Tabulatoren.**

Ein Blick in die Dokumentation für die `YAML Formatierung
<http://symfony.com/doc/current/components/yaml/yaml_format.html>`_ hilft Fehler
zu beheben.

Ein Beispiel für die `gallery.cnf`::

  # Gallery configuration file
  # Created on 31 Jan 2016 by Nextcloud User
 features:
   external_shares: yes
   native_svg: yes
   background_colour_toggle: yes
 design:
   background: "#ff9f00"
   inherit: yes
 information:
   description: This is an **album description** which is only shown if there
   is no `description_link`
   description_link: readme.md
   copyright: Copyright 2003-2016 [interfaSys sàrl](http://www.interfasys.ch),
   Switzerland
   copyright_link: copyright.md
   inherit: yes
 sorting:
   type: date
   order: des
   inherit: yes

.. _supported_variables_label:

Unterstützte Variablen
^^^^^^^^^^^^^^^^^^^^^^

**Globale Funktionen**

Legen Sie diese in Ihrem Stammordner der Nextcloud ab.

* **external_shares**: Bei der Verwendung der **files_external**-App,
  können Sie den Wert in ihrer globalen-Konfigurationsdatei auf **yes**
  setzen, um Bilder aus externen Speichern zu laden.
* **native_svg**: Sollen SVG-Bilder im Web-Browser angezeigt werden, setzen Sie
  den Wert in ihrer globalen-Konfigurationsdatei auf **yes**. Dies kann ein
  Sicherheitsrisiko darstellen, wenn Sie Ihren SVG-Dateien nicht vollständig
  vertrauen können.
* **background_colour_toggle**: Möchten Sie den Hintergrund für transparente
  Bilder im Diashow-Modus mit einem Knopfdruck zwischen schwarz und weiß
  umschalten, setzen Sie den Wert in ihrer globalen-Konfigurationsdatei auf
  **yes**.

.. note:: Externe Freigaben sind 20-50 Mal langsamer als lokale Freigaben.
   Die Wartezeit kann sehr lange sein, bis schließlich alle Bilder aus externen
   Quellen angezeigt werden.

**Album-Konfiguration**

Jedes Album kann mit den folgenden Konfigurationsvariablen personalisiert werden.
Verwenden Sie den Parameter **inherit**, um Konfigurationen an Unteralben
weiterzugeben.

**Design**

* **background**: definiert die Farbe des Hintergrunds der Bilderwand in der
  "Galerie"-App, wobei die RGB-hexadezimale (**"#ffa033"**) Darstellung einer
  Farbe verwendet wird. Die Farbe wird vom System nicht erkannnt,
  wenn keine Anführungszeichen um den Wert gesetzt werden. Bei Verwendung
  dieser Funktion wird dringend empfohlen, das benutzerdefinierte Design mit
  einem CSS Ladeindikator zu erweitern. `Dieses Farbrad <http://paletton.com/>`_
  zeigt Ihnen die RGB-Werte für die gewünschte Farbe an.
* **inherit**: Auf **yes** setzen, wenn Unterordner diesen Teil der
  Konfiguration übernehmen sollen.

**Album-Darstellung**

* **description**: Ein mit Markdown formatierter String, der in der Info-Box
  angezeigt wird. Er kann sich über mehrere Zeilen mit den Yaml-Markern
  ausbreiten.
* **description_link**: Eine Markdown-Datei, die sich innerhalb des Albums
  befindet, die wiederum analysiert und in der Info-Box anstelle der
  normalen Beschreibung angezeigt wird.
* **copyright**: Eine mit Markdown formatierte Zeichenfolge. Links zu externen
  Ressourcen werden hierbei unterstützt.
* **copyright_link**: Jede Datei (z.B. copyright.html) wird aus einem Album
  automatisch heruntergeladen, wenn der Benutzer auf den Link klickt.
* **inherit**: Auf **yes** setzen, wenn Unterordner diesen Teil der
  Konfiguration übernehmen sollen.

Siehe `<http://www.markitdown.net/markdown>`_ für die Markdown-Syntax.

.. note:: Wenn Sie die **copyright_link** Variable nutzen, fügen Sie keine
   weiteren Links in "copyright" hinzu.

**Sortieren**

* **sorting**: **date** oder **name**. **date** funktioniert nur für Dateien.
* **sort_order**: **asc** oder **des** (aufsteigend / absteigend).
* **inherit**: Auf **yes** setzen, wenn Unterordner diesen Teil der
  Konfiguration übernehmen sollen.

Anmerkungen
-----------

* Wenn nur die Sortiervariable **type** gesetzt ist, wird die
  standard-Sortierreihenfolge verwendet.
* Wenn nur die Sortiervariable **order** gefunden wurde, wird die
  Sortierkonfiguration ignoriert und das Skript sucht nach einer gültigen
  Konfiguration in den höheren Ordnern.
* Um eine Funktion wie natives SVG in einer öffentlichen Freigabe zu aktivieren,
  müssen Sie in diesem Ordner eine Konfigurationsdatei erstellen, die diese
  Funktion enthält.
* Wenn Sie einen Ordner öffentlich freigeben, vergessen Sie nicht, alle Dateien,
  die Sie verknüpfen (z.B. description.md oder copyright.md) innerhalb des
  freigegebenen Ordners hinzuzufügen. Benutzer, die im übergeordneten Ordner
  gespeichert sind, haben ansonsten auf Dateien keinen Zugriff.
* Mit der Option einen ganzen Ordner als Archiv herunterzuladen, bietet es
  sich an, alle Dateien in einen freigegebenen Ordner zu bündeln. Dies ist
  komfortabler als eine separate Konfigurationsdatei anzulegen.

Beispiele
---------

**Einfaches Sortieren**

Gilt nur für den aktuellen Ordner::

 # Galerie-Konfigurationsdatei
   sorting:
   type: date
   order: asc

Kurze Beschreibung und Verweis auf das Copyright-Dokument, gilt für den
aktuellen Ordner und alle seine Unterordner. Die nächsten Zeilen zeigen die
Syntax, die Sie verwenden können, um eine Beschreibung über mehrere Zeilen
zu erweitern::

 # Galerie-Konfigurationsdatei
   information:
   description: | # La Maison Bleue, Winter '16
     This is our Winter 2016 collection shot in **Kyoto**
     Visit our [website](http://www.secretdesigner.ninja) for more information
   copyright: Copyright 2015 La Maison Bleue, France
   copyright_link: copyright_2015_lmb.html
   inherit: yes

**Bilder von externen Nextcloud-Instanzen laden**

.. note:: Funktionen können nur im Stammordner definiert werden.

Sie können Elemente der Standardkonfiguration zu derselben Konfigurationsdatei
hinzufügen::

 # Galerie-Konfigurationsdatei
   features:
   external_shares: yes

**Aktivieren von systemeigenem SVG**

.. note:: Spezielle Funktionen können nur im Stammordner definiert werden.

Sie können Elemente der Standardkonfiguration zu derselben Konfigurationsdatei
hinzufügen::

 # Galerie-Konfigurationsdatei
  features:
  native_svg: yes

Mögliche zukünftige Erweiterungen
---------------------------------

Verschiedene Sortierparameter für Alben.
