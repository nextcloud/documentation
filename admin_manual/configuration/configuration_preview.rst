Preview Configuration
=====================
ownCloud 6 introduced the new thumbnail system. It is used to generate
thumbnails from various file types. 
By default, it can generate previews for:

* Images
* Movies
* Cover from mp3 files 
* various office files 
* Pdf 
* Svg 
* Text 

Soft dependencies:
------------------

imagick:
~~~~~~~~
ownCloud needs the imagick php extension to generate previews from office, pdf
and svg files. For further information on how to install the imagick php
extension on your system take a look at the `PHP documentation <http://www.php.net/manual/en/imagick.installation.php>`_.
If imagick is not installed, ownCloud will show file type icons instead of previews.

LibreOffice / OpenOffice:
~~~~~~~~~~~~~~~~~~~~~~~~~
ownCloud comes with a php-only preview system for office files. But this
preview system has limited capabilities and is only able to create previews
from basic Microsoft Office files. If you need previews from advanced
Microsoft Office files or OpenDocument files, you have to install LibreOffice
or OpenOffice. To learn more about installing LibreOffice/OpenOffice consider
your distribution's documentation.

avconv / ffmpeg:
~~~~~~~~~~~~~~~~
ownCloud requires avconv of ffmpeg to generate previews from movies. To learn
more about installing avconv or ffmpeg consider your distribution's
documentation.

Parameters
----------
Disabling previews:
~~~~~~~~~~~~~~~~~~~
Under certain circumstances like a big user base or limited resources you might
want to consider disabling previews.

.. code-block:: php

  <?php
    'enable_previews' => true,

There is a config option called 'enable_previews'. By default it's set to true.
You can disable previews by setting this option to false:

.. code-block:: php

  <?php
    'enable_previews' => false,

Maximum preview size:
~~~~~~~~~~~~~~~~~~~~~

There are two config options to set the maximum size of a preview.

.. code-block:: php

  <?php
    'preview_max_x' => null,
    'preview_max_y' => null,

.. code-block:: php
By default, both config options are set to null. 'Null' is equal to no limit.
Numeric values represent the size in pixel. The following code limits previews
to a maximum size of 100px by 100px:

.. code-block:: php

  <?php
    'preview_max_x' => 100,
    'preview_max_y' => 100,

.. code-block:: php
'preview_max_x' represents the x-axis and 'preview_max_y' represents the y-axis.

Maximum scale factor:
~~~~~~~~~~~~~~~~~~~~~
If you have a lot of small pictures and the preview system generates blurry
previews, you might want to consider setting a maximum scale factor. By default,
ownCloud scales pictures up to 10 times the original size:

.. code-block:: php

  <?php
    'preview_max_scale_factor' => 10,

If you want to disable scaling at all, you can set the config value to '1':

.. code-block:: php

  <?php
    'preview_max_scale_factor' => 1,

If you want to disable the maximum scaling factor, you can set the config value to 'null':

.. code-block:: php

  <?php
    'preview_max_scale_factor' => null,

LibreOffice / OpenOffice:
~~~~~~~~~~~~~~~~~~~~~~~~~
You can set a custom path for the LibreOffice binary. If LibreOffice is not yet
available on your system, you can also use OpenOffice instead.

.. code-block:: php

  <?php
    'preview_libreoffice_path' => '/usr/bin/libreoffice',

You can set custom LibreOffice / OpenOffice command line parameters by setting
the preview_office_cl_parameters option.

.. code-block:: php

  <?php
    'preview_office_cl_parameters' => ' ',
