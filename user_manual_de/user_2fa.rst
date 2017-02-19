=======================================
Zwei-Faktor-Authentifizierung verwenden
=======================================

Die Zwei-Faktor-Authentifizierung ("2FA") hilft Ihnen, Ihren Nextcloud-Account
gegen unbefugten Zugriff besser zu schützen. Dies funktioniert wie folgt:
Es werden zum Anmelden zwei verschiedene Identitätsnachweise ("Faktoren")
benötigt; z.B. etwas, das Sie *wissen* (wie ein Passwort) und etwas, das Sie
*haben* (etwa einen Hardware-Token). Der erste Faktor ist für gewöhnlich Ihr
Passwort. Der zweite Faktor kann z.B. eine Textnachricht sein, die Sie auf
Ihr Handy erhalten. So müsste ein Angreifer neben Ihrem Passwort auch noch
Zugriff auf Ihr Handy haben. Nextcloud unterstützt von Haus aus bereits
einige Zweitfaktoren. Weitere können einfach hinzugefügt werden.

Sobald die "Zwei-Faktor-Authentifizierung"-App von Ihrem Nextcloud-Administrator
aktiviert wurde, können Sie diesen in Ihren persönlichen Einstellungen aktivieren
und konfigurieren: :doc:`userpreferences`

Konfiguration der Zwei-Faktor-Authentifizierung
===============================================

Suchen Sie in Ihren persönlichen Einstellungen nach der "Zwei-Faktor-Authentifizierung".
In diesem Beispiel hier wird "TOTP", eine mit dem Google Authenticator kompatible
Zwei-Faktor-Authentifizierung verwendet.

.. figure:: images/totp_enable.png
     :alt: TOTP-Konfiguration.

Sobald aktiviert, wird Ihnen ein "TOTP-Schlüssel" und QR-Code angezeigt. Den QR-Code
können Sie mit einer TOTP-App auf Ihrem Smartphone oder anderen Gerät scannen.
Alternativ können Sie auch den "TOTP-Schlüssel" eingeben. Ihr Gerät wird nun einen
Authentifizierungscode anzeigen. Dieser wird sich alle 30 Sekunden ändern.

Backup-Codes erstellen
======================
Für den Fall, dass Sie Zugriff auf den Zweitfaktor verlieren, sollten Sie immer auch
einen / mehrere Backup-Code/s erstellen. Diesen können anstelle des zweiten Faktors
verwendet werden, z.B. wenn Ihr Smartphone mit der TOTP-App gestohlen wird. Diese
Backup-Codes können in Ihren persönlichen Einstellungen mit Klick auf *Backup-Codes erstellen*
generiert werden.

.. figure:: images/2fa_backupcode_1.png
     :alt: 2FA Backup-Codes erstellen

Es wird Ihnen nun eine Liste an Backup-Codes angezeigt. Jeder dieser Codes ist nur
ein mal gültig.

.. figure:: images/2fa_backupcode_2.png
     :alt: 2FA Backup-Codes

Diese Backup-Codes sollten an einem sicheren Ort (z.B. Zuhause) aufbewahrt werden. Sie
sollten nicht auf dem Gerät gespeichert werden, auf welchem Ihre TOTP-App installiert ist.
Wenn dieses Gerät verloren geht, wären auch Ihre Backup-Codes nicht mehr erreichbar.

Anmelden mithilfe der Zwei-Faktor-Authentifizierung
===================================================
Nachdem Sie die Zwei-Faktor-Authentifizierung aktiviert und sich von Nextcloud abgemeldet
haben, werden Sie nach Eingabe Ihres Benutzernamen und Passworts auch nach einem
TOTP-Schlüssel gefragt. Lassen Sie diesen von Ihrer TOTP-App generieren.

.. figure:: images/totp_login_2.png
     :alt: TOTP-Schlüssel.

Wenn der TOTP-Schlüssel gültig ist, werden Sie wie gewohnt zu Ihrem Nextcloud-Account weitergeleitet.

.. note:: Da TOTP ein zeitbasierendes System ist, ist es wichtig, dass sowohl die Uhr Ihres
   Nextcloud-Servers als auch die Uhr Ihres Smartphones nahezu identisch sind. Eine Zeitverschiebung
   von wenigen Sekunden ist kein Problem.

Client-Applikationen mit der Zwei-Faktor-Authentifizierung verwenden
====================================================================
Sobald die Zwei-Faktor-Authentifizierung aktiviert ist, können sich Ihre Clients nicht mehr nur mit
einem Passwort anmelden. Falls Ihr Client eine Zwei-Faktor-Authentifizierung unterstützt, werden
Sie wie beim Anmelden über die Nextcloud Web-Oberfläche nach einem zusätzlichen TOTP-Schlüssel
gefragt. Unterstützt Ihr Client die Zwei-Faktor-Authentifizierung nicht, müssen Sie ein
"App-Passwort" für ihn generieren. Nähere Informationen dazu finden Sie unter :doc:`session_management`.
