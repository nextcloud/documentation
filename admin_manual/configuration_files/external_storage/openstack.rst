========================
OpenStack Object Storage
========================

OpenStack Object Storage is used to connect to an OpenStack Swift server, or to 
Rackspace. Two authentication mechanisms are available: one is the generic 
OpenStack mechanism, and the other is used exclusively for Rackspace, a provider 
of object storage that uses the OpenStack Swift protocol.

The OpenStack authentication mechanism uses the OpenStack Keystone v2
protocol. Your ownCloud configuration needs:

* **Bucket**. This is user-defined; think of it as a subdirectory of your total 
  storage. The bucket will be created if it does not exist.
* **Username** of your account.
* **Password** of your account.
* **Tenant name** of your account. (A tenant is similar to a user group.)
* **Identity Endpoint URL**, the URL to log in to your OpenStack account.

.. figure:: images/openstack.png
   :alt: Openstack configuration.

The Rackspace authentication mechanism requires: 

* **Bucket** 
* **Username**
* **API key**. 

You must also enter the term **cloudFiles** in the **Service name** field.

.. figure:: images/rackspace.png
   :alt: Openstack configuration.

It may be necessary to specify a **Region**. Your region should be named in 
your account information, and you can read about Rackspace regions at 
`About Regions <https://support.rackspace.com/how-to/about-regions/>`_.

The timeout of HTTP requests is set in the **Request timeout** field, in 
seconds.

See :doc:`../external_storage_configuration_gui` for additional mount 
options and information.

See :doc:`auth_mechanisms` for more information on authentication schemes.
