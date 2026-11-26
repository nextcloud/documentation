===========================================
Configuring an external password reset link
===========================================

If your user backend does not support user-level password resets, such as
when LDAP password changes from Nextcloud are disabled, you can specify a
custom reset URL in ``config.php``::

 'lost_password_link' => 'https://example.org/link/to/password/reset',

Users will be redirected to this URL when they select the password reset link
in Nextcloud. To disable the password reset link entirely, set the URL to
``'disabled'``.

This setting applies to the login page's reset link for all users, not only
users of the external backend.

.. tip:: For an administrator-initiated password reset, see
         :ref:`reset-user-password`.
