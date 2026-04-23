==================
Patching Nextcloud
==================

Obtaining a patch
-----------------

If you found a related pull request on GitHub that solves your issue, or you want to help developers and verify a fix works, you can get a patch for the pull request.

1. Using https://github.com/nextcloud/server/pull/26396 as an example.
2. Append ``.diff`` to the URL: https://github.com/nextcloud/server/pull/26396.diff
3. Download the patch to your server e.g. via ``wget https://github.com/nextcloud/server/pull/26396.diff`` (this will place ``26396.diff`` in the local directory)
4. Follow the `Applying a patch`_ steps.
5. If you are on an older Nextcloud version, you might first need to go to the correct backported patch for your version.

.. image:: images/getting-a-patch-from-github.png
   :alt: backportbot-nextcloud linking to the pull request for an older version.

6. You can find the appropriate version by looking for a link posted by ``backportbot-nextcloud`` to the backport pull request for your release, or by checking for a developer comment with a manual backport link. Use the ``.diff`` URL of that backport PR.

Applying a patch
----------------

Patching server
^^^^^^^^^^^^^^^

1. Navigate to your Nextcloud server's root directory (the one that contains the ``status.php`` file).
2. Download the patch to your server e.g. via ``wget https://github.com/nextcloud/server/pull/26396.diff`` (this will place ``26396.diff`` in the local directory)
3. Apply the patch with the following command::

    patch -p 1 < ./26396.diff

4. Alternatively, if the patch command is not available, use::

    git apply --check ./26396.diff
    git apply ./26396.diff

Patching apps
^^^^^^^^^^^^^

1. Navigate to the root of the app (usually ``apps/[APPID]/``). If you cannot find the app there, use the ``sudo -E -u www-data php occ app:getpath APPID`` command to find the path.
2. Download the patch to your server e.g. via ``wget https://github.com/nextcloud/<app>/pull/26396.diff`` (this will place ``26396.diff`` in the local directory)
3. Apply the patch with the same command as in `Patching server`_.

Reverting a patch
-----------------

1. Navigate to the directory where you applied the patch.
2. Now revert the patch with the ``-R`` option::

    patch -R -p 1 < ./26396.diff

3. Alternatively, if the patch command is not available, use::

    git apply --reverse ./26396.diff

Notes and troubleshooting
-------------------------

If you found a related pull request on GitHub that solves your issue, or you want to help developers and verify a fix works, you can get a patch for the pull request.

1. Using https://github.com/nextcloud/server/pull/26396 as an example.
2. Append ``.patch`` to the URL: https://github.com/nextcloud/server/pull/26396.patch
3. Download the patch to your server and follow the `Applying a patch`_ steps.
4. In case you are on an older version, you might first need to go the the correct version of the patch.

.. image:: images/getting-a-patch-from-github.png
   :alt: backportbot-nextcloud linking to the pull request for an older version.

5. You can find it by looking for a link by the ``backportbot-nextcloud`` or a developer will leave a manual comment about the backport to an older Nextcloud version. For the example above you the pull request for Nextcloud 21 is at https://github.com/nextcloud/server/pull/26406 and the patch at https://github.com/nextcloud/server/pull/26406.patch
