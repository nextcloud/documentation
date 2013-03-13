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

Loading
~~~~~~~
Simple object that can be used for displaying loading notifcations. It has an internal counter that starts at 0 and can be increased and decreased. If the counter is bigger than 0 isLoading is true.

Example:

.. code-block:: python
  
  loading = new Loading()
  loading.isLoading() # false

  loading.increase()
  loading.isLoading() # true

  loading.increase()
  loading.getCount() # 2

  loading.decrease()
  loading.decrease()
  loading.isLoading() # false


Router
~~~~~~
The **OC.Router** object

Notification
~~~~~~~~~~~~
The **OC.Notification** object

Utils
~~~~~
The **OC** object

_Request
~~~~~~~~
Used to make AJAX requests

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
Used as a model parent class. Provides CRUD and caching logic for the JSON data

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

.. code-block:: python

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

.. code-block:: python

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

.. code-block:: python
  
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
  }

* **selector**: if defined, a different area is slid up on click
* **hideOnFocusLost**: if defined, the slid up area will hide when the focus is lost

Example:

.. code-block:: html

  <button oc-click-slide-toggle="{selector: '#settings', hideOnFocusLost: true}" />
  <div id="settings"></div>

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