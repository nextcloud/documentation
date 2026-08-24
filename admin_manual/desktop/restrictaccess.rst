===========================
Block desktop client access
===========================

Administrators can restrict desktop client synchronization in three ways. The
appropriate method depends on whether access should be controlled by client
version, by a Nextcloud workflow rule, or before a request reaches Nextcloud.

Blocking methods
----------------

Minimum supported desktop version
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Nextcloud Server can deny synchronization to desktop clients older than a
configured version. Set ``minimum.supported.desktop.version`` to the oldest
release that should be allowed. Clients reporting that version or a newer one
can connect, while older clients are denied.

For example, the following command sets the minimum to ``99.0.0`` and therefore
blocks currently available desktop client versions:

.. code-block:: console

    sudo -u www-data php occ config:system:set \
        minimum.supported.desktop.version --value='99.0.0'

Record the previous value before changing it so that the policy can be rolled
back. This method is best suited to a version-based policy. A future client
whose version is ``99.0.0`` or higher would be allowed, so the setting should
not be treated as a permanent unconditional block.

File Access Control
^^^^^^^^^^^^^^^^^^^

The `File Access Control app`_ can deny file operations based on the type of client making the request. After
enabling the app, open the Flow settings in the administration settings and
create a blocking rule with **Request user agent** set to **Desktop client**.
Add further rule conditions when the restriction should apply only to selected
users, groups, files, or folders.

.. _`File Access Control app`: https://docs.nextcloud.com/server/latest/admin_manual/file_workflows/access_control.html

.. warning::

   File Access Control rules are evaluated during file operations and can have
   a negative performance impact, particularly on busy installations or with
   complex rule sets. Test the rule and monitor server performance before
   rolling it out broadly.

This method blocks matching file operations, including synchronization. It
does not reject every non-file endpoint used by the desktop client. Use an
HTTP-layer rule when the complete request path must be blocked before it
reaches Nextcloud.

HTTP layer
^^^^^^^^^^

Server administrators can reject Nextcloud Desktop requests at a web server,
reverse proxy, or web application firewall (WAF) by matching the HTTP
``User-Agent`` header.

This can be useful as a compatibility guard or an operational policy, for
example to temporarily block all desktop clients or require a particular
client release.

.. warning::

   This is not a security boundary. The client controls the ``User-Agent``
   header and can change or omit it. Do not use this rule as the only control
   when access must be prevented against a deliberately modified client.

Identify desktop client requests
--------------------------------

The standard desktop client sends a header with this shape:

.. code-block:: text

    Mozilla/5.0 (Macintosh) mirall/34.0.2 (Nextcloud, macos-25.5.0 ClientArchitecture: arm64 OsArchitecture: arm64)

The stable marker is ``mirall/``; the value immediately after it is the desktop
client version. The current client constructs this value in
`Utility::userAgentString() <https://github.com/nextcloud/desktop/blob/master/src/common/utility.cpp>`_.

Use a case-insensitive match for:

.. code-block:: text

    mirall/

Apply the rule to every request reaching the Nextcloud virtual host. Blocking
only one OCS or WebDAV endpoint does not block desktop access because the
client uses multiple OCS, WebDAV, login-flow, status, and provisioning
endpoints.

Nextcloud Server's
``USER_AGENT_CLIENT_DESKTOP``
`matcher <https://github.com/nextcloud-deps/ocp/blob/22f259b5b27e65a70b6797e1c0c0ecd4b02c0ef9/OCP/IRequest.php>`_
also recognizes the legacy marker ``csyncoC/``. To include those clients,
replace ``mirall/`` with ``(mirall|csyncoC)/`` in regular-expression rules, or
add a second substring rule where the configuration format does not support
regular expressions.

Choose the policy
-----------------

Block every standard desktop client
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Match the case-insensitive substring:

.. code-block:: text

    mirall/

Block releases older than 34.0.2
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Web-server regular expressions do not compare arbitrary version strings as
semantic versions. The following case-insensitive expression is deliberately
written for one minimum release, ``34.0.2``:

.. code-block:: text

    mirall/(([0-9]|[12][0-9]|3[0-3])[.]|34[.]0[.](0|1)([^0-9]|$))

It has these results:

.. list-table::
   :header-rows: 1

   * - Desktop version
     - Result
   * - ``3.14.3``
     - blocked
   * - ``33.0.0``
     - blocked
   * - ``34.0.0``
     - blocked
   * - ``34.0.1``
     - blocked
   * - ``34.0.2``
     - allowed by this rule
   * - ``34.1.0``
     - allowed by this rule
   * - ``35.0.0``
     - allowed by this rule

The expression assumes normal release versions with three numeric components.
Do not change only the version text in the expression. Build and test a new
set of numeric ranges whenever the minimum release changes. A WAF that can
extract the version and compare three integer fields is preferable when the
minimum changes frequently.

Return ``403 Forbidden``. Do not return ``401 Unauthorized``: by HTTP
semantics, that status asks the client to authenticate and obscures that this
is an administrative policy. The desktop client is not guaranteed to display
a custom response body, so the administrator should communicate the policy
separately to users.

The examples below assume that Nextcloud has its own virtual host at
``cloud.example.com``. If the host serves other applications, additionally
scope the rule to the Nextcloud URL prefix.

nginx
-----

Define one ``map`` in the ``http`` context. Enable exactly one of the two match
entries:

.. code-block:: text

    http {
        map $http_user_agent $block_nextcloud_desktop {
            default 0;

            # Policy A: block every standard desktop client.
            ~*mirall/ 1;

            # Policy B: instead block releases older than 34.0.2.
            # ~*mirall/(([0-9]|[12][0-9]|3[0-3])[.]|34[.]0[.](0|1)([^0-9]|$)) 1;
        }

        server {
            server_name cloud.example.com;

            if ($block_nextcloud_desktop) {
                return 403 "Nextcloud desktop client access is disabled.\n";
            }

            # The existing Nextcloud configuration follows here.
        }
    }

The ``map`` directive is valid only in the ``http`` context. The resulting
variable is then checked in the Nextcloud ``server`` block. A conditional
containing only ``return`` is sufficient here; no URI rewrite is involved.

Validate and reload the configuration with the commands appropriate to the
installation, commonly:

.. code-block:: console

    nginx -t
    systemctl reload nginx

See the nginx documentation for
`map <https://nginx.org/en/docs/http/ngx_http_map_module.html>`_ and
`return <https://nginx.org/en/docs/http/ngx_http_rewrite_module.html#return>`_.

Apache HTTP Server 2.4
----------------------

Place ``SetEnvIfNoCase`` in the Nextcloud virtual host and deny requests
carrying the resulting environment variable. Enable exactly one
``SetEnvIfNoCase`` line:

.. code-block:: text

    <VirtualHost *:443>
        ServerName cloud.example.com

        # Policy A: block every standard desktop client.
        SetEnvIfNoCase User-Agent "mirall/" block_nextcloud_desktop

        # Policy B: instead block releases older than 34.0.2.
        # SetEnvIfNoCase User-Agent "mirall/(([0-9]|[12][0-9]|3[0-3])[.]|34[.]0[.](0|1)([^0-9]|$))" block_nextcloud_desktop

        <Location "/">
            <RequireAll>
                Require all granted
                Require not env block_nextcloud_desktop
            </RequireAll>
        </Location>

        # The existing Nextcloud configuration follows here.
    </VirtualHost>

For a subdirectory installation, such as
``https://cloud.example.com/nextcloud``, use ``<Location "/nextcloud">``
instead. The modules ``mod_setenvif`` and ``mod_authz_core`` must be enabled.

Validate and reload the configuration with the commands appropriate to the
installation, commonly:

.. code-block:: console

    apachectl configtest
    systemctl reload apache2

The Apache documentation describes this
`SetEnvIfNoCase and Require blocking pattern <https://httpd.apache.org/docs/2.4/rewrite/avoid.html#blocked-bot>`_
and also notes that a client can circumvent a ``User-Agent`` rule.

Caddy 2
-------

Place the matcher and response before the existing Nextcloud handler. Enable
exactly one matcher line:

.. code-block:: text

    cloud.example.com {
        # Policy A: block every standard desktop client.
        @blockedNextcloudDesktop header_regexp User-Agent (?i)mirall/

        # Policy B: instead block releases older than 34.0.2.
        # @blockedNextcloudDesktop header_regexp User-Agent (?i)mirall/(([0-9]|[12][0-9]|3[0-3])[.]|34[.]0[.](0|1)([^0-9]|$))

        respond @blockedNextcloudDesktop "Nextcloud desktop client access is disabled." 403

        # The existing Nextcloud file_server, php_fastcgi, or reverse_proxy
        # directives follow here.
    }

Caddy uses RE2 regular expressions. The example therefore uses capturing
groups rather than PCRE-only constructs.

Validate and reload the configuration with the commands appropriate to the
installation, commonly:

.. code-block:: console

    caddy validate --config /etc/caddy/Caddyfile
    systemctl reload caddy

See the Caddy documentation for
`header_regexp <https://caddyserver.com/docs/caddyfile/matchers#header-regexp>`_
and `respond <https://caddyserver.com/docs/caddyfile/directives/respond>`_.

HAProxy
-------

Add the ACL and deny action to the HTTP ``frontend`` that receives Nextcloud
traffic. Enable exactly one ``blocked_nextcloud_desktop`` ACL:

.. code-block:: text

    frontend https_frontend
        bind :443 ssl crt /etc/haproxy/certs/cloud.example.com.pem

        acl nextcloud_host hdr(host) -i cloud.example.com cloud.example.com:443

        # Policy A: block every standard desktop client.
        acl blocked_nextcloud_desktop req.hdr(User-Agent) -m sub -i mirall/

        # Policy B: instead block releases older than 34.0.2.
        # acl blocked_nextcloud_desktop req.hdr(User-Agent) -m reg -i mirall/(([0-9]|[12][0-9]|3[0-3])[.]|34[.]0[.](0|1)([^0-9]|$))

        http-request deny deny_status 403 if nextcloud_host blocked_nextcloud_desktop

        # The existing backend selection follows here.

Keep the host ACL when this frontend serves more than Nextcloud. Validate and
reload the configuration with the commands appropriate to the installation,
commonly:

.. code-block:: console

    haproxy -c -f /etc/haproxy/haproxy.cfg
    systemctl reload haproxy

See the HAProxy documentation for
`ACLs <https://www.haproxy.com/documentation/haproxy-configuration-tutorials/proxying-essentials/custom-rules/acls/>`_
and
`http-request deny <https://www.haproxy.com/documentation/haproxy-configuration-tutorials/security/traffic-policing/>`_.

Verify the rule
---------------

Test from a system that reaches the same proxy or WAF path as real users. The
following probes do not require Nextcloud credentials:

.. code-block:: console

    # Must be 403 for both policies.
    curl -sS -o /dev/null -w '%{http_code}\n' \
        -A 'Mozilla/5.0 (Linux) mirall/34.0.1 (Nextcloud, linux)' \
        https://cloud.example.com/status.php

    # Must not be blocked by the minimum-version policy. It is still 403 when
    # the block-all policy is active.
    curl -sS -o /dev/null -w '%{http_code}\n' \
        -A 'Mozilla/5.0 (Linux) mirall/34.0.2 (Nextcloud, linux)' \
        https://cloud.example.com/status.php

    # Must not be blocked by either desktop rule.
    curl -sS -o /dev/null -w '%{http_code}\n' \
        -A 'Mozilla/5.0 (compatible; policy-check)' \
        https://cloud.example.com/status.php

Also verify these operational details:

#. The rule covers all Nextcloud paths and HTTP methods, including WebDAV
   methods such as ``PROPFIND``, ``PUT``, and ``DELETE``.
#. The origin server cannot be reached through another hostname or IP address
   that bypasses the proxy or WAF.
#. Proxy layers preserve the original ``User-Agent`` header until the component
   enforcing the rule has evaluated it.
#. Access and WAF logs record blocked requests, the matched policy, and the
   returned status.
#. A rollback consists of disabling the match rule and reloading the
   configuration; it does not require changing Nextcloud itself.
