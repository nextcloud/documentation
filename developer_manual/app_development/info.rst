.. _app metadata:

============
App metadata
============

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The :file:`appinfo/info.xml` contains metadata about the app. A detailed documentation can be found at the `app store documentation <https://nextcloudappstore.readthedocs.io/en/latest/developer.html#info-xml>`_.

The info.xml is validated using an XML Schema which can be accessed `online <https://apps.nextcloud.com/schema/apps/info.xsd>`_.

A minimum valid **info.xml** would look like this:

.. code-block:: xml
    :caption: appinfo/info.xml

    <?xml version="1.0"?>
    <info xmlns:xsi= "http://www.w3.org/2001/XMLSchema-instance"
          xsi:noNamespaceSchemaLocation="https://apps.nextcloud.com/schema/apps/info.xsd">
        <id>news</id>
        <name>News</name>
        <summary>An RSS/Atom feed reader</summary>
        <description>An RSS/Atom feed reader</description>
        <version>8.8.2</version>
        <licence>agpl</licence>
        <author>Bernhard Posselt</author>
        <category>multimedia</category>
        <bugs>https://github.com/nextcloud/news/issues</bugs>
        <dependencies>
            <nextcloud min-version="10"/>
        </dependencies>
    </info>

A full blown example would look like this (needs to be utf-8 encoded):

.. code-block:: xml
    :caption: appinfo/info.xml

    <?xml version="1.0"?>
    <info xmlns:xsi= "http://www.w3.org/2001/XMLSchema-instance"
          xsi:noNamespaceSchemaLocation="https://apps.nextcloud.com/schema/apps/info.xsd">
        <id>news</id>
        <name lang="de">Nachrichten</name>
        <name>News</name>
        <summary lang="en">An RSS/Atom feed reader</summary>
        <description lang="en"># Description\nAn RSS/Atom feed reader</description>
        <description lang="de"><![CDATA[# Beschreibung\nEine Nachrichten App, welche mit [RSS/Atom](https://en.wikipedia.org/wiki/RSS) umgehen kann]]></description>
        <version>8.8.2</version>
        <licence>agpl</licence>
        <author mail="mail@provider.com" homepage="http://example.com">Bernhard Posselt</author>
        <author>Alessandro Cosentino</author>
        <author>Jan-Christoph Borchardt</author>
        <documentation>
            <user>https://github.com/nextcloud/news/wiki#user-documentation</user>
            <admin>https://github.com/nextcloud/news#readme</admin>
            <developer>https://github.com/nextcloud/news/wiki#developer-documentation</developer>
        </documentation>
        <category>multimedia</category>
        <category>tools</category>
        <website>https://github.com/nextcloud/news</website>
        <discussion>https://your.forum.com</discussion>
        <bugs>https://github.com/nextcloud/news/issues</bugs>
        <repository>https://github.com/nextcloud/news</repository>
        <screenshot small-thumbnail="https://example.com/1-small.png">https://example.com/1.png</screenshot>
        <screenshot>https://example.com/2.jpg</screenshot>
        <dependencies>
            <php min-version="5.6" min-int-size="64"/>
            <database min-version="9.4">pgsql</database>
            <database>sqlite</database>
            <database min-version="5.5">mysql</database>
            <command>grep</command>
            <command>ls</command>
            <lib min-version="2.7.8">libxml</lib>
            <lib>curl</lib>
            <lib>SimpleXML</lib>
            <lib>iconv</lib>
            <nextcloud min-version="9" max-version="10"/>
        </dependencies>
        <background-jobs>
            <job>OCA\DAV\CardDAV\Sync\SyncJob</job>
        </background-jobs>
        <repair-steps>
            <pre-migration>
                <step>OCA\DAV\Migration\Classification</step>
            </pre-migration>
            <post-migration>
                <step>OCA\DAV\Migration\Classification</step>
            </post-migration>
            <live-migration>
                <step>OCA\DAV\Migration\GenerateBirthdays</step>
            </live-migration>
            <install>
                <step>OCA\DAV\Migration\GenerateBirthdays</step>
            </install>
            <uninstall>
                <step>OCA\DAV\Migration\GenerateBirthdays</step>
            </uninstall>
        </repair-steps>
        <two-factor-providers>
            <provider>OCA\AuthF\TwoFactor\Provider</provider>
        </two-factor-providers>
        <commands>
            <command>A\Php\Class</command>
        </commands>
        <settings>
            <admin>OCA\Theming\Settings\Admin</admin>
            <admin-section>OCA\Theming\Settings\Section</admin-section>
        </settings>
        <activity>
            <settings>
                <setting>OCA\Files\Activity\Settings\FavoriteAction</setting>
                <setting>OCA\Files\Activity\Settings\FileChanged</setting>
                <setting>OCA\Files\Activity\Settings\FileCreated</setting>
                <setting>OCA\Files\Activity\Settings\FileDeleted</setting>
                <setting>OCA\Files\Activity\Settings\FileFavorite</setting>
                <setting>OCA\Files\Activity\Settings\FileRestored</setting>
            </settings>

            <filters>
                <filter>OCA\Files\Activity\Filter\FileChanges</filter>
                <filter>OCA\Files\Activity\Filter\Favorites</filter>
            </filters>

            <providers>
                <provider>OCA\Files\Activity\FavoriteProvider</provider>
                <provider>OCA\Files\Activity\Provider</provider>
            </providers>
        </activity>
        <navigations>
            <navigation role="admin">
                <id>files</id>
                <name>Files</name>
                <route>files.view.index</route>
                <order>0</order>
                <icon>app.svg</icon>
                <type>link</type>
            </navigation>
        </navigations>
        <collaboration>
            <plugins>
                <plugin type="collaborator-search" share-type="SHARE_TYPE_CIRCLE">OCA\Circles\Collaboration\v1\CollaboratorSearchPlugin</plugin>
            </plugins>
        </collaboration>
    </info>

The following tags are validated and used in the following way:

id
    * required
    * must contain only lowercase ASCII characters and underscore
    * must match the first folder in the archive
    * will be used to identify the app
name
    * required
    * must occur at least once with **lang="en"** or no lang attribute
    * can be translated by using multiple elements with different **lang** attribute values, language code needs to be set **lang** attribute
    * will be rendered on the app detail page
summary
    * optional
    * if not provided the description element's text will be used
    * must occur at least once with **lang="en"** or no lang attribute
    * can be translated by using multiple elements with different **lang** attribute values, language code needs to be set **lang** attribute
    * will be rendered on the app list page as short description
description
    * required
    * must occur at least once with **lang="en"** or no lang attribute
    * can contain Markdown
    * can be translated by using multiple elements with different **lang** attribute values, language code needs to be set **lang** attribute
    * will be rendered on the app detail page
version
    * required
    * must be a `semantic version <http://semver.org/>`_ without build metadata, e.g. 9.0.1 or 9.1.0-alpha.1
    * :ref:`more info on app versioning <app-versioning>`

licence
    * required
    * must contain **agpl**, **mpl*** and/or **apache** as the only valid values. These refer to the AGPLv3, MPL 2.0 and Apache License 2.0
author
    * required
    * can occur multiple times with different authors
    * can contain a **mail** attribute which must be an email
    * can contain a **homepage** which must be a URL
    * will not (yet) be rendered on the App Store
    * will be provided through the REST API
documentation/user
    * optional
    * must contain a URL to the user documentation
    * will be rendered on the app detail page
documentation/admin
    * optional
    * must contain a URL to the admin documentation
    * will be rendered on the app detail page
documentation/developer
    * optional
    * must contain a URL to the developer documentation
    * will be rendered on the app detail page
category
    * optional
    * if not provided the category **tools** will be used
    * must contain one of the following values:

       * **customization**
       * **files**
       * **games**
       * **integration**
       * **monitoring**
       * **multimedia**
       * **office**
       * **organization**
       * **security**
       * **social**
       * **tools**

    * old categories are migrated:

       * **auth** will be converted to **security**

    * can occur more than once with different categories
website
    * optional
    * must contain a URL to the project's homepage
    * will be rendered on the app detail page
discussion
    * optional
    * must contain a URL to the project's discussion page/forum
    * will be rendered on the app detail page as the "ask question or discuss" button
    * if absent, it will default to our forum at https://help.nextcloud.com/
bugs
    * required
    * must contain a URL to the project's bug tracker
    * will be rendered on the app detail page
repository
    * optional
    * must contain a URL to the project's repository
    * can contain a **type** attribute, **git**, **mercurial**, **subversion** and **bzr** are allowed values, defaults to **git**
    * currently not used
screenshot
    * optional
    * must contain an HTTPS URL to an image
    * can contain a **small-thumbnail** attribute which must contain an https url to an image. This image will be used as small preview (e.g. on the app list overview). Keep it small so it renders fast
    * will be rendered on the app list and detail page in the given order
dependencies/php
    * optional
    * can contain a **min-version** attribute (maximum 3 digits separated by dots)
    * can contain a **max-version** attribute (maximum 3 digits separated by dots)
    * can contain a **min-int-size** attribute, 32 or 64 are allowed as valid values
    * will be rendered on the app releases page
dependencies/database
    * optional
    * must contain the database name as text, **sqlite**, **pgsql** and **mysql** are allowed as valid values
    * can occur multiple times with different databases
    * can contain a **min-version** attribute (maximum 3 digits separated by dots)
    * can contain a **max-version** attribute (maximum 3 digits separated by dots)
    * will be rendered on the app releases page
dependencies/command
    * optional
    * must contain a linux command as text value
    * can occur multiple times with different commands
    * will be rendered on the app releases page
dependencies/lib
    * optional
    * will be rendered on the app releases page
    * must contain a required php extension
    * can occur multiple times with different php extensions
    * can contain a **min-version** attribute (maximum 3 digits separated by dots)
    * can contain a **max-version** attribute (maximum 3 digits separated by dots)
dependencies/nextcloud
    * required on Nextcloud 11 or higher
    * if absent white-listed owncloud versions will be taken from the owncloud element (see below)
    * must contain a **min-version** attribute (maximum 3 digits separated by dots)
    * can contain a **max-version** attribute (maximum 3 digits separated by dots)
	
.. note:: Dependencies `dependencies/php`, `dependencies/database` and `dependencies/lib` are checked at installation time (not on update time), hence applications need to stick to the dependencies supported by a major version of Nextcloud the moment an app releases support for that version, i.e. app needs to support the same PHP version-range the supported Nextcloud version supports.
	
background-jobs/job
    * optional
    * must contain a php class which is run as background jobs
    * will not be used, only validated
repair-steps/pre-migration/step
    * optional
    * must contain a php class which is run before executing database migrations
    * will not be used, only validated
repair-steps/post-migration/step
    * optional
    * must contain a php class which is run after executing database migrations
    * will not be used, only validated
repair-steps/live-migration/step
    * optional
    * must contain a php class which is run after executing post-migration jobs
    * will not be used, only validated
repair-steps/install/step
    * optional
    * must contain a php class which is run after installing the app
    * will not be used, only validated
repair-steps/uninstall/step
    * optional
    * must contain a php class which is run after uninstalling the app
    * will not be used, only validated
two-factor-providers/provider
    * optional
    * must contain a php class which is registered as two factor auth provider
    * will not be used, only validated
commands/command
    * optional
    * must contain a php class which is registered as occ command
    * will not be used, only validated
activity/settings/setting
    * optional
    * must contain a php class which implements OCP\Activity\ISetting and is used to add additional settings ui elements to the activity app
activity/filters/filter
    * optional
    * must contain a php class which implements OCP\Activity\IFilter and is used to add additional filters to the activity app
activity/providers/provider
    * optional
    * must contain a php class which implements OCP\Activity\IProvider and is used to react to events from the activity app
settings/admin
    * optional
    * must contain a php class which implements OCP\Settings\ISettings and returns the form to render for the global settings area
settings/admin-section
    * optional
    * must contain a php class which implements OCP\Settings\ISection and returns data to render navigation entries in the global settings area
navigations
    * optional
    * must contain at least one navigation element
navigations/navigation
    * required
    * must contain a name and route element
    * denotes a navigation entry
    * role denotes the visibility, all means everyone can see it, admin means only an admin can see the navigation entry, defaults to all
navigations/navigation/id
    * optional
    * the app id
    * you can also create entries for other apps by setting an id other than your app one's
navigations/navigation/name
    * required
    * will be displayed below the navigation entry icon
    * will be translated by the default translation tools
navigations/navigation/route
    * required
    * name of the route that will be used to generate the link
navigations/navigation/icon
    * optional
    * name of the icon which is looked up in the app's **img/** folder
    * defaults to app.svg
navigations/navigation/order
    * optional
    * used to sort the navigation entries
    * a higher order number means that the entry will be ordered further to the bottom
navigations/navigation/type
    * optional
    * can be either link or settings
    * link means that the entry is added to the default app menu
    * settings means that the entry is added to the right-side menu which also contains the personal, admin, users, help and logout entry
collaboration
    * optional
    * can contain plugins for collaboration search (e.g. supplying share dialog)
collaboration/plugins
    * optional
    * must contain at least one plugin
collaboration/plugins/plugin
    * required
    * the PHP class name of the plugin
    * must contain **type** attribute (currently only *collaboration-search*). The class must implement OCP\Collaboration\Collaborators\ISearchPlugin.
    * must contain **share-type** attribute, according to the specific \OCP\Share constants

The following character maximum lengths are enforced:

* All description Strings are database text fields and therefore not limited in size
* All other Strings have a maximum of 256 characters

The following elements are either deprecated or for internal use only and will fail the validation if present:

* **standalone**
* **default_enable**
* **shipped**
* **public**
* **remote**
* **requiremin**
* **requiremax**

.. _app changelog:

Changelog
---------

Apps can provide a changelog. This should be written in the `keep a changelog <https://keepachangelog.com/>`_.

If the apps provide a ``CHANGELOG.md`` file in the project root, this file will be used to show changes for the released version in the app store and for administrators in the app settings.

Moreover, since Nextcloud 29, if the ``updatenotification`` app is enabled, apps can also provide a changelog for the users.
The app will notify users about after the app update if either a ``CHANGELOG.language.md`` (where ``language`` is the language code of that user) or a fallback ``CHANGELOG.en.md`` is available.
