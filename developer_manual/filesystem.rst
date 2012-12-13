Filesystem
==========

ownCloud handling of filesystems is very flexible. A variety of local and remote filesystem types are supported, as well as a variety of hooks and optional features such as encryption and version control. It is important that apps use the correct methods for interacting with files in order to maintain this flexibility.

In some cases using PHP’s internal filesystem functions directly will be sufficient, such as unlink() and mkdir(). Most of the time however it is necessary to use one of ownCloud’s filesystem classes. This documentation assumes that you are working with files stored within a user’s directory (as opposed to ownCloud core files), and therefore need to use OC_Filesystem.

Using PHP filesystem functions directly
---------------------------------------

An example of when it is approprite to use PHP’s filesystem functions instead of OC_Filesystem is if you are storing temporary files which will not be saved, or whose saving is taken care of by external code. ownCloud’s zip compression class does this (OC_Archive_ZIP), and returns the temporarily stored compressed file so that external code can determine what to do with it. Parts of ownCloud’s installation procedure also fall into this category, as certain files need only be saved temporarily in order to set up more permanent storage options.

Using ownCloud’s filesystem methods
-----------------------------------

Most filesystem interaction should make use of OC_Filesystem. By using the methods within this class you ensure that non-standard and future ownCloud configurations, as well as other filesystem-related apps, will function correctly with your code. Static methods for performing most filesystem operations are provided, including:

* mkdir( $path )
* rmdir( $path )
* opendir( $path )
* is_dir( $path )
* is_file( $path )
* stat( $path )
* filetype( $path )
* filesize( $path )
* readfile( $path )
* is_readable( $path )
* is_writable( $path )
* file_exists( $path )
* filectime( $path )
* filemtime( $path )
* touch( $path, $mtime )
* file_get_contents( $path )
* file_put_contents( $path,$data )
* unlink( $path )
* rename( $path1,$path2 )
* copy( $path1,$path2 )
* fopen( $path,$mode )
* toTmpFile( $path )
* fromTmpFile( $tmpFile,$path )
* getMimeType( $path )
* hash( $type,$path )
* free_space( $path )
* search( $query )

OC_Filesystem must be initiated before it can be used using the OC_Filesystem::init() method (the class is follows the `singleton pattern`_). init() takes one argument, which is the root directory to be used within the virtual filesystem that OC_Filesystem will work with.

Example:

.. code-block:: php
  
  OC_Filesystem::init( '/' . $user . '/' . $root );
  OC_Filesystem::mkdir( 'test' );
  if ( OC_Filesystem::is_dir('test') ) { echo 'OC_Filesystem is being used correctly'; }``

.. _singleton pattern: https://en.wikipedia.org/wiki/Singleton_pattern
