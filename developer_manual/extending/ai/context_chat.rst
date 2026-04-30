.. _context_chat:

============
Context Chat
============

.. versionadded:: 32.0.0

Nextcloud offers a **Context Chat** API which allows apps like files to submit data
to the `Nextcloud Assistant Context Chat <https://docs.nextcloud.com/server/latest/admin_manual/ai/app_context_chat.html>`_,
thereby enabling `Nextcloud Assistant <https://docs.nextcloud.com/server/latest/admin_manual/ai/app_assistant.html>`_
to answer questions, provide insights and search results based on the submitted data and natural language queries.

Implementing a content provider for Context Chat
------------------------------------------------

The IContentProvider interface
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

A content provider for Context Chat needs to implement the ``\OCP\ContextChat\IContentProvider`` interface:

.. code-block:: php

	/**
	 * This interface defines methods to implement a content provider
	 * @since 32.0.0
	 */
	interface IContentProvider {
		/**
		 * The ID of the provider
		 *
		 * @return string
		 * @since 32.0.0
		 */
		public function getId(): string;

		/**
		 * The ID of the app making the provider available
		 *
		 * @return string
		 * @since 32.0.0
		 */
		public function getAppId(): string;

		/**
		 * The absolute URL to the content item
		 *
		 * @param string $id
		 * @return string
		 * @since 32.0.0
		 */
		public function getItemUrl(string $id): string;

		/**
		 * Starts the initial import of content items into context chat
		 *
		 * @return void
		 * @since 32.0.0
		 */
		public function triggerInitialImport(): void;
	}

The ``triggerInitialImport`` method is called when Context Chat is first set up
and allows your app to import all existing content into Context Chat in one bulk.
Any other items that are created afterwards will need to be added on demand.

Using the IContentManager service
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To add content and register your provider implementation you will need to use the ``\OCP\ContextChat\IContentManager`` service.

The ``IContentManager`` class has the following methods:

 * ``isContextChatAvailable()``: Returns ``true`` if the Context Chat app is enabled, ``false`` otherwise.
 * ``registerContentProvider(string $providerClass)``: Register a new content provider.
 * ``submitContent(string $appId, array $items)``: Providers can use this to submit content for indexing in Context Chat.
 * ``updateAccess(string $appId, string $providerId, string $itemId, string $op, array $userIds)``: Update the access rights for a content item. Use ``\OCP\ContextChat\Type\UpdateAccessOp`` constants for the ``$op`` value.
 * ``updateAccessProvider(string $appId, string $providerId, string $op, array $userIds)``: Update the access rights for all content items from a provider. Use ``\OCP\ContextChat\Type\UpdateAccessOp`` constants for the ``$op`` value.
 * ``updateAccessDeclarative(string $appId, string $providerId, string $itemId, array $userIds)``: Update the access rights for a content item. This method is declarative and will replace the current access rights with the provided ones.
 * ``deleteProvider(string $appId, string $providerId)``: Remove all content items of a provider from the knowledge base of Context Chat.
 * ``deleteContent(string $appId, string $providerId, array $itemIds)``: Remove specific content items from the knowledge base of Context Chat.

Implementing the ContentProviderRegisterEvent event
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To register your content provider,
your app needs to listen to the ``OCP\ContextChat\Events\ContentProviderRegisterEvent`` event
and call the ``registerContentProvider`` method in the event for every provider you want to register.

Some partial implementations of ``Application.php`` and a ``ContentProvider`` for reference:

.. code-block:: php

	use OCA\MyApp\ContextChat\ContentProvider;
	use OCP\ContextChat\Events\ContentProviderRegisterEvent;
	// ...
	$context->registerEventListener(ContentProviderRegisterEvent::class, ContentProvider::class);

.. code-block:: php

	class ContentProvider implements IContentProvider {
	// ...
	public function handle(Event $event): void {
		if (!$event instanceof ContentProviderRegisterEvent) {
			return;
		}
		$event->registerContentProvider('***appId***', '***providerId***', ContentProvider::class);
	}

Any interaction with the content manager using the ContentManager's methods
or listing the providers in the Assistant should automatically register the provider.

You may call the ``registerContentProvider`` method explicitly
if you want to trigger an initial import of content items.

Submitting ContentItem data
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Before submitting, you should check that the Context Chat app is enabled first
by calling the ``isContextChatAvailable()`` method.

Then, to submit content, wrap it in a list of ``\OCP\ContextChat\ContentItem`` objects:

.. code-block:: php

	new ContentItem(
			string $itemId,
			string $providerId,
			string $title,
			string $content,
			string $documentType,
			\DateTime $lastModified,
			array $users,
		)

.. note::
	1. Ensure that item IDs are unique across all users for a given provider.
	2. The app ID and provider ID both cannot contain double underscores, spaces, or colons.
	3. The ``documentType`` is a natural language term for your document type in English, e.g. ``E-Mail`` or ``Bookmark``.
