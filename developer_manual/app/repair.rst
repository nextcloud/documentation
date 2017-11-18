============
Repair Steps
============

Repair steps are methods which are executed by Nextcloud on certain
events which directly affect the app. You can use these repair steps to run
code when your app is installed, uninstalled, upgraded etc. It's called repair
steps because they are frequently used to fix things automatically.

.. note:: Don't use the ``install.php``, ``update.php`` and ``preupdate.php`` files anymore! This method is deprecated and is known to cause issues.


Creating a repair step
----------------------

A repair step is an implementation of the  ``OCP\Migration\IRepairStep`` interface.
By convention these classes are placed in the **lib/Migration** directory.
The following repairstep will log a message when executed.

.. code-block:: php

  <?php
  namespace OCA\MyApp\Migration;

  use OCP\Migration\IOutput;
  use OCP\Migration\IRepairStep;
  use OCP\ILogger;

  class MyRepairStep implements IRepairStep {

  	/** @var ILogger */
  	protected $logger;

  	public function __construct(ILogger $logger) {
  		$this->logger = $logger;
  	}

  	/**
  	 * Returns the step's name
  	 */
  	public function getName() {
  		return 'A demonstration repair step!';
  	}

  	/**
  	 * @param IOutput $output
  	 */
  	public function run(IOutput $output) {
  		$this->logger->warning("Hello world from MyRepairStep!", ["app" => "MyApp"]);
  	}
  }

Outputting information
^^^^^^^^^^^^^^^^^^^^^^

A repair step can generate information while running, using the
``OCP\Migration\IOutput`` parameter to the ``run`` method.
Using the ``info`` and ``warning`` methods a message can be shown in the console.
In order to show a progressbar, firstly call the ``startProgress`` method.
The maximum number of steps can be adjusted by passing it as argument to the
``startProgress`` method. After every step run the ``advance`` method. Once all steps are finished run the ``finishProgress``
method.

The following function will sleep for 10 seconds and show the progress:

.. code-block:: php

  <?php
  /**
   * @param IOutput $output
   */
  public function run(IOutput $output) {
  	$output->info("This step will take 10 seconds.");
  	$output->startProgress(10);
  	for ($i = 0; $i < 10; $i++) {
  		sleep(1);
  		$output->advance(1);
  	}
  	$output->finishProgress();
  }

Register a repair-step
----------------------

To register a repair-step in Nextcloud you have to define the repair-setp in the ``info.xml``
file. The following example registers a repair-step which will be executed after installation
of the app:

.. code-block:: xml

  <?xml version="1.0"?>
  <info xmlns:xsi= "http://www.w3.org/2001/XMLSchema-instance"
  	xsi:noNamespaceSchemaLocation="https://apps.nextcloud.com/schema/apps/info.xsd">
  	<id>myapp</id>
  	<name>My App</name>
  	<summary>A test app</summary>
  	...
  	<repair-steps>
  		<install>
  			<step>OCA\MyApp\Migration\MyRepairStep</step>
  		</install>
  	</repair-steps>
  </info>


Repair-step types
-----------------

The following repair steps are available:

* ``install`` This repair step will be executed when installing the app. This means it is executed every time the app is enabled (using the Web interface or the CLI).
* ``uninstall`` This repair step will be executed when uninstalling the app, and when disabling the app.
* ``pre-migration`` This repair step will be executed just before the database is migrated during an update of the app.
* ``post-migration`` This repair step will be executed just after the database is migrated during an update of the app.  This repair step will also be executed when running the ``occ maintenance:repair`` command
* ``live-migration`` This repair step will be scheduled to be run in the background (e.g. using cron), therefore it is unpredictable when it will run. If the job isn't required right after the update of the app and the job would take a long time this is the best choice.
