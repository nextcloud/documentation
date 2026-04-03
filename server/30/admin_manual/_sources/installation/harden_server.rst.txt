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

Passwords
---------
Storage of access tokens
^^^^^^^^^^^^^^^^^^^^^^^^

Upon successful authentication, Nextcloud issues an access token that clients will use for all future HTTP requests. This access token uniquely identifies a user and should not be stored on any system other than the client requesting it. The user password is also stored encrypted in the Nextcloud database. For encryption of the password, the token and an instance-specific secret is used.

Leakage of the access token can have negative security consequences. Depending on the data access by the actor, the risk here is different:

- An actor with access to only the access token can impersonate users and login as them.
- An actor with access to the access token, the Nextcloud config file, and the Nextcloud database can decrypt user passwords stored in the database.

Limit on password length
^^^^^^^^^^^^^^^^^^^^^^^^

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
consider secure enough for deployment is enabled. However, 
administrators should be aware that these previews are generated using PHP 
libraries written in C which might be vulnerable to attack vectors.

For high security deployments we recommend disabling the preview generation by 
setting the ``enable_previews`` switch to ``false`` in ``config.php``. As an 
administrator you are also able to manage which preview providers are enabled by 
modifying the ``enabledPreviewProviders`` option switch.

Disable Debug Mode
^^^^^^^^^^^^^^^^^^

Verify that ``debug`` is ``false`` in your ``config.php``. The default is ``false`` 
in new installations (or when not specified). It should not be enabled in production 
environments or outside of targeted troubleshooting situations. When enabled, things 
like server-wide WebDAV collection listings are permitted. It is intended for local 
development and usage in controlled environments only.

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
suitable configuration suited for your environment. To verify your
configuration you can use the free `Web TLS Profiler`_ service.
This service gives detailed error messages, if your server's TLS settings deviate
from the Mozilla Configuration. Another useful tool to check your server's
TLS configuration is the free `Qualys SSL Labs Test`_ which provides general 
information about the TLS settings.

Also ensure that HTTP compression is disabled to mitigate the BREACH attack.

Restrict admin actions to a specific range of IP addresses
----------------------------------------------------------

Configure ``allowed_admin_ranges`` in ``config.php`` to restrict the admin actions to trusted IP ranges.

This can be achieved with this kind of setting, usually using private IP ranges::

  'allowed_admin_ranges' => [
    '127.0.0.1/8',
    '192.168.0.0/16',
    'fd00::/8',
  ],

All requests originating from IP addresses outside of these ranges will not be able to execute admin actions.

Administrators connected from untrusted IP addresses will be able to use Nextcloud, but all admin specific actions will be hidden.

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
- ``X-Robots-Tag: noindex, nofollow``
	- Instructs search machines to not index these pages and not follow any links there.
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
.. _Qualys SSL Labs Test: https://www.ssllabs.com/ssltest/
.. _Web TLS Profiler: https://tlsprofiler.danielfett.de/
.. _RFC 4086 ("Randomness Requirements for Security"): https://tools.ietf.org/html/rfc4086#section-5.2

Connections to remote servers
-----------------------------

Some functionalities require the Nextcloud server to be able to connect remote systems via https/443.
This pragraph also includes the data which is being transmitted to the Nextcloud GmbH.
Depending on your server setup, these are the possible connections:

- nextcloud.com, startpage.com, eff.org, edri.org
	- `optional (config)`_
	- for checking the internet connection
- cloud.nextcloud.com
	- used for enterprise license monitoring
	- submitted data: subscription key, user count
- updates.nextcloud.com
	- to check for available Nextcloud server updates
	- submitted data: server version, subscription key, install time, instance id, instance size
- apps.nextcloud.com
	- to check for available apps and their updates 
	- submitted data: subscription key
- github.com, objects.githubusercontent.com
	- to download Nextcloud standard apps
- push-notifications.nextcloud.com
	- sending push notifications to mobile clients
	- submitted data: unique device identifier, public key, push token
- pushfeed.nextcloud.com
	- optional
	- checking for updates to be shown in the Nextcloud Announcements app
- lookup.nextcloud.com
	- optional
	- for updating and lookups to the federated sharing addressbook
	- submitted data: *pending*
- surveyserver.nextcloud.com
	- optional
	- if the admin has agreed to share anonymized server data
	- submitted data: statistical data. see here for the `detailed field list`_
- Any remote Nextcloud server that is connected with federated sharing

.. _optional (config): https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#has-internet-connection
.. _detailed field list : https://github.com/nextcloud/survey_client


Setup fail2ban
--------------

Exposing your server to the internet will inevitably lead to the exposure of the 
services running on the internet-exposed ports to brute force login attempts.

This guide will enable blocking of the originating IP addresses at an operating
system level, so the webserver, PHP and the database do not need to handle this
unnecessary traffic at all.

Nextcloud prerequisites
^^^^^^^^^^^^^^^^^^^^^^^

Nextcloud logs failed login attempts in ``nextcloud.log`` with log level ``2``,
so you need to define a ``loglevel`` of ``2`` or less in ``config.php``.

Make sure your ``nextcloud.log`` is writeable by your webserver user, possibly by
defining a correct ``logfilemode`` in ``config.php``.

Perform a bad login attempt and check whether it does get logged to ``nextcloud.log``.

Note that ``audit.log`` (if enabled) currently only logs successful logins and cannot be used.

Fail2ban introduction
^^^^^^^^^^^^^^^^^^^^^

Fail2ban is a service that uses iptables to automatically drop connections for a
pre-defined amount of time from IPs that continuously failed to authenticate to 
the configured services.

In order to setup fail2ban, you first need to download and install it on your
server. Downloads for several distributions can be found on `fail2ban download
page`_. It is often available from most distributions' package managers (e.g.
``apt-get``).

The standard path for fail2ban's configuration is ``/etc/fail2ban``.

Setup a filter and a jail for Nextcloud
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

A filter defines regex rules to identify when users fail to authenticate on 
Nextcloud's user interface, WebDAV, or use an untrusted domain to access the 
server.

Create a file in ``/etc/fail2ban/filter.d`` named ``nextcloud.conf`` with the 
following contents::

  [Definition]
  _groupsre = (?:(?:,?\s*"\w+":(?:"[^"]+"|\w+))*)
  failregex = ^\{%(_groupsre)s,?\s*"remoteAddr":"<HOST>"%(_groupsre)s,?\s*"message":"Login failed:
              ^\{%(_groupsre)s,?\s*"remoteAddr":"<HOST>"%(_groupsre)s,?\s*"message":"Two-factor challenge failed:
              ^\{%(_groupsre)s,?\s*"remoteAddr":"<HOST>"%(_groupsre)s,?\s*"message":"Trusted domain error.
  datepattern = ,?\s*"time"\s*:\s*"%%Y-%%m-%%d[T ]%%H:%%M:%%S(%%z)?"

The jail file defines how to handle the failed authentication attempts found by 
the Nextcloud filter.

Create a file in ``/etc/fail2ban/jail.d`` named ``nextcloud.local`` with the 
following contents::

  [nextcloud]
  backend = auto
  enabled = true
  port = 80,443
  protocol = tcp
  filter = nextcloud
  maxretry = 3
  bantime = 86400
  findtime = 43200
  logpath = /path/to/data/directory/nextcloud.log

Ensure to replace ``logpath`` with your installation's ``nextcloud.log`` 
location. If you are using ports other than ``80`` and ``443`` for your 
Web server you should replace those too. The ``bantime`` and ``findtime`` are 
defined in seconds.

Restart the fail2ban service. You can check the status of your Nextcloud jail by 
running::

  fail2ban-client status nextcloud

If you need to unban certain IP addresses (``1.2.3.4`` in this example),
you may do so by issuing::

  fail2ban-client unban 1.2.3.4

There may be scenarios where you want to more permantently ban certain IP
addresses that repeatedly generate bad login attempts (or other attacks) by
using fail2ban's ``recidive`` feature.

.. _fail2ban download page: https://www.fail2ban.org/wiki/index.php/Downloads
