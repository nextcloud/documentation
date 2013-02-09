Categories API
==============

Introduction
------------

.. sectionauthor:: Thomas Tanghus <thomas@tanghus.net>

The Categories API is as the name says used for categorizing objects. The visual representation can be different for each app and is totally up to the developer/designer: you can add tags like for example used in `github issues <https://github.com/owncloud/core/issues/>`_ , you can show your objects in a (one-level) hierarchy or you can simply use comma-separated strings.

The API is mainly designed for objects using `vCard`_ or `iCalendar <https://en.wikipedia.org/wiki/ICalendar>`_ as storage, as they all have a **CATEGORIES** property from which the categories are extracted, and were they will be saved so that client apps like Apples `iCal <https://en.wikipedia.org/wiki/ICal>`_ and `KDEs Kontact <http://userbase.kde.org/Kontact>`_ can use them as well. Currently the API is used in the Calendar, Task and Contacts apps, plus recently the 3rd party Journal app.

Internally the categories and the object/category relations are stored using the category, the user ID, the object ID and a type identifier to be able uniquely identify where a category "belongs to". The types are similar to the types used in the :doc:`share-api` for example `contact`, `event` or `task`.

Besides being used for categories, the API also supports setting objects as favorites. Favorites are simply a separate category internally, but convenience methods for getting/setting objects as favorites are available.

Usage
-----

The API can be used both from PHP and via a simple Javascript object.

PHP
---

.. todo:: Provide an easier example with less text

As example I will use a very simplified version of how it is used in the Contacts app. The real implementation is optimized for speed and low memory consumption, but there's no need to show that here.

First check if any categories have been saved for `contact` objects, if not scan all vCards for categories:

.. todo:: use comments inside the php source to explain the functionality

.. code-block:: php

  <?php
  if(\OC_VCategories::isEmpty('contact')) {
    $categorymgr = new \OC_VCategories('contact');
    $cards = array();
    foreach(VCard::all() as $contact) {
        $cards[] = array($contact['id'], $contact['carddata']);
    }
    $categorymgr->rescan($cards, true);
  }
  ?>


Here we first create an instance of OC_VCategories and tell it to store categories identified by ``contact`` type. Then we fetch all the contacts and create and array holding arrays of id/carddata [1]_ pairs. The OC_VCategories object is then told to scan all the vCards ``CATEGORIES`` property and save the result when done. If it finds any categories it doesn't know already, they will be added to the database (category names are NOT case-sensitive). Additionally it will create relations between the category and the contact object to be used by the contacts app. The ``rescan`` method also takes a third boolean argument ``reset`` which will purge any categories and relations for the current user.

This piece of code will in most cases only run once i.e. when the user first opens the Contacts app after upgrade to ownCloud 5. Behind the scene any update or additions will scan for categories using the methods ``loadFromVObject(int $id, OC_VObject $vobject)`` which scans an already parsed VCALENDAR, VEVENT, VTODO, VJOURNAL or as in this example VCARD (if given a VCALENDAR the class will use the first found of either VEVENT, VTODO or VJOURNAL). Similarly when a contact is deleted the ``purgeObject($id)`` method will remove any category/object relations. When a user is deleted all entries for that user will automatically be purged from the database as well.

**Instantiation**

In the example above the most basic instantiation is shown. It assumes that the user is the currently logged in user, and has no default values. Most apps will want to provide some basic values to use if none are extracted or if the app doesn't use VEVENT, VTODO, VJOURNAL or VCARD as storage.
Default values can be given in the constructor:

.. code-block:: php

    <?php
    $defcategories = array('Friends', 'Family', 'Work', 'Other');
    $categorymgr = new \OC_VCategories('contact', null, $defcategories);
    ?>

The second argument being null will use the current user id. After instantiating this way the database will be pre-filled with the default categories for the current user, and any ``isEmpty()`` calls will of course return **false** ;)

For acting on user input the following methods, which should be mostly self-explanatory, are available:


.. php:class:: OC_VCategories

  .. php:method:: __construct()

     .. todo:: add constructor doc

  .. php:method:: add($name)

     :param string $name:
     :returns: the integer id of the new category or **false** if it already exists.


  .. php:method:: delete($names, array &$objects=null)

     :param string $names: deletes the categories in the array `$names` and any object/category/user relations saved.
     :param array $objects: If `$objects` is not null it is assumed to be an array of id/data pairs passed by reference.
     :returns: the integer id of the new category or **false** if it already exists.

     The data is parsed into an **OC_VObject** and if found the categories will be removed from the **CATEGORIES** property and the **OC_VObject** will be serialized back to a string again. It is up to the app to store the data afterwards.


.. todo:: use a proper rst syntax for class definitions

.. code-block:: php

    public function hasCategory($name); //boolean

    public function addToCategory($objid, $category, $type = null);
    public function removeFromCategory($objid, $category, $type = null);

`addToCategory()` creates an user/category/object relation. `$category` can be either an integer category id or a string with the category name. If `$type` is null the type provided in the constructor will be used.

.. todo:: use a proper rst syntax for class definitions

.. code-block:: php

    public function categories($format = null);

Per default this returns an array of the category names, but given the `$format` argument `OC_VCategories::FORMAT_MAP`, it will return an array of `array('id' => $id, 'name' => $name)` maps.

.. todo:: use a proper rst syntax for class definitions

.. code-block:: php

    public function idsForCategory($category);

Returns an array of integer object ids. `$category` can again be either the integer category id or a string with the name.

Favorites
---------
.. todo:: use a proper rst syntax for class definitions

.. code-block:: php

  <?php

    public function addToFavorites($objid, $type = null);
    public function removeFromFavorites($objid, $type = null);
    public function getFavorites($type = null);

Javascript
----------

.. todo:: needs to be written

.. [1] An example of a `vCard <https://en.wikipedia.org/wiki/Vcard#vCard_3.0>`_ version 3.0
