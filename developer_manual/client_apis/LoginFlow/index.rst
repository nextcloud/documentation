.. _loginflowindex:

==========
Login Flow
==========

This document provides a quick overview of the new login flow that should be used by clients to obtain
login credentials. This will assure that each client gets it own set of credentials. This has several advantages:

1. The client never stores the password of the user
2. The user can revoke on a per client basis from the web

Opening the webview
-------------------

The client should open a webview to :code:`<server>/index.php/login/flow`. Be sure to set the :code:`OCS-APIREQUEST`
header to :code:`true`.

The client will register an URL handler to catch urls of the :code:`nc` protocol. This is required to obtain the
credentials in the final stage.

This should be a one time webview. Which means:

* There should be no cookies set when creating the webview
* Passwords should not be stored
* No state should be preserved after the webview has terminated

To have a good user experince please consider the following things:

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

* server: The address of the server to connect to. The server may specify a protocol (http or https). If no protocol is specified the client will assume https.
* loginname: The username that the client must use to login. **Note:** Keep in mind that this is the loginname and could be different from the username. For example the email address could be used to login but not for generating the webdav URL. You could fetch the actual username from the OCS API endpoint :code:`<server>/ocs/v1.php/cloud/user`.
* password: The password that the client must use to login and store securely

This information will be used by the client to create a new account.
After this the webview is destroyed including all the state the webview holds.

.. note:: On Nextcloud 12 the returned server is just the server address without any possible subfolder. This is corrected in Nextcloud 13.


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

