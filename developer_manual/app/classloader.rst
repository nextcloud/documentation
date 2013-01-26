Classloader
===========

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

The classloader is provided by ownCloud and loads all your classes automatically. The only thing left to include by yourself are 3rdparty libraries.
Note that this means that the classes need to be named and organized in folders according to their full qualifier.

The classloader works like this:

* Take the full qualifier of a class::

    \OCA\AppTemplateAdvanced\Db\ItemMapper

* If it starts with \\OCA include file from the apps directory
* Cut off \\OCA::

    \AppTemplateAdvanced\Db\ItemMapper

* Convert all charactes to lowercase::

    \apptemplateadvanced\db\itemmapper

* Replace \\ with /::

    /apptemplateadvanced/db/itemmapper

* Append .php::

    /apptemplateadvanced/db/itemmapper.php

* Include the file::

    require '/apps/apptemplateadvanced/db/itemmapper.php';

Remember : for it to be autoloaded, the :file:`itemmapper.php` needs to either be stored in the **/apps/apptemplateadvanced/db/** folder, or adjust its namespace according to the folder it's stored in.