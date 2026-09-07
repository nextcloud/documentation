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
needs to incorporate this. **Your data is no longer stored on your Nextcloud server, but your
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
* :code:`sse_kms_enabled` defaults to :code:`false`
* :code:`sse_kms_key_id` has no default (uses the bucket default KMS key when omitted)

Optional parameters less commonly needing adjustment:

* :code:`concurrency` defaults to :code:`5` [Note: This defines the maximum number of concurrent multipart uploads]
* :code:`proxy` defaults to :code:`false`
* :code:`connect_timeout` defaults to :code:`5` [Note: the connection timeout is
  set in seconds, but decimal precision can be used for subsecond accuracy (for
  example, 4.2 for 4200 milliseconds)]
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

To setup multiple buckets, set :code:`'multibucket => true'` in the object store
configuration in :code:`config.php`:

::

    'objectstore' => [
        'class' => 'Object\\Storage\\Backend\\Class',
        'arguments' => [
            'multibucket' => true,
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

----------------------------------------------------------------
Multibucket Object Store with per Bucket configuration overrides
----------------------------------------------------------------

When using an Object Store with :code:`'multibucket => true'` it is possible to configure overrides for all config options per bucket:

::

    'objectstore' => [
        'class' => 'Object\\Storage\\Backend\\Class',
        'arguments' => [
            'multibucket' => true,
            'bucket' => 'nextcloud_',
            'perBucket' => [
                'nextcloud_1' => [
                    'port' => 9999,
                ],
            ],
        ],
    ],

This can be useful for example if you want to configure credentials per bucket that is used by a Team folder.
A script for provisioning new Team folders this way could look like this (first make sure the bucket exists with those credentials):

::

    occ config:system:set --type=string --value=KEYVALUE objectstore arguments perBucket BUCKETNAME key
    occ config:system:set --type=string --value=SECRETVALUE objectstore arguments perBucket BUCKETNAME secret
    occ groupfolders:create --bucket BUCKETNAME TEAMFOLDERNAME

The credentials must be set before the new Team folder is created.

---------------------------
Multi-instance Object Store
---------------------------

It's possible to configure Nextcloud to distribute the data over multiple object store
instances for further scaling and gradual migration.

To setup multiple buckets, set :code:`'objectstore'` to an array of named configurations
configuration in :code:`config.php` and set the :code:`'default'` to the name of the
configuration to use for newly created users:

::

    'objectstore' => [
        'default' => 'server2',
        'root' => 'server1',
        'server1' => [
            'class' => 'Object\\Storage\\Backend\\Class',
            'arguments' => [
                'hostname' => 's3-server1.example.com',
                'bucket' => 's1_nextcloud',
                ...
            ],
        ],
        'server2' => [
        'class' => 'Object\\Storage\\Backend\\Class',
            'arguments' => [
                'multibucket' => true,
                'hostname' => 's3-server2.example.com',
                'bucket' => 's2_nextcloud_',
                ...
            ],
        ],
    ],

.. note:: Bucket names must be unique between all configured object store instances.

Newly created users will be mapped to the object store instance set in :code:`default`.
Files that are not part of the users storage are put in the :code:`root` instance, or
in the :code:`default` instance if no :code:`root` instance is configured.

In the above example, if :code:`server2` is starting to run low on capacity, an admin can
setup and configure a new :code:`server3` and change the :code:`default` to :code:`server3`.
Than any newly created user will have their files put on :code:`server3`.

.. note:: As with multibucket object store, the user-to-instance mapping is only created once,
          so only newly created users will be mapped to the new default instance.

It is possible to mix different object store backends and multibucket and non-multibucket in
a multi-instance configuration.

.. _s3-sse-c:

---------------------------
S3 SSE-C encryption support
---------------------------

.. deprecated:: 34
   SSE-C support is deprecated. Use :ref:`s3-sse-kms` instead, which provides
   centralized key management via AWS KMS and does not require managing encryption
   keys on the Nextcloud server.

.. warning::
   Amazon S3 disabled SSE-C by default for all new buckets in April 2026. Existing
   buckets that already hold SSE-C encrypted objects retain support, but new buckets
   require explicit opt-in via the AWS ``PutBucketEncryption`` API. See the
   `AWS announcement <https://aws.amazon.com/blogs/storage/advanced-notice-amazon-s3-to-disable-the-use-of-sse-c-encryption-by-default-for-all-new-buckets-and-select-existing-buckets-in-april-2026/>`_
   for details. For new deployments, use SSE-KMS instead.

Nextcloud supports server-side encryption with customer-provided keys, also known as
`SSE-C <https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerSideEncryptionCustomerKeys.html>`_,
with compatible S3 providers. The encryption and decryption happens on the S3 side using
a key provided by the Nextcloud server.

The key is specified with the :code:`sse_c_key` parameter as a base64-encoded string with
a maximum length of 32 bytes. Generate a random key with:

.. code-block:: bash

    openssl rand 32 | base64

The following example shows how to configure the S3 object store with SSE-C encryption
support:

.. code-block:: php

    'objectstore' => [
        'class' => 'OC\\Files\\ObjectStore\\S3',
        'arguments' => [
            'bucket' => 'nextcloud',
            'key' => 'ACCESS_KEY',
            'secret' => 'SECRET_KEY',
            'hostname' => 's3.example.com',
            'port' => 443,
            'use_ssl' => true,
            'use_path_style' => true,
            'autocreate' => true,
            'verify_bucket_exists' => true,
            'sse_c_key' => 'o9d3Q9tHcPMv6TIpH53MSXaUmY91YheZRwuIhwCFRSs=',
        ],
    ],

.. _s3-sse-kms:

-----------------------------
S3 SSE-KMS encryption support
-----------------------------

.. versionadded:: 34

Nextcloud supports server-side encryption using
`AWS Key Management Service (SSE-KMS) <https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html>`_.
With SSE-KMS, AWS encrypts objects at rest using KMS-managed keys. This provides
centralized key management, IAM-based access controls, CloudTrail audit logging, and
automatic key rotation — without requiring the Nextcloud server to manage encryption keys
directly.

SSE-KMS is the recommended replacement for :ref:`SSE-C <s3-sse-c>` for new deployments.

Two parameters control SSE-KMS:

* :code:`sse_kms_enabled` — set to :code:`true` to enable SSE-KMS (default: :code:`false`)
* :code:`sse_kms_key_id` — (optional) the ARN of a specific KMS key to use; omit to use the
  bucket's default KMS key

.. note:: If both :code:`sse_c_key` and :code:`sse_kms_enabled` are set, SSE-C takes
   precedence. This allows gradual migration from SSE-C to SSE-KMS.

The following example shows how to configure the S3 object store with SSE-KMS using a
specific KMS key:

.. code-block:: php

    'objectstore' => [
        'class' => 'OC\\Files\\ObjectStore\\S3',
        'arguments' => [
            'bucket' => 'my-nextcloud-store',
            'region' => 'us-east-1',
            'key' => 'ACCESS_KEY',
            'secret' => 'SECRET_KEY',
            'sse_kms_enabled' => true,
            'sse_kms_key_id' => 'arn:aws:kms:us-east-1:123456789012:key/mrk-abc123',
        ],
    ],

To use the bucket's default KMS key instead, omit :code:`sse_kms_key_id`:

.. code-block:: php

    'objectstore' => [
        'class' => 'OC\\Files\\ObjectStore\\S3',
        'arguments' => [
            'bucket' => 'my-nextcloud-store',
            'region' => 'us-east-1',
            'key' => 'ACCESS_KEY',
            'secret' => 'SECRET_KEY',
            'sse_kms_enabled' => true,
        ],
    ],
