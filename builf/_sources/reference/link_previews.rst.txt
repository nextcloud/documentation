=============
Link previews
=============

Link previews are available in some places in Nextcloud.
There are 3 types of link preview:

* The ones for links that are supported by a reference provider
    * Without custom reference widget (uses a default generic style, image + title + description)
    * With custom reference widget (implemented by the app which supports the link)
* Default ones from OpenGraph information. This is the fallback for every unsupported link

Where do they appear?
---------------------

The link previews provided by the Nextcloud reference system appear in the following places:

* Text (and Collectives pages, Notes, Deck card comments, Files comments etc...)
    * Directly in the document content, next to the links
    * Only one link preview per paragraph is rendered
    * Custom widgets can be rendered
* Talk
    * In the messages
    * Only one link preview per message is rendered
    * Custom widgets can be rendered
* Nextcloud Office
    * In the document content when hovering on links
    * Custom widgets are not rendered

How does it work?
-----------------

The Nextcloud frontend asks the server to resolve the links via an API request. A rich object is returned as a response
and is used by the frontend to render the preview.

The apps can optionally register a custom reference widget to render a specific rich object type (on the links it supports).
Therefore the apps have complete freedom over how some previews look like.

Known link preview providers
----------------------------

* `Collectives <https://github.com/nextcloud/collectives>`_: Links to Collective pages
* `Tables <https://github.com/nextcloud/tables>`_: Links to tables
* `Deck <https://github.com/nextcloud/deck>`_: Links to boards, cards and comments
* `Talk <https://github.com/nextcloud/spreed>`_: Links to conversations

* `GitHub integration <https://github.com/nextcloud/integration_github>`_: Links to GitHub issues, pull requests, comments and repositories
* `GitLab integration <https://github.com/nextcloud/integration_gitlab>`_: Links to Gitlab issues, merge requests, comments and repositories
* `Zammad integration <https://github.com/nextcloud/integration_zammad>`_: Links to Zammad tickets
* `Reddit integration <https://github.com/nextcloud/integration_reddit>`_: Links to subreddits, publications and comments
* `Mastodon integration <https://github.com/nextcloud/integration_mastodon>`_: Links to members and toots
* `The Movie Database integration <https://github.com/julien-nc/integration_tmdb>`_: Links to people, movies and series
* `OpenStreetMap integration <https://github.com/julien-nc/integration_openstreetmap>`_: Location links from OpenStreetMap, Google maps, Bing maps, Here maps and Duckduckgo maps
* `Giphy integration <https://github.com/julien-nc/integration_giphy>`_: Links to GIFs
* `Notion integration <https://github.com/nextcloud/integration_notion>`_: Links to Notion documents
* `Peertube integration <https://github.com/julien-nc/integration_peertube>`_: Links to videos
