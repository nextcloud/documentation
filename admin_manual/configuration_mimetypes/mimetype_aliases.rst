Mimetype aliases
================

ownCloud allows administrators to specify aliases for mimetypes. This makes it
possible to show more specific icons for certain mimetypes. Take as an example
audio files. It is nicer if they show a nice audio icon instead of the default
file icon.

By default ownCloud is distributed with ``config/mimetypealiases.dist.json``.
Administrators should not modify this file, as it will be replaced when
ownCloud is updated.

Adding custom aliases
---------------------

Custom mimetype aliases can be added to ``config/mimetypealiases.json``, using
the same syntax as ``config/mimetypealiases.dist.json``. Some common mimetypes
that may be useful in creating aliases are:

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

Once you have made changes to ``config/mimetypealiases.json``, run the
following to propagate the changes through the system::

  $ ./occ maintenance:mimetypesjs

