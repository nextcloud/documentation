=============================
Using 2 Factor Authentication
=============================

Two Factor Authentication (2FA) is a way to protect your Nextcloud account
against unauthorized access. It works by requiring two different 'proofs' of
your identity. For example, *something you know* (like a password) and 
*something you have* like a physical key. Typically, the first factor is a
password like you already have and the second can be a text message you
receive or a code you generate on your phone or another device
(*something you have*). Nextcloud supports a variety of 2nd factors and
more can be added.

Once a Two Factor Authentication app has been enabled by your administrator
you can enable and configure it in :doc:`userpreferences`. Below you can
see how.

Configuring 2 Factor Authentication
===================================
In your Personal Settings look up the Second-factor Auth setting. In this
example this is TOTP, a Google Authenticator compatible time based code.
  
.. figure:: images/totp_enable.png
     :alt: TOTP configuration.

You will see your secret and a QR code which can be scanned by the TOTP app
on your phone (or another device). Depending on the app or tool, type in the
code or scan the QR and your device will show a login code which changes
every 30 seconds.

Logging in with 2 Factor Authentication
=======================================
After you have logged out and need to log in again, you will see a
*2FA challenge*, a request to enter the TOTP code in your browser.
  
.. figure:: images/totp_login_1.png
     :alt: TOTP challenge at login.

Click on *Authenticate with a TOTP app* and enter your code:
  
.. figure:: images/totp_login_2.png
     :alt: Entering TOTP code at login.

If the code was correct you will be redirected to your Nextcloud account.
You will not have to enter the code again in this browser unless you clear
the browser cookies.

.. note:: Since the code is time-based, it’s important that your server’s and
your smartphone’s clock are almost in sync. A time drift of a few seconds
won’t be a problem.

Using clients with 2 Factor Authentication
==========================================
Once you have enabled 2FA, your clients will no longer be able to connect
unless they also have support for 2 Factor Authentication. However, you can
generate device specific passwords for them. See :doc:`session_management` for
more information on how to do this.
