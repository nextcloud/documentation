===========================
Primary Storage
===========================

It's possible to use an object store as primary storage, this replaces the default
way of storing files in :code:`nextcloud/data` (note that the data directory might still be used
for other reasons)

---------------------------
Implications
---------------------------

When using an object store as primary storage, Nextcloud assumes exclusive access
over the bucket being used.

Contrary to using an object store as external storage, when an object store is used
as primary storage, no metadata (names, directory structures, etc) is stored in the
object store. The metadata is only stored in the database and the object store only
holds the file content by unique identifier.

Because of this primary object stores usually perform better than when using the same
object store as external storage but it restricts being able to access the files from
outside of Nextcloud.

---------------------------
Configuring
---------------------------

Primary object stores need to be configured in :code:`config.php` by specifying the objectstore
backend and any backend specific configuration.

.. note:: Configuring a primary object store on an existing Nextcloud instance will
	make all existing files on the instance inaccessible.

The configuration has the following structure.

::

	'objectstore' => array(
		'class' => 'Object\\Storage\\Backend\\Class',
		'arguments' => array(
			...
		),
	),

~~~~~~~~~~~~~
Openstack Swift
~~~~~~~~~~~~~

The Swift backend mounts a container on an OpenStack Object Storage server into the virtual filesystem. The class to be used is \\OC\\Files\\ObjectStore\\Swift:

::

	'objectstore' => array(
		'class' => 'OC\\Files\\ObjectStore\\Swift',
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

---------------------------
Multibucket Object Store
---------------------------

It's possible to configure Nextcloud to distribute it's data over multiple buckets for scalability purpose.

To setup multiple buckets, :code:`config.php` needs to be configured using :code:`'objectstore_multibucket'`

::

	'objectstore_multibucket' => array(
		'class' => 'Object\\Storage\\Backend\\Class',
		'arguments' => array(
			// optional, defaults to 64
			'num_buckets' => 64,
			// will be prefixed by an integer in the range from 0 to (num_nuckets-1)
			'bucket' => 'nextcloud_',
			...
		),
	),

Nextcloud will map every user to a range of buckets and save all files for that user in it's respective bucket.

.. note:: Changing the number of buckets for an existing Nextcloud instance is supported but the
	mapping from users to buckets is persistent so only newly created users will be mapped to the
	updated range of buckets.
