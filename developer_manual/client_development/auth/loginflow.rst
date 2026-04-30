.. _loginflowindex:

==========
Login Flow
==========

This document provides a quick overview of the new login flow that should be used by clients to obtain
login credentials. This will assure that each client gets its own set of credentials. This has several advantages:

1. A client never stores the password of the user
2. The user can revoke access on a per client basis from the web

Opening the webview
-------------------

The client should open a webview to :code:`<server>/index.php/login/flow`. Be sure to set the :code:`OCS-APIREQUEST`
header to :code:`true`.

The client will register a URL handler to catch urls of the :code:`nc` protocol. This is required to obtain the
credentials in the final stage.

This should be a one time webview. Which means:

* There should be no cookies set when creating the webview
* Passwords should not be stored
* No state should be preserved after the webview has terminated

To have a good user experience please consider the following things:

* set a proper :code:`ACCEPT_LANGUAGE` header
* set a proper :code:`USER_AGENT` header


Login in the user
-----------------

The user will now see a webpage telling them they will grant access to :code:`USER_AGENT`. When they follow the steps
they will be asked to login. If they have two factor authentication enabled they will require this to login. But since
this is all in the webview itself the client does not need to care about this.


Obtaining the login credentials
-------------------------------

On the final login the server will do a redirect to a url of the following format:

.. code::

	nc://login/server:<server>&user:<loginname>&password:<password>

* ``server``: The address of the server to connect to. The server may specify a protocol (http or https). If no protocol is specified the client will assume https.
* ``loginname``: The username that the client must use to login. **Note:** Keep in mind that this is the loginname and could be different from the username. For example the email address could be used to login but not for generating the webdav URL. You could fetch the actual username from the OCS API endpoint ``<server>/ocs/v1.php/cloud/user``.
* ``password``: The password that the client must use to login and store securely

.. note::

	``loginname`` and ``password`` are encoded by PHP's `urlencode <https://www.php.net/manual/en/function.urlencode.php>`_, which differs from `RFC 3986 <http://www.faqs.org/rfcs/rfc3986.html>`_. You may need to replace plus signs :code:`'+'` with spaces :code:`' '` before decoding.

This information will be used by the client to create a new account.
After this the webview is destroyed including all the state the webview holds.


Converting to app passwords
---------------------------

Old configurations of clients might still be using username and passwords. The login flow ensures that each device has an unique app password. In order to facilitate transparent migration to app passwords there is an endpoint that can be called by client.

If the client is authenticated with an app password a 403 will be returned. If the client is authenticating with a real password an app password will be generated and returned.

The user agent header will be used to name the app password.

.. code-block:: bash

     curl -u username:password -H 'OCS-APIRequest: true' https://cloud.example.com/ocs/v2.php/core/getapppassword

The response would look (in XML) something like:

.. code-block:: xml

        <?xml version="1.0"?>
        <ocs>
                <meta>
                        <status>ok</status>
                        <statuscode>200</statuscode>
                        <message>OK</message>
                </meta>
                <data>
                        <apppassword>M1DqHwuZWwjEC3ku7gJsspR7bZXopwf01kj0XGppYVzEkGtbZBRaXlOUxFZdbgJ6Zk9OwG9x</apppassword>
                </data>
        </ocs>


Deleting an app password
------------------------

When an account on a client is removed for housekeeping it is desired to destroy the apptoken in use.
This can be done by a simple call:

.. code-block:: bash

        curl -u username:app-password -X DELETE -H 'OCS-APIREQUEST: true'  http://localhost/ocs/v2.php/core/apppassword

The response should be a plain OCS response with a status 200

.. code-block:: xml

        <?xml version="1.0"?>
        <ocs>
                <meta>
                        <status>ok</status>
                        <statuscode>200</statuscode>
                        <message>OK</message>
                </meta>
                <data/>
        </ocs>

If a non 200 status code is returned the client should still proceed with removing the account.

Login flow v2
-------------

While the login flow works very nice in a lot of cases there are especially on desktop application certain hurdles. Special proxy configuration, client side certificates and the likes can cause trouble. To solve this we have come up with a second login flow that uses the users default webbrowser to authenticate. Thus ensuring that if they can login via the web they can also login in the client.

To initiate a login do an anonymous POST request


.. code-block:: bash

        curl -X POST https://cloud.example.com/index.php/login/v2

This will return a json object like

.. code-block:: json

        {
            "poll":{
                "token":"mQUYQdffOSAMJYtm8pVpkOsVqXt5hglnuSpO5EMbgJMNEPFGaiDe8OUjvrJ2WcYcBSLgqynu9jaPFvZHMl83ybMvp6aDIDARjTFIBpRWod6p32fL9LIpIStvc6k8Wrs1",
                "endpoint":"https:\/\/cloud.example.com\/login\/v2\/poll"
            },
            "login":"https:\/\/cloud.example.com\/login\/v2\/flow\/guyjGtcKPTKCi4epIRIupIexgJ8wNInMFSfHabACRPZUkmEaWZSM54bFkFuzWksbps7jmTFQjeskLpyJXyhpHlgK8sZBn9HXLXjohIx5iXgJKdOkkZTYCzUWHlsg3YFg"
        }

The url in login should be opened in the default browser, this is where the user will follow the login procedure.
The program should directly start polling the poll endpoint:

.. code-block:: bash

        curl -X POST https://cloud.example.com/login/v2/poll -d "token=mQUYQdffOSAMJYtm8pVpkOsVqXt5hglnuSpO5EMbgJMNEPFGaiDe8OUjvrJ2WcYcBSLgqynu9jaPFvZHMl83ybMvp6aDIDARjTFIBpRWod6p32fL9LIpIStvc6k8Wrs1"

The token will be valid for 20 minutes.
This will return a 404 until authentication is done. Once a 200 is returned it is another json object.

.. code-block:: json

        {
            "server":"https:\/\/cloud.example.com",
            "loginName":"username",
            "appPassword":"yKTVA4zgxjfivy52WqD8kW3M2pKGQr6srmUXMipRdunxjPFripJn0GMfmtNOqOolYSuJ6sCN"
        }

Use the server and the provided credentials to connect.
Note that the 200 will only be returned once.


Troubleshooting
---------------

Login name vs. email login
^^^^^^^^^^^^^^^^^^^^^^^^^^

Nextcloud allows authentication with user's *login name*, which can be their UID, an email address and similar. The identifier used for the session in which the user generates the app password will be stored into the database record of the generated app password. Therefore the identifier used in the web session that authorizes a client must match the identifier used in the connecting client.
