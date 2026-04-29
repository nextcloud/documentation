============
External API
============

.. sectionauthor:: Tom Needham <tom@owncloud.com>

Introduction
------------
The external API inside Nextcloud allows third party developers to access data
provided by Nextcloud apps. Nextcloud follows the `Open Collaboration Services
specification <https://open-collaboration-services.org>`_.

Usage
-----

Registering methods
^^^^^^^^^^^^^^^^^^^

Methods are registered inside the :file:`appinfo/routes.php` by returning an
array holding the endpoint meta data.

.. code-block:: php

  <?php

  return [
    'ocs' => [
      // Apps
      ['name' => 'Bar#getFoo', 'url' => '/foobar', 'verb' => 'GET'],
    ],
  ];

Returning data
^^^^^^^^^^^^^^

Once the API backend has matched your URL, your callable function as defined in
**BarController::getFoo** will be executed. The AppFramework will make sure that
send parameters are provided to the method based on its declaration.

Be sure to extend the ``OCP\AppFramework\OCSController`` from the AppFramework.
Your functions then should returns a ``OCP\AppFramework\Http\DataResponse``. The
AppFramework will then take care formatting the response properly.

Exceptions
^^^^^^^^^^

To throw an exception to the user in the OCS response. You can throw an
``OCP\AppFramework\OCS\OCSException``. You can set the message and code.

There are 3 commonly used exceptions already available:

* ``OCSBadRequestException``
* ``OCSForbiddenException``
* ``OCSNotFoundException``

Authentication & basics
^^^^^^^^^^^^^^^^^^^^^^^

The requests to the OCS endpoint often have to be authenticated.

    ``curl -u user:password https://example.com/ocs/v2.php/apps/yourapp/foobar``

Output
^^^^^^

The output defaults to XML. If you want to get JSON append this to the URL::

    ?format=json

Or set the proper Accept header::

    Accept: application/json

Output from the application is wrapped inside a **data** element:

**XML**:

.. code-block:: xml

    <?xml version="1.0"?>
    <ocs>
     <meta>
      <status>ok</status>
      <statuscode>200</statuscode>
      <message/>
     </meta>
     <data>
       <!-- data here -->
     </data>
    </ocs>


**JSON**:

.. code-block:: js

    {
      "ocs": {
        "meta": {
          "status": "ok",
          "statuscode": 200,
          "message": null
        },
        "data": {
          // data here
        }
      }
    }

Statuscodes
^^^^^^^^^^^

The statuscode can be any of the following numbers:

* **200** - successful
* **996** - server error
* **401** - not authorized
* **404** - not found
* **999** - unknown error

Changing API and backwards compatibility
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

We aim to keep our API as stable as possible to avoid breaking third-party apps.
Before an API is allowed to be removed, it should be marked as deprecated for at
least 3 years (9 Nextcloud releases) before it gets removed.

Changing the API `should be discussed in a github issue in our server repo
<https://github.com/nextcloud/server/issues>`_. A pull request is most welcome.
