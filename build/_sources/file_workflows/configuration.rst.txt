==================
Flow configuration
==================

Administrators can disable user flows since they can have an impact on the performance of a system and you might not want to give users the ability to define their own flows rules. They can be disabled through the following command::

  occ config:app:set workflowengine user_scope_disabled --value yes