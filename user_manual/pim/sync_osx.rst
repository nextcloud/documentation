Synchronizing with OS X
=======================

To use ownCloud with iCal you will need to use the following URL::

    http://ADDRESS/remote.php/caldav/principals/username/

The setup is basically the same as with iOS using the path **ADDRESS/remote.php/caldav/principals/username/** to sync with ownCloud. For OS X 10.7 Lion and 10.8 Mountain Lion everything works fine, but OS X 10.6 (Snow Leopard) and older needs some fiddling to work. A user contributed the following:

#. Make sure, addressbook is not running. If it is, select the windows and press Command + Q to terminate it.
#. Navigate to **/Users/YOUR\_USERNAME/Library/Application Support/AddressBook/Sources**. If you have all ready some kind of addressbook setup, it is likely you will see some folders named like this **BEA92826-FBF3-4E53-B5C6-ED7C2B454430**. Note down what folders there are now and leave the window open.
#. Open addressbook and try to add a new CardDav addressbook. At this point, it does not matter what information you enter. It will come up with the same error message you mentioned before when you click "Create". Ignore it and click "Create" again. A non-functional addressbook will be added.
#. Close addressbook again using Command + Q
#. Go back to the folder window from step 2. You will now see a newly created folder with another long string as its name.
#. Navigate to the newly created folder and edit the **Configuration.plist** with your favorite text editor.
#. Search for a section looking like this::

    <key>servername</key> <string>http://:0(null)</string> <key>username</key> <string>Whatever_you_entered_before</string>

8. Make it look like this. Please note that the :80 after **YOUR_DOMAIN** is important::

    <key>servername</key <string>http://YOUR_DOMAIN:80/owncloud/remote.php/carddav/principals/username</string> <key>username</key <string>username</string>

9. Save the file and open addressbook again. It will not work yet.

10. Open the preferences for your ownCloud CardDAV-Account and enter your password.

11. You may have to restart addressbook once more. After this, it should work.

If it's still not working, have a look at the :doc:`troubleshooting` guide.

There is also an easy `HOWTO`_ in the forum.


.. _HOWTO: http://forum.owncloud.org/viewtopic.php?f=3&t=132
