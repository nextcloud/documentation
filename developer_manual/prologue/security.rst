===================
Security guidelines
===================

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>, Lukas Reschke <lukas@statuscode.ch>

This guideline highlights some of the most common security problems and how to prevent them. Please review your app if it contains any of the following security holes.

.. note:: **Program defensively**: for instance always check for CSRF or escape strings, even if you do not need it. This prevents future problems where you might miss a change that leads to a security hole.

.. note:: All App Framework security features depend on the call of the controller through :php:meth:`OCA\\AppFramework\\App::main`. If the controller method is executed directly, no security checks are being performed!

SQL injection
-------------

`SQL Injection <https://en.wikipedia.org/wiki/SQL_injection>`_ occurs when SQL query strings are concatenated with variables.

To prevent this, always use prepared queries:

.. code-block:: php

  <?php
  $sql = 'SELECT * FROM `users` WHERE `id` = ?';
  $query = \OCP\DB::prepare($sql);
  $params = array(1);
  $result = $query->execute($params);

If the App Framework is used, write SQL queries like this in a class that extends the Mapper:

.. code-block:: php

  <?php
  // inside a child mapper class
  $sql = 'SELECT * FROM `users` WHERE `id` = ?';
  $params = array(1);
  $result = $this->execute($sql, $params);

Cross site scripting
--------------------

`Cross site scripting <https://en.wikipedia.org/wiki/Cross-site_scripting>`_ happens when user input is passed directly to templates. A potential attacker might be able to inject HTML/JavaScript into the page to steal the users session, log keyboard entries, even perform DDOS attacks on other websites or other malicious actions.

Despite the fact that Nextcloud uses Content-Security-Policy to prevent the execution of inline JavaScript code developers are still required to prevent XSS. CSP is just another layer of defense that is not implemented in all web browsers.

To prevent XSS in your app you have to sanitize the templates and all JavaScripts which performs a DOM manipulation.

Templates
^^^^^^^^^

Let's assume you use the following example in your application:

.. code-block:: php

  <?php
  echo $_GET['username'];

An attacker might now easily send the user a link to::

    app.php?username=<script src="attacker.tld"></script>

to overtake the user account. The same problem occurs when outputting content from the database or any other location that is writable by users.

Another attack vector that is often overlooked is XSS in **href** attributes. HTML allows to execute JavaScript in href attributes like this::

    <a href="javascript:alert('xss')">


To prevent XSS in your app, **never use echo, print() or <\%=** - use **p()** instead which will sanitize the input. Also **validate URLs to start with the expected protocol** (starts with http for instance)!

.. note:: Should you ever require to print something unescaped, double check if it is really needed. If there is no other way (e.g. when including of subtemplates) use `print_unescaped`  with care.

JavaScript
^^^^^^^^^^

Avoid manipulating the HTML directly via JavaScript, this often leads to XSS since people often forget to sanitize variables:

.. code-block:: js

  var html = '<li>' + username + '</li>"';

If you **really** want to use JavaScript for something like this use `escapeHTML` to sanitize the variables:

.. code-block:: js

  var html = '<li>' + escapeHTML(username) + '</li>';

An even better way to make your app safer is to use the jQuery built-in function **$.text()** instead of **$.html()**.

**DON'T**

.. code-block:: js

  messageTd.html(username);

**DO**

.. code-block:: js

  messageTd.text(username);

It may also be wise to choose a proper JavaScript framework like AngularJS which automatically  handles the JavaScript escaping for you.

Clickjacking
------------

`Clickjacking <https://en.wikipedia.org/wiki/Clickjacking>`_ tricks the user to click into an invisible iframe to perform an arbitrary action (e.g. delete a user account)

To prevent such attacks Nextcloud sends the `X-Frame-Options` header to all template responses. Don't remove this header if you don't really need it!

This is already built into Nextcloud in :php:class:`OC_Template`.

Code executions / file inclusions
---------------------------------

Code Execution means that an attacker is able to include an arbitrary PHP file. This PHP file runs with all the privileges granted to the normal application and can do an enormous amount of damage.

Code executions and file inclusions can be easily prevented by **never** allowing user-input to run through the following functions:

* **include()**
* **require()**
* **require_once()**
* **eval()**
* **fopen()**

.. note:: Also **never** allow the user to upload files into a folder which is reachable from the URL!

**DON'T**

.. code-block:: php

  <?php
  require("/includes/" . $_GET['file']);

.. note:: If you have to pass user input to a potentially dangerous function, double check to be sure that there is no other way. If it is not possible otherwise sanitize every user parameter and ask people to audit your sanitize function.

Directory traversal
-------------------

Very often developers forget about sanitizing the file path (removing all \\ and /), this allows an attacker to traverse through directories on the server which opens several potential attack vectors including privilege escalations, code executions or file disclosures.

**DON'T**

.. code-block:: php

  <?php
  $username = OC_User::getUser();
  fopen("/data/" . $username . "/" . $_GET['file'] . ".txt");

**DO**

.. code-block:: php

  <?php
  $username = OC_User::getUser();
  $file = str_replace(array('/', '\\'), '',  $_GET['file']);
  fopen("/data/" . $username . "/" . $file . ".txt");

.. note:: PHP also interprets the backslash (\\) in paths, don't forget to replace it too!


Shell injection
---------------

`Shell Injection <https://en.wikipedia.org/wiki/Code_injection#Shell_injection>`_ occurs if PHP code executes shell commands (e.g. running a latex compiler). Before doing this, check if there is a PHP library that already provides the needed functionality. If you really need to execute a command be aware that you have to escape every user parameter passed to one of these functions:

* **exec()**
* **shell_exec()**
* **passthru()**
* **proc_open()**
* **system()**
* **popen()**

.. note:: Please require/request additional programmers to audit your escape function.

Without escaping the user input this will allow an attacker to execute arbitrary shell commands on your server.

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

Auth bypass / privilege escalations
-----------------------------------

Auth bypass/privilege escalations happen when a user is able to perform unauthorized actions.

Nextcloud offers three simple checks:

* **OCP\\JSON::checkLoggedIn()**: Checks if the logged in user is logged in
* **OCP\\JSON::checkAdminUser()**: Checks if the logged in user has admin privileges
* **OCP\\JSON::checkSubAdminUser()**: Checks if the logged in user has group admin privileges

Using the App Framework, these checks are already automatically performed for each request and have to be explicitly turned off by using annotations above your controller method,  see :doc:`../basics/controllers`.

Additionally always check if the user has the right to perform that action. (e.g. a user should not be able to delete other users' bookmarks).

Sensitive data exposure
-----------------------

Always store user data or configuration files in safe locations, e.g. **nextcloud/data/** and not in the webroot where they can be accessed by anyone using a web browser.

Cross site request forgery
--------------------------

Using `CSRF <https://en.wikipedia.org/wiki/Cross-site_request_forgery>`_ one can trick a user into executing a request that they did not want to make. Thus every POST and GET request needs to be protected against it. The only places where no CSRF checks are needed are in the main template, which is rendering the application, or in externally callable interfaces.

.. note:: Submitting a form is also a POST/GET request!

To prevent CSRF in an app, be sure to call the following method at the top of all your files:

.. code-block:: php

  <?php
  OCP\JSON::callCheck();

If you are using the App Framework, every controller method is automatically checked for CSRF unless you explicitly exclude it by setting the ``#[NoCSRFRequired]`` attribute or ``@NoCSRFRequired`` annotation before the controller method, see :doc:`../basics/controllers`

Unvalidated redirects
---------------------

This is more of an annoyance than a critical security vulnerability since it may be used for social engineering or phishing.

Always validate the URL before redirecting if the requested URL is on the same domain or an allowed resource.

**DON'T**

.. code-block:: php

  <?php
  header('Location:'. $_GET['redirectURL']);

**DO**

.. code-block:: php

  <?php
  header('Location: https://example.com'. $_GET['redirectURL']);

Getting help
------------

If you need help to ensure that a function is secure please ask on our `forum <https://help.nextcloud.com>`_.
