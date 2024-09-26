====================
OCS OpenAPI tutorial
====================

This page explains you how you can add OpenAPI support to your app such that you can automatically generated an OpenAPI specification from your server code.

Please read the whole tutorial before starting to adapt your app.

Do not be afraid that you do not know everything from the start.
The openapi-extractor tool gives you many warnings and fails if there is something utterly broken that would not work.
Let the tool run and it will tell you if there is something wrong.
Psalm will also help you validate your changes to ensure that nothing is broken.

Requirements and prerequisites
------------------------------

App supports at least Nextcloud 28
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Nextcloud 28 is the first version that has the required changes to get OpenAPI support going.

Psalm is setup and configured
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Install psalm in your app as explained in `<https://psalm.dev/docs/running_psalm/installation>`_.

You need to have at least psalm ``5.9.0``. Previous versions contain a bug which will make it impossible for the changes outlined in this tutorial to work.

Install and enable the required extensions as explained in :ref:`Required PHP extensions <psalm-php-extensions>`.

Setup the following issue handlers in the psalm config (see `<https://psalm.dev/docs/running_psalm/dealing_with_code_issues>`_ for a tutorial):

.. code-block:: xml

    <LessSpecificReturnStatement errorLevel="error"/>
    <LessSpecificReturnType errorLevel="error"/>
    <LessSpecificImplementedReturnType errorLevel="error"/>
    <MoreSpecificReturnType errorLevel="error"/>

Install openapi-extractor in your app as explained in `<https://github.com/nextcloud/openapi-extractor>`_.

Tips and tricks
---------------

The openapi-extractor tool forces you to set descriptions everywhere.
To ease the adoption process you can set the ``--allow-missing-docs`` flag to ignore those problems.

The tool also only shows errors one by one by default, but you can also let it show you all problems at once using the ``--continue-on-error``.

It is advised to use neither of the mentioned flags to generate the final specification.
They hide problems that your code has.
Especially the later one is dangerous because it will never fail when any problem exists in your code.
They should only be used to speed up the initial adaption process.

Best practices
--------------

Note that you can find a step-by-step tutorial after this section.
You can also read the tutorial before reading the best practices.

PREFER to expose your APIs using OCS
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

It provides a more standardized and easier way to write your APIs.
Other methods are considered legacy.
For details take a look at :ref:`OCS <ocscontroller>`.

.. collapse:: Examples

    .. code-block:: php
        :caption: Bad

        class SomeController extends ApiController {
            ...

            public function someControllerMethod(): JSONResponse {
                ...
                return JSONResponse(...);
            }
        }

    .. code-block:: php
        :caption: Good

        class SomeController extends OCSController {
            ...

            public function someControllerMethod(): DataResponse {
                ...
                return new DataResponse(...);
            }
        }

DO type controller and helper methods as explicit as possible
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The closer you narrow down a type without violating any constraints the better the resulting specification will be.
Psalm will catch these problems for you if you configured the issue handlers mentioned above correctly.

.. collapse:: Examples

    .. code-block:: php
        :caption: Bad
        :emphasize-lines: 2

        /**
         * @return array
         */
        public function someHelperMethod() {
            ...
            return [
                "id" => id,
                "name" => name,
            ];
        }

    .. code-block:: php
        :caption: Good
        :emphasize-lines: 2

        /**
         * @return array{id: int, name: string}
         */
        public function someHelperMethod() {
            ...
            return [
                "id" => id,
                "name" => name,
            ];
        }

PREFER to use ``null`` to represent empty data
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Your API should be designed in a way that represents empty data with ``null``.

There is a problem with PHP and arrays that get converted to JSON.
JSON has lists and objects while PHP only has arrays.
If you were to return an empty array in PHP it will always turn into ``[]`` in JSON.
This is not a problem for endpoints that always return lists, but most endpoints return a single JSON object.
For those endpoints returning ``[]`` in PHP is a problem because the consumer will either get ``[]`` or ``{...}`` which is hard to handle.

If you are not able to use ``null`` for whatever reason, use ``new \stdClass()`` instead.
It will get correctly converted into ``{}`` in the JSON response on Nextcloud 28 and later.

If you are working with an existing API where you can not break compatibility, you can also type the result as ``list<empty>``.

.. collapse:: Examples

    .. code-block:: php
        :caption: Bad

        /**
         * @return DataResponse<Http::STATUS_OK, array, array{}>
         */
        public function someControllerMethod() {
            ...
            return new DataResponse([]);
        }

    .. code-block:: php
        :caption: Good

        /**
         * @return DataResponse<Http::STATUS_OK, null, array{}>
         */
        public function someControllerMethod() {
            ...
            return new DataResponse(null);
        }

        /**
         * @return DataResponse<Http::STATUS_OK, \stdClass, array{}>
         */
        public function someControllerMethod() {
            ...
            return new DataResponse(new \stdClass());
        }

        /**
         * @return DataResponse<Http::STATUS_OK, list<empty>, array{}>
         */
        public function someControllerMethod() {
            ...
            return new DataResponse([]);
        }

DO NOT throw non-OCS*Exceptions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Only use OCS*Exceptions as any other Exceptions do not produce JSON responses.

.. collapse:: Examples

    .. code-block:: php
        :caption: Bad

        /**
         * @throws BadRequestException
         */
        public function someControllerMethod() {
            ...
            throw new BadRequestException([]);
        }

    .. code-block:: php
        :caption: Good

        /**
         * @throws OCSBadRequestException
         */
        public function someControllerMethod() {
            ...
            throw new OCSBadRequestException("some message");
        }

DO use the same data structures for the same group of responses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Using ``null`` to represent empty data is encouraged.
All 2xx responses should return the same data structure and all 4xx should also return the same data structure.

.. collapse:: Examples

    .. code-block:: php
        :caption: Bad
        :emphasize-lines: 2,7,9

        /**
         * @return DataResponse<Http::STATUS_OK, array{name: string}, array{}>|DataResponse<Http::STATUS_CREATED, array{id: int, name: string}, array{}>
         */
        public function someControllerMethod() {
            ...
            if (...) {
                return new DataResponse(["name" => name], Http::STATUS_OK);
            } else {
                return new DataResponse(["id" => id, "name" => name], Http::STATUS_CREATED);
            }
        }

        /**
         * @return DataResponse<Http::STATUS_BAD_REQUEST, array{error: string}, array{}>|DataResponse<Http::STATUS_FORBIDDEN, array{message: string}, array{}>
         */
        public function someControllerMethod() {
            ...
            if (...) {
                return new DataResponse(["error" => "bad request"], Http::STATUS_BAD_REQUEST);
            } else {
                return new DataResponse(["message" => "forbidden"], Http::STATUS_FORBIDDEN);
            }
        }

    .. code-block:: php
        :caption: Good
        :emphasize-lines: 2,7,9

        /**
         * @return DataResponse<Http::STATUS_OK|Http::STATUS_CREATED, array{id: int, name: string}, array{}>
         */
        public function someControllerMethod() {
            ...
            if (...) {
                return new DataResponse(["id" => id, "name" => name], Http::STATUS_OK);
            } else {
                return new DataResponse(["id" => id, "name" => name], Http::STATUS_CREATED);
            }
        }

        /**
         * @return DataResponse<Http::STATUS_BAD_REQUEST|Http::STATUS_FORBIDDEN, array{error: string}, array{}>
         */
        public function someControllerMethod() {
            ...
            if (...) {
                return new DataResponse(["error" => "bad request"], Http::STATUS_BAD_REQUEST);
            } else {
                return new DataResponse(["error" => "forbidden"], Http::STATUS_FORBIDDEN);
            }
        }

DO NOT use the ``addHeader`` method for setting headers for your responses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Right now it is not possible for psalm to trace headers you set this way, so they will not be validated by psalm.
Use the ``setHeaders`` method instead.

.. collapse:: Examples

    .. code-block:: php
        :caption: Bad
        :emphasize-lines: 2

        $response = new DataResponse();
        $response->addHeader("X-My-Header", "some value");
        return $response;

    .. code-block:: php
        :caption: Good
        :emphasize-lines: 2

        $response = new DataResponse();
        $response->setHeaders(["X-My-Header" => "some value"]);
        return $response;

CONSIDER how your API will be used
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When building your API you will probably only think about how to implement in the easiest or best way.
You need to consider what your code implies to someone trying to use your API through the OpenAPI specification.

One such example that appears in some apps are generic error handlers.
They are great for your API implementation because you have an easy catch-all solution and you do not need to worry about handling every error correctly.
They are not great for your OpenAPI documentation and consumers because they will find that every error can occur on every endpoint which is most often not correct.
Instead you should implement manual error handling and only return the relevant errors where they can actually appear.
You can still use helper methods with generic issue handlers where it makes sense, but only if all the controller methods that call the particular helper method actually throw the caught exceptions.

.. collapse:: Examples

    .. code-block:: php
        :caption: Bad

        /**
         * @return DataResponse<Http::STATUS_OK, array{message: string}, array{}>|DataResponse<Http::STATUS_FORBIDDEN|Http::STATUS_NOT_FOUND, array{error: string}, array{}>
         */
        public function someControllerMethod() {
            return $this->handleError(function() {
                ...
                if (...) {
                    throw new PermissionError("some error");
                }
                ...
                return ["message" => "some message"];
            });
        }

        /**
         * @template T
         * @param Closure():T $callback
         *
         * @return DataResponse<Http::STATUS_OK, T, array{}>|DataResponse<Http::STATUS_FORBIDDEN|Http::STATUS_NOT_FOUND, array{error: string}, array{}>
         */
        private function handleError(Closure $callback): DataResponse  {
            try {
                return new DataResponse($callback());
            } catch (PermissionError $e) {
                $message = ["error" => $e->getMessage()];
                return new DataResponse($message, Http::STATUS_FORBIDDEN);
            } catch (NotFoundError $e) {
                $message = ["error" => $e->getMessage()];
                return new DataResponse($message, Http::STATUS_NOT_FOUND);
            }
        }

    .. code-block:: php
        :caption: Good

        /**
         * @return DataResponse<Http::STATUS_OK, array{message: string}, array{}>|DataResponse<Http::STATUS_FORBIDDEN, array{error: string}, array{}>
         */
        public function someControllerMethod() {
            try {
                ...
                if (...) {
                    throw new PermissionError("some error");
                }
                ...
                return new DataResponse(["message" => "some message"]);
            } catch (PermissionError $e) {
                $message = ["error" => $e->getMessage()];
                return new DataResponse($message, Http::STATUS_FORBIDDEN);
            }
        }

DO set all descriptions for parameters and methods
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

It improves the documentation and makes it easier to understand what your API does.

You can also set descriptions for Controllers.
Those will be included in the specification.
There you can explain what the APIs in the controller do or give examples an how to use multiple API endpoints together.

.. collapse:: Examples

    .. code-block:: php
        :caption: Bad

        class SomeController extends OCSController {
            /**
             * @return DataResponse<Http::STATUS_OK, array{name: string}, array{}>
             */
            public function someControllerMethod(int $id) {
                ...
                return new DataResponse(["name" => name], Http::STATUS_CREATED);
            }
        }

    .. code-block:: php
        :caption: Good

        /**
         * Here you can put some explanations about all the endpoints or example code.
         */
        class SomeController extends OCSController {
            /**
             * Here you give a short summary of the method
             *
             * Here you can give even more details about your method
             * and how you can use it.
             *
             * @param int $id Here you can describe your parameter
             *
             * @return DataResponse<Http::STATUS_OK, array{name: string}, array{}>
             */
            public function someControllerMethod(int $id) {
                ...
                return new DataResponse(["name" => name], Http::STATUS_CREATED);
            }
        }

How to add OpenAPI support to your OCS API
------------------------------------------

Let's imagine you built a Todo list app for Nextcloud and have the following controller:

.. code-block:: php

    class TodoApiController extends OCSController {
        #[NoAdminRequired]
        public function create(string $title, string $description = null, string $image = null): DataResponse {
            $todo = $this->service->createTodo($title, $description, $image);

            return $this->formatTodo($todo);
        }

        #[NoAdminRequired]
        public function get(int $id): DataResponse {
            try {
                $todo = $this->service->getTodo($id);
            } catch (NotFoundException $e) {
                return new DataResponse(["error" => "Todo not found"], Http::STATUS_NOT_FOUND);
            }

            return $this->formatTodo($todo);
        }

        #[NoAdminRequired]
        public function update(int $id, string $etag, string $title = null, string $description = null, string $image = null): DataResponse {
            try {
                $todo = $this->service->updateTodo($id, $etag, $title, $description, $image);
            } catch (NotFoundException $e) {
                return new DataResponse(["error" => "Todo not found"], Http::STATUS_NOT_FOUND);
            } catch (ForbiddenException $e) {
                return new DataResponse(["error" => "ETag does not match"], Http::STATUS_BAD_REQUEST);
            }

            return $this->formatTodo($todo);
        }

        #[NoAdminRequired]
        public function delete(int $id): DataResponse {
            try {
                $todo = $this->service->deleteTodo($id);
            } catch (NotFoundException $e) {
                return new DataResponse(["error" => "Todo not found"], Http::STATUS_NOT_FOUND);
            }

            return new DataResponse(null);
        }

        private function formatTodo(Todo $todo): DataResponse() {
            return new DataResponse([
                "id" => $todo->id,
                "title" => $todo->title,
                "description" => $todo->description,
                "image" => $todo->image,
            ], Http::STATUS_OK, [
                "ETag" => $todo->etag,
            ]);
        }
    }

What you want to do now is to firstly create the correct parameter annotations and add descriptions. It could look like this:

.. code-block:: php

    /**
     * Create a new Todo
     *
     * @param string $title The title of the new Todo item
     * @param string|null $description The description of the new Todo item. Can be left empty
     * @param string|null $image The base64-encoded image of the new Todo item. Can be left empty
     */
    #[NoAdminRequired]
    public function create(string $title, string $description = null, string $image = null): DataResponse {
        ...
    }

    /**
     * Get a Todo item
     *
     * @param int $id ID of the Todo item
     */
    #[NoAdminRequired]
    public function get(int $id): DataResponse {
        ...
    }

    /**
     * Update a Todo item
     *
     * @param int $id ID of the Todo item
     * @param string $etag ETag of the Todo item. If it does not match the ETag that is stored on the server the request will be rejected
     * @param string|null $title The new title of the Todo item. Can be left empty to not update the title
     * @param string|null $description The new description of the Todo item. Can be left empty to not update the description
     * @param string|null $image The new base64-encoded image of the Todo item. Can be left empty to not update the image
     */
    #[NoAdminRequired]
    public function update(int $id, string $etag, string $title = null, string $description = null, string $image = null): DataResponse {
        ...
    }

    /**
     * Delete a Todo item
     *
     * @param int $id ID of the Todo item
     */
    #[NoAdminRequired]
    public function delete(int $id): DataResponse {
        ...
    }

The next step is to add the return types.
This is the most important step to get your API documented.

It is best to start with helper methods that are used multiple times like the ``formatTodo`` method in this example:

.. code-block:: php

    /**
     * @return DataResponse<Http::STATUS_OK, array{id: int, title: string, description: ?string, image: ?string}, array{ETag: string}>
     */
    private function formatTodo(Todo $todo): DataResponse() {
        ...
    }

Afterwards you can add the return types to all the other methods.
If two different status codes return the same data structure and headers, you can use the union operator to indicate it: ``Http::STATUS_BAD_REQUEST|Http::STATUS_NOT_FOUND``.

You are required to add a description for every status code returned by the method.

.. code-block:: php

    /**
     * ...
     *
     * @return DataResponse<Http::STATUS_OK, array{id: int, title: string, description: ?string, image: ?string}, array{ETag: string}>
     *
     * 200: Todo item created
     */
    #[NoAdminRequired]
    public function create(string $title, string $description = null, string $image = null): DataResponse {
        ...
    }

    /**
     * ...
     *
     * @return DataResponse<Http::STATUS_OK, array{id: int, title: string, description: ?string, image: ?string}, array{ETag: string}>|DataResponse<Http::STATUS_NOT_FOUND, array{error: string}, array{}>
     *
     * 200: Todo item returned
     * 404: Todo item not found
     */
    #[NoAdminRequired]
    public function get(int $id): DataResponse {
        ...
    }

    /**
     * ...
     *
     * @return DataResponse<Http::STATUS_OK, array{id: int, title: string, description: ?string, image: ?string}, array{ETag: string}>|DataResponse<Http::STATUS_BAD_REQUEST|Http::STATUS_NOT_FOUND, array{error: string}, array{}>
     *
     * 200: Todo item created
     * 400: ETag of the Todo item does not match
     * 404: Todo item not found
     */
    #[NoAdminRequired]
    public function update(int $id, string $etag, string $title = null, string $description = null, string $image = null): DataResponse {
        ...
    }

    /**
     * ...
     *
     * @return DataResponse<Http::STATUS_OK, null, array{}>|DataResponse<Http::STATUS_NOT_FOUND, array{error: string}, array{}>
     *
     * 200: Todo item deleted
     * 404: Todo item not found
     */
    #[NoAdminRequired]
    public function delete(int $id): DataResponse {
        ...
    }

How to add response definitions to share type definitions
---------------------------------------------------------

In the previous steps we have been re-using the same data structure multiple times, but it was copied every time.
This is tedious and error prone, therefore we want to create some shared type definitions.
Create a new file called ``ResponseDefinitions.php`` in the ``lib`` folder of your app.
It will only work with that file name at that location.

.. code-block:: php

    /**
     * @psalm-type TodoItem = array{
     *     id: int,
     *     title: string,
     *     description: ?string,
     *     image: ?string,
     * }
     */
    class ResponseDefinitions {}

The name of every type definition has to start with the app ID.

To import and use the type definition you have to import it in your controller:

.. code-block:: php
    :emphasize-lines: 2

    /**
     * @psalm-import-type TodoItem from ResponseDefinitions
     */
    class TodoApiController extends OCSController {
        ...
    }

Now you can replace every occurrence of ``array{id: int, title: string, description: ?string, image: ?string}`` with ``TodoItem``.

How to handle exceptions
------------------------

Sometimes you want to end with an exception instead of returning a response.
For this example our ``update`` will throw an exception when the ETag does not match:

.. code-block:: php

    #[NoAdminRequired]
    public function update(int $id, string $etag, string $title = null, string $description = null, string $image = null): DataResponse {
        ...
        } catch (ForbiddenException $e) {
            throw new OCSBadRequestException("ETag does not match");
        }
        ...
    }

Adding the correct annotation works like this:

.. code-block:: php
    :emphasize-lines: 4

    /**
     * ...
     *
     * @throws OCSBadRequestException ETag of the Todo item does not match
     */
    #[NoAdminRequired]
    public function update(int $id, string $etag, string $title = null, string $description = null, string $image = null): DataResponse {
        ...
    }

The description after the exception class name works exactly like the description for the status codes we added earlier.
Note that you should only used OCS*Exceptions, as any other Exception will result in a plain text body instead of JSON.

How to ignore certain endpoints
-------------------------------

The tool already ignores all the endpoints that are not reachable from the outside, but some apps have reachable endpoints that are not APIs (e.g. serving some HTML).
To ignore those you can add the ``#[OpenAPI(scope: OpenAPI::SCOPE_IGNORE)]`` attribute or if you still support PHP 7 the ``@IgnoreOpenAPI`` annotation to the controller method or the controller class:

.. code-block:: php
    :emphasize-lines: 4,6

    /**
     * ...
     *
     * @IgnoreOpenAPI
     */
    #[OpenAPI(scope: OpenAPI::SCOPE_IGNORE)]
    #[NoAdminRequired]
    public function show(): TemplateResponse {
        ...
    }

How to expose Capabilities
--------------------------

Imagine we take the same Todo app of the previous example and want to expose some capabilities to let clients know what they can expect.

.. code-block:: php

    class Capabilities implements ICapability {
        public function getCapabilities() {
            return [
                "todo" => [
                    "supported-operations" => ["create", "read", "update", "delete"],
                    "emojis-supported" => true,
                ],
            ];
        }
    }

Now you have to add the correct return type annotation:

.. code-block:: php
    :emphasize-lines: 3

    class Capabilities implements ICapability {
        /**
         * @return array{todo: array{supported-operations: list<string>, emojis-supported: bool}}
         */
        public function getCapabilities() {
            return [
                "todo" => [
                    "supported-operations" => ["create", "read", "update", "delete"],
                    "emojis-supported" => true,
                ],
            ];
        }
    }

The capabilities will automatically appear in the generated specification.

Scopes
------

In some cases a consumer of the API might not want or need to implement all APIs your app offers.
Examples are federation between apps on different servers, administration related endpoints, and more.
The default client which should implement the main functionality is called ``OpenAPI::SCOPE_DEFAULT``.
Constants are available in ``OCP\AppFramework\Http\Attribute\OpenAPI::SCOPE_*`` for better cross-app experience.
A controller and methods can have multiple scopes, however when a method has the attribute set,
all scopes from the controller are ignored.

Methods that require admin permissions due to missing ``#[NoAdminRequired]`` or ``#[PublicPage]`` attribute or the
matching annotation, default to the ``OpenAPI::SCOPE_ADMINISTRATION`` scope.

.. code-block:: php

    #[OpenAPI(scope: OpenAPI::SCOPE_ADMINISTRATION)]
    #[OpenAPI(scope: OpenAPI::SCOPE_FEDERATION)]
    #[OpenAPI(scope: OpenAPI::SCOPE_DEFAULT)]
    #[OpenAPI(scope: 'myscope')]
    public function show(): TemplateResponse {
        ...
    }

The different scopes will be saved as ``openapi.json`` for the default scope and ``openapi-{scope}.json`` for the others.

Tags
^^^^

To organize the API endpoints within a scope, tags can be used to group them. By default the controller name is used.
Tags can also differ between different scopes.

.. code-block:: php

    #[OpenAPI(scope: OpenAPI::SCOPE_DEFAULT, tags: ['mytag1'])]
    #[OpenAPI(scope: OpenAPI::SCOPE_ADMINISTRATION, tags: ['settings', 'custom2'])]
    public function saveSettings(): TemplateResponse {
        ...
    }

How to generate the specification
---------------------------------

If you followed the installation instructions for openapi-extractor you can run ``composer exec generate-spec`` in your
apps root folder and you will have a new file called ``openapi.json`` (depending on the used scopes).
If the tool fails somewhere it will tell you what is wrong and often times also how to fix the problem.
Additionally you should run psalm to check for any problems.
