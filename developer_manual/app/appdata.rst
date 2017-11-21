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
