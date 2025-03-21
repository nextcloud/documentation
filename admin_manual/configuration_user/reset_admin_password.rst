===============================
Resetting a lost admin password
===============================

The normal ways to recover a lost password are:

1. Click the password reset link on the login screen; this appears after a 
   failed login attempt. This works only if you have entered your email address 
   on your Personal page in the Nextcloud Web interface, so that the Nextcloud 
   server can email a reset link to you.

2. Ask another Nextcloud server admin to reset it for you.

If neither of these is an option, then you have a third option, and that is 
using the ``occ`` command. See :doc:`../occ_command` to
learn more about using the ``occ`` command.

::

 $ sudo -u www-data php /var/www/nextcloud/occ user:resetpassword admin
 Enter a new password: 
 Confirm the new password: 
 Successfully reset password for admin
 
If your Nextcloud username is not ``admin``, then substitute your Nextcloud 
username.
