.. _profile:

=====================
Profile configuration
=====================


The user profile displays information about an account.
Profiles are enabled by default.

Users can enable or disable their own profile in **Personal settings** under
**Personal info**.

As an administrator, you can:

- set the default profile state for new users, and
- disable profiles globally.

Profile data can also be used by other features (for example the
:ref:`system address book<system-address-book>`), but what is exposed depends
on privacy controls.


.. note::
   Profile visibility is layered.

   - **Profile enablement** controls whether profile functionality is available.
   - **Profile field visibility settings** control whether a field is shown.
   - **Account property scopes** (for example ``private``, ``local``, ``federated``,
     ``published``) define the intended audience for each property.
   - **Discovery restrictions** (for example sharing/autocomplete enumeration rules)
     can further reduce what other users can find or see.

   In short: effective visibility is the most restrictive result of all applicable controls.

Configuration
-------------

Set profile default for new users
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In **Administration settings** → **Basic settings**, use the profile default toggle.

.. figure:: ../images/profile_default_setting.png

You can also set this via ``occ``:

::

  occ config:app:set settings profile_enabled_by_default --value="0"

Use ``--value="1"`` to enable it by default again.

See :doc:`../occ_command` for more ``occ`` usage details.

Disable profiles globally
^^^^^^^^^^^^^^^^^^^^^^^^^

To disable profile functionality for all users, add this to ``config.php``:

::

  'profile.enabled' => false,

.. _profile-property-scopes:

Property scopes
---------------

User properties (Full name, Address, Website, Role, …) have visibility scopes:
Private, Local, Federated, Published.

These scopes are evaluated per attribute. A profile being reachable does not imply
that all its attributes are visible.

The visibility scopes are:

:Private:
  Most restrictive scope. Not exposed through public profile contexts, federation,
  or the public lookup server.

  On local-instance user-to-user surfaces, ``Private`` data is not generally visible
  to all local users. Visibility requires an authenticated requester and a
  server-recognized known-user relationship with the target user.
:Local:
  Contact details visible on the local instance and through public share-links
  (where profile/account attributes are inherently required - i.e. as file
  owner/uploader metadata, etc.).  Not shared to federated servers and not published
  to the public lookup server.
:Federated:
  Contact details visible on the local instance, through local public-link contexts,
  and on trusted federated servers.
:Published:
  Contact details visible on the local instance, through local public-link contexts,
  on trusted federated servers, and published to the public lookup server.

.. important::
   A reachable profile does not mean all attributes are public. Each attribute is
   filtered by its own scope, and effective visibility can also depend on the
   consuming feature.

.. important::
   On profile surfaces, the effective visibility is the more restrictive of
   profile-visibility settings and property scope.

Scope audience overview
^^^^^^^^^^^^^^^^^^^^^^^

+------------+-------------------+-------------------------------------------------------------+--------------------+---------------------+----------------------+
| Scope      | User themself (*) | Other users on same local instance                          | Public link/public | Trusted federation  | Public lookup server |
+============+===================+=============================================================+====================+=====================+======================+
| Private    | Yes               | Limited: authenticated + known-user relation required       | No                 | No                  | No                   |
+------------+-------------------+-------------------------------------------------------------+--------------------+---------------------+----------------------+
| Local      | Yes               | Yes                                                         | Yes                | No                  | No                   |
+------------+-------------------+-------------------------------------------------------------+--------------------+---------------------+----------------------+
| Federated  | Yes               | Yes                                                         | Yes                | Yes                 | No                   |
+------------+-------------------+-------------------------------------------------------------+--------------------+---------------------+----------------------+
| Published  | Yes               | Yes                                                         | Yes                | Yes                 | Yes                  |
+------------+-------------------+-------------------------------------------------------------+--------------------+---------------------+----------------------+

(*) Scope primarily governs exposure to others; owner access follows account/endpoint behavior.

Known-user relation (for ``Private``)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

For ``Private`` properties, Nextcloud may allow visibility on specific local feature
paths only when the requester is considered a *known user* of the target user.

In practical terms, this relation is derived by server contact-matching logic and is
directional (A known to B does not imply B known to A). Users are always known to
themselves.

What local users can see
^^^^^^^^^^^^^^^^^^^^^^^^

A common question is what one user can see about another user on the same instance.

In general, profile visibility is controlled by each property's scope, but the
exact UI/API surface depends on the consuming feature (for example profile page,
share dialogs, search, mentions, Contacts, and other integrations).

For local users on the same instance:

- ``Private``: not generally visible to all local users; visibility is restricted
  to authenticated users that satisfy the known-user relation for that feature path.
- ``Local``: visible on the local instance.
- ``Federated``: visible on the local instance (and also shared with trusted federated servers).
- ``Published``: visible on the local instance (and also federated + public lookup).

Verification workflow for administrators
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Because effective visibility can vary by feature path, administrators should verify
scope behavior in their own deployment.

Recommended test procedure:

1. Create test users:

   - ``alice`` (target profile owner)
   - ``bob`` (authenticated local user)
   - ``charlie`` (second local user for control)

2. As ``alice``, set distinct test values for profile fields and assign different
   scopes (Private, Local, Federated, Published).
3. Verify as ``alice``:

   - Confirm owner-visible values as expected.

4. Verify as ``bob`` (authenticated local user):

   - Check the feature paths used in your instance (for example profile page,
     user card, share dialog, search, mentions, Contacts integrations).
   - Confirm ``Local/Federated/Published`` fields are visible where expected.
   - Confirm ``Private`` fields are visible only on paths that satisfy the known-user
     relation and other feature constraints.

5. Verify as unauthenticated user (private browser session):

   - Confirm only public-appropriate fields are visible.

6. Verify federation/publication behavior (if enabled):

   - From a trusted federated server, confirm Federated/Published behavior.
   - Confirm only Published fields are exposed to the public lookup server.

7. Re-test with a newly created user after changing
   ``account_manager.default_property_scope``:

   - Confirm new defaults apply only to newly initialized accounts.
   - Confirm existing users retain stored scopes unless explicitly changed.

.. tip::
   Keep one "scope matrix" test account in staging and re-run this checklist after upgrades.

Scope defaults and precedence
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Visibility is determined per property using this order:

1. **Server defaults** from ``OC\Accounts\AccountManager::DEFAULT_SCOPES``.
2. **Administrator default override** via ``account_manager.default_property_scope``.
3. **User-set value** in personal/profile settings (subject to server-side constraints).

Practical implications:

- Admin overrides in ``account_manager.default_property_scope`` are applied at account
  initialization and therefore affect **new users**.
- Existing users keep already stored scopes unless changed explicitly.
- ``PROPERTY_DISPLAYNAME`` and ``PROPERTY_EMAIL`` cannot be ``Private``; server-side
  validation/enforcement requires at least ``Local``.

Default scope values
^^^^^^^^^^^^^^^^^^^^

Default values are defined in server code and may change over time. The authoritative
source is the ``DEFAULT_SCOPES`` constant in ``OC\Accounts\AccountManager``. The latest
version is `here <https://github.com/nextcloud/server/blob/master/lib/private/Accounts/AccountManager.php>`_).

Example defaults (verify against your deployed version):

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
| Bluesky      | Local                    |
+--------------+--------------------------+
| Fediverse    | Local                    |
+--------------+--------------------------+
| Organisation | Local                    |
+--------------+--------------------------+
| Role         | Local                    |
+--------------+--------------------------+
| Headline     | Local                    |
+--------------+--------------------------+
| Biography    | Local                    |
+--------------+--------------------------+
| Birthdate    | Local                    |
+--------------+--------------------------+
| Pronouns     | Federated                |
+--------------+--------------------------+

Override defaults in ``config.php``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To override one or several default visibility scopes for *new users*, use
``account_manager.default_property_scope`` (default: empty array):

.. code-block:: php

  'account_manager.default_property_scope' => [
    \OCP\Accounts\IAccountManager::PROPERTY_PHONE => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE,
    \OCP\Accounts\IAccountManager::PROPERTY_ROLE => \OCP\Accounts\IAccountManager::SCOPE_FEDERATED,
  ]

In the above example, phone and role are overwritten to ``Private`` and
``Federated`` respectively.

.. note::
   Use ``\OCP\Accounts\IAccountManager`` constants for both property keys and scope values.

FAQ: How do I lock profile visibility down as tightly as possible?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If your goal is maximum privacy:

1. Disable profiles globally (strictest option):

   .. code-block:: php

     'profile.enabled' => false,

   Effect:

   - Profile functionality is removed.
   - Profile-based discoverability/usability features are reduced accordingly.

2. If profiles must remain enabled, set restrictive defaults for new users:

   .. code-block:: php

     'account_manager.default_property_scope' => [
       \OCP\Accounts\IAccountManager::PROPERTY_ADDRESS => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE,
       \OCP\Accounts\IAccountManager::PROPERTY_PHONE => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE,
       \OCP\Accounts\IAccountManager::PROPERTY_WEBSITE => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE,
       \OCP\Accounts\IAccountManager::PROPERTY_TWITTER => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE,
       \OCP\Accounts\IAccountManager::PROPERTY_BLUESKY => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE,
       \OCP\Accounts\IAccountManager::PROPERTY_FEDIVERSE => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE,
       \OCP\Accounts\IAccountManager::PROPERTY_ORGANISATION => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE,
       \OCP\Accounts\IAccountManager::PROPERTY_ROLE => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE,
       \OCP\Accounts\IAccountManager::PROPERTY_HEADLINE => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE,
       \OCP\Accounts\IAccountManager::PROPERTY_BIOGRAPHY => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE,
       \OCP\Accounts\IAccountManager::PROPERTY_BIRTHDATE => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE,
       \OCP\Accounts\IAccountManager::PROPERTY_PRONOUNS => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE,
       \OCP\Accounts\IAccountManager::PROPERTY_AVATAR => \OCP\Accounts\IAccountManager::SCOPE_PRIVATE,
     ]

   Notes:

   - ``PROPERTY_DISPLAYNAME`` and ``PROPERTY_EMAIL`` cannot be set to ``Private``; server-side enforcement requires at least ``Local``.
   - Defaults apply to **new users**. Existing users keep stored scopes unless changed.

What becomes limited when you lock it down?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

With more restrictive scopes (especially ``Private``), expect reduced visibility in:

- User discovery/search/user cards
- Share dialogs and mention/autocomplete context
- Public-share pages showing owner/profile metadata
- Federated visibility of profile attributes
- Public lookup publication (only ``Published`` appears there)

In short: tighter privacy reduces profile-based convenience and discoverability.

.. TODO/Future additions
   - Sharing settings + Mentions + Property Scope interactions (i.e. auto-completion, group/user-to-group/user sharing)
   - Since default visibility scope changes only apply to new users, perhaps we can cover whether their's a migration path for existing users?
   - How do scopes interact with the system address book?
