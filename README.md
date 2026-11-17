# Silas Vino · Garrafeira

A carta, o stock e o histórico estão protegidos pelo Supabase Auth. O painel funciona com menu lateral no computador e navegação inferior no telemóvel.

## Publicar no GitHub Pages

1. Extrai o ZIP e copia `index.html`, `style.css`, `app.js`, `config.js`, `assets/` e `.nojekyll` para a pasta publicada do repositório.
2. Se já tinhas publicado a versão de teste, remove `catalog.js`, `schema_teste.sql`, `seed_teste.sql`, `schema.sql` e `seed.sql` da pasta publicada. A versão atual carrega a carta a partir do Supabase.
3. Abre o endereço do GitHub Pages. Deverás ver o ecrã de entrada.

O `config.js` já contém o endereço do projeto e a chave publicável. O projeto Supabase está preparado e a instalação do site é estática.

## Repor vendas no frigorífico

1. Ao registar uma venda, o sino indica uma reposição pendente com o vinho, a quantidade e quem vendeu.
2. Depois de trazer as garrafas do armazém, qualquer colaborador pode marcar **Reposto** nessa notificação. O sistema tira a quantidade do armazém e acrescenta-a ao frigorífico.
3. A equipa vê a notificação desaparecer. Em **Histórico → Reposições** ficam a quantidade, a data e a conta que confirmou. Os detalhes identificam a venda associada.

Se faltar stock confirmado no armazém, o pedido fica pendente. As vendas registadas antes desta atualização continuam no histórico. A migração incluída em `supabase/migrations/` já está aplicada no projeto configurado e serve para instalar a funcionalidade noutro projeto com o mesmo esquema.

## Interpretar o painel

Os totais do frigorífico, do armazém e do gráfico usam apenas contagens confirmadas. A indicação **Por conferir** identifica um vinho com pelo menos um local por contar. O painel assinala **Baixo stock** entre 1 e 8 garrafas no conjunto dos dois locais, quando ambos estão conferidos. O stock esgotado e a reposição do frigorífico aparecem nos alertas.

## Usar as contas

| Utilizador | Acesso |
| --- | --- |
| `kalyel` | Administrador |
| `isa` | Colaboradora |
| `teresa` | Colaboradora |

O campo **Manter sessão iniciada neste navegador** vem marcado. Nessa opção, o navegador guarda a sessão e volta a abrir a garrafeira ao regressares ao mesmo endereço. Ao desmarcar, a sessão fica na aba de entrada e termina quando a fechas. Em **Mais opções → Terminar sessão**, a sessão é encerrada nesse navegador.

O perfil de administrador também permite editar a carta, registar entradas e gerir os acessos da equipa. Os novos movimentos identificam a conta que os registou. Os movimentos importados da fase de teste mantêm a indicação **Visitante de teste**.

A criação pública de contas está fechada. Os identificadores internos seguem o formato `utilizador@garrafeira.silasvino.example`. Para alterar uma palavra-passe por via administrativa, usa a API Auth Admin do Supabase a partir de um ambiente privado. Esses endereços internos não recebem mensagens de recuperação.
