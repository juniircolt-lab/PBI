# Órbita V4 — menu e navegação fluida

## Resultado visual

A referência usada foi o HTML já fornecido e, nesta revisão, as duas capturas enviadas pelo usuário. A versão anterior não correspondia à composição e ao movimento pedidos. Esta revisão substitui a barra lateral por cabeçalho branco horizontal, faixa superior em gradiente e um menu amplo com categorias à esquerda e dois painéis visuais à direita. O dashboard tem uma abertura de largura total, fundo escuro/violeta, escultura orbital original, título central e botão arredondado.

A escultura é um SVG local criado para o Órbita. A atmosfera, a flutuação, os efeitos de cursor/rolagem e os painéis do menu são CSS/JavaScript locais. Não foram copiados logotipo, fotos de produtos, imagens de pessoas ou scripts de comércio/rastreamento do site de referência. O aplicativo continua funcionando sem rede.

## Movimento implementado

- Abertura do menu com entrada lateral dos painéis e sequência das categorias; fechamento com saída suave.
- Hover/foco nas categorias desloca o texto e a seta e atualiza o destaque visual.
- Troca de páginas e visualizações com saída, entrada, deslocamento e desfoque breve por View Transitions. Interrupções respeitam a última navegação solicitada.
- Alternativa por Web Animations quando View Transitions está indisponível.
- Escultura com flutuação, resposta suave ao cursor e paralaxe de rolagem. Névoas e chamada de rolagem têm movimento discreto.
- Indicadores revelados ao entrar na tela durante a rolagem.
- Menu modal com foco contido, Escape, retorno ao acionador, bloqueio de rolagem de fundo e atalhos diretos para tabela/cartões/calendário.
- Movimento reduzido acompanha a preferência do sistema. Cabeçalho, menu e navegação funcionam também no viewport estreito.

Filtros do dashboard podem ser abertos pelo ícone de ajustes do cabeçalho. A lupa abre a busca nas atividades. As listas personalizáveis, atalhos +, cores/comportamentos dos status, datas, notas, filtros e backups foram mantidos. Nenhum acesso aos dados do navegador do usuário foi feito.

## Verificações executadas

47 grupos passaram, sem exceções de JavaScript nas execuções finais:

| Suíte | Grupos | Evidência |
| --- | ---: | --- |
| validacao.cjs | 13 | CRUD, datas/horários, teclado, filtros, cartões, calendário, prévia, backups, persistência e layout |
| casos-adicionais.cjs | 11 | Fuso, calendário do dia 31, cronologia inválida, filtros salvos, temas, estilos, validação JSON, dashboard e falhas de armazenamento/pasta |
| personalizacao-fluxo.cjs | 13 | Opções novas na tabela/cartões, filtros/formulário dinâmicos, renomeação, exclusão protegida, cores/comportamentos, backup/recarga, estilo e migração |
| navegacao-fluida.cjs | 10 | Movimento efetivo, menu animado, foco/Escape, atalhos, animações de saída/entrada, cliques rápidos, destino dos painéis, fallback, movimento reduzido, rolagem, busca/filtros e navegação móvel |

As 37 verificações de regressão foram executadas com movimento reduzido, para isolar o comportamento de dados. As 10 novas verificações executaram a navegação com movimento real, verificaram animações em andamento e a mudança da transformação da escultura entre instantes diferentes. O teste de movimento reduzido foi explícito; o fallback foi testado removendo a API View Transitions apenas na página de testes.

Uma expectativa da cor de fundo antiga foi atualizada para o novo fundo neutro; a mudança do tema do sistema continuou sendo verificada. Os logs completos estão nos arquivos resultado-*.txt.

As capturas dashboard-desktop.png, dashboard-mobile.png, menu-desktop.png e menu-mobile.png são da versão final. O teste percorreu a rolagem antes das capturas completas para revelar os painéis. navegacao.webm é uma gravação real da execução; previa-animada.gif é um trecho convertido dessa gravação, sem simular a interface. A gravação usa dados sintéticos em perfil isolado.

O ZIP final foi extraído em outra pasta, seus arquivos comparados ao manifesto SHA256 e a navegação pelo menu e a criação de uma opção verificadas nessa cópia.

## Dados

Storage e esquema da V3 foram preservados: chave local orbita-v1, schemaVersion 1 e listas em settings.catalogs. Dados antigos permanecem importáveis. Estilos não substituem categorias. Backups com status/áreas/prioridades personalizados precisam desta versão ou posterior. Nenhum backup pessoal real foi fornecido; os testes de migração usam dados sintéticos.

## Limites

Testado em Chromium 154.0.8037.57, Playwright 1.64.1, locale pt-BR e fuso America/Sao_Paulo, por HTTP local. A política do navegador bloqueia file://; a abertura por duplo clique não foi validada aqui. A pasta local foi exercitada por simulação da API, sem operar o seletor nativo. Tela estreita não equivale a aparelho físico. Não houve execução em Safari, Firefox ou Edge, nem avaliação de desempenho em aparelhos de baixo custo.

O download do FFmpeg empacotado do Playwright foi negado pela política de rede. A gravação foi realizada com o FFmpeg já instalado no sistema, disponibilizado no diretório local de ferramentas de testes. Não foram usados artefatos do download que falhou nem desativadas verificações de rede/instalação.

## Reproduzir tecnicamente

O aplicativo não exige instalação. Para os testes, use Python 3, Node.js, Chromium e Playwright 1.64.1. Na pasta Orbita, execute `python -m http.server 8770 --bind 127.0.0.1`.

```sh
npm install --prefix /tmp/orbita-tools --cache /tmp/orbita-npm-cache playwright@1.64.1
NODE_PATH=/tmp/orbita-tools/node_modules node validacao/validacao.cjs
NODE_PATH=/tmp/orbita-tools/node_modules node validacao/casos-adicionais.cjs
NODE_PATH=/tmp/orbita-tools/node_modules node validacao/personalizacao-fluxo.cjs
```

Para a suíte de movimento com gravação, instale o FFmpeg do Playwright pelo comando oficial `node /tmp/orbita-tools/node_modules/playwright/cli.js install ffmpeg`, ou use um FFmpeg do sistema já instalado. Neste ambiente foi usado:

```sh
mkdir -p /tmp/orbita-playwright/ffmpeg-1013
ln -s /usr/bin/ffmpeg /tmp/orbita-playwright/ffmpeg-1013/ffmpeg-linux
PLAYWRIGHT_BROWSERS_PATH=/tmp/orbita-playwright NODE_PATH=/tmp/orbita-tools/node_modules node validacao/navegacao-fluida.cjs
```

Os testes usam /usr/bin/chromium; ajuste executablePath em outras plataformas. ORBITA_URL pode apontar para outro servidor local. As capturas e a gravação são gravadas junto aos testes. A instalação de ferramentas de testes não faz parte do funcionamento do aplicativo para o usuário.
