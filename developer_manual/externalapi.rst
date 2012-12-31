External API
============

.. sectionauthor:: Tom Needham <tom@owncloud.com>

Introduction
------------
The external API inside ownCloud allows third party developers to access data
provided by ownCloud apps. ownCloud version 5.0 will follow the `OCS v1.7
specification`_ (draft).

.. _OCS v1.7 specification: http://www.freedesktop.org/wiki/Specifications/open-collaboration-services-1.7

Usage
------------
To make use of the external api as an app developer, there are just three things
to do.

#. Add your API routes inside $app/appinfo/routes.php
#. Code your API methods in $app/lib/*
#. Update the OCS spec with your call

To register your API routes, we make use of the OCP\API::register() method as
defined below:

.. php:class:: OCP\\API

  Manages the backend of the external API

  .. php:method:: register($method, $url, $action, $app, $authlevel, $defaults, $requirements)

      Registers an API route with the backend.

      :param string $method: The HTTP method (get, post, put or delete)
      :param string $url: The url that defines the API route (see 'Routing URLs' section below)
      :param callable $action: The function to call
      :param string $app: The app id
      :param int $authlevel: The required level of authentication to access the API method (use constants `defined in OC_API <https://github.com/owncloud/core/blob/ocs_api/lib/api.php#L32>`_)
      :param array $defaults: associative array of defaults for the URL parameters. Keys are the parameter names as defined in the url
      :param array $requirements: associative array of requirements for the url parameters (See the `Symfony Documentation <http://symfony.com/doc/2.0/book/routing.html#adding-requirements>`_)
      
Routing URLs
~~~~~~~~~~~~~
The API uses the new routing features inside ownCloud to make it easy to attach
api methods to urls which include variables. To register an API method including
a variable, simple place the variable name in curly brackets {}. For example:

   /cloud/users/{userid}

If the URL /cloud/users/Tom is requested, the api function registered with this
url would be called, and passed the parameter 'userid' with the value: 'Tom'.
The parameters are passed to the API methods inside an array.

Returning Data
~~~~~~~~~~~~~~
Once the API backend has matched your url, your callable function as defined in
$action will be executed. This method is passed as array of parameters that you
defined in $url. To return data back the the client, you should return an
instance of OC_OCS_Result. The API backend will then use this to construct the
xml or json response. 

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
