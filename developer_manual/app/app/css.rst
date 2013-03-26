CSS
===

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

If you have to include an image or css file in your CSS, prepend the following to your path: 

* **%appswebroot%**: gets the absolute path to your app
* **%webroot%**: gets the absolute path to owncloud

For example:

.. code-block:: css

  .folder > .title {
      background-image: url('%webroot%/core/img/places/folder.svg');
  }

CSS for apps
------------
ownCloud comes with special CSS rules for apps to make app development easier.

.. todo:: document this

Formfactors
-----------
ownCloud automatically detects what kind of form factor you are using.

Currently supported are:

* **mobile**: works well on mobiles
* **tablet**: optimized for devices like iPads or Android Tablets
* **standalone**: mode where only the content of an App is shown. The header, footer and side navigation is not visible. This is useful if ownCloud is embedded in other applications.

The auto detection can be overwritten by using the “formfactor” GET variable in the url::

  index.php/myapp?formfactor=mobile

If you want to provide a different stylesheet or javascript file for mobile devices just suffix the formfactor in the filename, like::

  style.mobile.css

or::
  
  script.tablet.css
