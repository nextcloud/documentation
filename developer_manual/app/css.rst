===
CSS
===

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

The CSS files reside in the **css/** folder and should be included in the template:

.. code-block:: php

  <?php
  \OCP\Util::addStyle('myapp', 'style');  // adds js/style.css

Standard layout
===============
To use the commonly used layout consisting of sidebar navigation and content the **app-navigation** and **app-content** ids can be used:

.. code-block:: html

    <div id="app">
        <div id="app-navigation">Your navigation</div>
        <div id="app-content">Your content</div>
    </div>

Navigation
==========
ownCloud provides a default CSS navigation layout. If list entries should have 16x16 px icons, the **with-icon** class can be added to the base **ul**:

.. code-block:: html

    <div id="app-navigation">
        <ul class="with-icon">
            <li><a href="#">First level</a></li>
            <li>
                <ul>
                    <li><a href="#">Second level</a></li>
                    <li><a href="#">Second level</a></li>
                </ul>
            </li>
        </ul>
    </div>

Settings Area
=============
To create a settings area create a div with the id **app-settings** inside the **app-navgiation** div:

.. code-block:: html

    <div id="app">

        <div id="app-navigation">

            <!-- Your navigation here -->

            <div id="app-settings">
                <div id="app-settings-header">
                    <button class="settings-button"
                            data-apps-slide-toggle="#app-settings-content"
                    ></button>
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
To use icons which are shipped in core, special class to apply the background image are supplied. All of these classes use **background-position: center** and **background-repeat: no-repeat**.

* **icon-breadcrumb**:
    .. image:: ../img/7/breadcrumb.png

* **icon-loading**:
    .. image:: ../img/7/loading.png

* **icon-loading-dark**:
    .. image:: ../img/7/loading-dark.png

* **icon-loading-small**:
    .. image:: ../img/7/loading-small.png

* **icon-noise**:
    .. image:: ../img/7/noise.png

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
