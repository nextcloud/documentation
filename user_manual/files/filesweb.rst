Accessing your Files Using the Web Interface
============================================

You can access your ownCloud files from anywhere using the ownCloud web
interface. Once accessed, using the files app you can view (if a common type),
move, rename, download, share, and delete your files easily.

.. figure:: ../images/oc_filesweb.png

	**ownCloud web interface Files app**

ownCloud versio 7 enables you to see file thumbnails next to the filenames.
Hovering over a file or folder provides the following highlighted list of
operations:

* :guilabel:`Rename` -- Enables you to rename a file or folder.
* :guilabel:`Download` -- Downloads a file to your system.
* :guilabel:`Versions` (when enabled; See :doc:`versioncontrol` for details) -- Enables you to revert the file or folder to any available older versions.
* :guilabel:`Share` -- Enables you to share the file or folder with a group or a specific user.  Also enables you to share using a specified link.
* :guilabel:`Edit` -- When a file is editable, enables you to open the file in the document application as long as that application is enabled for use from the ownCloud server.
* :guilabel:`Delete` -- Deletes the selected file or folder.


Navigating inside your ownCloud
-------------------------------

Navigating through folders in ownCloud is as simple as clicking on a folder to
open it and using the back button on your browser to move to a previous level.
For added convenience, ownCloud also provides a navigation bar at the top of
the Files field for quick navigation.

.. figure:: ../images/oc_filesweb_navigate.png

   Navigation bar

The navigation bar functions as a "breadcrumb" locator.  It indicates your
current directory and enables you to migrate back to one of the upper
directories or, using the home icon, to navigate back into your root folder.


Creating or Uploading Files and Directories
-------------------------------------------

ownCloud enables you to create new files or folders directly in an ownCloud
folder by clicking on the *New* button in the Files app.

.. figure:: ../images/oc_filesweb_new.png

   New button options

The *New* button provides the following three options from which to choose:

* *Text file* -- Creates a simple text file and adds the file to the current folder in your ownCloud.
* *Folder* -- Creates a new folder in the current folder.
* *From link* -- Downloads a file from a provided link path and places it into the current folder.


Selecting Files or Folders
--------------------------

You can select one or more files or folders by clicking on the small thumbnails
or icons that represent them. When you select a file or folder, a small
checkbox is populated with a check to indicate that it is selected.  To select
all files in the current directory, you can click on the checkbox located at
the top of the Files app field, above the first file or folder on the list.

If you select multiple files, you can deleted all of the selected files or
download them as a ZIP file by using the ``Delete`` or ``Download`` buttons at
the top right side of the Files app field.

.. note:: If the ``Download`` button is not visible, the administrator has
   disabled this feature.  Contact your administrator for further guidance.

Viewing Files
-------------

You can display uncompressed text files, OpenDocument files, PDFs, and image
files from the ownCloud server by clicking on the file name. If ownCloud cannot
display a file, a download process starts and the file is downloaded to your
system.

Moving files
------------

Using the ownCloud web interface, you can move files and folders by dragging
and dropping them into any directory. If you want to move a file or folder to
an upper directory, click and drag them to one of the folders shown in the
navigation bar.

Sharing files
-------------

You can share any file or folder on ownCloud with a local user, group, or any
person online with a public link. By sharing a file or folder, the user or
group can download the information directly to their system. Shared files and
folders depict a globe icon and the status *Shared* in the file or folder row.

To share a file or folder:

1. Using your cursor, hover over on an item in the Files app field.

2. Locate the **Share** icon in the file or folder row.

3. Click *Share*.

	The Share dialog box opens to show the following options:

	.. figure:: ../images/oc_files_share.png

           Share dialog box

4. Choose the desired share option:

        * User/Group Share field: Enables you to specify to whom you want to
          share the file or folder. Once you specify a user or group, a dialog
          appears providing added sharing options.

		.. figure:: ../images/oc_share_with_options.png
 
		   Sharing options dialog

	* **Share link** checkbox: When enabled (checked), provides the following additional share options:

		- **File/Folder URL** field: Specifies the URL to the folder or file that you want to share.

		- **Password Protect** checkbox: When enabled (checked), provides the option of protecting access to the file of folder through the use of a simple alphanumeric password.

		- **Allow Public Upload** checkbox: When enabled (checked), provides the ability for shared users to upload files using the provided link.

		- **Email Link** field: Enables you to alert users of the shared folder by email.  You can specify one or more email addresses in this field (separated by spaces) and then click the "Send" button to send emails of the share.

			.. note:: The server must be configured with a mail server or mail server access.

		- **Set expiration date** checkbox: When enabled (checked), you can specify a date for which the share expires.  You specify the expiration date in the format MM/DD/YYYY.  For added convenience, clicking in the "Expiration date" field opens a calendar from which you can specify the date.

		.. figure:: ../images/oc_share_expiration_calendar.png

		   Expiration Date Calendar
