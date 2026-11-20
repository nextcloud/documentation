.. _authentication:

=======================
App password management
=======================

App passwords allow users to authenticate multiple client applications against their Nextcloud account without giving the application the login password. App passwords are mandatory for accounts with :ref:`two-factor authentication<two-factor-auth>` enabled.

Remote wipe
-----------

Some clients support *remote wipe*, which makes the connected application delete its local data.

.. _authentication-app-password-clean-up:

Automated cleanup
-----------------

.. versionadded:: 30

Nextcloud will delete unused app passwords. Passwords set for *remote wipe* are deleted after 60 days of no usage. App passwords of client applications are deleted after 365 days of no usage.

Configuring retention periods
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The time spans can be overwritten with configuration::

  sudo -E -u www-data php occ config:system:set token_auth_wipe_token_retention --type=int --value 2592000 # 60*60*24*30 - 30 days
  sudo -E -u www-data php occ config:system:set token_auth_token_retention --type=int --value 63072000     # 60*60*24*365*2 - 2 years

Values are set in **seconds**.
