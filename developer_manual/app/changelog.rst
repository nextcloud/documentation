=========
Changelog
=========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The following changes went into ownCloud 8.1:


Breaking changes
================
None so far

Features
========
* There is a new :doc:`OCSResponse and OCSController <controllers>` which allows you to easily migrate OCS code to the App Framework. This was added purely for compatibility reasons and the preferred way of doing APIs is using a :doc:`api`
* You can now stream files in PHP by using the built in :doc:`StreamResponse <controllers>`.
* For more advanced usecases you can now implement the :doc:`CallbackResponse <controllers>` interface which allows your response to do its own response rendering


Deprecations
============
This is a deprecation roadmap which lists all current deprecation targets and will be updated from release to release:

.. note:: Deprecations on interfaces also affect the implementing classes!

10.0
----
* **OCP\\IDb**: This interface and the implementing classes will be removed in favor of **OCP\\IDbConnection**. Various layers in between have also been removed to be consistent with the PDO classes. This leads to the following changes:

 * Replace all calls on the db using **getInsertId** with **lastInsertId**
 * Replace all calls on the db using **prepareQuery** with **prepare**
 * The **__construct** method of **OCP\\AppFramework\\Db\\Mapper** no longer requires an instance of **OCP\\IDb** but an instance of **OCP\\IDbConnection**
 * The **execute** method on **OCP\\AppFramework\\Db\\Mapper** no longer returns an instance of **OC_DB_StatementWrapper** but an instance of **PDOStatement**, so the following methods called on the result will no longer work: **fetchRow**, **fetchOne**, **bindParam**. Simply migrate those to their PDO equivalents.

9.0
---
* The following methods have been moved into the **OCP\\Template::<method>** class instead of being namespaced directly:

 * **OCP\\image_path**
 * **OCP\\mimetype_icon**
 * **OCP\\preview_icon**
 * **OCP\\publicPreview_icon**
 * **OCP\\human_file_size**
 * **OCP\\relative_modified_date**
 * **OCP\\html_select_options**

* **OCP\\simple_file_size** has been deprecated in favour of **OCP\\Template::human_file_size**
* The **OCP\\PERMISSION_<permission>** and **OCP\\FILENAME_INVALID_CHARS** have been moved to **OCP\\Constants::<old name>**
* The **OC_GROUP_BACKEND_<method>** and **OC_USER_BACKEND_<method>** have been moved to **OC_Group_Backend::<method>** and **OC_User_Backend::<method>** respectively

8.3
---
* `OCP\\AppFramework\\IApi <https://github.com/owncloud/core/blob/d59c4e832fea87d03d199a3211186a47fd252c32/lib/public/appframework/iapi.php>`_: full class
* `OCP\\AppFramework\\IAppContainer <https://github.com/owncloud/core/blob/d59c4e832fea87d03d199a3211186a47fd252c32/lib/public/appframework/iappcontainer.php>`_: methods **getCoreApi** and **log**
* `OCP\\AppFramework\\Controller <https://github.com/owncloud/core/blob/d59c4e832fea87d03d199a3211186a47fd252c32/lib/public/appframework/controller.php>`_: methods **params**, **getParams**, **method**, **getUploadedFile**, **env**, **cookie**, **render**