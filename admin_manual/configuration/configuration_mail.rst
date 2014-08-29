Mail Configuration
==================
ownCloud does not contain a full email program but contains some parameters to
allow to send e.g. password reset email to the users. This function relies on
the `PHPMailer library <https://github.com/PHPMailer/PHPMailer>`_. To
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
to enter the name or IP address of the server, optionally followed by a colon
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

If the SMTP server accepts insecure connections, the default setting can be
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
The sendmail binary (**/usr/sbin/sendmail**) is usually part of that system.
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

To test your email configuration, save your email address in your personal
settings and then use the **Send email** button in *Email Server* section
of the Admin settings page.

Using Email Templates
---------------------

As an added convenience to administrators, ownCloud provides several Email templates that you can use for sending messages to users.

#.. figure:: ../images/remote_shares.png

Found on the Admin page, you can choose from the following templates:

* Sharing email (http) -- You can use this template to send emails to users about sharing links.

* Sharing email -- You can use this template to send emails to users about sharing files.

* Lost password mail -- When managing users, you can use this template to send emails to users about lost password recovery.

* Activity notification mail -- You can use this template to send emails to users detailing their ownCloud activity.

In addition to providing the Email templates, this feature enables you to apply any preconfigured themes to the email.

To modify an email template to users:

1. Access the Admin page.

2. Scroll to the Mail templates section.

3. Select a template from the drop-down menu.

4. Make any desired modifications to the template.

   .. note:: You can edit the templates directly in the template text box or you can copy and paste them to a text editor for modification and then copy and paste them back to the template text box for use when you are done.

5. Click ``Save`` to the file modifications.

   Once complete, the files are sent to users who choose to receive notifications through email.

   .. note:: ownCloud populates the variables with usernames and filenames prior to sending the email.

Troubleshooting
----------------

**Question**: Why is my web domain different from my mail domain?

**Answer**: The default domain name used for the sender address is the hostname where your ownCloud installation is served.  If you have a different mail domain name you can override this behavior by setting the following configuration parameter:

.. code-block:: php

  <?php

    "mail_domain" => "example.com",

This setting results in every email sent by ownCloud (for example, the password reset email) having the domain part of the sender address appear as follows::

  no-reply@example.com

**Question**: How can I find out if a SMTP server is reachable?

**Answer**: Use the ping command to check the server availability::

  ping smtp.server.dom

::

  PING smtp.server.dom (ip-address) 56(84) bytes of data.
  64 bytes from your-server.local.lan (192.168.1.10): icmp_req=1 ttl=64 time=3.64 ms
  64 bytes from your-server.local.lan (192.168.1.10): icmp_req=2 ttl=64 time=0.055 ms
  64 bytes from your-server.local.lan (192.168.1.10): icmp_req=3 ttl=64 time=0.062 ms

**Question**: How can I find out if the SMTP server is listening on a specific TCP port?

**Answer**: SMTP servers usually listen on port **25/tcp** (smtp).  In
rare circumstances the SMTP server also listens on the outdated port **465/tcp** (smtps). You can use the ``telnet`` command to determining if a port is available::

  telnet smtp.domain.dom 25

::

  Trying 192.168.1.10...
  Connected to smtp.domain.dom.
  Escape character is '^]'.
  220 smtp.domain.dom ESMTP Exim 4.80.1 Tue, 22 Jan 2013 22:28:14 +0100

**Question**: How can I determine if the SMTP server supports the outdated SMTPS protocol?

**Answer**: A good indication that the SMTP server supports the SMTPS protocol is that it is listening on port **465/tcp**. See the previous answer to use the ``telnet`` command for checking the port availability.

**Question**: How can I determine if the SMTP server supports the TLS protocol?

**Answer**: SMTP servers usually announce the availability of STARTTLS immediately after a connection has been established. You can easily check this using the ``telnet`` command.

.. note:: You must enter the marked lines to obtain the information displayed.

::

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

**Question**: How can I determine which authentication types or methods the SMTP server supports?

**Answer**: SMTP servers usually announce the available authentication types or methods immediately following the establishment of a connection. You can easily check this using the telnet command.

.. note:: You must enter the marked lines to obtrain the information displayed.

::

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

Enabling Debug Mode
-------------------

If you are unable to send email, it might be useful to activate further debug messages by enabling the mail_smtpdebug parameter:

.. code-block:: php

  <?php

    "mail_smtpdebug" => true,

.. note:: Immediately after pressing the **Send email** button, as described before, several **SMTP -> get_lines(): ...** messages appear on the screen.  This is expected behavior and can be ignored.

