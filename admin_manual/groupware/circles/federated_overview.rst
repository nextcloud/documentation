================================
Global Scale & Federated Circles
================================

We saw that the purpose of the Circles App is to generate groups of Nextcloud users. Now, we will have a
look to another feature of the App, which is to regroups users from multiple instances of Nextcloud.

This feature is called Federated Circles, it can be used with:

- remote instances, hosted in an other place by an other administrator,
- local instances, in a Global Scale setup.

Regardless of the way you are using this feature, we will use the same name to describe any other instances
of Nextcloud: Remote Instance




.. _federated_overview_trust_level:

Trust Level
^^^^^^^^^^^


As an administrator you can add and remove any Remote Instance, and assign a Trust Level to each one of them.
This is a list of those levels, in order of decreasing credibility:

- **GlobalScale**: Information related to all Circles from your instance and their Members will be shared to the
  Remote Instance. While this should only be used in a Global Scale environement, there is no limitation to
  use this with any Remote Instance of your choice. Please note that when using the GlobalSiteSelector App
  and a Lookup Server, the Remote Instance of your Global Scale setup will be added automatically.

- **Trusted**: Only information about Circles configured as 'Federated', and their Members, will be shared to
  the Remote Instance.

- **External**: like **Trusted**, but for the Remote Instance to get access to the list of its Members, the local
  Circle must:

  - contain a member that belongs to the Remote Instance,
  - one Circle from the Remote Instance is a Member of the local Circle.

- **Passive**: like **External**, but only Members that belong to the Remote Instance are shown to the Remote
  Instance.


Instance Identification
^^^^^^^^^^^^^^^^^^^^^^^

While the exchange of data about Federated Circles between two instances of Nextcloud is done using its
own protocol, the discovery of information relative to the configuration of each instances is done using the
**Webfinger** protocol::


 $ curl -X GET https://cloud.example.net/.well-known/webfinger?resource=http://nextcloud.com/
 {
   "subject": "http://nextcloud.com/",
   "links": [
     {
       "rel": "https://apps.nextcloud.com/apps/circles",
       "type": "application/json",
       "href": "https://cloud.example.net/apps/circles/",
       "properties": {
         "app": "circles",
         "name": "Circles",
         "version": "22.0.0",
         "api": 1
       }
     }
   ]
  }


The URL defined in ``href`` will be used to obtain more details on the endpoints used to exchanging data with this Remote Instance::

 $ curl -X GET https://cloud.example.net/apps/circles/ -H "Accept: application/json"
 {
   "uid": "5ca2dfd7fc0a29296d",
   "event": "https://cloud.example.net/apps/circles/event/",
   "incoming": "https://cloud.example.net/apps/circles/incoming/",
   "test": "https://cloud.example.net/apps/circles/test/",
   "circles": "https://cloud.example.net/apps/circles/circles/",
   "circle": "https://cloud.example.net/apps/circles/circle/{circleId}/",
   "members": "https://cloud.example.net/apps/circles/members/{circleId}/",
   "member": "https://cloud.example.net/apps/circles/member/{type}/{userId}/",
   "id": "https://cloud.example.net/apps/circles/",
   "publicKey": {
     "id": "https://cloud.example.net/apps/circles/#main-key",
     "owner": "https://cloud.example.net/apps/circles/",
     "publicKeyPem": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7RZSMjCZO0BTo0ZYHhUO\nhIxs3ku94ZcR1GyhHKaVX2m+ZlDjea+q+UNiLHcUE4XM+wEIQPxIwxUhlBybOd7o\nfcbA1t0LQgX+ENeZcqQd2ZDQp0JA6m1V/GxHGb1l9izJS2zZuGPKmgbZli+G7rFt\n/1K8mo+91FYYrczRC7dfz0SWz1RyXw3Xes5uROgSBVsoEPFcFEaJyXFTc7PmoEiD\nTpgW48NsPjAgaCfkE8Sp+VEOe0z3Vb9/ZaxNRN7UK2o53HrA24DvCdFPGZYD/VPo\nesIgEB0K4FPHjCeB4jND6gOCJSVjMPY2QyrbqZm3qh/QspQLjBXlJs4bWZT8PUco\nHwIDAQAB\n-----END PUBLIC KEY-----\n"
   }
 }


Alike with Fediverse, the authentication of the sender is done using the PublicKey available to the public
as the sender uses its PrivateKey to sign any request.

However, a security check have been added to also confirm the identity of the recipient. The request can
implement a string that will be signed by the Remote Instance to prove the ownership of the right PrivateKey
using the PublicKey, the original string and the value of ``auth-signed``::

 $ curl -X GET https://cloud.example.net/apps/circles/?auth=qwertyuiop -H "Accept: application/json"
 {
   "uid": "5ca2dfd7fc0a29296d",
   [...]
   "auth-signed": "sha256:dCtIfNBvfO1voLdvWAHPVLVNE+lHwuKFSJMCvCGELEAUf05+hemusjjXQ8Bk2NzpXP0LRN2czJWDazXHtb0ytflGigl8CIObxtkjKWiGcD3YamBZL4apSbVhMcP2W0RBpgpfn0REv/LNuakAIivdckFmhveqbAXbs3oMwwHy4pYt+S3nKkjMi/JGt/duuJpjiNBcShei3b9vomZ+0j9VhU6Srr0tpLYq12AmVRQ2vVD3C/D4PwuN1zOM6b6ao7HrYOKU+Ij+d1lVgGmd0nKc7ZJZYndOgr0naBhkRlfu2BDbQoFK/ue7OKACexJLgti9sHbA2etoC1eNy7NJetCSHQ==",
   "id": "https://documentation.local/index.php/apps/circles/",
   "publicKey": {
     "id": "https://documentation.local/index.php/apps/circles/#main-key",
     "owner": "https://documentation.local/index.php/apps/circles/",
     [...]
   }
 }



``uid`` is generated by hashing the PublicKey and will be used to identify this Remote Instance.

.. note:: The conclusion of this technical aside, is that even if the same Nextcloud is running on the same domain
 name, loosing your PrivateKey will revoke your rights on any other Remote Instance.

 This work in both side:
 if a Remote Instance loose its domain name, no data from your Nextcloud will be exchanged with it anymore.


Configuration
^^^^^^^^^^^^^

While the ``webfinger`` helps a lot to automatize discovery, the URL returned in ``href`` still need to be
configured.

By default, the Circles App will use URL defined in ``config/config.php``: ``overwrite.cli.url``. This is
efficient in most of installation of Nextcloud. However, it might not works if the Nextcloud is behind a Proxy.

[TODO] DEFINE PROCESS TO CONFIGURE AND TEST




