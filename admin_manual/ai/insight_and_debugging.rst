=====================
Insight and debugging
=====================

.. _ai-insight-and-debugging:

In order to gain insights and debug AI tasks, there are a number of occ commands
available in the `taskprocessing` namespace.

All commands listed here accept an `--output` parameter that can be set to `plain`, `json` or `json_pretty`.

Tasks are retained in the database for 6 months. Note, however, that there is no strict write-only guarantee for these logs.
This means Nextcloud will not change the task logs in the database once the task has ended, but any administrator with database access
has the power to change them.

Get a task by id
----------------

.. code-block::

   $ occ taskprocessing:task:get <task-id>

For example

.. code-block::

   $ occ taskprocessing:task:get --output=json_pretty 42
   {
     "id": 1,
     "type": "core:text2text:chat",
     "lastUpdated": 1759739466,
     "status": "STATUS_SUCCESSFUL",
     "userId": "admin",
     "appId": "assistant:chatty-llm",
     "input": {
       "system_prompt": "This is a conversation in a specific language between the user and you, Nextcloud Assistant. You are a kind, polite and helpful AI that helps the user to the best of its abilities. If you do not understand something, you will ask for clarification. Detect the language that the user is using. Make sure to use the same language in your response. Do not mention the language explicitly.",
       "input": "What's the weather in Berlin today?",
       "history": []
     },
     "output": {
       "output": "I'm happy to help, but I'm a large language model, I don't have real-time access to current weather conditions. However, I can suggest checking a reliable weather website or app, such as AccuWeather or OpenWeatherMap, for the most up-to-date information on the weather in Karlsruhe today. Would you like me to help with anything else?"
     },
     "customId": "chatty-llm:1",
     "completionExpectedAt": 1759739513,
     "progress": 1,
     "scheduledAt": 1759739453,
     "startedAt": 1759739455,
     "endedAt": 1759739466,
     "allowCleanup": true,
     "error_message": null
   }

Each task has the following fields:

 * `id` The internal ID of the task, also referenced in user-facing error messages in case something goes wrong
 * `type` The type of the task
 * `status` The current status of the task (can be either `"STATUS_CANCELLED"`, `"STATUS_FAILED"`, `"STATUS_SUCCESSFUL"`, `"STATUS_SCHEDULED"`, `"STATUS_RUNNING"`, or `"STATUS_UNKNOWN"`)
 * `userId` The Id of the user who requested the task
 * `lastUpdated` When the task was last updated
 * `scheduledAt` When the task was scheduled/created
 * `startedAt` When the task was started to be processed by the set task processing provider
 * `completionExpectedAt` When the system expects/expected the task to be finished
 * `endedAt` When the task finished be it successfully or unsuccessfully
 * `appid` The ID of the app that scheduled the task
 * `input` The values that were part of the task input
 * `output` The values that were part of the task output
 * `error_message` The error message in case the task failed

List and filter tasks
---------------------

.. code-block::

   $ occ taskprocessing:task:list [options]

   -u, --userIdFilter[=USERIDFILTER]        only get the tasks for one user ID
   -t, --type[=TYPE]                        only get the tasks for one task type
       --appId[=APPID]                      only get the tasks for one app ID
       --customID[=CUSTOMID]                only get the tasks for one custom ID
   -s, --status[=STATUS]                    only get the tests that have a specific status
       --scheduledAfter[=SCHEDULEDAFTER]    only get the tasks that were scheduled after a specific date (Unix timestamp)
       --endedBefore[=ENDEDBEFORE]          only get the tasks that ended before a specific date (Unix timestamp)


For example

.. code-block::

   $ occ taskprocessing:task:list --output=json_pretty --status=3 --scheduledAfter=1759740266 --endedBefore=1759743900
   [
     {
        ...
     }
   ]