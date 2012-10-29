Security
========

Blacklisted PHP functionality
-----------------------------
**echo, print(), <?=**
 Use $this->p in templates instead
**error_log** 
 Use throw new Exception("Description") instead
**==** 
 Use === instead
**!=** 
 Use !== instead
**rand(), srand(), mt_rand()**
 If you need a cryptographical secure random string use OC_Util::generate_random_bytes() instead, the PHP provided functions are `not secure <http://www.suspekt.org/2008/08/17/mt_srand-and-not-so-random-numbers/>`_.

CSRF protection
-----------------------------
Please add OC_Util::isCallRegistered() or OC_JSON::callCheck() at the top of your file to prevent Cross-site request forgery.

See http://en.wikipedia.org/wiki/Cross-site_request_forgery

Auth checks
-----------------------------
OC_Util::checkLoggedIn() or OC_JSON::checkLoggedIn()
 Checks if the user is logged in
OC_Util::checkAdminUser() or OC_JSON::checkAdminUser()
 Checks if the user has admin rights
OC_Util::checkSubAdminUser() or OC_JSON::checkSubAdminUser()
 Checks if the user has subadmin rights

Recommended reading
-----------------------------
The `OWASP Top Ten Project <https://www.owasp.org/index.php/Top_10_2010-Main>`_ provides good informations about the 10 most common security vulnerabilities in web applications.

TBD