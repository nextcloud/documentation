API reference
=============


PHP public API
--------------

The public API is contained in the OCP namespace. See the `OCP API reference
<https://nextcloud-server.netlify.app/>`_ for further details.

The API is split into two categories. Those are indicated by attributes.

``Consumable``, ``Listenable`` and ``Catchable``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Interfaces, Enums and classes that have the ``OCP\AppFramework\Attribute\Consumable`` attribute, must only be consumed by apps and can not be implemented by apps themselves.
This means the server side can extend the interface with new methods or reduce returned types of existing methods without it being consider an API break.
However argument types of existing methods can **not** be reduced.
Same rules apply to ``OCP\EventsDispatcher\Event`` that have the ``OCP\AppFramework\Attribute\Listenable`` attribute and ``Exception`` with the ``OCP\AppFramework\Attribute\Catchable`` attribute.

``Implementable``, ``Dispatchable`` and ``Throwable``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Interfaces, Enums and classes that have the ``OCP\AppFramework\Attribute\Implementable`` attribute, can be implemented by apps.
This means the server side can **not** extend the interface with new methods or reduce returned types of existing methods without it being consider an API break.
However argument types of existing methods can be reduced.
Same rules apply to ``OCP\EventsDispatcher\Event`` that have the ``OCP\AppFramework\Attribute\Dispatchable`` attribute and ``Exception`` with the ``OCP\AppFramework\Attribute\Throwable`` attribute.

``ExceptionalImplementable``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Despite not being implementable for all apps, some interfaces can have the ``OCP\AppFramework\Attribute\ExceptionalImplementable`` attribute indicating that they are implementable by a single app (or multiple).
In those cases the general ``OCP\AppFramework\Attribute\Consumable`` rules apply, but the app maintainers or repository of named exceptions have to be informed during the process of a pull request, leaving them enough time to align with the upcoming change.


PHP unstable API
----------------

To avoid releasing incomplete public API, it is possible to release a
first version of the future API in the `NCU` namespace, following these rules:

- Files are located in ``/lib/unstable/``
- Code quality, comments, tests and psalm check are expected to be identical to the `OCP` namespace.
- Classes must be tag as ``@experimental``, including the current version of Nextcloud.
- Tag ``@since`` must not be used in the `NCU` namespace.
- Code from the `OCP` namespace must never mention anything coming from the `NCU` namespace. It can not require it as an argument, constant or return something from `NCU`.
- An API can only live in this unstable namespace for one major release.
- During this testing phase, the code and the API can be modified/restructured without limitation.
- API within the testing namespace must have up-to-date documentation.
- If accepted, the API will be copied to the `OCP` public namespace.
- Once tested, the version from the `NCU` namespace will be marked as deprecated.
- Deprecated API from the `NCU` namespace are kept for 2 major releases.

.. note::
  - API from `NCU` are included to the ``nextcloud-deps/OCP`` package for easier testing with psalm
