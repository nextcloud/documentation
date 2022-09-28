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
suitable configuration suited for your environment. To verify your
configuration you can use the free `Web TLS Profiler`_ service.
This service gives detailed error messages, if your server's TLS settings deviate
from the Mozilla Configuration. Another useful tool to check your server's
TLS configuration is the free `Qualys SSL Labs Test`_ which provides general 
information about the TLS settings.

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
.. _Qualys SSL Labs Test: https://www.ssllabs.com/ssltest/
.. _Web TLS Profiler: https://tlsprofiler.danielfett.de/
.. _RFC 4086 ("Randomness Requirements for Security"): https://tools.ietf.org/html/rfc4086#section-5.2

Connections to remote servers
-----------------------------

Some Nextcloud functionality requires connecting to remote servers. Depending on 
your server setup those are possible connections:

- www.nextcloud.com, www.startpage.com, www.eff.org, www.edri.org for checking the internet connection
- apps.nextcloud.com for the available apps
- updates.nextcloud.com for Nextcloud updates
- lookup.nextcloud.com For updating and lookup in the federated sharing addressbook
- push-notifications.nextcloud.com for sending push notifications to mobile clients
- surveyserver.nextcloud.com if the admin has agreed to share anonymized data
- Any remote Nextcloud server that is connected with federated sharing

Setup fail2ban
--------------

Exposing your server to the internet will inevitably lead to the exposure of the 
services running on the internet-exposed ports to brute force login attempts.

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

.. _fail2ban download page: https://www.fail2ban.org/wiki/index.php/Downloads

CrowdSec
--------

CrowdSec offers a crowd-based cybersecurity suite, designed to protect your online services, a dashboard to visualize & act upon threats and a TIP (Threat Intel Platform) to block IP known to carry aggressions.

CrowdSec is an open-source and collaborative security stack leveraging the crowd power. Analyze behaviors, respond to attacks & share signals across the community.
    
Setup CrowdSec
^^^^^^^^^^^^^^

Following Ibracorp's and CrowdSec's documentation at ``https://docs.ibracorp.io/crowdsec/crowdsec/unraid/traefik-bouncer/nextcloud-collection`` and ``https://hub.crowdsec.net/author/crowdsecurity/collections/nextcloud``.

The following captured from ``https://docs.crowdsec.net/docs/getting_started/install_crowdsec``

CrowdSec can be used with, or replace Fail2ban with the following.

Install CrowdSec (Linux)
^^^^^^^^^^^^^^^^^^^^^^^^^

For those that prefer hands-on approach, you can as well manually install crowdsec.

Install repositories

Installing our repositories allows you to access the latest packages of CrowdSec and bouncers.

We are using packagecloud.io service. While curl | sudo bash can be convenient for some, alternative installation methods are available.

    Debian/Ubuntu
    EL/Centos7
    EL/Centos Stream 8
    Amzn Linux 2
    OpenWRT
    CloudLinux

``curl -s https://packagecloud.io/install/repositories/crowdsec/crowdsec/script.deb.sh | sudo bash``

Install CrowdSec

    Debian/Ubuntu
    EL/Centos7
    EL/Centos Stream 8
    Amzn Linux 2
    OpenWRT
    CloudLinux

``apt install crowdsec``

You now have CrowdSec running ! You can move forward and install a bouncer, or take a tour of the software beforehand !

Directories:

    The application lives in the folder \etc\crowdsec using less than 0.5 MBytes of storage.
    The data is stored in the folder \lib\crowdsec\data and needs around 97 MBytes of storage.

Keep in mind that a CrowdSec package is only in charge of the "detection", and won't block anything on its own. You need to deploy a bouncer to "apply" decisions.

Install a bouncer
^^^^^^^^^^^^^^^^^^

    Debian/Ubuntu
    EL/Fedora/Centos7
    EL/Fedora/Centos8
    Amzn Linux 2
    OpenWRT
    CloudLinux

``apt install crowdsec-firewall-bouncer-iptables``

While we're suggesting the most common firewall bouncer, check our hub for more of them. Find a bouncer directly for your application (nginx, php, wordpress) or your providers (cloudflare, AWS/GCP/...)

Running CrowdSec on raspberry pi os/raspbian
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Please keep in mind that raspberry pi OS is designed to work on all raspberry pi versions. Even if the port target is known as armhf, it's not exactly the same target as the debian named armhf port.

The best way to have a CrowdSec version for such an architecture is to do:

    install golang (all versions from 1.16 will do)
    export GOARCH=arm
    export CGO=1
    Update the GOARCH variable in the Makefile to arm
    install the arm gcc cross compiler (On debian the package is gcc-arm-linux-gnueabihf)
    Compile CrowdSec using the usual make command

``hhttps://docs.ibracorp.io/crowdsec/crowdsec/docker-compose``
Docker CrowdSec Install
^^^^^^^^^^^^^^^^^^^^^^^

Create CrowdSec shared log folder
``sudo mkdir /var/log/crowdsec; sudo chown -R $USER:$USER /var/log/crowdsec``
Create the CrowdSec appdata folder
``sudo mkdir /opt/appdata/crowdsec``
Create docker-compose.yml
``version: "3.4"

services:
  crowdsec:
    image: crowdsecurity/crowdsec
    container_name: crowdsec
    expose:
      - 8080
    environment:
      PGID: "1000"
    volumes:
      - /opt/appdata/crowdsec/data:/var/lib/crowdsec/data
      - /opt/appdata/crowdsec:/etc/crowdsec
      - /var/log/auth.log:/var/log/auth.log:ro
      - /var/log/crowdsec:/var/log/crowdsec:ro
    restart: unless-stopped

networks:
  default:
    external: true
    name: proxy``
    
Start crowdsec
``sudo docker-compose up -d``

Docker Collection Install
^^^^^^^^^^^^^^^^^^^^^^^^^

This assumes that you have CrowdSec Running, and now we are going to add the collection.
     ^^^^^^^
     
Run a console command in your CrowdSec container
``docker exec -it crowdsec sh`` ---- Replace ``crowdsec`` with your docker name

``cscli collections install crowdsecurity/nextcloud``

Map your nextcloud logs to crowdsec shared folder
This assumes that you know how to enable logging, set your RP to allow real IP's in the logs and know how to troubleshoot.

``/shared/crowdsec:/mnt/user/appdata/shared/crowdsec/``

``docker-compose up -d nextcloud``

Edit your acquis.yml file in your CrowdSec's appdata folder (appdata/crowdsec) to add these lines : (don't leave any empty spaces)

---
filenames:
 - /var/log/crowdsec/nextcloud.log
labels:
  type: Nextcloud
Now restart CrowdSec
``docker-compose up -d crowdsec``

Futhermore, continue at CrowdSec's hub to read about the collection ``https://hub.crowdsec.net/author/crowdsecurity/collections/nextcloud``
