==================
Patching Nextcloud
==================

Obtaining a patch
-----------------

If you found a related pull request on GitHub that solves your issue, or you want to help developers and verify a fix works, you can get a patch for the pull request.

1. Using https://github.com/nextcloud/server/pull/26396 as an example.
2. Append ``.patch`` to the URL: https://github.com/nextcloud/server/pull/26396.patch
3. Download the patch to your server and follow the `Applying a patch`_ steps.
4. If you are on an older Nextcloud version, you might first need to go to the correct backported patch for your version.

.. image:: images/getting-a-patch-from-github.png
   :alt: backportbot-nextcloud linking to the pull request for an older version.

5. You can find the appropriate version by looking for a link posted by ``backportbot-nextcloud`` to the backport pull request for your release, or by checking for a developer comment with a manual backport link. Use the ``.patch`` URL of that backport PR.

Applying a patch
----------------

Patching server
^^^^^^^^^^^^^^^

1. Navigate to your Nextcloud server's root directory (the one that contains the ``status.php`` file).
2. Apply the patch with the following command::

    patch -p 1 < /path/to/the/file.patch

Patching apps
^^^^^^^^^^^^^

1. Navigate to the root of the app (usually ``apps/[APPID]/``). If you cannot find the app there, use the ``sudo -E -u www-data php occ app:getpath APPID`` command to find the path.
2. Apply the patch with the same command as in `Patching server`_.

Reverting a patch
-----------------

1. Navigate to the directory where you applied the patch.
2. Revert the patch with the ``-R`` option::

    patch -R -p 1 < /path/to/the/file.patch

Notes and troubleshooting
-------------------------

.. note::

   You may see errors about files not being found, especially when applying patches from GitHub. Patches can include development or test files (for example, files under ``build/`` or ``tests/``) that are not present on your installation. These messages are expected and can be ignored if they refer only to such files.
