============
License Keys
============

Introduction
------------

You'll need to install a license key to use Nextcloud Enterprise Edition. There 
are two types of license keys: one is a free 30-day trial key. The other is a 
full license key for Enterprise customers.

You can `download and try Nextcloud Enterprise for 30 days for free 
<https://nextcloud.com/download/>`_, which auto-generates a free 30-day key. When 
this key expires your Nextcloud installation is not removed, so when you become 
an Enterprise customer you can enter your new key to regain access. See `How to 
Buy Nextcloud <https://nextcloud.com/how-to-buy-nextcloud/>`_ for sales and  
contact information.

Configuration
-------------

Once you get your Enterprise license key, it needs to be copied to your 
Nextcloud configuration file, 
``config/config.php`` file like this example::

  'license-key' => 'test-20150101-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-YYYYYY’,

Each running instance of Nextcloud requires a license key. Keys will work across 
upgrades without issue, so new keys will not be required when you upgrade your 
Nextcloud Enterprise to a new version.

