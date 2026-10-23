# Órbita V3 — visual e fluxo personalizável

## Alterações

O dashboard ganhou uma composição editorial, tipografia ampla, fundo claro, menu escuro, destaque cítrico e ilustração orbital original em CSS que indica a proporção concluída. A base visual foi refinada a partir da estrutura do HTML da Oakley enviado pelo usuário: blocos editoriais, hero e destaque de títulos. O acesso direto ao site falhou com ERR_TUNNEL_CONNECTION_FAILED; não foi feita alegação de inspeção visual do site ao vivo. Nenhum script, imagem comercial, logotipo ou conteúdo de rastreamento do HTML anexado foi incorporado ao aplicativo. As imagens desta entrega são capturas do próprio Órbita; a ilustração não usa recursos externos.

Status, áreas, projetos e prioridades passaram a ser listas personalizáveis. Há atalhos + junto dos respectivos campos da tabela, no cartão junto da prioridade e acima dos cartões. Um novo status adiciona uma coluna. A seção Seu fluxo permite gerenciar nomes, cores e comportamentos dos status. Renomear atualiza atividades e filtros; excluir uma opção em uso é bloqueado.

Status se agrupam por comportamento pending/progress/done para preservar indicadores, calendário e datas automáticas. Datas existentes são mantidas; alterações com cronologia inválida são rejeitadas. Alterar o comportamento cadastrado não reescreve datas históricas.

## Dados e compatibilidade

Os dados continuam locais, na chave orbita-v1. schemaVersion permanece 1; settings.catalogs contém statuses (name, kind, color), areas, projects e priorities. Backups antigos recebem as listas correspondentes sem alterar tarefas, IDs, horários ou notas. Nomes antigos de projetos com diferenças de maiúsculas são preservados. A interface impede a criação de novas opções duplicadas, inclusive diferenças de caixa. Nomes encontrados nas atividades e filtros são preservados nas listas durante a importação.

Exportação/importação de estilo manipula somente tema e cores, preservando as listas. Backups que usam novas categorias precisam desta versão ou posterior, pois versões antigas validam nomes fixos. Não houve acesso ao localStorage do computador do usuário; os testes usaram dados sintéticos em perfis separados. Os arquivos originais recebidos continuam fora da cópia de trabalho, intactos.

## Resultado

37 grupos de testes em Chromium real passaram:

- validacao.cjs: 13 grupos de regressão de atividades, datas, teclado, filtros, arraste, calendário, aparência, backup, persistência e layout.
- casos-adicionais.cjs: 11 grupos com fusos, navegação no dia 31, reversão de cronologia, filtros salvos, temas, estilos, validação de JSON, dashboard, API de pasta simulada e falhas de armazenamento.
- personalizacao-fluxo.cjs: 13 grupos sobre o novo visual, criação inline de opções, duplicatas/cancelar, prioridades no cartão, colunas novas, filtros/formulários dinâmicos, renomeação sem perder dados, proteção de exclusão, cor/comportamento do status, backups/recarga, estilo sem perder categorias, migração e responsividade.

Nenhuma exceção de JavaScript capturada nas execuções finais. Logs completos: resultado-principal.txt, resultado-adicional.txt e resultado-fluxo.txt. Capturas desktop e estreitas acompanham a entrega. O ZIP foi verificado por integridade, extraído em outra pasta e submetido à verificação de abertura do dashboard e criação de opção; os hashes de todos os arquivos extraídos foram comparados ao manifesto.

## Limites

A aplicação foi testada por HTTP local em Chromium 154.0.8037.57, com Playwright 1.64.1, locale pt-BR e fuso America/Sao_Paulo. A política do navegador do ambiente bloqueia file://; a abertura por duplo clique não foi validada aqui. O seletor nativo de pasta não foi operado: os testes de gravação/cancelamento/falha usam uma implementação simulada da API. Não houve testes em celular físico, Safari, Firefox ou Edge. Não foi recebida uma exportação de dados pessoais reais para validar uma migração individual.

Não há Google Drive, sincronização remota, contas ou servidor de dados. A disponibilização no GitHub serve para baixar o código e o ZIP e não recebe os dados digitados no aplicativo.

## Reproduzir

O aplicativo não exige instalação. Para os testes técnicos, use Python 3, Node.js e Chromium no caminho /usr/bin/chromium. O pacote Playwright é uma dependência dos testes, não do aplicativo.

Na pasta Orbita, execute `python -m http.server 8770 --bind 127.0.0.1`.

Em outro terminal:

```sh
npm install --prefix /tmp/orbita-tools --cache /tmp/orbita-npm-cache playwright@1.64.1
NODE_PATH=/tmp/orbita-tools/node_modules node validacao/validacao.cjs
NODE_PATH=/tmp/orbita-tools/node_modules node validacao/casos-adicionais.cjs
NODE_PATH=/tmp/orbita-tools/node_modules node validacao/personalizacao-fluxo.cjs
```

ORBITA_URL pode apontar para outro endereço HTTP local. Em outra plataforma, ajuste executablePath para o Chromium disponível. Os scripts gravam suas capturas na própria pasta de validação e usam contextos isolados de navegador.
