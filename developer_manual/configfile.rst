Config file
===========

Using alternative app directories
---------------------------------

ownCloud can be set to use a custom app directory in /config/config.php. Customise the following code and add it to your config file:

.. code-block:: php

  'apps_paths' =>
  	array (
  		0 =>
  		array (
  			'path' => OC::$SERVERROOT.'/apps',
  			'url' => '/apps',
  			'writable' => true,
  		),
  		1 =>
  		array (
  			'path' => OC::$SERVERROOT.'/apps2',
  			'url' => '/apps2',
  			'writable' => false,
  		),
  	),
	
ownCloud will use the first app directory which it finds in the array with 'writable' set to true.