======================================
Administration privileges (Delegation)
======================================

Introduction
~~~~~~~~~~~~

Nextcloud has built-in functionality which permits administrators to delegate authority
to others without granting them full administration privileges (and without making
them a member of the ``admin`` group).

This administration privilege delegation functionality is supported by many shipped and
ecosystem apps that have their own settings areas under *Administration settings*.

.. note:: If you're an app developer and would like administrators to be able to utilize this
  functionality for your app, you need to enable support for delegation of your settings (see
  the Developer Manual for specifics).

.. tip:: Delegation of user management is possible, but you can also use
  :doc:`Group Administrators <../configuration_user/user_configuration>`.

.. warning:: Delegation of user management allow the delegated users to add themselves to groups
  receiving delegation of other settings. This can be used to escalate privileges.

Usage
~~~~~

By default only members of the ``admin`` group can access *Administration settings*. You can
create additional user groups (or use existing ones) and then grant these groups access to specific
settings.

While logged in to an account that is a member of the ``admin`` group, go to
*Administration settings* -> *Administration privilege*. You will be presented with the list of
settings pages and sections, including for any installed apps, that support delegation.

.. figure:: images/admin-right.png

By clicking on the combo box, you will be able to choose which groups are able to access the
selected settings. You can revoke access at any time by removing the group from the selection
(or, if you wish only to revoke access for an individual account, by removing that account from
the configured group).

.. tip::
  Not every settings page or section supports delegation. This is either because delegating
  access to that particular settings page would enable privilege escalation (i.e. bypassing
  of the limited administration authority) or delegation has not yet been implemented for
  that specific settings page or app.
