==============
Nextcloud Flow
==============

Nextcloud Flow is a user-defined event-based workflow engine.

Applications can expose entities with specific events on the one hand, and operations that act on these events on the other hand.

An example flow might be converting Word documents into PDF when they are added to one folder, then move that Word document to another folder once it's finished. This workflow would deal with the file entity's create event and act on that file.

At 36c3 blizzz gave a talk explaining Flow and `how to write actions and triggers. <https://mirror.eu.oneandone.net/projects/media.ccc.de/congress/2019/h264-sd/36c3-oio-174-eng-Building_Nextcloud_Flow_sd.mp4>`_ You can `find the slides of their talk here. <https://nextcloud.com/wp-content/themes/next/assets/files/Building_nextcloud_flow.pdf>`_

Entities
========

If you want to expose events via Nextcloud Flow, you need to define an entity, which is a class implementing ``OCP\WorkflowEngine\IEntity``.

The entity class will expose a name for the User interface via ``getName()`` and an icon URL ``getIcon()``.

The ``getEvents()`` method returns an array of all events that this entity can undergo, which will be selectable for the user in the flow interface.

For all events that happen on the nextcloud instance (see :ref:`Events` for all known built-in events), ``prepareRuleMatcher()`` will be called, so it can check whether this event is one of the ones that the entity makes available in flow.

If that is the case, the entity can assign itself to the rule matcher.

Similarly, ``isLegitimatedForUserId()`` will check whether the passed user is allowed to see the current event (which requires that you store the event that was passed to ``prepareRuleMatcher()``).

Operations
==========

Operations are actions that users can configure to happen when specific events occur.

An operation is a class implementing ISpecificOperation, IOperation or IComplexOperation. Specific operations can only act on one specific entity (e.g. a file), while normal operations can oact on all events. Complex operations do not listen on events but setup their own listener(s).


Configuration Component
=======================

The configuration component is what your user sees when they add your flow and go to configure its rules.

For the configuration component, We create a new JavaScript bundle ::

    import ConvertToPdf from './ConvertToPdf' // A Vue component

    OCA.WorkflowEngine.registerOperator({
        id: 'OCA\\WorkflowPDFConverter\\Operation',
        operation: 'keep;preserve',
        options: ConvertToPdf,
        color: '#dc5047'
    })

In the ``RegisterOperationsEvent`` listener we need to registere the above JS bundle.

The ``OCA.WorkflowEngine.registerOperator`` function tells Nextcloud about your operation, along with the color, and the component that contains configuration specific to your flow.
