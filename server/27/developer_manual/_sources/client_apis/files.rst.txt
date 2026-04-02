.. _FilesAPI:

=====
Files
=====

.. sectionauthor:: John Molakvoæ <skjnldsv@protonmail.com>
.. versionadded:: 27

Since Nextcloud 27, the files app has been rewritten to use new standards
and frameworks. This means that the old documentation is no longer valid.
We will update and document the new files app APIs and methods here.

.. note:: Some external libraries offers in-depth technical documentation.
    Please have a look at the following:

    * https://github.com/nextcloud/nextcloud-files (`documentation <https://nextcloud.github.io/nextcloud-files/>`__)
    * https://github.com/nextcloud/nextcloud-upload


Router
^^^^^^

To change views and parameters of the current Files app, we expose the router.
This directly maps to the Vue router. You can check their own `documentation <https://router.vuejs.org/guide/essentials/navigation.html#navigate-to-a-different-location>`__ to
better understand the methods.

.. code-block:: ts

  /**
   * Trigger a route change on the files app
   * 
   * @param path the url path, eg: '/trashbin?dir=/Deleted'
   * @param replace replace the current history
   * @see https://router.vuejs.org/guide/essentials/navigation.html#navigate-to-a-different-location
   */
  goTo(path: string, replace: boolean = false): Promise<Route>

  /**
   * Trigger a route change on the files App
   *
   * @param name the route name
   * @param params the route parameters
   * @param query the url query parameters
   * @param replace replace the current history
   * @see https://router.vuejs.org/guide/essentials/navigation.html#navigate-to-a-different-location
   */
  goToRoute(
  	name?: string,
  	params?: Dictionary<string>,
  	query?: Dictionary<string | (string | null)[] | null | undefined>,
  	replace?: boolean,
  ): Promise<Route>


Examples
--------

.. code-block:: js

  OCP.Files.Router.goTo('/trashbin?dir=/Unsplash.d1680193199')
  OCP.Files.Router.goToRoute('fileslist', { view: 'files' }, { dir: '/Folders/Group folder' })
