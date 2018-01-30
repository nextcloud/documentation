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

	nc://login/server:<server>&user:<username>&password:<password>

* server: The address of the server to connect to. The server may specify a protocol (http or https). If no protocol is specified the client will assume https.
* username: The username that the client must use to login
* password: The password that the client must use to login and store securely

This information will be used by the client to create a new account.
After this the webview is destroyed including all the state the webview holds.

.. note:: On Nextcloud 12 the returned server is just the server address without any possible subfolder. This is corrected in Nextcloud 13.
