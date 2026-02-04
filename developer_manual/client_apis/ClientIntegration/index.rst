.. _clientintegrationindex:

==================
Client Integration
==================

With Nextcloud Hub 26 Winter we introduce a new client integration API. It allows server side apps to expose integrations on Desktop and Mobile.
For now we support adding app-defined actions to "context menu" of files and folders.

The idea behind it, is to ease the integration of specific actions on clients without the need to write and maintain code on those platforms.

Supported clients
-----------------

Android: 3.36.0
Desktop: 4.1.0
iOS: 7.3.0

Exposing actions via capability
-------------------------------

Each app can add new actions via capabilities, following the syntax "app-id", "hook-name" and list of all endpoints.

.. code::

    'client_integration' => [
        Application::APP_ID => [
            'version' => 0.1,
			'context-menu' => [
                … endpoints …
            ]
        ]
    ]

Hooks
-----

Currently only "context-menu" is supported.

Endpoint
--------
The endpoint tells the client how the menu entry should look like and how the client can send a request to the server.

Requirements:
- Every text need to be translated by the app
- Current predefined params are fileId and filePath
- {fileId} and {filePath} will be replaced on clients with actual values
- url placeholder are always replaced
- mimetype_filters is a comma-separated list of filters (matches anything that starts with the filter). If there is no filter, the action is shown for every file/folder.
- all urls must be relative
- params is used for body params (currently only POST)
- Icons are always svgs
- Methoth: supported POST/GET

.. code::
    [
        'name' => 'translated title',
        'url' => '/ocs/v2.php/apps/abc',
        'method' => 'POST/GET',
        'mimetype_filters' => 'text/, application/pdf', // will match text/* and PDFs
        'params' => ['file_id' => '{fileId}','file_path' => '{filePath}'], // only for POST; the key can vary depending on the app
        'icon' => '/apps/abc/img/app.svg'
    ],

Response
--------
When clicking on a menu entry the client sends a predefined request to the server.
The app in question can then handle the request and can send two different response types.

Declarative UI
^^^^^^^^^^^^^^


Tooltip Response
^^^^^^^^^^^^^^^^
The tooltip response is a regular DataResponse type, with payload:
- version: Indicates which version it is. Clients will be backward compatible. If server sends a newer version than the client can understand the response will be ignored.
- tooltip: Translated text, which will be shown as tooltip / snackbar.

.. code::
    {
      "ocs": {
        "meta": {
          "status": "ok",
          "statuscode": 200,
          "message": "OK"
        },
        "data": {
          "version": "0.1",
          "tooltip": "Task submitted successfully"
        }
      }
    }

Issues/Bugs
-----------

Please report issues, bugs or feature requests at https://github.com/nextcloud/files-clients with label "Client integration".


