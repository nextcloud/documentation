============
License Keys
============

Introduction
------------

You'll need to install a license key to use ownCloud Enterprise Edition. There 
are two types of license keys: one is a free 30-day trial key. The other is a 
full license key for Enterprise customers.

You can `download and try ownCloud Enterprise for 30 days for free 
<https://owncloud.com/download/>`_, which auto-generates a free 30-day key. When 
this key expires your ownCloud installation is not removed, so when you become 
an Enterprise customer you can enter your new key to regain access. See `How to 
Buy ownCloud <https://owncloud.com/how-to-buy-owncloud/>`_ for sales and  
contact information.

Configuration
-------------

Once you get your Enterprise license key, it needs to be copied to your 
ownCloud configuration file, 
``config/config.php`` file like this example::

  'license-key' => 'test-20150101-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-YYYYYY’,

Each running instance of ownCloud requires a license key. Keys will work across 
upgrades without issue, so new keys will not be required when you upgrade your 
ownCloud Enterprise to a new version.

