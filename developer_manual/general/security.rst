Security Guideline
==================

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>, Lukas Reschke <lukas@statuscode.ch>

This guideline highlights some of the most common security problems and how to prevent them. Please review your app if it contains any of the following security holes.

.. note:: Program defensively: for instance always check for CSRF or escape strings, even if you do not need it. This prevents future problems where you might miss a change that leads to a security hole.

.. note:: All App Framework security features depend on the call of the controller through :php:meth:`OCA\\AppFramework\\App::main`. If the controller method is executed directly, no security checks are being performed!

SQL Injection
-------------
`SQL Injection <http://en.wikipedia.org/wiki/SQL_injection>`_ occurs when SQL query strings are concatenated with variables. 

To prevent this, always use prepared queries:

.. code-block:: php

  <?php
  $sql = 'SELECT * FROM `users` WHERE `id` = ?';
  $query = \OCP\DB::prepare($sql);
  $params = array(1);
  $result = $query->execute($params);
  
If the App Framework is used, write SQL queries like this in the a class that extends the Mapper:

.. code-block:: php

  <?php
  // inside a child mapper class
  $sql = 'SELECT * FROM `users` WHERE `id` = ?';
  $params = array(1);
  $result = $this->execute($sql, $params);

Cross site scripting
--------------------

`Cross site scripting <http://en.wikipedia.org/wiki/Cross-site_scripting>`_ happens when you pass user input unsanitized to templates. A potential attacker might be able to inject some HTML/JavaScript into the page to steal the users session, log keyboard entries or even perform DDOS attacks on other websites or other malicious actions.

Despite of the fact that ownCloud uses Content-Security-Policy to prevent the execution of inline Javascript code developers are still required to prevent XSS. CSP is just another layer of defense that is not implemented in all web browsers.

To prevent XSS in your app you have to sanitize the templates and all javascripts which performs a DOM manipulation.

Templates
~~~~~~~~~

Let's assume you use the following example in your application:

.. code-block:: php

  <?php
  echo $_GET['username'];

An attacker might now easily send the user to app.php?username=<script src="attacker.tld"></script> to overtake the user account.

To prevent XSS in your app, **never use `echo` or its pendants** - use `p()` instead which will sanitize the input. 

.. note:: Should you ever require to print something unescaped, double check if it is really needed. If there is no other way (e.g. when including of subtemplates) use `print_unescaped`  with care.

If you use the App Framework with Twig templates everything is already escaped by default.

Javascript
~~~~~~~~~~

Avoid manipulating the HTML directly via JS, this often leads to XSS since developers seems always to forget to sanitize variables:

.. code-block:: javascript

    var html = '<li>' + username + '</li>"';

If you **really** want to use Javascript for something like this use `escapeHTML` to sanitize the variables:

.. code-block:: javascript

    var html = '<li>' + escapeHTML(username) + '</li>';

An even better way to make your app safer is to use the jQuery builtin function **$.text()**, so instead of using **$.html()**which often leads to XSS problems you should use **$.text()**

**DON'T**
.. code-block:: javascript

   messageTd.html(username);

**DO**
.. code-block:: javascript

   messageTd.text(username);

It may be wise to choose a proper JavaScript framework like AngularJS which automatically  handles the JavaScript escaping for you.

Clickjacking
------------

`Clickjacking <http://en.wikipedia.org/wiki/Clickjacking>`_ tricks the user to click into an invisible iframe to perform an arbitrary action (e.g. delete an user account)

To prevent such attacks ownCloud sends the `X-Frame-Options` header to all template responses. Don't remove this header if you don't really need it!

Code executions / File inclusions
---------------------------------
This is some of the worst things which can happen - this means that an attacker is able to include any arbitrary file on the server which often leads to a code execution where an attacker can execute arbitrary PHP code on the server.

Code executions and file inclusions can be easily prevented, in general **never** allow user input to the following functions:

* **include()**
* **require()**
* **require_once()**
* **eval()**
* **fopen()**

**DON'T**
.. code-block:: php

   <?php
       require("/includes/".$_GET['file];);

.. note:: If you have to pass user input to a potential dangerous, double check to be sure that there is no other way. If it is not possible otherwise sanitize every user parameter and ask people to audit your sanitize function.

Shell Injections
----------------

`Shell Injection <http://en.wikipedia.org/wiki/Code_injection#Shell_injection>`_ occurs if PHP code executes shell commands (e.g. running a latex compiler). Before doing this, check if there is a PHP library that already provides the needed functionality. If you really need to execute a command be aware that you have to escape every user parameter passed to one of these functions:

* **exec()**
* **shell_exec()**
* **passthru()**
* **proc_open()**
* **system()**
* **popen()**

.. note:: Please require/request additional programmers to audit your escape function.

Without escaping the user input this will allow an attacker to execute arbitary shell commands on your server.

PHP offers the following functions to escape user input:

* **escapeshellarg()**: Escape a string to be used as a shell argument
* **escapeshellcmd()**: Escape shell metacharacters

**DON'T**
.. code-block:: php

   <?php
   system('ls '.$_GET['dir']);

**DO**
.. code-block:: php

   <?php
   system('ls '.escapeshellarg($_GET['dir']));

Auth bypasses / Privilege escalations
-------------------------------------

Auth bypasses or privilege escalations happens when a not authorized user is able to perform actions which they should be not able to.

ownCloud offers three simple checks:
* **OCP\JSON::checkLoggedIn()**: Checks if the logged in user is logged in
* **OCP\JSON::checkAdminUser()**: Checks if the logged in user has admin privileges
* **OCP\JSON::checkSubAdminUser()**: Checks if the logged in user has group admin privileges

Using the App Framework, these checks are already automatically performed for each request and have to be explicitely turned off by using annotations above your controller method,  see :doc:`../app/controllers`.

Additionally always check if the user has the right to perform that action. (e.g. an user should not be able to delete other users bookmarks).

Sensitive data exposure
-----------------------

Always store user data or configuration files in safe locations, e.g. **owncloud/data/** and not in the webroot where they can be accessed by pretty anyone being able to use a webbrowser.

Cross site request forgery
--------------------------
Using `CSRF <http://en.wikipedia.org/wiki/Cross-site_request_forgery>`_ one can trick a user into executing a request that he did not want to make. Thus every POST and GET need to be protected against it (submitting a form is also a POST/GET request). The only place where no CSRF checks are needed is in the main template which is rendering the application.

To prevent CSRF in an app, be sure to call the following method at the top of all your files:

.. code-block:: php

  <?php
  
  OCP\JSON::callCheck();

If you are using the App Framework, every controller method is automatically checked for CSRF unless you explicitely exclude it by setting the @CSRFExemption annotation before the controller method, see :doc:`../app/controllers`

Unvalidated redirects
---------------------

This is more or less an annoyance than an critical security vulnerability since it may be used for social engineering or phising.

Always validate before redirecting an user if the requested URL is on the same domain or an allowed ressource.

**DON'T**
.. code-block:: php

   <?php
   header('Location:'. $_GET['redirectURL']);

**DO**
.. code-block:: php

   <?php
   header('Location: http://www.example.com'. $_GET['redirectURL']);

Get help
--------
If you need help to ensure that a function is secure please ask on our `mailing list <https://mail.kde.org/mailman/listinfo/owncloud>`_ or on our IRC channel #owncloud-dev on Freenode.
