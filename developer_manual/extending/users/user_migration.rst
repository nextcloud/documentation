==============
User migration
==============

The `User migration app <https://apps.nextcloud.com/apps/user_migration>`_ may
be installed to allow migration of user data.

App developers can integrate into User migration and provide ways to export
and import the app data of a user.

Register a migrator
-------------------

A migrator is represented by a class implementing the
``OCP\\UserMigration\\IMigrator`` interface. This class is instantiated
whenever a user export or import begins.

.. code-block:: php

  <?php

  declare(strict_types=1);

  namespace OCA\MyApp\UserMigration;

  use OCA\MyApp\AppInfo\Application;
  use OCA\MyApp\IMyAppManager;
  use OCP\IL10N;
  use OCP\IUser;
  use OCP\UserMigration\IExportDestination;
  use OCP\UserMigration\IImportSource;
  use OCP\UserMigration\IMigrator;
  use OCP\UserMigration\ISizeEstimationMigrator;
  use OCP\UserMigration\TMigratorBasicVersionHandling;
  use OCP\UserMigration\UserMigrationException;
  use Symfony\Component\Console\Output\OutputInterface;
  use Throwable;

  class MyAppMigrator implements IMigrator, ISizeEstimationMigrator {
    use TMigratorBasicVersionHandling;

    private IMyAppManager $myAppManager;

    private IL10N $l10n;

    private const PATH_ROOT = Application::APP_ID . '/';

    private const PATH_MYAPP_FILE = MyAppMigrator::PATH_ROOT . 'myapp.json';

    public function __construct(
      IMyAppManager $myAppManager,
      IL10N $l10n
    ) {
      $this->myAppManager = $myAppManager;
      $this->l10n = $l10n;
    }

    /**
     * Returns an estimate of the exported data size in KiB.
     * Should be fast, favor performance over accuracy.
     *
     * @since 25.0.0
     * @since 27.0.0 return value may overflow from int to float
     */
    public function getEstimatedExportSize(IUser $user): int|float {
      $size = 100; // 100KiB for user data JSON
      return $size;
    }

    /**
     * Export user data
     *
     * @throws UserMigrationException
     * @since 24.0.0
     */
    public function export(IUser $user, IExportDestination $exportDestination, OutputInterface $output): void {
      $output->writeln('Exporting myapp information in ' . MyAppMigrator::PATH_MYAPP_FILE . '…');

      try {
        $data = $this->myAppManager->getUserData($user);
        $exportDestination->addFileContents(MyAppMigrator::PATH_MYAPP_FILE, json_encode($data));
      } catch (Throwable $e) {
        throw new UserMigrationException('Could not export myapp information', 0, $e);
      }
    }

    /**
     * Import user data
     *
     * @throws UserMigrationException
     * @since 24.0.0
     */
    public function import(IUser $user, IImportSource $importSource, OutputInterface $output): void {
      if ($importSource->getMigratorVersion($this->getId()) === null) {
        $output->writeln('No version for ' . static::class . ', skipping import…');
        return;
      }

      $output->writeln('Importing myapp information from ' . MyAppMigrator::PATH_MYAPP_FILE . '…');

      $data = json_decode($importSource->getFileContents(MyAppMigrator::PATH_MYAPP_FILE), true, 512, JSON_THROW_ON_ERROR);

      try {
        $this->myAppManager->setUserData($user, $data);
      } catch (Throwable $e) {
        throw new UserMigrationException('Could not import myapp information', 0, $e);
      }
    }

    /**
      * Returns the unique ID
      *
      * @since 24.0.0
      */
    public function getId(): string {
      return 'myapp';
    }

    /**
      * Returns the display name
      *
      * @since 24.0.0
      */
    public function getDisplayName(): string {
      return $this->l10n->t('My App');
    }

    /**
      * Returns the description
      *
      * @since 24.0.0
      */
    public function getDescription(): string {
      return $this->l10n->t('My App information');
    }
  }

The ``MyAppMigrator`` class needs to be registered during the :ref:`app bootstrap<Bootstrapping>`.

.. code-block:: php

  <?php

  declare(strict_types=1);

  namespace OCA\MyApp\AppInfo;

  use OCA\MyApp\UserMigration\MyAppMigrator;
  use OCP\AppFramework\App;
  use OCP\AppFramework\Bootstrap\IBootContext;
  use OCP\AppFramework\Bootstrap\IBootstrap;
  use OCP\AppFramework\Bootstrap\IRegistrationContext;

  class Application extends App implements IBootstrap {
    public const APP_ID = 'myapp';

    public function __construct(array $urlParams = []) {
        parent::__construct(self::APP_ID, $urlParams);
    }

    public function register(IRegistrationContext $context): void {
        $context->registerUserMigrator(MyAppMigrator::class);
    }

    public function boot(IBootContext $context): void {
    }
  }
