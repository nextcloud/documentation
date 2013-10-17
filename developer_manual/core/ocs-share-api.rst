OCS Share API
=============

The OCS Share API allows you to access the sharing API from outside over
pre-defined OCS calls.

The base URL for all calls to the share API is: *<owncloud_base_url>/ocs/v1.php/apps/files_sharing/api/v1*
 

Get All Shares
--------------

Get all shares from the user.

* Syntax: /shares
* Method: GET

* Result: XML with all shares

Statuscodes:

* 100 - successfull

Get Shares from a specific File
-------------------------------

Get all shares from a given file.

* Syntax: /shares
* Method: GET

* URL Arguments: path - path to file/folder
* URL Arguments: reshares - returns not only the shares from the current user but all shares from the given file.
* URL Arguments: subfiles - returns all shares within a folder, given that
  *path* defines a folder
* Mandatory fields: path

* Result: XML with the shares

Statuscodes

* 100 - successfull
* 404 - file doesn't exists

Get information about a known Share
-----------------------------------

Get informations about a given share.

* Syntax: /shares/*<share_id>*
* Method: GET

* Arguments: share_id - share ID

* Result: XML with the share informations

Statuscodes:

* 100 - successfull
* 404 - share doesn't exists


Create a new Share
------------------

Share a file/folder with a user/group or as public link.

* Syntax: /shares
* Method: POST 

* POST Arguments: path - path to the file/folder which should be shared
* POST Arguments: shareType - '0' = user; '1' = group; '3' = public link
* POST Arguments: shareWith - with which user/group the file should be shared
* POST Arguments: publicUpload - allow public upload to a public shared folder (true/false)
* POST Arguments: password - password to protect public link Share
* POST Arguments: permissions - 1 = read; 2 = update; 4 = create; 8 = delete;
  16 = share; 31 = all (default: 31, for public shares: 1)
* Mandatory fields: shareType, path and shareWith for shareType 0 or 1.

* Result: XML containing the share ID of the newly created share

Statuscodes:

* 100 - successfull
* 404 - file couldn't be shared

Delete Share
------------

Remove the given share.

* Syntax: /shares/*<share_id>*
* Method: DELETE

* Arguments: share_id - share ID

Statuscodes:

* 100 - successfull
* 404 - file couldn't be deleted


Update Share
------------

Update a given share. Only one value can be updated per request.

* Syntax: /shares/*<share_id>*
* Method: PUT

* Arguments: share_id -  share ID
* PUT Arguments: permissions - update permissions 
* PUT Arguments: password - update password for public link Share
* PUT Arguments: publicUpload - enable (true) /disable (false) public upload for public shares

Statuscodes:

* 100 - successfull
* 404 - couldn't update share
