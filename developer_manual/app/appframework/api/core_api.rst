API
===


This is used to wrap the owncloud static api calls into an object to make the
code better abstractable for use in the dependency injection container
Should you find yourself in need for more methods, simply inherit from this
class and add your methods

.. php:namespace:: OCA\AppFramework\Core
.. php:class:: API




  .. php:method:: __construct($appName)

    :param string $appName: the name of your application


    constructor


  .. php:method:: getAppName()

    :returns string: the name of your application


    used to return the appname of the set application


  .. php:method:: addNavigationEntry($entry)

    :param array $entry: containing: id, name, order, icon and href key


    Creates a new navigation entry


  .. php:method:: getUserId()

    :returns string: the user id of the current user


    Gets the userid of the current user


  .. php:method:: activateNavigationEntry()



    Sets the current navigation entry to the currently running app


  .. php:method:: addScript($scriptName, $appName=null)

    :param string $scriptName: the name of the javascript in js/ without the suffix
    :param string $appName: the name of the app, defaults to the current one


    Adds a new javascript file


  .. php:method:: addStyle($styleName, $appName=null)

    :param string $styleName: the name of the css file in css/without the suffix
    :param string $appName: the name of the app, defaults to the current one


    Adds a new css file


  .. php:method:: add3rdPartyScript($name)

    :param string $name: the name of the file without the suffix


    shorthand for addScript for files in the 3rdparty directory


  .. php:method:: add3rdPartyStyle($name)

    :param string $name: the name of the file without the suffix


    shorthand for addStyle for files in the 3rdparty directory


  .. php:method:: getSystemValue($key)

    :param string $key: the key of the value, under which it was saved
    :returns string: the saved value


    Looks up a systemwide defined value


  .. php:method:: setSystemValue($key, $value)

    :param string $key: the key of the value, under which will be saved
    :param string $value: the value that should be stored


    Sets a new systemwide value


  .. php:method:: getAppValue($key, $appName=null)

    :param string $key: the key of the value, under which it was saved
    :param mixed $appName: 
    :returns string: the saved value


    Looks up an appwide defined value


  .. php:method:: setAppValue($key, $value, $appName=null)

    :param string $key: the key of the value, under which will be saved
    :param string $value: the value that should be stored
    :param mixed $appName: 


    Writes a new appwide value


  .. php:method:: setUserValue($key, $value, $userId=null)

    :param string $key: the key under which the value is being stored
    :param string $value: the value that you want to store
    :param string $userId: the userId of the user that we want to store the value under, defaults to the current one


    Shortcut for setting a user defined value


  .. php:method:: getUserValue($key, $userId=null)

    :param string $key: the key under which the value is being stored
    :param string $userId: the userId of the user that we want to store the value under, defaults to the current one


    Shortcut for getting a user defined value


  .. php:method:: getTrans()

    :returns \\OC_L10N: the translation object


    Returns the translation object


  .. php:method:: prepareQuery($sql, $limit=null, $offset=null)

    :param string $sql: the sql query with ? placeholder for params
    :param int $limit: the maximum number of rows
    :param int $offset: from which row we want to start
    :returns \\OCP\\DB: a query object


    Used to abstract the owncloud database access away


  .. php:method:: getInsertId($tableName)

    :param string $tableName: the name of the table where we inserted the item
    :returns int: the id of the inserted element


    Used to get the id of the just inserted element


  .. php:method:: linkToRoute($routeName, $arguments=array())

    :param string $routeName: the name of the route
    :param array $arguments: an array with arguments which will be filled into the url
    :returns string: the url


    Returns the URL for a route


  .. php:method:: linkTo($file, $appName=null)

    :param string $file: the name of the file
    :param string $appName: the name of the app, defaults to the current one


    Returns an URL for an image or file


  .. php:method:: imagePath($file, $appName=null)

    :param string $file: the name of the file
    :param string $appName: the name of the app, defaults to the current one


    Returns the link to an image, like link to but only with prepending img/


  .. php:method:: getAbsoluteURL($url)

    :param string $url: the url
    :returns string: the absolute url


    Makes an URL absolute


  .. php:method:: linkToAbsolute($file, $appName=null)

    :param string $file: the name of the file
    :param string $appName: the name of the app, defaults to the current one
    :returns string: the url


    .. warning:: **DEPRECATED**: replaced with linkToRoute()

    links to a file


  .. php:method:: isLoggedIn()

    :returns bool: true if logged in


    Checks if the current user is logged in


  .. php:method:: isAdminUser($userId)

    :param string $userId: the id of the user
    :returns bool: true if admin


    Checks if a user is an admin


  .. php:method:: isSubAdminUser($userId)

    :param string $userId: the id of the user
    :returns bool: true if subadmin


    Checks if a user is an subadmin


  .. php:method:: passesCSRFCheck()

    :returns bool: true if CSRF check passed


    Checks if the CSRF check was correct


  .. php:method:: isAppEnabled($appName)

    :param string $appName: the name of an app
    :returns bool: true if app is enabled


    Checks if an app is enabled


  .. php:method:: log($msg, $level=null)

    :param string $msg: the error message to be logged
    :param int $level: the error level


    Writes a function into the error log


  .. php:method:: getTemplate($templateName, $renderAs='user', $appName=null)

    :param string $templateName: the name of the template
    :param string $renderAs: how it should be rendered
    :param string $appName: the name of the app
    :returns \\OCP\\Template: a new template


    Returns a template


  .. php:method:: getLocalFilePath($path)

    :param string $path: path the path to the file on the oc filesystem
    :returns string: the filepath in the filesystem


    turns an owncloud path into a path on the filesystem


  .. php:method:: openEventSource()

    :returns \\OC_EventSource: a new open EventSource class


    used to return and open a new eventsource
