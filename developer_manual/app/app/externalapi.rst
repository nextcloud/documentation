External API
============

.. sectionauthor:: Tom Needham <tom@owncloud.com>

Introduction
------------
The external API inside ownCloud allows third party developers to access data
provided by ownCloud apps. ownCloud version 5.0 will follow the `OCS v1.7
specification <http://www.freedesktop.org/wiki/Specifications/open-collaboration-services-1.7>`_ (draft).

Usage
-----

Registering Methods
~~~~~~~~~~~~~~~~~~~
Methods are registered inside the :file:`appinfo/routes.php` using :php:class:`OCP\\API`

.. code-block:: php

  <?php

  OCP\API::register(
      'get', 
      '/cloud/users', 
      array('OC_Provisioning_API_Users', 'getUsers'), 
      'provisioning_api', 
      OC_API::ADMIN_AUTH
  );

Returning Data
~~~~~~~~~~~~~~
Once the API backend has matched your URL, your callable function as defined in
**$action** will be executed. This method is passed as array of parameters that you defined in **$url**. To return data back the the client, you should return an instance of :php:class:`OC_OCS_Result`. The API backend will then use this to construct the XML or JSON response.

