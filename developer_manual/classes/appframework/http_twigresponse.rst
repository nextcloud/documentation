TwigResponse
============


Response for twig templates.
Do not use this directly to render your
templates, unless you want a blank page because the owncloud header and
footer won't be included

.. php:namespace:: OCA\AppFramework\Http
.. php:class:: TwigResponse




  .. php:method:: __construct($api, $templateName, $twig)

    :param \\OCA\\AppFramework\\Core\\API $api: an api instance
    :param string $templateName: the name of the twig template
    :param \\OCA\\AppFramework\\Http\\Twig_Environment $twig: an instance of the twig environment for rendering


    Instantiates the Twig Template


  .. php:method:: render()

    :returns string: rendered output


    Returns the rendered result
