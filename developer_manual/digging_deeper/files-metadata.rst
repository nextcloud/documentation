==============
Files Metadata
==============

.. versionadded:: 28

Nextcloud includes an API to manage files' metadata, with a deep integration in WebDAV.


Concept overview
----------------

When a file is created or modified on Nextcloud, a refresh of its metadata is initiated. You will then be able to listen to the `MetadataLiveEvent` event to create, update, or delete metadata. If you suspect your process to be hungry in time or resources, you can request for a background event called `MetadataBackgroundEvent` and do your work there.

Consuming the Files Metadata API
--------------------------------

To consume the Files Metadata API, you will need to :ref:`inject<dependency-injection>` ``IFilesMetadataManager``.
This manager offers the following methods:

 * ``refreshMetadata(Node $node, int $process)`` This method will initiate the process of refreshing the metadata related to a file.
 * ``getMetadata(int $fileId, bool $generate)`` This method will returns a ``IFilesMetadata`` which contains metadata related to a file.
 * ``saveMetadata(IFilesMetadata $filesMetadata)`` Save a ``IFilesMetadata`` and generate indexes.
 * ``deleteMetadata(int $fileId)`` Delete all metadata related to a file.
 * ``getMetadataQuery(IQueryBuilder $qb, string $fileTableAlias, string $fileIdField)`` This method will returns a ``IMetadataQuery`` to help building Sql request.
 * ``getKnownMetadata()`` Returns a list of known metadata keys globally available to the instance, and the expected type for each value.
 * ``initMetadata(string $key, string $type, bool $indexed, bool $remotelyEditable)`` This method allow to initiate a metadata before any of the files is examined


Live & Background Events
------------------------

Two (2) events can be caught by your app to generate metadata. The first one is called on the main process, just after the upload/modification of the file.
The second one is called on a background process, initiated by cronjob.

 * ``OCP\FilesMetadata\Event\MetadataLiveEvent``
 * ``OCP\FilesMetadata\Event\MetadataBackgroundEvent``

Both events contain those methods:

 * ``getNode()`` Returns related ``Node``.
 * ``getMetadata()`` Returns ``IFilesMetadata``. Any changes made to this object will be saved at the end of the event.

Generating metadata from a file might require a lot of resources; in that case it is advised to run this generation
on a background job by requesting a re-run by calling the method ``MetadataLiveEvent::requestBackgroundJob()``

.. code-block:: php
    :emphasize-lines: 23, 24

    <?php
    /** lib/AppInfo/Application.php */
    declare(strict_types=1);

    namespace OCA\MyApp\AppInfo;

    use OCA\MyApp\Listeners\UpdateFilesMetadata;
    use OCP\AppFramework\App;
    use OCP\AppFramework\Bootstrap\IBootContext;
    use OCP\AppFramework\Bootstrap\IBootstrap;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;
    use OCP\FilesMetadata\Event\MetadataBackgroundEvent;
    use OCP\FilesMetadata\Event\MetadataLiveEvent;
    use OCP\FilesMetadata\IFilesMetadataManager;
    use OCP\FilesMetadata\Model\IMetadataValueWrapper;

    class Application extends App implements IBootstrap {
        public function __construct(array $params = []) {
            parent::__construct('my_app', $params);
    	}

        public function register(IRegistrationContext $context): void {
            $context->registerEventListener(MetadataLiveEvent::class, UpdateFilesMetadata::class);
            $context->registerEventListener(MetadataBackgroundEvent::class, UpdateFilesMetadata::class);
        }

    	public function boot(IBootContext $context): void {
        }
    }

.. note::
    If the generation of metadata requires low resources, the app only need to listen on ``MetadataLiveEvent``

.. code-block:: php

    <?php
    /** lib/Listeners/UpdateFilesMetadata.php */
    declare(strict_types=1);

    namespace OCA\MyApp\Listeners;

    use OCP\EventDispatcher\Event;
    use OCP\EventDispatcher\IEventListener;
    use OCP\FilesMetadata\Event\MetadataBackgroundEvent;
    use OCP\FilesMetadata\Event\MetadataLiveEvent;

    class UpdateFilesMetadata implements IEventListener {
        public function __construct() {
        }

        public function handle(Event $event): void {
            if (!($event instanceof MetadataLiveEvent) &&
                !($event instanceof MetadataBackgroundEvent)) {
                return;
            }

            $node = $event->getNode();

            // my-first-meta is light enough
            $metadata = $event->getMetadata();
            $metadata->setString('my-first-meta', 'yes');

            if ($event instanceof MetadataLiveEvent) {
                $event->requestBackgroundJob();
                return;
            }

            // my-second-meta is too heavy and should be run on a background job
            $metadata->setInt('my-second-meta', 1234, true);
        }
    }


Read metadata using occ command
-------------------------------

Stored metadata related to a file can be obtained from a console, using the ``occ`` command:

.. code-block:: console

    $ ./occ metadata:get 1742
    {
        "my-first-meta": {
            "value": "yes",
            "type": "string",
            "indexed": false
        },
        "my-second-meta": {
            "value": 1234,
            "type": "int",
            "indexed": true
        }
    }

.. note::
    The generation process can also be initiated, using the ``--refresh`` option. Please note that the file owner need to be specified in the command.
    When refreshing metadata from the console, both ``MetadataLiveEvent`` and ``MetadataBackgroundEvent`` are triggered, without waiting for the next tick of crontab


Update metadata using PROPPATCH
-------------------------------

Using WebDAV request, a client can create or update metadata about a file:

.. code-block:: console

    curl 'https://cloud.example.net/remote.php/dav/files/test/document.txt' \
        --user test:test \
        --request PROPPATCH \
        --data '<?xml version="1.0" encoding="UTF-8"?>
            <d:propertyupdate xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
                <d:set>
                    <d:prop>
                        <nc:metadata-myapp-test>123</nc:metadata-myapp-test>
                    </d:prop>
                </d:set>
            </d:propertyupdate>'

This will return a result like

.. code-block:: xml

    <?xml version="1.0"?>
    <d:multistatus xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
        <d:response>
            <d:href>/remote.php/dav/files/test/document.txt</d:href>
            <d:propstat>
                <d:prop>
                    <nc:metadata-myapp-test/>
                </d:prop>
                <d:status>HTTP/1.1 200 OK</d:status>
            </d:propstat>
        </d:response>
    </d:multistatus>

.. note::
    WebDAV prefixes metadata with ``<nc:metadata-``, which means that the metadata name available to the backend in our example is ``myapp-test``.

.. note::
    By default, metadata are not editable/creatable when using a WebDAV PROPPATCH request.
    It is required to initiate it first using ``IFilesMetadataManager::initMetadata()``

.. code-block:: php

    /** lib/AppInfo/Application.php */
    public function boot(IBootContext $context): void {
        /** @var IFilesMetadataManager $metadataManager */
        $metadataManager = $context->getServerContainer()->get(IFilesMetadataManager::class);
        $metadataManager->initMetadata('myapp-test', IMetadataValueWrapper::TYPE_INT, true, IMetadataValueWrapper::EDIT_REQ_OWNERSHIP);
    }


Retrieve metadata using PROPFIND
--------------------------------

Metadata are available to the WebDAV PROPFIND requests:

.. code-block:: console

    curl 'https://cloud.example.net/remote.php/dav/files/test/document.txt' \
        --user test:test \
        --request PROPFIND \
        --data '<?xml version="1.0" encoding="UTF-8"?>
            <d:propfind xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
                <d:prop>
                    <nc:metadata-myapp-test>
                </d:prop>
            </d:propfind>'


This will return a result like

.. code-block:: xml

    <?xml version="1.0"?>
    <d:multistatus xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
        <d:response>
            <d:href>/remote.php/dav/files/test/document.txt</d:href>
            <d:propstat>
                <d:prop>
                    <nc:metadata-myapp-test>123</nc:metadata-myapp-test>
                </d:prop>
                <d:status>HTTP/1.1 200 OK</d:status>
            </d:propstat>
        </d:response>
    </d:multistatus>



WebDAV SEARCH based on metadata
-------------------------------

.. code-block:: console
    :emphasize-lines: 8-10, 19-32, 36-39

    curl 'https://cloud.example.net/remote.php/dav/' \
        --user test:test \
        --request SEARCH \
        --data '<?xml version="1.0" encoding="UTF-8"?>
            <d:searchrequest xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
                <d:basicsearch>
                    <d:select>
                        <d:prop>
                            <nc:metadata-myapp-test />
                        </d:prop>
                    </d:select>
                    <d:from>
                        <d:scope>
                            <d:href>/files/test/</d:href>
                            <d:depth>infinity</d:depth>
                        </d:scope>
                    </d:from>
                    <d:where>
                        <d:and>
                            <d:gt>
                                <d:prop>
                                    <nc:metadata-myapp-test/>
                                </d:prop>
                                <d:literal>10</d:literal>
                            </d:gt>
                            <d:lt>
                                <d:prop>
                                    <nc:metadata-myapp-test/>
                                </d:prop>
                                <d:literal>1000</d:literal>
                            </d:lt>
                        </d:and>
                    </d:where>
                    <d:orderby>
                        <d:order>
                            <d:prop>
                                <nc:metadata-myapp-test/>
                            </d:prop>
                            <d:descending/>
                        </d:order>
                    </d:orderby>
                    <d:limit>
                        <d:nresults>200</d:nresults>
                        <ns:firstresult>0</ns:firstresult>
                    </d:limit>
                </d:basicsearch>
            </d:searchrequest>'


This will return a result like:

.. code-block:: xml

    <?xml version="1.0"?>
    <d:multistatus xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
        <d:response>
            <d:href>/remote.php/dav/files/test/</d:href>
            <d:propstat>
                <d:prop>
                    <nc:metadata-myapp-test/>
                </d:prop>
                <d:status>HTTP/1.1 404 Not Found</d:status>
            </d:propstat>
        </d:response>
        <d:response>
            <d:href>/remote.php/dav/files/test/document.txt</d:href>
            <d:propstat>
                <d:prop>
                    <nc:metadata-myapp-test>123</nc:metadata-myapp-test>
                </d:prop>
                <d:status>HTTP/1.1 200 OK</d:status>
            </d:propstat>
        </d:response>
        <d:response>
            <d:href>/remote.php/dav/files/test/another-one.txt</d:href>
            <d:propstat>
                <d:prop>
                    <nc:metadata-myapp-test>369</nc:metadata-myapp-test>
                </d:prop>
                <d:status>HTTP/1.1 200 OK</d:status>
            </d:propstat>
        </d:response>
    </d:multistatus>


.. warning::
    Metadata used in ORDER and WHERE statement will require metadata to be initiated and set as indexed.
    It is required to call ``IFilesMetadataManager::initMetadata()`` before running the WebDAV request or it will returns an exception because of unknown property.

.. code-block:: php

    /** lib/AppInfo/Application.php */
    public function boot(IBootContext $context): void {
        /** @var IFilesMetadataManager $metadataManager */
        $metadataManager = $context->getServerContainer()->get(IFilesMetadataManager::class);
        $metadataManager->initMetadata('my-second-meta', IMetadataValueWrapper::TYPE_INT, true);
    }


Metadata Query Helper
---------------------

``IFilesMetadataManager::getMetadataQuery(IQueryBuilder $qb, string $fileTableAlias, string $fileIdField)`` returns a ``IMetadataQuery`` to help building Sql request with the following methods.
Parameters when calling the method are the alias of the table, and the name of the field, that contains file ids.

 * ``retrieveMetadata()`` will add a select on the stored metadata
 * ``extractMetadata(array $row)`` convert a fetched row from the resultinto a ``IFilesMetadata``
 * ``joinIndex(string $metadataKey, bool $enforce)`` join the indexes to the request
 * ``getMetadataKeyField(string $metadataKey)`` returns the field and the aliased table of the key of an index
 * ``getMetadataValueField(string $metadataKey)`` returns the field and the aliased table of the value of an index


.. code-block:: php

    // generate your normal query builder
    $qb = new QueryBuilder();
    $qb->select('file_id')
       ->from('my_table', 'my_alias');

    /** @var IFilesMetadataManager $metadataManager */
    $metadataManager = $context->getServerContainer()->get(IFilesMetadataManager::class);

    // get a configured query helper and add a select on the metadata
    $metadataQuery = $metadataManager->getMetadataQuery($qb, 'my_alias', 'file_id');
    $metadataQuery->retrieveMetadata();

    // right join the index table and get only value lower than 8910 for metadata 'my-second-meta'
    $metadataQuery->joinIndex('my-second-meta', true);
    $qb->where($qb->expr()->lt($metadataQuery->getMetadataValueField('my-second-meta'), $qb->createNamedParameter(8910)));

    // get result
    $result = $qb->execute();
    $items = $result->fetchAll();

    // extract metadata from each row
    $entries = array_map(function (array $data) use ($metadataQuery): array {
        $data['metadata'] = $metadataQuery->extractMetadata($data)->asArray();
    }, $items);

