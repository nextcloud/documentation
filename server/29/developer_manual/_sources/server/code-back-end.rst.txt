=============
Back-end code
=============

When changing back-end PHP code, in general, no additional steps are needed before checking in.

However, if new files were created, you will need to run the following command to update the autoloader files:

.. code-block:: console
    
   build/autoloaderchecker.sh

After that, please also include the autoloader file changes in your commits.
