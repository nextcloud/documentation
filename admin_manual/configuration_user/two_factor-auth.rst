=========================
Two factor authentication
=========================

Starting with Nextcloud 10, it is possible to use two factor authentication
(2FA) with Nextcloud. It is a plugin based system requiring a 2FA app.
Several 2FA apps are already available including
`TOTP <https://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm>`_, 
SMS 2-factor and `U2F <https://en.wikipedia.org/wiki/Universal_2nd_Factor>`_. 
Developers can `built new two-factor provider apps <https://docs.nextcloud.com/server/12/developer_manual/app/two-factor-provider.html>`_.

.. TODO ON RELEASE: Update version number above on release

Enabling two factor authentication
----------------------------------

You can enable 2FA by installing and enabling a 2FA app like TOTP which works
with Google Authenticator and compatible apps. The apps are available in the
Nextcloud App store so by navigating there and clicking **enable** for the app
you want, 2FA will be installed and enabled on your Nextcloud server.

.. figure:: ../images/2fa-app-install.png

Once 2FA has been enabled, users have to `activate it in their personal settings. <https://docs.nextcloud.com/server/12/user_manual/user_2fa.html>`_

.. TODO ON RELEASE: Update version number above on release
