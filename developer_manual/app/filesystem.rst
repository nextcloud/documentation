Filesystem
==========
ownCloud handling of filesystems is very flexible. A variety of local and remote filesystem types are supported, as well as a variety of hooks and optional features such as encryption and version control. It is important that apps use the correct methods for interacting with files in order to maintain this flexibility.

In some cases using PHP’s internal filesystem functions directly will be sufficient, such as **unlink()** and **mkdir()**. Most of the time however it is necessary to use one of ownCloud’s filesystem classes. This documentation assumes that you are working with files stored within a user’s directory (as opposed to ownCloud core files), and therefore need to use :php:class:`OC\\Files\\View`.

.. todo:: write the rest
