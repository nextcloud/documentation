.. _assistant-integration:

=========================
Integrating the assistant
=========================

This section covers integrating the Nextcloud assistant into the web frontend of other Nextcloud
applications. For backend integration using the Task Processing OCP API, see
:doc:`task_processing`. For the OCS API, see
:doc:`../client_apis/OCS/ocs-assistant-api`.

Displaying a task result
------------------------

There are two ways to display a task result using the assistant.

Open the assistant modal
^^^^^^^^^^^^^^^^^^^^^^^^

If you have a task object retrieved from the
``/ocs/v2.php/apps/assistant/api/v1/task/TASK_ID`` or
``/ocs/v2.php/apps/assistant/api/v1/tasks`` OCS endpoint, pass it to the helper function
``OCA.Assistant.openAssistantTask``. This opens the assistant modal with the task type, input,
and output pre-loaded.

Browse the task result page
^^^^^^^^^^^^^^^^^^^^^^^^^^^

A standalone page is available at ``/apps/assistant/task/view/TASK_ID``. It renders the same
content as the assistant modal.

Running a task
--------------

Use ``OCA.Assistant.openAssistantForm`` to open the assistant modal from your application. The
function accepts a single configuration object with the following keys:

.. list-table:: ``openAssistantForm`` options
   :header-rows: 1
   :widths: 20 10 70

   * - Key
     - Required
     - Description
   * - ``appId``
     - Yes
     - App ID of the calling application.
   * - ``customId``
     - No
     - Custom identifier for the task; useful when correlating the ``task finished`` backend
       event with the originating call. Defaults to ``''``.
   * - ``taskType``
     - No
     - Initially selected task type (e.g. ``core:text2text``, ``speech-to-text``,
       ``OCP\TextToImage\Task``). Defaults to the last used task type.
   * - ``input``
     - No
     - Object containing initial input values, specific to each task type. Defaults to ``{}``.
   * - ``isInsideViewer``
     - No
     - Set to ``true`` if the function is called while the Viewer is open. Defaults to ``false``.
   * - ``closeOnResult``
     - No
     - If ``true``, the modal closes after a synchronous task completes and results are
       available. Defaults to ``false``.
   * - ``actionButtons``
     - No
     - List of extra buttons to show in the result form. Only used when ``closeOnResult`` is
       ``false``. Defaults to an empty list.

The function returns a Promise that resolves when the modal is closed — either because a task
was scheduled, or a synchronous task ran and produced results. The promise resolves with a task
object:

.. code-block:: javascript

   {
       appId: 'text',
       id: 310,
       customId: 'my custom identifier',
       input: { input: 'give me a short summary of a simple settings section about GitHub' },
       ocpTaskId: 152,
       output: { output: 'blabla' },
       status: 'STATUS_SUCCESSFUL',
       type: 'core:text2text',
       lastUpdated: 1711545305,
       scheduledAt: 1711545301,
       startedAt: 1711545302,
       endedAt: 1711545303,
       userId: 'janedoe',
   }

Possible ``status`` values are: ``STATUS_UNKNOWN`` (0), ``STATUS_SCHEDULED`` (1),
``STATUS_RUNNING`` (2), ``STATUS_SUCCESSFUL`` (3), ``STATUS_FAILED`` (4).

Complete example:

.. code-block:: javascript

   OCA.Assistant.openAssistantForm({
       appId: 'my_app_id',
       customId: 'my custom identifier',
       taskType: 'core:text2text',
       inputs: { input: 'count to 3' },
       actionButtons: [
           {
               label: 'Label 1',
               title: 'Title 1',
               variant: 'warning',
               iconSvg: cogSvg,
               onClick: (output) => { console.debug('first button clicked', output) },
           },
           {
               label: 'Label 2',
               title: 'Title 2',
               onClick: (output) => { console.debug('second button clicked', output) },
           },
       ],
   }).then(task => {
       console.debug('assistant promise success', task)
   }).catch(error => {
       console.debug('assistant promise failure', error)
   })

Populating input from a file
-----------------------------

You can pre-fill a task input field with the content of a file by passing a ``fileId`` or
``filePath`` instead of a plain string value:

.. code-block:: javascript

   OCA.Assistant.openAssistantForm({
       appId: 'my_app_id',
       customId: 'my custom identifier',
       taskType: 'core:text2text',
       inputs: { input: { fileId: 123 } },
   })

   OCA.Assistant.openAssistantForm({
       appId: 'my_app_id',
       customId: 'my custom identifier',
       taskType: 'core:text2text',
       inputs: { input: { filePath: '/path/to/file.txt' } },
   })
