Language Configuration
======================

In normal cases ownCloud will automatically detect the language of the Web-GUI.
If this does not work properly or you want to make sure that ownCloud always
starts with a given language, you can use the **default_language** parameter.

Please keep in mind, that this will not effect a users language preference,
which has been configured under "personal -> language" once he has logged in.

Please check :file:`settings/languageCodes.php` for the list of supported language
codes.


Parameters
----------

::

  <?php

    "default_language" => "en",

This parameters can be set in the :file:`config/config.php`
