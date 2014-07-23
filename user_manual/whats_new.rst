New in ownCloud 7
=================

Changes to the "Shared" folder
------------------------------

For all existing ownCloud users: the “Shared” folder has been removed from the ownCloud server. As a result, newly shared files and folders no longer appear in a folder called “Shared”, they appear in the root user’s folder. For example, if Bob shares a folder called “sales” with Earl in ownCloud 6, Earl will see  the “Shared” folder appear, and then the folder “sales” appears within “Shared”. Now, in ownCloud 7, the same sharing activity would create a folder called “sales” in Earl’s root directory. Overlay icons will show Earl that this is a shared folder, and the folder can be moved wherever he wants – including into a folder he creates and calls “Shared”. However, the “Shared” directory is no longer required, and will no longer appear by default when a file or folder is shared.


If users currently have an earlier version of ownCloud and have shared files and folders via the “Shared” directory, the files and folders will continue to reside in the “Shared” directory after an ownCloud 7 upgrade. However, any files or folders shared after the upgrade will appear in the user’s root directory. These files and folders can be dragged anywhere in the ownCloud file tree (except into another folder that has been shared with this user). For example, the files and folders could be dragged into a “Shared” folder, where they will continue to sync normally. Or they can be dragged into a folder called “Given to me by Bob”. In addition, to make navigating these files easier, the ownCloud 7 web interface now provides a “Shared with Me” filter that automatically shows on the left hand side of the files view in a web browser. Clicking on this filter will display only those paths where files and folders shared with this user reside. This change in behavior provides ownCloud users with far greater flexibility, enabling them to arrange and organize files and folders however they want, even if those folders or files are shared with them.

