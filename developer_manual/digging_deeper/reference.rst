.. _Reference providers:

===================
Reference providers
===================

Reference providers are related with two Nextcloud features:

* Link previews
* The Smart Picker

Link previews were introduced in Nextcloud 25.
Apps can register a reference provider to add preview support for some HTTP links.
To provide link previews, a reference provider needs to:

* Resolve the links (get information about the links)
* Render links (show this information in the user interface)

The Smart Picker was introduced in Nextcloud 26. This is a user interface component
allowing users to search or generate links from various places in Nextcloud like Text,
Talk, Collectives, Notes, Mail...
Reference providers can be implemented so they appear in the Smart Picker's provider list.
The Smart Picker can use 2 types of providers:

* the ones to search (using existing Unified Search providers)
* the ones implementing their own custom picker component

In summary, reference providers can be registered by apps to

* add support for new kinds of HTTP links
    * resolve the links, get information on the link targets
    * optionally provide their own reference widgets to have a custom preview rendering
* extend the Smart Picker
    * use existing Unified Search providers
    * or optionally register custom picker components to have a specific user interface

This documentation explains how to

* Display link previews in your app
* Use the Smart Picker in your app
* Extend the reference system add preview support for more links
* Extend the Smart Picker with your app's capabilities

Display link previews
---------------------

If you just want to display links previews in your app without extending the reference system,
you need to make sure the ``OCP\Collaboration\Reference\RenderReferenceEvent`` is dispatched
before you load the page where you want to display link previews.

For example, you can place this before returning your TemplateResponse in your controller:

.. code-block:: php

    $this->eventDispatcher->dispatchTyped(new OCP\Collaboration\Reference\RenderReferenceEvent());

This is done in
`Text <https://github.com/nextcloud/text/blob/8a17046aa440df841fe9182205d80ce937068c1a/lib/Listeners/LoadViewerListener.php#L52>`_
and
`Talk <https://github.com/nextcloud/spreed/blob/1f1acbd95943e6184e29de8044cd9d8e775ac7c5/lib/Controller/PageController.php#L280>`_
if you need more examples.

On the frontend side, there are 3 ways to display link previews (also named reference widgets):

* use the NcRichText Vue component
* use the NcReferenceWidget Vue component
* access the reference API directly and manually render the previews

NcRichText
~~~~~~~~~~

Link previews will be automatically rendered for links in the content of the ``<NcRichText>`` Vue component.
This component will take care of resolving the links itself.

.. code-block:: html

    <NcRichText :text="message"
		:arguments="richParameters"
		:autolink="true"
		:reference-limit="0" />

NcRichText can be imported like this:

.. code-block:: javascript

    import NcRichText from '@nextcloud/vue/dist/Components/NcRichText.js'


`NcRichText component documentation <https://nextcloud-vue-components.netlify.app/#/Components/NcRichText?id=ncrichtext-1>`_

NcReferenceWidget
~~~~~~~~~~~~~~~~~

You can display a preview for a specific link by using the ``<NcReferenceWidget>`` component.
You need to ask the server to resolve the link to get a reference object that you can then give as a property
to NcReferenceWidget.

To resolve a link:

.. code-block:: javascript

    const myLink = 'https://github.com'
    const requestOptions = {
        params: {
            reference: myLink,
        },
    }
    axios.get(generateOcsUrl('references/resolve', 2), requestOptions)
        .then((response) => {
            reference = response.data.ocs.data.references[myLink]
        })

Then you can use the reference object you got:

.. code-block:: html

    <NcReferenceWidget :reference="reference" />

API to resolve links
~~~~~~~~~~~~~~~~~~~~

Accessing the API directly can be useful if you want to:

* resolve links from outside Nextcloud, in a client for example
* manually resolve and render links instead of using the Vue components

Endpoints to resolve links:

* GET /ocs/v2.php/references/resolve (authenticated)
    * ``reference`` parameter with the link to resolve
* GET /ocs/v2.php/references/resolvePublic
    * ``reference`` parameter with the link to resolve
    * ``sharingToken`` parameter with the public share token
* POST /ocs/v2.php/references/resolve
    * ``references`` parameter with an array of links to resolve
    * ``limit`` parameter with the maximum number of links to resolve
* POST /ocs/v2.php/references/resolve
    * ``references`` parameter with an array of links to resolve
    * ``sharingToken`` parameter with the public share token
    * ``limit`` parameter with the maximum number of links to resolve

Request examples
^^^^^^^^^^^^^^^^

.. code-block:: bash

    curl -u USER:PASSWD -H "Accept: application/json" -H "ocs-apirequest: true" \
        "https://my.nextcloud.org/ocs/v2.php/references/resolve?reference=https://github.com"

will return an OCS response with that data:

.. code-block:: json

    {
      "ocs": {
        "meta": {
        "status": "ok",
        "statuscode": 200,
        "message": "OK"
      },
      "data": {
        "references": {
          "https://github.com": {
            "richObjectType": "open-graph",
            "richObject": {
              "id": "https://github.com",
              "name": "GitHub: Let’s build from here",
              "description": "GitHub is where over 100 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and fea...",
              "thumb": "https://my.nextcloud.org/core/references/preview/3097fca9b1ec8942c4305e550ef1b50a",
              "link": "https://github.com"
            },
            "openGraphObject": {
              "id": "https://github.com",
              "name": "GitHub: Let’s build from here",
              "description": "GitHub is where over 100 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and fea...",
              "thumb": "https://my.nextcloud.org/core/references/preview/3097fca9b1ec8942c4305e550ef1b50a",
              "link": "https://github.com"
            },
            "accessible": true
          }
        }
      }
    }

The link might be supported by a reference provider that also provides more information in a rich object.
The generic openGraphObject is still returned. It contains a title, description and image URL if the matching reference
provider defined those correctly.
For example, resolving ``https://www.themoviedb.org/movie/70981`` if the ``integration_tmdb`` app is installed will return:

.. code-block:: json

    "data": {
      "references": {
        "https://www.themoviedb.org/movie/70981": {
          "richObjectType": "integration_tmdb_movie",
          "richObject": {
            "adult": false,
            "budget": 130000000,
            "genres": [
              {
                "id": 878,
                "name": "Science Fiction"
              },
              {
                "id": 12,
                "name": "Adventure"
              },
              {
                "id": 9648,
                "name": "Mystery"
              }
            ],
            "homepage": "https://www.20thcenturystudios.com/movies/prometheus",
            "id": 70981,
            "imdb_id": "tt1446714",
            "original_language": "en",
            "original_title": "Prometheus",
            "overview": "A team of explorers discover a clue to the origins of mankind on Earth, leading them on a journey to the darkest corners of the universe. There, they must fight a terrifying battle to save the future of the human race.",
            "popularity": 68.389,
            "release_date": "2012-05-30",
            "revenue": 403354469,
            "runtime": 124,
          },
          "openGraphObject": {
            "id": "https://www.themoviedb.org/movie/70981",
            "name": "Prometheus",
            "description": "30 mai 2012 - A team of explorers discover a clue to the origins of mankind on Earth, leading them on a journey to the darkest corners of the universe. There, they must fight a terrifying battle to save the future of the human race.",
            "thumb": "https://my.nextcloud.org/apps/integration_tmdb/t/p/w500/qsYQflQhOuhDpQ0W2aOcwqgDAeI.jpg?fallbackName=???",
            "link": "https://www.themoviedb.org/movie/70981"
          },
          "accessible": true
        }
      }
    }

Render link previews in clients
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Clients can choose to support some rich objects types.
Developers can follow the rich object formatting recommendations to provide generic information in some cases.
The rich object type is not used to predict the data structure.
We rather recommend to set rich object attributes respecting a strict format for some common use cases.

More details can be found in :ref:`data-for-clients`

Use the Smart Picker in your app
--------------------------------

There are 3 ways to make the Smart Picker appear in your app:

* use the ``NcRichContenteditable`` component
* use the ``NcReferencePickerModal`` component
* use the ``getLinkWithPicker`` helper function

Just like for the link previews, you need to dispatch the ``OCP\Collaboration\Reference\RenderReferenceEvent`` event
before loading the page in which you want to show the Smart Picker.

NcRichContenteditable
~~~~~~~~~~~~~~~~~~~~~

The Smart Picker is integrated in the NcRichContenteditable Vue component. It is enabled by default
but can be disabled by setting the ``linkAutocomplete`` prop to ``false``.

The picker provider list opens when the user types the "/" character.
The picker result then gets directly inserted in the content.

`NcRichContenteditable component documentation <https://nextcloud-vue-components.netlify.app/#/Components/NcRichContenteditable>`_

NcReferencePickerModal
~~~~~~~~~~~~~~~~~~~~~~

You display the Smart Picker by using the NcReferencePickerModal Vue component. It is available in the Nextcloud Vue library.

.. code-block:: javascript

    import { NcReferencePickerModal } from '@nextcloud/vue/dist/Components/NcRichText.js'

Available props:

* initialProvider (optional): If a reference provider object is passed, skip the provider selection and directly show this provider
* focusOnCreate (optional, default: true): Focus on the main input element on creation
* isInsideViewer (optional, default: false): Set this to true if NcReferencePickerModal is used inside the Viewer. This tells the Viewer to deal with the focus trap.

getLinkWithPicker
~~~~~~~~~~~~~~~~~

To display the Smart Picker outside Vue, you can use the getLinkWithPicker helper function.
It takes 2 parameters:

* providerId (optional, default: null): The provider to select in the picker. If null, the provider selection is displayed first.
* isInsideViewer (optional): This will be passed internally to NcReferencePickerModal as the isInsideViewer prop.

This function returns a promise that resolves with the picker result. This promise is rejected if the user closes
the Smart Picker.

.. code-block:: javascript

    import { getLinkWithPicker } from '@nextcloud/vue/dist/Components/NcRichText.js'

    getLinkWithPicker(null, true)
        .then(result => {
            console.debug('Smart Picker result', result)
        })
        .catch(error => {
            console.error('Smart Picker promise rejected', error)
        })


Use the Smart Picker in clients
-------------------------------

Clients can partially support the Smart Picker features.

There are 2 types of Smart Picker providers:

* The ones with a custom picker component
* The ones that support one or multiple unified search providers

As the custom picker components are web components, clients might not be able (or want) to render them.
So we are mostly interested in the second type here: The ones using unified search providers.

In Nextcloud's web UI, those providers are rendered with a
`generic search Vue component <https://github.com/nextcloud/nextcloud-vue/blob/master/src/components/NcRichText/NcReferencePicker/NcSearch.vue>`_
which shows a search input, lists the search result in a dropdown menu and directly submits the URL of the selected result.
The search is done by directly querying the Unified Search OCS API. This is described later.

To implement something similar to the Smart Picker in a client, it is required to know how to:

* Get the provider list
* Use the Unified Search OCS API
* Update the providers last usage date

Get the provider list
~~~~~~~~~~~~~~~~~~~~~

The list of Smart Picker providers can be obtained via an OCS endpoint.
Each provider object contains the list of supported unified search providers.

Here is the server endpoint to list the smart picker providers:

.. code-block:: bash

    curl -u USER:PASSWD -H "Accept: application/json" -H "ocs-apirequest: true" \
        "https://my.nextcloud.org/ocs/v2.php/references/providers"

and an example response:

.. code-block:: json

    {
      "ocs": {
    	"meta": {
    	  "status": "ok",
    	  "statuscode": 200,
    	  "message": "OK"
    	},
    	"data": [
    	  {
    	    "id": "github-issue-pr",
    	    "title": "GitHub issues, pull requests and comments",
    	    "icon_url": "https://my.nextcloud.org/apps/integration_github/img/app-dark.svg",
    	    "order": 10,
    	    "search_providers_ids": [
    	      "github-search-issues",
    	      "github-search-repos"
    	    ]
    	  },
    	  {
    	    "id": "openstreetmap-point",
    	    "title": "Map location (by OpenStreetMap)",
    	    "icon_url": "https://my.nextcloud.org/apps/integration_openstreetmap/img/app-dark.svg",
    	    "order": 10,
    	    "search_providers_ids": [
    	      "openstreetmap-search-location"
    	    ]
    	  },
    	  {
    	    "id": "files",
    	    "title": "Files",
    	    "icon_url": "https://my.nextcloud.org/apps/files/img/folder.svg",
    	    "order": 0
    	  }
    	]
      }
    }

In this example, the "files" Smart Picker provider does not support any unified search provider
but the "github-issue-pr" one supports 2 of them and the "openstreetmap-point" support one.

Use the Unified Search API
~~~~~~~~~~~~~~~~~~~~~~~~~~

More details in the :ref:`Unified Search<unified-search>` documentation.

Here is how to search using the Unified Search OCS API:

.. code-block:: bash

    curl -u USER:PASSWD -H "Accept: application/json" -H "ocs-apirequest: true" \
        "https://my.nextcloud.org/ocs/v2.php/search/providers/PROVIDER_ID/search?term=QUERY&limit=LIMIT"

    # with a cursor (paginated search)
    curl -u USER:PASSWD -H "Accept: application/json" -H "ocs-apirequest: true" \
        "https://my.nextcloud.org/ocs/v2.php/search/providers/PROVIDER_ID/search?term=QUERY&limit=LIMIT&cursor=CURSOR"

    # search a github issue with the query "bug"
    curl -u USER:PASSWD -H "Accept: application/json" -H "ocs-apirequest: true" \
        "https://my.nextcloud.org/ocs/v2.php/search/providers/github-search-issues/search?term=bug&limit=2"

Example response:

.. code-block:: json

    {
      "ocs": {
        "meta": {
          "status": "ok",
          "statuscode": 200,
          "message": "OK"
        },
        "data": {
          "name": "GitHub issues and pull requests",
          "isPaginated": true,
          "entries": [
            {
              "thumbnailUrl": "https://my.nextcloud.org/apps/integration_github/avatar/Daily-DAYO",
              "title": " [bug] Change Trim bugs",
              "subline": "⑁ DAYO_Android#409",
              "resourceUrl": "https://github.com/Daily-DAYO/DAYO_Android/pull/409",
              "icon": "",
              "rounded": true,
              "attributes": []
            },
            {
              "thumbnailUrl": "https://my.nextcloud.org/apps/integration_github/avatar/walinejs",
              "title": " [Bug]:  || [Bug]:",
              "subline": "⦿ waline#2014",
              "resourceUrl": "https://github.com/walinejs/waline/issues/2014",
              "icon": "",
              "rounded": true,
              "attributes": []
            }
          ],
          "cursor": 2
        }
      }
    }


Update a provider last usage date
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In Nextcloud's web UI, the order in which the providers are listed to the users depends on the last
date they were used. The most recently used providers are displayed first.

In a client, once a provider has been used, a request to this endpoint should be done:

.. code-block:: bash

    curl -u USER:PASSWD -H "Accept: application/json" -H "ocs-apirequest: true" -X PUT \
        "https://my.nextcloud.org/ocs/v2.php/search/provider/PROVIDER_ID"

A ``timestamp`` optional request parameter can be passed. The last usage date will be set to "now" by default.

Register a reference provider
-----------------------------

A reference provider is a class implementing the ``OCP\Collaboration\Reference\IReferenceProvider`` interface.
If you just want to resolve links, simply implement the ``IReferenceProvider`` interface.
This is described in the "Resolving links" section.

To support resolving links from public shares, the ``OCP\Collaboration\Reference\IPublicReferenceProvider`` interface
needs to be implemented as well.

If you want your reference provider to be used by the Smart Picker, you need to extend the
``OCP\Collaboration\Reference\ADiscoverableReferenceProvider`` class to declare all required information.

There are 2 ways to make your provider appear in the smart picker, in other words, 2 types of providers:

* Either your reference provider implements the ``OCP\Collaboration\Reference\ISearchableReferenceProvider`` interface and you declare a list of unified search providers that will be used by the Smart Picker
* Or you don't implement this ``ISearchableReferenceProvider`` interface and make sure you register a custom picker component in the frontend. This is described later in this documentation.

Extend link preview support
---------------------------

This section is focusing on the methods of the ``IReferenceProvider`` interface.

Links that are not matched by any reference provider will always be handled by the server's OpenGraph provider as a fallback.
This provider will try to get the information declared in the target page's meta tag. The link preview will be rendered with the
default widget.

For your provider to properly handle some links, you need to implement the ``matchReference`` and ``resolve``
methods of ``IReferenceProvider``.

In order to resolve links from a public share, ``resolvePublic`` from ``IPublicReferenceProvider`` has to be implemented
additionally.

Match links
~~~~~~~~~~~

The ``matchReference`` method of ``IReferenceProvider`` tells the reference manager if a provider supports a link or not.

.. code-block:: php

    public function matchReference(string $referenceText): bool {
        // support all URLs starting with https://my.website.org/
        return str_starts_with($referenceText, 'https://my.website.org/');
    }

Resolving links
~~~~~~~~~~~~~~~

The ``resolve`` method of ``IReferenceProvider`` is used to get information about a link and return it as a
``OCP\Collaboration\Reference\Reference`` object.

Respectively the ``resolvePublic`` method of ``IPublicReferenceProvider`` is used to get information about a
link from a public share (available since Nextcloud 30).

Using the default widget
^^^^^^^^^^^^^^^^^^^^^^^^

If you are fine with the default widget rendering (image on the left, text and subtext on the right),
then you just need to provide a title, a description and optionally an image.

.. code-block:: php

    public function resolveReference(string $referenceText): ?IReference {
        if ($this->matchReference($referenceText)) {
            $title = $this->myAwesomeService->getLinkTitle($referenceText);
            $description = $this->myAwesomeService->getLinkDescription($referenceText);
            $imageUrl = $this->myAwesomeService->getImageUrl($referenceText);

            $reference = new Reference($referenceText);
            $reference->setTitle($title);
            $reference->setDescription($description);
            $reference->setImageUrl($imageUrl);
            return $reference;
        }
        return null;
    }

    public function resolveReferencePublic(string $referenceText, string $shareToken): ?IReference {
        if ($this->checkShareToken() === $shareToken) {
            return $this->resolveReference($referenceText);
        }
        return null;
    }

Using custom reference widgets
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You can customize the rendering of the links you support with your provider.

On the provider side, you need to pass all the information needed by your
custom reference widget component by setting the "rich object" of the ``Reference``
object returned by the ``resolve`` method.

It is recommended to still set the title, description and image URL on the reference object
in case it is used by a client or in a context where the custom reference widgets can't be used.
This way we make sure any generic rendering of link previews still shows some information.

.. code-block:: php

    public function resolveReference(string $referenceText): ?IReference {
        if ($this->matchReference($referenceText)) {
            $title = $this->myAwesomeService->getLinkTitle($referenceText);
            $description = $this->myAwesomeService->getLinkDescription($referenceText);
            $imageUrl = $this->myAwesomeService->getImageUrl($referenceText);
            $extraInformation = $this->myAwesomeService->getExtraInformation($referenceText);

            $reference = new Reference($referenceText);
            $reference->setTitle($title);
            $reference->setDescription($description);
            $reference->setImageUrl($imageUrl);
            $reference->setRichObject(
                'my_rich_object_type',
                [
                    'title' => $title,
                    'description' => $description,
                    'image_url' => $imageUrl,
                    'extra_info' => $extraInformation,
                ]
            );

            return $reference;
        }
        return null;
    }

    public function resolveReferencePublic(string $referenceText, string $shareToken): ?IReference {
        if ($this->checkShareToken() === $shareToken) {
            return $this->resolveReference($referenceText);
        }
        return null;
    }

On the frontend side you need to implement and register your custom component. Here is a component example:

You need to react to the ``OCP\Collaboration\Reference\RenderReferenceEvent``
event to inject a script that will actually register the widget component when needed.
For example, in your ``lib/AppInfo/Application.php`` file:

.. code-block:: php

    $context->registerEventListener(OCP\Collaboration\Reference\RenderReferenceEvent::class, MyReferenceListener::class);

The corresponding ``MyReferenceListener`` class can look like:

.. code-block:: php

    <?php
    namespace OCA\MyApp\Listener;

    use OCA\MyApp\AppInfo\Application;
    use OCP\Collaboration\Reference\RenderReferenceEvent;
    use OCP\EventDispatcher\Event;
    use OCP\EventDispatcher\IEventListener;
    use OCP\Util;

    class MyReferenceListener implements IEventListener {
        public function handle(Event $event): void {
            if (!$event instanceof RenderReferenceEvent) {
                return;
            }

            Util::addScript(Application::APP_ID, 'myapp-reference');
        }
    }

The ``myapp-reference.js`` file contains the widget registration:

.. code-block:: javascript

    import { registerWidget } from '@nextcloud/vue/dist/Components/NcRichText.js'
    import Vue from 'vue'
    import MyCustomWidgetComponent from './MyCustomWidgetComponent.vue'

    Vue.mixin({ methods: { t, n } })

    // here we register the MyCustomWidgetComponent to handle rich objects which type is 'my_rich_object_type'
    registerWidget('my_rich_object_type', (el, { richObjectType, richObject, accessible }) => {
        const Widget = Vue.extend(MyCustomWidgetComponent)
        new Widget({
            propsData: {
                richObjectType,
                richObject,
                accessible,
            },
        }).$mount(el)
    })

And last but not least, the MyCustomWidgetComponent Vue component in which you can render the link preview
in a custom fashion:

.. code-block:: html

    <template>
        <div v-if="richObject">
            <div>
                <label>
                    {{ t('myapp', 'Title' }}
                </label>
                <span>
                    {{ richObject.title }}
                </span>
            <div>
            <div>
                <label>
                    {{ t('myapp', 'Extra info' }}
                </label>
                <span>
                    {{ richObject.extra_info }}
                </span>
            <div>
        </div>
    </template>

    <script>
    export default {
        name: 'MyCustomWidgetComponent',
        props: {
            richObjectType: {
                type: String,
                default: '',
            },
            richObject: {
                type: Object,
                default: null,
            },
            accessible: {
                type: Boolean,
                default: true,
            },
        },
    }
    </script>

.. _data-for-clients:

Interactive widgets
~~~~~~~~~~~~~~~~~~~

If you want to provide a custom widget that is interactive you can use the ``interactive`` attribute that is passed along the ``registerWidget`` function.

Apps will determine if they can render the interactive widget or not.

When writing a custom widget make sure properly handle different restrictions to ensure that the widget is usable in any integrating app.

- The width of the widget should be flexible and not exceed the width of the parent element.
- The height can be flexible but might be limited by the parent element, so ensure that the widget can be scrolled if necessary
- Your script will be loaded on every page that uses widget rendering so make sure to keep the script size as small as possible and use lazy loading for any additional resources

.. code-block:: javascript

    import { registerCustomPickerElement, registerWidget, NcCustomPickerRenderResult } from '@nextcloud/vue/dist/Functions/registerReference.js'

    registerWidget('my_rich_object_type', async (el, { richObjectType, richObject, accessible, interactive }) => {
        const { default: Vue } = await import('vue')
        const { default: MyWidget } = await import('./views/MyWidget.vue')

        const Widget = Vue.extend(MyWidget)
        const vueElement = new Widget({
            propsData: {
                richObjectType,
                richObject,
                accessible,
                interactive,
            },
        }).$mount(el)

        return new NcCustomPickerRenderResult(vueElement.$el, vueElement)
    }, (el, renderResult) => {
        renderResult.object.$destroy()
    }, true)

Provide generic data for clients
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In the web interface, the links that your app resolves are rendered with the OpenGraph widget
or the custom reference widget you implemented. So you have complete freedom on which data format you put in your rich objects
because you also control the web rendering implementation.

But as the web UI components cannot be used by desktop or mobile clients, they have to specifically support some rich objects
that are properly formatted.

Here are some formatting suggestions for a few use cases. Use them if you want your resolved links to be rendered in clients.
The idea is to add a generic attribute in your rich objects, regardless of the rich object type.

Version control issue
^^^^^^^^^^^^^^^^^^^^^

Set the rich object's ``vcs_issue`` attribute to an object which contains those attributes:

* ``id``: The issue ID (number)
* ``url``: The issue page URL
* ``title``: The issue title
* ``comment_count``: The number of comments in the issue
* ``state``: The issue state ('open' or 'closed')
* ``labels``: An array of labels. A label is an object with those attributes:
    * ``color``: Hexadecimal color code
    * ``name``: The label name
* ``created_at``: The creation timestamp
* ``author``: The user ID or name of the issue creator

Example implementation: `GitHub integration issue link preview <https://github.com/nextcloud/integration_github/blob/e6792ea0aadef4f5b8faaaaa163a0cf473d86157/lib/Reference/GithubIssuePrReferenceProvider.php#L135>`_

Version control pull request
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Set the rich object's ``vcs_pull_request`` attribute to an object which contains the same attributes as in ``vcs_issue`` plus these ones:

* ``merged``: Is it merged? (boolean)
* ``draft``: Is it a draft? (boolean)

Example implementation: `GitHub integration pull request link preview <https://github.com/nextcloud/integration_github/blob/e6792ea0aadef4f5b8faaaaa163a0cf473d86157/lib/Reference/GithubIssuePrReferenceProvider.php#L162>`_

Version control issue or pull request comment
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Set the rich object's ``vcs_comment`` attribute to an object which contains those attributes:

* ``url``: A direct link/permalink to the comment
* ``body``: The comment content in plain text or markdown
* ``author``: The user ID or name of the comment author
* ``created_at``: The creation timestamp
* ``updated_at``: The last edition timestamp

``vcs_comment`` can be set in addition to ``vcs_issue`` or ``vcs_pull_request``.


Images
^^^^^^

Set the rich object's ``image_TYPE`` attribute to ``true``. The clients will then know they can render this as an image
using the reference title, description and image URL that you have set.

Type can be ``gif``, ``jpeg``, ``png`` etc...

Example implementation: `Giphy integration <https://github.com/nextcloud/integration_giphy/blob/6c07af9c99014599bd3582a26e4fd99678b275ef/lib/Reference/GiphyReferenceProvider.php#L114-L124>`_

Extend the Smart Picker
-----------------------

If you want your reference provider to appear in the Smart Picker to search/get links,
it needs to be discoverable
(extend the ``OCP\Collaboration\Reference\ADiscoverableReferenceProvider`` abstract class)
and either

* support one or multiple Unified Search providers
* or register a custom picker component

This is an exclusive choice. You can't support search providers AND register a custom picker component.
If you still want to mix both approaches, you can register a custom picker component which includes a custom search feature.

Extending ``ADiscoverableReferenceProvider`` implies defining those methods:

* ``getId``: returns an ID which will be used by the Smart Picker to identify this provider
* ``getTitle``: returns a (ideally translated) provider title visible in the Smart Picker provider list
* ``getOrder``: returns an integer to help sorting the providers. The sort order is later superseded by last usage timestamp
* ``getIconUrl``: returns the URL of the provider icon, same as the title, the icon will be visible in the provider list

Declare supported Unified Search providers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you want your reference provider to let users pick links from unified search results, your reference provider must
implement ``OCP\Collaboration\Reference\ISearchableReferenceProvider`` and define the ``getSupportedSearchProviderIds``
method which return a list of supported search provider IDs.

Once this provider is selected in the Smart Picker, users will see a generic search interface giving results from
all the search providers you declared as supported. Once a result is selected, the Smart Picker will return
the associated resource URL.

Register a custom picker component
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

On the backend side, in your ``lib/AppInfo/Application.php``, you should listen to the
``OCP\Collaboration\Reference\RenderReferenceEvent``. In the corresponding listener, you should load
the scripts that will register custom picker components.

In other words, when the ``RenderReferenceEvent`` event is dispatched,
the Smart Picker will potentially by used in the frontend so you need to load the related scripts from your app.

You can define your own picker user interface for your provider by registering a custom picker component.
This can be done with the
``registerCustomPickerElement`` function from ``@nextcloud/vue/dist/Components/NcRichText.js``.
This function takes 3 parameters:

* The reference provider ID for which you register the custom picker component
* The callback function to create and mount your component
* The callback function to delete/destroy your component

The creation callback must return a ``NcCustomPickerRenderResult`` object to which you have to give the DOM element
you just created and optionally an object (the Vue instance for example).
This render result will be then be passed to the destroy callback to let you properly clean and delete your custom component.

To register a Vue component as a custom picker component:

.. code-block:: javascript

    import { registerCustomPickerElement, NcCustomPickerRenderResult } from '@nextcloud/vue/dist/Components/NcRichText.js'
    import Vue from 'vue'
    import MyCustomPickerElement from './MyCustomPickerElement.vue'

    registerCustomPickerElement('REFERENCE_PROVIDER_ID', (el, { providerId, accessible }) => {
        const Element = Vue.extend(MyCustomPickerElement)
        const vueElement = new Element({
            propsData: {
                providerId,
                accessible,
            },
        }).$mount(el)
        return new NcCustomPickerRenderResult(vueElement.$el, vueElement)
    }, (el, renderResult) => {
        // call the $destroy method on your custom element's Vue instance
        renderResult.object.$destroy()
    })

To register anything else:

.. code-block:: javascript

    import {
        registerCustomPickerElement,
        NcCustomPickerRenderResult,
    } from '@nextcloud/vue/dist/Components/NcRichText.js'

    registerCustomPickerElement('REFERENCE_PROVIDER_ID', (el, { providerId, accessible }) => {
        const paragraph = document.createElement('p')
        paragraph.textContent = 'click this button to return a link'
        el.append(paragraph)
        const button = document.createElement('button')
        button.textContent = 'I am a button'
        button.addEventListener('click', () => {
            const event = new CustomEvent(
                'submit',
                {
                    bubbles: true,
                    detail: 'https://nextcloud.com'
                }
            )
            el.dispatchEvent(event)
        })
        el.append(button)
        return new NcCustomPickerRenderResult(el)
    }, (el, renderResult) => {
        renderResult.element.remove()
    })

In your custom component, just emit the ``submit`` event with the result as the event's data to pass it back to the Smart Picker.
You can also emit the ``cancel`` event to abort and go back.
