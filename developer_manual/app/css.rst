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

Icons
=====
To use icons which are shipped in core, special class to apply the background image are supplied:

* **icon-breadcrumb**:
    .. image:: ../img/7/breadcrumb.png

* **icon-loading**:
    .. image:: ../img/7/loading.gif

* **icon-loading-dark**:
    .. image:: ../img/7/loading-dark.gif

* **icon-loading-small**:
    .. image:: ../img/7/loading-small.gif

* **icon-noise**:
    .. image:: ../img/7/noise.png

* **icon-add**:
    .. image:: ../img/7/actions/add.svg

* **icon-caret**:
    .. image:: ../img/7/actions/caret.svg

* **icon-caret-dark**:
    .. image:: ../img/7/actions/caret-dark.svg

* **icon-checkmark**:
    .. image:: ../img/7/actions/checkmark.svg

* **icon-checkmark-white**:
    .. image:: ../img/7/actions/checkmark-white.svg

* **icon-clock**:
    .. image:: ../img/7/actions/clock.svg

* **icon-close**:
    .. image:: ../img/7/actions/close.svg

* **icon-confirm**:
    .. image:: ../img/7/actions/confirm.svg

* **icon-delete**:
    .. image:: ../img/7/actions/delete.svg

* **icon-download**:
    .. image:: ../img/7/actions/download.svg

* **icon-history**:
    .. image:: ../img/7/actions/history.svg

* **icon-info**:
    .. image:: ../img/7/actions/info.svg

* **icon-lock**:
    .. image:: ../img/7/actions/lock.svg

* **icon-logout**:
    .. image:: ../img/7/actions/logout.svg

* **icon-mail**:
    .. image:: ../img/7/actions/mail.svg

* **icon-more**:
    .. image:: ../img/7/actions/more.svg

* **icon-password**:
    .. image:: ../img/7/actions/password.svg

* **icon-pause**:
    .. image:: ../img/7/actions/pause.svg

* **icon-pause-big**:
    .. image:: ../img/7/actions/pause-big.svg

* **icon-play**:
    .. image:: ../img/7/actions/play.svg

* **icon-play-add**:
    .. image:: ../img/7/actions/play-add.svg

* **icon-play-big**:
    .. image:: ../img/7/actions/play-big.svg

* **icon-play-next**:
    .. image:: ../img/7/actions/play-next.svg

* **icon-play-previous**:
    .. image:: ../img/7/actions/play-previous.svg

* **icon-public**:
    .. image:: ../img/7/actions/public.svg

* **icon-rename**:
    .. image:: ../img/7/actions/rename.svg

* **icon-search**:
    .. image:: ../img/7/actions/search.svg

* **icon-settings**:
    .. image:: ../img/7/actions/settings.svg


* **icon-share**:
    .. image:: ../img/7/actions/share.svg

* **icon-shared**:
    .. image:: ../img/7/actions/shared.svg

* **icon-sound**:
    .. image:: ../img/7/actions/sound.svg

* **icon-sound-off**:
    .. image:: ../img/7/actions/sound-off.svg

* **icon-star**:
    .. image:: ../img/7/actions/star.svg

* **icon-starred**:
    .. image:: ../img/7/actions/starred.svg

* **icon-toggle**:
    .. image:: ../img/7/actions/toggle.svg


* **icon-triangle-e**:
    .. image:: ../img/7/actions/triangle-e.svg

* **icon-triangle-n**:
    .. image:: ../img/7/actions/triangle-n.svg

* **icon-triangle-s**:
    .. image:: ../img/7/actions/triangle-s.svg


* **icon-upload**:
    .. image:: ../img/7/actions/upload.svg

* **icon-upload-white**:
    .. image:: ../img/7/actions/upload-white.svg


* **icon-user**:
    .. image:: ../img/7/actions/user.svg

* **icon-view-close**:
    .. image:: ../img/7/actions/view-close.svg

* **icon-view-next**:
    .. image:: ../img/7/actions/view-next.svg

* **icon-view-pause**:
    .. image:: ../img/7/actions/view-pause.svg

* **icon-view-play**:
    .. image:: ../img/7/actions/view-play.svg

* **icon-view-previous**:
    .. image:: ../img/7/actions/view-previous.svg

* **icon-calendar-dark**:
    .. image:: ../img/7/places/calendar-dark.svg

* **icon-contacts-dark**:
    .. image:: ../img/7/places/contacts-dark.svg

* **icon-file**:
    .. image:: ../img/7/places/file.svg

* **icon-files**:
    .. image:: ../img/7/places/files.svg

* **icon-folder**:
    .. image:: ../img/7/places/folder.svg

* **icon-filetype-text**:
    .. image:: ../img/7/filetypes/text.svg

* **icon-filetype-folder**:
    .. image:: ../img/7/filetypes/folder.svg

* **icon-home**:
    .. image:: ../img/7/places/home.svg

* **icon-link**:
    .. image:: ../img/7/places/link.svg

* **icon-music**:
    .. image:: ../img/7/places/music.svg

* **icon-picture**:
    .. image:: ../img/7/places/picture.svg
