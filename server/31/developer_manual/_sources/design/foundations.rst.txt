===========
Foundations
===========

There are several design elements that are common to all Nextcloud apps. If you are developing for a platform that has its own design specifications, for example Android, it would be a good idea to keep those in mind while designing your app.

For web apps, there is the `Vue library <https://nextcloud-vue-components.netlify.app/>`_ and the `Penpot design kit <https://design.penpot.app/#/view/db3839da-807b-8052-8002-576401e9a375?page-id=db3839da-807b-8052-8002-576401e9a376&section=interactions&index=0&share-id=11fde340-21f4-802e-8002-8d8d305e7ab5>`_.

Color
-----

`Penpot colors <https://design.penpot.app/#/view/db3839da-807b-8052-8002-576401e9a375?page-id=3f784c86-6c27-80c6-8002-6ab128f3ffe2&section=interactions&index=3&share-id=11fde340-21f4-802e-8002-8d8d305e7ab5>`_

Primary color
^^^^^^^^^^^^^

.. figure:: ../images/colour-primary.svg
	 	
		#0082C9

While this is the primary color associated with Nextcloud and can be used to draw attention to an element, it is best to limit the usage of this to primary actions and other important elements.

.. note:: 
	 The primary color can be customized by admins through theming, but the default experience will be Nextcloud blue. If the primary color is themed to something very light like a shade of yellow, the text or header icons will be inverted to dark automatically.

* On web: ``var(--color-primary-element)``
* Android: uses default Material Design colors
* iOS: `systemFill <https://developer.apple.com/documentation/uikit/uicolor/3255070-systemfill>`_
* Desktop: `default Qt guidelines <https://doc.qt.io/qt-5/qpalette.html#ColorRole-enum>`_

Background color
^^^^^^^^^^^^^^^^
		
.. list-table::

    * - .. figure:: ../images/colour-main-background.svg

           Background for light theme: #FFFFFF

      - .. figure:: ../images/colour-dark-theme-main-backgroud.svg

           Background for dark theme: #181818

Nextcloud apps have a light and a dark theme, with appropriately chosen colors for all elements.


* On web: ``var(--color-main-background)``
* Android: uses default Material Design colors
* iOS: `systemBackground <https://developer.apple.com/documentation/uikit/uicolor/3173140-systembackground>`_
* Desktop: `default Qt guidelines <https://doc.qt.io/qt-5/qpalette.html#ColorRole-enum>`_

Text color
^^^^^^^^^^

.. list-table::

    * - .. figure:: ../images/colour-main-text.svg

           Text in light theme: #222222

      - .. figure:: ../images/colour-dark-theme-main-text.svg

           Text in dark theme: #D8D8D8

This is the main color for the text in light theme, and in dark theme.


* On web: ``var(--color-main-text)``
* Android: uses default Material Design color "high emphasis"
* iOS: `label <https://developer.apple.com/documentation/uikit/uicolor/3173131-label>`_ (in UITextView, leave the default textColor)
* Desktop: `default Qt guidelines <https://doc.qt.io/qt-5/qpalette.html#ColorRole-enum>`_

.. list-table::

    * - .. figure:: ../images/colour-text-maxcontrast.svg

           Secondary text in light theme: #767676

      - .. figure:: ../images/colour-dark-theme-text-maxcontrast.svg

           Secondary text in dark theme: #8C8C8C


In addition, a softer color is used for secondary text like sublines, timestamps, and similar.


* On web:``var(--color-text-maxcontrast)``
* Android: uses default Material Design color "medium emphasis"
* iOS: `secondaryLabel <https://developer.apple.com/documentation/uikit/uicolor/3173136-secondarylabel>`_
* Desktop: `default Qt guidelines <https://doc.qt.io/qt-5/qpalette.html#ColorRole-enum>`_

Status and indicators
^^^^^^^^^^^^^^^^^^^^^

.. list-table::

    * - .. figure:: ../images/color-info.svg

           Info: #006AA3

      - .. figure:: ../images/color-success.svg

           Success: #46BA61

      - .. figure:: ../images/color-error.svg

           Error: #E9322D

      - .. figure:: ../images/color-warning.svg

           Warning: #ECA700

Interface elements associated with a status like info, success, error, or warning may also be colored to communicate the action better.

While interface elements like buttons are colored differently depending on their action, the color of the text in that element is almost always either of the main text colors, that is light or dark.


* On web:

  * Info color: ``var(--color-info)``
  * Success color: ``var(--color-success)``
  * Warning color: ``var(--color-warning)``
  * Error color: ``var(--color-error)``

* Android: Material Design guidelines
* iOS: `Apple HIG colors <https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/color/>`_

  * success: systemGreen
  * error: systemRed

* Desktop: `default Qt guidelines <https://doc.qt.io/qt-5/qpalette.html#ColorRole-enum>`_

Typography
----------

`Penpot typography <https://design.penpot.app/#/view/db3839da-807b-8052-8002-576401e9a375?page-id=3f784c86-6c27-80c6-8002-6ab128f3ffe2&section=interactions&index=1&share-id=11fde340-21f4-802e-8002-8d8d305e7ab5>`_

To ensure compatibility with different platforms, Nextcloud apps always use the native system font.

For legibility, make sure that the text in your content uses:

* **Bold** for emphasis
* A line height between 130% and 150%
* The default tracking of the font
* No *italics* or UPPER CASE as these text styles are less legible

The text sizes for the different platforms are:


* Web: 16px for main text and sublines, **20px bold** for headings
* Android: 14sp for main text, 16sp for headings
* iOS: values from `Dynamic Type Sizes, for size Large (Default) <https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/typography#dynamic-type-sizes>`_
* Desktop: `default Qt guidelines <https://doc.qt.io/qt-5/qpalette.html#ColorRole-enum>`_

Icons
-----

`Penpot icons <https://design.penpot.app/#/view/db3839da-807b-8052-8002-576401e9a375?page-id=3f784c86-6c27-80c6-8002-6ab128f3ffe2&section=interactions&index=0&share-id=11fde340-21f4-802e-8002-8d8d305e7ab5>`_

.. image:: ../images/material-icons.png
   :alt: Material icons

Icons can be used to communicate the intent of an action, or to provide visual interest to the screen. We use monochrome icons on all platforms: `Material Symbols (not Material Icons, and 20 px default filled) <https://fonts.google.com/icons?icon.set=Material+Symbols&selected=Material+Symbols+Outlined:search:FILL@1;wght@400;GRAD@0;opsz@20&icon.size=20>`_ for web, Android, Windows and Linux, and `SF Symbols (default weight, scale and variant) <https://developer.apple.com/sf-symbols/>`_ for iOS and macOS.

This is except for the icon of the app itself, which can be a custom icon. Most use an app icon from Material Symbols as well though to keep consistency.

Make sure to:

* Not overuse icons
* When possible, use text together with icons so it’s clear what they refer to
* For special cases like warnings, combine the icon with color to enhance its visibility

Naming
------

To be immediately understandable, we choose app names which are generic and easily translatable. Additionally, they are short and easily fit in the top navigation without being cut off.

Files, Contacts, Calendar, and Mail do not need further explanation, which is why we recommend to choose a self-explanatory app name.

Further good examples of this: Notes, Bookmarks, Maps, Forms, Tasks, Music.

Wording
-------

The wording and language in your app sets the tone and approachability of your app.


* Nextcloud should always be written out, and only with a capital N. Not "NextCloud" or "Nc".
* Be friendly and approachable, not condescending.
* Use understandable language, not technical jargon. For example, "link" is much better than "URL", and explaining errors is better than showing error codes.
* Don’t write in ALL CAPS, as it is not as readable and comes off as shouting and aggressive. Also use Sentence case and not Capital Case, with the exception of product names like Nextcloud Talk, Nextcloud Hub, etc.
* We are a community, so better write "We are happy to announce" instead of "I am happy to announce".
* If your app content is empty, it can be helpful to add an engaging message. "Add or import your first bookmark!" is much nicer than "No bookmarks yet".
* Try to avoid using "my" or "your" like in "My files" or "Your files", instead using "All files". For longer sentences where it cannot be avoided, use "your", never "my". 
* Use gender neutral language. This `international guide to gender-inclusive writing <https://uxcontent.com/the-international-guide-to-gender-inclusive-writing/>`_ contains info and examples on gender neutral wording for different languages.
* Use full names instead of only first names while addressing the person using your app.
* For any "Delete" action, give context to what it will delete, like "Delete conversation" or "Delete user" so that it is clear specifically for this destructive action.
* Keep language short and concise, and keep in mind that it should be easily translatable.
* Make sure to spellcheck anything you write.

