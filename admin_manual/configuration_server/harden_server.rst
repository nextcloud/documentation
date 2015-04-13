===============================
Hardening and Security Guidance
===============================
ownCloud aims to ship with secure defaults that do not need to get modified by administrators. However, in some cases
some additional security hardening can only be applied in scenarios were the administrator have complete control over the
ownCloud instance.

This document lists some security hardenings which require manual interaction by administrators. The whole document content
is based on the assumption that you run ownCloud Server on Apache2 on a Linux environment.

.. note:: ownCloud will warn you in the administration interface if some critical security relevant options are missing,
          however in some cases that are considered second level as defense administrators are encouraged to check these
          hardenings manually.

Operating system
----------------

Give PHP read accesss to ``/dev/urandom``
*****************************************
ownCloud uses a `RFC 4086 ("Randomness Requirements for Security")`_ compliant mixer to generate cryptographically secure
pseudo-random numbers. This means that when generating a random number ownCloud will request multiple random numbers from
different sources and deriviate from these the final random number.

The random number generation also tries to request random numbers from ``/dev/urandom``, thus it is highly recommended to
configure your setup in such a way that PHP is able to read random data from it.

Deployment
----------

Move data directory outside of the web root
*******************************************
It is highly recommended to move the data directory (where ownCloud stores its data) outside of the web root (i.e. outside
of ``/var/www``), this can be done by modifying the ``datadirectory`` switch in the configuration file. It is possible to
do this also after an instance has been installed by moving the folder manually.

Use HTTPS
---------
Using ownCloud without using an encrypted HTTPS connection might allow attackers in a man-in-the-middle (MITM) situation
to intercept your users data and passwords. Thus ownCloud always recommends to setup ownCloud behind HTTPS.

How to setup HTTPS on your web server depends on your setup, we recommend to check your distributions vendor information
on how to configure and setup HTTPS.

Redirect all unencrypted traffic to HTTPS
*****************************************
To redirect all HTTP traffic to HTTPS administrators are encouraged to issue a permanent redirect using the 301 statuscode,
when using Apache this can be achieved by a setting such as the following in the Apache VirtualHosts config:

.. code-block:: none

  <VirtualHost *:80>
     ServerName cloud.owncloud.com
     Redirect permanent / https://cloud.owncloud.com/
  </VirtualHost>

Enable HTTP Strict Transport Security
*************************************
While redirecting all traffic to HTTPS is already a good start it will often not completely prevent man-in-the-middle attacks
for a regular user. Thus administrators are encouraged to set the HTTP Strict Transport Security header which will instruct
browsers to not allow any connection to the ownCloud instance anymore using HTTPS and a invalid certificate warning will
often not be able to get bypassed.

This can be achieved by setting the following settings within the Apache VirtualHost file:

.. code-block:: none

  <VirtualHost *:443>
     ServerName cloud.owncloud.com
     Header always add Strict-Transport-Security "max-age=15768000"
  </VirtualHost>

It shall be noted that this requires that the ``mod_headers`` extension to be installed.

Proper SSL configuration
************************
Default SSL configurations by web servers are often not state of the art and require fine-tuning for an optimal performance
and security experience. The available SSL ciphers and options depends completely on your environment and thus giving a
generic recommendation is not really possible.

We recommend to use the `Mozilla SSL Configuration Generator`_ to generate a suitable configuration suited for your environment,
furthermore the free `Qualys SSL Labs Tests`_ give a good guidance whether the SSL server was correctly configured.

Use a dedicated domain for ownCloud
-----------------------------------
Administrators are encouraged to install ownCloud on a dedicated domain such as cloud.domain.tld instead of domain.tld to
gain all the benefits offered by the Same-Origin-Policy.

Serve security related Headers by the web server
------------------------------------------------
Basic security headers are served by ownCloud already in a default environment. These includes:

- ``X-Content-Type-Options: nosniff``
	- Instructs some browsers to not sniff the mimetype of files. This is used for example to prevent browsers to interpret text files as JavaScript.
- ``X-XSS-Protection: 1; mode=block``
	- Enforces the browsers to enable their browser side Cross-Site-Scripting filter.
- ``X-Robots-Tag: none``
	- Instructs search machines to not index these page.
- ``X-Frame-Options: SAMEORIGIN``
	- Prevents to embed the ownCloud instance within an iframe from other domains to prevent Clickjacking and other similiar attacks.

However, these headers are added by the applications code in PHP and thus not served on static resources and rely on the
fact that there is no way to bypass the intended response code path.

For optimal security administrators are encouraged to serve these basic HTTP headers by the web server to enforce them on
response. To do this Apache has to be configured to use the ``.htaccess`` file as well as the following Apache modules
needs to be enabled:

- mod_headers
- mod_env

Administrators can verify whether this security change is active by accessing a static resource served by the web server
and verify that above mentioned security headers are shipped.

.. _Mozilla SSL Configuration Generator: https://mozilla.github.io/server-side-tls/ssl-config-generator/
.. _Qualys SSL Labs Tests: https://www.ssllabs.com/ssltest/
.. _RFC 4086 ("Randomness Requirements for Security"): https://tools.ietf.org/html/rfc4086#section-5.2
