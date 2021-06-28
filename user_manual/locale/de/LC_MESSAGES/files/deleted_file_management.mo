��          �               <  :   =  �   x  b   :  �   �  /   V     �  �  �     .  [   5  ]  �  1   �  B   !  *   d  �   �  �   	  �   
  #  �
  �  �  K   �      y       �  =   �     �    �     �  w     �  �  ?   (  Z   h  8   �  �   �  ]  �  �     c  �   But User3 will not have a copy of "sub" in their trash bin Deleted files are not counted against your storage quota. Only your personal files count against your quota, not files which were shared with you. (See :doc:`quota` to learn more about quotas.) Deleting files gets a little complicated when they are shared files, as this scenario illustrates: Find your deleted files by clicking on the **Deleted files** button on the Files page of the Nextcloud Web interface. You'll have options to either restore or permanently delete files. How the deleted files app manages storage space Managing deleted files Nextcloud checks the age of deleted files every time new files are added to the deleted files. By default, deleted files stay in the trash bin for 30 days. The Nextcloud server administrator can adjust this value in the ``config.php`` file by setting the ``trashbin_retention_obligation`` value. Files older than the ``trashbin_retention_obligation`` value will be deleted permanently. Additionally, Nextcloud calculates the maximum available space every time a new file is added. If the deleted files exceed the new maximum allowed space Nextcloud will permanently delete those trashed files with the soonest expiration until the space limit is met again. Quotas The folder "sub" will be moved to the trash bin of both User1 (owner) and User2 (recipient) To ensure that users do not run over their storage quotas, the Deleted Files app allocates a maximum of 50% of their currently available free space to deleted files. If your deleted files exceed this limit, Nextcloud deletes the oldest files (files with the oldest timestamps from when they were deleted) until it meets the memory usage limit again. User1 shares a folder "test" with User2 and User3 User2 (the recipient) deletes a file/folder "sub" inside of "test" What happens when shared files are deleted When User1 deletes "sub" then it is moved to User1's trash bin. It is deleted from User2 and User3, but not placed in their trash bins. When you delete a file in Nextcloud, it is not immediately deleted permanently, only moved into the trash bin. It is not permanently deleted until you manually delete it, or when the Deleted Files app deletes it to make room for new files. When you share files, other users may copy, rename, move, and share them with other people, just as they can for any computer files; Nextcloud does not have magic powers to prevent this. Your administrator may have configured the trash bin retention period to override the storage space management. See `admin documentation <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#deleted-items-trash-bin>`_ for more details. Project-Id-Version: Nextcloud latest User Manual latest
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2021-01-15 16:50+0000
PO-Revision-Date: 2019-11-07 20:29+0000
Last-Translator: Mark Ziegler <mark.ziegler@rakekniven.de>, 2021
Language: de
Language-Team: German (https://www.transifex.com/nextcloud/teams/64236/de/)
Plural-Forms: nplurals=2; plural=(n != 1)
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.9.1
 Benutzer3 wird jedoch keine Kopie von "sub" in seinem Papierkorb vorfinden. Gelöschte Dateien belasten Ihr Speicherkontingent nicht, ebenso wenig wie mit Ihnen geteilte Dateien. Nur Ihre persönlichen Dateien verringern Ihr verfügbares Speicherkontingent. (Vergleichen Sie :doc:`quota` um mehr über Speicherkontingente zu erfahren.) Das Löschen von Dateien wird etwas kompliziert, wenn es sich um freigegebene Dateien handelt, wie dieses Szenario zeigt: Ihre gelöschten Dateien finden Sie, indem Sie in Nextclouds Webschnittstelle zur Seite "Dateien" navigieren und auf die Schaltfläche "Gelöschte Dateien" klicken. Dort finden Sie die Option, gelöschte Dateien wiederherzustellen oder permanent zu löschen. Speicherplatzverwaltung durch die App für gelöschte Dateien Gelöschte Dateien verwalten Nextcloud prüft das Alter der gelöschten Dateien jedes Mal, wenn neue Dateien zu den gelöschten Dateien hinzugefügt werden. Standardmäßig bleiben gelöschte Dateien 30 Tage lang im Papierkorb. Der Nextcloud-Server-Administrator kann diesen Wert in der Datei ``config.php`` anpassen, indem er den Wert ``trashbin_retention_obligation`` setzt. Dateien, die älter als der ``trashbin_retention_obligation`` Wert sind, werden permanent gelöscht. Zusätzlich berechnet Nextcloud jedes Mal, wenn eine neue Datei hinzugefügt wird, den maximal verfügbaren Speicherplatz. Wenn die gelöschten Dateien den neuen maximal erlaubten Speicherplatz überschreiten, wird Nextcloud die Dateien mit dem frühesten Ablaufdatum permanent löschen, bis das Speicherplatzlimit wieder erreicht ist. Speicherkontigente Der Ordner "sub" wird in den Papierkorb sowohl von Benutzer1 (Besitzer) als auch von Benutzer2 (Empfänger) verschoben. Um sicherzustellen, dass Benutzer ihre Speicherkontingente nicht überschreiten, weist die App "Gelöschte Dateien" maximal 50 % ihres aktuell verfügbaren freien Speichers für gelöschte Dateien zu. Wenn Ihre gelöschten Dateien dieses Limit überschreiten, löscht Nextcloud die ältesten Dateien (Dateien mit den ältesten Zeitstempeln vom Zeitpunkt des Löschens), bis es das Speicherbelegungslimit wieder erreicht. Benutzer1 teilt einen Ordner "test" mit Benutzer2 und Benutzer3 Benutzer2 (der Empfänger) löscht eine Datei / ein Verzeichnis "sub" innerhalb von "test" Was passiert, wenn freigegebene Dateien gelöscht werden Wenn Benutzer1 "sub" löscht, wird der Ordner in dessen Papierkorb verschoben. Für Benutzer2 und Benutzer3 wird er gelöscht, aber nicht in deren Papierkorb verschoben.  Wenn Sie in Nextcloud eine Datei löschen, wird diese nicht gleich endgültig gelöscht, sondern lediglich in den Papierkorb verschoben. Die Datei wird erst endgültig gelöscht, wenn Sie dies manuell tun oder die App "Deleted Files" so konfiguriert haben, dass gelöschte Dateien endgültig gelöscht werden, um Platz für neue Dateien zu schaffen. Wenn Sie Dateien freigeben, können andere Benutzer sie kopieren, umbenennen, verschieben und für andere Personen freigeben, genau so, wie alle  anderen Computerdateien. Nextcloud hat keine magischen Kräfte, um dies zu verhindern. Ihr Administrator hat möglicherweise die Aufbewahrungszeit des Papierkorbs so konfiguriert, dass sie die Speicherplatzverwaltung außer Kraft setzt. Weitere Einzelheiten finden Sie in der `Administrator-Dokumentation <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#deleted-items-trash-bin>`_. 