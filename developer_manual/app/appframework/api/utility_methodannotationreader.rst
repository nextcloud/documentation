MethodAnnotationReader
======================


Reads and parses annotations from doc comments


.. php:namespace:: OCA\AppFramework\Utility
.. php:class:: MethodAnnotationReader




  .. php:method:: __construct($object, $method)

    :param object $object: an object or classname
    :param string $method: the method which we want to inspect for annotations



  .. php:method:: hasAnnotation($name)

    :param string $name: the name of the annotation
    :returns bool: true if the annotation is found


    Check if a method contains an annotation


