=============
Conversations
=============

Nextcloud Talk lets you chat and have video calls on your own server.

Chats and calls take place in conversations. You can create any number of conversations. There are two kinds of conversations:

1. **One-on-one conversations.** This is where you have a private chat or call with another Talk user. You can't add other people to this conversation or share it with a link. You start a direct one-on-one chat by looking for another user in the search bar and then clicking their name.
2. **Group conversations.** Besides the person who created the conversation, a group conversation can have any number of people in it. A group conversation can be shared publicly with a link, so external guest users can join a call. It can also be listed, so other people on your Nextcloud server can join the conversation.

Creating a conversation
-----------------------

You can create a direct, one-on-one chat by searching for the name of a user, a group or a team and clicking it. For a single user, a conversation is immediately created and you can start your chat. For a group or circle you get to pick a name and settings before you create the conversation and add the participants.

.. image:: images/chat-with-one-user.png
    :width: 400px

If you want to create a custom group conversation, click the button next to the search field and filters button and then on ``Create a new conversation``.

.. image:: images/create-new-conversation.png
    :width: 400px

You can then pick a name for the conversation, put a description, and set up an avatar for it (with uploaded photo or emoji), and select if the conversation should be open to external users and if other users on the server can see and join the conversation.

.. image:: images/creating-open-conversation.png
    :width: 500px

In the second step, you get to add participants and finalize the creation of the conversation.

.. image:: images/add-participants.png
    :width: 500px

After confirmation you will be redirected to the new conversation and can start communicating right away.

.. image:: images/new-room.png
    :width: 700px

Filter your conversations
-------------------------

You can filter your conversations using the filter button located next to the search field. There are two options for filtering:
1. Filter unread mentions: This option allows you to view group conversations with unread mentions or unread one-on-one conversations.
2. Filter unread messages: This option allows you to view all unread messages in all joined conversations.

.. image:: images/filters-menu.png
    :width: 400px

You can then clear the filter from the filters menu.

.. image:: images/clear-filter.png
    :width: 400px

Managing a conversation
-----------------------

You are always moderator in your new conversation. In the participant list you can promote other participants to moderators using the ``...`` menu to the right of their user name, assign them custom permissions or remove them from the conversation.

Changing permissions of a user that joined a public conversation will also permanently add them to the conversation.

.. image:: images/participant-menu.png
    :width: 400px

Moderators can configure the conversation. Select ``Conversation settings`` from the ``...`` menu of the conversation on the top to access the settings.

.. image:: images/open-settings.png
    :width: 400px

Here you can configure the description, guest access, if the conversation is visible to others on the server and more.

.. image:: images/conversation-settings-dialog.png
   :width: 600px

Messages expiration
-------------------

A moderator can configure message expiration under the ``Conversation settings`` within the ``Moderation`` section. Once a message reaches its expiration time, it is automatically removed from the conversation.
The available expiration durations are 1 hour, 8 hours, 1 day, 1 week, 4 weeks, or never (which is the default setting).

.. image:: images/messages-expiration.png
   :width: 500px
