=========
Changelog
=========

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The following changes went into ownCloud 8.1:


Breaking changes
================
The following breaking changes usually do only affect applications which misuse existing API or do not follow best practises.

* The default Content-Security-Policy of AppFramework apps is now stricter but can be adjusted by developers. See https://github.com/owncloud/core/pull/13989
* Parameters passed to OC.generateUrl are now automatically encoded, this behaviour can be adjusted by developers. See https://github.com/owncloud/core/pull/14266
* Views constructed by OC\Files\View do not allow directory traversals anymore in the constructor. See https://github.com/owncloud/core/pull/14342
* The CSRF token may now contain not URL compatible characters (for example the plus sign: +), developers have to ensure that the CSRF token is encoded properly before using it in URIs.
* The default RNG now returns all valid base64 characters
* OC.msg escapes the message now by default (see https://github.com/owncloud/core/pull/14208)


Features
========
* There is a new :doc:`OCSResponse and OCSController <controllers>` which allows you to easily migrate OCS code to the App Framework. This was added purely for compatibility reasons and the preferred way of doing APIs is using a :doc:`api`
* You can now stream files in PHP by using the built in :doc:`StreamResponse <controllers>`.
* For more advanced usecases you can now implement the :doc:`CallbackResponse <controllers>` interface which allows your response to do its own response rendering
* Custom preview providers can now be implemented using ** OCP\IPreview::registerProvider**
* There is a mightier class for remote web service requests at **OCP\Http\Client** 
* **OCP\\IImage** allows now basic image manipulations such as resizing or rotating
* **OCP\\Mail** allows sending mails in an object-oriented way now
* **OCP\\IRequest** contains more methods now such as getting the request URI
* **OCP\\Encryption** allows writing custom encryption backends

Furthermore all public APIs have received a **@since** annotation allowing developers to see when a function has been introduced.

Deprecations
============
This is a deprecation roadmap which lists all current deprecation targets and will be updated from release to release. This lists the version when a specific method or class will be removed.

.. note:: Deprecations on interfaces also affect the implementing classes!

11.1
----
* **OCP\\App::setActiveNavigationEntry** has been deprecated in favour of (**\\OCP\\INavigationManager**)
* **OCP\\BackgroundJob::registerJob** has been deprecated in favour of **OCP\\BackgroundJob\\IJobList**
* **OCP\\Contacts** functions has been deprecated in favour of **\\OCP\\Contacts\\IManager** 
* **OCP\\DB** functions have been deprecated in favour of the ones in **\\OCP\\IDBConnection**
* **OCP\\Files::tmpFile** has been deprecated in favour of **\\OCP\\ITempManager::getTemporaryFile**
* **OCP\\Files::tmpFolder** has been deprecated in favour of **\\OCP\\ITempManager::getTemporaryFolder**
* **\\OCP\\IServerContainer::getDb** has been deprecated in favour of **\\OCP\\IServerContainer::getDatabaseConnection**
* **\\OCP\\IServerContainer::getHTTPHelper** has been deprecated in favour of **\\OCP\\Http\\Client\\IClientService**
* Legacy applications not using the AppFramework are now likely to use the deprecated **OCP\\JSON** and **OCP\\Response** code:

  * **\\OCP\\JSON** has been completely deprecated in favour of the AppFramework. Developers shall use the AppFramework instead of using the legacy **OCP\\JSON**code. This allows testable controllers and is highly encouraged.
  * **\\OCP\\Response** has been completely deprecated in favour of the AppFramework. Developers shall use the AppFramework instead of using the legacy **OCP\\JSON**code. This allows testable controllers and is highly encouraged.

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

10.0
----
* **OCP\\IDb**: This interface and the implementing classes will be removed in favor of **OCP\\IDbConnection**. Various layers in between have also been removed to be consistent with the PDO classes. This leads to the following changes:

 * Replace all calls on the db using **getInsertId** with **lastInsertId**
 * Replace all calls on the db using **prepareQuery** with **prepare**
 * The **__construct** method of **OCP\\AppFramework\\Db\\Mapper** no longer requires an instance of **OCP\\IDb** but an instance of **OCP\\IDbConnection**
 * The **execute** method on **OCP\\AppFramework\\Db\\Mapper** no longer returns an instance of **OC_DB_StatementWrapper** but an instance of **PDOStatement**

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

8.1
---
* `\\OC\\Preferences <https://github.com/owncloud/core/commit/909a53e087b7815ba9cd814eb6c22845ef5b48c7>`_ and `\\OC_Preferences <https://github.com/owncloud/core/commit/4df7c0a1ed52ed1922116686cb5ad8da2544c997>`_
