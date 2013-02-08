3rd-Party Configuration
=======================

ownCloud resorts to some 3rd-party PHP components to provide its functionality.
These components are part of the software package and are usually shipped in
the **/3rdparty** folder.

Parameters
----------

If you want to change the default location of the 3rd-party folder you can use the **3rdpartyroot** parameter to define the absolute file system path to the folder. The **3rdpartyurl** parameter is used to define the http web path to that folder, starting at the ownCloud web root.

.. code-block:: php

  <?php

  "3rdpartyroot" => OC::$SERVERROOT."/3rdparty",
  "3rdpartyurl"  => "/3rdparty",
