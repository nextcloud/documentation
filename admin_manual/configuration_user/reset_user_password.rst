=========================
Resetting a User Password
=========================

The ownCloud login screen displays a **Wrong password. Reset it?** message 
after a user enters an incorrect password, and then ownCloud automatically 
resets their password. However, if you are using a read-only authentication 
backend such as LDAP or Active Directory, this will not work. In this case you 
may specify a custom URL in your ``config.php`` file to direct your user to a 
server than can handle an automatic reset::

 'lost_password_link' => 'https://example.org/link/to/password/reset',
 
 