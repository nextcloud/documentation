Mail Configuration
==================
ownCloud does not contain a full email program but contains some parameters to
allow to send e.g. password reset email to the users. This function relies on
the `PHPMailer library <http://sourceforge.net/projects/phpmailer/>`_. To
take advantage of this function it needs to be configured properly.


Requirements
------------
Different requirements need to be matched, depending on the environment which
you are using and the way how you want to send email. You can choose between
**SMTP**, **PHP mail**, **Sendmail** and **qmail**.

Parameters
----------

All parameters need to be set in :file:`config/config.php`

SMTP
~~~~
If you want to send email using a local or remote SMTP server it is necessary
to enter the name or ip address of the server, optionally followed by a colon
separated port number, e.g. **:425**. If this value is not given the default
port 25/tcp will be used unless you will change that by modifying the
**mail_smtpport** parameter. Multiple server can be entered separated by
semicolon:

.. code-block:: php

  <?php

    "mail_smtpmode"     => "smtp",
    "mail_smtphost"     => "smtp-1.server.dom;smtp-2.server.dom:425",
    "mail_smtpport"     => 25,

or

.. code-block:: php

  <?php

    "mail_smtpmode"     => "smtp",
    "mail_smtphost"     => "smtp.server.dom",
    "mail_smtpport"     => 425,

If a malware or SPAM scanner is running on the SMTP server it might be
necessary that you increase the SMTP timeout to e.g. 30s:

.. code-block:: php

  <?php

    "mail_smtptimeout"  => 30,

If the SMTP server accepts unsecure connections, the default setting can be
used:

.. code-block:: php

  <?php

  "mail_smtpsecure"   => '',

If the SMTP server only accepts secure connections you can choose between
the following two variants:

SSL
^^^
A secure connection will be initiated using the outdated SMTPS protocol
which uses the port 465/tcp:

.. code-block:: php

  <?php

    "mail_smtphost"     => "smtp.server.dom:465",
    "mail_smtpsecure"   => 'ssl',

TLS
^^^
A secure connection will be initiated using the STARTTLS protocol which
uses the default port 25/tcp:

.. code-block:: php

  <?php

    "mail_smtphost"     => "smtp.server.dom",
    "mail_smtpsecure"   => 'tls',

And finally it is necessary to configure if the SMTP server requires
authentication, if not, the default values can be taken as it.

.. code-block:: php

  <?php

    "mail_smtpauth"     => false,
    "mail_smtpname"     => "",
    "mail_smtppassword" => "",

If SMTP authentication is required you have to set the required username
and password and can optionally choose between the authentication types
**LOGIN** (default) or **PLAIN**.

.. code-block:: php

  <?php

    "mail_smtpauth"     => true,
    "mail_smtpauthtype" => "LOGIN",
    "mail_smtpname"     => "username",
    "mail_smtppassword" => "password",

PHP mail
~~~~~~~~
If you want to use PHP mail it is necessary to have an installed and working
email system on your server. Which program in detail is used to send email is
defined by the configuration settings in the **php.ini** file. (On \*nix
systems this will most likely be Sendmail.) ownCloud should be able to send
email out of the box.

.. code-block:: php

  <?php

    "mail_smtpmode"     => "php",
    "mail_smtphost"     => "127.0.0.1",
    "mail_smtpport"     => 25,
    "mail_smtptimeout"  => 10,
    "mail_smtpsecure"   => "",
    "mail_smtpauth"     => false,
    "mail_smtpauthtype" => "LOGIN",
    "mail_smtpname"     => "",
    "mail_smtppassword" => "",

Sendmail
~~~~~~~~
If you want to use the well known Sendmail program to send email, it is
necessary to have an installed and working email system on your \*nix server.
The sendmail binary (**/usr/sbin/sendmail**) is ususally part of that system.
ownCloud should be able to send email out of the box.

.. code-block:: php

  <?php

    "mail_smtpmode"     => "sendmail",
    "mail_smtphost"     => "127.0.0.1",
    "mail_smtpport"     => 25,
    "mail_smtptimeout"  => 10,
    "mail_smtpsecure"   => "",
    "mail_smtpauth"     => false,
    "mail_smtpauthtype" => "LOGIN",
    "mail_smtpname"     => "",
    "mail_smtppassword" => "",

qmail
~~~~~

If you want to use the qmail program to send email, it is necessary to have an
installed and working qmail email system on your server. The sendmail binary
(**/var/qmail/bin/sendmail**) will then be used to send email. ownCloud should
be able to send email out of the box.

.. code-block:: php

  <?php

    "mail_smtpmode"     => "qmail",
    "mail_smtphost"     => "127.0.0.1",
    "mail_smtpport"     => 25,
    "mail_smtptimeout"  => 10,
    "mail_smtpsecure"   => "",
    "mail_smtpauth"     => false,
    "mail_smtpauthtype" => "LOGIN",
    "mail_smtpname"     => "",
    "mail_smtppassword" => "",

Send a Test Email
-----------------

The only way to test your email configuration is, to force a login failure,
because a function to send a test email has not be implemented yet.

First make sure that you are using a full qualified domain and not an ip address in the ownCloud URL, like::

  http://my-owncloud-server.domain.dom/owncloud/

The password reset function fetches the domain name from that URL to build the
email sender address, e.g.::

  john@domain.dom

Next you need to enter your login and an *invalid* password. As soon as you
press the login button the login mask reappears and a **I’ve forgotten my password** link will be shown above the login field. Click on that link, re-enter your login and press the **Reset password** button - that's all.

Trouble shooting
----------------

How can I find out if a SMTP server is reachable?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Use the ping command to check the server availability::

  ping smtp.server.dom

::

  PING smtp.server.dom (ip-address) 56(84) bytes of data.
  64 bytes from your-server.local.lan (192.168.1.10): icmp_req=1 ttl=64 time=3.64 ms
  64 bytes from your-server.local.lan (192.168.1.10): icmp_req=2 ttl=64 time=0.055 ms
  64 bytes from your-server.local.lan (192.168.1.10): icmp_req=3 ttl=64 time=0.062 ms

How can I find out if the SMTP server is listening on a specific tcp port?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A SMTP server is usually listening on port **25/tcp** (smtp) and/or in
rare circumstances is also listening on the outdated port **465/tcp** (smtps).
You can use the telnet command to check if a port is available::

  telnet smtp.domain.dom 25

::

  Trying 192.168.1.10...
  Connected to smtp.domain.dom.
  Escape character is '^]'.
  220 smtp.domain.dom ESMTP Exim 4.80.1 Tue, 22 Jan 2013 22:28:14 +0100

How can I find out if a SMTP server supports the outdated SMTPS protocol?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
A good indication that a SMTP server supports the SMTPS protocol is that it
is listening on port **465/tcp**. How this can be checked has been described
previously.

How can I find out if a SMTP server supports the TLS protocol?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
A SMTP server usually announces the availability of STARTTLS right after a
connection has been established. This can easily been checked with the telnet command. You need to enter the marked lines to get the information displayed::

  telnet smtp.domain.dom 25

::

  Trying 192.168.1.10...
  Connected to smtp.domain.dom.
  Escape character is '^]'.
  220 smtp.domain.dom ESMTP Exim 4.80.1 Tue, 22 Jan 2013 22:39:55 +0100
  EHLO your-server.local.lan                                             # <<< enter this command
  250-smtp.domain.dom Hello your-server.local.lan [ip-address]
  250-SIZE 52428800
  250-8BITMIME
  250-PIPELINING
  250-AUTH PLAIN LOGIN CRAM-MD5
  250-STARTTLS                                                           # <<< STARTTLS is supported!
  250 HELP
  QUIT                                                                   # <<< enter this command
  221 smtp.domain.dom closing connection
  Connection closed by foreign host.

How can I find out which authentication types/methods a SMTP server supports?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
A SMTP server usually announces the available authentication types/methods
right after a connection has been established. This can easily been checked
with the telnet command. You need to enter the marked lines to get the
information displayed::

  telnet smtp.domain.dom 25

::

  Trying 192.168.1.10...
  Connected to smtp.domain.dom.
  Escape character is '^]'.
  220 smtp.domain.dom ESMTP Exim 4.80.1 Tue, 22 Jan 2013 22:39:55 +0100
  EHLO your-server.local.lan                                             # <<< enter this command
  250-smtp.domain.dom Hello your-server.local.lan [ip-address]
  250-SIZE 52428800
  250-8BITMIME
  250-PIPELINING
  250-AUTH PLAIN LOGIN CRAM-MD5                                          # <<< available Authentication types
  250-STARTTLS
  250 HELP
  QUIT                                                                   # <<< enter this command
  221 smtp.domain.dom closing connection
  Connection closed by foreign host.


Enable Debug Mode
~~~~~~~~~~~~~~~~~

If you are still not able to send email it might be useful to activate
further debug messages by setting the following parameter. Right after
you have pressed the **Reset password** button, as described before, a
lot of **SMTP -> get_lines(): ...** messages will be written on the
screen.

.. code-block:: php

  <?php

    "mail_smtpdebug" => true;

