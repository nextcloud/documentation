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
    