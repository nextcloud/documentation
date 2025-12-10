=========
Mimetypes
=========

*Mapping extensions to mimetypes and configuring filetype icons.*

Extension mapping
-----------------

Administrators can control how file extensions map to mimetypes. This affects how Nextcloud detects files and which icons are shown. For example, mapping the extension ``mp3`` to the mimetype ``audio/mpeg`` causes Nextcloud to use the ``audio`` icon for MP3 files.

The shipped defaults are in ``resources/config/mimetypemapping.dist.json`` (do not modify).

Extension configuration
~~~~~~~~~~~~~~~~~~~~~~~

To override defaults, create ``config/mimetypemapping.json`` in your Nextcloud installation's ``config/`` folder. Entries in that file take precedence over the shipped defaults.

Format: ``mimetypemapping.json`` is a JSON object where each key is a file extension and each value is an array of mimetype strings. The first element is the primary mimetype; an optional second element is a secure alternative (used to avoid potential XSS when exposing a mimetype to clients).

Example ``mimetypemapping.json``:

.. code-block:: json

  {
    "mp3": ["audio/mpeg"],
    "m4a": ["audio/mp4"],
    "svg": ["image/svg+xml", "text/plain"],
    "md": ["text/markdown"]
  }

Icon mapping
------------

Nextcloud lets you control which icon is shown for a given mimetype. In Nextcloud an "alias" maps a mimetype (for example ``audio/mpeg``) — or a top-level type (for example ``image``) — to an icon identifier (token). The system resolves that token to a concrete icon file. For example, adding ``"audio/mpeg": "audio"`` makes MP3 files use the icon associated with the``audio``token (which resolves to icon file ``core/img/filetypes/audio.svg``). See the Icon configuration section below for how to override the shipped alias defaults and the Icon retrieval section for details on icon file resolution.

The shipped defaults are in ``resources/config/mimetypealiases.dist.json`` (do not modify).

Icon configuration
~~~~~~~~~~~~~~~~~~

To override aliases, create ``config/mimetypealiases.json`` in your Nextcloud installation's ``config/`` folder. Entries there override the shipped defaults.

Important: an alias value is a token (an identifier), not a direct filesystem path. The shipped defaults map full mimetypes to tokens (for example ``"audio/mpeg": "audio"``). The detection code resolves tokens and then looks up icon files under the core filetypes folder (see Icon retrieval). Do not assume that setting an alias value to a path like ``apps/yourapp/img/icons/foo.svg`` will make Detection load that file.

Example ``mimetypealiases.json`` (token-based):

.. code-block:: json

  {
    "audio/mpeg": "audio",
    "image/svg+xml": "image/vector",
    "application/pdf": "application-pdf"
  }

After editing, regenerate client-side icon data (run as the webserver user):

.. code-block:: console

  sudo -E -u www-data php occ maintenance:mimetype:update-js

To update icons for existing files, repair the filecache:

.. code-block:: console

  sudo -E -u www-data php occ maintenance:mimetype:update-db --repair-filecache

See :doc:`../occ_command` for more about ``occ``.

Icon retrieval
~~~~~~~~~~~~~~

When resolving an icon for a mimetype, Nextcloud follows this sequence:

1. Load aliases from ``config/mimetypealiases.json`` (overrides) merged over ``resources/config/mimetypealiases.dist.json`` (defaults).
2. If an alias exists for the full mimetype, replace the mimetype with the alias token. Repeat while an alias exists (alias chaining is supported).
3. Convert the resulting token to a filename by replacing ``/`` and ``\`` with ``-`` (for example ``image/vector`` → ``image-vector``).
4. Handle directory tokens specially (``dir``, ``dir-shared``, ``dir-external``).
5. Try to load ``core/img/filetypes/<token-as-filename>.svg`` via the URL generator (this honours theme overrides).
6. If not found and the filename contains a dash, try the top-level part before the dash (``image-vector`` → ``image.svg``).
7. If still not found, fall back to the generic ``core/img/filetypes/file.svg``.

Notes:
- Because Detection resolves tokens and then requests core filetypes images, it does not directly load arbitrary files from other app paths. To provide a custom icon for an alias, install the icon where the URL generator will find it (see Custom icons).
- Run the occ commands above after changes so client-side code picks up the updates.

Default icons
~~~~~~~~~~~~~

The alias values used in the shipped defaults are tokens (often containing slashes). Nextcloud converts these tokens to dashed filenames when looking up SVGs under ``core/img/filetypes/``. If a dashed filename is missing, Nextcloud falls back to the parent token and then to ``file.svg``.

Common tokens used in the defaults include:

* ``image`` — Generic image (core/img/filetypes/image.svg)
* ``image/vector`` — Vector image (lookups to core/img/filetypes/image-vector.svg; falls back to image.svg)
* ``audio`` — Generic audio file (core/img/filetypes/audio.svg)
* ``application-pdf`` — PDF document (core/img/filetypes/application-pdf.svg)
* ``file`` — Generic file (core/img/filetypes/file.svg)
* ``font`` — Font file (core/img/filetypes/font.svg)
* ``mindmap`` — Mindmap file (core/img/filetypes/mindmap.svg)
* ``text`` — Generic text document (core/img/filetypes/text.svg)
* ``text/code`` — Source code (core/img/filetypes/text-code.svg)
* ``video`` — Video file (core/img/filetypes/video.svg)
* ``x-office/document`` — Word processed document (core/img/filetypes/x-office-document.svg)
* ``x-office/drawing`` — (core/img/filetypes/x-office-drawing.svg)
* ``x-office/presentation`` — Presentation (core/img/filetypes/x-office-presentation.svg)
* ``x-office/spreadsheet`` — Spreadsheet (core/img/filetypes/x-office-spreadsheet.svg)

For example the alias token ``image/vector`` will result in a lookup for ``core/img/filetypes/image-vector.svg``; if that file does not exist Nextcloud falls back to ``core/img/filetypes/image.svg`` and then to the generic ``core/img/filetypes/file.svg``.

Custom icons
~~~~~~~~~~~~

1. Create the icon file
   - Prefer SVG (scalable vector). Provide a PNG fallback if desired/needed as a fallback (for older browsers or tooling).
   - SVGs should be self-contained (no external fonts, scripts or linked assets).
   - For additional guidance, see the *Icon file guidance* section in this chapter's appendix.

2. Install the file where the URL generator will find it for core filetypes lookups:
   - Recommended (upgrade-safe): ``themes/<yourtheme>/core/img/filetypes/<token>.svg``
   - Fallback (not upgrade-safe): ``core/img/filetypes/<token>.svg``

   Rationale: Detection resolves aliases to a token and requests ``core`` + ``filetypes/<token>.svg``. The URL generator checks theme overrides (``themes/<theme>/core/img/...``) first, then core. Placing files in these locations ensures Detection finds them without code changes.

   Important: placing an icon under ``apps/<yourapp>/img/...`` will not be found by Detection's mimeTypeIcon path, because Detection requests the icon via ``imagePath('core', 'filetypes/<...>.svg')``.

3. Add or update an alias in ``config/mimetypealiases.json`` mapping the mimetype (or top-level type) to the token you used as the filename, for example:

.. code-block:: json

  {
    "audio/mpeg": "audio",
    "image/svg+xml": "image/vector",
    "application/vnd.custom.foo": "custom-foo"
  }

Then install the file(s) as:

- ``themes/mytheme/core/img/filetypes/custom-foo.svg``

After editing run:

.. code-block:: console

  sudo -E -u www-data php occ maintenance:mimetype:update-js

and, if needed:

.. code-block:: console

  sudo -E -u www-data php occ maintenance:mimetype:update-db --repair-filecache

Troubleshooting
---------------

* Validate your JSON (use a JSON validator).
* Ensure files in ``config/`` and installed icon files are readable by the webserver user.
* Clear browser cache; client-side JS may be cached.
* Test custom icon URLs in a browser to confirm they are served.
* If an alias references a missing file, Nextcloud falls back to the parent token icon or the generic icon.

----

Icon file guidance
------------------

- Format
  - Prefer SVG (scalable vector). Provide a PNG fallback only if needed for legacy clients.
  - SVGs should be self-contained (no external fonts, scripts or linked assets).

- Match the existing core set
  - Core filetype icons in Nextcloud currently use either ``viewBox="0 0 16 16"`` or ``viewBox="0 0 24 24"`` (some with width/height).
  - To ensure consistent rendering with shipped icons, match the viewBox used by your installation's core icons and just generally try to match the existing set for consistency.

- File naming and fallbacks
  - Name files to match the alias token converted to a dashed filename, e.g. alias token ``image/vector`` → ``image-vector.svg``.
  - Provide a PNG fallback only if required: ``<token>.png`` (same basename as the SVG). Nextcloud will use the PNG only when no SVG exists in the theme/core lookup.
  - Use lowercase, dash-separated names (no spaces).

- Raster (PNG) sizes (if providing PNG fallbacks)
  - Provide at least a 1× size equivalent to the SVG canvas.
  - Optimize PNGs to keep file size small.

- Accessibility & semantics
  - Filetype icons are usually decorative — avoid embedding title/desc that duplicate surrounding text. The application UI should mark decorative icons as aria-hidden when appropriate.
  - Ensure transparent background (no opaque white rectangle).

- Performance & size
  - Keep SVGs simple and small (remove metadata and editor cruft).
  - Avoid very large path counts and embedded images.

- Testing
  - Place the icon in a theme location (recommended): ``themes/<yourtheme>/core/img/filetypes/<token>.svg``.
  - Run: ``sudo -E -u www-data php occ maintenance:mimetype:update-js``
  - Clear browser cache and verify the icon URL in the browser (confirm the file serves correctly).
  - If the dashed filename is missing, Nextcloud will fall back to the parent token icon (e.g. ``image-vector`` → ``image.svg``) then to ``core/img/filetypes/file.svg``. Test these fallbacks.

Minimal SVG template (copy/paste)
.. code-block:: xml

  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-hidden="true">
    <!-- Use fill="currentColor" if you want the icon to inherit UI color -->
    <g fill="currentColor" stroke="none">
      <!-- example: simple document symbol centered with padding -->
      <rect x="12" y="8" width="40" height="48" rx="3" />
      <rect x="18" y="18" width="28" height="6" />
      <rect x="18" y="28" width="28" height="6" />
    </g>
  </svg>
