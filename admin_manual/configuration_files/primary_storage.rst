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

	'objectstore' => [
		'class' => 'Object\\Storage\\Backend\\Class',
		'arguments' => [
			...
		],
	],

~~~~~~~~~~~~~~~
OpenStack Swift
~~~~~~~~~~~~~~~

The OpenStack Swift backend mounts a container on an OpenStack Object Storage
server into the virtual filesystem.

The class to be used is :code:`\\OC\\Files\\ObjectStore\\Swift`

Both openstack v2 and v3 authentication are supported,

V2 Authentication:

::

	'objectstore' => [
		'class' => '\\OC\\Files\\ObjectStore\\Swift',
		'arguments' => [
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
		],
	],

V3 Authentication:

::

	'objectstore' => [
		'class' => 'OC\\Files\\ObjectStore\\Swift',
		'arguments' => [
			'autocreate' => true,
			'user' => [
				'name' => 'UserName',
				'password' => 'Secr3tPaSSWoRdt7',
				'domain' => [
					'name' => 'Default',
				],
			],
			'scope' => [
				'project' => [
					'name' => 'TenantName',
					'domain' => [
						'name' => 'Default',
					],
				],
			],
			'serviceName' => 'swift',
			'region' => 'regionOne',
			'url' => 'http://example.com/v3',
			'bucket' => 'nextcloud',
		],
	],

~~~~~~~~~~~~~~~~~~~~~~~~~~~
Simple Storage Service (S3)
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The simple storage service (S3) backend mounts a bucket on an Amazon S3 object
storage or compatible implementation (e.g. Minio or Ceph Object Gateway) into the
virtual filesystem.

The class to be used is :code:`\\OC\\Files\\ObjectStore\\S3`

::

	'objectstore' => [
		'class' => '\\OC\\Files\\ObjectStore\\S3',
		'arguments' => [
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
		],
	],

.. note:: Not all configuration options are required for all S3 servers. Overriding
          the hostname, port and region of your S3 server is only required for
          non-Amazon implementations, which in turn usually don't require the region to be set.

.. note:: :code:`use_path_style` is usually not required (and is, in fact, incompatible
          with newer Amazon datacenters), but can be used with non-Amazon servers
          where the DNS infrastructure cannot be controlled. Ordinarily, requests
          will be made with http://bucket.hostname.domain/, but with path style enabled,
          requests are made with http://hostname.domain/bucket instead.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Microsoft Azure Blob Storage
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The Azure Blob Storage backend mounts a container on Microsoft's Azure Blob Storage into the
virtual filesystem.

The class to be used is :code:`\\OC\\Files\\ObjectStore\\Azure`

::

	'objectstore' => [
		'class' => '\\OC\\Files\\ObjectStore\\Azure',
		'arguments' => [
			'container' => 'nextcloud',
			'autocreate' => true,
			'account_name' => 'account_name',
			'account_key' => 'xxxxxxxxxx'
		],
	],

------------------------
Multibucket Object Store
------------------------

It's possible to configure Nextcloud to distribute the data over multiple buckets
for scalability purposes.

To setup multiple buckets, use :code:`'objectstore_multibucket'` storage backend
in :code:`config.php`:

::

	'objectstore_multibucket' => [
		'class' => 'Object\\Storage\\Backend\\Class',
		'arguments' => [
			// optional, defaults to 64
			'num_buckets' => 64,
			// will be postfixed by an integer in the range from 0 to (num_nuckets-1)
			'bucket' => 'nextcloud_',
			...
		],
	],

Multibucket object store backend maps every user to a range of buckets and saves
all files for that user in their corresponding bucket.

.. note:: While it is possible to change the number of buckets used by an existing Nextcloud
          instance, the user-to-buckets mapping is only created once, so only newly created
          users will be mapped to the updated range of buckets.

You can find out more information about upscaling with object storage and Nextcloud in the
`Nextcloud customer portal <https://portal.nextcloud.com/article/object-store-as-primary-storage-16.html>`_.


------------------------
SSE-C encryption support
------------------------

Nextcloud supports server side encryption, also known as `SSE-C <http://docs.aws.amazon.com/AmazonS3/latest/dev/ServerSideEncryptionCustomerKeys.html>`_, with compatible S3 bucket provider. The encryption and decryption happens on the S3 bucket side with a key provided by the Nextcloud server.

The key can be specified with the :code:`sse_c_key` parameter which needs to be provided as a base64 encoded string with a maximum length of 32 bytes. A random key could be generated using the the following command:

::

	openssl rand 32 | base64


The following example shows how to configure the S3 object store with SSE-C encryption support in the objectstore section of the Nextcloud config.php file:

::

	'objectstore' => [
		array (
			'class' => 'OC\\Files\\ObjectStore\\S3',
			'arguments' =>
			array (
				'bucket' => 'nextcloud',
				'key' => 'nextcloud',
				'secret' => 'nextcloud',
				'hostname' => 's3',
				'port' => '443',
				'use_ssl' => true,
				'use_path_style' => true,
				'autocreate' => true,
				'verify_bucket_exists' => true,
				'sse_c_key' => 'o9d3Q9tHcPMv6TIpH53MSXaUmY91YheZRwuIhwCFRSs=',
			),
		);
	],