��          �               <  :   =  �   x  b   :  �   �  /   V     �  �  �     .  [   5  ]  �  1   �  B   !  *   d  �   �  �   	  �   
  #  �
  �  �  A   �  �     k   �  �   U  M     #   i  �  �     �  c   �  �  �  C   �  T   �  5   <  �   r    �  �     M  �   But User3 will not have a copy of "sub" in their trash bin Deleted files are not counted against your storage quota. Only your personal files count against your quota, not files which were shared with you. (See :doc:`quota` to learn more about quotas.) Deleting files gets a little complicated when they are shared files, as this scenario illustrates: Find your deleted files by clicking on the **Deleted files** button on the Files page of the Nextcloud Web interface. You'll have options to either restore or permanently delete files. How the deleted files app manages storage space Managing deleted files Nextcloud checks the age of deleted files every time new files are added to the deleted files. By default, deleted files stay in the trash bin for 30 days. The Nextcloud server administrator can adjust this value in the ``config.php`` file by setting the ``trashbin_retention_obligation`` value. Files older than the ``trashbin_retention_obligation`` value will be deleted permanently. Additionally, Nextcloud calculates the maximum available space every time a new file is added. If the deleted files exceed the new maximum allowed space Nextcloud will permanently delete those trashed files with the soonest expiration until the space limit is met again. Quotas The folder "sub" will be moved to the trash bin of both User1 (owner) and User2 (recipient) To ensure that users do not run over their storage quotas, the Deleted Files app allocates a maximum of 50% of their currently available free space to deleted files. If your deleted files exceed this limit, Nextcloud deletes the oldest files (files with the oldest timestamps from when they were deleted) until it meets the memory usage limit again. User1 shares a folder "test" with User2 and User3 User2 (the recipient) deletes a file/folder "sub" inside of "test" What happens when shared files are deleted When User1 deletes "sub" then it is moved to User1's trash bin. It is deleted from User2 and User3, but not placed in their trash bins. When you delete a file in Nextcloud, it is not immediately deleted permanently, only moved into the trash bin. It is not permanently deleted until you manually delete it, or when the Deleted Files app deletes it to make room for new files. When you share files, other users may copy, rename, move, and share them with other people, just as they can for any computer files; Nextcloud does not have magic powers to prevent this. Your administrator may have configured the trash bin retention period to override the storage space management. See `admin documentation <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#deleted-items-trash-bin>`_ for more details. Project-Id-Version: Nextcloud latest User Manual latest
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2020-10-05 20:47+0000
PO-Revision-Date: 2019-11-07 20:29+0000
Last-Translator: Miguel Anxo Bouzada <mbouzada@gmail.com>, 2020
Language: gl
Language-Team: Galician (https://www.transifex.com/nextcloud/teams/64236/gl/)
Plural-Forms: nplurals=2; plural=(n != 1)
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.9.1
 Pero o Usuario3 non terá unha copia de «sub» no seu cesto lixo Os ficheiros eliminados non se contabilizan na súa cota de almacenamento. Só os seus ficheiros persoais contan para a súa cota, tampouco os ficheiros compartidos con vostede. (Vexa :doc:`quota` para saber máis sobre as cotas.) A eliminación de ficheiros complícase un pouco cando se comparten ficheiros, como ilustra este escenario: Atope os ficheiros eliminados premendo no botón **Ficheiros eliminados** da páxina Ficheiros da interface Web do Nextcloud. Terá opcións para restaurar ou eliminar definitivamente os ficheiros. Como xestiona o espazo de almacenamento a aplicación de ficheiros eliminados Xestionando os ficheiros eliminados Nextcloud comproba a antigüidade dos ficheiros eliminados cada vez que se engaden novos ficheiros aos eliminados. De xeito predeterminado, os ficheiros eliminados permanecen no lixo durante 30 días. O administrador do servidor do Nextcloud pode axustar este valor no ficheiro ``config.php`` configurando o valor ``trashbin_retention_obligation``. Os ficheiros máis antigos que o valor ``trashbin_retention_obligation`` eliminaranse permanentemente. Ademais, O Nextcloud calcula o espazo máximo dispoñíbel cada vez que se engade un novo ficheiro. Se os ficheiros eliminados superan o novo espazo máximo permitido Nextcloud eliminará permanentemente os ficheiros enviados ao lixo coa caducidade máis rápida ata que se cumpra de novo o límite de espazo. Cotas O cartafol «sub» moverase ao lixo tanto do Usuario1 (propietario) como do Usuario2 (destinatario) Para garantir que os usuarios non superen as súas cotas de almacenamento, a a aplicación Ficheiros eliminados asigna un máximo do 50% do seu espazo libre dispoñíbel actualmente aos ficheiros eliminados. Se os ficheiros eliminados exceden este límite, O Nextcloud elimina os ficheiros máis antigos (os ficheiros coas marcas de tempo máis antigas desde cando foron eliminados) ata que volva cumprir o límite de uso da memoria. O Usuario1 comparte un cartafol «proba» co Usuario2 e co Usuario3 O Usuario2 (o destinatario) elimina un ficheiro/cartafol «sub» dentro de «proba» Que ocorre cando se eliminan os ficheiros compartidos Cando o Usuario1 elimina «sub», móvese ao lixo do Usuario1. Elimínase do Usuario2 e do Usuario3, pero non se coloca nos cestos do lixo. Cando elimina un ficheiro no Nextcloud, non se elimina de forma permanente, só se move  ao cesto do lixo. Non se elimina definitivamente ata que a elimine manualmente ou cando a aplicación Ficheiros eliminados a elimina para deixar espazo aos novos ficheiros. Cando comparte ficheiros, outros usuarios poden copialos, cambiarlle o nome, movelos e compartilos con outras persoas, do mesmo xeito que poden facelo con calquera outro ficheiro do seu computador; Nextcloud non ten poderes máxicos para evitar isto. É posíbel que o seu administrador configurara o período de retención do lixo para anular a xestión do espazo de almacenamento. Consulte a `documentación do administrador <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#deleted-items-trash-bin>`_ para máis detalles. 