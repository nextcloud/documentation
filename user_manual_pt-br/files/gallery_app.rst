===================
Aplicativo Galeria
===================

O aplicativo Pictures foi reescrito e aprimorado e agora é chamado de aplicativo
Gallery. Ele suporta mais formatos de imagem, classificação, zoom e rolagem.
Ele também suporta personalizações avançadas por meio de um arquivo de texto simples.

Na sua página principal de arquivos do Nextcloud, clique no pequeno ícone no canto
superior direito, abaixo do seu nome de usuário, para abrir sua Galeria. O aplicativo
Gallery localiza automaticamente todas as imagens em suas pastas do Nextcloud e
sobrepõe as miniaturas com os nomes das pastas. Clique nas miniaturas das pastas para
abrir as pastas. No canto superior esquerdo, você tem duas opções de classificação,
alfabética e por data.

.. figure:: ../images/gallery-1.png
   :alt: Miniaturas da pasta da galeria.

Depois de inserir qualquer pasta, clique em qualquer imagem para abri-la no modo
de apresentação de slides. Isso inclui os seguintes recursos: um botão de download
na parte superior central, botões de avançar e voltar nos lados direito e esquerdo,
um botão de apresentação de slides automático no canto inferior direito e um botão
de fechar no canto superior direito.

.. figure:: ../images/gallery-2.png
   :alt: Galeria no modo de apresentação de slides.

Configuração personalizada
--------------------------

Você pode personalizar um álbum da Galeria com um arquivo de texto simples chamado
**gallery.cnf**, que contém parâmetros estruturados usando o
`Yaml <https://en.wikipedia.org/wiki/YAML>`_ linguagem de marcação.
Você pode ter vários arquivos **gallery.cnf**; você precisa de um em sua pasta
raiz Nextcloud (sua pasta Home) que defina recursos globais e, em seguida,
você pode ter arquivos individuais **gallery.cnf** por álbum se desejar
definir diferentes comportamentos em diferentes álbuns.

Características
^^^^^^^^^^^^^^^

Os seguintes recursos gerais estão atualmente implementados:

* Suporte nativo a SVG.
* Acesso a ações externas.

Os seguintes recursos do álbum estão atualmente implementados:

* Adicionando um link para um arquivo contendo uma descrição.
* Digitando uma simples declaração de copyright diretamente no arquivo de configuração.
* Adicionar um link para um arquivo contendo uma declaração de direitos autorais.
* Definindo um tipo de classificação e ordem.
* Definindo a cor do fundo.
* Definir se os sub-álbuns herdarão a configuração.

Os seguintes recursos de apresentação de slides estão atualmente implementados:

* Mostrando um botão que permite escolher qual fundo, preto ou
  branco, para usar na foto que você está visualizando no momento (para imagens com
  fundos transparentes).

Configuração
^^^^^^^^^^^^

O arquivo de configuração deve ser nomeado **gallery.cnf**. Você pode ter vários
arquivos **gallery.cnf** por álbum. Para ativar os recursos globais, coloque
um na sua pasta de nível superior, que é simbolizado na GUI da Web pelo ícone
inicial. (Isto coloca em ``data/<user>/files/``.) Veja:
ref: `um exemplo abaixo de <supported_variables_label>` na seção **Global features**.

.. note:: Você precisa atualizar seu navegador depois de alterar sua
   configuração para ver suas mudanças.

Formato
^^^^^^^

UTF-8, **sem BOM**. Um arquivo criado a partir da GUI da Web do Nextcloud funciona.

Estrutura
^^^^^^^^^

Você deve incluir um comentário no arquivo, para que as pessoas que
estão encontrando o arquivo saibam para que serve. Comentários começam com #.

O espaçamento é criado usando 2 espaços. **Não use abas.**

Dê uma olhada na documentação do formato `YAML
<https://symfony.com/doc/current/components/yaml/yaml_format.html>`_ se você estiver
recebendo mensagens de erro.

Aqui está um exemplo `gallery.cnf`::

  # Gallery configuration file
  # Created on 31 Jan 2016 by Nextcloud User
 features:
   external_shares: yes
   native_svg: yes
   background_colour_toggle: yes
 design:
   background: "#ff9f00"
   inherit: yes
 information:
   description: This is an **album description** which is only shown if there
   is no `description_link`
   description_link: readme.md
   copyright: Copyright 2003-2016 [interfaSys sàrl](https://www.interfasys.ch),
   Switzerland
   copyright_link: copyright.md
   inherit: yes
 sorting:
   type: date
   order: des
   inherit: yes

.. _supported_variables_label:

Variáveis ​​suportadas
^^^^^^^^^^^^^^^^^^^^^^

**Funcionalidades Globais**

Coloque isso na pasta raiz do Nextcloud, que é a sua pasta Home.

* **external_shares**: defina como **yes** no seu arquivo de configuração raiz, se você
  deseja carregar imagens armazenadas em locais externos, ao usar o
  **files_external** app.
* **native_svg**: defina como **yes** no seu arquivo de configuração raiz para ativar
  renderização de imagens SVG no seu navegador. Isso pode representar um risco de segurança se
  você não pode confiar totalmente nos seus arquivos SVG.
* **background_colour_toggle**: defina como **yes** no seu arquivo de configuração raiz
  para habilitar um botão que alterna entre planos de fundo preto e branco
  imagens transparentes.

.. note:: Os compartilhamentos externos são 20 a 50 vezes mais lentos que os compartilhamentos
   locais. Esteja preparado esperar muito tempo antes de poder ver todas as imagens contidas em um
   álbum compartilhado.

**Configuração do álbum**

Cada álbum pode ser configurado individualmente usando as seguintes seções
de configuração. Use o parâmetro **inherit** para passar
configurações para sub-álbuns.

**Design**

* **background**: define a cor do plano de fundo do photowall
  usando a representação hexadecimal RGB dessa cor. Por exemplo:
  **"# ffa033"**. Você deve usar aspas em torno do valor ou será
  ser ignorado. É altamente recomendável usar um tema
  personalizado, com um spinner de carregamento de CSS, se você
  pretende usar esse recurso. Você pode usar
  `paleta de cores <http://paletton.com/>`_ para encontrar
  uma cor que você goste.* **inherit**: defina como **yes** se
  quiser que as subpastas herdem essa parte da configuração.

**Apresentação do Álbum**

* **description**: Uma string formatada com markdown que será exibida na
  caixa de informação. Ela pode se espalhar por várias linhas usando os marcadores Yaml.
* **description_link**: um arquivo de marcação localizado dentro do álbum que será
  analisado e exibido na caixa de informações em vez da descrição.
* **copyright**: uma string formatada com markdown. Isso suporta links para recursos
  externos.
* **copyright_link**: qualquer arquivo (por exemplo, copyright.html), no próprio álbum,
  que será baixado quando o usuário clicar no link
* **inherit**: defina como **yes** se quiser que subpastas herdem essa parte
  da configuração.

Veja `<http://www.markitdown.net/markdown>`_ para a sintaxe de markdown

.. note:: Não adicione links para sua string `copyright` se você usar a
   **variável copyright_link**.

**Classificação**

* **sorting**: **date** ou **name**. **date** só funciona para arquivos.
* **sort_order**: **asc** ou **des** (Ascendente ou descendente).
* **inherit**: defina como **yes** se quiser que subpastas herdem essa parte
  da configuração.

Notas
-----

* Quando somente a variável sort **type** foi definida, a ordem de classificação padrão
   será usada.
* Quando somente a variável **order** sort for encontrada, a configuração sort
   será ignorada e o script continuará procurando por uma configuração válida em
   pastas superiores.
* Para ativar um recurso como o SVG nativo em um compartilhamento público, você precisa criar
   nessa pasta, um arquivo de configuração contendo esse recurso.
* Se você compartilha uma pasta publicamente, não se esqueça de adicionar todos os arquivos que
   (por exemplo ``description.md`` ou ``copyright.md``) dentro da pasta compartilhada como
   o usuário não terá acesso aos arquivos armazenados na pasta pai.
* Como as pessoas podem baixar uma pasta inteira como um arquivo, geralmente é melhor
   incluir todos os arquivos em uma pasta compartilhada, em vez de adicionar texto diretamente
   no arquivo de configuração.

Exemplos
--------

**Apenas classificação**

Aplica-se apenas à pasta atual::

 # Gallery configuration file
   sorting:
   type: date
   order: asc

Breve descrição e link para o documento de direitos autorais, aplica-se à pasta atual
e todas as suas subpastas. Isso também mostra a sintaxe que você pode usar para
divulgar uma descrição em várias linhas::

 # Gallery configuration file
   information:
   description: | # La Maison Bleue, Winter '16
     This is our Winter 2016 collection shot in **Kyoto**
     Visit our [website](http://www.secretdesigner.ninja) for more information
   copyright: Copyright 2015 La Maison Bleue, France
   copyright_link: copyright_2015_lmb.html
   inherit: yes

**Carregar imagens de nuvens externas**

.. note:: Os recursos só podem ser definidos na pasta raiz.

Você pode adicionar itens de configuração padrão ao mesmo arquivo de configuração::

 # Gallery configuration file
   features:
   external_shares: yes

**Ativando o SVG nativo**

.. note:: Recursos especiais só podem ser definidos na pasta raiz.

Você pode adicionar itens de configuração padrão ao mesmo arquivo de configuração::

 # Gallery configuration file
  features:
  native_svg: yes

Possíveis extensões futuras
---------------------------

Parâmetros de classificação diferentes para álbuns.

