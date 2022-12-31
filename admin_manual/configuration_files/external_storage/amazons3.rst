=========
Amazon S3
=========

To connect your Amazon S3 buckets to Nextcloud, you will need:

- S3 access key
- S3 secret key
- Bucket name
- Region

In the **Folder name** field enter a local folder name for your S3 mountpoint.
If this does not exist it will be created.

In the **Available for** field enter the users or groups who have permission to
access your S3 mount.

The ``Enable SSL`` checkbox enables HTTPS connections; using HTTPS is always
highly-recommended.

.. figure:: images/amazons3.png
   :alt:

Optionally, you can override the hostname, and port of your S3 server,
which is required for non-Amazon servers such as Ceph Object Gateway.

**Region** should be an [AWS Region Code](https://docs.aws.amazon.com/general/latest/gr/rande.html#region-names-codes).
If no region is supplied, a new bucket will be created in the `eu-west-1` region.

**Enable path style** is usually not required (and is, in fact, incompatible
with newer Amazon datacenters), but can be used with non-Amazon servers where
the DNS infrastructure cannot be controlled. Ordinarily, requests will be
made with ``http://bucket.hostname.domain/``, but with path style enabled,
requests are made with ``http://hostname.domain/bucket`` instead.

**Legacy authentication** is only required for S3 servers that only implement version 2 authentication,
by default version 4 authentication will be used.

See :doc:`../external_storage_configuration_gui` for additional mount
options and information.

See :doc:`auth_mechanisms` for more information on authentication schemes.
