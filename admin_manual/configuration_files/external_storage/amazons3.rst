=========
Amazon S3
=========

To connect your Amazon S3 buckets to ownCloud, you will need:

- S3 access key
- S3 secret key
- Bucket name

Optionally, you can override the hostname, port and region of your S3 server,
which is required for non-Amazon servers such as Ceph Object Gateway.

The ``Enable SSL`` checkbox enables HTTPS connections.

``Enable path style`` is usually not required (and is, in fact, incompatible
with newer Amazon datacenters), but can be used with non-Amazon servers where
the DNS infrastructure cannot be controlled. Ordinarily, requests will be
made with ``http://bucket.hostname.domain/``, but with path style enabled,
requests are made with ``http://hostname.domain/bucket`` instead.

.. figure:: images/amazons3.png
