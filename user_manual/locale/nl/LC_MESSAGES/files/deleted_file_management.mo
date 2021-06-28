��          �               <  :   =  �   x  b   :  �   �  /   V     �  �  �     .  [   5  ]  �  1   �  B   !  *   d  �   �  �   	  �   
  #  �
  �  �  C   �  �   �  �   �  �   b  =   =      {  
  �     �  l   �  �    <   �  C     8   I  �   �  5  @  �   v  -  ^   But User3 will not have a copy of "sub" in their trash bin Deleted files are not counted against your storage quota. Only your personal files count against your quota, not files which were shared with you. (See :doc:`quota` to learn more about quotas.) Deleting files gets a little complicated when they are shared files, as this scenario illustrates: Find your deleted files by clicking on the **Deleted files** button on the Files page of the Nextcloud Web interface. You'll have options to either restore or permanently delete files. How the deleted files app manages storage space Managing deleted files Nextcloud checks the age of deleted files every time new files are added to the deleted files. By default, deleted files stay in the trash bin for 30 days. The Nextcloud server administrator can adjust this value in the ``config.php`` file by setting the ``trashbin_retention_obligation`` value. Files older than the ``trashbin_retention_obligation`` value will be deleted permanently. Additionally, Nextcloud calculates the maximum available space every time a new file is added. If the deleted files exceed the new maximum allowed space Nextcloud will permanently delete those trashed files with the soonest expiration until the space limit is met again. Quotas The folder "sub" will be moved to the trash bin of both User1 (owner) and User2 (recipient) To ensure that users do not run over their storage quotas, the Deleted Files app allocates a maximum of 50% of their currently available free space to deleted files. If your deleted files exceed this limit, Nextcloud deletes the oldest files (files with the oldest timestamps from when they were deleted) until it meets the memory usage limit again. User1 shares a folder "test" with User2 and User3 User2 (the recipient) deletes a file/folder "sub" inside of "test" What happens when shared files are deleted When User1 deletes "sub" then it is moved to User1's trash bin. It is deleted from User2 and User3, but not placed in their trash bins. When you delete a file in Nextcloud, it is not immediately deleted permanently, only moved into the trash bin. It is not permanently deleted until you manually delete it, or when the Deleted Files app deletes it to make room for new files. When you share files, other users may copy, rename, move, and share them with other people, just as they can for any computer files; Nextcloud does not have magic powers to prevent this. Your administrator may have configured the trash bin retention period to override the storage space management. See `admin documentation <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#deleted-items-trash-bin>`_ for more details. Project-Id-Version: Nextcloud latest User Manual latest
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2020-10-05 20:47+0000
PO-Revision-Date: 2019-11-07 20:29+0000
Last-Translator: Chris Raymaekers <cray146@gmail.com>, 2021
Language: nl
Language-Team: Dutch (https://www.transifex.com/nextcloud/teams/64236/nl/)
Plural-Forms: nplurals=2; plural=(n != 1)
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.9.1
 Maar Gebruiker3 zal geen kopie van "sub" in zijn prullenbak hebben. Verwijderde bestanden worden niet meegerekend in jouw opslagquota. Alleen jouw persoonlijke bestanden tellen mee voor je quota, niet de bestanden die met jou werden gedeeld. (Zie :doc:`quota` voor meer informatie over quota's). Het verwijderen van bestanden wordt een beetje gecompliceerd als het gaat om gedeelde bestanden, zoals dit scenario illustreert: Zoek je verwijderde bestanden door te klikken op de knop **Verwijderde bestanden** op de pagina Bestanden van de Nextcloud webinterface. Je hebt de mogelijkheid om bestanden terug te zetten of permanent te verwijderen. Hoe de app voor verwijderde bestanden de opslagruimte beheert Beheer van verwijderde bestanden Nextcloud controleert de leeftijd van de verwijderde bestanden telkens als er nieuwe bestanden worden toegevoegd aan de verwijderde bestanden. Standaard blijven verwijderde bestanden 30 dagen in de prullenbak. De Nextcloud serverbeheerder kan deze waarde aanpassen in het ``config.php`` bestand door de ``trashbin_retention_obligation`` waarde in te stellen. Bestanden die ouder zijn dan de ``trashbin_retention_obligation``` waarde worden permanent verwijderd. Bovendien berekent Nextcloud de maximaal beschikbare ruimte telkens wanneer een nieuw bestand wordt toegevoegd. Als de verwijderde bestanden de nieuwe maximaal toegestane ruimte overschrijden, zal Nextcloud de verwijderde bestanden met de kortste vervaldatum permanent verwijderen totdat de grens weer wordt bereikt. Quotas De map "sub" wordt verplaatst naar de prullenbak van zowel Gebruiker1 (eigenaar) als Gebruiker2 (ontvanger). Om ervoor te zorgen dat gebruikers hun opslagquota niet overschrijden, wijst de app voor verwijderde bestanden maximaal 50% van de momenteel beschikbare vrije ruimte toe aan verwijderde bestanden. Als jouw verwijderde bestanden deze limiet overschrijden, verwijdert Nextcloud de oudste bestanden (bestanden met de oudste tijdsaanduiding vanaf het moment dat ze werden verwijderd) totdat weer aan de gebruikslimiet wordt voldaan. Gebruiker1 deelt een map "test" met Gebruiker2 en Gebruiker3 Gebruiker2 (de ontvanger) verwijdert een map "sub" binnenin "test". Wat gebeurt er als gedeelde bestanden worden verwijderd? Wanneer Gebruiker1 "sub" verwijdert, wordt deze map verplaatst naar de vuilnisbak van Gebruiker1. De map wordt verwijderd bij Gebruiker2 en Gebruiker3, maar niet in de prullenbak geplaatst. Wanneer je een bestand in Nextcloud verwijdert, wordt het niet onmiddellijk permanent verwijderd, maar alleen naar de prullenbak verplaatst. Het wordt niet permanent verwijderd totdat je het handmatig verwijdert, of wanneer de app Verwijderde bestanden het verwijdert om ruimte te maken voor nieuwe bestanden. Wanneer je bestanden deelt, mogen andere gebruikers deze kopiëren, hernoemen, verplaatsen en delen met andere mensen, net zoals ze dat kunnen voor alle computerbestanden; Nextcloud heeft geen magische krachten om dit te voorkomen. Je beheerder kan de bewaartermijn van de prullenbak hebben geconfigureerd om het beheer van de opslagruimte te overrulen. Zie `admin documentatie <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#deleted-items-trash-bin>`_ voor meer details. 