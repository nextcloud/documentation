Hooks
=====

In ownCloud apps, function or methods (event handlers) which are used by the app and called by ownCloud core hooks, are generally stored in apps/appname/lib/hooks.php.Hooks are a way of implementing the `observer pattern`_, and are commonly used by web platform applications to provide clean interfaces to third party applications which need to modify core application functionality. In ownCloud, a ‘hook’ is a function who’s name can be used by developers of plug-ins to ensure that additional code is executed at a precise place during the execution of other parts of ownCloud code.For example: when an ownCloud user is deleted, the ownCloud core hook ‘post_deleteUser’ is executed. In the calendar app’s appinfo/app.php, this hook is connected to the app’s own event handler ‘deleteUser’ (‘user’ here refers to an ownCloud user; ‘deleteUser’ deletes all addressbooks for that a given ownCloud user). When post_deleteUser calls the calender app’s ‘deleteUser’  event handler, it supplies it with an argument, which is an array containing the user ID of the user that has just been deleted. This user ID is then used by the event handler to specify which address books to delete. There are three components to the use of hooks in this example:

#. The ownCloud core hook post_deleteUser, (see what arguments / data it will provide in lib/user.php, where it is defined)
#. The event handler deleteUser, (defined in apps/contacts/lib/hooks.php)
#. The connection of the hook to the event handler, in apps/contacts/appinfo/app.php

ownCloud uses the following hook terminology:

* Signal class  / emitter class: the class that contains the method which contains the creation of the hook (and a call to the emit() method) e.g. OC_User
* Signal  / signal name: the name of the hook, e.g. post_deleteUser
* Slot class: class housing the event handling method, e.g. OC_Contacts_Hooks
* Slot name: event handler method, e.g. deleteUser (function that deletes all contact address books for a user)

ownCloud core provides the following hooks:

File: apps/calendar/ajax/events.php, Class: OC_Calendar
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* Hook: getEvents

File: apps/calendar/index.php, Class: OC_Calendar
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* Hook: getSources

File: dav.php, Class: OC_DAV
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* Hook: initialize

File: lib/migrate.php, Class: OC_User
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* Hook: pre_createUser
* Hook: post_createUser

File: lib/filecache.php, Class: OC_Filesystem
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* Hook: post_write
* Hook: post_write
* Hook: post_delete
* Hook: post_write

File: lib/user.php, Class: OC_User
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* Hook: pre_createUser
* Hook: post_createUser
* Hook: pre_deleteUser
* Hook: post_deleteUser
* Hook: pre_login
* Hook: post_login
* Hook: logout
* Hook: pre_setPassword
* Hook: post_setPassword

File: lib/group.php, Class: OC_Group
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* Hook: pre_createGroup
* Hook: post_createGroup
* Hook: pre_deleteGroup
* Hook: post_deleteGroup
* Hook: pre_addToGroup
* Hook: post_addToGroup
* Hook: pre_removeFromGroup
* Hook: post_removeFromGroup

.. _observer pattern: https://en.wikipedia.org/wiki/Observer_pattern
