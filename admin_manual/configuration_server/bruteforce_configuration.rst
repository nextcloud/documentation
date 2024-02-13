======================
Brute force protection
======================

Introduction
------------

Nextcloud has built-in protection against brute force attempts. 

The brute force protection feature is meant to protect Nextcloud servers from attempts to guess 
passwords and tokens in various ways. Besides the obvious "let's try a big list of commonly used 
passwords" attack, it also makes it harder to use slightly more sophisticated attacks via the reset 
password page or trying to find app password tokens. It is used throughout the Nextcloud ecosystem, 
including by other apps, if they have sensitive entrypoints (and choose to enable support for it).

How it works
------------

The brute force protection is easiest to see in action at the login page.
If you try to log in the first time with an invalid username and/or password you
will not notice anything. But if you do this a few times you start to notice
that the verification of the login is taking longer each time. This is the
brute force protection kicking in.

The maximum delay is 25 seconds, unless maximum number of attempts (currently 10) was reached within 
the last 30 minutes (in which case a ``429 Too Many Requests`` will be returned until the maximum attempts 
within the recent time has dropped below the threshold).

After a successful login the attempts will be cleared. And once a user is
properly authenticated they will not longer be hit by the delay.


Troubleshooting
---------------

Overview
~~~~~~~~

On most setups Nextcloud will work out of the box without any issues. If you
run into a situation where logging in or connecting is often very slow for multiple users, the first
step is to check your Nextcloud Server logs to see what IP addresses are being detected (you may need 
adjust your logging to INFO level temporarily to do so). 

If you are behind a reverse proxy or load balancer it is important you make sure it is
setup properly. Especially the **trusted_proxies** and **forwarded_for_headers**
`config.php` variables need to be set correctly. Otherwise it can happen
that Nextcloud actually starts throttling all traffic coming from the reverse
proxy or load balancer. For more information see :doc:`reverse_proxy_configuration`.

For testing purposes you want want to whitelist your own IP address to see if the problem disappears.
If it does - and assuming your proxy configuration is correct - you may have a client/device in your
network that is misbehaving and generating invalid login attempts from your IP address.

For detailed troubleshooting, you may wish to inspect the `bruteforce_attempts` database table. There 
you can see which IP addresses are throttled and any other metadata stored about their attempts to 
connect.

Excluding IP addresses from brute force protection
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. note:: Most nuisance triggering of brute force protection can be resolved through proper configuration of reverse 
   proxies. In other cases, select IP addresses that need to be whitelisted can be configured within this app (while 
   leaving brute force protection enabled). This can be useful for testing purposes or when there are a lot of people 
   (or devices) connecting from a known, single IP address.

It's possible to exclude IP addresses from the brute force protection.

- Make sure the ``bruteforcesettings`` app is enabled (it is by default)
- Login as admin and go to **Administration settings -> Security**

.. danger::

   Any excluded IP address can perform authentication attempts without any throttling.
   It's best to exclude as few IP addresses as you can, or even none at all. 

Additional Details
------------------

Feature History
~~~~~~~~~~~~~~~

(Notable)

* Server 10.0:
   - Added: Initial implementation
* Server 12.0:
   - Fixed: Disregard existing recent attempts immediately if BPF is disabled manually
   - Added: Admin security settings section for managing some parameters (via the ``bruteforcesettings`` shipped app)
   - Added: Enable the admin to exclude IP addresses from throttling (via the ``bruteforcesettings`` shipped app)
* Server 13.0
   - Changed: Reset bruteforce attempts upon successful login (only the entries associated with that user from that IP)
* Server 14.0
   - Fixed: Avoid unintentional client authentication timeouts (for well behaving clients)
* Server 15.0
   - Changed: Reset bruteforce attempts upon successful token refresh when using OAuth
* Server 18.0
   - Fixed: Handle scoped IPv6 addresses
* Server 20.0
   - Changed: When maximum delay is reached and maximum attempts permitted have been exceeded within the past 30 minutes, return "429 Too Many Requests" until no longer the true
   - Added: ``occ`` command to reset bruteforce attempts for an IP (``occ security:bruteforce:reset``)
* Server 21.0
   - Added: Once a day cronjob added to cleanup stale attempt entries
   - Changed: Delete all entries >48 hours old
* Server 24.0
   - Added: Logging of throttling or blocking (info level)
* Server 28.0
   - Fixed: Reset bruteforce attempts upon successful sudo attempt
   - Added: Memcache based backend
   - Added: Show admins when they are throttled (via standard setup checks)
   - Added: Show current user throttling status (via the ``bruteforcesettings`` app)
* Server 29.0
   - Fixed: Don't throw a "500 Internal Server Error" when MaxDelayReached; instead return a "429 Too Many Requests"
   - Fixed: Prevent setting empty IP masks when adding an exclusion (in the ``bruteforcesetting`` app) 
