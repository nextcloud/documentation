======================
Language configuration
======================

Default language
----------------

In normal cases Nextcloud will automatically detect the language of the Web-GUI.
If this does not work properly or you want to make sure that Nextcloud always
starts with a given language, you can set a **default_language** parameter in the
:file:`config/config.php`.

.. note:: The default_language paramenter is only used, when the browser does not 
   send any language, and the user hasn't configured own language preferences.

::

  <?php

    "default_language" => "en",


Force language
--------------

If you want to force a specific language, users will no longer be able to change
their language in the personal settings. You can set a **force_language** parameter
in the :file:`config/config.php`.

::

  <?php

    "force_language" => "en",


If users shall be unable to change their language, but users have different languages,
this value can be set to ``true`` instead of a language code.

.. note:: Please check `Transifex language codes
   <https://www.transifex.com/explore/languages/>`_ for the list of valid language
   codes.
