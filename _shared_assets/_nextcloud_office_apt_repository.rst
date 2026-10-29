.. Shared code block that adds the Nextcloud Office apt repository on Debian and Ubuntu.

.. code-block:: bash

    sudo apt-get install -y ca-certificates curl
    sudo install -d -m 0755 /etc/apt/keyrings
    sudo curl -fsSL https://download.nextcloud.com/office/repo/nextcloud-office.asc \
      -o /etc/apt/keyrings/nextcloud-office.asc
    echo "deb [signed-by=/etc/apt/keyrings/nextcloud-office.asc] \
    https://download.nextcloud.com/office/repo/deb stable main" \
      | sudo tee /etc/apt/sources.list.d/nextcloud-office.list
    sudo apt-get update
