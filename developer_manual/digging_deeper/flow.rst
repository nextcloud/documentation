==============
Nextcloud Flow
==============

Nextcloud Flow is a flexible, user-defined event-based workflow engine. 

The workflow engine broadcasts events when certain trigger conditions are met.

Applications register event listeners with the workflow engine to receive events broadcast by the workflow engine when one or more trigger conditions are met.

Event listeners then register operations to handle those events.

An example flow might be converting Word documents into PDF when they are added to one folder, then move that Word document to another folder once it's finished.

The following sections define the individual components your application will need to integrate with the workflow engine.

At 36c3 blizzz gave a talk explaining Flow and `how to write actions and triggers. <https://mirror.eu.oneandone.net/projects/media.ccc.de/congress/2019/h264-sd/36c3-oio-174-eng-Building_Nextcloud_Flow_sd.mp4>`_ You can `find the slides of their talk here. <https://nextcloud.com/wp-content/themes/next/assets/files/Building_nextcloud_flow.pdf>`_

An example workflow can be found at https://github.com/nextcloud/workflow_pdf_converter.

Events
======

First, you should consider the events you want users to configure in your flow.  Nextcloud currently dispatches the following events to the workflow engine:

Calendar
--------

- ``\OCA\DAV\CalDAV\CalDavBackend::createCalendar``
- ``\OCA\DAV\CalDAV\CalDavBackend::updateCalendar``
- ``\OCA\DAV\CalDAV\CalDavBackend::deleteCalendar``
- ``\OCA\DAV\CalDAV\CalDavBackend::createCalendarObject``
- ``\OCA\DAV\CalDAV\CalDavBackend::createCachedCalendarObject``
- ``\OCA\DAV\CalDAV\CalDavBackend::updateCalendarObject``
- ``\OCA\DAV\CalDAV\CalDavBackend::updateCachedCalendarObject``
- ``\OCA\DAV\CalDAV\CalDavBackend::deleteCalendarObject``
- ``\OCA\DAV\CalDAV\CalDavBackend::deleteCachedCalendarObject``
- ``\OCA\DAV\CalDAV\CalDavBackend::createSubscription``
- ``\OCA\DAV\CalDAV\CalDavBackend::updateSubscription``
- ``\OCA\DAV\CalDAV\CalDavBackend::deleteSubscription``
- ``\OCA\DAV\CalDAV\CalDavBackend::updateShares``
- ``\OCA\DAV\CalDAV\CalDavBackend::publishCalendar``

Contacts
--------

- ``\OCA\DAV\CardDAV\CardDavBackend::createCard``
- ``\OCA\DAV\CardDAV\CardDavBackend::updateCard``
- ``\OCA\DAV\CardDAV\CardDavBackend::deleteCard``

Files
-----

- ``\OCP\Files::preWrite``
- ``\OCP\Files::postWrite``
- ``\OCP\Files::preCreate``
- ``\OCP\Files::postCreate``
- ``\OCP\Files::preDelete``
- ``\OCP\Files::postDelete``
- ``\OCP\Files::preTouch``
- ``\OCP\Files::postTouch``
- ``\OCP\Files::preRename``
- ``\OCP\Files::postRename``
- ``\OCP\Files::preCopy``
- ``\OCP\Files::postCopy``
- ``\OCP\Files::read``

Shares
------

- ``\OCP\Share::preShare``
- ``\OCP\Share::postShare``
- ``\OCP\Share::postAcceptShare``
- ``\OCP\Share::preUnshare``
- ``\OCP\Share::postUnshare``
- ``\OCP\Share::postUnshareFromSelf``

Users
-----

- ``\OCP\IUser::preDelete``
- ``\OCP\IUser::postDelete``
- ``\OCP\IUser::preSetPassword``
- ``\OCP\IUser::postSetPassword``
- ``\OCP\IUser::changeUser``
- ``\OCP\IUser::preDelete``

Listeners
=========

Event listeners are classes that are registered with the manager along with an array of events that it should listen for.

The first event listener your application should listen for is the ``RegisterOperationsEvent`` event.

This event is dispatched when the workflow engine goes to resolve registered event listeners that should receive an event it is broadcasting. 

This initial event listener should register your Operations, and register the name of the JS bundle containing a Vue component that can be used to configure conditions for your event listeners to proceed. 

`An example RegisterOperationsEvent listener can be found here <https://github.com/nextcloud/workflow_pdf_converter/blob/master/lib/Listener/RegisterFlowOperationsListener.php>`_

This event listener should be registered within the ``register`` function of your ``Application`` class. ::

    public function register(IRegistrationContext $context): void {
        $context->registerEventListener(
            RegisterOperationsEvent::class, 
            RegisterFlowOperationsListener::class
        );
    }

Operations
==========

Operations are classes that are registered with one or more event listeners.

When one or more event listeners receive an event, they can all be configured to call a single operation if it minimizes duplicated code.  (Use your best judgement.)

This class must implement one of the following `IOperation <https://github.com/nextcloud/server/blob/master/lib/public/WorkflowEngine/IOperation.php#L33>`_ interfaces:

- `ISpecificOperation <https://github.com/nextcloud/server/blob/master/lib/public/WorkflowEngine/ISpecificOperation.php>`_ - an interface that represents an operation designed to work with one entity type.

- `IComplexOperation <https://github.com/nextcloud/server/blob/master/lib/public/WorkflowEngine/IComplexOperation.php>`_ - an interface that represents an operation that performs it's own trigger logic.

When an event is fired that your operation is listening for, it will call the onEvent function of your operation.

`An example ConvertPDFOperation operation can be found here <https://github.com/nextcloud/workflow_pdf_converter/tree/master/lib/Operation.php>`_ 

The operation should be registered against the event in the ``handle`` function of your ``RegisterOperationsEvent`` listener.

Configuration Component
=======================

The configuration component is what your user sees when they add your flow and go to configure it's rules.

The ``RegisterOperationsEvent`` listener we created earlier registered the name of the JS bundle.

This JS bundle should be compiled using ``@nextcloud/webpack-vue-config`` through the following steps:

First, create a `webpack.js` file in the root of your application's folder. ::

    const webpackConfig = require('@nextcloud/webpack-vue-config')

    module.exports = webpackConfig

Then, create ``src/main.js`` with the following contents ::

    import ConvertToPdf from './ConvertToPdf'

    OCA.WorkflowEngine.registerOperator({
        id: 'OCA\\WorkflowPDFConverter\\Operation',
        operation: 'keep;preserve',
        options: ConvertToPdf,
        color: '#dc5047'
    })

The ``OCA.WorkflowEngine.registerOperator`` function tells Nextcloud about your operation, along with the color, and the component that contains configuration specific to your flow.
