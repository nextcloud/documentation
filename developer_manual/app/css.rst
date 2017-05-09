===
CSS
===

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The CSS files reside in the **css/** folder and should be included in the template:

.. code-block:: php

  <?php
  // include one file
  style('myapp', 'style');  // adds css/style.css

  // include multiple files for the same app
  style('myapp', array('style', 'navigation'));  // adds css/style.css, css/navigation.css

  // include vendor file (also allows array syntax)
  vendor_style('myapp', 'style');  // adds vendor/style.css

Web Components go into the **component/** folder and can be imported like this:

.. code-block:: php

  <?php
  // include one file
  component('myapp', 'tabs');  // adds component/tabs.html
  
  // include multiple files for the same app
  component('myapp', array('tabs', 'forms'));  // adds component/tabs.html, component/forms.html
  
  
.. note:: Keep in mind that Web Components are still very new and you `might need to add polyfills <https://www.webcomponents.org/polyfills/>`_
  
Standard layout
===============
To use the commonly used layout consisting of sidebar navigation and content the **app-navigation** and **app-content** ids can be used:

.. code-block:: html

    <div id="app">
        <div id="app-navigation">Your navigation</div>
        <div id="app-content">
            <div id="app-content-wrapper">
                Your content in here
            </div>
        </div>
    </div>

For built in mobile support your content has to be wrapped inside another div with the id **app-content-wrapper**.

Navigation
==========
Nextcloud provides a default CSS navigation layout. If list entries should have 16x16 px icons, the **with-icon** class can be added to the base **ul**. The maximum supported indention level is two, further indentions are not recommended.

.. code-block:: html

    <div id="app-navigation">
        <ul class="with-icon">
            <li><a href="#">First level entry</a></li>
            <li>
                <a href="#">First level container</a>
                <ul>
                    <li><a href="#">Second level entry</a></li>
                    <li><a href="#">Second level entry</a></li>
                </ul>
            </li>
        </ul>
    </div>

Folders
-------

Folders are like normal entries and are only supported for the first level. In contrast to normal entries, the links which show the title of the folder need to have the **icon-folder** CSS class.

If the folder should be collapsible, the **collapsible** class and a button with the class **collapse** are needed. After adding the collapsible class the folder's child entries can be toggled by adding the **open** class to the list element:

.. code-block:: html

    <div id="app-navigation">
        <ul class="with-icon">
            <li><a href="#">First level entry</a></li>
            <li class="collapsible open">
                <button class="collapse"></button>
                <a href="#" class="icon-folder svg">Folder name</a>
                <ul>
                    <li><a href="#">Folder contents</a></li>
                    <li><a href="#">Folder contents</a></li>
                </ul>
            </li>
        </ul>
    </div>


Drag and drop
-------------
The class which should be applied to a first level element (**li**) that hosts or can host a second level is **drag-and-drop**. This will cause the hovered entry to slide down giving a visual hint that it can accept the dragged element. In case of jQuery UI's droppable feature, the **hoverClass** option should be set to the **drag-and-drop** class.

.. code-block:: html

    <div id="app-navigation">
        <ul class="with-icon">
            <li><a href="#">First level entry</a></li>
            <li class="drag-and-drop">
                <a href="#" class="icon-folder svg">Folder name</a>
                <ul>
                    <li><a href="#">Folder contents</a></li>
                    <li><a href="#">Folder contents</a></li>
                </ul>
            </li>
        </ul>
    </div>

Menus
-----

.. versionadded:: 8

To add actions that affect the current list element you can add a menu for second and/or first level elements by adding the button and menu inside the corresponding **li** element and adding the **with-menu** CSS class:

.. code-block:: html

    <div id="app-navigation">
        <ul>
            <li class="with-counter with-menu">
                <a href="#">First level entry</a>

                <div class="app-navigation-entry-utils">
                    <ul>
                        <li class="app-navigation-entry-utils-counter">15</li>
                        <li class="app-navigation-entry-utils-menu-button svg"><button></button></li>
                    </ul>
                </div>

                <div class="app-navigation-entry-menu">
                    <ul>
                        <li>
                            <a href="#" class="menuitem action action-edit permanent">
                                <span class="icon icon-rename"></span>
                                <span><?php p($l->t('Edit group'));?></span>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="menuitem action action-delete permanent">
                                <span class="icon icon-delete"></span>
                                <span><?php p($l->t('Delete group'));?></span>
                            </a>
                        </li>
                    </ul>
                </div>

            </li>
        </ul>
    </div>

The div with the class **app-navigation-entry-utils** contains only the button (class: **app-navigation-entry-utils-menu-button**) to display the menu but in many cases another entry is needed to display some sort of count (mails count, unread feed count, etc.). In that case add the **with-counter** class to the list entry to adjust the correct padding and text-overflow of the entry's title.

The count should be limitted to 999 and turn to 999+ if any higher number is given. If AngularJS is used the following filter can be used to get the correct behaviour:

.. code-block:: js

    app.filter('counterFormatter', function () {
        'use strict';
        return function (count) {
            if (count > 999) {
                return '999+';
            }
            return count;
        };
    });

Use it like this:

.. code-block:: html

    <li class="app-navigation-entry-utils-counter">{{ count | counterFormatter }}</li>

The menu is hidden by default (**display: none**) and has to be triggered by adding the **open** class to the **app-navigation-entry-menu** div.

In case of AngularJS the following small directive can be added to handle all the display and click logic out of the box:

.. code-block:: js

    app.run(function ($document, $rootScope) {
        'use strict';
        $document.click(function (event) {
            $rootScope.$broadcast('documentClicked', event);
        });
    });

    app.directive('appNavigationEntryUtils', function () {
        'use strict';
        return {
            restrict: 'C',
            link: function (scope, elm) {
                var menu = elm.siblings('.app-navigation-entry-menu');
                var button = $(elm)
                    .find('.app-navigation-entry-utils-menu-button button');

                button.click(function () {
                    menu.toggleClass('open');
                });

                scope.$on('documentClicked', function (scope, event) {
                    if (event.target !== button[0]) {
                        menu.removeClass('open');
                    }
                });
            }
        };
    });

Editing
-------

.. versionadded:: 8

Often an edit option is needed for an entry. To add one for a given entry simply hide the title and add the following div inside the entry:

.. code-block:: html

    <div id="app-navigation">
        <ul class="with-icon">
            <li>
                <a href="#" class="hidden">First level entry</a>

                <div class="app-navigation-entry-edit">
                    <form>
                        <input type="text" value="First level entry" autofocus-on-insert>
                        <input type="submit" value="" class="action icon-checkmark svg">
                    </form>
                </div>

            </li>
        </ul>
    </div>

If AngularJS is used you want to autofocus the input box. This can be achieved by placing the show condition inside an **ng-if** on the **app-navigation-entry-edit** div and adding the following directive:

.. code-block:: js

    app.directive('autofocusOnInsert', function () {
        'use strict';
        return function (scope, elm) {
            elm.focus();
        };
    });

**ng-if** is required because it removes/inserts the element into the DOM dynamically instead of just adding a **display: none** to it like **ng-show** and **ng-hide**.

Undo entry
----------

.. versionadded:: 8

If you want to undo a performed action on a navigation entry such as deletion, you should show the undo directly in place of the entry and make it disappear after location change or 7 seconds:


.. code-block:: html

    <div id="app-navigation">
        <ul class="with-icon">
            <li>
                <a href="#" class="hidden">First level entry</a>

                <div class="app-navigation-entry-deleted">
                    <div class="app-navigation-entry-deleted-description">Deleted X</div>
                    <button class="app-navigation-entry-deleted-button icon-history svg" title="Undo"></button>
                </div>
            </li>
        </ul>
    </div>


Settings Area
=============
To create a settings area create a div with the id **app-settings** inside the **app-navigation** div:

.. code-block:: html

    <div id="app">

        <div id="app-navigation">

            <!-- Your navigation here -->

            <div id="app-settings">
                <div id="app-settings-header">
                    <button class="settings-button"
                            data-apps-slide-toggle="#app-settings-content"
                    ><?php p($l->t('Settings'));?></button>
                </div>
                <div id="app-settings-content">
                    <!-- Your settings in here -->
                </div>
            </div>
        </div>
    </div>

The data attribute **data-apps-slide-toggle** slides up a target area using a jQuery selector and hides the area if the user clicks outside of it.

Icons
=====
To use icons which are shipped in core, special classes to apply the background image are supplied. All of these classes use **background-position: center** and **background-repeat: no-repeat**.

* **icon-breadcrumb**:
    .. image:: ../img/7/breadcrumb.png

* **icon-loading**:
    .. image:: ../img/7/loading.png

* **icon-loading-dark**:
    .. image:: ../img/7/loading-dark.png

* **icon-loading-small**:
    .. image:: ../img/7/loading-small.png

* **icon-add**:
    .. image:: ../img/7/actions/add.png

* **icon-caret**:
    .. image:: ../img/7/actions/caret.png

* **icon-caret-dark**:
    .. image:: ../img/7/actions/caret-dark.png

* **icon-checkmark**:
    .. image:: ../img/7/actions/checkmark.png

* **icon-checkmark-white**:
    .. image:: ../img/7/actions/checkmark-white.png

* **icon-clock**:
    .. image:: ../img/7/actions/clock.png

* **icon-close**:
    .. image:: ../img/7/actions/close.png

* **icon-confirm**:
    .. image:: ../img/7/actions/confirm.png

* **icon-delete**:
    .. image:: ../img/7/actions/delete.png

* **icon-download**:
    .. image:: ../img/7/actions/download.png

* **icon-history**:
    .. image:: ../img/7/actions/history.png

* **icon-info**:
    .. image:: ../img/7/actions/info.png

* **icon-lock**:
    .. image:: ../img/7/actions/lock.png

* **icon-logout**:
    .. image:: ../img/7/actions/logout.png

* **icon-mail**:
    .. image:: ../img/7/actions/mail.png

* **icon-more**:
    .. image:: ../img/7/actions/more.png

* **icon-password**:
    .. image:: ../img/7/actions/password.png

* **icon-pause**:
    .. image:: ../img/7/actions/pause.png

* **icon-pause-big**:
    .. image:: ../img/7/actions/pause-big.png

* **icon-play**:
    .. image:: ../img/7/actions/play.png

* **icon-play-add**:
    .. image:: ../img/7/actions/play-add.png

* **icon-play-big**:
    .. image:: ../img/7/actions/play-big.png

* **icon-play-next**:
    .. image:: ../img/7/actions/play-next.png

* **icon-play-previous**:
    .. image:: ../img/7/actions/play-previous.png

* **icon-public**:
    .. image:: ../img/7/actions/public.png

* **icon-rename**:
    .. image:: ../img/7/actions/rename.png

* **icon-search**:
    .. image:: ../img/7/actions/search.png

* **icon-settings**:
    .. image:: ../img/7/actions/settings.png


* **icon-share**:
    .. image:: ../img/7/actions/share.png

* **icon-shared**:
    .. image:: ../img/7/actions/shared.png

* **icon-sound**:
    .. image:: ../img/7/actions/sound.png

* **icon-sound-off**:
    .. image:: ../img/7/actions/sound-off.png

* **icon-star**:
    .. image:: ../img/7/actions/star.png

* **icon-starred**:
    .. image:: ../img/7/actions/starred.png

* **icon-toggle**:
    .. image:: ../img/7/actions/toggle.png


* **icon-triangle-e**:
    .. image:: ../img/7/actions/triangle-e.png

* **icon-triangle-n**:
    .. image:: ../img/7/actions/triangle-n.png

* **icon-triangle-s**:
    .. image:: ../img/7/actions/triangle-s.png


* **icon-upload**:
    .. image:: ../img/7/actions/upload.png

* **icon-upload-white**:
    .. image:: ../img/7/actions/upload-white.png


* **icon-user**:
    .. image:: ../img/7/actions/user.png

* **icon-view-close**:
    .. image:: ../img/7/actions/view-close.png

* **icon-view-next**:
    .. image:: ../img/7/actions/view-next.png

* **icon-view-pause**:
    .. image:: ../img/7/actions/view-pause.png

* **icon-view-play**:
    .. image:: ../img/7/actions/view-play.png

* **icon-view-previous**:
    .. image:: ../img/7/actions/view-previous.png

* **icon-calendar-dark**:
    .. image:: ../img/7/places/calendar-dark.png

* **icon-contacts-dark**:
    .. image:: ../img/7/places/contacts-dark.png

* **icon-file**:
    .. image:: ../img/7/places/file.png

* **icon-files**:
    .. image:: ../img/7/places/files.png

* **icon-folder**:
    .. image:: ../img/7/places/folder.png

* **icon-filetype-text**:
    .. image:: ../img/7/filetypes/text.png

* **icon-filetype-folder**:
    .. image:: ../img/7/filetypes/folder.png

* **icon-home**:
    .. image:: ../img/7/places/home.png

* **icon-link**:
    .. image:: ../img/7/places/link.png

* **icon-music**:
    .. image:: ../img/7/places/music.png

* **icon-picture**:
    .. image:: ../img/7/places/picture.png
