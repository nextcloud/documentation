====================
Reference management
====================

The reference management system brings 2 features in Nextcloud:

* :doc:`The link previews <./link_previews>` (also called reference widgets)
* :doc:`The Smart Picker <./smart_picker>`

Both those features are generic and need to be extended by the Nextcloud apps.

Apps can add support for some HTTP links so previews are rendered in various places like Text documents and Talk messages.

The Smart Picker is a frontend component which allows users to search or generate links or text.

Apps can register Smart Picker providers to extend its capabilities.
Administrators can choose which Smart Picker providers they want to
make available to the users by choosing which apps they install.
All the Smart Picker providers shipped in the recommended apps do **not** send any data to 3rd party services.
Some community apps Smart Picker providers might rely on 3rd party services.

.. toctree::
    :maxdepth: 2

    link_previews
    smart_picker
