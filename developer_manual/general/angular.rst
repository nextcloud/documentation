AngularJS
=========

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

`AngularJS <http://angularjs.org/>`_ is an MV* JavaScript framework by Google.

Documentation is available at these sources:

* `Official tutorial <http://docs.angularjs.org/tutorial/>`_
* `Developer guide <http://docs.angularjs.org/guide/>`_
* `API reference <http://docs.angularjs.org/api/>`_
* `Screencasts on Youtube <http://www.youtube.com/user/angularjs>`_

What problem does it solve
--------------------------
jQuery is a nice library but when it comes to building webapplications, one will soon reach a point where its becoming increasingly impossible to split view and logic.

That problem is caused by jQueries habit to operate directly on dom elements. Most jQuery code looks like this:

.. code-block:: javascript

  $('.someElement').doSomething();


That makes it incredible hard to refactor your view because your whole JavaScript code is tightly coupled to the structure and classes in your HTML.

Another problem is the dynamic generation of DOM elements. You'd normally go with one of these three approaches:


**1**) Create new element, bind event listeners and append it to the dom:

.. code-block:: javascript

  var $newButton = $('<button>').text('A new button');
  $newButton.click(function(){
      alert('I was clicked!');
  });
  $('.someElement').append($newButton);


**2**) Fetch HTML from the server and bind event listeners:

.. code-block:: javascript

  $.post('/some/url', function(data){
	  $newButton = $(data);
	  $newButton.click(function(){
          alert('I was clicked!');
      });
      $('.someElement').append($newButton);
  });

**3**) Use jquery templates:

.. code-block:: javascript

  var buttons = [
      text: 'A new button'
  ];
  var markup = "<button>${text}</button>";

  $.template( "myTemplate", markup );
  $.tmpl( "myTemplate", buttons ).appendTo( ".someElement" );
  // and bind the click listener


All of the above split the HTML from the original HTML and its hard to bind event listeners (yes, there's $.on(), but its slow). You are also in need of updating the DOM by hand.

In contrast to the above solutions, Angular uses XML attributes to define the template logic. This approach does not only good for your editor, but you're also less likely to create HTML errors. You can even validate the HTML. Furthermore, every value that is written into the HTML is escaped to prevent XSS.

Concerning testability: Angular uses Dependency Injection to glue the code together and it's easy to run your unittests(look at the examples in the official docs). Angular also ships with mocks for common areas like HTTP requests or logging.

Thats how the code would look with Angular:

.. code-block:: html

  <div ng-app="MyApp" class="someElement" ng-controller="ButtonController">
      <button ng-repeat="button in buttons" ng-click="showClicked()">{{ button.text }}</button>
  </div>

The button controller handles the complete logic. It would look something like this:

.. code-block:: javascript

  var app = angular.module('MyApp', []);

  app.controller('ButtonController', ['$scope',
      function($scope){
          $scope.buttons = [
              {text: 'A new button'}
          ];
          $scope.showClicked = function(){
               alert('I was clicked!');
          };
      }
  );

Now your logic is nicely decoupled from your view and the template logic is where you would expect it to be: in the HTML markup.

Angular also knows when your data has changed: when a new element is added to the **$scope.buttons** array, the view will automatically update. It also updates the view when an existing element in the array changes.


Drawbacks of AngularJS
----------------------
That brings us also to the biggest problem of AngularJS: It can be slow at times. This is caused by `the way Angular works <http://docs.angularjs.org/guide/concepts>`_

Should you somehow require to show more than around 1000 complex elements at once (like 1000 buttons with lots of wiring inside the code and a ton of attributes) there will most likely be performance problems (To be fair: normal JavaScript would also run into performance problems).

One way to tackle this is to use autopaging (progressive loading) that only renders X elements and loads the next batch when the user scrolls down for instance. This also reduces the traffic. Software that successfully uses this approach is Google Reader for instance.

When porting the News app to AngularJS we found that the benefits outweighed the drawbacks and that we could optimize the Code well enough to offer a good user experience.

But all in all you should build an optimized prototype and compare it to a non angular app to make sure that the user experience is good.


Using AngularJS in your project
-------------------------------

Since you'll have lots of files, a buildscript is recommended to merge the JavaScript into a single file. For that `CoffeeScript <http://coffeescript.org/>`_ and a `Cakefile <http://k20e.com/blog/2011/05/02/a-piece-of-cakefile/>`_ is recommended.

You can install CoffeeScript via NPM (nodejs package manager)::

  sudo npm -g install coffee-script

Place the Cakefile in your app directory. When executing::

  cake watch

the Cakefile will automatically watch the coffee folder for changes and compile the files when it finds a change.

The following folderstructure is recommended::

  coffee/
  coffee/directives/
  coffee/filters/
  coffee/controllers/
  coffee/services/

For a simple example, take a look at the `apptemplateadvanced <https://github.com/owncloud/apps/tree/master/apptemplateadvanced>`_ app.

Create your app
---------------

.. note:: For the sake of syntax highlightning, this tutorial will use JavaScript instead of CoffeeScript

Your app initialization will be in::

  coffee/app.coffee

and will look like this:

.. code-block:: javascript

  angular.module('YourApp', []).
    config(['$provide', function($provide){

      // Use this for configuration values
      var Config = {
        // your config values here
      };

      // declare your routes here
      Config.routes = {
        saveNameRoute: 'apptemplate_advanced_ajax_setsystemvalue'
      };

      return $provide.value('Config', Config);
    }
  ]);

.. note:: It is important that this file is at the beginning of the compiled JavaScript! The square brackets [] create a new app. If you only use **angular.module('YourApp')** it will retrieve the app instance.

You will want to also add the run function to the same file to do some initial setup. The run function is run once angular is set up. That doesnt mean though that the document is ready

.. code-block:: javascript

  angular.module('YourApp').
    run(['$rootScope', function($rootScope){

      var init = function(){
        $rootScope.$broadcast('routesLoaded');
      };

      // this registers a callback that is executed once the routes have
      // finished loading. Before this you cant really do request
      OC.Router.registerLoadedCallback(init);
    }
  ]);


The next move is to add the **ng-app="YourApp"** attribute to the root element of your application. Everything inside of it will be processed by Angular.


Controllers
-----------
Controllers are the mediators between your view and your data. Assign controllers to different parts of your page. **Don't nest controllers!** Every controller should have one specific area of your page.

A controller could look like this:

.. code-block:: javascript

  angular.module('YourApp').
    factory('ExampleController', ['$scope', 'Config', 'Request',
      function($scope, Config, Request){

      var Controller = function($scope, Config, Request){
        var self = this;

        this.$scope = $scope;
        this.config = Config;
        this.request = Request;

        // bind methods on the scope so that you can access them in the
        // controllers child HTML
        this.$scope.saveName = function(name){
          self.saveName(name);
        };
      };

      /**
       * Makes an ajax query to save the name
       */
      Controller.prototype.saveName = function(name){
        this.request.saveName(this.config.routes.saveNameRoute, name);
      };

      return new Controller($scope, Config, Request);
    }
  ]);

To each controller a **$scope** object is passed. The scope is the glue between the view and the controller.

.. note:: because controllers use the $scope object to connect to the view, you shouldn't pass in references of DOM elements. Use directives if you need to bind behaviour to DOM elements.

Inside the square brackets (['$scope', 'Config', 'Request', function ...), you define the dependencies that need to be passed in to the object. This is the how Dependency Injection works in Angular.

A controller is bound to an HTML element with the **ng-controller** attribute. Everything on that element or below it will be in the controller's scope:

.. code-block:: html

  <ul ng-controller="ExampleController">
      <li ng-click="saveName('john')"></li>
  </ul>



Models & Services
-----------------
Models hold your data. There isn't a specific implementation for models in Angular but it's useful to put the data into own objects. Inside these objects you can create hashmaps for quick access by ID or simply add new functionality or properties to the data.

This is a little example how you could encapsulate data for a Button Model. Most of the functionality should go into a generic parent object though, once you use more than one model.

.. code-block:: javascript

  angular.module('YourApp').
    factory('ButtonModel', function(){

      var ButtonModel = function(){
          this.buttons = [];
          this.buttonHashMap = {};
      };

      ButtonModel.prototype.add = function(button){
          this.buttons.add(button);
          this.buttonHashMap[button.id] = button;
      };

      ButtonModel.prototype.getById = function(buttonId){
          return this.buttonHashMap[buttonId];
      };

      ButtonModel.prototype.getItems = function(){
          return this.buttons;
      };

      return new ButtonModel();
    }
  ]);


A service can be seen as a single instance of an item. You can use it to share data between controllers for instance. A model is a service, but you could create an even simpler service which contains only an object:

.. code-block:: javascript

  angular.module('YourApp').
    factory('ActiveFeed', function(){
        return {
            id: 5
        };
    }
  ]);


Filters
-------
Filters are used to transform objects or strings before you render them. They are basically just a function that receive an input and returns a result.

Built-In filters contain functions like **orderBy** (orders array of objects by a specific attribute) or **uppercase** (turns string to uppercase).

.. note:: Due to performance reasons you shouldn't use filters to return objects by a certain foreign key. Remember: everytime an element is updated, everything is sent through the filter again (O(n) algorithmic complexity)

A simple filter would look like this:

.. code-block:: javascript

  angular.module('YourApp').
    filter('biggerThanX', function(){

      var biggerThanX = function(elements, x){
        result = [];
        for(var i=0; i<elements.length; i++){
            var elem = elements[i];
            if(elem.someNumber > x){
                results.push(elem);
            }
        }
        return result;
      };

      return biggerThanX;
    }
  );
  ]);


Filters are used like Unix Pipes in the Bash:

.. code-block:: html

  <ul ng-controller="SomeController">
      <li ng-repeat="item in items | biggerThanX:5">{{ item.someNumber }}</li>
  </ul>


Directives
----------
Directives are powerful yet complex for beginners. You can create your own XML elements or XML attributes, or simply map eventlisteners to HTML elements.

Everytime you are in need to do something directly to a DOM element, you should write a directive for it.

This is an example that uses a directive to bind jQuery draggable and dropable to a DOM element:


.. code-block:: javascript

  angular.module('YourApp').directive('draggable', function(){

    return function(scope, elm, attr){

        var details = {
          revert: true,
          stack: '> li',
          zIndex: 1000,
          axis: 'y',
        };

        $(elm).draggable(details);
    };
  });

  angular.module('YourApp').directive('droppable', function(){

    return function(scope, elm, attr){

        var details = {
            greedy: true,
            drop: function(event, ui){
                console.log('this was dropped on me');
                console.log(ui.draggable);
                scope.$apply(attr.droppable);
            }
        };

        $(elm).droppable(details);


    };
  });

It can now be applied to any element by simply adding an attribute:


.. code-block:: html

  <li draggable>nothing to see here</li>
  <ul droppable></ul>


Since a directive is a new element outside of the current Angular Framework, we have to trigger a view update by using the **scope.$apply** function.

This is only a `fraction of directive applications <http://www.youtube.com/watch?v=A6wq16Ow5Ec>`_ though.


Requests
--------
For simple post or get requests, Angular offers the **$http** object. It's very helpful to encapsulate it into an own object though. You will want to use the object to implicitely send the CSRF token to the server.

.. code-block:: javascript

  angular.module('YourApp').
    factory('Request', ['$http', '$rootScope', 'Config', function($http, $rootScope, Config){

      var Request = function($http, $rootScope, Config){
        var self = this;

        this.$http = $http;
        this.$rootScope = $rootScope;
        this.config = Config;

        // if the routes are not yet initialized we dont want to lose
        // requests. Save all requests and run them when the routes are
        // ready
        this.initialized = false;
        this.shelvedRequests = [];

        this.$rootScope.$on('routesLoaded', function(){
          for(var i=0; i<self.shelvedRequests.length; i++){
            var req = self.shelvedRequests[i];
            self.post(req.route, req.routeParams, req.data,
                req.onSuccess, req.onFailure);
          }

          self.initialized = true;
          self.shelvedRequests = [];
        });

      };


      /**
       * Do the actual post request
       * @param string route: the url which we want to request
       * @param object routeParams: Parameters that are needed to generate
       *                            the route
       * @param object data: the post params that we want to pass
       * @param function onSuccess: the function that will be called if
       *                            the request was successful
       * @param function onFailure: the function that will be called if the
       *                          request failed
       */
      Request.prototype.post = function(route, routeParams, data, onSuccess, onFailure){

        // if routes are not ready yet, save the request
        if(!this.initialized){
          var request = {
            route: route,
            routeParams: routeParams,
            data: data,
            onSuccess: onSuccess,
            onFailure: onFailure
          };
          this.shelvedRequests.push(request);
          return;
        }

        var url;
        if(routeParams){
          url = OC.Router.generate(route, routeParams);
        } else {
          url = OC.Router.generate(route);
        }

        // encode data object for post
        var postData = data || {};
        postData = $.param(data);

        // pass the CSRF token as header
        var headers = {
          requesttoken: oc_requesttoken,
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        // do the actual request
        this.$http.post(url, postData, {headers: headers}).
          success(function(data, status, headers, config){

            if(onSuccess){
              onSuccess(data);
            }
          }).
          error(function(data, status, headers, config){

            if(onFailure){
              onFailure(data);
            }
          });
      };

  ]);


Closing remarks
---------------
This was a minimal fraction of Angular but it should give you a good idea about how Angular works (If not, please help to improve the documentation ;) ). More directives and objects are available on the `official API Page <http://docs.angularjs.org/api/>`_
