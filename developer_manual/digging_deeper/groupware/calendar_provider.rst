
.. _calendar-providers:

========================================
Integration of custom calendar providers
========================================

Nextcloud apps can register calendars in addition to the internal calendars of the Nextcloud CalDAV back end. Calendars are only loaded on demand, therefore a lazy provider mechanism is used.

In order to allow an app to publish calendar entries, they have to interact with the Sabre WebDAV server integrated with the core. This dictates a well-defined structure for the app to use as an interface:

There are classes and interfaces to connect with the WebDAV server. To combine the required interfaces, there are abstract classes prepared by the DAV app that centralizes these access requests. For an app to provide a custom calendar that means that in fact three classes need to be defined and all inherited methods need to be implemented:

1. A *calendar object* class provides access to single elements in a calendar like appointments/events or tasks/todos.
2. A *calendar* class provides access to a single calendar that contains all the corresponding *calendar objects*.
3. An *plugin* class that registers the calendar with the rest of the CalDAV system.

.. note:: Please be aware that this section uses the classes in ``\OCA\DAV`` which is by definition no public interface. Once there is a central solution presented, this should be updated.

Please note that CalDAV bases on WebDAV. WebDAV is a standardized way to access files over a network connection. Thus, the same notions are applied when handling calendars (and contacts). A calendar is mapped to a folder while an event in a calendar is mapped to a (relative) file. Having thin in your ind will allow you to get the principles of the API faster.

In the following sections, all these parts are considered separately. As there are quite some methods to be implemented, first the general structure of the classes are presented without implementing the abstract methods. Then, the methods are handled in groups to simplify reading.

All snippets are prefixed by ``<?php`` to make you aware that this is still php code (and enable the code styling in this document). Of course, you do not need to repeat the opening tags.

The calendar object class
-------------------------

There need to be a class that represents a single entry in a calendar. The naming of said class can be arbitrary, it must however implement the interfaces ``\Sabre\CalDAV\ICalendarObject`` and ``\Sabre\CalDAV\IACL``. The basic structure looks like this:

.. code-block:: php

    <?php

    namespace OCA\YourAppName\DAV;

    class CalendarObject implements \Sabre\CalDAV\ICalendarObject, \Sabre\DAVACL\IACL {
        /** @var Calendar */
        private $calendar;
        /** @var string */
        private $name;

        /**
        * CalendarObject constructor.
        *
        * @param Calendar $calendar
        * @param string $name
        */
        public function __construct(Calendar $calendar, string $name) {
            $this->calendar = $calendar;
            $this->name = $name;
        }

        // Implement all remaining functions here ...
    }

The ``Calendar`` class is the class as defined in the next section representing a complete calendar.

The calendar object as well as the name of the entry is given as arguments of the constructor by the calendar class. For now, they are saved into attributes for later usage.

Basic event information -- INode
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are some basic methods that need to be implemented on each calendar object instance. These are defined ``\Sabre\DAV\INode``.

.. code-block:: php

    <?php

    function delete() {
        throw new \Sabre\DAV\Exception\Forbidden('This calendar-object is read-only');
    }

Removal of calendar events is not allowed in this example. Otherwise, the backend needs to be updated.    

.. code-block:: php

    <?php

    function getName() {
        return $this->name;
    }

The name of the event can be obtained using the ``getName`` method. Here, the saved name in the attributes is just returned.

.. code-block:: php

    <?php

    function setName($name) {
        throw new \Sabre\DAV\Exception\Forbidden('This calendar-object is read-only');
    }

Updating the name is not considered a good idea, thus it will be cancelled by a Exception. One could also update the backend if this should be possible.

.. code-block:: php

    <?php

    function getLastModified() {
        return time();
    }

The method ``getLastModified`` must return a unix timestamp that represents the modified date. This can be used by the client to selectively update whatever structure.

Returning ``null`` is allowed to indicate that no modification time stamp can be obtained.

Event data -- IFile
~~~~~~~~~~~~~~~~~~~

The main data of a calendar object is stored in the ``\Sabre\DAV\IFile`` interface. There are a few additional methods that help during the usage.

.. code-block:: php

    <?php

    function getSize() {
        return strlen($this->get());
    }

One helper function is the ``getSize`` method to get the number of bytes that represent this calendar entry's representation. Nothing fancy is done in this method.

.. code-block:: php

    <?php

    function getETag() {
        return '"' . md5($this->get()) . '"';
    }

The calculation of an E-Tag can be calculated using the ``getETag`` method. Note, that the returned E-Tag must have the double quotes as part of the returned string.

One can also return ``null`` to indicate that the E-Tag cannot be calculated effectively.

.. code-block:: php

    <?php

    function getContentType() {
        return 'text/calendar; charset=utf-8';
    }

The content type of the calendar entry must be provided as well.

.. code-block:: php

    <?php

    function get() {
        $name = $this->getName();
        return <<<EOF
    BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//Nextcloud/DavCalendarDemo//NONSGML v1.0//EN
    BEGIN:VEVENT
    UID:$name@example.com
    DTSTAMP:20200101T170000Z
    DTSTART:20200130T170000Z
    DTEND:20200130T180000Z
    SUMMARY:Example $name
    END:VEVENT
    END:VCALENDAR
    EOF;
    }

The actual calendar entry can be obtained by the ``get`` method. This must for sure match the content type above. See the official documentation on vcal calendars on the possible format as well.

.. code-block:: php

    <?php

    function put($data) {
        throw new \Sabre\DAV\Exception\Forbidden('This calendar-object is read-only');
    }

It is possible the client tries to update teh appointment with the ``put`` method.

In this example, no update is considered. If you plan to allow for that, you are responsible to parse and store the appropriate data in whatever location.

Access restrictions -- IACL
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The calendar entities are completed by a set of access rules. These allow a client to know if certain actions are to be allowed or not.

.. code-block:: php

    <?php

    function getOwner() {
        return null;
    }

    function getGroup() {
        return null;
    }

The owner and corresponding groups of the calendar entry can be specified as uris. If no owner or group is present, a ``null`` value should be returned.

As typically the calendar belongs to a user and the individual entries to the calendar, the entries do not need a dedicated user set in our example. For more complex approaches see the official documentation of CalDAV.

.. code-block:: php

    <?php

    function getSupportedPrivilegeSet() {
        return null;
    }

The ``getSupportedPrivilegeSet`` method can be used to query for the privileges to query the entry for dedicated privileges. When a ``null`` is returned, the default privileges set is assumed.

For the example here and most other cases, ``null`` is a good choice.

.. code-block:: php

    <?php

    function getACL() {
        return $this->calendar->getACL();
    }

The real access rules can be obtained by ``getACL``. In this example, we assume that the ACLs are inherited from the calendar. Thus, we delegate the calculation to the calendar class.

.. code-block:: php

    <?php

    function setACL(array $acl) {
        throw new \Sabre\DAV\Exception\Forbidden('Setting ACL is not supported on this node');
    }

Updating the ACLs could be handled with the ``setACL`` method. This example assumes constant ACLs, so it will be rejected with an exception been thrown.

The calendar class
------------------

As mentioned earlier, a single calendar needs to be represented as its own class. Similar to the calendar entity class, the naming is completely irrelevant. It essentially needs to extend the ``OCA\DAV\CalDAV\Integration\ExternalCalendar`` class.

An incomplete skeleton of such a calendar class is presented here that will be filled in the following paragraphs piece by piece:

.. code-block:: php

    <?php
    namespace OCA\YourAppName\DAV;

    use OCA\DAV\CalDAV\Integration\ExternalCalendar;
    use OCA\DAV\CalDAV\Plugin;
    use Sabre\CalDAV\Xml\Property\SupportedCalendarComponentSet;
    use Sabre\DAV\PropPatch;

    class Calendar extends ExternalCalendar {
        /** @var string */
        private $principalUri;
        /** @var string */
        private $calendarUri;

        /**
        * Calendar constructor.
        *
        * @param string $principalUri
        * @param string $calendarUri
        */
        public function __construct(string $principalUri, string $calendarUri) {
            parent::__construct('yourappname', $calendarUri);

            $this->principalUri = $principalUri;
            $this->calendarUri = $calendarUri;
        }

        // The other methods come here ...
    }

This is the basic constructor for the class and some attributes that are stored. We store some provided uris internally for later use.

The parent constructor needs the name of the app as the first parameter. It is thus called explicitly in the first line of the constructor with the correct app name (``yourappname`` in this example).

Some of the methods that need to be implemented are similar to the ones above for the calendar entity class. However, there are different implementations required, so all methods are revisited once in the next paragraphs.

Basic Calendar information -- INode
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The interface ``\Sabre\DAV\INode`` has two methods that need to be implemented by the app's code. The other methods in the interface are already implemented in the ``\OCA\DAV\CalDAV\Integration\ExternalCalendar`` class.

.. code-block:: php
    
    <?php

    function delete() {
        return null;
    }

The calendar should not be removed by means of the CalDAV interface. Thus, nothing is done here.

.. code-block:: php

    <?php
    
    function getLastModified() {
        return time();
    }

The last time the calender is modified allows clients to optimize their requests. This method should return the corresponding unix timestamp.

A fallback is to provide the value ``null`` as return value. This tells that the last modification time is not known at the moment.

Entries in the calendar -- ICollection
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The interface ``\Sabre\DAV\ICollection`` defines methods to access children of the current node. For calendars, the children are in fact the appointments stored within the calendar. Again, some methods are already covered, so here only the required methods are implemented.

All calendar entries do have a unique name. This is just a plain string. Typically these are named as ``.ics`` files.

.. code-block:: php

    <?php
    
    function createFile($name, $data = null) {
        return null;
        // return "\"$etag\"";
    }

This method is used to store new appointments to the calendar. One could return return an ETag of the calendar appointment as a string that contains double quotes as sketched in the comment.

.. code-block:: php

    <?php
    
    function childExists($name) {
        // Check if the value of $name represents a valid calendar entry name.
        return $name === 'test.ics';
    }

The ``childExists`` method checks if a certain element is present in the calendar. In this example we have only one event called ``test.ics``.

.. code-block:: php

    <?php
    
    function getChild($name) {
        if ($this->childExists($name)) {
            return new CalendarObject($this, $name);
        }
    }

This will pack an calendar entry into its own object as described earlier.

The method allows to request a specific entry and extract it from the calendar.

.. code-block:: php

    <?php
    
    function getChildren() {
        // Get the list of calendar entries
        $children = ['test.ics'];

        // Obtain the calendar objects for each of them
        $children = array_map(function ($childName) using ($this) { return $this->getChild($childName); });
        
        return $children;
    }

Finally, there is a class to fetch all appointments of a calendar.

.. note:: For the sake of simplicity, here only a static array is used. One could however query a database or the file system for a variable number of entries in the calendar.

Querying the calendar -- ICalendarObjectContainer
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

For calendar entries it makes little sense to query all and sort on the client the relevant ones. Instead, the client requests a certain set of objects (like the last 90 days) and the server will do the filtering. This can be achieved by the ``\Sabre\CalDAV\ICalendarObjectContainer`` interface.

.. code-block:: php

    <?php
    
    function calendarQuery(array $filters) {
        // In a real implementation this should actually filter
        return ['test.ics'];
    }

Its sole method will return a list of entries. In contrast to the ``getChildren()`` method, the entries are not packed into their own objects. The client is responsible to do this by means of ``getChild()`` in a separate process.

Managing the access to the calendar -- IACL
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The CalDAV defines some security relevant properties. These are implemented by means of ``\Sabre\DAVACL\IACL``. The ACLs define who (in terms of principal uris) is allowed to do what on the calendar.

.. code-block:: php

    <?php
    
    function getOwner() {
        return $this->principalUri;
    }

Get the principal's uri. Here the stored value provided in the constructor is used.

.. code-block:: php

    <?php
    
    function getGroup() {
        return [];
    }

Return all groups uris of the user. Here, no groups are assumed.


.. code-block:: php

    <?php
    
    function getACL() {
        return [
            [
                'privilege' => '{DAV:}read',
                'principal' => $this->getOwner(),
                'protected' => true,
            ],
            [
                'privilege' => '{DAV:}read',
                'principal' => $this->getOwner() . '/calendar-proxy-write',
                'protected' => true,
            ],
            [
                'privilege' => '{DAV:}read',
                'principal' => $this->getOwner() . '/calendar-proxy-read',
                'protected' => true,
            ],
        ];
    }

The ACL defined for this calendar are returned. For the exact definitions, see the documentation of Sabre. At the time of writing this was:

=============  ===============================   =====================================================
entry          values                            description
=============  ===============================   =====================================================
``principal``  uri of principal                  The role or person trying to access the calendar
``privilege``  ``{DAV:}read``, ``{DAV:}write``   Is the role allowed to read or to write
``protected``  ``true``, ``false``               if ``true``, this rule is not allowed to change
=============  ===============================   =====================================================

.. code-block:: php

    <?php
    
    function setACL(array $acl) {
        throw new \Sabre\DAV\Exception\Forbidden('Setting ACL is not supported on this node');
    }

In this example, no updates of the ACL rules are allowed. Thus, an exception is thrown if the client tries to do so.

.. code-block:: php

    <?php
    
    function getSupportedPrivilegeSet() {
        return null;
    }

The supported privileges can be overwritten by implementing this method. When returning ``null`` the default by Sabre is used which is fine for many tasks. See also the documentation of Sabre on this.

Properties of the external calendar -- IProperties
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Finally, there are some properties of a calendar to be specified. The CalDAV interface allows here for a rather generic interface. You will have to visit the details of the CalDAV standard on what properties make sense for you.

.. code-block:: php

    <?php
    
    function getProperties($properties) {
        // A backend should provide at least minimum properties
        return [
            '{DAV:}displayname' => 'Dav Example Calendar: ' . $this->calendarUri,
            '{http://apple.com/ns/ical/}calendar-color'  => '#565656',
            '{' . Plugin::NS_CALDAV . '}supported-calendar-component-set' => new SupportedCalendarComponentSet(['VTODO', 'VEVENT']),
        ];
    }

Here a basic stub of calendar properties are provided. It is a basic name, a color and the setting to allow both appointments (``VEVENT``) and tasks (``VTODO``) in the calendar.

.. code-block:: php

    <?php
    
    function propPatch(PropPatch $propPatch) {
        // We can just return here and let oc_properties handle everything
    }

This method needs implementation to satisfy PHP but can be left empty as the core handles this most probably.


The calendar plugin class
-------------------------

The last class that needs to be implemented is the *plugin* class.

.. code-block:: php

    <?php
    namespace OCA\YourAppName\DAV;

    use OCA\DAV\CalDAV\Integration\ExternalCalendar;
    use OCA\DAV\CalDAV\Integration\ICalendarProvider;

    class CalendarPlugin implements ICalendarProvider {

        public function getAppId(): string {
            return 'yourappname';
        }

        public function fetchAllForCalendarHome(string $principalUri): array {
            return [
                new Calendar($principalUri, 'my-calendar-1234'),
            ];
        }

        public function hasCalendarInCalendarHome(string $principalUri, string $calendarUri): bool {
            return $calendarUri === 'my-calendar-1234';
        }

        public function getCalendarInCalendarHome(string $principalUri, string $calendarUri): ?ExternalCalendar {
            if ($this->hasCalendarInCalendarHome($principalUri, $calendarUri)) {
                return new Calendar($principalUri, $calendarUri);
            }

            return null;
        }
    }

The calendar plugin class needs to implement the interface ``\OCA\DAV\CalDAV\Integration\ICalendarProvider`` that defines some methods to query the list of calendars an app can provide.

The method ``getAppId`` is mainly for accounting and returns the name of the app.

The method ``fetchAllForCalendarHome`` returns a list of all calendars class instance that the app knows of. In this example only one calendar is registered. By adding further entries to the array, more calendars can be made available.

Note the ``principalUri`` is passed by the caller while the ``calendarUri`` in the constructor of the calendar instance is just some (relative) uri (string) that identifies the calender uniquely. It can then be used in the calendar class to extract the appropriate entries that should be present in the calendar.

Again, there is a function ``hasCalendarInCalendarHome`` that checks if a certain combination of ``principalUri`` and ``calendarUri`` are existing. Here, it is just hard-coded to exactly one calendar.

Finally, there is a function to query for a single calendar instance using ``getCalendarInCalendarHome``. It returns a single calendar instance or ``null`` if no matching calendar is found.

Register the calender provider
------------------------------

As a last step, you must register the calendar provider in your ``info.xml`` by adding

.. code-block:: xml

    <sabre>
        <calendar-plugins>
            <plugin>OCA\YourAppName\DAV\CalendarPlugin</plugin>
        </calendar-plugins>
    </sabre>

With all these steps done, you should be able to see the calender(s) in the calendar app and the CalDAV interface of the core.

Appendix: Registering the calendar with the PHP API interface
-------------------------------------------------------------

Additionally to the registration in the DAV app, the core provides another way to register a calendar.

.. note:: Currently, the PHP API is not used by the DAV app. Any registered calendar will not automatically show up in the calendar's view or the CalDAV list. This might change in the future, thus it might be a good idea to provide this interface as well.

Read-only support
~~~~~~~~~~~~~~~~~

To provide calendar(s) you have to write a class that implements the ``OCP\Calendar\ICalendarProvider`` interface.

.. code-block:: php

    <?php

    use OCP\Calendar\ICalendarProvider;

    class CalendarProvider implements ICalendarProvider {

        public function getCalendars(string $principalUri, array $calendarUris = []): array {
            $calendars = [];
            // TODO: Run app specific logic to find calendars that belong to
            //       $principalUri and fill $calendars

            // The provider can simple return an empty array if there is not
            // a single calendar for the principal URI
            if (empty($calendars)) {
                return [];
            }

            // Return instances of \OCP\Calendar\ICalendar
            return $calendars;
        }
    }

This ``CalendarProvider`` class is then registered in the :ref:`register method of your Application class<Bootstrapping>` with ``$context->registerCalendarProvider(CalendarProvider::class);``.


Write support
~~~~~~~~~~~~~

Calendars that only return `ICalendar` are implicitly read-only. If your app's calendars can be written to, you may implement the ``ICreateFromString``. It will allow other apps to write calendar objects to the calendar by passing the raw iCalendar data as string.

.. code-block:: php

    <?php

    use OCP\Calendar\ICreateFromString;

    class CalendarReadWrite implements ICreateFromString {

        // ... other methods from ICalendar still have to be implemented ...

        public function createFromString(string $name, string $calendarData): void {
            // Write data to your calendar representation
        }

    }

Handling iMIP data 
~~~~~~~~~~~~~~~~~~

You may implement the ``IHandleIMipMessage`` interface to process iMIP data you receive in a client and want to pass on for processing to the backend. 

Please be aware that there are some security considerations to take into account. You can find more infomation on these and the conditions that have to be fulfilled for iMIP data to be processed in the `RFC <https://www.rfc-editor.org/rfc/rfc6047>`_

.. code-block:: php

    <?php

    use OCP\Calendar\IHandleIMipMessage;

    class HandleIMipMessage implements IHandleIMipMessage {

        public function handleIMipMessage(string $name, string $calendarData): void {
            // Validation and write to your calendar representation
        }

    }
