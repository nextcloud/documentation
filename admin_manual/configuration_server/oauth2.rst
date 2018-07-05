======
OAuth2
======

Nextcloud allows connecting external services (for example Moodle) to your Nextcloud.
This is done via ``OAuth2``. See `RFC6749 <https://tools.ietf.org/html/rfc6749>`_ for the
OAuth2 specification.

.. note:: Nextcloud does only support confidential clients.

Add an OAuth2 Application
-------------------------

Head over to your Administrator Security Settings. Here you can add a new ``OAuth2`` client.

.. figure:: images/oauth2-settings.png

Enter the name of your application and provide a redirection url.
You should now have a Client Identifier and Secret. Enter those into your ``OAuth2`` client.

Please provide the OAuth2 application the following details:

Authorization endpoint: SERVER/apps/oauth2/authorize
Token endpoint: SERVER/apps/oauth2/api/v1/token

The access token
----------------

The access token obtained is a so called Bearer token. Which means that for request to the
Nextcloud server you will have to send the proper authorization header.

Authorization: Bearer <TOKEN>

Note that apache by default strips this. Make sure you have ``mod_rewrite`` and ``mod_env`` enabled.
