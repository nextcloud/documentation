========================================
Zugriff auf Nextcloud-Dateien mit WebDAV
========================================

Nextcloud hat volle Unterstützung für das WebDAV-Protokoll. Sie können eine
Verbindung zu Ihren Nextcloud-Dateien über WebDAV herstellen und diese
synchronisieren. In folgenden Kapitel erfahren Sie, wie Sie Linux, Mac OS X,
Windows und mobile Geräte über WebDAV zu Ihrem Nextcloud-Server verbinden.
Bevor mit der Konfiguration von WebDAV angefangen wird, wird ein kurzer Einblick
auf die empfohlene Art der Verbindung von Client-Geräten mit Ihren
Nextcloud-Servern gegeben.

Nextcloud Desktop und Mobile Clients
------------------------------------

Die empfohlene Methode, um Ihren Desktop-PC mit Ihrem Nextcloud-Server zu
synchronisieren, ist die Verwendung der `Nextcloud/ownCloud Sync-Clients
<https://nextcloud.com/install/#install-clients>`_. Sie können den Client so
konfigurieren, dass Dateien in einem beliebigen lokalen Ordner gespeichert
werden. Sie können auch auswählen, welche Ordner des Nextcloud-Servers
synchronisiert werden soll. Der Client zeigt den aktuellen Verbindungsstatus an
und protokolliert alle Aktivitäten, sodass Sie immer wissen, welche
entfernte Dateien auf Ihren PC heruntergeladen wurden. Sie können auch überprüfen,
ob die auf Ihrem lokalen PC erstellten und aktualisierten Dateien ordnungsgemäß
mit dem Server synchronisiert wurden. Die empfohlene Methode zur Synchronisation
Ihres Nextcloud-Servers mit Android- und Apple iOS-Geräten ist die Verwendung
der `mobilen Apps <https://nextcloud.com/install/>`_.

Für die Verbindung zu einem Netxtcloud-Server mit Mobile-Apps, wird folgende
URL inklusive dem Ordnernamen benötigt::

    example.com/nextcloud

Neben den von Nextcloud oder ownCloud bereitgestellten mobilen Apps
können Sie mit WebDAV auch andere Apps nutzen, um sich mit
Ihrem Nextcloud-Server zu verbinden. `WebDAV Navigator`_ ist eine gute
(proprietäre) App für `Android Geräte`_ und `iPhones`_.

Die zu verwendende Adresse lautet::

    example.com/nextcloud/remote.php/dav/files/USERNAME/

WebDAV-Konfiguration
--------------------

Über das WebDAV-Protokoll können Sie Ihren Desktop-PC mit Ihrem Nextcloud-Server
verbinden. Anstatt eine spezielle Client-Anwendung, kann das WebDAV-Protokoll
verwendet werden. Web Distributed Authoring and Versioning (WebDAV) ist eine
Hypertext Transfer Protocol (HTTP) Erweiterung, die es einfach macht, Dateien
auf Webservern zu erstellen, zu lesen und zu bearbeiten. Mit WebDAV haben Sie
eine weitere Option auf Ihre Nextcloud-Freigaben zuzugreifen. Unter Linux,
Mac OS X und Windows funktioniert die Verbindung wie mit jeder entfernten
Netzwerkfreigabe.

.. note:: In den folgenden Beispielen müssen Sie **example.com/** an die URL
   Ihrer Nextcloud-Serverinstallation anpassen.

Dateizugriff unter Linux
------------------------

Sie können auf Nextcloud-Dateien in Linux-Betriebssystemen zugreifen, indem
Sie folgenden Optionen wählen.

Nautilus-Dateimanager
^^^^^^^^^^^^^^^^^^^^^

Benutzen Sie das ``davs://`` Protokoll, um Ihre Nextcloud-Freigaben mit dem
Nautilus-Dateimanager zu verbinden::

  davs://example.com/nextcloud/remote.php/dav/files/USERNAME/

.. note:: Nutzen Sie `dav://` anstelle `davs://` wenn Ihr Server HTTPS nicht
   unterstützt.

.. image:: ../images/webdav_gnome3_nautilus.png
   :alt: WebDAV-Konfiguration mit dem Nautilus-Dateimanager

Dateizugriff unter KDE mit dem Dolphin-Dateimanager
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Benutzen Sie das ``webdav://`` Protokoll um Ihre Nextcloud-Freigaben unter KDE
mit dem Dolphin-Dateimanager zu verbinden::

    webdav://example.com/nextcloud/remote.php/dav/files/USERNAME/

.. image:: ../images/webdav_dolphin.png
   :alt: WebDAV-Konfiguration mit dem Dolphin-Dateimanager

Sie können einen permanenten Link zu Ihrem Nextcloud-Server erstellen:

#. Öffnen Sie Dolphin und klicken Sie auf "Netzwerk" im linken Fensterbereich
   unter "Persönliche Ordner".
#. Klicken Sie auf das Symbol mit der Aufschrift **Netzwerkordner hinzufügen**.
#. Wenn WebDAV nicht ausgewählt ist, wählen Sie es aus.
#. Klicken Sie auf **Weiter**.
#. Geben Sie die folgenden Einstellungen ein:

   * Name: Der Name, den Sie im Bereich **Persönliche Ordner** als Lesezeichen
     sehen möchten, z.B. Nextcloud.
   * Benutzer: Der Nextcloud-Benutzername, mit dem Sie sich angemeldet haben,
     z.B. "admin".
   * Server: Der Nextcloud-Domain, z.B. **example.com** (ohne
     **http://** davor oder den weiterführenden Ordner).
   * Ordner -- Geben Sie diesen Pfad ein:
     ``nextcloud/remote.php/dav/files/USERNAME/``.
#. (Optional) Aktivieren Sie das Kontrollkästchen "Symbol für diesen
   Netzwerkordner anlegen", damit ein Lesezeichen in der Spalte "Persönliche
   Ordner" angelegt wird.
#. (Optional) Aktivieren Sie das Kontrollkästchen "Verschlüsselung verwenden",
   um HTTPS zu verwenden.

Erstellen von WebDAV-Verbindungen im Linux Terminal
---------------------------------------------------

Sie können WebDAV-Verbindungen über ein Linux Terminal erstellen. Dies ist
nützlich, wenn Sie auf Nextcloud genauso wie auf alle anderen entfernten
Dateisysteme zugreifen möchten. Im folgenden Beispiel wird gezeigt, wie Sie
eine Verbindung herstellen und diese bei jedem Systemneustart automatisch auf
Ihrem Linux-Computer eingebunden wird.

1. Installieren Sie zunächst für das WebDAV-Dateisystem den Treiber ``davfs2``.
   Dieser Treiber erlaubt Ihnen Verbindungen zu WebDAV-Freigaben herzustellen.
   Folgende Anweisung installiert den Treiber unter Debian/Ubuntu::

    apt-get install davfs2

2. Für CentOS, Fedora und openSUSE wird folgendes Kommando verwendet::

    yum install davfs2

3. Den Linuxbenutzer der WebDAV-Gruppe ``davfs2`` hinzufügen::

    usermod -aG davfs2 <username>

3. Im nächsten Schritt wird der Ordner ``nextcloud`` und ``.davfs2`` in
   Ihrem Benutzer-Verzeichis erstellt. Dieser Ordner wird in den weiteren
   Schritten mit Ihrer Nextcloud verbunden. Geben Sie zunächst Folgendes ein::

    mkdir ~/nextcloud
    mkdir ~/.davfs2

4. Kopieren Sie ``/etc/davfs2/secrets`` nach ``~/.davfs2``::

    cp /etc/davfs2/secrets ~/.davfs2/secrets

5. Setzen Sie den Dateieigentümer und den Lese-/Schreibzugriff auf folgende Datei::

    chown <username>:<username>  ~/.davfs2/secrets
    chmod 600 ~/.davfs2/secrets

6. Fügen Sie Ihre Nextcloud-Anmeldeinformationen an das Ende der ``secrets``
   Datei, mit Ihrer Nextcloud Server-Adresse, sowie Ihrem Nextcloud
   Benutzernamen und Passwort ein.

    example.com/nextcloud/remote.php/dav/files/USERNAME/ <username> <password>

7. Für die automatische Einbindung beim Systemstart muss Folgendes in
   ``/etc/fstab`` eingetragen werden::

    example.com/nextcloud/remote.php/dav/files/USERNAME/ /home/<username>/nextcloud
    davfs user,rw,auto 0 0

8. Wenn Nextcloud mit folgendem Befehl eingebunden wird, benötigen Sie keine
   Root-Rechte::

    mount ~/nextcloud

9. WebDAV-Verbindung mit Nextcloud ausbinden::

    umount ~/nextcloud

Bei jedem Neustart sollte Ihr Linux-System automatisch eine Verbindung zu Ihrem
Nextcloud-Server herstellen. Dabei wird über WebDAV der Nextcloud-Server in den
"nextcloud" Ordner auf Ihrem Linux-System eingebunden. Für eine manuelle
Einbindung genügt es, das Attribut in ``/etc/fstab`` von ``auto`` auf ``noauto``
zu setzen.

Bekannte Probleme
-----------------

Problem
^^^^^^^
Resource temporarily unavailable / Ressource vorübergehend nicht verfügbar

Lösung
^^^^^^
Wenn Sie Probleme beim Erstellen einer Datei im Ordner haben, bearbeiten
Sie ``/etc/davfs2/davfs2.conf`` und fügen Folgendes hinzu::

    use_locks 0

Problem
^^^^^^^
Zertifikatswarnung

Lösung
^^^^^^
Wenn Sie ein selbstsigniertes Zertifikat verwenden, erhalten Sie eine Warnung.
Um dies zu ändern, müssen Sie ``davfs2`` konfigurieren, damit das Zertifikat von
Ihrem System erkannt wird. Kopieren Sie zunächst ``mycertificate.pem`` nach
``/etc/davfs2/certs/``. Editieren Sie nun ``/etc/davfs2/davfs2.conf`` und
kommentieren die Zeile ``servercert`` aus und fügen den Dateipfad hinzu::

 servercert   /etc/davfs2/certs/mycertificate.pem

Dateizugriff unter Mac OS X
---------------------------

.. note:: Da der Mac OS X Finder `eine Reihe von Implementierungsproblemen
   <http://sabre.io/dav/clients/finder/>`_ besitzt, sollte dieser nur genutzt
   werden, wenn der Nextcloud-Server unter **Apache** mit **mod_php**, oder
   **Nginx 1.3.8+** läuft.

Zugriff auf Dateien über den Mac OS X Finder:

1. Wählen Sie **Gehe zu > Mit Server verbinden**.

  Das Fenster "Mit Server verbinden" öffnet sich.

2. Geben Sie nun die **Serveradresse** ein.

  .. image:: ../images/osx_webdav1.png
     :alt: Eingabe der Serveradresse im Mac OS X Finder

  Beispiel: Die URL, die für die Verbindung zum Nextcloud-Server vom Mac OS X
  Finder verwendet wird, ist::

    https://example.com/nextcloud/remote.php/dav/files/USERNAME/

  .. image:: ../images/osx_webdav2.png

3. Drücken Sie nun auf **Verbinden**.

  Ihr Mac stellt nun eine Verbindung zum Nextcloud-Server her.

Weitere Informationen zum Herstellen einer Verbindung unter Mac OS X zu einem
externen Server finden Sie in der `Dokumentation des Herstellers
<http://docs.info.apple.com/article.html?path=Mac/10.6/en/8160.html>`_ .

Dateizugriff unter Microsoft Windows
------------------------------------

Wenn Sie die native Windows-Implementierung verwenden, können Sie
Nextcloud einem neuen Laufwerk zuordnen. Die Zuordnung zu einem Laufwerk
ermöglicht es Ihnen Dateien, die auf einem Nextcloud-Server gespeichert sind,
genau wie gewöhnliche Speichermedien zu verwenden.

Die Verwendung dieser Funktion erfordert eine Netzwerkverbindung. Wenn Sie Ihre
Dateien lokal speichern möchten, verwenden Sie den Desktop Client. Der Desktop
Client synchronisiert ein oder mehrere Ordner Ihrer Nextcloud auf die
lokale Festplatte.

.. note:: Vor dem Verbinden des Laufwerks müssen Sie die Verwendung der
   Standardauthentifizierung in der Windows-Registry zulassen. Das Verfahren
   ist in KB841215_ dokumentiert und unterscheidet sich zwischen
   Windows XP/Server 2003 und Windows Vista/7. Bitte folgen Sie dem Knowledge
   Base Artikel, bevor Sie fortfahren und befolgen Sie die Anweisungen von
   Vista, wenn Sie Windows 7 nutzen.

.. _KB841215: http://support.microsoft.com/kb/841215

Zuordnen von Laufwerken mit der Kommandozeile
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Das folgende Beispiel zeigt, wie Sie ein Laufwerk mithilfe der Kommandozeile
einbinden:

1. Öffnen Sie die Kommandozeile in Windows.
2. Um dem Computer ein "Z"-Laufwerk zuzuordnen, geben Sie die folgende Zeile in
   der Kommandozeile ein.::

    net use Z: https://<domain>/remote.php/dav/files/USERNAME/ /user:youruser
    yourpassword

  Der Platzhalter <domain> ist die URL zu Ihrem Nextcloud-Server.

Ein Beispiel: ``net use Z: https://example.com/nextcloud/remote.php/dav/files/USERNAME/
/user:youruser yourpassword``

  Der Computer ordnet die Dateien Ihres Nextcloud-Servers dem Laufwerkbuchstaben
  "Z" zu.

.. note:: Obwohl nicht empfohlen, können Sie auch den Nextcloud-Server mit HTTP
   einbinden – wodurch die Verbindung unverschlüsselt bleibt. Wenn Sie
   HTTP-Verbindungen auf Geräten verwenden möchten, benötigen Sie
   Sicherheitsvorkehrungen. Daher empfehlen wir dringend an öffentlichen
   Internetanbindungen, einen VPN-Tunnel zu verwenden.

Alternativ können Sie Folgendes in die Kommandozeile eingeben::

  net use Z: \\example.com@ssl\nextcloud\remote.php\dav /user:youruser
  yourpassword

Laufwerke mit dem Windows-Explorer einbinden
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

So ordnen Sie ein Laufwerk mithilfe des Microsoft Windows-Explorer zu:

1. Öffnen Sie den Windows-Explorer und wechseln Sie im oberen Dateiregister
   zu **Computer**.
2. Klicken Sie auf **Netzlaufwerk verbinden**. Es öffnet sich nun ein Fenster.
3. Wählen Sie einen Laufwerkbuchstaben aus, dem Sie Nextcloud zuordnen möchten.
4. Geben Sie die Adresse Ihres Nextcloud-Server an, gefolgt von
   **/remote.php/dav/files/USERNAME/**.

  Zum Beispiel::

    https://example.com/nextcloud/remote.php/dav/files/USERNAME/

.. note:: Bei SSL-geschützten Servern überprüfen Sie die Option **Verbindung bei
   Anmeldung wiederherstellen**, um sicherzustellen, dass das Mapping nach
   Systemneustarts weiterhin besteht. Wenn Sie eine Verbindung zum
   Nextcloud-Server mit anderen Benutzerdaten herstellen möchten, aktivieren
   Sie die Option **Verbindung mit anderen Anmeldeinformationen herstellen**.

.. figure:: ../images/explorer_webdav.png
   :scale: 80%
   :alt: WebDAV mit Windows-Explorer einbinden

5. Klicken Sie nun auf ``Fertig stellen``.

  Der Windows-Explorer fügt nun Ihren Nextcloud-Server als Netzlaufwerk hinzu.

Dateizugriff mit Cyberduck
--------------------------

`Cyberduck <https://cyberduck.io/?l=de>`_ ist ein quelloffenes (S)FTP, WebDAV,
OpenStack Swift und Amazon S3 Dateibrowser, um Dateien zwischen Mac OS X und
Windows auszutauschen.

.. note:: Dieses Beispiel nutzt Cyberduck in Version 4.2.1.

Um Cyberduck zu nutzen ist Folgendes einzustellen:

1. Geben Sie einen Server ohne führende Protokollinformationen an. Zum Beispiel:

  ``example.com``

2. Geben Sie den entsprechenden Port an. Der von Ihnen gewählte Port hängt davon
   ab, ob Ihr Nextcloud-Server SSL unterstützt oder nicht. Cyberduck erfordert,
   dass Sie einen anderen Verbindungstyp wählen, wenn Sie SSL verwenden möchten.
   Zum Beispiel:

  80 (für WebDAV)

  443 (für WebDAV über HTTPS)

3. Verwenden Sie im Dropdown-Menü 'Erweiterte Optionen', um den Rest Ihrer
   WebDAV-URL in das Feld 'Pfad' einzufügen. Zum Beispiel:

  ``remote.php/dav/files/USERNAME/``

Jetzt ermöglicht Cyberduck den Dateizugriff auf Ihren Nextcloud-Server.

Zugang zu öffentlichen Freigaben über WebDAV
--------------------------------------------

Nextcloud bietet die Möglichkeit, auf öffentliche Freigaben über WebDAV
zuzugreifen.

Um geteilte Inhalte einzusehen, öffnen Sie::

  https://example.com/nextcloud/public.php/webdav

verwenden Sie das Freigabe-Token als Benutzername und optional das
Freigabekennwort als Kennwort.

Bekannte Probleme
-----------------

Problem
^^^^^^^
Windows verbindet sich nicht über HTTPS.

Lösung 1
^^^^^^^^

Der Windows WebDAV-Client unterstützt möglicherweise nicht die
Server Name Indication (SNI) bei HTTPS-Verbindungen. Wenn Sie einen Fehler beim
Installieren einer mit SSL/TLS verschlüsselten Nextcloud-Instanz feststellen,
wenden Sie sich an Ihren Server-Provider, um eine dedizierte IP-Adresse für
Ihren Server zu erhalten.

Lösung 2
^^^^^^^^

Der Windows-WebDAV-Client unterstützt möglicherweise keine TLSv1.1 / TLSv1.2
Verbindungen. Wenn Sie in Ihrem Server ausschließlich TLSv1.1 und höher
verwenden, schlägt die Verbindung möglicherweise fehl. Weitere Informationen
finden Sie in der WinHTTP_ Dokumentation.

.. _WinHTTP: https://msdn.microsoft.com/en-us/library/windows/desktop/aa382925.aspx#WinHTTP_5.1_Features

Problem
^^^^^^^

Sie erhalten folgende Fehlermeldung: **Error 0x800700DF: The file size
exceeds the limit allowed and cannot be saved.**

Lösung
^^^^^^

Windows beschränkt die maximale Größe einer Datei, die von einer WebDAV-Freigabe
übertragen werden kann. Sie können den Wert **FileSizeLimitInBytes** in
**HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\WebClient\\Parameters**
nach einem Klick auf **Modify** erhöhen.

Um den maximalen Wert auf 4GB zu erhöhen, wählen Sie **Decimal** und geben
folgenden Wert ein: **4294967295**. Um die Änderungen zu übernehmen, muss Windows
oder der Dienst **WebClient** neu gestart werden.

Problem
^^^^^^^

Der Zugriff auf Ihre Dateien aus Microsoft Office über WebDAV schlägt fehl.

Lösung
^^^^^^

Bekannte Probleme und deren Lösungen sind im Artikel KB2123563_ dokumentiert.

Problem
^^^^^^^

Nextcloud kann mit selbstsigniertem Zertifikat nicht als WebDAV-Laufwerk
in Windows eingebunden werden.

Lösung
^^^^^^

  #. Öffnen Sie die Nextcloud Web-Oberfläche über einen Web-Browser
  #. In der Statuszeile des Browsers wird ein Zertifikatsfehler angezeigt.
  #. Öffnen Sie das Zertifikat und wechseln auf der Registerkarte zu "Details".
     Kopieren oder exportieren Sie die Datei.
  #. Speichern Sie die Datei auf dem Desktop unter einem beliebigen Namen, z.B.
     ``myNextcloud.pem``.
  #. Drücken Sie die Windows-Taste und tippen **MMC** ein. Die Windows-Suche
     findet ein Programm namens "mmc.exe". Öffnen Sie die
     Microsoft-Management-Console.
  #. Gehen Sie nun auf "Datei" und dann auf "Snap-In hinzufügen/entfernen".
  #. Fügen Sie unter "verfügbare Snap-Ins" die Auswahl "Zertifikate" dem
     Konsolenstamm hinzu. Wählen Sie dazu "Eigenes Benutzerkonto" aus.
  #. Navigieren Sie auf der linken Seitenleiste über "Vertrauenswürdige
     Stammzertifizierungsstellen" zu "Zertifikate".
  #. Nach einem rechten Mausklick auf den Ordner Zertifikate, öffnet sich eine
     Auswahl. Klicken Sie über "Alle Aufgaben" auf "Importieren".
  #. Wählen Sie nun das zuvor gespeicherte Zertifikat von Ihrem Desktop aus.
  #. Nun wird der Punkt "Alle Zertifikate in folgendem Speicher speichern"
     gewählt und auf das Feld "Durchsuchen" gedrückt.
  #. In diesem Schritt wird zuerst auf "Physischen Speicher anzeigen" geklickt.
     Im oberen Feld wird zu "Vertrauenswürdige Stammzertifizierungsstellen"
     navigiert und "Lokaler Computer" ausgewählt. Mit einem Klick auf "Weiter"
     kann der Import "Fertig gestellt" werden.
  #. Nachdem die Liste aktualisiert wurde, sollte das Zertifikat in der Liste
     angezeigt werden.
  #. Öffnen Sie Ihren Browser und navigieren Sie zu den "Einstellungen" und
     bereinigen Sie die Browser Historie/Chronik.
  #. Wechseln Sie nun zu der Windows Systemeinstellung in "Internetoptionen".
     Im Reiter "Inhalt" drücken Sie auf "SSL-Status löschen".
  #. Abschließend öffnen Sie den Browser.

Problem
^^^^^^^

Der Upload mit dem Web-Client unter Windows 7 dauert länger als 30 Minuten,
oder Sie können nicht mehr als 50 MB herunterladen.

Lösung
^^^^^^

Bekannte Probleme und deren Lösungen sind im Artikel KB2668751_ dokumentiert.


Dateizugriff mit cURL
---------------------

Da WebDAV eine Erweiterung von HTTP cURL ist, können Scriptdateien verwendet
werden.

Erstellen Sie einen Ordner mit dem aktuellen Datum als Namen:

.. code-block:: bash

	$ curl -u user:pass -X MKCOL "https://example.com/nextcloud/remote.php/dav/files/USERNAME/$(date '+%d-%b-%Y')"

Laden Sie eine Datei ``error.log`` in einen Ordner hoch:

.. code-block:: bash

	$ curl -u user:pass -T error.log "https://example.com/nextcloud/remote.php/dav/files/USERNAME/$(date '+%d-%b-%Y')/error.log"

Verschieben Sie eine Datei:

.. code-block:: bash

	$ curl -u user:pass -X MOVE --header 'Destination: https://example.com/nextcloud/remote.php/dav/files/USERNAME/target.jpg' https://example.com/nextcloud/remote.php/dav/files/USERNAME/source.jpg

Erhalten Sie die Eigenschaften von Dateien im Stammordner:

.. code-block:: bash

	$ curl -X PROPFIND -H "Depth: 1" -u user:pass https://example.com/nextcloud/remote.php/dav/files/USERNAME/ | xml_pp
	<?xml version="1.0" encoding="utf-8"?>
    <d:multistatus xmlns:d="DAV:" xmlns:oc="http://nextcloud.org/ns" xmlns:s="http://sabredav.org/ns">
      <d:response>
        <d:href>/nextcloud/remote.php/dav/files/USERNAME/</d:href>
        <d:propstat>
          <d:prop>
            <d:getlastmodified>Tue, 13 Oct 2015 17:07:45 GMT</d:getlastmodified>
            <d:resourcetype>
              <d:collection/>
            </d:resourcetype>
            <d:quota-used-bytes>163</d:quota-used-bytes>
            <d:quota-available-bytes>11802275840</d:quota-available-bytes>
            <d:getetag>"561d3a6139d05"</d:getetag>
          </d:prop>
          <d:status>HTTP/1.1 200 OK</d:status>
        </d:propstat>
      </d:response>
      <d:response>
        <d:href>/nextcloud/remote.php/dav/files/USERNAME/welcome.txt</d:href>
        <d:propstat>
          <d:prop>
            <d:getlastmodified>Tue, 13 Oct 2015 17:07:35 GMT</d:getlastmodified>
            <d:getcontentlength>163</d:getcontentlength>
            <d:resourcetype/>
            <d:getetag>"47465fae667b2d0fee154f5e17d1f0f1"</d:getetag>
            <d:getcontenttype>text/plain</d:getcontenttype>
          </d:prop>
          <d:status>HTTP/1.1 200 OK</d:status>
        </d:propstat>
      </d:response>
    </d:multistatus>


.. _KB2668751: https://support.microsoft.com/kb/2668751
.. _KB2123563: https://support.microsoft.com/kb/2123563
.. _WebDAV Navigator: http://seanashton.net/webdav/
.. _Android Geräte: https://play.google.com/store/apps/details?id=com.schimera.webdavnavlite
.. _iPhones: https://itunes.apple.com/app/webdav-navigator/id382551345
.. _BlackBerry Geräte: http://appworld.blackberry.com/webstore/content/46816
