========================
OpenStack Object Storage
========================

OpenStack Object Storage can be used to connect to an OpenStack Swift server.
Two authentication mechanisms are available, one is the generic 'OpenStack'
mechanism, the other is used exclusively for Rackspace, a provider of object
storage that uses the OpenStack Swift protocol.

The bucket will be created if it does not exist.

The 'OpenStack' authentication mechanism uses the OpenStack Keystone v2
protocol, connecting to the server specified in ``Identity Endpoint URL``.
A ``Username``, ``Tenant name`` and ``Password`` are required.

The 'Rackspace' authentication mechanism requires a Rackspace ``Username`` and
``API key``.

It may be necessary to specify a ``Service name`` or ``Region``. The timeout of
HTTP requests can be set with the ``Request timeout`` field.
