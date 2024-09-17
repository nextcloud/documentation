.. _profile:

=====================
Profile configuration
=====================

The user profile presents the information of a user and is enabled by default
for all users. Users may individually enable or disable their profile in their
Personal info settings under the Personal settings section.

As an administrator you may change the default for new users and may also
disable profile globally to remove all profile functionality.

Profile properties are also written into the :ref:`system address book<system-address-book>`.

To enable or disable profile by default for new users switch the toggle in
Basic settings under the Administration settings section.

.. figure:: ../images/profile_default_setting.png

.. note:: If you are upgrading from Nextcloud 22 to 23 and want profile to
  be disabled by default for all users, you may run the ``occ`` command below
  before upgrading or upgrade first then switch the toggle in Basic settings
  before letting any users log in.

::

  occ config:app:set settings profile_enabled_by_default --value="0"

Please refer to :doc:`../occ_command` for all available
``occ`` commands.

To disable profile globally add the following line to your ``config.php``

::

  'profile.enabled' => false,

Please refer to :doc:`../configuration_server/config_sample_php_parameters` for
all available ``config.php`` options.

.. _profile-property-scopes:

Property scopes
---------------

User properties (Full name, Address, Website, Role, …) have specific visibility scopes (Private, Local, Federated, Published).

The visibility scopes are explained below:

:Private:
  Contact details visible locally only
:Local:
  Contact details visible locally and through public link access on local instance
:Federated:
  Contact details visible locally, through public link access and on trusted federated servers.
:Published:
  Contact details visible locally, through public link access, on trusted federated servers and published to the public lookup server.

The default values for each property for each new user is listed below, but you should consult the declaration of the ``DEFAULT_SCOPES`` constant in the ``OC\Accounts\AccountManager`` class (`see the code <https://github.com/nextcloud/server/blob/master/lib/private/Accounts/AccountManager.php>`_) to make sure these are up-to-date.

+--------------+--------------------------+
| Property     | Default visibility scope |
+==============+==========================+
| Full name    | Federated                |
+--------------+--------------------------+
| Address      | Local                    |
+--------------+--------------------------+
| Website      | Local                    |
+--------------+--------------------------+
| Email        | Federated                |
+--------------+--------------------------+
| Avatar       | Federated                |
+--------------+--------------------------+
| Phone        | Local                    |
+--------------+--------------------------+
| Twitter      | Local                    |
+--------------+--------------------------+
| Organisation | Local                    |
+--------------+--------------------------+
| Role         | Local                    |
+--------------+--------------------------+
| Headline     | Local                    |
+--------------+--------------------------+
| Biography    | Local                    |
+--------------+--------------------------+

If you'd like to override the value for one or several default visibility scopes, use the ``account_manager.default_property_scope`` ``config.php`` configuration key, which defaults to an empty array:

.. code-block:: php

  'account_manager.default_property_scope' => [
    \OCP\Accounts\IAccountManager::PROPERTY_PHONE => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE,
    \OCP\Accounts\IAccountManager::PROPERTY_ROLE => \OCP\Accounts\IAccountManager::SCOPE_FEDERATED
  ]

In the above example, the phone and role properties are respectively overwritten to the private and federated scopes. Note that these changes will only apply to *new* users, not existing ones.
