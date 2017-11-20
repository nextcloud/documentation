====================
Mimetypes management
====================

Mimetype aliases
----------------

Nextcloud allows you to create aliases for mimetypes, so that you can display 
custom icons for files. For example, you might want a nice audio icon for audio 
files instead of the default file icon.

By default Nextcloud is distributed with 
``nextcloud/resources/config/mimetypealiases.dist.json``.
Do not modify this file, as it will be replaced when Nextcloud is updated. 
Instead, create your own ``nextcloud/config/mimetypealiases.json`` 
file with your custom aliases. Use the same syntax as in 
``nextcloud/resources/config/mimetypealiases.dist.json``.

Once you have made changes to your ``mimetypealiases.json``, use the ``occ`` 
command to propagate the changes through the system. This example is for 
Ubuntu Linux::

  $ sudo -u www-data php occ maintenance:mimetype:update-js
  
See :doc:`../configuration_server/occ_command` to learn more about ``occ``.

Some common mimetypes that may be useful in creating aliases are:

image
  Generic image

image/vector
  Vector image

audio
  Generic audio file

x-office/document
  Word processed document

x-office/spreadsheet
  Spreadsheet

x-office/presentation
  Presentation

text
  Generic text document

text/code
  Source code

Mimetype mapping
----------------

Nextcloud allows administrators to specify the mapping of a file extension to a
mimetype. For example files ending in ``mp3`` map to ``audio/mpeg``. Which 
then in turn allows Nextcloud to show the audio icon.

By default Nextcloud comes with ``mimetypemapping.dist.json``. This is a
simple json array.
Administrators should not update this file as it will get replaced on upgrades
of Nextcloud. Instead the file ``mimetypemapping.json`` should be created and
modified, this file has precedence over the shipped file. 

Icon retrieval
--------------

When an icon is retrieved for a mimetype, if the full mimetype cannot be found,
the search will fallback to looking for the part before the slash. Given a file
with the mimetype 'image/my-custom-image', if no icon exists for the full
mimetype, the icon for 'image' will be used instead. This allows specialised
mimetypes to fallback to generic icons when the relevant icons are unavailable.
