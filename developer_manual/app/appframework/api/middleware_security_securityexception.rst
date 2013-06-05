SecurityException
=================


Thrown when the security middleware encounters a security problem


.. php:namespace:: OCA\AppFramework\Middleware\Security
.. php:class:: SecurityException




  .. php:method:: __construct($msg, $ajax)

    :param string $msg: the security error message
    :param bool $ajax: true if it resulted because of an ajax request



  .. php:method:: isAjax()

    :returns bool: true if exception resulted because of an ajax request


    Used to check if a security exception occured in an ajax request


