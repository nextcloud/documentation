=======================
Using Federation Shares
=======================

Federation Sharing allows you to mount file shares from remote ownCloud servers, in effect 
creating your own cloud of ownClouds. You can create direct share links with 
users on other ownCloud servers.

Creating a New Federation Share
-------------------------------

Federation sharing is enabled on new or upgraded ownCloud installations
by default. Follow these steps to create a new share with other ownCloud 9 servers:

1. Go to your ``Files`` page and click the Share icon on the file or directory 
you want to share. In the sidebar enter the username and URL of the remote user
in this form: ``<username>@<oc-server-url>``. In this example, that is
``layla@remote-server/owncloud``. The form automatically echoes the address 
that you type and labels it as "remote". Click on the label.

.. figure:: ../images/direct-share-1.png

2. When your local ownCloud server makes a successful connection with the remote
ownCloud server you'll see a confirmation. Your only share option is **Can 
edit**. 
   
Click the Share button anytime to see who you have shared your file with. Remove 
your linked share anytime by clicking the trash can icon. This only unlinks the 
share, and does not delete any files.

Creating a New Federated Cloud Share via Email
----------------------------------------------

Use this method when you are sharing with users on ownCloud 8.x and older.

What if you do not know the username or URL? Then you can have ownCloud create 
the link for you and email it to your recipient. 

.. figure:: ../images/create_public_share-6.png

When your recipient receives your email they will have to take a number of 
steps to complete the share link. First they must open the link you sent them in 
a Web browser, and then click the **Add to your ownCloud** button.

.. figure:: ../images/create_public_share-8.png

The **Add to your ownCloud** button changes to a form field, and your recipient 
needs to enter the URL of their ownCloud server in this field and press the 
return key, or click the arrow.

.. figure:: ../images/create_public_share-9.png

Next, they will see a dialog asking to confirm. All they have to do is click 
the **Add remote share** button and they're finished.
 
Remove your linked share anytime by clicking the trash can icon. This only 
unlinks the share, and does not delete any files.
