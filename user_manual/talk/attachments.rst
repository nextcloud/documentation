===========
Attachments
===========

Sharing files in a chat
-----------------------

You can share files in a chat in three ways.

First, you can simply drag'n'drop them on the chat.

.. image:: images/drag-and-drop.png
   :alt: Talk chat with a file being dragged and dropped to share
   :width: 600px

Second, you can select a file from your Nextcloud Files or a file manager by choosing the little paperclip and selecting where you'd like to pick the file from.

.. image:: images/share-files-in-chat.png
   :alt: Talk file selection dialog for sharing from Nextcloud Files
   :width: 500px

.. image:: images/share-files-in-chat-selection.png
    :alt: Talk file selection panel showing available files to share in chat
    :width: 600px

You can add more files until you are done and decide to share the files. You can also add a text caption to your shared files, providing a brief description or context. When you share several files at once, they are combined into a single message in the chat instead of one message per file, keeping the conversation easier to follow.

.. TODO: update screenshot to show multiple files combined into one message
.. image:: images/talk-upload-files.png
   :alt: Talk file upload queue with several files combined into one message before sending
   :width: 500px

Before you send the files, this staging area also lets you set options that apply to the upload. When you share
images, they use ``Standard image quality`` by default, which compresses them to save bandwidth and storage; switch
to ``Original image quality`` if you need to share the full-quality file. Depending on your instance, you can also
choose ``View-only for others`` (the default) or ``Editable by others`` for the shared files.

.. TODO: mock screenshot below, replace with a real capture once the feature ships
.. image:: images/talk-upload-files.png
   :alt: Talk staging area showing the image compression and view-only/can-edit options
   :width: 500px

All users will be able to click the files to view or download them, regardless of whether they have a Nextcloud account, and edit them if you allowed it. Users with an account will have the file automatically shared with them while external guest users will get them shared as a public link.

.. image:: images/editing-document-in-chat-room.png
   :alt: Talk chat with a shared document that participants can open and edit
   :width: 600px

Polls in chat
-------------

You can create a poll in groups chats from the new message additional actions.

.. image:: images/create-new-poll.png
   :alt: Talk poll creation form in a group chat
   :width: 400px

A poll has two settings:

- **Anonymous polls**: Participants cannot see who voted for which option.
- **Allow multiple choices**: Participants can select more than one option.

You can also import polls for auto-fill and export polls as JSON files to save them locally.

.. image:: images/import-poll.png
   :alt: Talk poll import option for loading poll questions from a file
   :width: 400px

You can close a poll from the poll dialog.

.. image:: images/close-poll.png
   :alt: Talk poll dialog with option to close voting
   :width: 400px

As a moderator, you can create the poll directly or you can save it as a draft to edit it later.

.. image:: images/save-poll-draft.png
   :alt: Talk poll creation form with save as draft option
   :width: 400px

You can find poll drafts in ``Shared items`` tab or next to the poll title input field.

.. image:: images/poll-drafts-list.png
   :alt: Talk shared items tab showing saved poll drafts
   :width: 400px


.. FIXME voice messages?, shared items view
