======
Search
======

Nextcloud 20 offers a new **unified search**. The overall idea is to have one combined view for search, but have results of any data source displayed there. Hence this is logic is built on a pluggable architecture where apps register their search providers.

Concept overview
----------------

The unified search combines a variable number of search providers into a unified search result for the user. To improve the user experience with search, the search results should be displayed quickly. Therefore parallelism is used to split the process into several requests that can be processed concurrently, to give the client (e.g. JavaScript in the browser) the ability to display partial search results as they come on.

Hence the search process consists of two steps.

 1. Fetch the current set of search provider IDs
 2. Fetch each provider's search results

These two steps have to be run consecutively, but the individual requests in the second step can be dispatched and processed concurrently.

Fetching provider IDs
^^^^^^^^^^^^^^^^^^^^^

``GET https://cloud.domain/search/providers``

This will return a structure like

.. code-block:: json

    [
        "files",
        "mail"
    ]

Fetching individual search results
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

``GET https://cloud.domain/search/providers/files/search?term=cat``

.. code-block:: json

    {
        "name": "Files",
        "isPaginated": false,
        "entries": [
            {
                "thumbnailUrl": "/core/preview?x=32&y=32&fileId=9261",
                "title": "my cute cats.jpg",
                "subline": "/my cute cats.jpg",
                "resourceUrl": "/apps/files/?dir=/&scrollto=my%20cute%20cats.jpg"
            },
            {
                "thumbnailUrl": "/core/preview?x=32&y=32&fileId=1553",
                "title": "cat (2).png",
                "subline": "/cat (2).png",
                "resourceUrl": "/apps/files/?dir=/&scrollto=cat%20%282%29.png"
            }
        ],
        "cursor": null
    }

Search providers
----------------

A **search provider** is a class the implements the interface ``\OCP\Search\IProvider``.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Search;

    use OCP\IUser;
    use OCP\Search\IProvider;

    class Provider implements IProvider {

        public function getId(): string {
            return 'mysearchprovider';
        }

        public function search(IUser $user, ISearchQuery $query): SearchResult {
            return SearchResult::complete(
                'My custom group', // TODO: this should be translated
                [
                    ...
                ]
            );
        }
    }

The method ``getId`` returns a string idenfier of the registered provider. It has to be globally unique, hence must not conflict with any other apps. Therefore it's advised to use just the app ID (e.g. ``mail``) as ID or an ID that is prefixed with the app id, like ``mail_recipients``.

The method ``search`` transforms a search request into a search result. 

The class would typically be saved into a file in ``lib/Search`` of your app but you are free to put it elsewhere as long as it's loadable by Nextcloud's :ref:`dependency injection container<dependency-injection>`.

Provider registration
---------------------

The provider class is registered via the :ref:`bootstrap mechanism<Bootstrapping>` of the ``Application`` class.

.. code-block:: php


    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\AppInfo;

    use OCA\MyApp\Search\Provider;
    use OCP\AppFramework\App;
    use OCP\AppFramework\Bootstrap\IBootContext;
    use OCP\AppFramework\Bootstrap\IBootstrap;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;

    class Application extends App implements IBootstrap {

        public function register(IRegistrationContext $context): void {
            $context->registerSearchProvider(Provider::class);
        }

        public function boot(IBootContext $context): void {}

    }

Handling search requests
------------------------

Search requests are processed in the ``search`` method. The ``$user`` object is the user who the result shall be generated for. ``$query``gives context information like the **search term**, the **sort order**, the **size limit** of a request and the **cursor** for follow-up request of paginated results.

The result is encapsulated in the ``SearchResult`` class that offers two static factory methods ``complete`` and ``paginated``. Both of these methods take an array of ``ASearchResultEntry`` objects. ``ASearchResultEntry`` is a static class that has be extended and used by the provider.

.. note:: In most cases you don't have to add any methods or fieds to this new result entry type, but this API design was chosen so new optional properties can be added in the future without breaking the existing implementations in 3rd party apps.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Search;

    use OCP\Search\SearchResultEntry;

    class MySearchResultEntry extends SearchResultEntry {}


The above snippet shows this implementation of a result entry. Again, this class should be saved to ``lib/Search`` in the app directory.

Next, you'll see a dummy provider that returns a static set of results using the result entry class from above.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Search;

    use OCP\IL10N;
    use OCP\IURLGenerator;
    use OCP\IUser;
    use OCP\Search\IProvider;

    class Provider implements IProvider {

        /** @var IL10N */
        private $l10n;

        /** @var IURLGenerator */
        private $urlGenerator;

        public function __construct(IL10N $l10n,
                                    IURLGenerator $urlGenerator) {
            $this->l10n = $l10n;
            $this->urlGenerator = $urlGenerator;
        }

        public function getId(): string {
            return 'mysearchprovider';
        }

        public function search(IUser $user, ISearchQuery $query): SearchResult {
            return SearchResult::complete(
                $this->l10n->t('My app'),
                [
                    new MySearchResultEntry(
                        $this->urlGenerator->linkToRoute(
                            'myapp.Preview.getPreviewByFileId',
                            [
                                'id' => 1
                            ]
                        ),
                        'Search result 1',
                        'This goes into the subline',
                        $this->urlGenerator->linkToRoute(
                            'myapp.view.index',
                            [
                                'id' => 1,
                            ]
                        )
                    )
                ]
            );
        }
    }

Each of the result result entries has

* A thumbnail or icon that is a (relative) URL
* A title, e.g. the name of a file
* A subline, e.g. the path to a file
* A resource URL that makes it possible to navigate to the details of this result

Apps **may** return the full result in ``search``, but in most cases the size of the result set can become too big to fit into one HTTP request and is complicated to display to the user, hence the set should be split into chunks – it should be **paginated**.

Pagination
^^^^^^^^^^

Paginated results work almost like complete results. The differences are that the ``SearchResult::paginated`` factory method is used to build the set and that you need a **cursor** for this.

There are two ways to use the **cursor**: offset-based pagination and cursor-based pagination.

For **offset-based pagination** you return ``$query->getLimit()`` results and specify this number as **cursor**. Any subsequent call where ``$query->getCursor()`` does not return ``null`` you take the value as **offset** for the next page. The following example shall demonstrate this use case.

.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Search;

    use OCP\IL10N;
    use OCP\IURLGenerator;
    use OCP\IUser;
    use OCP\Search\IProvider;

    class Provider implements IProvider {

        /** @var IL10N */
        private $l10n;

        /** @var IURLGenerator */
        private $urlGenerator;

        public function __construct(IL10N $l10n,
                                    IURLGenerator $urlGenerator) {
            $this->l10n = $l10n;
            $this->urlGenerator = $urlGenerator;
        }

        public function getId(): string {
            return 'mysearchprovider';
        }

        public function search(IUser $user, ISearchQuery $query): SearchResult {
            $offset = ($query->getCursor() ?? 0);
            $limit = $query->getLimit();

            $data = []; // Fill this with $limit entries, where the first entry is row $offset

            return MySearchResultEntry::complete(
                $this->l10n->t('My app'),
                $data,
                $offset + $limit
            );
        }
    }

So the first call will get a cursor of ``null`` and a limit of, say, 20. So the first 20 rows are fetched. The next call will have a cursor of 20, so the 20st to 39th rows are fetched.

The downside of a offset-based pagination is that when the underlying data changes (new entries are inserted into or deleted from the database, files change), the offset might be out of sync from on request to its successor. Therefor, if possible, a true cursor-based pagination is preferable.

For a **cursor-based pagination** a app-specific property is used to know a reference to the last element of the previous search request. The presumption of this algorithm is that the result set is sorted by an attribute and this attribute is an ``int`` or ``string``. The attribute value of the last element in the result page determines the cursor for the next search request. Again, a small example shall demonstrate how this works.


.. code-block:: php

    <?php

    declare(strict_types=1);

    namespace OCA\MyApp\Search;

    use OCP\IL10N;
    use OCP\IURLGenerator;
    use OCP\IUser;
    use OCP\Search\IProvider;

    class Provider implements IProvider {

        /** @var IL10N */
        private $l10n;

        /** @var IURLGenerator */
        private $urlGenerator;

        public function __construct(IL10N $l10n,
                                    IURLGenerator $urlGenerator) {
            $this->l10n = $l10n;
            $this->urlGenerator = $urlGenerator;
        }

        public function getId(): string {
            return 'mysearchprovider';
        }

        public function search(IUser $user, ISearchQuery $query): SearchResult {
            $cursor = $query->getCursor();
            $limit = $query->getLimit();

            if ($cursor === null) {
                $data = []; // Fill this with $limit entries sorted ascending by created_at
            } else {
                $data = []; // Fill this with $limit entries sorted ascending by created_at that have a created_at > $cursor
            }
            $last = end($data);

            return MySearchResultEntry::complete(
                $this->l10n->t('My app'),
                $data,
                $last->getCreatedAt()
            );
        }
    }
