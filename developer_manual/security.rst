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
 If you need a cryptographical secure random number use OC_Util::generate_random_bytes() instead

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

TBD