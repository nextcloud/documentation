========
Settings
========

.. sectionauthor:: Arthur Schiwon <blizzz@arthur-schiwon.de>

An app can register both admin settings as well as personal settings.

Admin
-----

For Nextcloud 10 the admin settings page got reworked. It is not a long list
anymore, but divided into sections, where related settings forms are grouped.
For example, in the **Sharing** section are only settings (built-in and of apps)
related to sharing.

Settings form
-------------

For the settings form, three things are necessary:

1. A class implementing ``\OCP\Settings\ISettings``
2. A template
3. The implementing class specified in the app's info.xml

Below is an example for an implementor of the ISettings interface. It is based
on the survey_client solution.

.. code-block:: php

    <?php
    namespace OCA\YourAppNamespace\Settings;

    use OCA\YourAppNamespace\Collector;
    use OCP\AppFramework\Http\TemplateResponse;
    use OCP\BackgroundJob\IJobList;
    use OCP\IConfig;
    use OCP\IDateTimeFormatter;
    use OCP\IL10N;
    use OCP\Settings\ISettings;

    class AdminSettings implements ISettings {

            /** @var Collector */
            private $collector;

            /** @var IConfig */
            private $config;

            /** @var IL10N */
            private $l;

            /** @var IDateTimeFormatter */
            private $dateTimeFormatter;

            /** @var IJobList */
            private $jobList;

            /**
             * Admin constructor.
             *
             * @param Collector $collector
             * @param IConfig $config
             * @param IL10N $l
             * @param IDateTimeFormatter $dateTimeFormatter
             * @param IJobList $jobList
             */
            public function __construct(Collector $collector,
                                                                    IConfig $config,
                                                                    IL10N $l,
                                                                    IDateTimeFormatter $dateTimeFormatter,
                                                                    IJobList $jobList
            ) {
                    $this->collector = $collector;
                    $this->config = $config;
                    $this->l = $l;
                    $this->dateTimeFormatter = $dateTimeFormatter;
                    $this->jobList = $jobList;
            }

            /**
             * @return TemplateResponse
             */
            public function getForm() {

                    $lastSentReportTime = (int) $this->config->getAppValue('survey_client', 'last_sent', 0);
                    if ($lastSentReportTime === 0) {
                            $lastSentReportDate = $this->l->t('Never');
                    } else {
                            $lastSentReportDate = $this->dateTimeFormatter->formatDate($lastSentReportTime);
                    }

                    $lastReport = $this->config->getAppValue('survey_client', 'last_report', '');
                    if ($lastReport !== '') {
                            $lastReport = json_encode(json_decode($lastReport, true), JSON_PRETTY_PRINT);
                    }

                    $parameters = [
                            'is_enabled' => $this->jobList->has('OCA\Survey_Client\BackgroundJobs\MonthlyReport', null),
                            'last_sent' => $lastSentReportDate,
                            'last_report' => $lastReport,
                            'categories' => $this->collector->getCategories()
                    ];

                    return new TemplateResponse('yourappid', 'admin', $parameters);
            }

            /**
             * @return string the section ID, e.g. 'sharing'
             */
            public function getSection() {
                    return 'survey_client';
            }

            /**
             * @return int whether the form should be rather on the top or bottom of
             * the admin section. The forms are arranged in ascending order of the
             * priority values. It is required to return a value between 0 and 100.
             */
            public function getPriority() {
                    return 50;
            }

    }

The parameters of the constructor will be resolved and an instance created
automatically on demand, so that the developer does not need to take care of it.

``getSection`` is supposed to return the section ID of the desired admin section.
Currently, built-in values are ``server``, ``sharing``, ``encryption``,
``logging``, ``additional`` and ``tips-tricks``. Apps can register sections
of their own (see below), and also register into sections of other apps.

``getPriority`` is used to order forms within a section. The lower the value,
the more on top it will appear, and vice versa. The result depends on the
priorities of other settings.

Nextcloud will look for the templates in a template folder located in your apps
root directory. It should always end on .php, in this case ``templates/admin.php``
would be the final relative path.

.. code-block:: php

    <?php
    /** @var $l \OCP\IL10N */
    /** @var $_ array */

    script('myappid', 'admin');         // adds a JavaScript file
    style('survey_client', 'admin');    // adds a CSS file
    ?>

    <div id="survey_client" class="section">
            <h2><?php p($l->t('Your app')); ?></h2>

            <p>
                    <?php p($l->t('Only administrators are allowed to click the red button')); ?>
            </p>

            <button><?php p($l->t('Click red button')); ?></button>

            <p>
                    <input id="your_app_magic" name="your_app_magic"
                               type="checkbox" class="checkbox" value="1" <?php if ($_['is_enabled']): ?> checked="checked"<?php endif; ?> />
                    <label for="your_app_magic"><?php p($l->t('Do some magic')); ?></label>
            </p>

            <h3><?php p($l->t('Things to define')); ?></h3>
            <?php
            foreach ($_['categories'] as $category => $data) {
                    ?>
                    <p>
                            <input id="your_app_<?php p($category); ?>" name="your_app_<?php p($category); ?>"
                                       type="checkbox" class="checkbox your_app_category" value="1" <?php if ($data['enabled']): ?> checked="checked"<?php endif; ?> />
                            <label for="your_app_<?php p($category); ?>"><?php print_unescaped($data['displayName']); ?></label>
                    </p>
                    <?php
            }
            ?>

            <?php if (!empty($_['last_report'])): ?>

            <h3><?php p($l->t('Last report')); ?></h3>

            <p><textarea title="<?php p($l->t('Last report')); ?>" class="last_report" readonly="readonly"><?php p($_['last_report']);?></textarea></p>

            <em class="last_sent"><?php p($l->t('Sent on: %s', [$_['last_sent']])); ?></em>

            <?php endif; ?>

    </div>

Then, the implementing class should be added to the info.xml. Settings will be
registered upon install and update. When settings are added to an existing,
installed and enabled app, it should be made sure that the version is
increased so Nextcloud can register the class. It is only possible to register
one ISettings implementor.

For a more complex example using embedded templates have a look at the
implementation of the **user_ldap** app.


Section
-------

It is also possible that an app registers its own section. This should be done
only if there is not fitting corresponding section and the apps settings form
takes a lot of screen estate. Otherwise, register to "additional".

Basically, it works the same way as with the settings form. There are only two
differences. First, the interface that must be implemented is ``\OCP\Settings\ISection``.

Second, a template is not necessary.

An example implementation of the ISection interface:

.. code-block:: php

    <?php
    namespace OCA\YourAppNamespace\Settings;

    use OCP\IL10N;
    use OCP\Settings\ISection;

    class AdminSection implements ISection {

            /** @var IL10N */
            private $l;

            public function __construct(IL10N $l) {
                    $this->l = $l;
            }

            /**
             * returns the ID of the section. It is supposed to be a lower case string
             *
             * @returns string
             */
            public function getID() {
                    return 'yourappid'; //or a generic id if feasible
            }

            /**
             * returns the translated name as it should be displayed, e.g. 'LDAP / AD
             * integration'. Use the L10N service to translate it.
             *
             * @return string
             */
            public function getName() {
                    return $this->l->t('Translatable Section Name');
            }

            /**
             * @return int whether the form should be rather on the top or bottom of
             * the settings navigation. The sections are arranged in ascending order of
             * the priority values. It is required to return a value between 0 and 99.
             */
            public function getPriority() {
                    return 80;
            }

    }

Also the section must be registered in the app's info.xml.

Personal
^^^^^^^^

Registering personal settings follows and old style yet. Within the app
intialisation (e.g. in appinfo/app.php) a method must be called:

.. code-block:: php

    <?php
    \OCP\App::registerPersonal('yourappid', 'personal');

Upon opening the personal page, Nextcloud will look for ``personal.php`` script,
execute it and print the output.
