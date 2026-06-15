.. _critical-changes:

================
Critical changes
================

..
    Add one section for each change.
    Only list changes absolutely necessary to keep an app running. Use the dedicated deprecation and new features pages for optional changes and announcements.

    The sections are somewhat ordered so changes affecting most apps come first, and more specific ones come later.


info.xml requirements
---------------------

Update info.xml to add Nextcloud 35 to the support range:

.. code-block:: xml

  <dependencies>
    <nextcloud min-version="35" max-version="35" />
  </dependencies>

To allow installation on older versions too, just keep the previous min-version.

Updated PHP requirements
------------------------

The support for PHP 8.2 has been dropped, the minimum supported PHP version of Nextcloud 35 is now 8.3.

Removed front-end APIs and libraries
------------------------------------

- TBD

Removed back-end APIs
---------------------

- All these interfaces were deprecated since Nextcloud 23 and were removed without replacement:
  - ``\OCP\Remote\ICredentials``
  - ``\OCP\Remote\IInstance``
  - ``\OCP\Remote\IInstanceFactory``
  - ``\OCP\Remote\IUser``
  - ``\OCP\Remote\API\IUserApi``
  - ``\OCP\Remote\API\ICapabilitiesApi``
  - ``\OCP\Remote\API\IApiFactory``
  - ``\OCP\Remote\API\IApiCollection``

- All the deprecated methods of ``\OCP\Calendar\Resource\IManager`` and ``\OCP\Calendar\Room\IManager`` were deprecated since Nextcloud 24 and were removed without replacement.
- The ``\OCP\Collaboration\AutoComplete\AutoCompleteEvent`` event was deprecated since Nextcloud 28 and was removed with ``OCP\Collaboration\AutoComplete\AutoCompleteFilterEvent`` as replacement;
