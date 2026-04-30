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

For more details on the design considerations see `the discussion on GitHub <https://github.com/nextcloud/server/issues/15932>`_.


.. note:: We highly recommend keeping packages up-to-date as they provide fixes and security patches. For apps with code hosted on GitHub we recommend the use of `Dependabot <https://dependabot.com/>`_.


Compatibility
^^^^^^^^^^^^^

The provided packages are aimed to be compatible with all `supported Nextcloud releases <https://github.com/nextcloud/server/wiki/Maintenance-and-Release-Schedule>`_. However, we may have to change an API in a non-backwards compatible way in the future. Thus look out for major version bumps in the packages and read the changelogs.


Development
^^^^^^^^^^^

Most packages are written in TypeScript in order to generate better API docs automatically but also to ensure compatibility with Nextcloud server in a programmatic way. The server is typed in `a dedicated npm package <https://www.npmjs.com/package/@nextcloud/typings>`_ that is used to check type soundness.



Packages in detail
^^^^^^^^^^^^^^^^^^


The rest of this section will cover a rough overview of which packages are provided and what they are used for.


.. _js-library_nextcloud-auth:

``@nextcloud/auth``
^^^^^^^^^^^^^^^^^^^

This package provides information about the current user and session. Documentation: https://nextcloud-libraries.github.io/nextcloud-auth/

``@nextcloud/axios``
^^^^^^^^^^^^^^^^^^^^

This package provides an `Axios <https://www.npmjs.com/package/axios>`_ HTTP client instance, ready to send request to the Nextcloud server. If you use this instance you do not have to care about authentication and special headers. Documentation: https://nextcloud-libraries.github.io/nextcloud-axios/

.. _js-library_nextcloud-event-bus:

``@nextcloud/event-bus``
^^^^^^^^^^^^^^^^^^^^^^^^

This package provides a simple event bus implementation that integrates with server and other apps. Thus it is one of the recommended ways of inter-app communication. Documentation: https://nextcloud-libraries.github.io/nextcloud-event-bus/

.. _js-library_nextcloud-dialogs:

``@nextcloud/dialogs``
^^^^^^^^^^^^^^^^^^^^^^

This package provides access to UI dialogs in Nextcloud. Documentation: https://nextcloud-libraries.github.io/nextcloud-dialogs/

.. _js-library_nextcloud-files:

``@nextcloud/files``
^^^^^^^^^^^^^^^^^^^^

This package provides methods to access the public API of the Files app, helper functions to access Nextcloud files using WebDAV,
and utility functions to work with files and folders. Documentation: https://nextcloud-libraries.github.io/nextcloud-files/

``@nextcloud/initial-state``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This package provides the counterpart for the `\\OCP\\IInitialStateService` on the back-end. Use it to retrieve your stored data on page load. Documentation: https://nextcloud-libraries.github.io/nextcloud-initial-state/

``@nextcloud/l10n``
^^^^^^^^^^^^^^^^^^^

This package provides everything around localization, like access to the current user's locale and translation helpers. Documentation: https://nextcloud-libraries.github.io/nextcloud-l10n/

``@nextcloud/logger``
^^^^^^^^^^^^^^^^^^^^^

This package provides a unified logging helper that adds app names, severity and other context to log messages. Use it to enhance the output of your app's logs, useful for development and triaging bug reports. Documentation: https://nextcloud-libraries.github.io/nextcloud-logger/

``@nextcloud/moment``
^^^^^^^^^^^^^^^^^^^^^

This package provides a modified version of `moment.js <https://momentjs.com/>`_ with the current user's locale set. Documentation: https://nextcloud-libraries.github.io/nextcloud-moment/

``@nextcloud/password-confirmation``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This package makes it possible to ask a user for confirmation on actions that have the ``#[PasswordConfirmationRequired]`` attribute or ``@PasswordConfirmationRequired`` annotation set on the controller method. Use it for critical actions. Documentation: https://nextcloud-libraries.github.io/nextcloud-password-confirmation/

``@nextcloud/paths``
^^^^^^^^^^^^^^^^^^^^

This package provides various helpers for file and folder paths. Documentation: https://nextcloud-libraries.github.io/nextcloud-paths/

``@nextcloud/router``
^^^^^^^^^^^^^^^^^^^^^

This package provides helpers to generate URLs, e.g. to access assets and REST APIs of your app or the Nextcloud server. Documentation: https://nextcloud-libraries.github.io/nextcloud-router/

.. _js-library_nextcloud-sharing:

``@nextcloud/sharing``
^^^^^^^^^^^^^^^^^^^^^^

This package provides helpers interact with the Files sharing app, e.g. to detect if the current page is a public share and retrieving the sharing token.
Documentation: https://nextcloud-libraries.github.io/nextcloud-sharing/

.. _js-library_nextcloud-vue:

``@nextcloud/vue``
^^^^^^^^^^^^^^^^^^

This package provides lots of Vue components allowing you to quickly build UIs in Nextcloud design.

- Documentation: https://nextcloud-vue-components.netlify.app/
- Source code: https://github.com/nextcloud-libraries/nextcloud-vue

Events
------

Network state changes
^^^^^^^^^^^^^^^^^^^^^

Your app can react to lost network connectivity, e.g. to gracefully handle this state where no server interaction is possible. Since the communication with the server mostly requires a valid CSRF token, you might not want to send any request before the token was updated. Nextcloud can notify you when this has happened. Use the ``@nextcloud/event-bus`` to listen for the ``networkOnline`` and ``networkOffline`` events:

.. code-block:: js

  import { subscribe } from '@nextcloud/event-bus'

  subscribe('networkOffline', () => console.info("we're offline"))
  subscribe('networkOnline', (event) => {
      if (event.successful) {
          console.info("we're back online, the token was updated")
      } else {
          console.info("we're back online, but the token might not be up to date")
      }
  })

Global variables
----------------

There are also global variables that acted as APIs in the past. The use of these variables is discouraged, as they lead to script loading order problems and the dependency hell, making it hard for the server component to update libraries.

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
