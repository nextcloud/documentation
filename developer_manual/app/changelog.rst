=========
Changelog
=========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The following changes went into ownCloud 8:


Breaking changes
================

* Setting session variables inside a controller requires the **@UseSession** annotation, otherwise the session will be closed

Deprecations
============

.. note:: Deprecations on interfaces also affect the implementing classes!

* `OCP\\AppFramework\\IApi <https://github.com/owncloud/core/blob/d59c4e832fea87d03d199a3211186a47fd252c32/lib/public/appframework/iapi.php>`_: full class. Removal planned in **8.3**
* `OCP\\AppFramework\\IAppContainer <https://github.com/owncloud/core/blob/d59c4e832fea87d03d199a3211186a47fd252c32/lib/public/appframework/iappcontainer.php>`_: methods **getCoreApi** and **log**. Removal planned in **8.3**
* `OCP\\AppFramework\\Controller <https://github.com/owncloud/core/blob/d59c4e832fea87d03d199a3211186a47fd252c32/lib/public/appframework/controller.php>`_: methods **params**, **getParams**, **method**, **getUploadedFile**, **env**, **cookie**, **render**. Removal planned in **8.3**

.. note:: Deprecations of constants and methods with namespaces!

* The following methods have been moved into the **OCP\\Template::<method>** class instead of being namespaced directly, Removal planned in **9.0**:

 * **OCP\\image_path**
 * **OCP\\mimetype_icon**
 * **OCP\\preview_icon**
 * **OCP\\publicPreview_icon**
 * **OCP\\human_file_size**
 * **OCP\\relative_modified_date**
 * **OCP\\html_select_options**

* **OCP\\simple_file_size** has been deprecated in favour of **OCP\\Template::human_file_size**. Removal planned in **9.0**
* The **OCP\\PERMISSION_<permission>** and **OCP\\FILENAME_INVALID_CHARS** have been moved to **OCP\\Constants::<old name>**. Removal planned in **9.0**
* The **OC_GROUP_BACKEND_<method>** and **OC_USER_BACKEND_<method>** have been moved to **OC_Group_Backend::<method>** and **OC_User_Backend::<method>** respectively. Removal planned in **9.0**

Features
========

* The :doc:`info.xml <info>` file in **appinfo/info.xml** now supports library, command, php and database dependencies that are checked before app installation
* Various other tags for :doc:`info.xml <info>` have been added that are related to the app store
* :doc:`Routes <routes>` received the **defaults** parameter to set route variable defaults when not given
* :doc:`Routes <routes>` received the **postfix** parameter to allow multiple urls pointing at the same resource
* :doc:`Menu buttons <css>` can now be added easily for navigation entries
* **OCP\\AppFramework\\DataResponse** can now be used to wrap data and set Http error codes when using responders
* :doc:`Navigation entry undo and edit styles <css>` have been added
* **OCP\\AppFramework\\HttpResponse** now supports setting cookies
* A :doc:`container <container>` is now optional
* The :doc:`container <container>` can now automatically resolve and build classes based on type hints and variable naming conventions
* :doc:`Routes <routes>` can now be returned as an array in **appinfo/routes.php** if the **<namespace>** tag is set in **appinfo/info.xml**. The :doc:`container <container>` must either be omitted or available under **appinfo/application.php** and named **OCA\\YourApp\\YourNamespace\\AppInfo\\Application**
* **vendor_script** and **vendor_style** :doc:`template functions <templates>` have been added to load styles and scripts from your **vendor** folder
* The documentation now features an :doc:`app tutorial <tutorial>`
