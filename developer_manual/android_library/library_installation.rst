Library Installation
====================

Obtaining the library
---------------------


The Nextcloud Android library may be obtained from the following GitHub repository:

`https://github.com/nextcloud/android-library <https://github.com/nextcloud/android-library>`_

Once obtained, this code should be compiled. The GitHub repository not only contains the library, but also a sample project, sample_client
sample_client  properties/android/librerias
, which will assist in learning how to use the library.


Add the library to a project
----------------------------

There are different methods to add an external library to a project, we will describe two.

#.  Add the library as a Gradle dependency via JitPack



#.  Add the library repo to your Android project as a Git submodule


Add the library as a Gradle dependency
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Simply open your::

  build.gradle

and add the dependency::

  compile 'com.github.nextcloud:android-library:<version>'

<version> refers to the exact version you would like to include in your application. This could be -SNAPSHOT for always using the latest code revision of the master branch. Alternatively you can also specifiy a version number which refers to a fixed release, e.g. 1.0.0. (compile 'com.github.nextcloud:android-library:1.0.0').


Add the library project to your project as a Git submodule
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Basically get the code and compile it having it integrated via a Git submodule.

Go into your own apps directory on the command line and add the Nextcloud Android library as a submodule::
  git submodule add https://github.com/nextcloud/android-library nextcloud-android-library

Import/Open your app in Android Studio and you are done. All the public classes and methods of the library will be available for your own app.
