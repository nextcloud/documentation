=========
Changelog
=========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Deprecations
------------

This is a deprecation roadmap which lists all current deprecation targets and will be updated from release to release. This lists the year when a specific method or class will be removed.

.. note:: Deprecations on interfaces also affect the implementing classes!

2018
^^^^

* **OCP\\App::setActiveNavigationEntry** has been deprecated in favour of **\\OCP\\INavigationManager**
* **OCP\\BackgroundJob::registerJob** has been deprecated in favour of **OCP\\BackgroundJob\\IJobList**
* **OCP\\Contacts** functions has been deprecated in favour of **\\OCP\\Contacts\\IManager**
* **OCP\\DB** functions have been deprecated in favour of the ones in **\\OCP\\IDBConnection**
* **OCP\\Files::tmpFile** has been deprecated in favour of **\\OCP\\ITempManager::getTemporaryFile**
* **OCP\\Files::tmpFolder** has been deprecated in favour of **\\OCP\\ITempManager::getTemporaryFolder**
* **\\OCP\\IServerContainer::getDb** has been deprecated in favour of **\\OCP\\IServerContainer::getDatabaseConnection**
* **\\OCP\\IServerContainer::getHTTPHelper** has been deprecated in favour of **\\OCP\\Http\\Client\\IClientService**
* Legacy applications not using the AppFramework are now likely to use the deprecated **OCP\\JSON** and **OCP\\Response** code:

  * **\\OCP\\JSON** has been completely deprecated in favour of the AppFramework. Developers shall use the AppFramework instead of using the legacy **OCP\\JSON** code. This allows testable controllers and is highly encouraged.
  * **\\OCP\\Response** has been completely deprecated in favour of the AppFramework. Developers shall use the AppFramework instead of using the legacy **OCP\\JSON** code. This allows testable controllers and is highly encouraged.

* Diverse **OCP\\Users** function got deprecated in favour of **OCP\\IUserManager**:

  * **OCP\\Users::getUsers** has been deprecated in favour of **OCP\\IUserManager::search**
  * **OCP\\Users::getDisplayName** has been deprecated in favour of **OCP\\IUserManager::getDisplayName**
  * **OCP\\Users::getDisplayNames** has been deprecated in favour of **OCP\\IUserManager::searchDisplayName**
  * **OCP\\Users::userExists** has been deprecated in favour of **OCP\\IUserManager::userExists**
* Various static **OCP\\Util** functions have been deprecated:

  * **OCP\\Util::linkToRoute** has been deprecated in favour of **\\OCP\\IURLGenerator::linkToRoute**
  * **OCP\\Util::linkTo** has been deprecated in favour of **\\OCP\\IURLGenerator::linkTo**
  * **OCP\\Util::imagePath** has been deprecated in favour of **\\OCP\\IURLGenerator::imagePath**
  * **OCP\\Util::isValidPath** has been deprecated in favour of **\\OCP\\IURLGenerator::imagePath**

* `OCP\\AppFramework\\IAppContainer <https://github.com/nextcloud/server/blob/stable9/lib/public/appframework/iappcontainer.php>`_: methods **getCoreApi** and **log**
* `OCP\\AppFramework\\IApi <https://github.com/nextcloud/server/blob/stable9/lib/public/appframework/iapi.php>`_: full class


2017
^^^^

* **OCP\\IDb**: This interface and the implementing classes will be removed in favor of **OCP\\IDbConnection**. Various layers in between have also been removed to be consistent with the PDO classes. This leads to the following changes:

 * Replace all calls on the db using **getInsertId** with **lastInsertId**
 * Replace all calls on the db using **prepareQuery** with **prepare**
 * The **__construct** method of **OCP\\AppFramework\\Db\\Mapper** no longer requires an instance of **OCP\\IDb** but an instance of **OCP\\IDbConnection**
 * The **execute** method on **OCP\\AppFramework\\Db\\Mapper** no longer returns an instance of **OC_DB_StatementWrapper** but an instance of **PDOStatement**

2016
^^^^

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
* `OCP\\AppFramework\\Controller <https://github.com/nextcloud/server/blob/stable9/lib/public/appframework/controller.php>`_: methods **params**, **getParams**, **method**, **getUploadedFile**, **env**, **cookie**, **render**

2015
^^^^

* `\\OC\\Preferences <https://github.com/nextcloud/server/commit/909a53e087b7815ba9cd814eb6c22845ef5b48c7>`_ and `\\OC_Preferences <https://github.com/nextcloud/server/commit/4df7c0a1ed52ed1922116686cb5ad8da2544c997>`_
