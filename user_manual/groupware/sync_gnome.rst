====================================
Synchronizing with the GNOME desktop
====================================

The `GNOME desktop <https://www.gnome.org>`_ has built-in support for Nextcloud's calendar, contacts, and tasks which will be displayed by the Evolution Personal Information Manager (PIM), or the Calendar, Tasks, and Contacts apps.
Similarly, Files integrates into the Nautilus file manager via WebDAV. The latter works only while the computer is connected.

This can be done by following these steps:

#. In the GNOME settings, open Online Accounts.
#. Under "Add an account" pick ``Nextcloud``:

   .. image:: ../images/gnome-online-accounts.png

#. Enter your server URL, username, and password.
   If you have enabled two-factor authentication (2FA), you need to generate an application password/token, because GNOME Online Accounts
   `doesn't support Nextcloud's WebFlow login yet <https://gitlab.gnome.org/GNOME/gnome-online-accounts/issues/81>`_
   (`Learn more <https://docs.nextcloud.com/server/latest/user_manual/session_management.html#managing-devices>`_):

   .. TODO ON RELEASE: Update version number above on release

   .. image:: ../images/goa-add-nextcloud-account.png

#. In the next window, select which resources GNOME should access and
   press the cross in the top right to close:

   .. image:: ../images/goa-nextcloud-select.png

Nextcloud tasks, calendars, and contacts should now be visible in the Evolution PIM, as well as the Task, Contacts, and Calendars apps.

Files will be shown as a WebDAV resource in the Nautilus file manager, and also be available in the GNOME file open/save dialogues.
Documents should be integrated into the GNOME Documents app.

All resources should also be searchable from anywhere by pressing the Windows key and entering a search term.

