======================
Quota de armazenamento
======================

Seu administrador do Nextcloud tem a opção de definir uma cota de armazenamento
para os usuários. Olhe no topo da página da sua equipe para ver qual é a sua
cota e quanto você usou.

.. figure:: ../images/quota1.png

Pode ser útil entender como sua cota é calculada.

Metadados (miniaturas, arquivos temporários, caches e chaves de criptografia)
ocupam cerca de 10% do espaço em disco, mas não são contados nas cotas de usuários.
Alguns aplicativos armazenam informações no banco de dados, pesquise os aplicativos
de calendário e contatos. Esses dados são excluídos da sua cota.

Quando outros usuários compartilham arquivos com você, os arquivos compartilhados
contam com a cota do proprietário do compartilhamento original. Quando você
compartilha uma pasta e permite que outros usuários façam o upload de arquivos
para sua cota. Quando você compartilha novamente os arquivos compartilhados
com você, o novo compartilhamento ainda conta com a cota do proprietário
do compartilhamento original.

Os arquivos criptografados são um pouco maiores que os arquivos não criptografados;
o tamanho não criptografado é calculado em relação à sua cota.

Os arquivos excluídos que ainda estão na lixeira não contam para as cotas.
O lixo está definido em 50% da cota. O envelhecimento do arquivo excluído é
definido em 30 dias. Quando os arquivos excluídos excederem 50% da cota,
os arquivos mais antigos serão removidos.

Quando o controle de versão está ativado, as versões de arquivo mais antigas
não são contadas contra cotas.

Se você criar um compartilhamento público por meio de URL e permitir uploads,
todos os arquivos enviados serão contabilizados em sua cota.
