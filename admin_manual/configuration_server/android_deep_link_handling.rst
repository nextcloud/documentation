==========================
Android Deep Link Handling
==========================

Deep linking in Android allows your application to be launched directly from a URL, 
making it easier for users to navigate to specific content within your app. 
Starting from Android 12, handling deep links requires additional configuration 
using an ``assetlinks.json`` file to ensure the app and the host domain are properly
associated.

Android 11 and Below
--------------------
For Android 11 and below, deep linking is straightforward and does not require additional 
configuration beyond the usual manifest settings.

Android 12 and Above
--------------------
For Android 12 and above, an additional configuration step is required to verify the 
relationship between your app and the host domain using the ``assetlinks.json`` file.

Creating assetlinks.json
~~~~~~~~~~~~~~~~~~~~~~~~
Create a file named ``assetlinks.json`` and host it in the .well-known directory of 
your website (e.g., https://www.cloud.example.com/.well-known/assetlinks.json).

Example ``assetlinks.json``::

    [
      {
        "relation": ["delegate_permission/common.handle_all_urls"],
        "target": {
          "namespace": "android_app",
          "package_name": "com.cloud.example.nextcloud",
          "sha256_cert_fingerprints": [
            "FB:00:95:22:F6:5E:25:80:22:61:B6:7B:10:A4:5F:D7:0E:61:00:31:97:6F:40:B2:8A:64:9E:15:2D:ED:03:73"
          ]
        }
      }
    ]

Nextcloud Configuration Limitation
==================================
Due to the additional requirement of hosting an ``assetlinks.json`` file
for Android 12 and above, Nextcloud cannot configure the Android client 
for all different hosts. This is because each host needs its own ``assetlinks.json``
file to establish a verified relationship with the app, and Nextcloud cannot manage 
this file for every possible host domain.
