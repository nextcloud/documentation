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
using the ``occ`` command. See :doc:`../configuration_server/occ_command` to
learn more about using the ``occ`` command.

::

 $ sudo -u www-data php /var/www/nextcloud/occ user:resetpassword admin
 Enter a new password: 
 Confirm the new password: 
 Successfully reset password for admin
 
If your Nextcloud username is not ``admin``, then substitute your Nextcloud 
username.

In the official Docker image of Nextcloud, the ``occ`` command would be:

::

 $ sudo docker exec -u www-data -it nextcloud /bin/bash
 www-data@:~/html$ php /var/www/html/occ user:resetpassword admin
 Enter a new password: 
 Confirm the new password: 
 Successfully reset password for

New password must comply with the `password policy <https://docs.nextcloud.com/server/stable/admin_manual/configuration_user/user_password_policy.html>`_.
