===================================
Publishing Your New Branded iOS App
===================================

At last, after following all the previous steps and passing beta testing, your 
branded iOS app is ready to publish for general distribution on iTunes. You need 
a Mac computer with Xcode installed (Xcode is a free download), and you need 
the three provisioning profiles and p12 file that you created copied to the 
same computer that you are using to upload your app to iTunes.

.. Note:: Apple must review and approve your app, and the approval process can 
   take several days to several weeks. 

Download your :file:`xcarchive.zip` file from your account on 
`<https://customer.owncloud.com>`_. Your friendly Mac will automatically unpack 
it and change the name to something like :file:`Owncloud iOs Client 02-07-15 
10.30.xcarchive`. Double-click on this file to automatically install it into 
Xcode. Go to Xcode and you will see it in the Archives listing (**Window > 
Organizer**).

.. figure:: ../images/ios-publish-2.png

Next, go back to the `Apple Developer Member Center 
<https://developer.apple.com/membercenter/index.action>`_ to log into iTunes 
Connect to set up your app storefront.

.. figure:: ../images/ios-publish-3.png

After logging in click the blue **My Apps** button. This takes you to your main 
screen for managing your apps on iTunes. Click the plus button on the top left 
to setup your new branded iOS app. 

.. figure:: ../images/ios-publish-4.png

This opens a screen where you will enter your app information. Make sure you 
get it right the first time, because it is difficult to delete apps, and Apple 
will not let you re-use your app name or SKU.

* Enter any name you want for your app. This is the name that will appear in 
  your App Store listing.
* Choose your primary language.
* Select the bundle ID from the drop-down selector.
* Enter your app version number, which should match the version number as it 
  appears in your Xcode organizer.
* The SKU is unique ID for your app, and is anything you want.

Then click the **Create** button.

.. figure:: ../images/ios-publish-5.png

Now go back to your Xcode organizer to upload your app; click the blue **Submit 
to App Store** button. 

.. figure:: ../images/ios-publish-6.png

This takes a few minutes as it verifies your bundle ID and certificates, and 
then you will see an upload status.

.. figure:: ../images/ios-publish-7.png

If you have not already entered your Developer.apple.com login in Xcode you will 
be prompted to do it now. Click the **Add** button.

.. .. figure:: ../images/ios-publish-3.png

On the next screen enter your account login.

.. .. figure:: ../images/ios-publish-4.png

After your login is confirmed Xcode opens the Accounts screen. You can close 
this and go to the next step, where you must choose which developer account to 
use. Even if you have only one you must select it.

.. .. figure:: ../images/ios-publish-5.png

Now you should be at your account screen. This shows you any apps that you have 
already successfully submitted to iTunes, and any pending apps.

.. .. figure:: ../images/ios-publish-6.png

Click the plus sign (top right) to start the process for adding your new 
branded iOS app. 

--TODO final steps & images--


FIRST set up itunes, THEN upload app



