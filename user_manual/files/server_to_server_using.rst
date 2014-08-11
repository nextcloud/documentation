Using Server-to-Server Sharing
==============================

ownCloud supports server-to-server sharing.  By mounting a share from another
ownCloud instance, this feature enables you to:

* Seamlessly collaborate and share files from within two ownCloud instances.
* Combine two private clouds into a single public cloud. 
* Locally synchronize the folder through the client. 
* Eliminate the need to create user accounts on multiple instances.

.. note:: Server-to-server sharing requires that both servers are running
   versions of ownCloud that support this feature.

For information about managing server-to-server sharing functions for internal
and external users and groups see the following section.

Sharing Files and Folders Across Servers
----------------------------------------

Server-to-server sharing is enabled on new or upgraded ownCloud installations
by default. However, you need to share folders in a particular way for
server-to-server sharing to function.  When sharing files and folders across
servers, two primary steps are required.  These steps include:

1. The originator sharing a file or folder from their server using a link.

2. The receiver(s) of the shared file or folder adding the file or folder to their ownCloud instance.

Sharing From a Server
~~~~~~~~~~~~~~~~~~~~~

To share a file or folder across servers as an originator:

1. Access the Files app on your server.

2. Select and share a file or folder by link.

   .. figure:: ../images/share_link.png

   **Sharing a link**

3. (Optional) Specify an alphanumeric password that you want others to use in order to accessing this share.

4. (Optional) Specify an expiration date for the share.

    If set, the ability to access the link expires on the date specified.

3. Send an email to the user or group to indicate the shared link.

Adding a Shared File or Folder to Your ownCloud Instance
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To add a file or folder to your ownCloud:

1. Access the shared link using a browser.

   The links opens the shared folder or file.

   .. figure:: ../images/share_link_adding.png

2. Click "Add to your owncloud" and specify the URL to your ownCloud instance.
