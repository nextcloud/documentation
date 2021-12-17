.. sectionauthor:: John Molakvoæ <skjnldsv@protonmail.com>
.. codeauthor:: John Molakvoæ <skjnldsv@protonmail.com>

=============
Content list
=============

Introduction
=============

On the main content, you may want to have a list of items displayed (like the contacts, or the mail app).
We provide a standardized structure for this specific purpose.

Basic layout
=============

.. figure:: ../images/list.png
   :alt: Content list screenshot

.. code-block:: html

    <div id="app-content-wrapper">
        <div class="app-content-list">
            <a href="#" class="app-content-list-item">
                <input type="checkbox" id="test1" class="app-content-list-item-checkbox checkbox" checked="checked"><label for="test1"></label>
                <div class="app-content-list-item-icon" style="background-color: rgb(231, 192, 116);">C</div>
                <div class="app-content-list-item-line-one">Contact 1</div>
                <div class="icon-delete"></div>
            </a>
            <a href="#" class="app-content-list-item">
                <div class="app-content-list-item-star icon-starred"></div>
                <div class="app-content-list-item-icon" style="background-color: rgb(151, 72, 96);">T</div>
                <div class="app-content-list-item-line-one">Favourited task #2</div>
                <div class="icon-more"></div>
            </a>
            <a href="#" class="app-content-list-item">
                <div class="app-content-list-item-icon" style="background-color: rgb(152, 59, 144);">T</div>
                <div class="app-content-list-item-line-one">Task #2</div>
                <div class="icon-more"></div>
            </a>
            <a href="#" class="app-content-list-item">
                <div class="app-content-list-item-icon" style="background-color: rgb(31, 192, 216);">M</div>
                <div class="app-content-list-item-line-one">Important mail is very important! Don't ignore me</div>
                <div class="app-content-list-item-line-two">Hello there, here is an important mail from your mom</div>
            </a>
            <a href="#" class="app-content-list-item">
                <div class="app-content-list-item-icon" style="background-color: rgb(41, 97, 156);">N</div>
                <div class="app-content-list-item-line-one">Important mail with a very long subject</div>
                <div class="app-content-list-item-line-two">Hello there, here is an important mail from your mom</div>
                <span class="app-content-list-item-details">8 hours ago</span>
                <div class="icon-delete"></div>
            </a>
            <a href="#" class="app-content-list-item">
                <div class="app-content-list-item-icon" style="background-color: rgb(141, 197, 156);">N</div>
                <div class="app-content-list-item-line-one">New contact</div>
                <div class="app-content-list-item-line-two">blabla@bla.com</div>
                <div class="icon-delete"></div>
            </a>
        </div>
        <div class="app-content-detail">
        </div>
    </div>


Rules and information
======================

* You need to have the following structure for your global content:

.. code-block:: html

    <div id="app-content-wrapper">
        <div class="app-content-list">HERE YOUR CONTENT LIST</div>
        <div class="app-content-detail">HERE YOUR GLOBAL CONTENT</div>
    </div>

* The first code/screenshot example show all the combination allowed/available.
* When displaying the checkbox, the star will automatically be hidden.
* The checkboxes are hidden by default. They're shown when checked or when hover/focus/active
* If you want to show **all** the checkboxes, apply the ``selection`` class to the ``app-content-list``.
* You can **NOT** have more than one button in an entry. You need to create a :ref:`popover menu <popovermenu>` if multiple options are needed.
   * In case of a popovermenu, see the :ref:`popover menu <popovermenulist>`.
   * As always, the **JS** is still needed to toggle the ``open`` class on this menu
* If you use the ``app-content-list`` standard, the ``app-content-details`` div will be hidden in mobile mode (full screen).
  You will need to add the ``showdetails`` class to the ``app-content-list`` to show the main content. 
  On mobile view, the whole list/details section (depending on which is shown) will scroll the body.

.. _popovermenulist:

Popovermenu in item
====================

If you need a menu inside an item, you need to wrap it with the ``icon-more`` ``div`` inside a ``app-content-list-menu`` div.

.. figure:: ../images/list-menu.png
   :alt: Content list with menu
   :figclass: figure-with-code

.. code-block:: html

    <div class="app-content-list-item-menu">
        <div class="icon-more"></div>
        <div class="popovermenu">
            <ul>
                <li>
                    <a href="#" class="icon-details">
                        <span>Details</span>
                    </a>
                </li>
                <li>
                    <button class="icon-details">
                        <span>Details</span>
                    </button>
                </li>
                <li>
                    <button>
                        <span class="icon-details"></span>
                        <span>Details</span>
                    </button>
                </li>
                <li>
                    <a>
                        <span class="icon-details"></span>
                        <span>Details</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
