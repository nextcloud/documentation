========================
OpenStack Object Storage
========================

OpenStack Object Storage is used to connect to an OpenStack Swift server.
Two authentication mechanisms are available: one is the generic OpenStack
mechanism, and the other is used exclusively for Rackspace, a provider of object
storage that uses the OpenStack Swift protocol.

The bucket will be created if it does not exist.

The OpenStack authentication mechanism uses the OpenStack Keystone v2
protocol, connecting to the server specified in the **URL of Identity 
Endpoint** field. You need your **Username**, **Tenant name** and **Password**.

The Rackspace authentication mechanism requires a Rackspace **Username** and
**API key**.

It may be necessary to specify a **Service name** or **Region**. The timeout of
HTTP requests is set in the **Request timeout** field, in seconds.

See :doc:`../external_storage_configuration_gui` for additional mount 
options and information.

See :doc:`auth_mechanisms` for more information on authentication schemes.
