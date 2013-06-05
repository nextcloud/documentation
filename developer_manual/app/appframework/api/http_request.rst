Request
=======


Class for accessing variables in the request.
This class provides an immutable object with request variables.

.. php:namespace:: OCA\AppFramework\Http
.. php:class:: Request


  .. php:attr:: $items
    
    * **Protected**
    
    

  .. php:attr:: $allowedKeys
    
    * **Protected**
    
    



  .. php:method:: __construct($vars=array())

    :param array $vars: An associative array with the following optional values:


    .. note:: \OCA\AppFramework\Http\http://www.php.net/manual/en/reserved.variables.php


  .. php:method:: count()




  .. php:method:: offsetExists($offset)

    :param string $offset: offset The key to lookup
    :returns string|null: 


    ArrayAccess methods
    Gives access to the combined GET, POST and urlParams arraysExamples:$var = $request['myvar'];orif(!isset($request['myvar']) {    // Do something}$request['myvar'] = 'something'; // This throws an exception.


  .. php:method:: offsetGet($offset)

    :param mixed $offset: 


    .. note:: \OCA\AppFramework\Http\offsetExists


  .. php:method:: offsetSet($offset, $value)

    :param mixed $offset: 
    :param mixed $value: 


    .. note:: \OCA\AppFramework\Http\offsetExists


  .. php:method:: offsetUnset($offset)

    :param mixed $offset: 


    .. note:: \OCA\AppFramework\Http\offsetExists


  .. php:method:: __set($name, $value)

    :param mixed $name: 
    :param mixed $value: 



  .. php:method:: __get($name)

    :param string $name: The key to look for.
    :returns mixed|null: 


    Access request variables by method and name.
    Examples:$request->post['myvar']; // Only look for POST variables$request->myvar; or $request->{'myvar'}; or $request->{$myvar}Looks in the combined GET, POST and urlParams array.if($request->method !== 'POST') {    throw new Exception('This function can only be invoked using POST');}


  .. php:method:: __isset($name)

    :param mixed $name: 



  .. php:method:: __unset($id)

    :param mixed $id: 



