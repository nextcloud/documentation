.. _ocm_label:

============
OCM commands
============

The ``ocm`` commands manage the signing keys that Nextcloud uses for Open Cloud
Mesh (OCM) federation. Outbound OCM requests are signed with HTTP message
signatures (`RFC 9421 <https://www.rfc-editor.org/rfc/rfc9421>`_), and the
matching public keys are published as a `JSON Web Key Set (JWKS)
<https://www.rfc-editor.org/rfc/rfc7517>`_ so that federated peers can verify
them.

These commands are part of the server core and are always available. They are
used to inspect and rotate the JWKS signing keys; you do not need them for
normal operation, as a key is generated automatically on the first OCM request.

.. note::

   For more on federation and OCM, see
   :doc:`configuration_files/federated_cloud_sharing_configuration`.

::

 ocm
  ocm:keys:list       list JWKS-published signing keys
  ocm:keys:stage      generate a new JWKS key and advertise it via JWKS without using it for signing yet
  ocm:keys:activate   promote the staged JWKS key to active; the previous active key moves to retiring
  ocm:keys:retire     delete the retiring JWKS key; signatures that referenced its kid can no longer be verified


Key slots
---------

The signing keys live in three slots, all of which are published in the JWKS
endpoint while they are populated:

* **active** — the key currently used to sign outbound OCM requests.
* **pending** — a newly staged key that is advertised in the JWKS but not yet
  used for signing. This gives federated peers time to pick it up before it
  becomes active.
* **retiring** — the previous active key, kept published so that signatures
  created with it can still be verified until it is removed.

Listing keys
------------

ocm\:keys\:list
^^^^^^^^^^^^^^^

Show the current JWKS signing keys and the slot each one occupies::

 sudo -E -u www-data php occ ocm:keys:list
 +------+----------+--------------------------------+
 | Pool | Slot     | Key ID                         |
 +------+----------+--------------------------------+
 | 1    | active   | ecdsa-p256-sha256-...          |
 | 2    | pending  | ecdsa-p256-sha256-...          |
 +------+----------+--------------------------------+

If no keys exist yet, the command reports that one will be generated on the
first OCM request. Use ``--output=json`` or ``--output=json_pretty`` for
machine-readable output.

Rotating keys
-------------

Key rotation is a three-step process: stage a new key, activate it, then
retire the old one. Allow time between the steps so that federated peers can
refresh their cached copy of your JWKS (the cache lifetime is one hour).

ocm\:keys\:stage
^^^^^^^^^^^^^^^^

Generate a new key into the **pending** slot. It is advertised in the JWKS but
is not yet used for signing::

 sudo -E -u www-data php occ ocm:keys:stage
   Staged new JWKS key: ecdsa-p256-sha256-...
   Wait for federated peers to refresh their JWKS cache before activating.

An active key is required first; if none exists, one is generated
automatically. The command fails if a pending key already exists — activate or
retire it before staging another.

ocm\:keys\:activate
^^^^^^^^^^^^^^^^^^^

Promote the staged (pending) key to **active**. The previous active key moves
to the **retiring** slot, where it stays published in the JWKS so that
in-flight signatures can still be verified::

 sudo -E -u www-data php occ ocm:keys:activate
   Staged key promoted to active.
   Run occ ocm:keys:retire once any in-flight signatures using the previous key have been verified.

The command fails if there is no pending key to activate, or if the retiring
slot is still occupied — retire the previous key first.

ocm\:keys\:retire
^^^^^^^^^^^^^^^^^

Delete the **retiring** key. Once removed, signatures that referenced its key
ID can no longer be verified, so only run this after you are confident that no
peer still needs it (for example, after at least one JWKS cache lifetime has
passed since activation)::

 sudo -E -u www-data php occ ocm:keys:retire
   Retiring key deleted.

The command fails if there is no retiring key to remove.
