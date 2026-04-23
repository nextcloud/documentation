.. _phonenumberutil:

=================
Phone number util
=================

``OCP\IPhoneNumberUtil`` is a wrapper around the third-party library `libphonenumber <https://github.com/giggsey/libphonenumber-for-php>`_.
It is simplified to the most common use cases to allow replacing the library in the future without having to break the
public API and functionality.

Convert input into standard format
----------------------------------

To convert a phone number to E164 format, call ``convertToStandardFormat()`` with a known region. The input can also
contain formatting characters, such as spaces, slashes and dashes:

.. code-block:: php

  $input = '044 / 668-1800';
  $util = \OCP\Server::get(\OCP\IPhoneNumberUtil::class);
  var_dump($util->convertToStandardFormat($input, 'CH'));
  // Will output:
  // string(12) "+41446681800"

When no region is given and the phone number can not be mapped to a single region, converting will fail:

.. code-block:: php

  $input = '044 668 1800';
  $util = \OCP\Server::get(\OCP\IPhoneNumberUtil::class);
  var_dump($util->convertToStandardFormat($input, null));
  // Will output:
  // NULL

The phone number can also be provided in an international format containing the region code. In this case, the default region is ignored:

.. code-block:: php

  $input = '+41 44 668 1800';
  $util = \OCP\Server::get(\OCP\IPhoneNumberUtil::class);
  var_dump($util->convertToStandardFormat($input, null));
  var_dump($util->convertToStandardFormat($input, 'DE'));
  // Both will output:
  // string(12) "+41446681800"

Get the country code for a region
---------------------------------

To check if a provided region is valid (2-letter code of ``ISO 3166-1``) and has a country code use ``getCountryCodeForRegion()``:

.. code-block:: php

  $util = \OCP\Server::get(\OCP\IPhoneNumberUtil::class);
  var_dump($util->getCountryCodeForRegion('DE'));
  // Will output:
  // int(49)

Again ``null`` is used to indicate invalid input:

.. code-block:: php

  $util = \OCP\Server::get(\OCP\IPhoneNumberUtil::class);
  var_dump($util->getCountryCodeForRegion('Germany'));
  // Will output:
  // NULL
