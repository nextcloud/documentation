======================
Brute force protection
======================

Nextcloud has built-in protection against brute force attempts. This protects
your system from attackers trying for example a lot of different passwords.

Brute force protection is enabled by default on Nextcloud.


How it works
------------

The brute force protection is easiest to see in action at the login page.
If you try to log in the first time with an invalid username and/or password you
will not notice anything. But if you do this a few times you start to notice
that the verification of the login is taking longer each time. This is the
brute force protection kicking in.

The maximum delay is 25 seconds.

After a successful login the attempts will be cleared. And once a user is
properly authenticated they will not longer be hit by the delay.


Troubleshooting
---------------

On most setups Nextcloud will work out of the box without any issues. If you
run into a situation where login is often very slow for all users the first
step is to inspect the `bruteforce_attempts` table. There you can see
which IP addresses are actually throttled.

If you are behind a reverse proxy or load balancer it is important you make sure it is
setup properly. Especially the **trusted_proxies** and **forwarded_for_headers**
`config.php` variables need to be set correctly. Otherwise it can happen
that Nextcloud actually starts throttling all traffic coming from the reverse
proxy or load balancer. For more information see :doc:`reverse_proxy_configuration`.

