OCS
===

.. sectionauthor:: Tom Needham <tom@owncloud.com>

Manages the backend of the external API

.. php:namespace:: OCP
.. php:class:: API

  .. php:method:: register($method, $url, $action, $app, $authlevel, $defaults, $requirements)

      Registers an API route with the backend.

      :param string $method: The HTTP method (get, post, put or delete)
      :param string $url: The URL that defines the API route which can also include params (See the `Symfony Documentation <http://symfony.com/doc/2.0/book/routing.html>`_)
      :param callable $action: The function to call
      :param string $app: The app id
      :param int $authlevel: The required level of authentication to access the API method. The following constants can be passed: OC_API::ADMIN_AUTH, OC_API::SUBADMIN_AUTH, OC_API::USER_AUTH, OC_API::GUEST_AUTH
      :param array $defaults: associative array of defaults for the URL parameters. Keys are the parameter names as defined in the url
      :param array $requirements: associative array of requirements for the url parameters (See the `Symfony Documentation: Adding Requirements <http://symfony.com/doc/2.0/book/routing.html#adding-requirements>`_)