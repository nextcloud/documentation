.. sectionauthor:: John Molakvoæ <skjnldsv@protonmail.com>
.. codeauthor:: John Molakvoæ <skjnldsv@protonmail.com>

===============
App Navigation
===============

Introduction
=============

The main navigation menu represent the most important part of your app.

It needs to be:

* Organised
* Simple
* Responsive

Nextcloud provide a very organized way of building menus.
We implemented various essential functions and provide easy way of using them.

Basic layout
=============

.. code-block:: html

	<div id="app-navigation">
	    <ul>
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

Utils
======

Each entry is allowed to have a counter and/or a button for user interraction.

* The ``app-navigation-entry-utils`` snippet need to be placed right next to the main link of your entry.
* Maximum **two** items are allowed into the utils section. You can have:
	* Two buttons
	* One button and one counter
* You **can't** have more than two buttons, if you need more, you need to add a menu.
* The order of the button and the counter are **not** interchangeable. You need to put the counter before the menu.

.. code-block:: html

	<div class="app-navigation-entry-utils">
		<ul>
			<li class="app-navigation-entry-utils-counter">1</li>
			<li class="app-navigation-entry-utils-menu-button">
				<button></button>
			</li>
		</ul>
	</div>

Menu
^^^^^

If you need to add a few interractions for your entry, you can but everything in a popover menu.
The menu needs to be placed after the ``app-navigation-entry-utils``.

.. code-block:: html

	<div class="app-navigation-entry-menu">
		<ul>
			<li>
				<a href="#">
					<span class="icon-add"></span>
					<span>Add</span>
				</a>
			</li>
			<li>
				<a href="#">
					<span class="icon-rename"></span>
					<span>Edit</span>
				</a>
			</li>
			<li>
				<a href="#">
					<span class="icon-delete"></span>
					<span>Remove</span>
				</a>
			</li>
		</ul>
	</div>

Counter
^^^^^^^^

If you need to add a counter to your menu entry, you can simply use this structure.
Do not change the alignment of the text. If you're using

.. code-block:: html

	<li class="app-navigation-entry-utils-counter">1</li>




Collapsible entry
==================


Entry bullet
=============

Undo entry
===========

Edit entry
===========

Pinned entry
=============
