=========================
Two-factor authentication
=========================

Two-factor authentication adds an additional layer of security to user accounts. In order to log
in on an account with two-factor authentication (2FA) enabled, it is necessary to provide both the
login password and another factor. 2FA in Nextcloud is pluggable, meaning that they are not part
of the Nextcloud Server component but provided by official and 3rd-party Nextcloud apps.


Several 2FA apps are already available including
`TOTP <https://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm>`_, 
a Telegram/Signal/SMS gateway and `U2F <https://en.wikipedia.org/wiki/Universal_2nd_Factor>`_. 


Developers can `build new two-factor provider apps <https://docs.nextcloud.com/server/14/developer_manual/app/two-factor-provider.html>`_.

.. TODO ON RELEASE: Update version number above on release

Enabling two-factor authentication
----------------------------------

You can enable 2FA by installing and enabling a 2FA app like TOTP which works
with Google Authenticator and compatible apps. The apps are available in the
Nextcloud App store so by navigating there and clicking **enable** for the app
you want, 2FA will be installed and enabled on your Nextcloud server.

.. figure:: ../images/2fa-app-install.png

Once 2FA has been enabled, users have to `activate it in their personal settings. <https://docs.nextcloud.com/server/14/user_manual/user_2fa.html>`_

.. TODO ON RELEASE: Update version number above on release


Enforcing two-factor authentication
-----------------------------------

By default 2FA is *optional*, hence users are given the choice whether to enable
it for their account. Since Nextcloud 15, admins may enforce the use of 2FA.


Enforcement is possible systemwide (all users), for selected groups only and can
also be excluded for certain groups.


These settings can be found in the administrator's security settings.

.. figure:: ../images/2fa-admin-settings.png

When groups are selected/excluded, they use the following logic to determine if
a user has 2FA enforced:

* If no groups are selected, 2FA is enabled for everyone except members of the excluded groups
* If groups are selected, 2FA is enabled for all members of these. If a user is both in a
  selected *and* excluded group, the selected takes precedence and 2FA is enforced.

.. note:: Should users lose access to their second factor and backup codes,
  they won't be able to log into their account anymore. As administrator, you
  can use the `Two-Factor Admin Support app <https://apps.nextcloud.com/apps/twofactor_admin>`_
  to generate a one-time code for them to log in and unlock their account.
  You can find out more about the app in its `documentation <https://nextcloud-twofactor-admin.readthedocs.io/en/latest/>`_
