��          �               <  :   =  �   x  b   :  �   �  /   V     �  �  �     .  [   5  ]  �  1   �  B   !  *   d  �   �  �   	  �   
  #  �
  Z  �  U   A  M  �  �   �  ;  �  z   �  8   d  �  �  
   J  �   U  �  �  z   �  q   ,  K   �  �   �  �  �  �  \  �      But User3 will not have a copy of "sub" in their trash bin Deleted files are not counted against your storage quota. Only your personal files count against your quota, not files which were shared with you. (See :doc:`quota` to learn more about quotas.) Deleting files gets a little complicated when they are shared files, as this scenario illustrates: Find your deleted files by clicking on the **Deleted files** button on the Files page of the Nextcloud Web interface. You'll have options to either restore or permanently delete files. How the deleted files app manages storage space Managing deleted files Nextcloud checks the age of deleted files every time new files are added to the deleted files. By default, deleted files stay in the trash bin for 30 days. The Nextcloud server administrator can adjust this value in the ``config.php`` file by setting the ``trashbin_retention_obligation`` value. Files older than the ``trashbin_retention_obligation`` value will be deleted permanently. Additionally, Nextcloud calculates the maximum available space every time a new file is added. If the deleted files exceed the new maximum allowed space Nextcloud will permanently delete those trashed files with the soonest expiration until the space limit is met again. Quotas The folder "sub" will be moved to the trash bin of both User1 (owner) and User2 (recipient) To ensure that users do not run over their storage quotas, the Deleted Files app allocates a maximum of 50% of their currently available free space to deleted files. If your deleted files exceed this limit, Nextcloud deletes the oldest files (files with the oldest timestamps from when they were deleted) until it meets the memory usage limit again. User1 shares a folder "test" with User2 and User3 User2 (the recipient) deletes a file/folder "sub" inside of "test" What happens when shared files are deleted When User1 deletes "sub" then it is moved to User1's trash bin. It is deleted from User2 and User3, but not placed in their trash bins. When you delete a file in Nextcloud, it is not immediately deleted permanently, only moved into the trash bin. It is not permanently deleted until you manually delete it, or when the Deleted Files app deletes it to make room for new files. When you share files, other users may copy, rename, move, and share them with other people, just as they can for any computer files; Nextcloud does not have magic powers to prevent this. Your administrator may have configured the trash bin retention period to override the storage space management. See `admin documentation <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#deleted-items-trash-bin>`_ for more details. Project-Id-Version: Nextcloud latest User Manual latest
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2020-10-05 20:47+0000
PO-Revision-Date: 2019-11-07 20:29+0000
Last-Translator: Andrey Atapin <atab@kirovedu.ru>, 2020
Language: ru
Language-Team: Russian (https://www.transifex.com/nextcloud/teams/64236/ru/)
Plural-Forms: nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3)
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.9.1
 Но User3 не будет иметь копию «sub» в своей корзине Удаленные файлы не учитываются в квоте хранилища. Только ваши личные файлы засчитываются в вашу квоту, а не файлы, которые были переданы вам. (См. :doc:`quota`, чтобы узнать больше о квотах.) Удаление файлов становится немного сложнее, когда они являются общими файлами, как показано в этом сценарии: Найдите удаленные файлы, нажав кнопку **Удаленные файлы** на странице Файлы веб-интерфейса Nextcloud. У вас будет возможность либо восстановить, либо окончательно удалить файлы. Как приложение удаленных файлов управляет пространством хранения Управление удаленными файлами Nextcloud проверяет возраст удаленных файлов при каждом добавлении новых файлов в удаленные файлы. По умолчанию удаленные файлы остаются в корзине 30 дней. Администратор сервера Nextcloud может изменить это значение в файле ``config.php``, установив значение ``trashbin_retention_obligation``. Файлы старше значения ``trashbin_retention_obligation`` будут удалены без возможности восстановления. Кроме того, Nextcloud рассчитывает максимальное доступное пространство каждый раз, когда добавляется новый файл. Если удаленные файлы превышают новый максимально допустимый объем, Nextcloud уменьшит срок хранения старых удаленных файлов, пока не будет достигнут предел максимально допустимого пространства. Квоты Папка "sub" будет перемещена в корзину как User1 (владелец) и User2 (получатель) Чтобы пользователи не выполняли свои квоты хранения, приложение «Удаленные файлы» выделяет не более 50% доступного в настоящее время свободного пространства для удаленных файлов. Если ваши удаленные файлы превышают этот предел, Nextcloud удаляет самые старые файлы (файлы с самыми старыми временными метками с момента их удаления) до тех пор, пока не будет снова достигнут предел использования памяти. Пользователь1 делит папку «тест» с Пользователем2 и Пользователем3 Пользователь2 (получатель) удаляет файл/папку «sub» внутри «test» Что происходит при удалении общих файлов Когда User1 удаляет «sub», он перемещается в корзину User1. Он удаляется из User2 и User3, но не помещается в их корзины. Когда вы удаляете файл в Nextcloud, он не удаляется сразу, он перемещается в корзину. Файл не удаляется окончательно, пока вы не удалите его вручную или когда приложение «Удаленные файлы» удалит его, чтобы освободить место для новых файлов. Когда вы делитесь файлами, другие пользователи могут копировать, переименовывать, перемещать и делиться ими с другими людьми, как они могут для любых компьютерных файлов; Nextcloud не имеет магических способностей, чтобы это предотвратить. Ваш администратор, возможно, настроил период хранения корзины для переопределения управления пространством хранения. См. `Документацию администратора <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#deleted-items-trash-bin>`_ для получения более подробной информации. 