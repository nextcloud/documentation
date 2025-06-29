==============
Nextcloud Flow
==============

Nextcloud Flow is a flexible, user-defined, event-based workflow engine that allows applications to react to specific triggers by registering event listeners and operations. When certain conditions are met, the workflow engine broadcasts events such as file creation, modification, or deletion. Applications integrate with Flow by registering event listeners, which in turn register operations to handle these events. For example, you could set up a flow to convert Word documents to PDF when they are added to a folder, then move the originals elsewhere after conversion. This system enables powerful automation and customization within Nextcloud.

To integrate with the workflow engine, your application needs to implement event listeners and operations, and provide a configuration component for users. Event listeners are registered with the manager and listen for events like ``RegisterOperationsEvent``, where they register available operations and the name of the JavaScript bundle containing a Vue component for configuring conditions. Operations are classes that implement specific interfaces and define what happens when an event is triggered. The configuration component, built as a Vue app and registered via the JS bundle, provides the user interface for setting up and customizing flows. For more details, see the example workflow at https://github.com/nextcloud/workflow_pdf_converter, or watch the `36c3 talk <https://mirror.eu.oneandone.net/projects/media.ccc.de/congress/2019/h264-sd/36c3-oio-174-eng-Building_Nextcloud_Flow_sd.mp4>`_ and review the `slides <https://nextcloud.com/wp-content/themes/next/assets/files/Building_nextcloud_flow.pdf>`_.

Events
======

First, consider the events you want users to configure in your flow. Nextcloud currently dispatches the following events to the workflow engine:

Files
-----

- ``\OCP\Files::postCreate``
- ``\OCP\Files::postWrite``
- ``\OCP\Files::postRename``
- ``\OCP\Files::postDelete``
- ``\OCP\Files::postTouch``
- ``\OCP\Files::postCopy``

Listeners
=========

Event listeners are classes registered with the manager, along with an array of events they should listen for.

The first event listener your application should implement is for the ``RegisterOperationsEvent`` event.

This event is dispatched when the workflow engine resolves which event listeners should receive a broadcasted event.

This initial event listener should register your operations and the name of the JS bundle containing a Vue component for configuring conditions for your event listeners.

`An example RegisterOperationsEvent listener can be found here <https://github.com/nextcloud/workflow_pdf_converter/blob/master/lib/Listener/RegisterFlowOperationsListener.php>`_.

Register this event listener within the ``register`` function of your ``Application`` class::

    public function register(IRegistrationContext $context): void {
        $context->registerEventListener(
            RegisterOperationsEvent::class, 
            RegisterFlowOperationsListener::class
        );
    }

Operations
==========

Operations are classes registered with one or more event listeners.

This class must implement one of the following `IOperation <https://github.com/nextcloud/server/blob/master/lib/public/WorkflowEngine/IOperation.php#L33>`_ interfaces:

- `ISpecificOperation <https://github.com/nextcloud/server/blob/master/lib/public/WorkflowEngine/ISpecificOperation.php>`_ – for operations designed to work with one entity type.
- `IComplexOperation <https://github.com/nextcloud/server/blob/master/lib/public/WorkflowEngine/IComplexOperation.php>`_ – for operations that perform their own trigger logic.

When an event is fired that your operation listens for, it will call the onEvent function of your operation.

`An example ConvertPDFOperation can be found here <https://github.com/nextcloud/workflow_pdf_converter/tree/master/lib/Operation.php>`_.

Register the operation against the event in the ``handle`` function of your ``RegisterOperationsEvent`` listener.

Configuration Component
=======================

The configuration component is what users see when they add your flow and configure its rules.

The ``RegisterOperationsEvent`` listener you created earlier registers the name of the JS bundle.

This JS bundle should be compiled using ``@nextcloud/webpack-vue-config`` as follows:

First, create a `webpack.js` file in the root of your application's folder::

    const webpackConfig = require('@nextcloud/webpack-vue-config')

    module.exports = webpackConfig

Then, create ``src/main.js`` with the following contents::

    import ConvertToPdf from './ConvertToPdf'

    OCA.WorkflowEngine.registerOperator({
        id: 'OCA\\WorkflowPDFConverter\\Operation',
        operation: 'keep;preserve',
        options: ConvertToPdf,
        color: '#dc5047'
    })

The ``OCA.WorkflowEngine.registerOperator`` function tells Nextcloud about your operation, along with the color and the component that contains configuration specific to your flow.
