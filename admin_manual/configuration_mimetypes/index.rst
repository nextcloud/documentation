=============================================
Customizing MIME Types, Extensions, and Icons
=============================================

MIME types help Nextcloud know how to handle and present files. Nextcloud comes
with definitions for many common and less common file types. You can customize
MIME types, file extensions, and icon associations to suit the file types used
in your organization.

For example, you can associate a file extension with a MIME type, choose an
icon category for a MIME type, or provide a descriptive human-readable label.

In Nextcloud:

- a MIME type *mapping* associates a file extension with a MIME type identifier.
- a MIME type *alias* associates a MIME type with an icon category or another alias.
- a MIME type *name* associates a MIME type with a human-readable display name
  (such as "PDF document", rather than the MIME type identifier ``application/pdf``).

Mappings affect MIME type detection. Aliases and names affect presentation and
some user interface behavior; they do not change the file's detected MIME type.

The default baseline definitions are in ``resources/config/``:

- ``mimetypemapping.dist.json``
- ``mimetypealiases.dist.json``
- ``mimetypenames.dist.json``

Do not edit the ``resources/config/*.dist.json`` files: they are overwritten
when Nextcloud is updated. Instead, create corresponding custom JSON files in
``config/``. Custom entries override matching defaults; other defaults remain
in effect.

After changing a custom definition, run the ``occ`` command shown in the
corresponding section. The examples below are for Ubuntu Linux. Run them from
the Nextcloud installation directory as the HTTP user; see
:doc:`../occ_command` for more information.

MIME type mapping
-----------------

Mappings associate file extensions with MIME types.

.. note:: A mapping identifies the file type; it does not itself add support for
          opening a given file type.

Create ``config/mimetypemapping.json`` as a JSON object. The keys are
lowercase extensions without a leading dot, and each value is an array whose
first element is the MIME type. For example::

  {
    "amr": ["audio/amr"],
    "adoc": ["text/asciidoc", "text/plain"]
  }

The first value is the file's MIME type. An optional second value specifies a
safer alternative for contexts where Nextcloud uses a secure MIME type,
including WebDAV file responses, to reduce the risk of active content being
executed by a browser. For example, the default mapping
``"html": ["text/html", "text/plain"]`` identifies an HTML file as
``text/html`` but can serve it as plain text. This does not sanitize or change
the file.

If the second value is omitted, the first is used as the secure type. For formats
that can contain active content, consider an appropriate alternative such as
``text/plain`` for text or ``application/octet-stream`` for binary data. Retain shipped
alternatives unless you understand the consequences. Mappings that share a MIME
type should use consistent alternatives. See the shipped
``mimetypemapping.dist.json`` for examples.

Filename-based detection uses the final extension, ignoring its case. When
using combined filename and content detection, Nextcloud attempts content
detection if the filename yields ``application/octet-stream``.

After changing mappings, update the mimetype database and file cache::

  sudo -E -u www-data php occ maintenance:mimetype:update-db --repair-filecache

Without ``--repair-filecache``, the command updates cached files only for
mimetypes newly added to the database. With the option, it processes all
configured mappings and updates matching cached files, not just files affected
by the changed mapping.

MIME type aliases
-----------------

Aliases let multiple MIME types use the same icon category. They may also
affect the Files app's type filter. An alias does not change the file's MIME type.

Create ``config/mimetypealiases.json`` as a JSON object. For example, to use
the image icon instead of the default whiteboard icon for Excalidraw files::

  {
    "application/vnd.excalidraw+json": "image"
  }

The values are icon categories or other aliases; they are not necessarily
standard MIME types. Aliases can reference other aliases, provided they do
not form a circular dependency. See
``resources/config/mimetypealiases.dist.json`` for the defaults.

After changing aliases, regenerate the client-side mimetype list::

  sudo -E -u www-data php occ maintenance:mimetype:update-js

Aliases select from available icons; they do not create new icons.

Some available icon categories are:

``file``
  Generic file

``image``, ``audio``, ``video``
  Images, audio, and video

``text``, ``text/code``
  Text and source code

``text/calendar``, ``text/vcard``
  Calendar and contact files

``x-office/document``, ``x-office/spreadsheet``
  Documents and spreadsheets

``x-office/presentation``, ``x-office/drawing``
  Presentations and drawings

``x-office/form``, ``x-office/form-template``
  Forms and form templates

``font``, ``link``, ``location``, ``mindmap``, ``whiteboard``
  Fonts, links, location data, mind maps, and whiteboards

``package/x-generic``
  Archives and packages

This list is not exhaustive. See ``core/img/filetypes/`` for the
icons shipped with your installation. Icon filenames replace slashes with
hyphens; for example, ``x-office/drawing`` uses ``x-office-drawing.svg``.
Aliases are resolved before looking up an icon.

.. note:: Custom file-type icons can be supplied through a legacy custom theme, however,
          this approach is deprecated. The Theming app's branding settings do not
          currently provide an interface for adding them.

MIME type names
---------------

To customize human-readable file type names, create ``config/mimetypenames.json``
as a JSON object mapping mimetypes to names. For example::

  {
    "application/x-example": "Example document"
  }

See ``resources/config/mimetypenames.dist.json`` for the defaults. After changing
names, regenerate the client-side mimetype list::

  sudo -E -u www-data php occ maintenance:mimetype:update-js

Icon retrieval
--------------

For icon lookup, Nextcloud first resolves any aliases, then looks for an icon
for the resulting value. If no specific icon exists, it will use a more general
one. For example, ``image/my-custom-image`` can fall back to the ``image``
icon. If no matching icon is available, the generic ``file`` icon is used.

Example: AMR audio (``audio/amr``)
----------------------------------

For example, *AMR audio* is an audio compression codec used for speech
recordings. It uses a dedicated file format (``.amr``). At the time of this
writing, the default mappings do not include ``.amr``, so you would need to
add it.

Place the following in ``config/mimetypemapping.json``::

  {
    "amr": ["audio/amr"]
  }

.. tip:: If the ``config/mimetypemapping.json`` file already exists, an app or 
         another administrator may have added a custom MIME type mapping. If so,
         add the ``"amr"`` entry to its existing JSON object (the part between
         the ``{ ... }``) instead of replacing the entire contents of the file.

This maps ``.amr`` files to the RFC-registered ``audio/AMR`` media type. No alias
is needed for the generic audio icon to be utilized for this newly added MIME type:
icon lookup falls back from ``audio/amr`` to the broader ``audio`` icon when no
more specific icon or alias applies.

Update the mimetype database and existing file cache entries::

  sudo -E -u www-data php occ maintenance:mimetype:update-db --repair-filecache

.. note:: The mapping identifies the file type; it does not itself add playback
          support.
