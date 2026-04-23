.. _activity-api:

============
Activity API
============

The Activity app provides an API for other Nextcloud apps to publish
events, display them in the activity stream, and let users control
their notification preferences. It also exposes a REST API for
clients to consume the activity stream.

The extension API consists of four interfaces, all in the ``OCP``
namespace:

* **IEvent** — The activity event object
* **IProvider** — Parses and translates activities for display
* **ISetting** — Defines activity types and notification preferences
* **IFilter** — Adds filters to the activity stream sidebar

All three extension interfaces (IProvider, ISetting, IFilter) are
registered in your app's ``appinfo/info.xml``.


Registering activity components
-------------------------------

Add an ``<activity>`` section to your ``appinfo/info.xml`` to register
providers, settings, and filters:

.. code-block:: xml

   <?xml version="1.0"?>
   <info>
       ...
       <activity>
           <settings>
               <setting>OCA\MyApp\Activity\Setting</setting>
           </settings>

           <filters>
               <filter>OCA\MyApp\Activity\Filter</filter>
           </filters>

           <providers>
               <provider>OCA\MyApp\Activity\Provider</provider>
           </providers>
       </activity>
   </info>

Each value is the fully qualified class name of the implementation.


Creating and publishing events
------------------------------

To create and publish an activity event, generate an ``IEvent`` from
the activity manager and call ``publish()``:

.. code-block:: php

   <?php
   // IManager is injected via dependency injection
   $event = $this->activityManager->generateEvent();
   $event->setApp('myapp')
       ->setType('myapp_action')
       ->setAffectedUser('targetUser')
       ->setSubject('subject_key', ['param1' => 'value1'])
       ->setObject('myobject', 42, 'Object Name');
   $this->activityManager->publish($event);

Required fields
^^^^^^^^^^^^^^^

The following must be set before publishing:

* ``setApp()`` — Your app ID
* ``setType()`` — Must match an ``ISetting::getIdentifier()``
* ``setAffectedUser()`` — The user who will see this activity
* ``setSubject()`` — A subject key and optional parameters
* ``setObject()`` — The object type, ID, and name

Optional fields
^^^^^^^^^^^^^^^

* ``setAuthor()`` — If unset, the current user is used
* ``setTimestamp()`` — If unset, the current time is used
* ``setMessage()`` — An additional message key and parameters
* ``setLink()`` — Should typically be set in ``IProvider::parse()``
  instead
* ``setIcon()`` — Should typically be set in ``IProvider::parse()``
  instead

.. note:: Do not call ``setParsedSubject()``, ``setRichSubject()``,
   ``setParsedMessage()``, ``setRichMessage()``, or
   ``setChildEvent()`` when publishing. These are not persisted and
   should be set in your provider's ``parse()`` method.


Implementing a provider
-----------------------

Providers implement ``OCP\Activity\IProvider`` to parse, translate,
and beautify activities for display. The interface has a single
``parse()`` method.

Check responsibility
^^^^^^^^^^^^^^^^^^^^

First, check whether the event belongs to your app. If not, throw
``UnknownActivityException`` so the activity app passes it to the
next provider:

.. code-block:: php

   <?php
   public function parse(string $language, IEvent $event, ?IEvent $previousEvent = null): IEvent {
       if ($event->getApp() !== 'myapp') {
           throw new \OCP\Activity\Exceptions\UnknownActivityException();
       }

       // ... parse the event
   }

.. note:: ``UnknownActivityException`` was added in Nextcloud 30.
   For older versions, throw ``\InvalidArgumentException`` instead.

Set the parsed subject
^^^^^^^^^^^^^^^^^^^^^^

At minimum, you must call ``setParsedSubject()`` with a translated,
plain-text string:

.. code-block:: php

   $event->setParsedSubject(
       $this->l->t('You created %1$s', [$event->getObjectName()])
   );

Additionally, you should call:

* ``setIcon()`` — A full URL to an icon for the activity
* ``setRichSubject()`` — A translated string with placeholders and
  a parameter array for rich display

.. note:: Starting with Nextcloud 26, calling ``setRichSubject()``
   automatically generates a parsed subject, so a separate
   ``setParsedSubject()`` call is no longer required.

Rich object strings
^^^^^^^^^^^^^^^^^^^

Rich subjects allow the UI to render interactive elements like file
links and user avatars. The ``setRichSubject()`` method takes a
translated string with placeholders and an array of typed objects:

.. code-block:: php

   $event->setRichSubject(
       $this->l->t('You added {file} to your favorites'),
       ['file' => [
           'type' => 'file',
           'id' => (string) $event->getObjectId(),
           'name' => basename($event->getObjectName()),
           'path' => $event->getObjectName(),
       ]]
   );

Available object types and their required keys are defined in
`OCP\\RichObjectStrings\\Definitions <https://github.com/nextcloud/server/blob/master/lib/public/RichObjectStrings/Definitions.php>`__.

Short vs. long translations
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

File-related activities support a short form (e.g. "Added to
favorites") for the sidebar and a long form (e.g. "You added
hello.jpg to your favorites") for the stream. Check
``IManager::isFormattingFilteredObject()`` to decide which form to
use.

Merging activities
^^^^^^^^^^^^^^^^^^

Related activities can be merged automatically using
``OCP\Activity\IEventMerger`` (inject via dependency injection).
The merger combines events when all of the following are met:

* Same ``getApp()``
* No message set (``getMessage()`` is empty)
* Same ``getSubject()``
* Same ``getObjectType()``
* Time difference is less than 3 hours
* At most 5 events are merged

Do not merge events manually if these requirements are not met.


Implementing a setting
----------------------

Settings define activity types and appear on the personal
notification preferences page. They implement
``OCP\Activity\ISetting``.

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Method
     - Description
   * - ``getIdentifier()``
     - Unique ID (lowercase ``a-z`` and underscores only). **Must
       match** the value used in ``IEvent::setType()``.
   * - ``getName()``
     - Translated, short description. May use ``<strong>`` for
       emphasis.
   * - ``getIcon()``
     - Absolute URL to a 32x32 pixel icon (SVG preferred).
   * - ``getPriority()``
     - ``0`` (first) to ``100`` (last). Use ``70`` as default.
       Values below ``10`` are reserved.
   * - ``isDefaultEnabledStream()``
     - Whether stream display is enabled by default for new users.
   * - ``isDefaultEnabledMail()``
     - Whether email notifications are enabled by default.
   * - ``canChangeStream()``
     - Whether users can toggle stream display.
   * - ``canChangeMail()``
     - Whether users can toggle email notifications.

When both ``canChangeStream()`` and ``canChangeMail()`` return
``false``, the setting is hidden from the personal page entirely.


Implementing a filter
---------------------

Filters restrict the activity stream and appear in the sidebar
navigation. They implement ``OCP\Activity\IFilter``.

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Method
     - Description
   * - ``getIdentifier()``
     - Unique ID (lowercase ``a-z`` and underscores only). Used in
       URLs.
   * - ``getName()``
     - Translated label, 1-3 short words.
   * - ``getIcon()``
     - Absolute URL to a 32x32 pixel icon (SVG preferred).
   * - ``getPriority()``
     - ``0`` (first) to ``100`` (last). Use ``70`` as default.
       Values below ``10`` are reserved.
   * - ``allowedApps()``
     - Return an array of app IDs to show, or an empty array for
       all apps.
   * - ``filterTypes()``
     - Receives a list of type identifiers (from ``ISetting``),
       return a filtered subset. Return the input unchanged to show
       all types.

Example filtering to only show calendar todo activities:

.. code-block:: php

   public function filterTypes(array $types): array {
       return array_intersect(['calendar_todo'], $types);
   }


REST API (v2)
-------------

The Activity app exposes a REST API for clients to consume the
activity stream.

Capabilities
^^^^^^^^^^^^

The API advertises its features via capabilities:

.. code-block:: xml

   GET /ocs/v2.php/cloud/capabilities

   <activity>
    <apiv2>
     <element>filters</element>
     <element>previews</element>
     <element>rich-strings</element>
    </apiv2>
   </activity>

Endpoints
^^^^^^^^^

.. code-block:: text

   GET /ocs/v2.php/apps/activity/api/v2/activity
   GET /ocs/v2.php/apps/activity/api/v2/activity/{filter}
   GET /ocs/v2.php/apps/activity/api/v2/activity/filters

Parameters
^^^^^^^^^^

.. list-table::
   :header-rows: 1
   :widths: 20 15 65

   * - Name
     - Type
     - Description
   * - ``since``
     - int
     - ID of the last activity seen (optional)
   * - ``limit``
     - int
     - Number of activities to return (default: ``50``, optional)
   * - ``object_type``
     - string
     - Filter by object type. Requires ``object_id`` and the
       ``filter`` type filter (optional)
   * - ``object_id``
     - string
     - Filter by object ID. Requires ``object_type`` and the
       ``filter`` type filter (optional)
   * - ``sort``
     - string
     - ``asc`` or ``desc`` (default: ``desc``, optional)

HTTP status codes
^^^^^^^^^^^^^^^^^

.. list-table::
   :header-rows: 1
   :widths: 20 80

   * - Code
     - Description
   * - ``200 OK``
     - Activities returned
   * - ``204 No Content``
     - User has no activities selected for the stream
   * - ``304 Not Modified``
     - ETag matches or end of list reached
   * - ``403 Forbidden``
     - Offset activity belongs to another user, or not logged in
   * - ``404 Not Found``
     - Unknown filter

Response headers
^^^^^^^^^^^^^^^^

``Link``
   URL for the next page of results, including all parameters:
   ``<https://cloud.example.com/ocs/v2.php/apps/activity/api/v2/activity/all?since=364>; rel="next"``

``X-Activity-First-Known``
   ID of the first known activity (when ``since`` was not recognized).

``X-Activity-Last-Given``
   ID to use as ``since`` for the next request.

Activity element fields
^^^^^^^^^^^^^^^^^^^^^^^

.. list-table::
   :header-rows: 1
   :widths: 20 15 65

   * - Field
     - Type
     - Description
   * - ``activity_id``
     - int
     - Unique activity ID
   * - ``datetime``
     - string
     - ISO 8601 timestamp
   * - ``app``
     - string
     - App that created the activity
   * - ``type``
     - string
     - Activity type identifier
   * - ``user``
     - string
     - User ID of the actor (may be empty)
   * - ``subject``
     - string
     - Translated plain-text subject
   * - ``subject_rich``
     - array
     - Rich subject: ``[0]`` is the template string, ``[1]`` is the
       parameters object
   * - ``message``
     - string
     - Translated plain-text message (optional)
   * - ``message_rich``
     - array
     - Rich message, same format as ``subject_rich`` (optional)
   * - ``icon``
     - string
     - Full URL to the activity icon (optional)
   * - ``link``
     - string
     - Full URL to the relevant location (optional)
   * - ``object_type``
     - string
     - Type of the related object (optional)
   * - ``object_id``
     - int
     - ID of the related object (optional)
   * - ``object_name``
     - string
     - Name or path of the related object (optional)
   * - ``previews``
     - array
     - List of preview elements for file activities (optional)

Example response
^^^^^^^^^^^^^^^^

.. code-block:: json

   {
     "activity_id": 1,
     "datetime": "2015-11-20T12:49:31+00:00",
     "app": "files",
     "type": "file_created",
     "user": "test1",
     "subject": "test1 created hello.txt",
     "subject_rich": {
       "0": "{user1} created {file1}",
       "1": {
         "user1": {
           "type": "user",
           "id": "test1",
           "name": "Test User"
         },
         "file1": {
           "type": "file",
           "id": 23,
           "name": "hello.txt",
           "path": "/test/hello.txt"
         }
       }
     },
     "icon": "https://cloud.example.com/apps/files/img/add-color.svg",
     "link": "https://cloud.example.com/apps/files/?dir=/test",
     "object_type": "files",
     "object_id": 23,
     "object_name": "/test/hello.txt",
     "previews": [
       {
         "source": "https://cloud.example.com/core/preview.png?file=/hello.txt&x=150&y=150",
         "link": "https://cloud.example.com/apps/files/?dir=/test&scrollto=hello.txt",
         "mimeType": "text/plain",
         "fileId": 23,
         "view": "files",
         "isMimeTypeIcon": false,
         "filename": "hello.txt"
       }
     ]
   }

.. note:: Additional fields not listed above may appear in responses
   for backwards compatibility but should be ignored.


Further reading
---------------

The Activity app repository contains additional documentation with
more detailed examples:

* `Creating events <https://github.com/nextcloud/activity/blob/master/docs/create.md>`__
* `Implementing a provider <https://github.com/nextcloud/activity/blob/master/docs/provider.md>`__
* `Implementing a setting <https://github.com/nextcloud/activity/blob/master/docs/setting.md>`__
* `Implementing a filter <https://github.com/nextcloud/activity/blob/master/docs/filter.md>`__
* `REST API v2 endpoint <https://github.com/nextcloud/activity/blob/master/docs/endpoint-v2.md>`__
