==========================================
Connecting to SharePoint (Enterprise only)
==========================================

Native SharePoint support has been added to ownCloud Enterprise Subscription as 
a secondary storage location for SharePoint 2007, 2010 and 2013. To the user, 
these appear as normal ownCloud mounts, with bi-directional updates in any 
ownCloud client: desktop, mobile, or Web. There is one difference, and that is 
ownCloud sharing is intentionally disabled for SharePoint mountpoints in order 
to preserve SharePoint access controls, and to ensure that content is properly 
accessed as per SharePoint rules.

Your ownCloud admin may optionally allow users to mount their own SharePoint 
libraries.

Accessing SharePoint Folders
----------------------------

When you first log in to ownCloud, the Web interface shows a gray bar behind all 
SharePoint folders. The gray bar disappears when the mountpoint is verified by 
the server. If you see a red error bar, you'll see either an hourglass that 
indicates a connection error, or a key to indicate that authentication is 
required. 

Your ownCloud admin has the option to configure SharePoint credentials so that 
you are authenticated automatically, or you may be required to enter your 
credentials. If you have to enter your credentials, click the red bar and you'll 
get a login window. You should only have to do this once, as ownCloud will store 
your credentials.

If your SharePoint login ever changes, go to your Personal page to update it in 
the ``Sharepoint Personal Configuration`` section.

Personal Page
-------------

You can manage your SharePoint connections in the ``Sharepoint Personal 
Configuration`` section of your ownCloud Personal page. You'll see two sections: 
the ``Admin added mount points`` section lists SharePoint mounts controlled by 
your ownCloud admin. If users have permissions to mount their own SharePoint 
libraries you'll also see a ``Personal mount points`` section. 

There are two types of authentication available to you. If you have multiple 
SharePoint libraries that use the same authentication, enter your credentials 
in ``Sharepoint Personal Configuration``. Then follow these steps to add your 
libraries:

* Enter the name of your local mountpoint in the ``Local Folder Name`` column. 
  This can be an existing folder, or automatically create a new one.

* Enter your SharePoint server URL.

* Click the little refresh icon to the left of the ``Document Library`` field. 
  If your credentials and URL are correct you'll get a dropdown list of SharePoint 
  libraries to choose from.

* Select the document library you want to mount.

* Select "Use user credentials".

* Click the ``Save`` button, and you're done

You may elect to use different authentication credentials for some of your 
SharePoint libraries. For these, you must first select ``use custom 
credentials``, and then fill in the mountpoint and SharePoint site URL. Then 
ownCloud can authenticate you, and you can click the refresh icon to see your 
libraries. Then select the library you want to mount and click the ``Save`` 
button.
