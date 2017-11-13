.. sectionauthor:: John Molakvoæ <skjnldsv@protonmail.com>
.. codeauthor:: John Molakvoæ <skjnldsv@protonmail.com>
..  _settings:

===============
Settings
===============

To create a settings area create a div with the id ``app-settings`` inside the ``app-navigation`` div.

* The data attribute ``data-apps-slide-toggle`` slides up a target area using a jQuery selector and hides the area if the user clicks outside of it.
* Max height of the settings area is 300px. Do **not** change that.
* Keep it clear, organized and simple.

.. figure:: ../images/settings.*
   :alt: Settings
   :figclass: figure-with-code

.. code-block:: html

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
