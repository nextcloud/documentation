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
jQuery is a nice library but when it comes to building webapplications one will soon reach a point where its becoming increasingly impossible to change templates from logic.

That problem is caused by jQueries habit to operate directly on dom elements. Most jQuery code looks like this:

.. code-block:: javascript
  
  $('.someElement').doSomething();


That makes it incredible hard to refactor your view (HTML in this case) because your whole JavaScript code is tightly coupled to the structure and classes on that page.

Another problem is the dynamic generation of DOM elements. Basically you'd choose one of these three choices:


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


All of the above split the html from the original HTML and its a pain to bind event listeners (yes, there's $.on(), but its slow). You are also in need of updating the DOM by hand.

In contrast to the above solutions, Angular uses XML attributes to define the template logic, so your templates are written in using standard HTML. Every value that is written into the HTML is escaped to prevent XSS.

Angular uses Dependency Injection to glue the code together and is built to make testing easy (look at the examples in the official docs);

Thats how the code would look with Angular:

.. code-block:: html

  <div ng-app="MyApp" class="someElement" ng-controller="ButtonController">
      <button ng-repeat="button in buttons" ng-click="showClicked()">{{ button.text }}</button>
  </div>

The button controller handles the complete logic. It would look something like this:

.. code-block:: javascript

  angular.module('MyApp').controller('ButtonController', ['$scope', 
      function($scope){
          $scope.buttons = [
              {text: 'A new button'}
          ];
          $scope.showClicked = function(){
               alert('I was clicked!');
          };
      }
  );

Now your logic can be changed really easily and the template logic is where you would expect it to be: in the HTML.

One of the awesome things of Angular is that it knows when your data has changed. The moment we add a new element to the **$scope.buttons** array, our view will update automatically. It also updates when i update an existing element in the array changes a value.

Drawbacks of AngularJS
----------------------

That brings us also to the biggest problem of AngularJS: Because browsers don't support (not yet) a native way to tell the JavaScript that something has changed, so Angular has to do "dirt checking" on a change. 

Should you somehow require to show more thant 3000 complex elements at once (like 3000 buttons with lots of wiring inside the code and a ton of attributes) there will defenitely be performance problems (To be fair: normal JavaScript would also run into performance problems).

One way to tackle this is to use autopaging (progressive loading) that only renders X elements and loads the next batch when the user scrolled down for instance. This also reduces the traffic. Software that successfully uses this approach is Google Reader for instance.

When porting the News app to AngularJS we found that the benefits outweighed the drawbacks and that we could optimize the Code enough for people to note the difference.

All in all, before transitioning completely one should try to build an optimized prototype and see for himself how it compares to pure jQuery.


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

For a simple example, take a look at the `apptemplate_advanced <https://github.com/owncloud/apps/tree/master/apptemplate_advanced>`_ app.