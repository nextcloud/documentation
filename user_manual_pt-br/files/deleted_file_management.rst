================================
Gerenciando arquivos excluídos
================================

Quando você exclui um arquivo no Nextcloud, ele não é imediatamente excluído
permanentemente. Em vez disso, ele é movido para a lixeira. Ele não é excluído
permanentemente até que você o exclua manualmente ou quando o aplicativo
Arquivos excluídos o exclui para liberar espaço para novos arquivos.

Encontre seus arquivos excluídos clicando em **Arquivos excluídos**
botão na página Arquivos da interface da Web do Nextcloud. Você terá
opções para restaurar ou excluir permanentemente arquivos.

Quotas
------

Os arquivos excluídos não são contados na sua cota de armazenamento.
Apenas seus arquivos pessoais são contabilizados em sua cota, não
em arquivos que foram compartilhados com você. (Veja :doc:`quota`
para saber mais sobre cotas.)

O que acontece quando arquivos compartilhados são excluídos
------------------------------------------------------------

A exclusão de arquivos fica um pouco complicada quando eles são
arquivos compartilhados, como ilustra este cenário:

1. Usuário1 compartilha uma pasta "teste" com User2 e User3
2. Usuário2 (o destinatário) exclui um arquivo / pasta "sub" dentro de "teste"
3. A pasta "sub" será movida para a lixeira do Usuário1 (proprietário) e
   Usuário2 (destinatário)
4. Mas o User3 não terá uma cópia de "sub" em sua lixeira

Quando o Usuário1 exclui "sub", ele é movido para a lixeira do Usuário1. Isto é
excluídos de User2 e User3, mas não colocados em suas lixeiras.

Quando você compartilha arquivos, outros usuários podem copiar, renomear, mover e compartilhá-los com
outras pessoas, assim como para qualquer arquivo de computador; Nextcloud não tem
poderes mágicos para evitar isso.

Como o aplicativo de arquivos excluídos gerencia o espaço de armazenamento
---------------------------------------------------------------------------

Para garantir que os usuários não ultrapassem as cotas de armazenamento, os arquivos excluídos
app aloca um máximo de 50% do espaço livre atualmente disponível para os arquivos excluídos.
Se os arquivos excluídos excederem esse limite, o Nextcloud excluirá arquivos mais antigos
(arquivos com os timestamps mais antigos de quando foram excluídos) até atingir o limite
de uso de memória novamente.


Nextcloud verifica a idade dos arquivos excluídos toda vez que novos arquivos são adicionados ao
arquivos excluídos. Por padrão, os arquivos excluídos permanecem na lixeira por 30 dias. o
O administrador do servidor Nextcloud pode ajustar este valor no arquivo `` config.php``
definindo o valor `` trashbin_retention_obligation``. Arquivos mais antigos que o
O valor `` trashbin_retention_obligation`` será excluído permanentemente.
Além disso, o Nextcloud calcula o espaço máximo disponível a cada vez que um novo
arquivo é adicionado. Se os arquivos excluídos excederem o novo espaço máximo permitido
O Nextcloud irá expirar os arquivos apagados antigos até que o limite seja atingido novamente.
