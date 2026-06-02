==============
Direct editing
==============

.. versionadded:: 18

The direct editing API unifies one-time token generation and editor discovery into
a single server API, so that mobile apps and the desktop client can edit files
without every editor app shipping its own token handling and endpoints.

The basic idea: a client asks the server for a **one-time URL** to create or open a
file in a given editor. The server returns a URL that can be loaded in an
**unauthenticated webview**. The editor app takes over from there, handling the
actual editing and saving with its own session/token mechanism.

This page covers three layers:

* :ref:`direct-editing-register` — for **app developers** who want to make their
  editor available through direct editing (server-side PHP).
* :ref:`direct-editing-http` — for **client developers** who consume the editor
  list and request one-time URLs (OCS HTTP API).
* :ref:`direct-editing-webview` — the messaging convention used between the editor
  web page and the native client once the webview is open.

Overview
--------

A typical create-and-edit flow looks like this::

    Client (mobile/desktop)                Server                     Editor app
    -----------------------                ------                     ----------
    1. GET  .../directEditing       ->  list of editors + creators
    2. POST .../directEditing/create -> one-time URL (/directEditing/<token>)
    3. open URL in webview          ->  route resolves token, calls
                                        IEditor::open(IToken)        -> editor page
    4. webview <----------------------------------------------------> native client
       (loading/loaded/close/... messages, see "Webview integration")

The one-time token is consumed the first time the webview URL is opened. From that
point on, keeping the session alive (editing, saving, refreshing) is the editor
app's own responsibility — direct editing only bootstraps the session.

.. _direct-editing-register:

Registering an editor
----------------------

To expose your app through direct editing, implement
``OCP\DirectEditing\IEditor`` and register it when the
``OCP\DirectEditing\RegisterDirectEditorEvent`` is dispatched.

The editor class
^^^^^^^^^^^^^^^^

``IEditor`` describes how your editor is presented and how a file is opened:

* ``getId(): string`` — a unique identifier for the editor, e.g. ``text``.
* ``getName(): string`` — a human-readable name, e.g. ``Nextcloud Text``.
* ``getMimetypes(): string[]`` — mimetypes that should open in this editor by
  default.
* ``getMimetypesOptional(): string[]`` — mimetypes that *can* optionally be opened
  in this editor.
* ``getCreators(): array`` — a list of ``ACreateEmpty`` / ``ACreateFromTemplate``
  instances offered as "create new …" entries (see :ref:`direct-editing-creators`).
* ``isSecure(): bool`` — whether the editor can display a file securely without
  downloading it to the browser.
* ``open(IToken $token): Response`` — return the page that renders the editor.
  This is called **once**, when the client opens the one-time URL. See
  :ref:`direct-editing-open`.

Registering the editor
^^^^^^^^^^^^^^^^^^^^^^^^

Register your editor in ``lib/AppInfo/Application.php`` by listening for
``RegisterDirectEditorEvent`` and calling ``register()`` on it:

.. code-block:: php

    <?php
    declare(strict_types=1);

    namespace OCA\MyApp\AppInfo;

    use OCA\MyApp\DirectEditing\MyEditor;
    use OCP\AppFramework\App;
    use OCP\AppFramework\Bootstrap\IBootContext;
    use OCP\AppFramework\Bootstrap\IBootstrap;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;
    use OCP\DirectEditing\RegisterDirectEditorEvent;

    class Application extends App implements IBootstrap {
        public function register(IRegistrationContext $context): void {
            $context->registerEventListener(
                RegisterDirectEditorEvent::class,
                RegisterMyEditorListener::class,
            );
        }

        public function boot(IBootContext $context): void {
        }
    }

The listener registers the editor instance on the manager carried by the event:

.. code-block:: php

    <?php
    declare(strict_types=1);

    namespace OCA\MyApp\Listener;

    use OCA\MyApp\DirectEditing\MyEditor;
    use OCP\DirectEditing\RegisterDirectEditorEvent;
    use OCP\EventDispatcher\Event;
    use OCP\EventDispatcher\IEventListener;

    /** @template-implements IEventListener<RegisterDirectEditorEvent> */
    class RegisterMyEditorListener implements IEventListener {
        public function __construct(private MyEditor $editor) {
        }

        public function handle(Event $event): void {
            if (!$event instanceof RegisterDirectEditorEvent) {
                return;
            }
            $event->register($this->editor);
        }
    }

.. note::

    ``text`` provides a reference implementation. See ``lib/DirectEditing/`` in the
    `nextcloud/text <https://github.com/nextcloud/text>`_ repository.

.. _direct-editing-creators:

Document creators
^^^^^^^^^^^^^^^^^^

Creators produce the "Create a new …" entries shown by clients (for example
"New text document"). Each creator is returned from ``IEditor::getCreators()``.

Extend ``OCP\DirectEditing\ACreateEmpty`` for a plain creator:

* ``getId(): string`` — unique id of the creator, e.g. ``textdocument``.
* ``getName(): string`` — descriptive name, e.g. ``New text document``.
* ``getExtension(): string`` — default file extension, e.g. ``.md``.
* ``getMimetype(): string`` — mimetype of the created file.
* ``create(File $file, ?string $creatorId = null, ?string $templateId = null): void``
  — optionally prefill the freshly created file with content.

Extend ``OCP\DirectEditing\ACreateFromTemplate`` (which itself extends
``ACreateEmpty``) to additionally offer templates:

* ``getTemplates(): ATemplate[]`` — the templates available for this creator.

Each template extends ``OCP\DirectEditing\ATemplate`` and exposes ``getId()``,
``getTitle()`` and a preview image link. Whether a creator offers templates is
advertised automatically (``templates: true``) when it is an instance of
``ACreateFromTemplate``.

.. _direct-editing-open:

Opening a file
^^^^^^^^^^^^^^^

When the client opens the one-time URL, the server resolves the token and calls
``IEditor::open(IToken $token)``. Your implementation returns a ``Response`` that
renders the editor for the file behind the token. ``OCP\DirectEditing\IToken``
gives you the context you need:

* ``getFile(): File`` — the file to edit.
* ``getEditor(): string`` — the editor id the token was issued for.
* ``getUser(): string`` — the user the token belongs to.
* ``useTokenScope(): void`` — run subsequent file access within the token's scope.
* ``extend(): void`` — extend the token validity.
* ``invalidate(): void`` — invalidate the token.
* ``hasBeenAccessed(): bool`` — whether the token has already been used.

The one-time token is only meant to bootstrap the editor. After ``open()`` has
rendered the page, the editor app must take over with its own token/session
handling for editing and saving (this mirrors how Collabora switches from a
one-time token to a regular WOPI token).

.. _direct-editing-http:

HTTP API
--------

All endpoints are OCS endpoints under::

    /ocs/v2.php/apps/files/api/v1/directEditing

As with every OCS request, send the ``OCS-APIRequest: true`` header and
authenticate the user. Add ``?format=json`` to receive JSON. All examples below
omit boilerplate for brevity.

List editors and creators
^^^^^^^^^^^^^^^^^^^^^^^^^^

``GET /directEditing``

Returns the available editors and creators. Clients use this for discovery before
offering create/open actions. The response carries an **ETag**; clients should
cache the result and re-request only when the ETag changes.

.. code-block:: bash

    curl 'https://cloud.example.com/ocs/v2.php/apps/files/api/v1/directEditing?format=json' \
        -u user:password \
        -H 'OCS-APIRequest: true'

.. code-block:: json

    {
      "ocs": {
        "meta": { "status": "ok", "statuscode": 200, "message": "OK" },
        "data": {
          "editors": {
            "text": {
              "id": "text",
              "name": "Nextcloud Text",
              "mimetypes": ["text/markdown"],
              "optionalMimetypes": ["text/plain"],
              "secure": false
            }
          },
          "creators": {
            "textdocument": {
              "id": "textdocument",
              "editor": "text",
              "name": "New text document",
              "extension": ".md",
              "templates": false,
              "mimetype": "text/markdown"
            }
          }
        }
      }
    }

List templates
^^^^^^^^^^^^^^^

``GET /directEditing/templates/{editorId}/{creatorId}``

Returns the templates for a creator that advertises ``templates: true``.

.. code-block:: bash

    curl 'https://cloud.example.com/ocs/v2.php/apps/files/api/v1/directEditing/templates/text/textdocumenttemplate?format=json' \
        -u user:password \
        -H 'OCS-APIRequest: true'

.. code-block:: json

    {
      "ocs": {
        "meta": { "status": "ok", "statuscode": 200, "message": "OK" },
        "data": {
          "templates": {
            "1": { "id": "1", "title": "Weekly ToDo", "preview": "https://…" },
            "2": { "id": "2", "title": "Meeting notes", "preview": "https://…" }
          }
        }
      }
    }

Create a file
^^^^^^^^^^^^^

``POST /directEditing/create``

Creates a new file and returns the one-time URL to edit it.

Parameters:

* ``path`` (required) — target path of the new file.
* ``editorId`` (required) — editor to open the file in.
* ``creatorId`` (required) — creator to use for the new file.
* ``templateId`` (optional) — template to base the file on.

.. code-block:: bash

    curl -X POST 'https://cloud.example.com/ocs/v2.php/apps/files/api/v1/directEditing/create?path=/foo.md&editorId=text&creatorId=textdocument&format=json' \
        -u user:password \
        -H 'OCS-APIRequest: true'

.. code-block:: json

    {
      "ocs": {
        "meta": { "status": "ok", "statuscode": 200, "message": "OK" },
        "data": {
          "url": "https://cloud.example.com/index.php/apps/files/directEditing/<token>"
        }
      }
    }

Open a file
^^^^^^^^^^^

``POST /directEditing/open``

Returns a one-time URL to open an existing file.

Parameters:

* ``path`` (required) — path of the file to open.
* ``editorId`` (optional) — editor to open the file in; if omitted, the default
  editor for the file's mimetype is used.
* ``fileId`` (optional) — open by file id instead of path.

.. code-block:: bash

    curl -X POST 'https://cloud.example.com/ocs/v2.php/apps/files/api/v1/directEditing/open?path=/foo.md&editorId=text&format=json' \
        -u user:password \
        -H 'OCS-APIRequest: true'

The response has the same shape as ``create`` — a ``data.url`` pointing at
``/index.php/apps/files/directEditing/<token>``.

Opening the editor
^^^^^^^^^^^^^^^^^^^

The returned URL is a one-time, unauthenticated webview URL::

    GET /index.php/apps/files/directEditing/<token>

Loading it consumes the token and triggers ``IEditor::open()`` on the server,
which renders the editor page. Open this URL in the client's webview.

Error responses follow the OCS convention. A disabled direct editing setup
returns HTTP ``500`` with a message; a failed create/open returns HTTP ``403``.

.. _direct-editing-webview:

Webview integration
--------------------

Once the editor page is loaded in the client's webview, the page and the native
client exchange messages. This is a convention shared by the first-party editors
(``text``, ``richdocuments``, ``whiteboard``, ``eurooffice``) and the Nextcloud
Android and iOS apps; it is not enforced by the server.

The interface object
^^^^^^^^^^^^^^^^^^^^^

The native client injects a named interface object into the page. The editor page
sends messages through it. Editors based on the generic direct editing flow use
the name ``DirectEditingMobileInterface``; ``richdocuments`` uses its own
``RichDocumentsMobileInterface`` (it carries a richer, Collabora-specific message
set). A page should feature-detect the object before using it.

Two transports are used, picked by which one the host provides:

**Android — injected interface (direct method call).** The interface object
exposes one method per message name. Arguments, if any, are passed as a single
**JSON string**:

.. code-block:: javascript

    // no arguments
    window.DirectEditingMobileInterface.close()
    // with arguments
    window.RichDocumentsMobileInterface.hyperlink(JSON.stringify(values))

**iOS — script message handler.** All messages go through one ``postMessage``
handler. A message with arguments is sent as an object with ``MessageName`` and
``Values``; a message without arguments is sent as the bare name string:

.. code-block:: javascript

    // no arguments
    window.webkit.messageHandlers.DirectEditingMobileInterface.postMessage('close')
    // with arguments
    window.webkit.messageHandlers.RichDocumentsMobileInterface.postMessage({
        MessageName: 'hyperlink',
        Values: values,
    })

So a native client implements **both** shapes: a named method that receives a JSON
*string* (Android), and a single handler that switches on ``MessageName`` and reads
the ``Values`` *object* (iOS).

Messages: editor page → native client
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The following messages are sent by the editor page.

.. list-table::
    :header-rows: 1
    :widths: 20 15 65

    * - Message
      - Payload
      - Meaning
    * - ``loading``
      - —
      - Editor is starting to load.
    * - ``loaded``
      - —
      - Editor finished loading.
    * - ``documentLoaded``
      - —
      - **Deprecated since Nextcloud 34**, use ``loaded`` instead. Document frame
        is ready (richdocuments equivalent of ``loaded``).
    * - ``close``
      - —
      - The editor requests the webview to be closed.
    * - ``share``
      - —
      - Open the native share UI for the file.
    * - ``reload``
      - —
      - The editor requests a reload (e.g. after session invalidation).
    * - ``paste``
      - —
      - Trigger a native paste into the editor.
    * - ``insertGraphic``
      - —
      - Ask the client to pick an image to insert (see ``postAsset`` below).
    * - ``downloadAs``
      - object
      - Download/export the file. Values: ``URL``, ``Type`` (``print`` /
        ``slideshow`` / otherwise download), optional ``filename``.
    * - ``fileRename``
      - object
      - The file was renamed. Values: ``NewName``.
    * - ``hyperlink``
      - object
      - Open a hyperlink natively. Values: ``Url``.

.. note::

    The argument keys above are defined by the editor. ``downloadAs`` uses ``URL``
    (all caps) while ``hyperlink`` uses ``Url`` — mind the casing when parsing.

Calls: native client → editor page
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The native client can call back into the page with ``evaluateJavascript``. This is
currently used only by ``richdocuments``, which exposes methods on
``OCA.RichDocuments.documentsMain``:

* ``postAsset(filename, url)`` — insert an image the user selected natively. This
  is the reply to the ``insertGraphic`` message: the client opens its picker,
  uploads/creates the asset, then calls ``postAsset`` with the resulting file name
  and URL.
* ``postGrabFocus()`` — re-focus the editor after the native UI (picker, share
  sheet, app switch) is dismissed. Clients should feature-detect it, e.g.
  ``if (typeof OCA.RichDocuments.documentsMain.postGrabFocus !== 'undefined')``.

Implementation notes
^^^^^^^^^^^^^^^^^^^^^

* Editors should send only the messages they need and clients should ignore
  unknown ones. Because the page feature-detects the interface method (Android) and
  the client switches on the message name (iOS), unsupported messages are dropped
  silently rather than raising errors.
* Coverage is not uniform across platforms today: for example, ``loading`` is a
  no-op or unhandled on some clients, and ``reload`` is not handled on all of them.
  Do not rely on every message being acted on by every client.
* When adding a new message, document it here and implement it on both transports
  and both apps to keep behaviour consistent.

See also
--------

* ``OCP\DirectEditing\IEditor`` and the other ``OCP\DirectEditing\*`` interfaces.
* The ``RegisterDirectEditorEvent`` entry in the :ref:`list of events <Events>`.
* Reference editor implementation: ``lib/DirectEditing/`` in
  `nextcloud/text <https://github.com/nextcloud/text>`_.
