=============================================
Configuring Object Storage as Primary Storage
=============================================

Nextcloud allows to configure object storages like OpenStack Swift or
Amazon Simple Storage Service (S3) or any compatible S3-implementation
(e.g. Minio or Ceph Object Gateway) as primary storage replacing the default
storage of files.

By default, files are stored in :code:`nextcloud/data` or another directory configured
in the :code:`config.php` of your Nextcloud instance. This data directory might
still be used for compatibility reasons)

------------
Implications
------------

When using an object store as primary storage, Nextcloud assumes exclusive access
over the bucket being used.

Contrary to using an object store as external storage, when an object store is used
as primary storage, no metadata (names, directory structures, etc) is stored in the
object store. The metadata is only stored in the database and the object store only
holds the file content by unique identifier.

Because of this primary object stores usually perform better than when using the same
object store as external storage but it restricts being able to access the files from
outside of Nextcloud.

-------------
Configuration
-------------

Primary object stores need to be configured in :code:`config.php` by specifying
the objectstore backend and any backend specific configuration.

.. note:: Configuring a primary object store on an existing Nextcloud instance will
	make all existing files on the instance inaccessible.

The configuration has the following structure:

::

	'objectstore' => array(
		'class' => 'Object\\Storage\\Backend\\Class',
		'arguments' => array(
			...
		),
	),

~~~~~~~~~~~~~~~
OpenStack Swift
~~~~~~~~~~~~~~~

The OpenStack Swift backend mounts a container on an OpenStack Object Storage
server into the virtual filesystem.

The class to be used is :code:`\\OC\\Files\\ObjectStore\\Swift`

::

	'objectstore' => array(
		'class' => '\\OC\\Files\\ObjectStore\\Swift',
		'arguments' => array(
			'username' => 'username',
			'password' => 'Secr3tPaSSWoRdt7',
			// the container to store the data in
			'bucket' => 'nextcloud',
			'autocreate' => true,
			'region' => 'RegionOne',
			// The Identity / Keystone endpoint
			'url' => 'http://example.com/v2.0',
			// optional on some swift implementations
			'tenantName' => 'username',
			'serviceName' => 'swift',
			// The Interface / url Type, optional
			'urlType' => 'internal'
		),
	),

~~~~~~~~~~~~~~~~~~~~~~~~~~~
Simple Storage Service (S3)
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The simple storage service (S3) backend mounts a bucket on an Amazon S3 object
storage or compatible implementation (e.g. Minio or Ceph Object Gateway) into the
virtual filesystem.

The class to be used is :code:`\\OC\\Files\\ObjectStore\\S3`

::

	'objectstore' => array(
		'class' => '\\OC\\Files\\ObjectStore\\S3',
		'arguments' => array(
			'bucket' => 'nextcloud',
			'autocreate' => true,
			'key'    => 'EJ39ITYZEUH5BGWDRUFY',
			'secret' => 'M5MrXTRjkyMaxXPe2FRXMTfTfbKEnZCu+7uRTVSj',
			'hostname' => 'example.com',
			'port' => 1234,
			'use_ssl' => true,
			'region' => 'optional',
			// required for some non Amazon S3 implementations
			'use_path_style'=>true
		),
	),

.. note:: Not all configuration options are required for all S3 servers. Overriding
          the hostname, port and region of your S3 server is only required for
          non-Amazon implementations, which in turn usually don't require the region to be set.

.. note:: :code:`use_path_style` is usually not required (and is, in fact, incompatible
          with newer Amazon datacenters), but can be used with non-Amazon servers
          where the DNS infrastructure cannot be controlled. Ordinarily, requests
          will be made with http://bucket.hostname.domain/, but with path style enabled,
          requests are made with http://hostname.domain/bucket instead.

------------------------
Multibucket Object Store
------------------------

It's possible to configure Nextcloud to distribute its data over multiple buckets
for scalability purpose. You can find out more information about upscaling with
object storage and Nextcloud in the
`Nextcloud customer portal <https://portal.nextcloud.com/article/object-store-as-primary-storage-16.html>`_.
