Troubleshooting
===============

This section describes common steps to troubleshoot specific issues.


How to troubleshoot networking issues?
--------------------------------------

Networking issues can be not so straightforward to identify and resolve.
Here are some common steps to verify the network configuration:

- Verify that the Deploy daemon is running and accessible (AppAPI admin settings - Select Deploy daemon - Check connection).
- Verify the network mode and access levels, firewall, vpn, etc.
- Verify that Nextcloud is reachable from the Deploy daemon host
- Verify that the Deploy daemon host is reachable from the Nextcloud host
- Verify that Nextcloud is reachable from the ExApp container
- Verify if there is no DNS resolution issues
- Verify is there is no SSL certificate issues
- If there are HTTP 401 Unauthorized errors, check the ExApp (``docker logs nc_app_<appid>``) / Nextcloud logs, on which API route it fails to authenticate, try to re-enable AppAPI and re-install the ExApp.

.. note::
   If your case is not documented here, or doesn't exists on GitHub issues,
   please feel free to ask it by creating an issue in the `AppAPI repository <https://github.com/cloud-py-api/app_api/issues>`_.


ExApp deployment issues
-----------------------

The deployment issues questions are covered in the :ref:`Test Deploy <test_deploy>` section.
Generally speaking, there are three steps to find the proper error message to understand the problem:

1. Check Nextcloud logs
2. Check ExApp container logs (available only if ExApp container is created and/or running)
3. Check Deploy daemon host logs (``journalctl -u docker.service``)
4. Check Docker Socket Proxy logs (if used, and if needed, e.g. for SSL or 401 errors check)


Failed to create volume
-----------------------

If you encounter "Failed to create volume" error, please check the following:

- Make sure that there is enough disk space on the host machine.
- Check the Docker system logs while reproducing the issue (``journalctl -u docker.service``).


ExApps management list of apps from AppStore is empty
-----------------------------------------------------

This issue may occur if you are loading the ExApps management (or regular Apps management) page
frequently during the short period of time and therefore your IP can be blocked by the AppStore rate-limits protection.
Please, wait for a while and try again.
