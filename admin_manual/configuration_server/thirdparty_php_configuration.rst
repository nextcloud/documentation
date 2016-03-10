Using Third Party PHP Components
================================

ownCloud uses some third party PHP components to provide some of its functionality. These components are part of the software package and are contained in the **/3rdparty** folder.

Managing Third Party Parameters
-------------------------------

When using third party components, keep the following parameters in mind:

* **3rdpartyroot** -- Specifies the location of the 3rd-party folder. To change the default location of this folder, you can use this parameter to define the absolute file system path to the folder location.

* **3rdpartyurl** -- Specifies the http web path to the 3rdpartyroot folder, starting at the ownCloud web root.

An example of what these parameters might look like is as follows:

::

  <?php

  "3rdpartyroot" => OC::$SERVERROOT."/3rdparty",
  "3rdpartyurl"  => "/3rdparty",
