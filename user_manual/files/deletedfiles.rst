Deleted Files
=============

ownCloud keeps a copy of your deleted files in case you need them again. To
make sure that the user doesn't run out of memory the deleted files app
manages the size of the deleted files for the user. The app takes care to never
use more that 50% of your currently available free space. If your deleted files
exceed this limit ownCloud deletes the oldest versions until it meets the memory
usage limit again.

Deleted files can be found by clicking on *Deleted files* button on files app of web interface.
You can either restore or permanently delete using appropriate buttons.

Beside that ownCloud checks the age of the files every time a new files gets moved
to the deleted files. By default deleted files stay in the trash bin for 180 days.
The Administrator can adjust this value in the config.php by setting the
***"trashbin_retention_obligation"*** value. Files older than the 
***"trashbin_retention_obligation"*** will be deleted permanently.
Additionally ownCloud calculates the maximum available space every time
a new file was added. If the deleted files exceed the new maximum available space
ownCloud will expire old deleted files until we meet the limit again.
