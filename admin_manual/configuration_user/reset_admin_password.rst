===============================
Resetting a Lost Admin Password
===============================

The normal ways to recover a lost password are:

1. Click the password reset link on the login screen; this appears after a 
   failed login attempt. This works only if you have entered your email address 
   on your Personal page in the ownCloud Web interface, so that the ownCloud 
   server can email a reset link to you.

2. Ask another ownCloud server admin to reset it for you.

If neither of these is an option, then you have a third option, and that is 
using the ``occ`` command. ``occ`` is in the ``owncloud`` directory, for 
example ``/var/www/owncloud/occ``. ``occ`` has a command for resetting all 
user passwords, ``user:resetpassword``. It is best to run ``occ`` as the HTTP 
user, as in this example on Ubuntu Linux::

 $ sudo -u www-data /var/www/owncloud/occ user:resetpassword admin
 Enter a new password: 
 Confirm the new password: 
 Successfully reset password for admin
 
If your ownCloud username is not ``admin``, then substitute your ownCloud 
username.

You can find your HTTP user in your HTTP configuration file. These are the 
default Apache HTTP user:group on Linux distros:

* Centos, Red Hat, Fedora: apache:apache
* Debian, Ubuntu, Linux Mint: www-data:www-data
* openSUSE: wwwrun:www

See :doc:`../configuration_server/occ_command` to learn more about using the 
``occ`` command.
