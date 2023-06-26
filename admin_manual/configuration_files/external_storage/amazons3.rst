=========
Amazon S3
=========

To connect an Amazon S3 (or compatible) bucket to Nextcloud you will need to know your:

- S3 bucket name
- S3 access key ID
- S3 secret access key
- S3 region (if Amazon hosted) or S3 hostname (if non-Amazon hosted) [Note: If specifying a hostname, use the generic S3 endpoint hostname, **not** the hostname that contains your bucket name]

In the **Folder name** field enter a folder name to use as the local mountpoint for this
external storage. If this does not exist it will be created.

In the **External storage** field select **Amazon S3**.

In the **Authentication** field select **Access key**.

In the **Bucket** field enter your *S3 bucket name*. [Note: Even if non-Amazon hosted, bucket names must meet AWS S3 naming requirements regardless of what your S3 provider/platform considers acceptable - i.e. no underscores]

In the **Access key** field enter your *S3 access key ID*.

In the **Secret key** field enter your *S3 access key*.

**If you are using Amazon S3:** the :code:`Region` parameter is required unless you're happy with 
the default of :code:`eu-west-1` (which will be used if you don't specify anything). There is no 
need to override the :code:`Hostname` or :code:`Port`. And :code:`Storage Class` only needs to be 
modified if you're using a different configuration at AWS. Lastly, :code:`Enable Path Style` is 
rarely required with Amazon, but some legacy Amazon datacenters may require it. Leave 
:code:`Legacy (v2) authentication` unselected.

**If you using a non-Amazon hosted S3 store:** you will need to set the :code:`Hostname` 
parameter (and can ignore the :code:`Region` parameter). You may need to enable :code:`Enable Path Style` 
if your non-Amazon S3 store does *not* support requests like :code:`https://bucket.hostname.domain/`.
Setting :code:`Enable Path Style` to true configures the S3 client to make requests like 
:code:`https://hostname.domain/bucket` instead. It's rare to need :code:`Legacy (v2) authentication`, but
enable it if your in-house object store or service provider requires it over the default (v4) authentication.

In the **Available for** field enter the users or groups who you want to give
access your S3 mount.

The ``Enable SSL`` checkbox enables HTTPS connections and generally preferred. It is the default unless 
you disable it here.

.. figure:: images/amazons3.png
   :alt:

See :doc:`../external_storage_configuration_gui` for additional mount
options and information.

See :doc:`auth_mechanisms` for more information on authentication schemes.
