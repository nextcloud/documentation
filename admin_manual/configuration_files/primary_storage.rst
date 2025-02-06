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

---------------------------------
Differences from External Storage
---------------------------------

When  an object store is used as Primary Storage, Nextcloud requires exclusive access
over the bucket being used. All metadata (filenames, directory structures, etc) 
is stored in Nextcloud and not in the object store. The metadata is only stored in the database and the 
object store only holds the file content by unique identifier.

~~~~~~~~~~~~~~~~~~~~~~~~
Performance Implications
~~~~~~~~~~~~~~~~~~~~~~~~

Because of this, object stores configured as Primary Storage usually perform better than 
when using the same object store via the External Storage support application, but the downside 
is being unable to access the files from outside of Nextcloud. This makes using an object store 
as Primary Storage distinct from using an object store via External Storage.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Data Backup and Recovery Implications
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

One impact of using an object store as Primary Storage is that your data backup strategy 
needs to incorporate this. **Your data is longer stored on your Nextcloud server, but your 
files are also no longer accessible by simply bypassing your Nextcloud server and accessing 
your object store directly.**

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

The Simple Storage Service (S3) backend mounts a bucket on an Amazon S3 object
storage or compatible implementation (e.g. Minio or Ceph Object Gateway) into the
virtual filesystem.

The class to be used is :code:`\\OC\\Files\\ObjectStore\\S3`

Amazon-hosted S3:

::

	'objectstore' => [
		'class' => '\\OC\\Files\\ObjectStore\\S3',
		'arguments' => [
			'bucket' => 'my-nextcloud-store',
			'region' => 'us-east-1',
			'key' => 'EJ39ITYZEUH5BGWDRUFY',
			'secret' => 'M5MrXTRjkyMaxXPe2FRXMTfTfbKEnZCu+7uRTVSj',
		],
	],

Non-Amazon hosted S3:

::

	'objectstore' => [
		'class' => '\\OC\\Files\\ObjectStore\\S3',
		'arguments' => [
			'bucket' => 'my-nextcloud-store',
			'hostname' => 's3.example.com',
			'key' => 'EJ39ITYZEUH5BGWDRUFY',
			'secret' => 'M5MrXTRjkyMaxXPe2FRXMTfTfbKEnZCu+7uRTVSj',
			'port' => 8443,
			// required for some non-Amazon S3 implementations
			'use_path_style' => true,
		],
	],

Minimum required parameters are:

* :code:`bucket` [Note: Even if non-Amazon hosted, bucket names must meet AWS S3 naming requirements regardless of what your S3 provider/platform considers acceptable - i.e. no underscores]
* :code:`key`
* :code:`secret`

.. note:: You will *probably* need to specify additional parameters beyond these, unless the default 
          values (see below) exactly match your situation. In particular, your :code:`region` (if Amazon 
	  hosted) or :code:`hostname` (if non-Amazon hosted).

Optional parameters most commonly needing adjustment (and their defaults values if left 
unconfigured):

* :code:`region` defaults to :code:`eu-west-1`
* :code:`storageClass` defaults to :code:`STANDARD`
* :code:`hostname` defaults to :code:`s3.REGION.amazonaws.com` [Note: If using this parameter (non-Amazon), specify the generic S3 endpoint hostname, **not** the hostname that contains your bucket name]
* :code:`use_ssl` defaults to :code:`true`

Optional parameters sometimes needing adjustment:

* :code:`use_path_style` defaults to :code:`false`
* :code:`port` defaults to :code:`443`
* :code:`sse_c_key` has no default

Optional parameters less commonly needing adjustment:

* :code:`concurrency` defaults to :code:`5` [Note: This defines the maximum number of concurrent multipart uploads]
* :code:`proxy` defaults to :code:`false`
* :code:`timeout` defaults to :code:`15`
* :code:`uploadPartSize` defaults to :code:`524288000`
* :code:`putSizeLimit` defaults to :code:`104857600`
* :code:`useMultipartCopy` defaults to :code:`true`
* :code:`copySizeLimit` defaults to :code:`5242880000`
* :code:`legacy_auth` has no default
* :code:`version` defaults to :code:`latest`
* :code:`verify_bucket_exists` defaults to :code:`true` [Note: Setting this to :code:`false` *after* confirming the bucket has been created may provide a performance benefit, but may not be possible in multibucket scenarios.]

**If you are using Amazon S3:** the :code:`region` parameter is required unless you're happy with 
the default of :code:`eu-west-1`. There is no need to override the :code:`hostname` or :code:`port`. 
And :code:`storageClass` only needs to be modified if you're using a different configuration at AWS. 
Lastly, :code:`use_path_style` is rarely required with Amazon, but some legacy Amazon datacenters 
may require it.

**If you using a non-Amazon hosted S3 store:** you will need to set the :code:`hostname` 
parameter (and can ignore the :code:`region` parameter). You may need to use :code:`use_path_style` 
if your non-Amazon S3 store does *not* support requests like :code:`https://bucket.hostname.domain/`.
Setting :code:`use_path_style` to true configures the S3 client to make requests like 
:code:`https://hostname.domain/bucket` instead.

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


---------------------------
S3 SSE-C encryption support
---------------------------

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
