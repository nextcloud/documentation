.. _interaction_api :

========================
Interaction API
========================

.. versionadded:: 34.0.2

The ``\OCP\Interaction\RestrictInteractionEvent`` lets any app forbid an action
through which a user makes others aware of a resource, for example sharing a
file by link.

Two kinds of apps take part:

* An **emitting app** performs the interaction, for example the sharing
  backend. Before it does, it describes the interaction and asks whether it is
  allowed.
* A **restricting app** listens to the event and forbids interactions that
  break its rules, for example "confidential files must not be shared by link".
  It never needs code specific to the emitting app.

The server ships listeners in core, Files and Files sharing, see
`Built-in restrictions`_.

.. mermaid::

    sequenceDiagram
        participant E as Emitting app
        participant S as Server
        participant A as Restricting app A
        participant B as Restricting app B

        E->>S: isInteractionRestricted()
        activate S
        S->>A: handle(event)
        A-->>S: returns
        S->>B: handle(event)
        B-->>S: throws InteractionRestrictedException
        S->>S: write audit log entry
        S-->>E: translated hint
        deactivate S
        E->>E: refuse the interaction

Concepts
--------

An interaction consists of four parts:

.. list-table::
   :header-rows: 1
   :widths: 20 35 45

   * - Part
     - Type
     - Meaning
   * - User
     - ``string`` user ID, optionally the ``\OCP\IUser``
     - The user who performs the interaction.
   * - Resources
     - list of ``\OCP\Interaction\InteractionResource``
     - What is exposed, for example a file or a folder.
   * - Action
     - ``\OCP\Interaction\InteractionAction`` or ``null``
     - What the user does, for example sharing with certain permissions.
   * - Receivers
     - list of ``\OCP\Interaction\InteractionReceiver``
     - Who becomes aware of the resources, for example a user, a group or
       everyone with a link.

Only the user is required. An emitting app passes ``null`` or an empty list
for the parts it does not know, and a restricting app ignores the parts it has
no rules for.

An interaction is allowed if no listener forbids it. A listener cannot allow
what another listener forbids.

If the owner of a resource and the user performing the interaction differ, for
example when a share is reshared, the event is emitted once for each of them.

For restricting apps
--------------------

Implement an ``\OCP\EventDispatcher\IEventListener`` for the
``RestrictInteractionEvent``. Check the parts you have rules for with
``instanceof`` and return for everything else. To forbid the interaction,
throw an ``\OCP\Interaction\InteractionRestrictedException``.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Listener;

    use OCA\MyApp\Service\MyAppService;
    use OCP\EventDispatcher\Event;
    use OCP\EventDispatcher\IEventListener;
    use OCP\IL10N;
    use OCP\Interaction\Actions\ShareAction;
    use OCP\Interaction\InteractionRestrictedException;
    use OCP\Interaction\Receivers\LinkReceiver;
    use OCP\Interaction\Resources\NodeResource;
    use OCP\Interaction\RestrictInteractionEvent;

    /**
     * @template-implements IEventListener<RestrictInteractionEvent>
     */
    class RestrictInteractionListener implements IEventListener {
        public function __construct(
            private MyAppService $myAppService,
            private IL10N $l10n,
        ) {
        }

        public function handle(Event $event): void {
            if (!$event instanceof RestrictInteractionEvent || !$event->action instanceof ShareAction) {
                return;
            }

            foreach ($event->receivers as $receiver) {
                if (!$receiver instanceof LinkReceiver) {
                    continue;
                }

                foreach ($event->resources as $resource) {
                    if ($resource instanceof NodeResource && $this->myAppService->shareByLinkAllowed($resource->nodeId)) {
                        throw new InteractionRestrictedException(
                            'This node cannot be shared by link.',
                            $this->l10n->t('This file cannot be shared by link.'),
                        );
                    }
                }
            }
        }
    }

The first argument of the exception is written to the log, the second one is
shown to the user and must be translated.

Register the listener in the ``register`` method of your ``Application`` class:

.. code-block:: php

    $context->registerEventListener(RestrictInteractionEvent::class, RestrictInteractionListener::class);

Things to watch for
^^^^^^^^^^^^^^^^^^^

.. tip::
  To check the permissions of a user on a file or folder, use
  ``NodeResource::getNodePermissions()``. It combines the permissions of every
  path through which the user can reach the node. ``getNode()`` only returns
  one of these paths.

.. warning::
  * ``ShareAction`` carries the permissions of the share in one of two forms:
    ``filesSharingPermissions`` as a bitmask of ``\OCP\Constants::PERMISSION_*``,
    or ``unifiedSharingPermissions`` as a list of share permission type class
    names. If your rules depend on the permissions, handle both.
  * Do not throw any other exception to forbid an interaction. Other exceptions
    are not handled by the server and the check is not written to the audit log.
  * The first listener that throws ends the check, so the user only sees one
    reason even if several listeners would forbid the interaction.

For emitting apps
-----------------

Before the interaction happens, create the event with everything you know and
call ``isInteractionRestricted()``. It returns ``false`` if the interaction is
allowed, or the translated reason if it is not.

.. code-block:: php

    use OCP\Constants;
    use OCP\Interaction\Actions\ShareAction;
    use OCP\Interaction\Receivers\UserReceiver;
    use OCP\Interaction\Resources\NodeResource;
    use OCP\Interaction\RestrictInteractionEvent;

    $event = new RestrictInteractionEvent(
        $user->getUID(),
        $user,
        [new NodeResource($node->getId(), $user->getUID(), $node)],
        new ShareAction(Constants::PERMISSION_READ),
        [new UserReceiver($recipientId)],
    );

    $reason = $event->isInteractionRestricted();
    if ($reason !== false) {
        // Refuse the interaction and show $reason to the user
    }

Things to watch for
^^^^^^^^^^^^^^^^^^^

.. warning::
  * Always call ``isInteractionRestricted()``. Do not dispatch the event
    yourself, otherwise exceptions are not handled and nothing is written to the
    audit log.
  * Pass the objects you already have, such as the ``\OCP\IUser``, the
    ``\OCP\Files\Node`` or the node permissions. Everything you leave out is
    loaded when a listener needs it.
  * If the owner of a resource and the user performing the interaction differ,
    emit one event for each of them.

Adding resource, action and receiver types
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If your app exposes something the server does not know, implement
``\OCP\Interaction\InteractionResource``, ``\OCP\Interaction\InteractionAction``
or ``\OCP\Interaction\InteractionReceiver``. ``getID()`` returns an ID that
identifies the resource or receiver in the audit log. A receiver without an ID
returns ``null``.

Types
-----

The server ships the following types. They are in the ``\OCP\Interaction``
namespace.

.. list-table::
   :header-rows: 1
   :widths: 35 65

   * - Class
     - Description
   * - ``Actions\ShareAction``
     - Sharing a resource. Takes ``filesSharingPermissions`` or
       ``unifiedSharingPermissions``.
   * - ``Resources\NodeResource``
     - A file or folder. Takes the node ID and the user ID, and optionally the
       ``\OCP\Files\Node`` and the node permissions.
   * - ``Receivers\UserReceiver``
     - A user. ``getUser()`` returns the ``\OCP\IUser``.
   * - ``Receivers\GroupReceiver``
     - A group. ``getGroup()`` returns the ``\OCP\IGroup``.
   * - ``Receivers\LinkReceiver``
     - Everyone with a public link.
   * - ``Receivers\EmailReceiver``
     - An email address.
   * - ``Receivers\RemoteUserReceiver``
     - A federated user. ``getCloudId()`` returns the
       ``\OCP\Federation\ICloudId``.
   * - ``Receivers\RemoteGroupReceiver``
     - A federated group. ``getCloudId()`` returns the
       ``\OCP\Federation\ICloudId``.
   * - ``Receivers\CircleReceiver``
     - A team.
   * - ``Receivers\RoomReceiver``
     - A Talk conversation.
   * - ``Receivers\DeckReceiver``
     - A Deck card.

Built-in restrictions
---------------------

.. list-table::
   :header-rows: 1
   :widths: 20 80

   * - App
     - Forbids
   * - Core
     - Sharing if sharing is disabled, for everyone or for the user; sharing
       with a disabled account; sharing outside the user's groups if sharing is
       limited to group members; sharing with groups, by link or email, or with
       federated users or groups if the administrator disabled it.
   * - Files
     - Any interaction on a file or folder the user cannot read.
   * - Files sharing
     - Sharing a file or folder the user cannot share; sharing the home folder;
       sharing a file with create or delete permission; sharing with a user,
       group or other recipient without read permission; sharing a folder by
       link with write permissions if public upload is disabled; sharing with
       more ``filesSharingPermissions`` than the user has.

Audit log
---------

Every check is written to the audit log, with the operation ID
``users.interaction.allowed`` or ``users.interaction.restricted``. The entry
contains the action, the user ID and the IDs of the resources and receivers. If
the interaction is restricted, it also contains the log message of the
exception.
