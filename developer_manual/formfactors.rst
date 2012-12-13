Formfactors
===========

ownCloud automatically detects what kind of form factor you are using.

Supported form factors
----------------------

Currently supported are mobile, tablet, standalone and the default desktop view. Mobile is a mode that works good for touch screen smartphones. Tablet is optimized for devices like iPads or Android Tablets. The standalone view is a mode where only the content are an App is shown. The header, footer and side navigation is not visible. This is useful if ownCloud is embedded in other applications.

Over writing
------------

The auto detection can be overwritten by using the “formfactor” GET variable in the url.

How to use it in Apps?
----------------------

Developers can provide special versions of js or css files and templates. The special versions are automatically used if present. If not it falls back to the default files. If an App wants to provide a special mobile version of the css file it can just add a second file with a special name. The mobile version of example.css is example.mobile.css. The tablet template of foo.php is foo.tablet.php.
