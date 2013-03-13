AngularJS
=========

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

.. versionadded:: 6.0

The App Framework comes with tools for integrating :doc:`../general/angular` into the app. 

Recommended layout
------------------

If AngularJS should be used for the app, the following files layout is recommended. If CoffeeScript is used, use the same layout only with the **.coffee** extension instead of the **.js** extension.

The main logic goes into:

* **js/app/app.js**: The main file where the module is being initiated
* **js/app/directives/**: folder for directives
* **js/app/controllers/**: folder for controllers
* **js/app/filters/**: folder for filters
* **js/app/services/**: folder for services

Tests go into:

* **js/tests/stubs/app.js**: Use this for initializing the container for tests
* **js/tests/directives/**: folder for directive tests
* **js/tests/controllers/**: folder for controller tests
* **js/tests/filters/**: folder for filter tests
* **js/tests/services/**: folder for service tests
* **js/tests/vendor/**: folder for js libs that are only included in the tests for instance jquery

Configuration files go into:

* **js/config/testacular_conf.js**: Testacular (used for unittests) configuration

The compiled files go into:

* **js/public/app.js**: The compiled JavaScript

Additional JavaScript libs that are used in the app go into:

* **js/vendor/**

Build
-----
The app will likely depend on various **node.js** tools for building the JavaScript/CoffeeScript. To make setup and development easy it is recommended to provide a **package.json** inside the **js/** directory. 

This example contains additional dependencies for CoffeeScript. Adjust this to your needs.

:file:`js/package.json`

.. code-block:: js

  {
    "name": "owncloud-appframework",
    "description": "ownCloud App Framework",
    "version": "0.0.1",
    "author": {
      "name": "Bernhard Posselt",
      "email": "nukeawhale@gmail.com"
    },
    "private": true,
    "homepage": "https://github.com/owncloud/apps/tree/appframework-js/appframework/",
    "repository": {
      "type": "git",
      "url": "git@github.com:owncloud/apps.git"
    },
    "bugs": "https://github.com/owncloud/apps/issues",
    "contributors": [],
    "dependencies": {},
    "devDependencies": {
      "grunt": "~0.4.0",
      "grunt-cli": "~0.1.6",
      "coffee-script": "~1.4.0",
      "grunt-contrib-concat": "~0.1.2",
      "grunt-contrib-watch": "~0.2.0",
      "grunt-coffeelint": "0.0.6",
      "grunt-wrap": "~0.2.0",
      "testacular": "~0.4.0",
      "phantomjs": "~1.8.1-3",
      "grunt-phpunit": "0.2.0",
      "gruntacular": "~0.3.0"
    },
    "engine": "node >= 0.8"
  }


To build the JavaScript/CoffeeScript a buildsystem like `Grunt <http://gruntjs.com/>`_ is recommended. To get a good overview watch the `Tutorial video with Ben Alman <http://www.youtube.com/watch?v=Xp6aFno24x4>`_.

The configfile for Grunt should be placed in the **js/** directory and can either contain CoffeeScript or JavaScript.

An example for a CoffeeScript configuration would be:

:file:`js/Gruntfile.coffee`

.. code-block:: python

  module.exports = (grunt) ->
    
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-coffeelint')
    grunt.loadNpmTasks('grunt-wrap');
    grunt.loadNpmTasks('grunt-phpunit');
    grunt.loadNpmTasks('gruntacular');

    grunt.initConfig
    
      meta:
        pkg: grunt.file.readJSON('package.json')
        version: '<%= meta.pkg.version %>'
        banner: '/**\n' +
          ' * <%= meta.pkg.description %> - v<%= meta.version %>\n' +
          ' *\n' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> - ' +
          '<%= meta.pkg.author.name %> <<%= meta.pkg.author.email %>>\n' +
          ' *\n' +
          ' * This file is licensed under the Affero General Public License version 3 or later.\n' +
          ' * See the COPYING-README file\n' +
          ' *\n' + 
          ' */\n\n'
        build: 'build/'
        production: 'public/'

      concat:
        app: 
          options:
            banner: '<%= meta.banner %>\n'
            stripBanners: 
              options: 'block'
          src: [
              '<%= meta.build %>app/app.js'
              '<%= meta.build %>app/directives/*.js'
              '<%= meta.build %>app/services/**/*.js'
            ]
          dest: '<%= meta.production %>app.js'
      wrap:
        app:
          src: '<%= meta.production %>app.js'
          dest: ''
          # adjust this to include more top level js libs
          wrapper: [
            '(function(angular, $, undefined){\n\n'
            '\n})(window.angular, jQuery);'
          ] 

      coffeelint:
        app: [
          'app/**/*.coffee'
          'tests/**/*.coffee'
        ]
        options:
          'no_tabs':
            'level': 'ignore'
          'indentation':
            'level': 'ignore'
          'no_trailing_whitespace':
            'level': 'warn'

      watch: 
        concat:
          files: [
            '<%= meta.build %>app/**/*.js'
            '<%= meta.build %>tests/**/*.js'
          ]
          tasks: 'compile'
        phpunit:
          files: '../**/*.php'
          tasks: ['phpunit']
      
      testacular: 
        unit: 
          configFile: 'config/testacular.conf.js'
        continuous:
          configFile: 'config/testacular.conf.js'
          singleRun: true
          browsers: ['PhantomJS']
          reporters: ['progress', 'junit']
          junitReporter:
            outputFile: 'test-results.xml'

      phpunit:
        classes:
          dir: '../tests'
        options:
          colors: true


    grunt.registerTask('run', ['watch:concat'])
    grunt.registerTask('compile', ['concat', 'wrap', 'coffeelint'])
    grunt.registerTask('ci', ['testacular:continuous'])
    grunt.registerTask('testphp', ['watch:phpunit'])


If no CoffeeScript is being used, coffeelint should be replaced with jshint and jslint. 

To give people a well known environment a Makefile is recommended to start the various tasks:

.. code-block:: make

  firefox_bin=/usr/bin/firefox
  chrome_bin=/usr/bin/chromium
  coffee=$(CURDIR)/node_modules/coffee-script/bin/coffee
  grunt=$(CURDIR)/node_modules/grunt-cli/bin/grunt
  phantomjs=$(CURDIR)/node_modules/phantomjs/bin/phantomjs

  all: compile

  deps:
    cd $(CURDIR)/
    npm install --deps

  watch: compile
    $(coffee) --compile --watch --output $(CURDIR)/build/app $(CURDIR)/app/ & \
    $(coffee) --compile --watch --output $(CURDIR)/build/tests $(CURDIR)/tests/ & \
    $(grunt) --config $(CURDIR)/Gruntfile.coffee run

  testacular: deps
    export CHROME_BIN=$(chrome_bin) && export FIREFOX_BIN=$(firefox_bin) && \
    $(grunt) --config $(CURDIR)/Gruntfile.coffee testacular:unit

  phpunit:
    $(grunt) --config $(CURDIR)/Gruntfile.coffee testphp  

  compile: deps
    mkdir -p $(CURDIR)/build/app
    mkdir -p $(CURDIR)/build/tests
    mkdir -p $(CURDIR)/public
    $(coffee) --compile --output $(CURDIR)/build/app $(CURDIR)/app/
    $(coffee) --compile --output $(CURDIR)/build/tests $(CURDIR)/tests/
    $(grunt) --config $(CURDIR)/Gruntfile.coffee compile

  test: deps compile
    export PHANTOMJS_BIN=$(phantomjs) && \
    $(grunt) --config $(CURDIR)/Gruntfile.coffee ci


  clean:
    rm -rf $(CURDIR)/build
    rm -rf $(CURDIR)/test-results.xml

The above makefile can be used to watch and compile the changes with::

    make watch

The unittests can be automatically run on change in a second terminal window::

    make testacular


Set up Testacular
-----------------
Testacular is able to run unittests when a JavaScript file changes. On the continues integration server these tests can be run with **PhantomJS** (or if a graphical environment is installed also with other browsers). A **JUnit** compatible testresult can be configured.

.. note:: The config values can be overwritten in the Gruntfile

An example file would look like:

:file:`js/config/testacular_conf.js`

.. code-block:: js

  // base path, that will be used to resolve files and exclude
  // since this is in the config/ folder we have to go one directory higher
  basePath = '../';


  // list of files / patterns to load in the browser
  files = [

    // your favorite test library, needs to have an adapter
    JASMINE,
    JASMINE_ADAPTER,

    // commonly included libraries that are provided by owncloud need to be
    // loaded because we dont have access to those in the test environment
    'tests/vendor/jquery-1.9.1/jquery-1.9.1.js',
    'tests/vendor/jquery-ui-1.10.0/jquery-ui-1.10.0.custom.js',
    'tests/vendor/angular-1.0.4/angular.js',
    'tests/vendor/angular-1.0.4/angular-mocks.js',

    // you want to use the ngMocks container thats why you have to redefine the
    // main js file
    'tests/stubs/app.js',

    // these are your js and testfiles that you want to use
    'build/app/directives/*.js',
    'build/app/filters/*.js',
    'build/app/services/**/*.js',
    'build/tests/**/*Spec.js'
  ];


  // list of files to exclude
  // reason: see the files array
  exclude = [
    'build/app/app.js'
  ];

  // test results reporter to use
  // possible values: 'dots', 'progress', 'junit'
  reporters = ['progress'];

  // web server port
  port = 8080;

  // cli runner port
  runnerPort = 9100;

  // enable / disable colors in the output (reporters and logs)
  colors = true;

  // level of logging
  // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
  logLevel = LOG_INFO;


  // enable / disable watching file and executing tests whenever any file changes
  autoWatch = true;


  // Start these browsers, currently available:
  // - Chrome
  // - ChromeCanary
  // - Firefox
  // - Opera
  // - Safari (only Mac)
  // - PhantomJS
  // - IE (only Windows)
  browsers = ['Chrome'];


  // If browser does not capture in given timeout [ms], kill it
  captureTimeout = 5000;


  // Continuous Integration mode
  // if true, it capture browsers, run tests and exit
  singleRun = false;


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


Features
--------
Now that the library is loaded and set up they can be used inside the module container. The App Framework follows the convention of marking class names with a leading underscore and object instances without it.

.. note:: The App Framework uses CoffeeScript so if JavaScript objects should extend the provided objects, you need to implement the inheritance like CoffeeScript does it.

The App Framework provides the following services:

* **_Reqest**: Used to make AJAX requests
* **_Model**: Used as a model parent class. Provides CRUD and caching logic for the JSON data
* **_Publisher**: Used to automatically distribute JSON from AJAX Requests to the models
* **Loading**: Simple object that can be used for displaying loading notifcations
* **Router**: the **OC.Router** object
* **Notification**: the **OC.Notification** object
* **Utils**: the **OC** object

The App Framework provides the following directives:

* **ocClickSlideToggle**: Used for the settings slideup. Can be used to slide up any area and hide it on focus lost
* **ocDraggable**: Shortcut for using jquery-ui draggable
* **ocForwardClick**: Used to forward a click. Useful to trigger a hidden file upload field by clicking a visible button

Requests
--------
TBD

Models
------
TBD

Queries
~~~~~~~
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
~~~~~~~~~~~~~~~~~~~~~~~~
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


