Templates
=========

.. index::
   single: execution; context


.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

.. warning::
  To prevent XSS the following PHP **functions for printing are forbidden: echo, print() and <?=**. Instead use ``p($data)`` for printing your values. Should you require unescaped printing, **double check for XSS** and use: ``print_unescaped($data)``.

.. warning::
  Templates **must not contain database queries**! All data should be passed to the template via ``$template->assign($key, $value)``.


ownCloud uses its own templating system. Templates reside in the ``template/`` folder. To use them you'll need to instantiate the ``OC_Template`` class with the name of the template. If you want to pass values to it, use the ``assign`` method.


**index.php**

.. code-block:: php

  <?php 
  $allEntries = array('entry1', 'entry2');
  $mainTemplate = new OC_Template('news', 'main', 'user'); 
  $mainTemplate->assign('entries', $allEntries);
  $mainTemplate->assign('name', "john doe");
  $mainTemplate->printPage();
  ?>

To access the assigned variables in the template, use the $_[] array. The variable will be availabe under the key that you defined (e.g. $_['key']). 

**templates/main.php**

.. code-block:: php

  <?php foreach($_['entries'] as $entry){ ?>
    <p><?php p($entry); ?></p>
  <?php
  }

  print_unescaped($this->inc('sub.inc'));

  ?>

Templates can also include other templates by using the $this->inc('templateName') method. Use this if you find yourself repeating a lot of the same HTML constructs. The parent variables will also be available in the included templates, but should you require it, you can also pass new variables to it by using the second optional parameter for $this->inc.

**templates/sub.inc.php**

.. code-block:: php

  <div>I am included but i can still access the parents variables!</div>
  <?php p($_['name']); ?>



Template class
--------------

.. php:class:: OC_Template

  This class provides the templates for owncloud. It is used for loading template files, assign variables to it and render the whole template.

  .. php:method:: __construct($app, $name[, $renderas])

   :param string $app: the name of the app
   :param string $file: name of the template file (without suffix)
   :param string $renderas: If $renderas is set, OC_Template will try to produce a full page in the according layout. For now, renderas can be set to "guest", "user" or "admin"
   :returns: OC_Template object

   **Example:**

   .. code-block:: php

     <?php 
     $mainTemplate = new OC_Template('news', 'main', 'user'); 
     ?>


  .. php:method:: addHeader($tag, $attributes[, $text=''])

   :param string $tag: tag name of the element
   :param array $attributes: array of attrobutes for the element
   :param string $text: the text content for the element

   Add a custom element to the html <head>

   **Example:**

   .. code-block:: php

     <?php 
     $mainTemplate = new OC_Template('news', 'main', 'user'); 
     $mainTemplate->addHeader('title', array(), 'My new Page');
     ?>

  .. php:method:: append($key, $value)

   :param string $key: the key under which the variable can be accessed in the template
   :param $value: the value that we want to pass
   :returns: bool

   This function assigns a variable in an array context. If the key already exists, the value will be appended. It can be accessed via $_[$key][$position] in the template.

   **Example:**

   .. code-block:: php

     <?php 
     $customers = array("john", "frank");

     $mainTemplate = new OC_Template('news', 'main', 'user'); 
     $mainTemplate->assign('customers', $customers);
     $mainTemplate->append('customers', 'hanna');
     ?>


  .. php:method:: assign($key, $value[, $sanitizeHTML=true])

   :param string $key: the key under which the variable can be accessed in the template
   :param $value: the value that we want to pass
   :param bool $sanitizeHTML: false, if data shouldn't get passed through htmlentities
   :returns: bool

   This function assigns a variable. It can be accessed via $_[$key] in the template. If the key existed before, it will be overwritten

   **Example:**

   .. code-block:: php

     <?php 
     $customers = array("john", "frank");

     $mainTemplate = new OC_Template('news', 'main', 'user'); 
     $mainTemplate->assign('customers', $customers);
     ?>


  .. php:method:: detectFormfactor()

   :returns: The mode of the client as a string. **default** -> the normal desktop browser interface, **mobile** -> interface for smartphones, **tablet** -> interface for tablets, **standalone** -> the default interface but without header, footer and sidebar, just the application. Useful to use just a specific app on the desktop in a standalone window.

   **Example:**

   .. code-block:: php

     <?php 
     $mainTemplate = new OC_Template('news', 'main', 'user'); 
     $formFactor = $mainTemplate->detectFormfactor();
     ?>


  .. php:method:: fetchPage()

   :returns: the HTML of the template as string

   This function proceeds the template and but prints no output.

   **Example:**

   .. code-block:: php

     <?php 
     // FIXME: provide an example please
     ?>


  .. php:method:: getFormFactorExtension()
   
   :returns: Returns the formfactor extension for current formfactor (like .mobile or .tablet)


   **Example:**

   .. code-block:: php

     <?php 
     $mainTemplate = new OC_Template('news', 'main', 'user'); 
     $formFactorExtension = $mainTemplate->detectFormfactorExtension();
     ?>


  .. php:method:: inc($file[, $additionalparams])

   :param string $file: the name of the template
   :param array $additionalparams: an array with additional variables which should be used for the included template
   :returns: returns content of included template as a string

   Includes another template. use <?php print_unescaped($this->inc('template')); ?> to do this. The included template has access to all parent template variables!

   **Example:**

   .. code-block:: php

     <div>
         <?php print_unescaped($this->inc('nav.inc', array('active' => 'nav_entry_1')); ?>
     </div>


  .. php:method:: printPage()

   :returns: true when there is content to print

   This function proceeds the template and prints its output.

   **Example:**

   .. code-block:: php

     <?php 
     $mainTemplate = new OC_Template('news', 'main', 'user'); 
     $mainTemplate->assign('test', array("test", "test2"));
     $mainTemplate->printPage();    
     ?>

  .. php:method:: printAdminPage($application, $name[, $parameters])

   :param string $application: The application we render the template for
   :param string $name: Name of the template
   :param array $parameters: Parameters for the template
   :returns: bool

   **Example:**

   .. code-block:: php

     <?php 
     // FIXME: provide an example please
     ?>

   Shortcut to print a simple page for admin


  .. php:method:: printGuestPage($application, $name[, $parameters])

   :param string $application: The application we render the template for
   :param string $name: Name of the template
   :param array $parameters: Parameters for the template
   :returns: bool

   **Example:**

   .. code-block:: php

     <?php 
     // FIXME: provide an example please
     ?>

   Shortcut to print a simple page for guests


  .. php:method:: printUserPage($application, $name[, $parameters])

   :param string $application: The application we render the template for
   :param string $name: Name of the template
   :param array $parameters: Parameters for the template
   :returns: bool

   Shortcut to print a simple page for users

   **Example:**

   .. code-block:: php

     <?php 
     // FIXME: provide an example please
     ?>



Template syntax
---------------
.. php:function::  html_select_options($options, $selected[, $params])

  :param array $options: an array of the form value => label
  :param string/array $selected: an array containing strings or a simple string which sets a value as selected
  :param array $params: optional parameters that are done in key => value
  :returns: the html as string of preset <option> tags

FIXME: explain parameters


.. php:function:: human_file_size($bytes)

  :param int $bytes: the bytes that we want to convert to a more readable format
  :returns: the human readable size as string

Turns bytes into human readable formats, for instance 1024 bytes get turned into 1kb, 1024*1024 bytes get turned into 1mb

.. code-block:: php

  <?php
  // this would print <li>2kB</li>
  ?>
  <li><?php p($this->human_file_size('2048')); ?></li>



.. php:function:: image_path($app, $image)

  :param string $app: the name of your app as a string. If the string is empty, ownCloud looks for the image in core
  :param array $image: the filename of the image
  :returns: the absolute URL to the image as a string

This function looks up images in several common directories and returns the full link to it. The following directories are being searched:

- /themes/$theme/apps/$app/img/$image
- /themes/$theme/$app/img/$image
- /$app/img/$image

When you pass an empty string for $app, the following directories will be searched:

- /themes/$theme/apps/$app/img/$image
- /themes/$theme/core/img/$image
- /core/img/$image

**Example:**

.. code-block:: php

  <img src="<?php print_unescaped(
    image_path('news', 'starred.svg');
  ); ?>" />



.. php:function:: link_to($app, $file, [$args])

  :param string $app: the name of your app as a string. If the string is empty, ownCloud asumes that the file is in /core/
  :param string $file: the relative path from your apps root to the file you want to access
  :param array $args: the GET parameters that you want set in the URL in form key => value. The value will be run through urlencode() 
  :returns: the absolute URL to the file 

This function is used to produce generate clean and absolute links to your files or pages. 

**Example:**

.. code-block:: php

  <?php 
  // this will produce the link: 
  // index.php/news/pages/weather.php?show=berlin
  ?>
  <ul>
    <li><a href="<?php 
            print_unescaped(
                link_to('news', 'pages/weather.php', array("show" => "berlin")); 
            );
         ?>">Show Weather for Berlin</a></li>
  </ul>



.. php:function:: mimetype_icon($mimetype)

  :param array $mimetype: the mimetype for which we want to look up the icon
  :returns: the absolute URL to the icon 

A shortcut for getting a mimetype icon.

**Example:**

.. code-block:: php

  <img src="<?php print_unescaped(
    mimetype_icon('application/xml');
  ); ?>" />



.. php:function:: p($data)

  :param $data: the variable/array/object that should be printed

.. versionadded:: 5.0

This is the print statement which prints out XSS escaped values. ownCloud does not allow the direct usage of echo or print but enforces wrapper functions to prevent unwanted XSS vulnerabilities. If you want to print unescaped data, look at print_unescaped

**Example:**

.. code-block:: php

  <?php $names = array("John", "Jakob", "Tom"); ?>
  <div>
    <ul>
      <?php foreach($names as $name){ ?>
        <li><?php p($name); ?></li>
      <?php } ?>
    </ul>
  </div>



.. php:function:: print_unescaped($data)

  :param $data: the variable/array/object that should be printed

.. versionadded:: 5.0

This function does not escape the content for XSS. This would typically be used to print HTML or JavaScript that is generated by the server and **checked for XSS** vulnerabilities.


**Example:**

.. code-block:: php

  <?php $html = "<div>Some HTML</div>"; ?>
  <div>
    <?php print_unescaped($html); ?>
  </div>



.. php:function::  relative_modified_date($timestamp)

  :param int $timestamp: the timestamp from whom we compute the time span until now
  :returns: a relative date as string

Instead of displaying a date, it is often better to give a relative date like: "2 days ago" or "3 hours ago". This function turns a timestamp into a relative date.

.. code-block:: php

  <?php
  // this would print <span>5 minutes ago</span>
  ?>
  <span><?php p(relative_modified_date('29393992912')); ?></span>


.. php:function::  simple_file_size($bytes)

  :param int $bytes: the bytes that we want to convert to a more readable format in megabytes
  :returns: the human readable size as string

A more simpler function that only turns bytes into megabytes. If its smaller than 0.1 megabytes, < 0.1 is being returned. If its bigger than 1000 megabytes, > 1000 is being returned.

.. code-block:: php

  <?php
  // this would print <li>&lt 0.1</li>
  ?>
  <li><?php p(simple_file_size('2048')); ?></li>

Further reading
---------------
- http://en.wikipedia.org/wiki/Cross-site_scripting
- https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
- https://www.owasp.org/index.php/Cross-site_Scripting_%28XSS%29
