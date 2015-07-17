==============================================
Building and Distributing Your Branded iOS App
==============================================

Building and distributing your branded iOS ownCloud app involves a large number 
of interdependent steps. The process is detailed in this chapter over several 
pages. Follow these instructions exactly and in order, and you will have a nice 
branded iOS app that you can distribute to your users.

Prerequisites
=============

* A Mac OS X computer with Xcode (free download) and Keychain Access 
  (included in Utilities). This computer is essential to the entire process 
  and will be linked to to your iOS Developer account. You will use it 
  create and store distribution certificates, and to upload your app to iTunes 
  Connect.
* An iOS developer account on 
  `Developer.Apple.com/ios <https://developer.apple.com/ios/>`_, 
  which costs $99 per year. Or an Enterprise account for $299/yr. The 
  developer account limits you to testing on 100 devices of each type (Apple TV,
  Apple Watch, iPad, iPhone, iPod Touch) which must be 
  registered in your account. The Enterprise account allows testing on 
  unlimited, unregistered devices.
* An ownCloud Enterprise Subscription, with the ownBrander app enabled on 
  `Customer.owncloud.com <https://customer.owncloud.com/owncloud>`_
* Some iPhones or iPads for testing your app. Again, if you have the $99 
  developer account each device must have its UDID
  registered in your account on `Developer.Apple.com 
  <https://developer.apple.com>`_.

Procedure
=========
  
You need the Apple tools to build eight provisioning profiles (4 Ad Hoc and 4 
App Store) and a P12 certificate. You will email the four Ad Hoc profiles and 
P12 certificate to branding@owncloud.com after building your app with the 
ownBrander app on `Customer.owncloud.com 
<https://customer.owncloud.com/owncloud>`_. You must create the provisioning 
profiles and P12 certificate first, before building your app, because you must 
supply a unique **bundle ID** and an **app group** to build your app. These are 
created in your account on `Developer.Apple.com 
<https://developer.apple.com>`_, 
and with Keychain Access on your Mac computer.

We use the 4 Ad Hoc provisioning profiles and P12 certificate to complete 
building your app, and then in 24-48 hours your new branded app is loaded into 
your account on `Customer.owncloud.com 
<https://customer.owncloud.com/owncloud>`_.

The next step is to test your app. When it passes testing, the final step is to 
upload it to your iTunes Connect account for distribution.

You will need a lot of graphics for building your app, and for your iTunes 
store listing, in specific sizes and file formats. The ownBrander app and 
iTunes detail all the image specifications you will need.