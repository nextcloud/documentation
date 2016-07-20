===============================
Upgrade Nextcloud From Packages
===============================

.. note:: Starting with Nextcloud 8.2 the Linux package repositories have
   changed, and **you must configure your system to use these new
   repositories** to install or upgrade Nextcloud 8.2+. The new repositories are
   at our `Open Build Service`_.

Upgrade Quickstart
------------------

The best method for keeping Nextcloud current on Linux servers is by configuring
your system to use Nextcloud's `Open Build Service`_ repository. Then stay
current by using your Linux package manager to install fresh Nextcloud packages.
After installing upgraded packages you must run a few more steps to complete
the
upgrade. These are the basic steps to upgrading Nextcloud:

* :doc:`Disable <../installation/apps_management_installation>` all third-party
  apps.
* Make a :doc:`fresh backup <backup>`.
* Upgrade your Nextcloud packages.
* Run :ref:`occ upgrade <command_line_upgrade_label>` (optionally disabling the
  :ref:`migration test
  <migration_test_label>`).
* :ref:`Apply strong permissions <strong_perms_label>` to your
  Nextcloud directories.
* Take your Nextcloud server out of :ref:`maintenance mode
  <maintenance_commands_label>`.
* Re-enable third-party apps.

Upgrade Tips
------------

Upgrading Nextcloud from our `Open Build Service`_ repository is just like any
normal Linux upgrade. For example, on Debian or Ubuntu Linux this is the
standard system upgrade command::

 apt-get update && apt-get upgrade

Or you can upgrade just Nextcloud with this command::

 apt-get update && apt-get install nextcloud

On Fedora, CentOS, and Red Hat Linux use ``yum`` to see all available updates::

 yum check-update

You can apply all available updates with this command::

 yum update

Or update only Nextcloud::

 yum update nextcloud

Your Snap package manager only upgrades the current Nextcloud Snap. Then
your Nextcloud server is immediately put into maintenance mode. You may not see
this until you refresh your Nextcloud page.

.. figure:: images/upgrade-1.png
   :scale: 75%
   :alt: Nextcloud status screen informing users that it is in maintenance mode.

Then use ``occ`` to complete the upgrade. You must run ``occ`` as your HTTP
user. This example is for Debian/Ubuntu::

 sudo -u www-data php occ upgrade

This example is for CentOS/RHEL/Fedora::

 sudo -u apache php occ upgrade

.. _migration_test_label:

Migration Test
--------------

Before completing the upgrade, Nextcloud first runs a simulation by copying all
database tables to new tables, and then performs the upgrade on them, to ensure
that the upgrade will complete correctly. The copied tables are deleted after
the upgrade. This takes twice as much time, which on large installations can be
many hours, so you can omit this step with the ``--skip-migration-test``
option, like this example on CentOS::

 $ sudo -u apache php occ upgrade --skip-migration-test

Setting Strong Directory Permissions
------------------------------------

After upgrading, verify that your Nextcloud directory permissions are set
according to :ref:`strong_perms_label`.

If the upgrade fails, then you must try a manual upgrade.

.. _skipped_release_upgrade_label:

Upgrading Across Skipped Releases
---------------------------------

It is best to update your Nextcloud installation with every new point release,
and to never skip any major releases. If you have skipped any major releases you
can bring your Nextcloud current with these steps:

#. Add the repository of your current version
#. Upgrade your current version to the latest point release
#. Add the repo of the next major release
#. Upgrade your current version to the next major release
#. Run upgrade routine
#. Repeat from step 3 until you reach the last available major release

You'll find previous Nextcloud releases in the `Nextcloud Server Changelog
<https://nextcloud.com/changelog/>`_.

If upgrading via your package manager fails, then you must perform a
:doc:`manual_upgrade`.
