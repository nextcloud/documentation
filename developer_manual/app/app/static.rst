Static content
==============

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

Static content consists of:

* **img/**: all images
* **js/**: all JavaScript files
* **css/**: all CSS files

Because ownCloud templates do not support template inheritance it is not possible to add your own script tags. Therefore ownCloud provides the methods **\\OCP\Util::addScript('your_app_id', 'script')** and **\\OCP\Util::addStyle('your_app_id', 'style')**. The first parameter is the app's id, the second one is the path relative to the **js/** respectively the **css/** folder without the file extension.

If you use Twig Templates, there is the **script** and **style** function, see :doc:`../appframework/templates`.


CSS and JavaScript are compressed by ownCloud so if the CSS or JavaScript do not seem to get updated, check if the debug mode is enabled. To enable it see :doc:`../intro/gettingstarted`

