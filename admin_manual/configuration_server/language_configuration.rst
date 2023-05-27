=================
Language & Locale
=================

Default language
----------------

In normal cases Nextcloud will automatically detect the language of the Web-GUI.
If this does not work properly or you want to make sure that Nextcloud always
starts with a given language, you can set a **default_language** parameter in the
:file:`config/config.php`.

.. note:: The default_language parameter is only used, when the browser does not 
   send any language, and the user hasn't configured own language preferences.

::

    "default_language" => "en",


Force language
--------------

If you want to force a specific language, users will no longer be able to change
their language in the personal settings. You can set a **force_language** parameter
in the :file:`config/config.php`.

::

    "force_language" => "en",


If users shall be unable to change their language, but users have different languages,
this value can be set to ``true`` instead of a language code.

.. note:: Please check `Transifex language codes
   <https://explore.transifex.com/languages/>`_ for the list of valid language
   codes.

Default locale
--------------
The locale is used to define how dates and other formats are displayed. Nextcloud
should automatically pick an appropriate locale based on your current language.
Users can modify their locale inside their settings panel.
If that does not work properly or if you want to make sure that Nextcloud always
starts with a given locale, you can set a **default_locale** parameter in the 
:file:`config/config.php`.

.. note:: The default_locale parameter is only used when the user hasn't configured
   own locale preferences.

::

    "default_locale" => "en_US",

Force locale
--------------

If you want to force a specific locale, users will no longer be able to change
their locale in the personal settings. You can set a **force_locale** parameter
in the :file:`config/config.php`.

::

    "force_locale" => "en_US",

.. note:: Please check `the list of MomentJS supported locales
   <https://github.com/moment/moment/tree/2.18.1/locale>`_ for the list of valid
   locales.
