==============================
Introduction to Nextcloud Apps
==============================

.. note::
   This page is under development.

Nextcloud supports two types of apps, each with a different architecture and development workflow.

**PHP Apps** run inside the Nextcloud server process. They are written in PHP, use the OCP public API to interact with Nextcloud internals, and follow a defined app structure with metadata, controllers, and templates. This is the traditional and most common approach to Nextcloud app development.

**ExApps (External Apps)** run as separate Docker containers alongside Nextcloud. They communicate with Nextcloud over HTTP via the AppAPI framework and can be written in any programming language. This approach is particularly suited for AI and machine learning workloads that require Python or other non-PHP runtimes.

This page will explain when to use each approach and how they differ architecturally.
