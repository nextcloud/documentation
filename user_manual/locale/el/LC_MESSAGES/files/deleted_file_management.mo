��          �               <  :   =  �   x  b   :  �   �  /   V     �  e  �       Z   
  ]  e  1   �  B   �  *   8  �   c  �   �  �   �	  #  �
  �  �  �   �  �    �   �  b  �     �  <   f  �  �     @  �   W  �    d   �  �   T  ]   �  ?  C  �  �  �  s  +  !   But User3 will not have a copy of "sub" in their trash bin Deleted files are not counted against your storage quota. Only your personal files count against your quota, not files which were shared with you. (See :doc:`quota` to learn more about quotas.) Deleting files gets a little complicated when they are shared files, as this scenario illustrates: Find your deleted files by clicking on the **Deleted files** button on the Files page of the Nextcloud Web interface. You'll have options to either restore or permanently delete files. How the deleted files app manages storage space Managing deleted files Nextcloud checks the age of deleted files every time new files are added to the deleted files. By default, deleted files stay in the trash bin for 30 days. The Nextcloud server administrator can adjust this value in the ``config.php`` file by setting the ``trashbin_retention_obligation`` value. Files older than the ``trashbin_retention_obligation`` value will be deleted permanently. Additionally, Nextcloud calculates the maximum available space every time a new file is added. If the deleted files exceed the new maximum allowed space Nextcloud will expire old deleted files until the limit is met once again. Quotas The folder "sub" will be moved to the trashbin of both User1 (owner) and User2 (recipient) To ensure that users do not run over their storage quotas, the Deleted Files app allocates a maximum of 50% of their currently available free space to deleted files. If your deleted files exceed this limit, Nextcloud deletes the oldest files (files with the oldest timestamps from when they were deleted) until it meets the memory usage limit again. User1 shares a folder "test" with User2 and User3 User2 (the recipient) deletes a file/folder "sub" inside of "test" What happens when shared files are deleted When User1 deletes "sub" then it is moved to User1's trash bin. It is deleted from User2 and User3, but not placed in their trash bins. When you delete a file in Nextcloud, it is not immediately deleted permanently. Instead, it is moved into the trash bin. It is not permanently deleted until you manually delete it, or when the Deleted Files app deletes it to make room for new files. When you share files, other users may copy, rename, move, and share them with other people, just as they can for any computer files; Nextcloud does not have magic powers to prevent this. Your administrator may have configured the trash bin retention period to override the storage space management. See `admin documentation <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#deleted-items-trash-bin>`_ for more details. Project-Id-Version: Nextcloud latest User Manual latest
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2020-07-28 07:41+0000
PO-Revision-Date: 2019-11-07 20:29+0000
Last-Translator: mafiasx <749bdf2f@opayq.com>, 2020
Language: el
Language-Team: Greek (https://www.transifex.com/nextcloud/teams/64236/el/)
Plural-Forms: nplurals=2; plural=(n != 1)
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.9.1
 Αλλά ο Χρήστης3 δεν θα έχει αντίγραφο του "υπο" στον κάδο απορριμμάτων του Τα διαγραμμένα αρχεία δεν καταλογίζονται στο όριο αποθήκευσης. Μόνο τα προσωπικά σας αρχεία υπολογίζονται στο όριο σας και όχι σε αρχεία που κοινοποιήθηκαν σε εσάς. (Δείτε: doc: «quota» για να μάθετε περισσότερα σχετικά με τις ποσοστώσεις.) Η διαγραφή αρχείων γίνεται λίγο περίπλοκη όταν είναι κοινόχρηστα αρχεία, καθώς αυτό το σενάριο δείχνει: Βρείτε τα διαγραμμένα αρχεία σας κάνοντας κλικ στο κουμπί ** Διαγραμμένα αρχεία ** στη σελίδα Αρχεία της διεπαφής Nextcloud Web. Θα έχετε επιλογές είτε για επαναφορά είτε για οριστική διαγραφή αρχείων. Πώς διαχειρίζεται η εφαρμογή διαγραμμένα αρχεία αποθηκευτικού χώρου Διαχείριση διαγραμμένων αρχείων Το Nextcloud ελέγχει την ηλικία των διαγραμμένων αρχείων κάθε φορά που προστίθενται νέα αρχεία στα διαγραμμένα αρχεία. Από προεπιλογή, τα διαγραμμένα αρχεία παραμένουν στον κάδο απορριμμάτων για 30 ημέρες. Ο διαχειριστής του διακομιστή Nextcloud μπορεί να προσαρμόσει αυτήν την τιμή στο αρχείο "config.php" ορίζοντας την τιμή "trashbin_retention_obligation". Αρχεία παλαιότερα από την τιμή "trashbin_retention_obligation" θα διαγραφούν οριστικά. Επιπλέον, το Nextcloud υπολογίζει το μέγιστο διαθέσιμο χώρο κάθε φορά που προστίθεται ένα νέο αρχείο. Εάν τα διαγραμμένα αρχεία υπερβούν το νέο μέγιστο επιτρεπόμενο χώρο, το Nextcloud θα λήξει παλιά διαγραμμένα αρχεία έως ότου το όριο εκπληρωθεί ξανά. Ποσοστώσεις Ο φάκελος "sub" θα μετακινηθεί στον κάδο απορριμμάτων τόσο του User1 (ιδιοκτήτης) όσο και του User2 (παραλήπτης) Για να διασφαλιστεί ότι οι χρήστες δεν ξεπερνούν τα όρια αποθήκευσης, η εφαρμογή "Διαγραμμένα αρχεία" εκχωρεί έως και το 50% του διαθέσιμου ελεύθερου χώρου τους σε διαγραμμένα αρχεία. Εάν τα διαγραμμένα αρχεία σας υπερβούν αυτό το όριο, το Nextcloud διαγράφει τα παλαιότερα αρχεία (αρχεία με τις παλαιότερες χρονικές σημάνσεις από τη στιγμή που διαγράφηκαν) έως ότου εκπληρώσει ξανά το όριο χρήσης μνήμης. Ο χρήστης1 μοιράζεται ένα φάκελο "test" με το User2 και το User3 Ο χρήστης2 (ο παραλήπτης) διαγράφει ένα αρχείο / φάκελο "sub" στο εσωτερικό του "test" Τι συμβαίνει όταν διαγράφονται κοινόχρηστα αρχεία Όταν ο Χρήστης 1 διαγράψει το "υπο" τότε μεταφέρεται στον Κάδο απορριμμάτων του Χρήστη 1. Διαγράφεται από το User2 και το User3, αλλά δεν τοποθετείται στους κάδους απορριμμάτων τους. Όταν διαγράφετε ένα αρχείο στο Nextcloud, δεν διαγράφεται αμέσως μόνιμα. Αντ 'αυτού, μετακινείται στον κάδο απορριμμάτων. Δεν διαγράφεται οριστικά έως ότου το διαγράψετε χειροκίνητα ή όταν η εφαρμογή "Διαγραμμένα αρχεία" τη διαγράψει για να δημιουργηθεί χώρος για νέα αρχεία. Όταν μοιράζεστε αρχεία, άλλοι χρήστες μπορούν να αντιγράψουν, να μετονομάσουν, να μετακινήσουν και να τα μοιραστούν με άλλα άτομα, όπως μπορούν για οποιοδήποτε αρχείο υπολογιστή. Το Nextcloud δεν έχει μαγικές δυνάμεις για να το αποτρέψει. Ο διαχειριστής σας ενδέχεται να έχει ρυθμίσει την περίοδο διατήρησης του κάδου απορριμμάτων για να παρακάμψει τη διαχείριση του χώρου αποθήκευσης. Ανατρέξτε στην ενότητα "τεκμηρίωση διαχειριστή <https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#deleted-items-trash-bin>" _ για περισσότερες λεπτομέρειες. 