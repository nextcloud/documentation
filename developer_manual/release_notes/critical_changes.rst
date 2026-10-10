.. _critical-changes:

================
Critical changes
================

..
    Add one section for each change.
    Only list changes absolutely necessary to keep an app running. Use the dedicated deprecation and new features pages for optional changes and announcements.

    The sections are somewhat ordered so changes affecting most apps come first, and more specific ones come later.


info.xml requirements
---------------------

Update info.xml to add Nextcloud 36 to the support range:

.. code-block:: xml

  <dependencies>
    <nextcloud min-version="36" max-version="36" />
  </dependencies>

To allow installation on older versions too, just keep the previous min-version.

The Viewer is a library, not an app
-----------------------------------

The ``viewer`` app has been removed from Nextcloud 36. The viewer itself now ships as the
`@nextcloud/viewer <https://www.npmjs.com/package/@nextcloud/viewer>`_ library, which any app
can depend on:

.. code-block:: bash

    npm install --save @nextcloud/viewer

The server registers the handlers for images, video and audio itself. Several apps on one page
may each bring their own copy of the library: they elect the newest between them, and only that
one is ever loaded, the first time a file is opened.

Registering a handler
^^^^^^^^^^^^^^^^^^^^^

Register handlers from a script loaded with ``\OCP\Util::addInitScript()``. The Files list
reads the available actions when it first renders, so a handler registered after that is a
file that does not open.

A handler shows the file in a custom element of its own. Define it in ``onInit``, which the
viewer calls the first time it needs the element, so the view stays out of the script that runs
on every page:

.. code-block:: javascript

    import { registerHandler } from '@nextcloud/viewer'

    registerHandler({
        id: 'my_app',
        displayName: t('my_app', 'My files'),
        // Custom element names are shared by the whole page: start yours with your app id
        tagName: 'my_app-viewer',
        enabled: (nodes) => nodes.every((node) => node.mime === 'application/x-my-format'),
        onInit: async () => {
            // A module that calls customElements.define('my_app-viewer', …)
            await import('./viewer-element.js')
        },
    })

The element receives the file to show, and the list it belongs to, as properties.

Opening the viewer
^^^^^^^^^^^^^^^^^^

Replace ``OCA.Viewer`` with the library. Nothing needs to be dispatched to load the viewer, so
apps can stop dispatching ``\OCA\Viewer\Event\LoadViewer`` too. Ask the service for the
viewer and hand it nodes:

.. code-block:: javascript

    import { canView, getViewer } from '@nextcloud/viewer'

    // OCA.Viewer.open({ path }) becomes, with `node` an INode from @nextcloud/files:
    const session = await getViewer().open([node], node)

    // OCA.Viewer.mimetypes.includes(node.mime) becomes:
    canView(node)

The first argument is the list to page through, the second the file to open. ``open()`` takes
options as a third argument, among them ``enableSidebar`` for a file the Files sidebar cannot
resolve.

The viewer tells you what happens with events on the session ``open()`` resolves with, rather
than with callbacks:

.. list-table::
   :header-rows: 1

   * - Event
     - ``detail``
     - Replaces
   * - ``update:file``
     - ``[file]``
     - ``onPrev``, ``onNext``
   * - ``update:editing``
     - ``[editing]``
     - ``onEditingChange``
   * - ``close``
     - ``[]``
     - ``onClose``
   * - ``before-download``
     - ``{ file, waitUntil }``
     - ``downloadCallback``

.. code-block:: javascript

    session.addEventListener('close', () => {
        // the viewer was closed
    })

``getViewer()`` dispatches the same events, whoever opened the viewer. A handler's element gets
``before-download`` as well: an editor with unsaved changes can pass ``waitUntil()`` a promise
to have the download wait until they are saved.

``getViewer().compare(file, base)`` replaces ``OCA.Viewer.compare()``, with ``base`` the older
version. It shows both side by side, or, for a handler that can, what changed between them in one
view: pass ``{ view: 'differences' }`` as a third argument to open on it.

``OCA.Viewer.setRootElement()`` has no replacement. It rendered a single file into an element
of your choosing instead of the modal, and the only known user was a public share page. Show a
preview of the file there and let a click on it call ``open()``.

The full API is documented with `the library <https://github.com/nextcloud-libraries/nextcloud-viewer#readme>`_.

Enabled preview providers
^^^^^^^^^^^^^^^^^^^^^^^^^

The viewer app provided the enabled preview providers as an initial state, which apps could
read with ``loadState('viewer', 'enabled_preview_providers')``. It is a capability now, so it
is available wherever capabilities are, public share pages included:

.. code-block:: javascript

    import { getCapabilities } from '@nextcloud/capabilities'

    getCapabilities().core.previews.enabled_providers

See :ref:`preview-capabilities` for what it contains.

Removed front-end APIs and libraries
------------------------------------

- TBD

Removed back-end APIs
---------------------

Removed legacy hooks
^^^^^^^^^^^^^^^^^^^^

Hooks were the predecessor of the current Nextcloud event system.
They were deprecated in Nextcloud 17 in favor of the event system in general
and specific hooks based on when a replacement event was available.
With Nextcloud 36 the following hooks were removed,
if your app relies on them please migrate to the replacement event.

.. list-table::
   :header-rows: 1
   :widths: 55 45

   * - Hook
     - Replacement event
   * - ``\OC\Core\LostPassword\Controller\LostController::pre_passwordReset``
     - ``OC\Core\Events\BeforePasswordResetEvent``
   * - ``\OC\Core\LostPassword\Controller\LostController::post_passwordReset``
     - ``OC\Core\Events\PasswordResetEvent``
   * - ``\OCP\Versions::rollback``
     - ``OCA\Files_Versions\Events\VersionRestoredEvent``

Unified sharing
---------------

.. todo::

    This is work in progress and needs an update when the changes have been finalized.

Changes to sharing APIs and user interface are planned. This includes both a new general API for sharing of entities and updates to the sharing user interface. See `nextcloud/server#51803 <https://github.com/nextcloud/server/issues/51803>`_ for details and mockups.
