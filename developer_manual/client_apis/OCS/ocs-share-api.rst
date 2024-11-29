=============
OCS Share API
=============

The OCS Share API allows you to access the sharing API from outside over
pre-defined OCS calls.

The base URL for all calls to the share API is: ``<nextcloud_base_url>/ocs/v2.php/apps/files_sharing/api/v1``

All calls to OCS endpoints require the ``OCS-APIRequest`` header to be set to ``true``.

Local Shares
------------

Get all Shares
~~~~~~~~~~~~~~

Get all shares from the user.

* Syntax: /shares
* Method: GET

* Result: XML with all shares

Statuscodes:

* 100 - successful
* 404 - couldn't fetch shares

Get Shares from a specific file or folder
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Get all shares from a given file/folder.

* Syntax: /shares
* Method: GET

* URL Arguments: path - (string) path to file/folder
* URL Arguments: reshares - (boolean) returns not only the shares from the current user but all shares from the given file.
* URL Arguments: subfiles - (boolean) returns all shares within a folder, given that
  *path* defines a folder
* Mandatory fields: path

* Result: XML with the shares

Statuscodes:

* 100 - successful
* 400 - not a directory (if the 'subfile' argument was used)
* 404 - file doesn't exist

Get information about a known Share
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Get information about a given share.

* Syntax: /shares/*<share_id>*
* Method: GET

* Arguments: share_id - (int) share ID

* Result: XML with the share information

Statuscodes:

* 100 - successful
* 404 - share doesn't exist

Create a new Share
~~~~~~~~~~~~~~~~~~

Share a file/folder with a user/group or as public link.

* Syntax: /shares
* Method: POST

* POST Arguments: path - (string) path to the file/folder which should be shared
* POST Arguments: shareType - (int) 0 = user; 1 = group; 3 = public link; 4 = email; 6 = federated cloud share; 7 = circle; 10 = Talk conversation
* POST Arguments: shareWith - (string) user / group id / email address / circleID / conversation name with which the file should be shared
* POST Arguments: publicUpload - (string) allow public upload to a public shared folder (true/false)
* POST Arguments: password - (string) password to protect public link Share with
* POST Arguments: permissions - (int) 1 = read; 2 = update; 4 = create; 8 = delete;
  16 = share; 31 = all (default: 31, for public shares: 1)
* POST Arguments: expireDate - (string) set a expire date for public link
  shares. This argument expects a well formatted date string, e.g. 'YYYY-MM-DD'
* POST Arguments: note - (string) Adds a note for the share recipient.
* POST Arguments: label - (string) Adds a label for the share recipient.
* POST Arguments: attributes - (string) URI-encoded serialized JSON string for :ref:`share attributes<Share attributes>`
* POST Arguments: sendMail - (string) send an email to the recipient after creation (true/false)
* Mandatory fields: shareType, path and shareWith for shareType 0 or 1.

* Result: XML containing the share ID (int) of the newly created share

Statuscodes:

* 100 - successful
* 400 - unknown share type
* 403 - public upload was disabled by the admin
* 404 - file couldn't be shared

Delete Share
~~~~~~~~~~~~

Remove the given share.

* Syntax: /shares/*<share_id>*
* Method: DELETE

* Arguments: share_id - (int) share ID

Statuscodes:

* 100 - successful
* 404 - file couldn't be deleted

Update Share
~~~~~~~~~~~~

Update a given share. Only one value can be updated per request.

* Syntax: /shares/*<share_id>*
* Method: PUT

* Arguments: share_id - (int) share ID
* PUT Arguments: permissions - (int) update permissions (see "Create share"
  above)
* PUT Arguments: password - (string) updated password for public link Share
* PUT Arguments: publicUpload - (string) enable (true) /disable (false) public
  upload for public shares.
* PUT Arguments: expireDate - (string) set a expire date for public link
  shares. This argument expects a well formatted date string, e.g. 'YYYY-MM-DD'
* PUT Arguments: note - (string) Adds a note for the share recipient.
* PUT Arguments: attributes - (string) serialized JSON string for :ref:`share attributes<Share attributes>`
* PUT Arguments: sendMail - (string) send an email to the recipient. This will not send an email on its own. You will have to use the :ref:`send-email<Send email>` endpoint to send the email. (true/false)

.. note:: Only one of the update parameters can be specified at once.

Statuscodes:

* 100 - successful
* 400 - wrong or no update parameter given
* 403 - public upload disabled by the admin
* 404 - couldn't update share

.. _Share attributes:

Share attributes
~~~~~~~~~~~~~~~~

Share attributes are used for more advanced flags like permissions.

.. code-block:: json

    [
        { "scope": "permissions", "key": "download", "value": false }
    ]

.. warning:: Since Nextcloud 30, the ``enabled`` key have bee renamed to ``value`` and supports more than boolean.
 
Download permission
"""""""""""""""""""

To remove the download permission from a share, use the following serialized string in the "attributes" parameter:

.. code-block:: json

    [
        { "scope": "permissions", "key": "download", "value": false }
    ]


This will prevent users from downloading the files from the share.
For specific file types like office files, it will still be possible to view the files using the appropriate viewer app,
which itself will present the file in a way that downloading will not be allowed.

By default when unset, the "download" attribute will be true and so the download permission will be granted.

File request
""""""""""""

When creating a link or mail share, you can enable the file request feature.
It will ask recipients to enter their name and all uploaded files will be stored in a
separate folder with the provided name.

.. code-block:: json

    [
        { "scope": "fileRequest", "key": "enabled", "value": true }
    ]

When creating the file request, you can also provide an array of emails.
Traditionally, only one is allowed with the `shareWith` parameter,
but you can provide a list of emails via attributes. This only works for MAIL shares.

.. code-block:: json

    [
        { "scope": "fileRequest", "key": "enabled", "value": true },
        { "scope": "shareWith", "key": "emails", "value": ["maria@company.com", "paul@company.com"] }
    ]

.. note:: You will have to provide an empty string as `shareWith` parameter when creating the share.
   Updating or creating the share with those parameters, will NOT send an email to the recipients.
   You will have to use the `send-email` endpoint to send the email.

.. _Send email:

Send email
~~~~~~~~~~

Send an email to the recipients of a share.

* Syntax: /shares/*<share_id>*/send-email
* Method: POST

* Arguments: share_id - (int) share ID
* POST Arguments: password - (string) the share password if enabled.

Statuscodes:

* 200 - successful
* 400 - wrong or no update parameter given
* 403 - no permission to send email on this share
* 404 - couldn't find the share

Federated Cloud Shares
----------------------

Both the sending and the receiving instance need to have federated cloud sharing
enabled and configured. See `Configuring Federated Cloud Sharing <https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/federated_cloud_sharing_configuration.html>`_.

.. TODO ON RELEASE: Update version number above on release

Create a new Federated Cloud Share
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Creating a federated cloud share can be done via the local share endpoint, using
(int) 6 as a shareType and the `Federated Cloud ID <https://nextcloud.com/federation/>`_
of the share recipient as shareWith. See `Create a new Share`_ for more information.


List accepted Federated Cloud Shares
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Get all federated cloud shares the user has accepted.

* Syntax: /remote_shares
* Method: GET

* Result: XML with all accepted federated cloud shares

Statuscodes:

* 100 - successful

Get information about a known Federated Cloud Share
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Get information about a given received federated cloud that was sent from a remote instance.

* Syntax: /remote_shares/*<share_id>*
* Method: GET

* Arguments: share_id - (int) share ID as listed in the id field in the ``remote_shares`` list

* Result: XML with the share information

Statuscodes:

* 100 - successful
* 404 - share doesn't exist

Delete an accepted Federated Cloud Share
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Locally delete a received federated cloud share that was sent from a remote instance.

* Syntax: /remote_shares/*<share_id>*
* Method: DELETE

* Arguments: share_id - (int) share ID as listed in the id field in the ``remote_shares`` list

* Result: XML with the share information

Statuscodes:

* 100 - successful
* 404 - share doesn't exist

List pending Federated Cloud Shares
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Get all pending federated cloud shares the user has received.

* Syntax: /remote_shares/pending
* Method: GET

* Result: XML with all pending federated cloud shares

Statuscodes:

* 100 - successful

Accept a pending Federated Cloud Share
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Locally accept a received federated cloud share that was sent from a remote instance.

* Syntax: /remote_shares/pending/*<share_id>*
* Method: POST

* Arguments: share_id - (int) share ID as listed in the id field in the ``remote_shares/pending`` list

* Result: XML with the share information

Statuscodes:

* 100 - successful
* 404 - share doesn't exist

Decline a pending Federated Cloud Share
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Locally decline a received federated cloud share that was sent from a remote instance.

* Syntax: /remote_shares/pending/*<share_id>*
* Method: DELETE

* Arguments: share_id - (int) share ID as listed in the id field in the ``remote_shares/pending`` list

* Result: XML with the share information

Statuscodes:

* 100 - successful
* 404 - share doesn't exist
