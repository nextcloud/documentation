==========================
Setting up Testing Devices
==========================

The $99 Apple Developer account allows you to test your iOS apps on a maximum of 
100 devices, and you must register the UDID of each device in your Apple 
developer account.

First you must find the UDIDs of your test devices. The easiest way is to 
connect to your iTunes account. Then connect your iOS device to your Mac 
computer. Your device will appear on the left sidebar in iTunes. Click on this 
to display your device information. Then click on the serial number, and you 
will your UDID.

.. figure:: ../images/itunes-udid.png
   :scale: 60%
   
   *click to enlarge*
   
Return to your account on `Developer.apple.com 
<https://developer.apple.com>`_, go to **IOS Apps > 
Devices > All**, and click the plus button on the top right to register a new 
device. You can make the name anything you want, and the UDID must be the UDID 
copied from iTunes.

.. figure:: ../images/itunes-udid-3.png
   :scale: 70%
   
   *click to enlarge*

If you have a large number of devices to register, you may enter them in a text 
file in this format, and then upload the file::
 
 Device ID	Device Name
 A123456789012345678901234567890123456789	NAME1
 B123456789012345678901234567890123456789	NAME2
 
Click ``Download sample files`` to see examples of plain text and markup files.

.. figure:: ../images/itunes-udid-4.png
   :scale: 70%
   
   *click to enlarge*

When you are finished entering your device IDs click the **Continue** button. 
Verify, and then click **Done**.
