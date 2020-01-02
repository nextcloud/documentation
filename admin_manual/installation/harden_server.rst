===============================
Hardening and security guidance
===============================

Nextcloud aims to ship with secure defaults that do not need to get modified by 
administrators. However, in some cases some additional security hardening can be 
applied in scenarios were the administrator has complete control over 
the Nextcloud instance. This page assumes that you run Nextcloud Server on Apache2 
in a Linux environment.

.. note:: Nextcloud will warn you in the administration interface if some 
   critical security-relevant options are missing. However, it is still up to 
   the server administrator to review and maintain system security.
   
Limit on password length
------------------------

Nextcloud uses the bcrypt algorithm, and thus for security and performance 
reasons, e.g. Denial of Service as CPU demand increases exponentially, it only 
verifies the first 72 characters of passwords. This applies to all passwords 
that you use in Nextcloud: user passwords, passwords on link shares, and 
passwords on external shares.

Operating system
----------------

.. _dev-urandom-label:

Give PHP read access to ``/dev/urandom``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Nextcloud uses a `RFC 4086 ("Randomness Requirements for Security")`_ compliant 
mixer to generate cryptographically secure pseudo-random numbers. This means 
that when generating a random number Nextcloud will request multiple random 
numbers from different sources and derive from these the final random number.

The random number generation also tries to request random numbers from 
``/dev/urandom``, thus it is highly recommended to configure your setup in such 
a way that PHP is able to read random data from it.

.. note:: When having an ``open_basedir`` configured within your ``php.ini`` file,
   make sure to include ``/dev/urandom``.

Enable hardening modules such as SELinux
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

It is highly recommended to enable hardening modules such as SELinux where 
possible. See :doc:`../installation/selinux_configuration` to learn more about 
SELinux.

Deployment
----------

Place data directory outside of the web root
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

It is highly recommended to place your data directory outside of the Web root 
(i.e. outside of ``/var/www``). It is easiest to do this on a new 
installation.

.. Doc on moving data dir coming soon
.. You may also move your data directory on an existing 
.. installation; see :doc:``

Disable preview image generation
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Nextcloud is able to generate preview images of common filetypes such as images 
or text files. By default the preview generation for some file types that we 
consider secure enough for deployment is enabled by default. However, 
administrators should be aware that these previews are generated using PHP 
libraries written in C which might be vulnerable to attack vectors.

For high security deployments we recommend disabling the preview generation by 
setting the ``enable_previews`` switch to ``false`` in ``config.php``. As an 
administrator you are also able to manage which preview providers are enabled by 
modifying the ``enabledPreviewProviders`` option switch.

.. _use_https_label:

Use HTTPS
---------

Using Nextcloud without using an encrypted HTTPS connection opens up your server 
to a man-in-the-middle (MITM) attack, and risks the interception of user data 
and passwords. It is a best practice, and highly recommended, to always use 
HTTPS on production servers, and to never allow unencrypted HTTP.

How to setup HTTPS on your Web server depends on your setup; please consult the 
documentation for your HTTP server. The following examples are for Apache.

Redirect all unencrypted traffic to HTTPS
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To redirect all HTTP traffic to HTTPS administrators are encouraged to issue a 
permanent redirect using the 301 status code. When using Apache this can be 
achieved by a setting such as the following in the Apache VirtualHosts 
configuration::

  <VirtualHost *:80>
     ServerName cloud.nextcloud.com
     Redirect permanent / https://cloud.nextcloud.com/
  </VirtualHost>

.. _enable-hsts-label:

Enable HTTP Strict Transport Security
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

While redirecting all traffic to HTTPS is good, it may not completely prevent 
man-in-the-middle attacks. Thus administrators are encouraged to set the HTTP 
Strict Transport Security header, which instructs browsers to not allow any 
connection to the Nextcloud instance using HTTP, and it attempts to prevent site 
visitors from bypassing invalid certificate warnings.

This can be achieved by setting the following settings within the Apache 
VirtualHost file::

 <VirtualHost *:443>
   ServerName cloud.nextcloud.com
     <IfModule mod_headers.c>
       Header always set Strict-Transport-Security "max-age=15552000; includeSubDomains"
     </IfModule>
  </VirtualHost>

.. warning::
   We recommend the additional setting ``; preload`` to be added to that header.
   Then the domain will be added to a hardcoded list that is shipped with all
   major browsers and enforce HTTPS upon those domains. See the `HSTS preload
   website for more information <https://hstspreload.org/>`_. Due to the policy
   of this list you need to add it to the above example for yourself once you
   are sure that this is what you want. `Removing the domain from this list
   <https://hstspreload.org/#removal>`_ could take some months until it reaches
   all installed browsers.

This example configuration will make all subdomains only accessible via HTTPS.
If you have subdomains not accessible via HTTPS, remove ``includeSubDomains``.

This requires the ``mod_headers`` extension in Apache.

Proper SSL configuration
^^^^^^^^^^^^^^^^^^^^^^^^

Default SSL configurations by Web servers are often not state-of-the-art, and 
require fine-tuning for an optimal performance and security experience. The 
available SSL ciphers and options depend completely on your environment and 
thus giving a generic recommendation is not really possible.

We recommend using the `Mozilla SSL Configuration Generator`_ to generate a 
suitable configuration suited for your environment, and the free `Qualys SSL Labs Tests`_
gives good guidance on whether your SSL server is correctly
configured.

Also ensure that HTTP compression is disabled to mitigate the BREACH attack.

Use a dedicated domain for Nextcloud
------------------------------------

Administrators are encouraged to install Nextcloud on a dedicated domain such as 
cloud.domain.tld instead of domain.tld to gain all the benefits offered by the 
Same-Origin-Policy.

Ensure that your Nextcloud instance is installed in a DMZ
---------------------------------------------------------

As Nextcloud supports features such as Federated File Sharing we do not consider
Server Side Request Forgery (SSRF) part of our threat model. In fact, given all our
external storage adapters this can be considered a feature and not a vulnerability.

This means that a user on your Nextcloud instance could probe whether other hosts
are accessible from the Nextcloud network. If you do not want this you need to 
ensure that your Nextcloud is properly installed in a segregated network and proper 
firewall rules are in place.

Serve security related headers by the Web server
------------------------------------------------

Basic security headers are served by Nextcloud already in a default environment. 
These include:

- ``X-Content-Type-Options: nosniff``
	- Instructs some browsers to not sniff the mimetype of files. This is used for example to prevent browsers from interpreting text files as JavaScript.
- ``X-XSS-Protection: 1; mode=block``
	- Instructs browsers to enable their browser side Cross-Site-Scripting filter.
- ``X-Robots-Tag: none``
	- Instructs search machines to not index these pages.
- ``X-Frame-Options: SAMEORIGIN``
	- Prevents embedding of the Nextcloud instance within an iframe from other domains to prevent Clickjacking and other similar attacks.
- ``Referrer-Policy: no-referrer``
	- The default `no-referrer` policy instructs the browser not to send referrer information along with requests to any origin.

These headers are hard-coded into the Nextcloud server, and need no intervention 
by the server administrator.

For optimal security, administrators are encouraged to serve these basic HTTP 
headers by the Web server to enforce them on response. To do this Apache has to 
be configured to use the ``.htaccess`` file and the following Apache 
modules need to be enabled:

- mod_headers
- mod_env

Administrators can verify whether this security change is active by accessing a 
static resource served by the Web server and verify that the above mentioned 
security headers are shipped.

.. _Mozilla SSL Configuration Generator: https://mozilla.github.io/server-side-tls/ssl-config-generator/
.. _Qualys SSL Labs Tests: https://www.ssllabs.com/ssltest/
.. _RFC 4086 ("Randomness Requirements for Security"): https://tools.ietf.org/html/rfc4086#section-5.2

Connections to remote servers
-----------------------------

Some Nextcloud functionality requires connecting to remote servers. Depending on your server setup those are possible connections:

- www.nextcloud.com, www.startpage.com, www.eff.org, www.edri.org for checking the internet connection
- apps.nextcloud.com for the available apps
- updates.nextcloud.com for Nextcloud updates
- lookup.nextcloud.com For updating and lookup in the federated sharing addressbook
- push-notifications.nextcloud.com for sending push notifications to mobile clients
- surveyserver.nextcloud.com if the admin has agreed to share anonymized data
- Any remote Nextcloud server that is connected with federated sharing
