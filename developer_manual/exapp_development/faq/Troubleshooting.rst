Troubleshooting
===============

This section describes common steps to troubleshoot specific issues.


How to troubleshoot networking issues?
--------------------------------------

Networking issues can be not so straightforward to identify and resolve.
Here are some common steps to verify the network configuration:

- Verify that the Deploy daemon is running and accessible (AppAPI admin settings - Select Deploy daemon - Check connection).
- Verify the network mode and access levels, firewall, VPN, etc.
- Verify that Nextcloud is reachable from the Deploy daemon host
- Verify that the Deploy daemon host is reachable from the Nextcloud host
- Verify that Nextcloud is reachable from the ExApp container
- Verify that there are no DNS resolution issues
- Verify that there are no SSL certificate issues
- If there are HTTP 401 Unauthorized errors, check the ExApp (``docker logs nc_app_<appid>``) / Nextcloud logs, on which API route it fails to authenticate, try to re-enable AppAPI and re-install the ExApp.

.. note::
   If your case is not documented here or doesn't exist in GitHub issues,
   please feel free to ask by creating an issue in the `AppAPI repository <https://github.com/nextcloud/app_api/issues>`_.


ExApp deployment issues
-----------------------

The deployment issues questions are covered in the `Test Deploy <https://docs.nextcloud.com/server/latest/admin_manual/exapps_management/TestDeploy.html>`_ section of the administration guide.
Generally speaking, there are three steps to find the proper error message to understand the problem:

1. Check Nextcloud logs
2. Check ExApp container logs (available only if ExApp container is created and/or running)
3. Check Deploy daemon host logs (``journalctl -u docker.service``)
4. Check Docker Socket Proxy logs (if used, and if needed, e.g. for SSL or 401 errors check)


Failed to create volume
-----------------------

If you encounter a "Failed to create volume" error, please check the following:

- Make sure that there is enough disk space on the host machine.
- Check the Docker system logs while reproducing the issue (``journalctl -u docker.service``).


ExApps management list of apps from App Store is empty
------------------------------------------------------

This issue may occur if you are loading the ExApps management (or regular Apps management) page
frequently during the short period of time, and therefore your IP address can be blocked by the App Store rate-limits protection.
Please wait a while and try again.
