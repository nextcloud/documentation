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
 Use openssl_random_pseudo_bytes() instead

TBD
