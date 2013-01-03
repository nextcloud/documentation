.. _getting_started:

Getting Started with App Development
====================================

Before you start, please check if there already is a similar app you could
contribute to. `On our planning page`_ there are also some app ideas. Also, feel
free to communicate your idea and plans to the `mailing list`_ so other
contributors might join in.

We will use the contacts app as an example, you find it under ``apps/contacts``.

Folder Structure
----------------

* ajax/
* appinfo/
* css/
* img/
* js/
* l10n/
* lib/
* templates/

As you can imagine, templates belong in the template directory, css files in the
css directory, images in the img directory and javascript files in the js
directory. Renaming these directories is a really bad idea because functions
like ``OC_Helper::linkTo`` or ``OC_Helper::imagePath`` will not work then.
The appinfo directory provides everything ownCloud needs to get the app working.

The most important file is ``app.php``. ownCloud will call this file everytime
it runs, so this is the place where you can register your navigation entries or
connect signals and slots. More on this later. The ``l10n`` folder will contain
the translations. As soon as the translation detects a ``l10n`` folder it knows
that this program is translatable. All PHP scripts that are used to answer AJAX
requests are located in AJAX. This keeps the root folder clean. Note that
ownCloud does not force you to use this folder but it is recommended to use
it. If you write a library for your app you can put it into lib. As with the
ajax folder this is not a must, but it is recommended.

Folders in Detail
-----------------

The Model: lib/
~~~~~~~~~~~~~~~

ownCloud uses the `MVC_` (Model-View-Controller) principle. The libraries
represent the model. Basically all data should be handled here so the PHP files
the user calls only interact with the library. If you have a look at the lib
folder in contacts, you will see three files: ``addressbook.php``, ``hooks.php``
and ``connector_sabre.php.addressbook.php`` contains all methods that are
required for handling addresses. We mostly use the classes as namespaces and
write static functions, "real" OOP is only used if it is useful. All functions
that are called by hooks are in ``hooks.php``. To use the CardDAV capabilities
of SabreDAV we have the library ``OC_Connector_Sabre_CardDAV`` in
``connector_sabre.php``. This file is very small and delegates most work to
``OC_Contacts_Addressbook`` in ``addressbook.php``. This way you only have one
file with all SQL queries.

.. _MVC: http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller

The View: templates/
~~~~~~~~~~~~~~~~~~~~

ownCloud has its own template system. The templates are php files that are
included by ``OC_Template``. Having a look at two files basically shows you
everything you need to know. The variables are assigned by using
``$tmpl->assign(‘name’,'value’);``, have a look at the end of /index.php to see
how it works.

The Controllers
---------------

In contacts, you find the controllers in the root directory and in ``ajax/``.
Controllers are meant to be lean.

JavaScript
----------

ownCloud uses the jQuery_ library. In addtion, you can add JavaScript to your
pages using::

  OC_Util::addScript(‘[app name]‘, ‘[script name]‘);

Scripts can be added this way in either ``appinfo/app.php`` or in your app’s
individual PHP scripts.

Telling ownCloud about Your App
-------------------------------

In appinfo are three files. Each app must have ``app.php`` and ``info.xml``,
``database.xml`` is only needed when the app creates its own ``tables.app.php``
is called by ownCloud each time it runs. Let us examine this file line by line.

.. code-block:: php
  
  OC::$CLASSPATH['OC_Contacts_Addressbook'] = 'apps/contacts/lib/addressbook.php';
  OC::$CLASSPATH['OC_Contacts_Hooks'] = 'apps/contacts/lib/hooks.php';
  OC::$CLASSPATH['OC_Connector_Sabre_CardDAV'] = 'apps/contacts/lib/connector_sabre.php';

This adds some entries to the ``OC::$CLASSPATH``. This helps the ownCloud
autoload function to load classes that are not in ``/lib``. The cool thing about
this is that you do not need to include anything else than ``/lib/base.php``.

.. code-block:: php
  
  OC_HOOK::connect('OC_User', 'post_createUser', 'OC_Contacts_Hooks', 'deleteUser');

We do not need addressbooks of deleted people. But how do we know when a user is
being deleted? For this, we use hooks. As soon as someone deletes a user the
``OC_User`` class emits the signal post_createUser. We use this signal and
connect it with the slot deleteUser in the class ``OC_Contact_Hooks``. For more
details, have a look at the documentation of ``OC_Hook``.

.. code-block:: php
  
  OC_App::register( array(
    'order' => 10,
    'id' => 'contacts',
    'name' => 'Contacts' ));

Registers the app in ownCloud.

.. code-block:: php
  
  OC_App::addNavigationEntry( array(
    'id' => 'contacts_index',
    'order' => 10,
    'href' => OC_Helper::linkTo( 'contacts', 'index.php' ),
    'icon' => OC_Helper::imagePath( 'contacts', 'icon.png' ),
    'name' => 'Contacts' ));

This adds the entry to the navigation. info.xml is self-explanatory.
database.xml describes the database as required by MDB2. Note that the database
name is *dbname* and that each table name needs a *dbprefix* in front of it.

Starting Your First App
-----------------------

A template for writing new apps can be found here:
https://github.com/owncloud/apps/tree/master/apptemplate

Publishing Your Apps
--------------------

You can publish your apps at the `apps.owncloud.com`_. People with an
unrestricted ownCloud installation will then be able to directly download and
install your app from the admin interface.

.. _jQuery: http://jquery.com
.. _apps.owncloud.com: http://apps.owncloud.com
.. _On our planning page: http://gitorious.org/owncloud/pages/Home
.. _mailing list: http://mail.kde.org/mailman/listinfo/owncloud
