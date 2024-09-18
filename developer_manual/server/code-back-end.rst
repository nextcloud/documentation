=============
Back-end code
=============

When changing back-end PHP code, in general, no additional steps are needed before checking in.

However, if new files were created, you will need to run the following command to update the autoloader files:

.. code-block:: console
    
   build/autoloaderchecker.sh

After that, please also include the autoloader file changes in your commits.

Compatibility documentation
---------------------------

- New APIs (interfaces, constants, methods, classes, traits, enums) added to the public namespace ``OCP`` have to be annotated with a ``@since X.Y.Z`` attribute of the version it was added in.
- When it is backported the version should be adjusted to the X.Y.Z of the stable version it was backported in only in that stable branch. The master branch should still contain the newest Major version shipping the API.
- Once an API was shipped, unless it is marked as experimental, it has to be deprecated in similar fashion using ``@deprecated X.Y.Z`` for 3 years (9 Nextcloud releases) before it can be removed. Deprecations have to be clearly documented in the :ref:`app-upgrade-guide` for the upcoming Major version.
