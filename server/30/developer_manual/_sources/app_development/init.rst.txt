====================================
Navigation and pre-app configuration
====================================

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>


Adding a navigation entry
-------------------------

Navigation entries for apps can be created by adding a navigation section to the :file:`appinfo/info.xml` file, containing the name, order and route the navigation entry should link to. For details on the XML schema check the `app store documentation <https://nextcloudappstore.readthedocs.io/en/latest/developer.html#info-xml>`_.

.. code-block:: xml

    <navigation>
        <name>MyApp</name>
        <route>myapp.page.index</route>
        <order>0</order>
    </navigation>


Initialization events
---------------------

Often apps do not need to load their JavaScript and CSS on every page. For this
purpose there are several events emitted that an app can act upon.

* ``OCA\Files::loadAdditionalScripts`` (string): loaded on the files list page
* ``OCA\Files_Sharing::loadAdditionalScripts`` (string): loaded on the public sharing page
* ``OCA\Files_Sharing::loadAdditionalScripts::publicShareAuth`` (string): loaded on the public share authentication page
* ``OCP\AppFramework\Http\TemplateResponse::EVENT_LOAD_ADDITIONAL_SCRIPTS`` (constant): loaded when a template response is finished
* ``OCP\AppFramework\Http\TemplateResponse::EVENT_LOAD_ADDITIONAL_SCRIPTS_LOGGEDIN`` (constant): loaded when a template response is finished for a logged in user

You can subscribe listeners to these events in the :ref:`bootstrapping code<Bootstrapping>` of the app. See the :ref:`events documentation<Events>` for more details on the event dispatcher and available events.
