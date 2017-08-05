Thunderbird - Synchronize Addressbook
=====================================

Addressbook
-----------

As someone who is new to Nextcloud, new to CardBook... here is what you need in excruciating pithy detail to make this work (for all the other lost souls out there):

#. `Thunderbird <https://www.mozilla.org/en-US/thunderbird/>`_ for your OS unless it comes with your OS distribution (Linux)
#. `CardBook <https://addons.mozilla.org/en-US/thunderbird/addon/cardbook/>`_ (a Thunderbird contacts add-on.)
#. `Lightning <https://addons.mozilla.org/en-US/thunderbird/addon/lightning/>`_ (a Thunderbird calendar add-on.)

With an installed Thunderbird mailtool, an installed CardBook add-on, and an installed Lightning add-on:

#. Cardbook is found in the upper right corner of Thunderbird.
.. image:: ../images/cardbook_icon.png

#. In the Thunderbird Cardbook add-on:

   -  "Adressbook > New Adressbook **Remote** > Next
   -  Fill in your information
.. image:: ../images/new_addressbook.png

in the bottom left of the Contacts View (same symbol as found in the top right in the Calendar view). Then look for a little impeller symbol

.. image:: ../images/contacts_link.jpg

which will display the URL you need for your installation to work:

https://cloud.nextcloud.com/remote.php/dav/addressbooks/users/daniel/Thunderbird/

Validate your settings and click Next, then choose the name of the addressbook and click Next again.

.. image:: ../images/addressbook_name.jpg

Once installed, synchronize your addressbook by clicking "Syncronize" in the top left corner of CardBook.
You'll see your address book populate from Nextcloud! 

The rest of the details of dealing with Thunderbird addressbook are left to the reader... 
