============
Coding Style
============

.. sectionauthor:: Christoph Wurst <christoph@winzerhof-wurst.at>

PHP
---

Starting with Nextcloud 19 there is a shared `PHP Coding Standards Fixer <https://github.com/FriendsOfPhp/PHP-CS-Fixer>`_ configuration you can use to automatically format your app's source code. For full details see the `repository on Github <https://github.com/nextcloud/coding-standard/>`_.

JavaScript
----------

There is a shared configuration for `eslint <https://eslint.org/>`_ that you can use to automatically format your Nextcloud apps's JavaScript code. It consists of two parts: a `config package <https://github.com/nextcloud/eslint-config>`_ that contains the formatting preferences and a `plugin <https://github.com/nextcloud/eslint-plugin>`_ to detect deprecated and removed APIs in your code. See their readmes for instructions.
