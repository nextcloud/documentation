============================
Considerations on Monitoring
============================

.. toctree::
    :maxdepth: 2
    :hidden:

Large scale ownCloud deployments are typically installed as load balanced
n-tier web applications.  Successfully managing such an installation requires
active monitoring of the application and supporting infrastructure components.
The purpose of this section is to outline the components of ownCloud that need
to be monitored, and provide guidance on what to look for ownCloud in an
enterprise installation.

ownCloud Deployment Architecture
================================

Before discussing how to monitor ownCloud, it is important to understand the architecture of a
typical ownCloud deployment. These monitoring best practices are developed based on the use of load
balanced web servers, a clustered database running a distributed database storage engine, such as
MySQL NDB, and a clustered filesystem, such as Red Hat Storage.

It is assumed that specific enterprise tools (monitoring, log management, etc) to monitor
operations are available, and that ownCloud is simply a new target for these tools.


The Important Components of ownCloud
====================================

ownCloud is a PHP application that depends on a filesystem for file storage, and a database for storing
user and file meta data, as well as some application specific information.
While the loss of an app server or a node in the database or storage clusters should not bring the
system down, knowing that this happened and resolving it is essential to keeping the service running
efficiently. Therefore it is important to monitor the ownCloud servers, the Load Balancer, the Storage
Cluster and the Database. This documentation starts with the ownCloud application and works out from
there through the layers of infrastructure.


Status.php
----------

ownCloud provides a very simple mechanism for determining if an application server is up and functioning –
call the status.php file on each ownCloud server. This file can be found in the root ownCloud directory on
the server, which by default is /owncloud/status.php. If the server is functioning normally, the response
looks something like this:

.. code-block:: json

    {"installed":"true","version":"6.0.0.16","versionstring":"6.0.1","edition":""}


We recommend monitoring this file on each ownCloud application server to provide a basic check that the
server is operating properly.


ownCloud.log
------------

ownCloud also provides a built in logging function. If the ownCloud Enterprise Edition logging applications
are enabled, this file will track user logins and shared file activity. If these logging applications are
not enabled, this log file still tracks basic ownCloud health. Given the potential for this file to get
quite large, the log file should be rotated on a daily basis, and given the important of the error information
in the log file, this should be integrated with an enterprise log manager.


Logfile entries that start with the keyword “Error” should be logged and reported to ownCloud support.

Apache
^^^^^^

The apache error and access log should also be monitored. Significant spontanious changes of the number
of requests per second should also be monitored and looked into.


Database server
^^^^^^^^^^^^^^^

The load and general health of the database server or cluster has to be monitored also.
All mysql vendors provide tools to monitor this.


Clustered Filesystem
--------------------

The available space of the filesystem should be monitored to prevent a full ownCloud. This functionality is
provided by the operating-system and/or the cluster filesystem vendor.

Load Balancer
-------------

The load balancer is monitoring the health of the application servers and is distributing the traffic in
the optimal way. The application-servers are should additionally monitored to detect long lasting OS or
hardware problems. Monitoring solutions like Nagos provide build in functionality to do this.






