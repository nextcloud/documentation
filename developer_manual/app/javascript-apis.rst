===============
JavaScript APIs
===============

Nextcloud apps can use existing JavaScript APIs to ease the development of front-end components and simple scripts.

The APIs used to be provided via global variables, available on most pages of Nextcloud. To smoothen the development experience with modern development tools, this method is in the process of being deprecated and removed. Existing APIs are being migrated to npm packages and new APIs will only be available that way. The bottom of the page covers the basics of the global variable method, if you want to develop an app for old versions of Nextcloud.

npm packages
------------

`@nextcloud npm packages <https://www.npmjs.com/org/nextcloud>`_ provide the current front-end APIs for Nextcloud apps.


Usage
^^^^^

The idea is that apps install these packages via `npm` and bundle the code with tools like `Babel <https://babeljs.io/>`_, `Webpack <https://webpack.js.org/>`_ or `Parcel <https://parceljs.org/>`_. This ensures that an app runs the exact same code independent of the Nextcloud version and also reduces the chances of running into conflicts with other apps.

For more details on the design considerations see `the discussion on Github <https://github.com/nextcloud/server/issues/15932>`_.


.. note:: We highly recommend keeping packages up-to-date as they provide fixes and security patches. For apps with code hosted on Github we recommend the use of `Dependabot <https://dependabot.com/>`_.


Compatibility
^^^^^^^^^^^^^

The provided packages are aimed to be compatible with all `supported Nextcloud releases <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_. However, we may have to change an API in a non-backwards compatible way in the future. Thus look out for major version bumps in the packages and read the changelogs.


Development
^^^^^^^^^^^

Most packages are written in TypeScript in order to generate better API docs automatically but also to ensure compatibility with Nextcloud server in a programmatic way. The server is typed in `a dedicated npm package <https://www.npmjs.com/package/@nextcloud/typings>`_ that is used to check type soundness.


Packages in detail
^^^^^^^^^^^^^^^^^^


The rest of this section will cover a rough overview of which packages are provided and what they are used for.


``@nextcloud/auth``
^^^^^^^^^^^^^^^^^^^

This package provides information about the current user and session.
`Read the full documentation <https://nextcloud.github.io/nextcloud-auth/>`_


``@nextcloud/axios``
^^^^^^^^^^^^^^^^^^^

This package provides an `Axios <https://www.npmjs.com/package/axios>`_ HTTP client instance, ready to send request to the Nextcloud server. If you use this instance you do not have to care about authentication and special headers.
`Read the full documentation <https://nextcloud.github.io/nextcloud-axios/>`_


``@nextcloud/event-bus``
^^^^^^^^^^^^^^^^^^^^^^^^

This package provides a simple event bus implementation that integrates with server and other apps. Thus it is one of the recommended ways of inter-app communication.
`Read the full documentation <https://nextcloud.github.io/nextcloud-event-bus/>`_


``@nextcloud/dialogs``
^^^^^^^^^^^^^^^^^^^^^^

This package provides access to UI dialogs in Nextcloud.
`Read the full documentation <https://nextcloud.github.io/nextcloud-dialogs/>`_


``@nextcloud/files``
^^^^^^^^^^^^^^^^^^^^

This package provides helper functions around the Files app.
`Read the full documentation <https://nextcloud.github.io/nextcloud-files/>`_


``@nextcloud/initial-state``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This package provides the counterpart for the `\OCP\IInitialStateService` on the back-end. Use it to retreive your stored data on page load.
`Read the full documentation <https://nextcloud.github.io/nextcloud-initial-state/>`_


``@nextcloud/l10n``
^^^^^^^^^^^^^^^^^^^

This package provides everything around localization, like access to the current user's locale and translation helpers.
`Read the full documentation <https://nextcloud.github.io/nextcloud-l10n/>`_


``@nextcloud/logger``
^^^^^^^^^^^^^^^^^^^^^

This package provides a unified logging helper that adds app names, severity and other context to log messages. Use it to enhance the output of your app's logs, useful for development and triaging bug reports.
`Read the full documentation <https://nextcloud.github.io/nextcloud-logger/>`_


``@nextcloud/moment``
^^^^^^^^^^^^^^^^^^^^^

This package provides a modified version of `moment.js <https://momentjs.com/>`_ with the current user's locale set.
`Read the full documentation <https://nextcloud.github.io/nextcloud-moment/>`_


``@nextcloud/password-confirmation``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This package makes it possible to ask a user for confirmation on actions that have a `@PasswordConfirmationRequired` set on the controller method. Use it for critical actions.
`Read the full documentation <https://nextcloud.github.io/nextcloud-password-confirmation/>`_


``@nextcloud/paths``
^^^^^^^^^^^^^^^^^^^^

This package provides various helpers for file and folder paths.
`Read the full documentation <https://nextcloud.github.io/nextcloud-paths/>`_


``@nextcloud/router``
^^^^^^^^^^^^^^^^^^^^^

This package provides helpers to generate URLs, e.g. to access assets and REST APIs of your app or the Nextcloud server.
`Read the full documentation <https://nextcloud.github.io/nextcloud-router/>`_


``@nextcloud/vue``
^^^^^^^^^^^^^^^^^^

This package provides lots of nextcloud components allowing you to quickly build UIs..
`Read the full documentation <https://nextcloud-vue-components.netlify.com/>`_



Global variables
----------------

There are also global variables that acted as APIs in the past. The use of these variables is dicouraged, as they lead to script loading order problems and the dependency hell, making it hard for the server component to update libraries.

.. note:: Be careful with accessing global variables as their availability depends on the order in which scripts are loaded. Thus they might not have been assigned yet when your script runs. Use the document ``load`` event to wait until all scripts have been loaded and executed.

OC – internal APIs
^^^^^^^^^^^^^^^^^^

The ``OC`` variable provides access to many internals of the Nextcloud server. It's not intended for use by apps as the APIs may change any time.


OCA – App APIs
^^^^^^^^^^^^^^

Some apps use the ``OCA`` variable as a place to register their types. Except for edge cases with inter-app communication, you should not assign anything to this variable.


OCP – Public APIs
^^^^^^^^^^^^^^^^^

Some more stable APIs are exposed in the ``OCP`` "namespace". Since the release of the `npm packages`_, the got obsolete and thus will be deprecated.
