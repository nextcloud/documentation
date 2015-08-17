Mimetype mapping
================

ownCloud allows administrators to specify the mapping of a file extension to a
mimetype. For example files ending in ``mp3`` map to ``audio/mpeg``. Which 
then in turn allows ownCloud to show the audio icon.

By default ownCloud comes with ``mimetypemapping.dist.json``. This is a
simple json array.
Administrators should not update this file as it will get replaced on upgrades
of ownCloud. Instead the file ``mimetypemapping.json`` should be created and
modified, this file has precedence over the shipped file. 

