=============================================================
Configuring S3 and OpenStack Swift Objects as Primary Storage
=============================================================
In ownCloud Enterprise Subscription, you can configure S3 objects as primary 
storage. This replaces the default data directory, which is 
``/var/www/owncloud/data`` on default Linux installations, and 
``C:\inetpub\wwwroot\owncloud\data`` on Windows servers. However, you may need 
to keep the ``data/`` directory for these reasons:

* The ownCloud log file is saved in the data directory
* Legacy apps may not support using anything but the ``data/`` directory

You can move your logfile by changing its location in ``config.php``. You may still need 
``data/`` for backwards compatibility with some apps.

Implications
------------
It is important to note that ownCloud in object store mode will expect exclusive 
access to the object store container, because it only stores the binary data 
for each file. The metadata is currently kept in the local database for 
performance reasons.

The current implementation is incompatible with any app that uses 
direct file I/O and circumvents the ownCloud virtual filesystem. That includes 
Encryption and Gallery. Gallery stores thumbnails directly in the 
filesystem, and Encryption causes severe overhead because key files need 
to be fetched in addition to any requested file.

Configuration
-------------
Look in ``config.sample.php`` for a example configurations. Copy the 
relevant part to your ``config.php`` file. Any objectstore needs to implement
``\\OCP\\Files\\ObjectStore\\IObjectStore`` and can be passed parameters in the
constructor with the ``arguments`` key:

::

    'objectstore' => array(
        'class' => 'Implementation\\Of\\OCP\\Files\\ObjectStore\\IObjectStore',
        'arguments' => array(
            ...
        ),
    ),

Amazon S3
~~~~~~~~~
The S3 backend mounts a bucket of the Amazon S3 object store
into the virtual filesystem. The class to be used is ``OCA\ObjectStore\S3``:

::

  'objectstore' => array(
    'class' => 'OCA\ObjectStore\S3',
        'arguments' => array(
          'key' => 'yourkey',
          'secret' => 'yoursecret',
          'bucket' => 'your-oc-bucket',
        ),
  ),


Ceph S3
~~~~~~~
The S3 backend can also be used to mount the bucket of a ceph object store via the s3 API
into the virtual filesystem. The class to be used is ``OCA\ObjectStore\S3``:

::

  'objectstore' => array(
    'class' => 'OCA\ObjectStore\S3',
	'arguments' => array(
	  'key' => 'GEZ550B06Z2ZDB52CT21',
	  'secret' => '6Vdo7ObSMBlI4TMRw0jpRE75K6qS9QNTk6nBboxP',
	  'bucket' => 'devobjectstore',
	  'base_url' => 'http://ceph/',
	  'hostname' => 'ceph',
	  // you must use this region or the amazon lib will overwrite
	  // the path style when resetting the region
	  'region' => 's3-eu-west-1.amazonaws.com'
	),
  ),

OpenStack Swift
~~~~~~~~~~~~~~~
The Swift backend mounts a container on an OpenStack Object Storage server
into the virtual filesystem. The class to be used is ``\\OC\\Files\\ObjectStore\\Swift``:

::

    'objectstore' => array(
        'class' => 'OC\\Files\\ObjectStore\\Swift',
        'arguments' => array(
            'username' => 'demo', 
            'password' => 'password', 
            'container' => 'owncloud', 
            'autocreate' => true,
            'region' => 'RegionOne', 
            'url' => 'http://devstack:5000/v2.0',
            'tenantName' => 'demo', 
            'serviceName' => 'swift', 
        ),
    ),


