=======
Circles
=======

Circles is a Nextcloud App that allow Nextcloud users to generate their own grouping of users and contacts.

The Circles app is installed by default since Nextcloud 22.
It can be used by other apps for creating user managed groups called `circles`, an example of such an apps is the `Collectives` app.

There is also the `Circles API reference <https://nextcloud.github.io/circles>`_ .

Circles
=======

Circles are user managed groups, meaning users can create new circles without being required to have administrator permissions.
Those circles can be configured in various ways, like being public or hidden, allow users to join or having user being invited.
It is also possible to create hidden circles only used by apps to organize users and having a consitent way of handling access permissions.

While the Circles app is installed by default, it can still be disabled manually.
So if you want to access the API you can check if Circles are enabled and get the ``CirclesManager`` like this:

.. code-block:: php

    use \Psr\Container\ContainerInterface;
    use \OCP\App\IAppManager;

    function getCircleManager(IAppManager $appManager, ContainerInterface $container) {
        $circlesEnabled = $appManager->isEnabledForUser('circles');
        if ($circlesEnabled) {
            $circlesManager = $this->container->get(CirclesManager::class);
            return $circlesManager;
        }
        return null;
    }

Sessions
========

Interaction with the circles API is done using sessions, sessions are used to set a scope like the currently active user,
to handle circles not visible to that user or execute actions with that user's permissions.

There are multiple kinds ways to start a session, depending of the use case:

.. code-block:: php

    // Starting a session with the `federatedUser` set as current user for scoping results
    $circlesManager->startSession($federatedUser);
    // Starting a super session, e.g. to query all results
    $circlesManager->startSuperSession();
    // Starting a session for app managed circles
    $circlesManager->startAppSession($appId);
    // ...
    $circlesManager->stopSession();

Members
=======

Circle members can be any type of entity like users, groups, other circles or even users of other Nextcloud instances (federated users).
Members can be assigned to different permission levels:

- ``LEVEL_NONE`` (0): Not part of the circles
- ``LEVEL_MEMBER`` (1): Normal circle member
- ``LEVEL_MODERATOR`` (4)
- ``LEVEL_ADMIN`` (8)
- ``LEVEL_OWNER`` (9)

The special case ``LEVEL_NONE`` is used when querying a circle with the current user being not part of that circle.

For example you can check whether a given user is part of a circle like this:

.. code-block:: php

    use \OCA\Circles\CirclesManager;

    // ...

    CirclesManager $circlesManager;

    public function isUserInCircle(string $circleId, string $userId): bool {
        try {
            // Get the federated user for the given user id
            $federatedUser = $this->circlesManager->getFederatedUser($userId, Member::TYPE_USER);
            // Start a new circles session with the given user as the current user
            $this->circlesManager->startSession($federatedUser);
            // Get the given circle
            $circle = $this->circlesManager->getCircle($circleId);
            // Get the initiator of the circle query, which is our current user
            $member = $circle->getInitiator();
            // Check the permission level of the initiator
            $isUserInCircle = $member !== null && $member->getLevel() >= Member::LEVEL_MEMBER;
            return $isUserInCircle;
        } catch (\Throwable $e) {
            // Handle the exception
        }
        return false;
    }
