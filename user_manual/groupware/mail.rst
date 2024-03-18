===================
Using the Mail app
===================

.. note:: The Mail app comes installed with Nextcloud Hub by default, but can be disabled.
          Please ask your Administrator for it.

.. figure:: images/mail.png

Managing your mail account
---------------------------

Switch layout
~~~~~~~~~~~~~
1. Visit mail settings
2. Click the layout that you desire

 .. versionadded:: 3.6

Add a new mail account
~~~~~~~~~~~~~~~~~~~~~~~

1. Enable mail app from the apps
2. Click the mail icon on the header
3. Fill up the login form (auto or manual)

.. figure:: images/new-mail-account.png

Change sort order
~~~~~~~~~~~~~~~~~

 .. versionadded:: 3.5

1. Visit mail settings
2. Go to *Sorting*
3. You can choose *Oldest* or *Newest* mail first

.. note:: This change will apply across all your accounts and mailboxes

Scheduled messages
~~~~~~~~~~~~~~~~~~~
1. Click new message button on top left of your screen
2. Click the (...) action menu on the modal composer
3. Click *send later*

.. figure:: images/scheduled-msg.png

Priority inbox
~~~~~~~~~~~~~~
Priority inbox has 2 section *Important* and *Others*.
Messages will automatically be marked as important based on which messages you interacted with or marked as important. In the beginning you might have to manually change the importance to teach the system, but it will improve over time.

.. figure:: images/priority-inbox.png

All inboxes
~~~~~~~~~~~~
All messages from all the accounts you have logged in, will be shown here chronologically.

.. _mail-account-settings:

Account settings
~~~~~~~~~~~~~~~~
Your account settings such as:

1. Aliases
2. Signature
3. Default Folders
4. Autoresponder
5. Trusted senders
6. ..and more

Can be found in the action menu of a mail account. There you can edit, add or remove settings depending on your need.

Move messages to Junk folder
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

   .. versionadded:: 3.4

Mail can move a message to a different folder when it is marked as junk.

1) Visit Account settings
2) Go to Default folders
3) Check that a folder is selected for the junk messages
4) Go to Junk settings
5) Click Move messages to Junk folder

   .. figure:: images/mail_move-message-to-junk-folder.png

Enable mail body search
~~~~~~~~~~~~~~~~~~~~~~~~~~
   .. versionadded:: 3.5

Mail bodies can now be searched, this feature is opt-in because of potential performance issues.

To enable it:

1) Visit Account settings
2) Go to Mailbox search
3) Enable mail body search

.. warning:: If you want to also enable it for unified mailboxes you have to do so in Mail settings

By enabling it the main search box will now search in both subjects and mail bodies, and a sperate *Body* option
will appear in advanced search.

Account delegation
~~~~~~~~~~~~~~~~~~

The app allows account delegation so that one user can send emails from the address of another.

1) The delegation has to be configured on the mail server by an admin
2) Add the other email address as an alias for your own email account
3) When sending an email, select the alias as sender

.. warning:: The sent email might not be visible to the original account if it's stored in your personal *Sent* mailbox.

Automatic trash deletion
~~~~~~~~~~~~~~~~~~~~~~~~

.. versionadded:: 3.4

The Mail app can automatically delete messages in the trash folder after a certain number of days.

1) Visit Account settings
2) Go to Automatic trash deletion
3) Enter the number of days after which messages should be deleted

Disable trash retention by leaving the field empty or setting it to 0.

.. note::  Only mails deleted after enabling trash retention will be processed.

.. figure:: images/mail_trash_retention_settings.png

Compose messages
----------------

1. Click new message on the top left of your screen
2. Start writing your message

Minimize the composer modal
~~~~~~~~~~~~~~~~~~~~~~~~~~~

   .. versionadded:: 3.2

The composer modal can be minimized while writing a new message, editing an existing draft or editing a message from the outbox. Simply click the minimize button on the top right of the modal or click anywhere outside the modal.

   .. figure:: images/mail-minimize-composer.png

You can resume your minimized message by clicking anywhere on the indicator on the bottom right of your screen.

   .. figure:: images/mail-composer-indicator.png

Press the close button on the modal or the indicator in the bottom right corner to stop editing a message. A draft will be saved automatically into your draft mailbox.


Mailbox actions
---------------

Add a mailbox
~~~~~~~~~~~~~~
1. Open the action menu of an account
2. Click add mailbox

Add a submailbox
~~~~~~~~~~~~~~~~~
1. Open the action menu of a mailbox
2. Click add submailbox

Shared mailbox
~~~~~~~~~~~~~~~
If a mailbox was shared with you with some specific rights, that mailbox will show as a new mailbox with a shared icon as below:

.. figure:: images/shared-mailbox-icon.png

Envelope actions
----------------

Create an event
~~~~~~~~~~~~~~~
Create an event for a certain message/thread directly via mail app

1. Open action menu of an envelope
2. Click *More actions*
3. Click *Create event*

.. note:: Event title and an agenda is created for you if the administrator has enabled it.

Create a task
~~~~~~~~~~~~~

.. versionadded:: 3.2

Create an task for a certain message/thread directly via mail app

1. Open action menu of an envelope
2. Click *more actions*
3. Click *create task*

.. note:: Tasks are stored in supported calendars. If there is no compatible calendar you can create a new one with the :ref:`calendar app<calendar-app>`.

Edit tags
~~~~~~~~~~
1. Open action menu of an envelope
2. Click *Edit tags*
3. On the tags modal, set/unset tags

Change color for tags
~~~~~~~~~~~~~~~~~~~~~

.. versionadded:: 3.5

.. figure:: images/change-tag-color.png

Upon creating a tag, a randomly assigned color is automatically chosen. Once the tag is saved, you have the flexibility to customize its color according to your preferences. This feature can be found on the Tag modal action menu.

Delete tags
~~~~~~~~~~~

.. versionadded:: 3.5

.. figure:: images/delete-tag.png

You now have the ability to delete tags that you have previously created. To access this feature:

1. Open the action menu of an envelope/thread.
2. Select Edit tags.
3. Within the tags modal, open the action menu for the specific tag you wish to delete.

.. note:: Please note that default tags such as Work, To do, Personal, and Later cannot be deleted, they can only be renamed.

Message actions
---------------

Unsubscribe from a mailing list
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. versionadded:: 3.1

Some mailing lists and newsletters allow to be unsubscribed easily. If the Mail app detects messages from such a sender, it will show an *Unsubscribe* button next to the sender information. Click and confirm to unsubscribe from the list.

Snooze
~~~~~~

.. versionadded:: 3.4

Snoozing a message or thread moves it into a dedicated mailbox until the selected snooze date is reached and the message or thread is moved back to the original mailbox.

1. Open action menu of an envelope or thread
2. Click *Snooze*
3. Select how long the message or thread should be snoozed

Smart replies
~~~~~~~~~~~~~

.. versionadded:: 3.6

When you open a message in the Mail app, it proposes AI-generated replies. By simply clicking on a suggested reply, the composer opens with the response pre-filled.

.. note:: Please note that the feature has to be enabled by the administrator

.. note:: Supported languages depend on the used large language model

Filtering and autoresponder
---------------------------

The Mail app has a simple editor for Sieve scripts and an interface to configure autoresponders. Sieve has to be enabled in the :ref:`account settings <mail-account-settings>`.

Autoresponders
~~~~~~~~~~~~~~

.. versionadded:: 3.5 Autoresponder can follow system settings.

The autoresponder is off by default. It can be set manually, or follow the system settings. Following system settings means that the long absence message entered on the :ref:`Absence settings section <groupware-absence>` is applied automatically.
