===============================
Hardening and Security Guidance
===============================

ownCloud aims to ship with secure defaults that do not need to get modified by 
administrators. However, in some cases some additional security hardening can 
only be applied in scenarios were the administrator have complete control over 
the ownCloud instance.

This document lists some security hardenings which require manual interaction by 
administrators. The whole document content is based on the assumption that you 
run ownCloud Server on Apache2 on a Linux environment.

.. note:: ownCloud will warn you in the administration interface if some 
   critical security-relevant options are missing. However, it is still up to 
   the server administrator to review and maintain system security.

Limit on Password Length
------------------------

ownCloud uses the bcrypt algorithm and thus for security and performance reasons,
e.g. Denial of Service as CPU demand increases exponentially, it only verifies
the first 72 characters of passwords. This applies to all passwords that you use
in ownCloud: user passwords, passwords on link shares, and passwords on external
shares.

Operating system
----------------

Give PHP read accesss to ``/dev/urandom``
*****************************************
ownCloud uses a `RFC 4086 ("Randomness Requirements for Security")`_ compliant 
mixer to generate cryptographically secure pseudo-random numbers. This means 
that when generating a random number ownCloud will request multiple random 
numbers from different sources and derive from these the final random number.

The random number generation also tries to request random numbers from 
``/dev/urandom``, thus it is **highly recommended** to configure your setup in
such a way that PHP is able to read random data from it. Not granting PHP access
to ``/dev/urandom`` may make your random numbers predictable and may make your
ownCloud instance insecure as attackers might predict password reset tokens or
other sensitive data.

Enable hardening modules such as SELinux
****************************************
It is highly recommend to enable hardening modules such as SELinux where 
possible. See :doc:`../installation/selinux_configuration` to learn more about 
SELinux.

Use newest PHP version
**********************
Some security features and hardenings in PHP are only available in the latest
PHP release and thus it is recommended to run the latest PHP version. You can
find the latest version on http://php.net/.

Some Linux distributions backport security patches, but this is not reliable as
some get missed, or the backports are years late. It is always best to run the
latest PHP version.

Deployment
----------

Move data directory outside of the web root
*******************************************
It is highly recommended to move the data directory (where ownCloud stores its 
data) outside of the web root (i.e. outside of ``/var/www``) It is possible to 
do this by moving the folder manually, and then adjusting the 
``'datadirectory'`` parameter in ``config.php``.

Disable preview image generation
********************************
ownCloud is able to generate preview images of common filetypes such as images 
or text files. By default the preview generation for some file types that we 
consider secure enough for deployment is enabled by default. However, 
administrators should be aware that these previews are generated using PHP 
libraries written in C which might be vulnerable to vulnerable attack vectors.

For high security deployments we recommend disabling the preview generation by 
setting the ``enable_previews`` switch to ``false`` in ``config.php``. As an 
administrator you are also able to manage which preview providers are enabled by 
modifying the ``enabledPreviewProviders`` option switch.

Use HTTPS
---------
Using ownCloud without using an encrypted HTTPS connection might allow attackers 
in a man-in-the-middle (MITM) situation to intercept your users data and 
passwords. Thus ownCloud always recommends to setup ownCloud behind HTTPS.

How to setup HTTPS on your web server depends on your setup, we recommend to 
check your distribution's vendor information on how to configure and setup 
HTTPS.

Redirect all unencrypted traffic to HTTPS
*****************************************
To redirect all HTTP traffic to HTTPS administrators are encouraged to issue a 
permanent redirect using the 301 status code, when using Apache this can be 
achieved by a setting such as the following in the Apache VirtualHosts config:

.. code-block:: none

  <VirtualHost *:80>
     ServerName cloud.owncloud.com
     Redirect permanent / https://cloud.owncloud.com/
  </VirtualHost>

Enable HTTP Strict Transport Security
*************************************
While redirecting all traffic to HTTPS is already a good start it will often not 
completely prevent man-in-the-middle attacks for a regular user. Thus 
administrators are encouraged to set the HTTP Strict Transport Security header 
which will instruct browsers to not allow any connection to the ownCloud 
instance anymore using HTTPS and a invalid certificate warning will often not be 
able to get bypassed.

This can be achieved by setting the following settings within the Apache 
VirtualHost file:

.. code-block:: none

  <VirtualHost *:443>
     ServerName cloud.owncloud.com
     Header always add Strict-Transport-Security "max-age=15768000; includeSubDomains; preload"
  </VirtualHost>

Be aware that above policy will also apply for all subdomains, if you don't
have HTTPS properly configured on all subdomains you mut remove the ``includeSubdomains``
part.

Furthermore it shall be noted that this requires that the ``mod_headers`` 
extension is installed.

Proper SSL configuration
************************
Default SSL configurations by web servers are often not state of the art and 
require fine-tuning for an optimal performance and security experience. The 
available SSL ciphers and options depends completely on your environment and 
thus giving a generic recommendation is not really possible.

We recommend to use the `Mozilla SSL Configuration Generator`_ to generate a 
suitable configuration suited for your environment, furthermore the free `Qualys 
SSL Labs Tests`_ give a good guidance whether the SSL server was correctly 
configured.

Use a dedicated domain for ownCloud
-----------------------------------
Administrators are encouraged to install ownCloud on a dedicated domain such as 
cloud.domain.tld instead of domain.tld to gain all the benefits offered by the 
Same-Origin-Policy.

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

However, these headers are added by the applications code in PHP and thus not 
served on static resources and rely on the fact that there is no way to bypass 
the intended response code path.

For optimal security, administrators are encouraged to serve these basic HTTP 
headers by the web server to enforce them on response.

Apache has to be configured to use the ``.htaccess`` file as well as the following Apache 
modules needs to be enabled:

- mod_headers
- mod_env

For nginx, please see the nginx configuration example :ref:`nginx_configuration_example`

Administrators can verify whether this security change is active by accessing a 
static resource served by the web server and verify that above mentioned 
security headers are shipped.

.. _Mozilla SSL Configuration Generator: https://mozilla.github.io/server-side-tls/ssl-config-generator/
.. _Qualys SSL Labs Tests: https://www.ssllabs.com/ssltest/
.. _RFC 4086 ("Randomness Requirements for Security"): https://tools.ietf.org/html/rfc4086#section-5.2
