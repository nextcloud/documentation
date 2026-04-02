==================
Patching Nextcloud
==================

Applying a patch
----------------

Patching server
^^^^^^^^^^^^^^^

1. Navigate into your Nextcloud server's root directory (contains the ``status.php`` file)
2. Now apply the patch with the following command::

    patch -p 1 < /path/to/the/file.patch

.. note::

   There can be errors about not found files, especially when you take a patch from GitHub there might be development or test files included in the patch. when the files are in build/ or a tests/ subdirectory it is mostly being

Patching apps
^^^^^^^^^^^^^

1. Navigate to the root of this app (mostly ``apps/[APPID]/``), if you can not find the app there use the ``sudo -u www-data php occ app:getpath APPID`` command to find the path.
2. Now apply the patch with the same command as in `Patching server`_

Reverting a patch
-----------------

1. Navigate to the directory where you applied the patch.
2. Now revert the patch with the ``-R`` option::

    patch -R -p 1 < /path/to/the/file.patch

Getting a patch from a GitHub pull request
------------------------------------------

If you found a related pull request on GitHub that solves your issue, or you want to help developers and verify a fix works, you can get a patch for the pull request.

1. Using https://github.com/nextcloud/server/pull/26396 as an example.
2. Append ``.patch`` to the URL: https://github.com/nextcloud/server/pull/26396.patch
3. Download the patch to your server and follow the `Applying a patch`_ steps.
4. In case you are on an older version, you might first need to go the the correct version of the patch.

.. image:: images/getting-a-patch-from-github.png
   :alt: backportbot-nextcloud linking to the pull request for an older version.

5. You can find it by looking for a link by the ``backportbot-nextcloud`` or a developer will leave a manual comment about the backport to an older Nextcloud version. For the example above you the pull request for Nextcloud 21 is at https://github.com/nextcloud/server/pull/26406 and the patch at https://github.com/nextcloud/server/pull/26406.patch
