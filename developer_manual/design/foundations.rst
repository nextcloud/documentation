===========
Foundations
===========

.. _Colors:

Colors
------

Primary colors
^^^^^^^^^^^^^^

-  ``--color-primary-element``: Primary colors are to be used for positive action buttons and active states. Otherwise use the primary color sparingly in the UI. Do not use the primary color for body
   text.
-  ``--color-primary-element-light``: Use the secondary color for less important buttons and highlighting elements in the UI. Do not use the secondary color for body text.

.. list-table::
   :header-rows: 1

   * - Light theme
     - Dark theme
   * - .. image:: ../images/color-primary-light.png
          :alt: Color swatch: --color-primary (Light)
     - .. image:: ../images/color-primary-dark.png
          :alt: Color swatch: --color-primary (Dark)
   * - .. image:: ../images/color-primary-element-light-light.png
          :alt: Color swatch: --color-primary-element-light (Light)
     - .. image:: ../images/color-primary-element-light-dark.png
          :alt: Color swatch: --color-primary-element-light (Dark)

Text colors
^^^^^^^^^^^

-  ``--color-main-text``: Most text that is not inside a component is the main text color.
-  ``--color-text-maxcontrast``: Use this color for sublines, captions and any other kind of supporting text.

.. list-table::
   :header-rows: 1

   * - Light theme
     - Dark theme
   * - .. image:: ../images/color-main-text-light.png
          :alt: Color swatch: --color-main-text (Light)
     - .. image:: ../images/color-main-text-dark.png
          :alt: Color swatch: --color-main-text (Dark)
   * - .. image:: ../images/color-text-maxcontrast-light.png
          :alt: Color swatch: --color-text-maxcontrast (Light)
     - .. image:: ../images/color-text-maxcontrast-dark.png
          :alt: Color swatch: --color-text-maxcontrast (Dark)

Background colors
^^^^^^^^^^^^^^^^^

-  ``--color-main-background``: The background of the main content should be this color.
-  ``--color-background-darker``: This can be used as a background color for containers inside the main content when visual contrast would be useful. Use sparingly to not overwhelm the UI.

.. list-table::
   :header-rows: 1

   * - Light theme
     - Dark theme
   * - .. image:: ../images/color-main-background-light.png
          :alt: Color swatch: --color-main-background (Light)
     - .. image:: ../images/color-main-background-dark.png
          :alt: Color swatch: --color-main-background (Dark)
   * - .. image:: ../images/color-background-dark-light.png
          :alt: Color swatch: --color-background-dark (Light)
     - .. image:: ../images/color-background-dark-dark.png
          :alt: Color swatch: --color-background-dark (Dark)

Border colors
^^^^^^^^^^^^^

-  ``--color-border``: Use this color for borders of elements like cards, and for separator lines.
-  ``--color-border-maxcontrast``: Use this color when there is a stronger contrast needed.

.. list-table::
   :header-rows: 1

   * - Light theme
     - Dark theme
   * - .. image:: ../images/color-border-light.png
          :alt: Color swatch: --color-border (Light)
     - .. image:: ../images/color-border-dark.png
          :alt: Color swatch: --color-border (Dark)
   * - .. image:: ../images/color-border-maxcontrast-light.png
          :alt: Color swatch: --color-border-maxcontrast (Light)
     - .. image:: ../images/color-border-maxcontrast-dark.png
          :alt: Color swatch: --color-border-maxcontrast (Dark)

Status colors
^^^^^^^^^^^^^

-  ``--color-info``: This color is used for denoting informational elements like info cards.
-  ``--color-success``: Used for positive actions like a "Join call" button, and for indicating an action is successful.
-  ``--color-error``: This color is used to indicate a destructive action like "Delete conversation" and when an action has failed.
-  ``--color-warning``: This is used to warn the user about an action that may be dangerous.

.. list-table::
   :header-rows: 1

   * - Light theme
     - Dark theme
   * - .. image:: ../images/color-info-light.png
          :alt: Color swatch: --color-info (Light)
     - .. image:: ../images/color-info-dark.png
          :alt: Color swatch: --color-info (Dark)
   * - .. image:: ../images/color-success-light.png
          :alt: Color swatch: --color-success (Light)
     - .. image:: ../images/color-success-dark.png
          :alt: Color swatch: --color-success (Dark)
   * - .. image:: ../images/color-warning-light.png
          :alt: Color swatch: --color-warning (Light)
     - .. image:: ../images/color-warning-dark.png
          :alt: Color swatch: --color-warning (Dark)
   * - .. image:: ../images/color-error-light.png
          :alt: Color swatch: --color-error (Light)
     - .. image:: ../images/color-error-dark.png
          :alt: Color swatch: --color-error (Dark)

Assistant colors
^^^^^^^^^^^^^^^^

-  ``--color-element-assistant``: A special color used for elements using AI. Using this color informs the user that the info they are seeing may be AI-generated or that they are interacting with an
   AI.

.. list-table::
   :header-rows: 1

   * - Light theme
     - Dark theme
   * - .. image:: ../images/color-element-assistant-light.png
          :alt: Color swatch: --color-element-assistant (Light)
     - .. image:: ../images/color-element-assistant-dark.png
          :alt: Color swatch: --color-element-assistant (Dark)

.. _Typography:

Typography and wording
----------------------

Fonts
^^^^^

-  To ensure compatibility with different platforms, Nextcloud apps always use the native system font.
-  Use bold font weight for emphasis and unread items
-  Do not use italics or upper case as they are less legible.

Font sizes
^^^^^^^^^^

-  ``--defalut-font-size``\ (15px): For body text
-  ``--font-size-small`` (13px): For nonessential information
-  Other than those 2 font sizes, 20px is also often used for headings, and 24px for titles.

Wording
^^^^^^^

- Wording guidelines have been moved to :doc:`the writing section <writing>`.

.. _Borders:

Borders
-------

Border radii
^^^^^^^^^^^^

-  ``--border-radius-small`` (4px): Used for small elements like tags and cards.
-  ``--border-radius-element`` (8px): Standard border radius used for buttons. navigation items and more.
-  ``--border-radius-container`` (12px): Used for larger elements such as dialogs.
-  ``--border-radius-pill`` (100px): Used to convert any small element into a pill-shape.

.. _Element sizes and spacing:

Element sizes and spacing
-------------------------

-  ``--default-grid-baseline``\ (4px): This is the base multiplier for all spacing. Use whole number multiples of this variable for all spacing, never raw numbers.
-  ``--default-clickable-area``\ (34px): This should be the minimum width and height of most clickable elements like buttons, inputs, cards, etc.
-  ``--clickable-area-small``\ (24px): This can be used for smaller elements like chips, or when there is limited space.

.. _Icons:

Icons
-----

Icons can be used to communicate the intent of an action, or to provide visual interest to an element. On the browser always use Material Symbols (outlined, 20px).

-  Never use a custom icon except for the icon of the app itself. Still, most apps use an app icon from Material Symbols to keep consistency.
-  When possible, use text together with icons so it’s clear what they refer to
-  Elements that use AI should hav