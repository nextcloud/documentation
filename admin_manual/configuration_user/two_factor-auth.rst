.. _two-factor-auth:

=========================
Two-factor authentication
=========================

Two-factor authentication adds an additional layer of security to user accounts. In order to log
in on an account with two-factor authentication (2FA) enabled, it is necessary to provide both the
login password and another factor. 2FA in Nextcloud is pluggable, meaning that they are not part
of the Nextcloud Server component but provided by featured and 3rd-party Nextcloud apps.


Several 2FA apps are already available including
`TOTP <https://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm>`_, 
a Telegram/Signal/SMS gateway and `U2F <https://en.wikipedia.org/wiki/Universal_2nd_Factor>`_. 


Developers can `build new two-factor provider apps <https://docs.nextcloud.com/server/latest/developer_manual/digging_deeper/two-factor-provider.html>`_.

.. TODO ON RELEASE: Update version number above on release

Enabling two-factor authentication
----------------------------------

You can enable 2FA by installing and enabling a 2FA app like TOTP which works
with Google Authenticator and compatible apps. The apps are available in the
Nextcloud App store so by navigating there and clicking **enable** for the app
you want, 2FA will be installed and enabled on your Nextcloud server.

.. figure:: ../images/2fa-app-install.png

Once 2FA has been enabled, users have to `activate it in their personal settings. <https://docs.nextcloud.com/server/latest/user_manual/en/user_2fa.html>`_

.. TODO ON RELEASE: Update version number above on release

Disabling two-factor authentication
-----------------------------------

Two-factor providers can be disabled via :ref:`occ <occ>`::

 sudo -u www-data php occ twofactorauth:disable <uid> <provider_id>

User are free to enable this provider again via their personal settings.

.. note:: This operation has to be supported by the provider. If this support is missing, Nextcloud will abort and show an error.

Enforcing two-factor authentication
-----------------------------------

By default 2FA is *optional*, hence users are given the choice whether to enable
it for their account. Admins may enforce the use of 2FA.


Enforcement is possible system-wide (all users), for selected groups only and can
also be excluded for certain groups.


These settings can be found in the administrator's security settings.

.. figure:: ../images/2fa-admin-settings.png

When groups are selected/excluded, they use the following logic to determine if
a user has 2FA enforced:

* If no groups are selected, 2FA is enabled for everyone except members of the excluded groups
* If groups are selected, 2FA is enabled for all members of these. If a user is both in a
  selected *and* excluded group, the selected takes precedence and 2FA is enforced.

Provider removal
----------------

Nextcloud keeps records about the enabled two-factor authentication providers of every user. If a provider is simply removed/:ref:`disabled <apps_commands_label>`, Nextcloud will still consider the provider active for the user at login and show a warning like *Could not load at least one of your enabled two-factor auth methods*.

The associations of removed providers can be cleaned up via :ref:`occ <occ>`::

 sudo -u www-data php occ twofactorauth:cleanup <provider_id>

.. warning:: This operation is irreversible. Only run it for providers you do not intend to enable again.
