Welcome to ownCloud
===================
If you are new to ownCloud, then this document is a good place to start. This document describes the core features and architecture of the ownCloud solution at a very high level. As depicted below, this is simply an introduction, that provides the basic knowledge you need before digging into the more complex technical documentation:

::

  Figure1

There are three roles associated with ownCloud:

* User
* Administrator
* Developer

These roles may be contained in one person, but the document refers to these roles separately to make it easier to understand. The installation can be easily installed for a single user system, and also for a complex enterprise web application implementation. 
You may want to supply all three mentioned as one person, which is yourself. Of course this text refers also to users, that want to have their stuff hosted by a local institution having its own administrator(s) and developer(s)


Motivation
==========
The most common use case for ownCloud is as a replacement for consumer cloud based sync and share services, such as DropBox and Google Drive. This means that a user wants to:
* Share files with a group, other uses on the system and / or third parties
* Syncing defined files from the local filesystem to a server automatically
* Sync defined files from a mobile device to a server automatically
* access files from any machine with any browser any time
Users may also want to specify certain groups of users, which have different authorization to see or share different parts of this online storage. 
By hosting ownCloud, the users of the system own their data.

A quick overview over the ownCloud setting
==========================================
In Figure2 you can see a very abstract scheme of ownCloud:

::

  Figure2

From left to right:
* Users connect to the system with mobile devices, web browsers, desktop sync clients and also standard WebDAV clients.  These connections show a user's files, and the files shared with the user in one convenient interface.
* Server host the ownCloud application, manage files actions and provide processing for ...The storage and the access-control is provided by our webserver, having ownCloud software installed, to the internet. All data can be found at a specified point of your webadress (e.g. http://yourserver.org/yourstorage).
* A variety of storage systems can be used by the server to store user files.  This can be everything from an object store or cloud storage system to locally attached storage and SANs.

The next section highlights why many of our customers use the ownCloud solution.

The „Dropbox Problem“
=======================
Employees are using cloud-based services to share sensitive company data with vendors, customers and partners. They are syncing data to their personal devices and home computers, all in an effort to get their job done faster and easier, and all without IT‘s permission. Consumer cloud-based file sharing services have your sensitive company data stored on servers outside of your control, outside of your policy and regulatory guidelines – maybe even outside your country – and not managed by you. The potential for data leakage, security breeches and harm to the business is enormous.
Figure3 shows a typical dropbox-constellation, that leads to the anomalies, mentioned in the picture and described below.

::

  Figure3
  
1.  **No IT control:** Data is no longer under your control
