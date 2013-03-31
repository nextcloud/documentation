Angular App Framework Libraries
===============================

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

.. versionadded:: 6.0

The App Framework comes with additional libraries which help to interact with the ownCloud server.


Include script files
--------------------
To make use of the the tools include them in your templates.

Using ownCloud Templates:

:file:`templates/main.php`

.. code-block:: php

  <?php \OCP\Util::addScript('appframework', 'public/app'); ?>


Using Twig Templates:

:file:`templates/main.php`

.. code-block:: js

  {{ script('public/app', 'appframework') }}

After the script has been included the modules can be used inside the angular module by injecting them:

:file:`js/app/app.coffee`

.. code-block:: python
  
  # create your application and inject OC
  angular.module('YourApp', ['OC'])


General
-------
Now that the library is loaded and set up they can be used inside the module container. The App Framework follows the convention of marking class names with a leading underscore and object instances without it.

.. note:: The App Framework uses CoffeeScript so if JavaScript objects should extend the provided objects, you need to implement the inheritance like CoffeeScript does it.

Services
--------

The App Framework provides the following services:

Router
~~~~~~
The **OC.Router** object

Notification
~~~~~~~~~~~~
The **OC.Notification** object

Utils
~~~~~
The **OC** object

_Loading
~~~~~~~~
Simple object that can be used for displaying loading notifcations. It has an internal counter that starts at 0 and can be increased and decreased. If the counter is bigger than 0 isLoading is true.

Example:

.. code-block:: js
  
  loading = new Loading()
  loading.isLoading() # false

  loading.increase()
  loading.isLoading() # true

  loading.increase()
  loading.getCount() # 2

  loading.decrease()
  loading.decrease()
  loading.isLoading() # false

_Request
~~~~~~~~
Used to perform AJAX requests. 

Example: 

.. code-block:: js

  // simple GET request
  req = new _Request($http, new _Publisher(), Router)
  req.get('mail_index')


.. js:class:: _Request($http http, _Publisher publisher, Router router)

  .. js:function:: request(route[, data])

    :param object route: The name of the route that should be used
    :param object data: an object containing optional parameters

    Creates an AJAX request. The following data attributes can be set:

    * **routeParams**: object with parameters for the route
    * **data**: ajax data objec which is passed to PHP
    * **onSuccess**: callback for successful requests
    * **onFailure**: callback for failed requests
    * **config**: a config which should be passed to $http

  .. js:function:: get(route[, data])

    :param object route: The name of the route that should be used
    :param object data: an object containing optional parameters

    Shortcut for doing a GET request, for data attributes see :js:func:`_Request.request`

  .. js:function:: post(route[, data])

    :param object route: The name of the route that should be used
    :param object data: an object containing optional parameters

    Shortcut for doing a POST request, for data attributes see :js:func:`_Request.request`

  .. js:function:: put(route[, data])

    :param object route: The name of the route that should be used
    :param object data: an object containing optional parameters

    Shortcut for doing a PUT request, for data attributes see :js:func:`_Request.request`

  .. js:function:: delete(route[, data])

    :param object route: The name of the route that should be used
    :param object data: an object containing optional parameters

    Shortcut for doing a DELETE request, for data attributes see :js:func:`_Request.request`


_Publisher
~~~~~~~~~~
Used to automatically distribute JSON from AJAX Requests to the models. This is especially effective when you need to query for data and dont want to provide a callback to pass the return value to your models.

Example: Passing folders from the server to the client's FolderModel.

.. code-block:: php
  
  <?php

  /**
   * @Ajax
   */
  public function getAllFolders(){
      // the keys on the first level can be used
      return $this->renderJSON(array(
          'foldersKey' => array(
            array('id' => 1, 'name' => 'Books'),
            array('id' => 2, 'name' => 'Stuff')
          )
      ));
  }

They key **foldersKey** can now be registered on the client side by subscribing to it with:

.. code-block:: python

  angular.module('YourApp').factory 'Publisher',
  ['_Publisher', 'FolderModel', (_Publisher, FolderModel) ->

    publisher = new _Publisher()
    publisher.subscribeObjectTo(FolderModel, 'foldersKey')

    return publisher
  ]

Now everytime you call the **getAllFolders** controller method the returned JSON will be passed directly to the FolderModel.

Internally it works like this: 

* For each successful request the data JSON array is iterated over
* If a key is found that a model subscribed to the data will be passed to its **handle()** method

The default **handle()** method of the model only adds/updates the new object. To add custom behaviour you can overwrite the method.

_Model
~~~~~~
Used as a model parent class and provides CRUD and caching logic for the JSON data.


.. js:class:: _Model

  .. js:function:: add(data)

    :param object data: The object that should be added

    Adds a new item. If the item id is already present, it will be updated

  .. js:function:: update(data[, clearCache=true])

    :param object data: The object that should be updated
    :param boolean clearCache: clears the existing queries cache. Set this to false if the update does not affect the queries on the model to improve performance

    Updates an existing object by copying the provided attributes to the old one. That means that if you want to update only one field simply pass an object with the correct id and the fields that should be overwritten.

    Example: 

    .. code-block:: js

      // udpate name and email
      itemModel.update({id: 3, name: 'newName', email: 'newEmail'})

  .. js:function:: add(data[, clearCache=true])

    :param object data: The object that should be added
    :param boolean clearCache: clears the existing queries cache. Set this to false if the update does not affect the queries on the model to improve performance


  .. js:function:: getById(id[, clearCache=true])

    :param int id: The id of the object
    :param boolean clearCache: clears the existing queries cache. Set this to false if the update does not affect the queries on the model to improve performance
    :returns object: a data object by its id


  .. js:function:: getAll()

    :returns array: an array with all stored objects


  .. js:function:: clear()

    Deletes all stored data objects


  .. js:function:: size()

    :returns int: the count of all stored data objects

  .. js:function:: get(Query query)

    :param Query query: an instance of a Query class or subclass
    :returns mixed: the returnvalue of the query

    Runs a query over all stored objects and returns the result which is calculated in the query. This is cached by params and query. The cache is deleted after a new add/update/remove method was called.


Queries
^^^^^^^
Because AngularJS getters have to be fast (Angular checks for changed objects after each digest) the App Framework provides cachable queries. The following queries are available:

* **_BiggerThanQuery**
* **_BiggerThanEqualQuery**
* **_LessThanQuery**
* **_LessThanEqualQuery**
* **_EuqalQuery**
* **_NotEuqalQuery**
* **_ContainsQuery**
* **_DoesNotContainQuery**
* **_MinimumQuery** 
* **_MaximumQuery**

To query an object with a **_BiggerThanQuery** use its **get** method:

.. code-block:: js

  valuesBiggerThan4 = myModel.get(new _BiggerThanQuery('id', 4))

This query is cached until a new entry is added, removed or updated.

.. note:: Do not update the objects by hand only. Always use the model's update method to tell it that a model has changed. Otherwise you run into an invalid cache!

Writing your own queries
^^^^^^^^^^^^^^^^^^^^^^^^
For more complex queries the **_Query** object can be extended. Each query object has a **hashCode** and **exec** method. The **hashCode** method is used to generate a unique hash for the query and its arguments so that it can be cached. The built in method works like this:

* Take all the arguments values
* replace _ with __ in the argument values
* Construct the hash by: QUERYNAME_ARG1Value_ARG2Value etc.

You can override this method if you need to. The **exec** method is used to run the query. It receives an array with all objects and returns the filtered content.

A query that would select only ids between a range of numbers would look like this:

.. code-block:: ruby

  angular.module('YourApp').factory '_LessThanQuery', ['_Query', (_Query) ->

    class RangeQuery extends _Query

      # @_field is the attribute name of the object
      constructor: (@_field, @_lowerBound, @_upperBound) ->
        name = 'range'
        super(name, [@_field, @_lowerBound, @_upperBound])

      exec: (data) ->
        filtered = []
        for entry in data
          if entry[@_field] < @_upperBound and entry[@_field] > @_lowerBound
            filtered.push(entry)

        return filtered


    return RangeQuery
  ]

If **hashCode** is not overwritten it would produce the following output:

.. code-block:: ruby
  
  query = new _RangeQuery('id', 3, 6)
  query.hashCode() # prints range_id_3_6


Directives
----------
The App Framework provides the following directives:

ocClickSlideToggle
~~~~~~~~~~~~~~~~~~
Can be used for the settings slideup or to slide up any area and hide it on focus lost.

Can be enhanced by passing an expression:

.. code-block:: js
  
  {
    selector: '#jquery .selector' 
    hideOnFocusLost: true
    cssClass: 'opened'
  }

* **selector**: if defined, a different area is slid up on click
* **hideOnFocusLost**: if defined, the slid up area will hide when the focus is lost
* **cssClass**: if defined, the class which should be toggled on the element where the directive is bound to

Example:

.. code-block:: html

  <button oc-click-slide-toggle="{selector: '#settings', hideOnFocusLost: true}" />
  <div id="settings"></div>


ocClickFocus
~~~~~~~~~~~~
Can be used to focus a different element when the element is being clicked that has this directive

Must pass an expression:

.. code-block:: js
  
  {
    selector: '#jquery .selector' 
  }

* **selector**: the area that should be focused

Example:

.. code-block:: html

  <button oc-click-focus="{selector: '#settings'}" />
  <input id="settings" type="text" />


ocReadFile
~~~~~~~~~~~~
Can be used to pass the contents of a file input field to a function. The directive binds to the **change** event of the input. The read content will be assigned to the scope as $fileContent variable and the given function will be called.

Example:

.. code-block:: html

  <input type="file" name="import" oc-read-file="import($fileContent)"/>


ocDraggable
~~~~~~~~~~~
Shortcut for using jquery-ui draggable. The expression is passed to $.draggable.

These two are equivalent:

.. code-block:: js

  $('#settings').draggable({ cursor: "move", cursorAt: { top: 56, left: 56 } });

.. code-block:: html

  <div id="settings" oc-draggable="{ cursor: 'move', cursorAt: { top: 56, left: 56 } }"></div>

ocForwardClick
~~~~~~~~~~~~~~
Used to forward a click. Useful to trigger a hidden file upload field by clicking a visible button.

Needs an expression:

.. code-block:: js
  
  {
    selector: '#jquery .selector' 
  }

* **selector**: the are where the click needs to redirected to

Example:

.. code-block:: html

  <button oc-forward-click="{selector: '#upload'}" />
  <input type="file" id="upload" />