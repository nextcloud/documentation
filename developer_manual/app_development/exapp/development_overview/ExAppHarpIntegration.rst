Adapting ExApps to HaRP
=======================

.. mermaid::

  graph LR
    Client[Client] -->|connects| NC[Nextcloud Proxy]
    NC -->|connects| HaRP[HaRP - FRP proxy]
    HaRP -->|forwards| ExApp[ExApp container]
    ExApp -->|runs FRP client| HaRP
    AppAPI[Nextcloud AppAPI] -->|manage certs| ExApp

Summary
-------

HaRP is a reverse proxy system designed to simplify the deployment workflow 
for Nextcloud 32’s AppAPI.

It enables direct communication between clients and ExApps, bypassing 
the Nextcloud instance to improve performance and reduce the complexity 
traditionally associated with `DockerSocketProxy` setups.

HaRP provides an `FRP-based <https://github.com/fatedier/frp>`_
transport for ExApps and recommends copying
`start.sh <https://github.com/nextcloud/HaRP/blob/main/exapps_dev/start.sh>`_
into your ExApp image and using it as the container entrypoint.
The script installs or starts the FRP client and executes your app process.

.. warning::

   We strongly recommend starting support for HaRP in ExApps from the start 
   of Nextcloud 32, as the old `DSP <https://github.com/nextcloud/docker-socket-proxy>`_ 
   way will be deprecated and marked for removal in Nextcloud 35.
  
   Adding HaRP support is fully compatible with the existing DSP system, 
   so you won’t need to maintain two separate release types of your ExApp.

Key integration considerations
------------------------------

- **Connecting to HaRP with FRPC**: Your ExApp does not need to expose any ports to the host
  or be reachable from the Nextcloud server. The FRP client (`FRPC`) inside your ExApp
  container will create an outbound connection to HaRP, which will proxy
  requests from clients to your ExApp.
- **File permissions**: AppAPI may copy certificate files into the container and
  execute commands inside it. If your container runs the main process as a
  non-root service user, AppAPI's file writes or execs may fail unless the
  receiving paths are writable/readable by that user.
- **Certs and FRP config**: HaRP expects FRP cert files to be accessible under
  `/certs/frp` (client.crt, client.key, ca.crt). The FRP client configuration
  path used by many example `start.sh` scripts is `/frpc.toml`.
- **Root-only commands**: Some setup steps (for example updating CA bundles with
  `update-ca-certificates`) require root; AppAPI may need to run those using
  `docker exec ...` when setting up containers.

Steps needed to adapt an ExApp
--------------------------------------

1. Copy the `start.sh <https://github.com/nextcloud/HaRP/blob/main/exapps_dev/start.sh>`_
script from the exapps_dev folder of the HaRP repository into your Docker image 
(e.g., using a `COPY` instruction).

2. In your ExApp's Dockerfile, set the `ENTRYPOINT` to execute `start.sh` followed by
the **command and arguments required to launch** your actual application. The `start.sh`
script will launch the FRP client if needed and then use `exec` to
run the command you provide as arguments.

3. Ensure the `curl` command-line utility is installed in your ExApp's Docker image,
as it's needed by the following script to download the FRP client.

4. Add the following lines to your Dockerfile to automatically include the FRP 
client binaries in your Docker image:

  .. code-block:: dockerfile
    
    # Download and install FRP client
    RUN set -ex; \
        ARCH=$(uname -m); \
        if [ "$ARCH" = "aarch64" ]; then \
          FRP_URL="https://raw.githubusercontent.com/nextcloud/HaRP/main/exapps_dev/frp_0.61.1_linux_arm64.tar.gz"; \
        else \
          FRP_URL="https://raw.githubusercontent.com/nextcloud/HaRP/main/exapps_dev/frp_0.61.1_linux_amd64.tar.gz"; \
        fi; \
        echo "Downloading FRP client from $FRP_URL"; \
        curl -L "$FRP_URL" -o /tmp/frp.tar.gz; \
        tar -C /tmp -xzf /tmp/frp.tar.gz; \
        mv /tmp/frp_0.61.1_linux_* /tmp/frp; \
        cp /tmp/frp/frpc /usr/local/bin/frpc; \
        chmod +x /usr/local/bin/frpc; \
        rm -rf /tmp/frp /tmp/frp.tar.gz

  .. note::
    
      For Alpine 3.21 Linux you can just install FRP from repo using apk add frp command.

Running your ExApp with a non-root user
----------------------------------------

.. note::

  In `Docker Build best practices <https://docs.docker.com/build/building/best-practices/#user>`_,
  it is recommended to run application containers as non-root users for security reasons
  whenever possible.

To run the main process as a non-root user while remaining compatible with HaRP and AppAPI,
ensure the following:

1. Keep image default user as `root`, drop to less privileged service user at runtime. 

   - Make it easy for AppAPI to perform privileged operations (copying files,
     setting permissions, running `update-ca-certificates`) by leaving the
     container default user as `root` in the image.
   - Drop privileges for the main process in the `ENTRYPOINT` using `gosu`
     or `su-exec` so the runtime process runs as a non-root service user.

   Example snippet (Dockerfile):

   .. code-block:: dockerfile

      FROM python:3.12-alpine AS app

      ARG USER=serviceuser

      ENV USER=$USER
      ENV HOME=/home/$USER
      ENV GOSU_VERSION=1.19

      # ... other Dockerfile instructions ..

      # Install GOSU
      RUN set -eux; \
        \
        apk add --no-cache --virtual .gosu-deps \
          ca-certificates \
          dpkg \
          gnupg \
        ; \
        \
        dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"; \
        wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch"; \
        wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch.asc"; \
        \
        export GNUPGHOME="$(mktemp -d)"; \
        gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
        gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
        gpgconf --kill all; \
        rm -rf "$GNUPGHOME" /usr/local/bin/gosu.asc; \
        \
        apk del --no-network .gosu-deps; \
        \
        chmod +x /usr/local/bin/gosu

      # Use gosu in combination with start.sh
      ENTRYPOINT ["/bin/sh", "-c", "exec gosu \"$USER\" /start.sh python3 -u main.py"]

.. note::

      See the `gosu documentation <https://github.com/tianon/gosu/blob/master/INSTALL.md>`_
      for more details.

2. Ensure FRP config and cert paths are prepared for the service user

   - **Create `/frpc.toml`** or the directory that will contain it at image build
     time and set ownership to the service user so at runtime `start.sh` can
     write to it without requiring root.
   - **Create directory `/certs/frp`** and make it readable by the service user. 
     AppAPI will copy cert files into that folder by using a `docker cp ...` command
     with the default container user (which is still `root`). By setting the directory 
     owner to the service user, we will ensure the service user can read the certs at runtime.

  Use some similar commands in your Dockerfile:

    .. code-block:: dockerfile
  
        RUN touch /frpc.toml && \
          mkdir -p /certs/frp && \
          chown $USER:$USER /frpc.toml && \
          chown -R $USER:$USER /certs/frp && \
          chmod 600 /frpc.toml

**Putting it all together:**

.. code-block:: dockerfile

      FROM python:3.12-alpine AS app

      ARG USER=serviceuser

      ENV USER=$USER
      ENV HOME=/home/$USER
      ENV GOSU_VERSION=1.19

      # Install dependencies and create service user. You might want to 
      # add additional packages depending on your app requirements.
      # Make sure curl and FRP are installed.
      RUN apk update && \
          apk add --no-cache curl frp ca-certificates && \
          adduser -D $USER && \
          touch /frpc.toml && \
          mkdir -p /certs/frp && \
          chown $USER:$USER /frpc.toml && \
          chown -R $USER:$USER /certs/frp && \
          chmod 600 /frpc.toml

      # Install GOSU
      RUN set -eux; \
        \
        apk add --no-cache --virtual .gosu-deps \
          ca-certificates \
          dpkg \
          gnupg \
        ; \
        \
        dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"; \
        wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch"; \
        wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch.asc"; \
        \
        export GNUPGHOME="$(mktemp -d)"; \
        gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
        gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
        gpgconf --kill all; \
        rm -rf "$GNUPGHOME" /usr/local/bin/gosu.asc; \
        \
        apk del --no-network .gosu-deps; \
        \
        chmod +x /usr/local/bin/gosu

      WORKDIR /app

      # Copy your app code
      COPY --chown=$USER:$USER <files> .

      # Copy the start.sh script and make it executable
      COPY --chown=$USER:$USER start.sh /start.sh
      RUN chmod +x /start.sh && \
        chown -R $USER:$USER /app && \
        pip install -r requirements.txt

      # Run the start.sh as entrypoint with non-root user and point it to your app
      ENTRYPOINT ["/bin/sh", "-c", "exec gosu \"$USER\" /start.sh python3 -u main.py"]

Integration test example
-------------------------

An example test suite used to validate HaRP support for an ExApp is available
in the `workflow_ocr_backend` repository (example commit that added HaRP
support and tests):

- https://github.com/R0Wi-DEV/workflow_ocr_backend/blob/f5ae6efb6e4a3307328a188898968abf000511ab/test/test_harp_integration.py

This test demonstrates automated verification of FRP connection and runtime
behaviour; it can be used as a reference when adding CI checks for HaRP
compatibility.
