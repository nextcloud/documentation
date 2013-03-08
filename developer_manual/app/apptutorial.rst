App Tutorial
============

This tutorial contains the traditional approach to write an app. The benefits of this approach are:

* Not dependant on the App Framework app
* Easy and fast to create an app

The disadvantages of this approach are:

* No automatic security checks: privilege checks have to be included at the top of each file
* No automatic XSS escaping: :class:`OC_Template` does require manual escaping of output
* Hard to unittest: Using files instead of Controllers makes it hard to write unittests for the whole application

