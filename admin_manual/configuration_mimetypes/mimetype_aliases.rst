Mimetype aliases
================

ownCloud allows administrators to specify aliases for mimetypes. This makes it
possible to show more specific icons for certain mimetypes. Take as an example
audio files. It is nicer if they show a nice audio icon instead of the default
file icon.

By default ownCloud comes with ``mimetypealiases.dist.json``. This is a
simple json array.
Administrators should not update this file as it will get replaced on upgrades
of ownCloud. Instead the file ``mimetypealiases.json`` should be created and
modified, this file has precedence over the shipped file. 

Updating mimetype aliases
-------------------------
If there is a custom ``mimetypealiases.json`` and that is edited or ownCloud is
updated you should run::

  $ ./occ maintenance:mimetypesjs

This commands makes sure that the changes are propagate through the system.
