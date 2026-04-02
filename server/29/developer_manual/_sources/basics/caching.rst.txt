=======
Caching
=======

.. sectionauthor:: Christoph Wurst <christoph@winzerhof-wurst.at>

Results of expensive or slow operations can be cached to speed up Nextcloud and its apps.

Types of caches
---------------

Nextcloud offers in-memory, local and distributed caches. The caching back-end (APCu, Redis, Memcached) is configurable.

For single server setups, admins typically only configure one type of cache. Larger installations can have two types of cache. The Nextcloud API lets you pick a cache type. The following table tries to highlight the main advantages and disadvantages of each type.

+------------------------+-------------------+--------------------+-------------------+
|                        | In-memory cache   | Local cache        | Distributed cache |
+========================+===================+====================+===================+
| **Latency**            | Low               | Low                | High              |
+------------------------+-------------------+--------------------+-------------------+
| **Data scope**         | Same process      | Application server | Full cluster      |
+------------------------+-------------------+--------------------+-------------------+
| **Expiration**         | End of process    | TTL reached        | TTL reached       |
+------------------------+-------------------+--------------------+-------------------+

For scalability it should be preferred to use local caches. A local cache has to be populated on each application server, but avoids creating a bottleneck of too much traffic on the distributed cache. A distributed cache is most useful for data that *has to be synchronized* across the full Nextcloud cluster.

In-memory cache
---------------

The ``OCP\Cache\CappedMemoryCache`` class is an in-memory cache that can be used like an array:

.. code-block:: php
    :caption: lib/Service/PictureService.php
    :emphasize-lines: 11,15-16,21

    <?php

    namespace OCA\MyApp\Service;

    use OCP\Cache\CappedMemoryCache;

    class PictureService {
        private $cache;

        public function __construct(){
            $this->cache = new CappedMemoryCache(64);
        }

        public function getPicture(string $url): void {
            if (isset($this->cache[$url])) {
                return $this->cache[$url];
            }

            // Fetch picture and serialize result into $picture

            $this->cache[$url] = $picture;
            return $picture;
        }
    }


A cache instance can also be built by the cache factory. This approach allows mocking the injected factory for finer control during :ref:`unit testing<testing-php>`:

.. code-block:: php
    :caption: lib/Service/PictureService.php
    :emphasize-lines: 15-19

    <?php

    namespace OCA\MyApp\Service;

    use OCP\ICacheFactory;

    class PictureService {
        private ICacheFactory $cacheFactory;

        public function __construct(ICacheFactory $cacheFactory){
            $this->cacheFactory = $cacheFactory;
        }

        public function getPicture(string $url): void {
            // Initialize the cache. The instance has to be remembered because
            // each call to `createInMemory` returns a fresh, empty cache.
            if ($this->cache === null) {
                $this->cache = $this->cacheFactory->createInMemory(64);
            }

            if (isset($this->cache[$url])) {
                return $this->cache[$url];
            }

            // Fetch picture and serialize result into $picture

            $this->cache[$url] = $picture;
            return $picture;
        }
    }

Local cache
-----------

A local cache instance can be acquired through the ``\OCP\ICacheFactory`` service. The factory can be injected:

.. code-block:: php
    :caption: lib/Service/PictureService.php
    :emphasize-lines: 15-16,23

    <?php

    namespace OCA\MyApp\Service;

    use OCP\ICacheFactory;

    class PictureService {
        private ICacheFactory $cacheFactory;

        public function __construct(ICacheFactory $cacheFactory){
            $this->cacheFactory = $cacheFactory;
        }

        public function getPicture(string $url): void {
            $cache = $this->cacheFactory->createLocal('my-app-pictures');
            $cachedPicture = $this->cache->get($url);
            if ($cachedPicture !== null) {
                return $cachedPicture;
            }

            // Fetch picture and serialize result into $picture

            $cache->set($url, $picture, 6 * 3600); // Cache result for 6h
            return $picture;
        }
    }

Distributed cache
-----------------

A distributed cache instance can be acquired through the ``\OCP\ICacheFactory`` service. The factory can be injected:

.. code-block:: php
    :caption: lib/Service/PictureService.php
    :emphasize-lines: 15-16,23

    <?php

    namespace OCA\MyApp\Service;

    use OCP\ICacheFactory;

    class PictureService {
        private ICacheFactory $cacheFactory;

        public function __construct(ICacheFactory $cacheFactory){
            $this->cacheFactory = $cacheFactory;
        }

        public function getPicture(string $url): void {
            $cache = $this->cacheFactory->createDistributed('my-app-pictures');
            $cachedPicture = $this->cache->get($url);
            if ($cachedPicture !== null) {
                return $cachedPicture;
            }

            // Fetch picture and serialize result into $picture

            $cache->set($url, $picture, 6 * 3600); // Cache result for 6h
            return $picture;
        }
    }

