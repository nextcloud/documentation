OCS_Result
==========

.. sectionauthor:: Tom Needham <tom@owncloud.com>

Holds data on the result of the API method.

.. php:class:: OC_OCS_Result

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
