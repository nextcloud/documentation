================================
Testing Your New Branded iOS App
================================

You'll distribute the file with the :file:`.ipa` extension, like our example 
:file:`MyBiz iOS App-3.4.201.ipa`, from your 
`<https://customer.owncloud.com/owncloud>`_ 
account to your beta testers. To do this you'll need a Mac computer, an iPhone 
or iPad registered in your Apple developer account, and the iTunes account 
associated with your Apple developer account.

1. Connect your registered iPhone or iPad to a Mac running iTunes.
2. Double-click your iOS :file:`.ipa` file.
3. You should see your device in the upper left corner of your iTunes windows. 
   Click on it.
4. Click the Apps button. Now you should see your app in the iTune apps list, 
   with an Install button. Click it.
5. The Install button changes to Will Install.
6. Click the sync button in the lower-right corner to sync your device. This 
   installs your app on your device.

Your other testers can now install and test your app on their registered iPhones 
and iPads just like any other app from iTunes. (Note that if you have an 
Enterprise account you do not need to register any devices, and your testers 
may use any iPhone or iPad to test your app.)

Getting Crash Reports From Testers
----------------------------------

iOS automatically records crash logs when apps crash. Your testers can retrieve 
and send these logs to you. They must follow these steps:

1. Connect the testing device to a Mac computer running iTunes.
2. The crash logs are automatically downloaded to 
   :file:`~/Library/Logs/CrashReporter/MobileDevice`
3. Attach the relevant log files to email and send them to you.
