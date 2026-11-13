Docker Socket Proxy
===================

AppAPI no longer supports Docker Socket Proxy (DSP) deploy daemons.
Docker deploy daemons use `HaRP <https://github.com/nextcloud/HaRP>`_,
see :doc:`../development_overview/ExAppHarpIntegration`.

ExApps already installed on a DSP daemon keep running, but AppAPI no longer manages them.
To move them to HaRP, see
`Moving ExApps from Docker Socket Proxy to HaRP <https://docs.nextcloud.com/server/latest/admin_manual/exapps_management/AppAPIAndExternalApps.html#moving-exapps-from-docker-socket-proxy-to-harp>`_
in the administration guide.
