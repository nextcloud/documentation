=============================================================
Configuring S3 and OpenStack Swift Objects as Primary Storage
=============================================================

In ownCloud Enterprise Subscription, you can configure S3 objects as primary 
storage. This replaces the default ownCloud ``owncloud/data`` directory. You 
may 
still need to keep the ``owncloud/data`` directory for these reasons:

* The ownCloud log file is saved in the data directory
* Legacy apps may not support using anything but the ``owncloud/data`` directory

You can move your logfile by changing its location in ``config.php``. You may 
still need 
``owncloud/data`` for backwards compatibility with some apps.

Implications
------------

ownCloud in object store mode expects exclusive access to the object store 
container, because it only stores the binary data for each file. The metadata 
are kept in the local database for performance reasons.

The current implementation is incompatible with any app that uses 
direct file I/O and circumvents the ownCloud virtual filesystem. That includes 
Encryption and Gallery. Gallery stores thumbnails directly in the 
filesystem, and Encryption causes severe overhead because key files need 
to be fetched in addition to any requested file.

Configuration
-------------

Look in ``config.sample.php`` for a example configurations. Copy the 
relevant part to your ``config.php`` file. Any object store needs to implement
``\\OCP\\Files\\ObjectStore\\IObjectStore`` and can be passed parameters in the
constructor with the ``arguments`` key:

::

    'objectstore' => [
        'class' => 'Implementation\\Of\\OCP\\Files\\ObjectStore\\IObjectStore',
        'arguments' => [
            ...
        ],
    ],

Amazon S3
~~~~~~~~~

The S3 backend mounts a bucket of the Amazon S3 object store
into the virtual filesystem. The class to be used is ``OCA\ObjectStore\S3``:

::

  'objectstore' => [
      'class' => 'OCA\ObjectStore\S3',
      'arguments' => [
          // replace with your bucket
          'bucket' => 'owncloud',
          'autocreate' => true,
          // uncomment to enable server side encryption
          //'serversideencryption' => 'AES256',
          'options' => [
              // version and region are required
              'version' => '2006-03-01',
              // change to your region
              'region'  => 'eu-central-1',
              'credentials' => [
                  // replace key and secret with your credentials
                  'key' => 'EJ39ITYZEUH5BGWDRUFY',
                  'secret' => 'M5MrXTRjkyMaxXPe2FRXMTfTfbKEnZCu+7uRTVSj',
              ],
          ],
      ],
  ],


Ceph S3
~~~~~~~

The S3 backend can also be used to mount the bucket of a ceph object store via 
the s3 API
into the virtual filesystem. The class to be used is ``OCA\ObjectStore\S3``:

::

    'objectstore' => [
        'class' => 'OCA\ObjectStore\S3',
        'arguments' => [
            // replace with your bucket
            'bucket' => 'owncloud',
            'autocreate' => true,
            'options' => [
                // version and region are required
                'version' => '2006-03-01',
                'region'  => '',
                // replace key, secret and bucket with your credentials
                'credentials' => [
                    // replace key and secret with your credentials
                    'key'    => 'EJ39ITYZEUH5BGWDRUFY',
                    'secret' => 'M5MrXTRjkyMaxXPe2FRXMTfTfbKEnZCu+7uRTVSj',
                ],
                // replace the ceph endpoint with your rgw url
                'endpoint' => 'http://cephhost:8000/',
                // Use path style when talking to ceph
                'command.params' => [
                    'PathStyle' => true,
                ],
            ],
        ],
    ],

OpenStack Swift
~~~~~~~~~~~~~~~

The Swift backend mounts a container on an OpenStack Object Storage server
into the virtual filesystem. The class to be used is 
``\\OC\\Files\\ObjectStore\\Swift``:

::

    'objectstore' => [
        'class' => 'OC\\Files\\ObjectStore\\Swift',
        'arguments' => [
            'username' => 'demo', 
            'password' => 'password', 
            'container' => 'owncloud', 
            'autocreate' => true,
            'region' => 'RegionOne', 
            'url' => 'http://devstack:5000/v2.0',
            'tenantName' => 'demo', 
            'serviceName' => 'swift', 
            // url Type, optional, public, internal or admin
	    'urlType' => 'internal'
        ],
    ],


