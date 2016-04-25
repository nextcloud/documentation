================
Mimetype Aliases
================

ownCloud allows you to create aliases for mimetypes, so that you can display 
custom icons for files. For example, you might want a nice audio icon for audio 
files instead of the default file icon.

By default ownCloud is distributed with 
``owncloud/resources/config/mimetypealiases.dist.json``.
Do not modify this file, as it will be replaced when ownCloud is updated. 
Instead, create your own ``owncloud/config/mimetypealiases.json`` 
file with your custom aliases. Use the same syntax as in 
``owncloud/resources/config/mimetypealiases.dist.json``.

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
