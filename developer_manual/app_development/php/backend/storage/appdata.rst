=======
AppData
=======

.. sectionauthor:: Roeland Jago Douma <roeland@famdouma.nl>

Often an app wants to store data. However not all data that is stored belongs with the users files.
Often you just want a very simple storage to have some temp files. In order to facilitate this there
is the AppData folder that provides each app with a private simple filesystem.

Usage is almost trivial when your app is using the AppFramework.

.. code-block:: php

   <?php

   namespace OCA\MyApp\Controller\MyController;

   use OCP\AppFramework\Controller;
   use OCP\Files\IAppData;
   use OCP\IRequest;

   class MyController extends Controller {
       /** @var IAppData */
       private $appData;

       public function __construct($appName,
                                   IRequest $request,
                                   IAppData $appData) {
           parent::__construct($appName, $request);
           $this->appData = $appData;
       }
   }

This gives your controller access to the IAppData simple filesystem of your app.

The simple filesystem
---------------------

The `IAppData` uses the simple filesystem. This is a very simplified filesystem that will allow for easy
mapping to for example memcaches. The filesystem has three elements: `root`, `folder`, `file`.

The `root` can only contain folders. And each folder can only contain files. This is limited to keep
things simple and to allow easy mapping to other backends. For example a sysadmin might chose to map the
avatars to fast storage since they are used often.

Root
^^^^

The root element can only contain folders. There are 3 things you
can do on a root element:

* `getFolder`: get the folder you request
* `newFolder`: creates a new folder
* `getDirectoryListing`: lists all the folders in this root

Folder
^^^^^^

A folder has a bit more options.

* `getDirectoryListing`: lists all the files in the folder
* `fileExists`: check if a file exists
* `getFile`: get a file
* `newFile`: create a new file
* `delete`: delete a folder and its content
* `getName`: get the name of the folder

File
^^^^

* `getName`: get the name of the file
* `getSize`: get the size of the file
* `getETag`: get the ETag of the file
* `getMTime`: get the modification time of the file
* `getContent`: get the content of the file
* `putContent`: write content to the file
* `delete`: delete the file
* `getMimeType`: get the mimetype of the file
* `read`: get a resource for reading the file
* `write`: get a resource for writing to the file
