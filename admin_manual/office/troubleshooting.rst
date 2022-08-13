===============
Troubleshooting
===============

In case of connectivity issues, ensure that the following required connections are possible and not blocked by any firewall:

- The users browser can reach both the Nextcloud Server as well as the Collabora Online server through HTTP(S)
- The Nextcloud and the Collabora Online server are using the same protocol
- The Nextcloud server can reach the Collabora Online server through HTTP(S)
- The Collabora Online server can reach the Nextcloud server through HTTP(S)

Both the Nextcloud log as well as the Collabora Online server log may reveal more detailed error messages in case of connection issues.

- Verify connectivity from the browser:
    - https://office.example.com/hosting/capabilities
    - https://office.example.com/hosting/discovery
- Verify connectivity from Nextcloud
    - ``curl https://office.example.com/hosting/capabilities``
    - ``curl https://office.example.com/hosting/discovery``
- Verify connection from the Collabora server
    - ``curl https://nextcloud.example.com/status.php``

Frequently asked questions
==========================

Issue: I get connection errors when trying to open documents
    Be sure to check the error log from docker through ``docker logs container-id``. If the logs note something like:
    ``No acceptable WOPI hosts found matching the target host [YOUR NEXTCLOUD DOMAIN] in config.``
    Unauthorized WOPI host. Please try again later and report to your administrator if the issue persists. You might have started the docker container with the wrong URL. Be sure to triplecheck that you start it with the URL of your Nextcloud server, not the server where Collabora Online runs on.

Issue: Connection is not allowed errors.
    It is possible your firewall is blocking connections. Try to start docker after you started the firewall, it makes changes to your iptables to enable Collabora Online to function.

Issue: We are sorry, this is an unexpected connection error. Please try again. error.
    The Collabora Online app doesn't work at the moment, if you enable it only for certain groups. Remove the group filter in the App section.

Issue: Collabora Online doesn't handle my 100 users.
    This docker image is designed for home usage. If you need a more scalable solution, consider a support subscription for a reliable, business-ready online office experience.

Issue: Collabora Online doesn't work with Encryption.
    Yes, this is currently unsupported.