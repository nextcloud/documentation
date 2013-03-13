JSONResponse
============


A renderer for JSON calls


.. php:namespace:: OCA\AppFramework\Http
.. php:class:: JSONResponse




  .. php:method:: __construct()




  .. php:method:: setParams($params)

    :param array $params: an array with key => value structure which will be                     transformed to JSON


    Sets values in the data json array


  .. php:method:: getParams()

    :returns array: the params


    Used to get the set parameters


  .. php:method:: setErrorMessage($msg)

    :param mixed $msg: 


    in case we want to render an error message, also logs into the owncloud log


  .. php:method:: render()

    :returns string: the rendered json


    Returns the rendered json
