Routes
======

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

PHP usually treats the URL like a filepath. This is easy for beginners but gets more complicated if a good architecture is required. For instance if an URL should call a certain function/method or if values should be extracted from the URL.

Routing connects your URLs with your controller methods and allows you to create constant and nice URLs. Its also easy to extract values from the URLs.

ownCloud uses `Symphony Routing <http://symfony.com/doc/2.0/book/routing.html>`_

Routes are declared in :file:`appinfo/routes.php`
