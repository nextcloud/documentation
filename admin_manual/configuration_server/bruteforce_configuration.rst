======================
Brute force protection
======================

Nextcloud has built-in protection against brute force attempts. This 
protects your system from attackers trying lots of different passwords.

Brute force protection is enabled by default on Nextcloud.


How it works
------------

Brute force protection can be seen most easily on the login page.
The first time you try to log in with invalid credentials, 
will not notice anything. However, each time you provide invalid credentials, 
the verification of the login will take longer. This is brute force
protection kicking in.

The maximum delay is 25 seconds.

After a successful login the attempts will be cleared. Once a user is
properly authenticated they will not longer be hit by the delay.


Troubleshooting
---------------

On most setups Nextcloud will work out of the box without any issues. If you
run into a situation where login is often very slow for all users, the first
step is to inspect the `bruteforce_attempts` table, where you can see
which IP addresses are actually throttled.

If you are behind a reverse proxy or load balancer it is important you make sure it is
set up properly. Especially the **trusted_proxies** and **forwarded_for_headers**
`config.php` variables; these must be set correctly. Otherwise, Nextcloud starts
throttling all traffic coming from the reverse proxy or load balancer. For more
information see :doc:`reverse_proxy_configuration`.

