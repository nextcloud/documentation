.. sectionauthor:: John Molakvoæ <skjnldsv@protonmail.com>
.. codeauthor:: John Molakvoæ <skjnldsv@protonmail.com>

============
Main content
============

Since 14, we standardized our structure.

Your application will be directly injected into the ``#content`` div.


.. code-block:: html

	<header>
		<div class="header-left">
			<!-- apps menu -->
		</div>
		<div class="header-right">
			<!-- search - contactsmenu - settingsmenu - ... -->
		</div>
	</header>
	<div id="content" class="app-YOURAPPID">
		<div id="app-navigation" class="">
			<div class="app-navigation-new">
				<!-- app 'new' button -->
			</div>
			<ul id="usergrouplist">
				<!-- app navigation -->
			</ul>
			<div id="app-settings">
				<!-- app settings -->
			</div>
		</div>
		<div id="app-content">
			<div id="app-navigation-toggle" class="icon-menu"></div>
			<!-- app-content-wrapper is optional, only use if app-content-list  -->
			<div id="app-content-wrapper">
				<div class="app-content-list">
					<!-- app list -->
				</div>
				<div class="app-content-details"></div>
				<!-- app content -->
			</div>
		</div>
		<div id="app-sidebar"></div>
	</div>


Rules and information
======================

* You cannot nor need to modify the header or the outside elements of your application.
* The whole body needs to scroll to be compatible with the mobile views. Therefore the sidebar and the app-navigation are fixed/sticky.
* Unless your application does not require a scrollable area, do not use any overflow properties on the parents of your content.
* The ``app-navigation-toggle`` is automatically injected. The navigation hide/show is automatically managed.
* Do not use ``#content-wrapper`` anymore
* If your app is injecting itself by replacing the #content element, make sure to keep the ``#content`` id
* If you use the ``app-content-list`` standard, the ``app-content-details`` div will be hidden in mobile mode (full screen).
  You will need to add the ``showdetails`` class to the ``app-content-list`` to show the main content. 
  On mobile view, the whole list/details section (depending on which is shown) will scroll the body
