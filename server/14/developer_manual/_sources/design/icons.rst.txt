.. sectionauthor:: John Molakvoæ <skjnldsv@protonmail.com>
.. codeauthor:: John Molakvoæ <skjnldsv@protonmail.com>
..  _icons:

=====
Icons
=====


List of available icons
=======================

White icons only have a grey background on this documentation page for readability purposes.

 .. include:: icons.txt

..  _svgcolorapi:

Svg color api
=============

More informations about scss and this api: :ref:`scss mixins and functions <cssicons>`

You can request and color any svg icons used in nextcloud with this api.
The server will directly change the colours of the ``circle``, ``rect`` and ``path`` elements in the svg you provide.
Simply use those urls:

* ``https://yourdomain/svg/core/actions/menu/ffffff``
  Will serve the svg located in the core/img directory as a white icon
  ``/core/img/actions/menu.svg``

* ``https://yourdomain/svg/core/places/calendar/0082c9``
  Will serve the svg located in the core/img directory with the color #0082c9
  ``/core/img/places/calendar.svg``

* ``https://yourdomain/svg/files/app/000000``
  Will serve the svg located in the files app ``img`` directory ad a black icon
  ``/app/files/img/app.svg``

