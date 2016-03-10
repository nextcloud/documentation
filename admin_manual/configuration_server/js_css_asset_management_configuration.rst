JavaScript and CSS Asset Management
===================================

In production environments, JavaScript and CSS files should be delivered in a concatenated and compressed format.

ownCloud can automatically collect all JavaScript and CSS files, aggregate and compress them to then save the result in a folder called 'assets' which can be found in the folder where ownCloud has been installed. 

If your Web server has write access to your ownCloud installation, then the 'assets' folder will be automatically created for you, otherwise, you need to create it yourself before enabling that option and you must give write access to your Web server user.

Assets found in that folder will from now on be served as static files by your Web server and will be automatically refreshed whenever ownCloud or one of its apps is updated.
It's important to note that apps installed via git might not always update their version number with every commit and this could lead to an out-of-sync asset folder.
It is not recommended to enable asset-pipelining when using apps pulled via git.


Parameters
----------

::

  <?php
    $CONFIG = array (
      ...
      'asset-pipeline.enabled' => true,
      ...
    );

You can set this parameter in the :file:`config/config.php`
