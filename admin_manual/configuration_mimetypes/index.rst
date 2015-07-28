====================
Mimetypes Management
====================


.. toctree::
    :maxdepth: 2
    
    mimetype_aliases
    mimetype_mapping

Icon retrieval
--------------

When an icon is retrieved for a mimetype, if the full mimetype cannot be found,
the search will fallback to looking for the part before the slash. Given a file
with the mimetype 'image/my-custom-image', if no icon exists for the full
mimetype, the icon for 'image' will be used instead. This allows specialised
mimetypes to fallback to generic icons when the relevant icons are unavailable.
