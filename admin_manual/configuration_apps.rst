Apps Configuration
==================

After you have installed ownCloud you might realise that it would be nice to
provide this or that function on top of the core functionality in your own cloud.
The first stop to look for the desired enhancement is to check the ownCloud app
store (http://apps.owncloud.com/). There you will find a lot of ready-to-use
apps provided by the ownCloud community.

Parameters
----------

  If you want to allow the installation of apps from the app store you have to
  set ``appstoreenabled`` parameter, but this can only be done if at least one
  of the configured apps paths is writeable.
  ::
    "appstoreenabled" => true,

  The ``appstoreurl`` is used to set the http path to the ownCloud app store.
  (The server should understand OCS (Open Collaboration Services).
  ::
    "appstoreurl"     => "http://api.apps.owncloud.com/v1",

  The key ``path`` defines the absolute file system path to the app folder.
  The key ``url`` defines the http web path to that folder, starting at the
  ownCloud web root. The key ``writable`` indicates if a user can install
  apps in that folder.
  ::
    "apps_paths"      => array (
                           0 => array (
                                  "path"     => "/var/www/htdocs/owncloud/apps",
                                  "url"      => "/apps",
                                  "writable" => true,
                                ),
                         ),

  Finally you can enable checks for malicious code fragments of 3rd-party apps
  by setting ``appcodechecker`` parameter.
  ::
    "appcodechecker"  => false,
