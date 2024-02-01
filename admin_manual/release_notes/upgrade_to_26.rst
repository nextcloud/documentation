=======================
Upgrade to Nextcloud 26
=======================

System requirements
-------------------

* PHP 8.2 is now supported, but 8.1 is recommended.
* PHP 7.4 is no longer supported.

System email
------------

The software component to send system emails (notifications, invites, password reset, etc) had to be replaced. The new library should work without any changes out of the box for most setups.

A brief overview of changes:

* STARTTLS cannot be enforced. It will be used automatically if the mail server supports it. The encryption type should be set to 'None/STARTTLS' in this case.
* Self signed certificates now need to be explicitly enabled, see :ref:`this guide<TLSPeerVerification>` for an example on how to configure this.
* NTLM authentication for Microsoft Exchange is not supported by the new mailer library. Try using `basic authentication <https://learn.microsoft.com/en-us/exchange/client-developer/exchange-web-services/authentication-and-ews-in-exchange#basic-authentication>`_ instead.

See for more information: :ref:`email-smtp-config`.


Web server configuration
------------------------

* The recommended :ref:`nginx configuration<nginx-config>` changed.
