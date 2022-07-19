========
Text app
========

Disable rich workspaces globally
--------------------------------

Rich workspaces can be disabled globally by the admin by setting the following config option to 0 (default is 1):

::

 occ config:app:set text workspace_available --value=0


Default file extension
----------------------

The default file extension can be changed to txt in order to always create plain text files (default is md):

::

 occ config:app:set text default_file_extension --value=txt


Disable rich text editing
-------------------------

Rich text editing can be turned off globally to always open markdown files in their raw format, without rendering of the formatting (default is 1):

::

 occ config:app:set text rich_editing_enabled --value=0
