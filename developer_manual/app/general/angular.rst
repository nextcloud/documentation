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


Closing remarks
---------------
This was a minimal fraction of Angular but it should give you a good idea about how Angular works (If not, please help to improve the documentation ;) ). More directives and objects are available on the `official API Page <http://docs.angularjs.org/api/>`_
