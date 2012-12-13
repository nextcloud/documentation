Compatibility Notes
===================

One of our major improvements of ownCloud 4 are movable apps. Therefore we changed the way ownCloud loads apps. Apps used to be called directly through their index.php (e.g.: /files/index.php). The problem has been that apps would not been movable if they contain a hardcoded link to the Base Library.

Apps will be called trough an parameter in ownCloud 4. An example for this is: /?app=files.

ownCloud 3 apps are not supported regarding to this mayor change, but making an ownCloud 3 app compatible with ownCloud 4 is pretty easy.

The first step is to **remove** the **require_once** command to the **Base library** in **every file** of your app.

Afterwords you have to make sure that your app uses the ownCloud internal functions to generate paths.

Paths:
~~~~~~

For generating a path in PHP use our new public API:

.. code-block:: php
  
  OCP\Util::linkTo

and for generating a path in Js use the function:

.. code-block:: php
  
  OC.filePath

CSS:
~~~~

You have to use the placeholders ``%appswebroot%`` and ``%webroot%``, if your CSS file contains relative paths.

Example from our source code:

.. code-block:: css
  
  #contacts_deletecard {position:relative; float:left; background:url('%webroot%/core/img/actions/delete.svg') no-repeat center; }

public.php and remote.php
~~~~~~~~~~~~~~~~~~~~~~~~~

We introduced the files public.php and remote.php in ownCloud 4.

If you want to know how to use them, you should take a look `here`_.

New public API
~~~~~~~~~~~~~~

We also introduced our new public api. The documentation for this api can be found at http://api.ownCloud.org.

.. _here: http://owncloud.org/dev/apps/public-php-and-remote-php/
