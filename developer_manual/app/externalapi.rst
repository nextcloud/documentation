External API
============

.. sectionauthor:: Tom Needham <tom@owncloud.com>

Introduction
------------
The external API inside ownCloud allows third party developers to access data
provided by ownCloud apps. ownCloud version 5.0 will follow the `OCS v1.7
specification <specification: http://www.freedesktop.org/wiki/Specifications/open-collaboration-services-1.7>`_ (draft).

Usage
-----

Registering Methods
~~~~~~~~~~~~~~~~~~~
Methods are registered inside the :file:`appinfo/routes.php` using the **OCP\\API** class:

.. code-block:: php

  <?php

  OCP\API::register(
      'get', 
      '/cloud/users', 
      array('OC_Provisioning_API_Users', 'getUsers'), 
      'provisioning_api', 
      OC_API::ADMIN_AUTH
  );


.. php:class:: OCP\\API

  Manages the backend of the external API

  .. php:method:: register($method, $url, $action, $app, $authlevel, $defaults, $requirements)

      Registers an API route with the backend.

      :param string $method: The HTTP method (get, post, put or delete)
      :param string $url: The URL that defines the API route which can also include params (See the `Symfony Documentation <http://symfony.com/doc/2.0/book/routing.html>`_)
      :param callable $action: The function to call
      :param string $app: The app id
      :param int $authlevel: The required level of authentication to access the API method. The following constants can be passed: OC_API::ADMIN_AUTH, OC_API::SUBADMIN_AUTH, OC_API::USER_AUTH, OC_API::GUEST_AUTH
      :param array $defaults: associative array of defaults for the URL parameters. Keys are the parameter names as defined in the url
      :param array $requirements: associative array of requirements for the url parameters (See the `Symfony Documentation: Adding Requirements <http://symfony.com/doc/2.0/book/routing.html#adding-requirements>`_)

Returning Data
~~~~~~~~~~~~~~
Once the API backend has matched your URL, your callable function as defined in
**$action** will be executed. This method is passed as array of parameters that you defined in **$url**. To return data back the the client, you should return an instance of **OC_OCS_Result**. The API backend will then use this to construct the XML or JSON response.

.. php:class:: OC_OCS_Result

  Holds data on the result of the API method.

  .. php:method:: __construct($data=null, $code=100, $message=null)

      Creates an OC_OCS_Result object

      :param mixed $data: The data you wish to return, this may be a string, integer or array
      :param int $code: The response code you wish to return, defaults to success (100)
      :param string $message: An optional message to return with the response (explaining the result)

  .. php:method:: setTotalItems($items)

      Sets the <totalitems> value in the response. Use this to inform the client of the range of data available.

      :param int $items: The number of items in the full data set

  .. php:method:: setItemsPerPage($items)

      Sets the <itemsperpage> value in the response. Use this to inform the client of the number of pieces of data per page.

      :param int $items: The number of items per page of data.
