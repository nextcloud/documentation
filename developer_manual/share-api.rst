Share API
=========

**Warning: The Share API is still under heavy development and testing. Report issues to Michael Gapczynski.**

The Share API was introduced in ownCloud 5 as a public API for apps to share content. It is a revision of the original file sharing app with enhancements to increase stability, reduce conflicts, and operate in a generic fashion. At this time it is possible to share content with local ownCloud users, groups, contacts, and email via link. This document is a guide for using the Share API in apps. The Share API is made up of a public class OCP\Share in ``/lib/public/share.php``, an AJAX file ``/core/ajax/share.php``, and a JavaScript file ``/core/js/share.js``. Javadoc style documentation is included in OCP\Share. 

Share backends
--------------

The share backends represent a shared item type and are responsible for communicating directly with the Share API. There are 3 interfaces that can be implemented from based on the type of shared item. Apps create a class that implements one of the below interfaces and registers it with the Share API. Item source is a unique identifier of an item to be stored in the database by the Share API. The backend needs to be able to translate the item source back into the original item. It is recommended that the item source is the id of the item in the app’s own database.

OCP\Share_Backend
~~~~~~~~~~~~~~~~~

The base interface for shared items. The other interfaces extend OCP\Share_Backend.

* isValidSource($itemSource, $uidOwner)
* generateTarget($itemSource, $shareWith, $exclude = null)
* formatItems($items, $format, $parameters = null)


**isValidSource($itemSource, $uidOwner)** – Return true if the ``$itemSource`` is found and belongs to the owner, otherwise false. This function should not check for shared items, the Share API automatically recognizes a reshare and does not call isValidSource(). If false, the Share API will cancel sharing the item.

**generateTarget($itemSource, $shareWith, $exclude = null)** – Return a unique name for the $itemSource that can be used as a target. This is the name of the item that will be displayed for the person. The Share API will call this function again if the target already exists for the person as a shared item. For the second call, the ``$exclude`` argument will be an array with the conflicting target and similar targets that can’t be used as a target. The ``$shareWith`` argument can be false if generating a target for a private link or group. In this case, the function should return the default target.

**formatItems($items, $format, $parameters = null)** – Return the items in a format that is customary to the app. The Share API calls this function when a backend specific format is requested in one of the functions used for retrieving shared items. The return of this function is completely up to the backend, but the name of the items needs to be overridden by the target values. The desired implementation is to keep logic inside the backend and use array_merge() to merge shared items with normal items in the app.

OCP\Share_Backend_File_Dependent
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The interface for shared items that are depedent on a file e.g. a song or photo.

* getFilePath($itemSource, $uidOwner)
* Extends OCP\Share_Backend

**getFilePath($itemSource, $uidOwner)** – Return the file path if the item source is found and belongs to the owner, otherwise false.

OCP\Share_Backend_Collection
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The interface for shared items that are collections of another shared item e.g. a folder or addressbook.

* getChildren($itemSource)
* Extends OCP\Share_Backend

**getChildren($itemSource)** – Return a 2-dimensional array of the children items in the item source collection. Each child should be represented in the array as an array with the keys source and target, with their corresponding values. The children are passed to the backend that represents their item type and therefore should be able to be interpreted by that backend.

Register a backend with the Share API in ``appinfo/app.php``:

.. code-block:: php

  OCP\Share::registerBackend('contact', 'OC_Share_Backend_Contact');

Register a file dependent backend by specifying file extensions within an array in the fourth parameter:

.. code-block:: php

  OCP\Share::registerBackend('photo', 'OC_Share_Backend_Photo', null, array('gif', 'jpeg', 'jpg', 'png'));

Register a collection backend by specifying the children item in the third parameter:

.. code-block:: php

  OCP\Share::registerBackend('addressbook', 'OC_Share_Backend_Addressbook', 'contact');

Apps should not make any explicit calls to a share backend.

Sharing dropdown
----------------

The sharing dropdown is the user interface for sharing content. It handles sharing, unsharing, and setting permissions. Attach the sharing dropdown to the app user interface using an anchor tag:

.. code-block:: php

  <a class="share" data-item-type="addressbook" data-item="<?php echo $addressbook['id'] ?>" title="<?php echo $l->t("Share"); ?>" />

Specify the item type with ``data-item-type`` and the item source with ``data-item``. Shared items that don’t offer private link support should set ``data-private-link`` to false. At this time any shared item that isn’t file dependent is not supported for private links.

Retrieving shared items
-----------------------

Items shared with the current user and shared items owned by the current user can be retrieved using the following public functions:

Get the items of item type shared with the current user:

.. code-block:: php

  OCP\Share::getItemsSharedWith('addressbook');

Get the item of item type shared with the current user:

.. code-block:: php

  OCP\Share::getItemSharedWith('addressbook', "Michael's Addressbook");

Get the item of item type shared with the current user by item source:

.. code-block:: php

  OCP\Share::getItemSharedWith('addressbook', 1);

Get the shared items of item type owned by the current user:

.. code-block:: php

  OCP\Share::getItemsShared('addressbook');

Get the shared item of item type owned by the current user:

.. code-block:: php

  OCP\Share::getItemsShared('addressbook', 1);

All of the above functions allow you to pass a ``$format`` and an additional ``$parameters`` argument for formatting the items. The ``$format`` argument should be an integer defined as a constant in the backend. There are no restrictions on what the ``$parameters`` argument is. The handling of the function returns will be passed to the formatItems() function in the backend, along with the ``$format`` and ``$parameters`` arguments. Passing a format is useful for keeping the logic in the backend and quickly integrating shared items into the existing app:

.. code-block:: php

  $addressbooks = array_merge($addressbooks, OCP\Share::getItemsSharedWith('addressbook', OC_Share_Backend_Addressbook::FORMAT_ADDRESSBOOKS));

Collections of item types can be included when retrieving shared items. Setting ``$includeCollections`` to true will also return the children of collections of the item type. If the app requires a different format for the item type and the collection, separate calls should be made instead.

Handling permissions
--------------------

The Share API is capable of storing permissions associated with an item and the shared person. The permission system is CRUDS (create, read, update, delete, and share) and is an extension of the CRUD model. It is the app’s responsibility to handle permission checks and not the Share API. The Share API will ensure that permissions do not exceed those assigned to the original person for reshares. The CRUDS permissions are implemented as constants in the Share API.

* OCP\Share::PERMISSION_CREATE
* OCP\Share::PERMISSION_READ
* OCP\Share::PERMISSION_UPDATE
* OCP\Share::PERMISSION_DELETE
* OCP\Share::PERMISSION_SHARE

Apps should check if permissions are granted when a user with access to a shared item attempts to manipulate the item. Check granted permissions using bitwise operators:

.. code-block:: php

  if ($permissions & OCP\Share::PERMISSION_UPDATE)
