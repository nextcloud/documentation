=============
Contacts Menu
=============

Nextcloud shows a *Contacts menu* in the right corner of the header. This menu lists a user's contacts. These contact entries can be extended by apps.

Apps that extend the contacts menu implement an IProvider. The providers ``process`` method is called for every entry show in the contacts menu.

.. code-block:: php
    :caption: lib/ContactsMenu/MyProvider.php

    <?php

    namespace OCA\MyApp\ContactsMenu;

    use OCP\Contacts\ContactsMenu\IEntry;
    use OCP\Contacts\ContactsMenu\IProvider;

    class MyProvider implements IProvider {
        public function process(IEntry $entry): void {
            // todo: something useful
        }
    }


.. code-block:: xml
    :caption: appinfo/info.xml
    :emphasize-lines: 6-8

    <?xml version="1.0"?>
    <info xmlns:xsi= "http://www.w3.org/2001/XMLSchema-instance"
        xsi:noNamespaceSchemaLocation="https://apps.nextcloud.com/schema/apps/info.xsd">
        <id>my_app</id>
        <name>My App</name>
        <contactsmenu>
            <provider>OCA\MyApp\ContactsMenu\LinkActionProvider</provider>
        </contactsmenu>
    </info>

Accessing contact info
^^^^^^^^^^^^^^^^^^^^^^

The ``IEntry`` objects offer getters to contact infos:

* ``getFullName()``: Get full name. Falls back to an empty string if no full name is set.
* ``getEMailAddresses()``: Get all email addresses.
* ``getAvatar()``: Get the avatar URI.
* ``getProperty(string $name)``: Read a `vCard property <https://www.rfc-editor.org/rfc/rfc6350#page-23>`_ of the contact. Return NULL if the property is not set.

Actions
^^^^^^^

Providers can add actions to contact entries. Right now email and link actions are supported. These are created with the help of the ``IActionFactory``.

.. code-block:: php
    :caption: lib/ContactsMenu/LinkProvider.php

    <?php

    namespace OCA\MyApp\ContactsMenu;

    use OCP\Contacts\ContactsMenu\IEntry;
    use OCP\Contacts\ContactsMenu\IProvider;

    class LinkProvider implements IProvider {
        private IActionFactory $actionFactory;

        public function __construct(IActionFactory $actionFactory) {
            $this->actionFactory = $actionFactory
        }

        public function process(IEntry $entry): void {
            $emailAction = $this->actionFactory->newEMailAction(
                '/apps/myapp/img/link.png', // icon URL
                'Click me', // name
                'user@domain.tld', // email address
                'my_app', // app ID (optional)
            );
            $linkAction = $this->actionFactory->newLinkAction(
                '/apps/myapp/img/link.png', // icon URL
                'Click me', // name
                'https://.....', // href
                'my_app', // app ID (optional)
            );

            $entry->addAction($emailAction);
            $entry->addAction($linkAction);
        }
    }
