TemplateResponse
================


Response for a normal template


.. php:namespace:: OCA\AppFramework\Http
.. php:class:: TemplateResponse


  .. php:attr:: $templateName
    
    * **Protected**
    
    

  .. php:attr:: $params
    
    * **Protected**
    
    

  .. php:attr:: $api
    
    * **Protected**
    
    

  .. php:attr:: $renderAs
    
    * **Protected**
    
    

  .. php:attr:: $appName
    
    * **Protected**
    
    



  .. php:method:: __construct($api, $templateName, $appName=null)

    :param \\OCA\\AppFramework\\Core\\API $api: an API instance
    :param string $templateName: the name of the template
    :param string $appName: optional if you want to include a template from                       a different app



  .. php:method:: setParams($params)

    :param array $params: an array with key => value structure which sets template                     variables


    Sets template parameters


  .. php:method:: getParams()

    :returns array: the params


    Used for accessing the set parameters


  .. php:method:: getTemplateName()

    :returns string: the name of the used template


    Used for accessing the name of the set template


  .. php:method:: renderAs($renderAs)

    :param string $renderAs: admin, user or blank. Admin also prints the admin                        settings header and footer, user renders the normal                        normal page including footer and header and blank                        just renders the plain template


    Sets the template page


  .. php:method:: getRenderAs()

    :returns string: the renderAs value


    Returns the set renderAs


  .. php:method:: render()

    :returns string: the rendered html


    Returns the rendered html


