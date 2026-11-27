# Auditoria de rotas, validações e integração com o backend

Data da análise: 27/10/2026.

## 1. Objetivo e limites da análise

Este documento descreve o estado atual do aplicativo e as correções necessárias para integrar o agendamento público ao backend definido em [integracao.md](./integracao.md). As recomendações abaixo ainda não estão implementadas.

Foram inspecionadas as 11 telas de `src/app`, seus quatro layouts, componentes compartilhados, hooks, configuração Expo, dependências e tipos de rotas gerados. As referências de linha correspondem ao código presente na data da análise e podem mudar após edições.

A análise é estática, acompanhada de verificação TypeScript e tentativa de lint. Não foram executados testes visuais em aparelhos, requisições ao backend ou auditoria do código-fonte do servidor. Portanto, riscos visuais e de histórico são indicados como pontos a validar, sem alegar reprodução em dispositivo.

### Diagnóstico geral

O aplicativo ainda não consegue concluir um agendamento real. Não há chamadas HTTP no código de `src`: o link não carrega uma empresa, os serviços e horários são locais e a finalização exibe um alerta de integração pendente. Parte das validações existe, mas não corresponde integralmente ao contrato.

O backend documenta somente três operações públicas: consultar empresa, consultar disponibilidade e criar reserva. Cadastro/login do cliente, consulta de reservas, cancelamento e remarcação não estão disponíveis nesse contrato.

### Prioridades

| Prioridade | Significado |
| --- | --- |
| P0 | Bloqueia a reserva real ou permite apresentar sucesso sem reserva comprovada. |
| P1 | Necessário para consistência dos dados, recuperação de falhas e navegação confiável. |
| P2 | Qualidade de interface, acessibilidade e manutenção. |

## 2. Mapa das rotas e navegação atual

Grupos entre parênteses organizam navegadores, mas não acrescentam segmentos à URL. Por exemplo, `/(schedule)/services` corresponde à URL `/services`. Os caminhos internos com grupos ajudam a identificar o destino. Referência: [notação do Expo Router](https://docs.expo.dev/router/basics/notation/).

| Arquivo em `src/app` | URL | Comportamento e destinos atuais |
| --- | --- | --- |
| `index.tsx` | `/` | Redireciona para `/(schedule)/link-page`. |
| `(dashboard)/index.tsx` | `/`, dentro do grupo dashboard | “Agendar” abre login; botão de link abre `link-page`; “Saiba Mais” abre `about`. |
| `(dashboard)/about.tsx` | `/about` | Conteúdo institucional; seta executa `router.back()`. |
| `(login)/login.tsx` | `/login` | Abre cadastro; “Fazer login” tenta navegar para um caminho inexistente. |
| `(login)/register.tsx` | `/register` | Permite voltar ao login; ação principal está vazia. |
| `(schedule)/link-page.tsx` | `/link-page` | Coleta link; “Continuar” apenas registra o valor no console; logo abre dashboard. |
| `(schedule)/services.tsx` | `/services` | Seleciona serviço fictício e envia dados para `./datetime`; volta pelo histórico. |
| `(schedule)/datetime.tsx` | `/datetime` | Seleciona data e horário fixo; envia parâmetros para `./personal-info`. |
| `(schedule)/personal-info.tsx` | `/personal-info` | Valida parcialmente os dados; envia parâmetros para `./confirmation`. |
| `(schedule)/confirmation.tsx` | `/confirmation` | Mostra resumo; finalização exibe alerta de integração pendente. |
| `(schedule)/sucess.tsx` | `/sucess` | Exibe sucesso incondicional; “Voltar” executa `replace` para dashboard. |

### Layouts

- `src/app/_layout.tsx`: carrega fontes, controla splash e contém um `Stack`. A declaração explícita apenas do dashboard não significa que as demais rotas deixem de existir: o roteamento é baseado nos arquivos.
- `(dashboard)/_layout.tsx`: `Stack` para início e página institucional, sem cabeçalho visível.
- `(login)/_layout.tsx`: `Tabs` com barra escondida para login/cadastro. Não é, por si só, um erro, mas o retorno entre abas deve ser validado caso a autenticação seja mantida.
- `(schedule)/_layout.tsx`: `Stack` com etapas de agendamento; declara uma tela `success` que não corresponde ao arquivo existente.

### Fluxo efetivamente alcançável

```text
/ → link-page → Continuar → somente console.log
          └→ dashboard → login → destino inexistente
                      ├→ link-page
                      └→ about

services → datetime → personal-info → confirmation → alerta de integração pendente
sucess → mensagem de sucesso, mesmo sem resposta do servidor
```

As telas a partir de serviços existem, mas não estão ligadas ao botão de continuidade da entrada. A tela de sucesso não é acionada pela confirmação atual.

## 3. Achados por tela e correções

### R01 — Entrada do link não inicia o agendamento — P0

**Evidência:** `src/app/(schedule)/link-page.tsx:108–117` e `:156–172`.

O estado `link` guarda texto livre. A função `continuar()` retorna silenciosamente se estiver vazio; qualquer outro texto é escrito no console. Não há extração de empresa, validação de UUID, consulta ou navegação.

**Correção recomendada:** interpretar o endereço `<FRONTEND_URL>/agendar/<companyId>`, validar estrutura e UUID v7 com Zod, consultar a empresa e abrir serviços com os dados carregados. O host aceito deve vir da configuração do frontend; não usar a URL colada como base de requisições arbitrárias. A URL base da API é uma configuração independente. Exibir erro compreensível para link vazio, malformado ou empresa inexistente e remover o log do link em produção.

**Aceite:** um link válido carrega a empresa correta; entrada inválida não avança nem dispara uma consulta com identificador inválido.

### R02 — Autenticação fictícia e destino incorreto — P0/P1

**Evidência:** `src/app/(dashboard)/index.tsx:82`; `src/app/(login)/login.tsx:215–238` e `:272–274`; `src/app/(login)/register.tsx:271–277`.

O login não valida e-mail/senha nem autentica. Seu botão usa `../(shedule)/link-page.tsx`: o grupo está escrito incorretamente e há extensão de arquivo no destino. O cadastro tem uma ação vazia, com comentário para implementação, e botão principal rotulado “Fazer login”.

**Correção recomendada:** direcionar “Agendar” no dashboard para a entrada pública do link. Login/cadastro não devem bloquear reservas públicas. Se essas telas forem mantidas para outra funcionalidade, separar esse trabalho e exigir contrato específico de autenticação; não inventar endpoints ou política de senha a partir das dicas visuais. Corrigir qualquer referência restante ao destino para uma rota válida do Expo Router, sem extensão.

**Aceite:** o cliente consegue iniciar uma reserva sem conta. Nenhum botão conduz ao grupo inexistente. Telas de autenticação não anunciam operações implementadas quando não há contrato e comportamento correspondente.

### R03 — Serviços e empresa inteiramente fictícios — P0

**Evidência:** `src/app/(schedule)/services.tsx:10–29`, `:254–280` e `:329–360`.

Os três serviços usam IDs `1`, `2`, `3`, duração textual e preço já formatado. Empresa, categoria, endereço e expediente estão fixos. Nenhum `companyId` é recebido ou propagado; um parâmetro opcional `agenda` aparece em outras telas, mas não estabelece a identidade da empresa.

**Correção recomendada:** usar `GET /public/companies/:companyId`, preservando ID, nome, descrição, duração numérica e preço de cada serviço. Guardar `companyId` explicitamente. A seleção deve referenciar um serviço da empresa carregada. Exibir estado de carregamento, falha recuperável e ausência de serviços; neste último caso, impedir avanço.

O contrato retorna nome, fuso, expediente e serviços. Não retorna endereço, categoria ou imagem da empresa: ocultar esses elementos fictícios ou registrar uma evolução futura do backend. Não manter dados da “Barbearia NJ” como fallback. Renderizar o expediente conforme `schedules`, inclusive array vazio, usando `weekDay` de domingo (`0`) a sábado (`6`).

`description` e `price` podem ser `null`. Preço nulo deve aparecer como não informado, nunca como zero. O contrato não fornece moeda: a adoção de `R$` exige uma definição de produto e não pode ser apresentada como informação retornada pela API.

**Aceite:** nenhuma empresa, serviço, duração ou preço fictício permanece no fluxo integrado. Sem serviço selecionado, o botão fica desabilitado e comunica o motivo.

### R04 — Disponibilidade simulada e fuso incorreto — P0

**Evidência:** `src/app/(schedule)/datetime.tsx:18–23`, `:257–335` e `:475–489`.

Os horários são fixos e independem de empresa, serviço, expediente ou reservas existentes. O calendário usa `new Date()` no fuso do aparelho. Há bloqueio de dias anteriores e limpeza do horário ao trocar dia/mês, mas não há verificação de horários já passados no dia atual. A interface ainda apresenta horários antes da escolha de uma data.

**Correção recomendada:** consultar a disponibilidade após escolher serviço e data. Enviar exclusivamente `serviceId` e `date=YYYY-MM-DD`. Interpretar o dia no fuso de `company.timeZone`; não obter a data usando corte de uma string UTC. Exibir os slots retornados, guardar o `startAt` original e formatar sua apresentação no fuso da empresa.

Não gerar horários localmente a partir do expediente: o servidor considera duração, grade a partir da abertura, sobreposições e instante atual. Não fixar intervalos de 30 minutos nem offset `-03:00`.

Ao mudar empresa, serviço ou data, invalidar a seleção anterior. Evitar que uma resposta atrasada substitua os resultados de uma consulta mais recente. `slots: []` é sucesso sem disponibilidade, com opção para trocar data/serviço.

**Aceite:** só é possível selecionar um slot da consulta vigente. Datas e horários permanecem corretos quando o aparelho está em outro fuso. Um horário pode ser rejeitado na criação mesmo após ter aparecido disponível; esse cenário deve permitir nova seleção.

### R05 — Dados pessoais parcialmente validados — P1

**Evidência:** `src/app/(schedule)/personal-info.tsx:210–261` e `:325–384`.

| Campo | Validação atual | Ajuste conforme contrato |
| --- | --- | --- |
| Nome | Mínimo de seis caracteres após `trim`; sem máximo | Aceitar de 1 a 150 após `trim`; remover dica de mínimo seis e não exigir sobrenome sem regra de produto. |
| E-mail | Regex básica após `trim`; sem máximo | Validar formato com Zod e limite de 254; rejeitar vazio/null e tratar eventual rejeição do servidor. |
| Telefone | Remove não dígitos, trunca em 11, mascara e exige exatamente 11 | Validar telefone brasileiro com DDD, não apenas comprimento. Confirmar formatos admitidos pelo backend antes de restringir somente a celulares. Não aceitar DDD/prefixo inválido só por ter 11 dígitos. |
| Observações | Campo não existe | Opcional; pode ser omitido. Se oferecido, validar até 2.000 caracteres após `trim` e permitir ausência/null. |

A máscara de telefone não valida o número. O truncamento também pode transformar uma entrada longa ou com código do país em outro valor sem avisar. Definir normalização consistente e apresentar erro quando o formato não for suportado. `integracao.md` não detalha todos os DDDs e formatos aceitos; essa equivalência precisa ser conferida com o validador do backend, sem inventar regras locais divergentes.

Nome, e-mail e telefone são encaminhados em parâmetros de navegação. Isso pode colocá-los em URLs/histórico na versão web e em estado de navegação observável. Usar um estado do fluxo compartilhado entre as etapas, sem dados pessoais em parâmetros ou logs. Não persistir dados pessoais por padrão.

**Aceite:** erros são apresentados junto aos campos; entradas fora dos limites não avançam. Voltar da revisão preserva o formulário durante a sessão, e trocar empresa ou encerrar o fluxo limpa os dados correspondentes.

### R06 — Revisão não cria reserva — P0

**Evidência:** `src/app/(schedule)/confirmation.tsx:246–305`, `:348–360`, `:434–436` e `:454`.

`finalizar()` verifica somente presença de parâmetros e exibe “Integração pendente”. Não executa requisição e não navega para sucesso, o que evita anunciar uma criação nesse ponto. Porém, `enviando` nunca muda: o bloqueio já escrito não tem efeito real. A empresa e o endereço continuam fixos.

**Correção recomendada:** validar o estado do fluxo com Zod e criar a reserva pelo endpoint público. Usar os dados carregados da empresa/serviço no resumo e o slot selecionado como origem do instante. Controlar submissão em andamento, bloquear toques repetidos e liberar nova ação de acordo com o resultado.

O body deve conter somente `serviceId`, `customerName`, `customerEmail`, `customerPhone`, `startAt` e, opcionalmente, `notes`. Não espalhar parâmetros de navegação no body: `companyId`, `endAt`, preço, duração e status não são aceitos como propriedades adicionais.

`formatarData()` aceita partes numéricas sem confirmar que formam uma data real; JavaScript pode normalizar uma data impossível. Validar o estado antes de renderizar e usar o fuso da empresa para a apresentação dos instantes.

Remover a promessa de envio de e-mail: o contrato não garante notificações. A mensagem de sucesso deve significar apenas que a reserva foi criada.

**Aceite:** somente `201` com resposta válida leva à conclusão. Falhas não apagam o formulário desnecessariamente nem apresentam reserva confirmada.

### R07 — Rota de sucesso inconsistente e sem comprovação — P0

**Evidência:** `src/app/(schedule)/_layout.tsx:36` e `src/app/(schedule)/sucess.tsx:124–180`.

O layout declara `success`, mas a rota real gerada é `/sucess`. A tela exibe sucesso sem consultar estado ou exigir resultado da criação. Não mostra ID nem horários do agendamento.

**Correção recomendada:** padronizar arquivo e referências para `success.tsx`. Permitir a apresentação da conclusão somente quando existir resultado de uma criação aceita. Guardar `appointment.id`, `serviceId`, `startAt`, `endAt` e `status` retornados, usando o término do servidor como definitivo. Nome da empresa/serviço pode vir do contexto carregado: esses nomes não vêm na resposta de criação.

Se a tela for aberta diretamente ou após perda do estado, explicar que não há confirmação disponível e oferecer retorno à entrada. Não simular consulta por ID: ela não existe publicamente. Ao encerrar, limpar o rascunho e ajustar o histórico para que “voltar” não reabra uma confirmação apta a reenviar o mesmo fluxo. `replace` isolado não comprova que todas as etapas anteriores foram removidas; testar o comportamento final.

**Aceite:** abrir `/success` sem resultado válido nunca anuncia sucesso. A conclusão mostra dados do servidor e não oferece operações sem endpoint.

### R08 — Abertura direta, retorno e links externos — P1

**Evidência:** `src/app/index.tsx:4`, índices do dashboard, usos de `router.back()` nas etapas, `app.json` e ausência de rota `agendar/[companyId]`.

As telas não possuem guardas completas do estado do agendamento. Os tipos genéricos de `useLocalSearchParams` não validam valores recebidos em execução. IDs, nomes, preços e datas em parâmetros podem ser alterados externamente. Acesso direto às etapas não garante histórico para `router.back()`.

**Correção recomendada:** estabelecer pré-requisitos por etapa: empresa para serviços; serviço para disponibilidade; slot para dados pessoais; rascunho válido para revisão; resultado aceito para sucesso. Redirecionar para a primeira etapa incompleta e oferecer retorno seguro à entrada quando não houver histórico. Adotar destinos internos explícitos e verificar parâmetros externos com Zod.

Existem dois índices associados à URL `/`: raiz e dashboard. Essa sobreposição deve ser eliminada ou ter comportamento explicitamente validado. Recomenda-se manter `/` como entrada de agendamento e dar à tela institucional inicial um caminho próprio, como `/home`, atualizando os botões correspondentes.

O `scheme` `agendeimobile` já está configurado, mas não basta para associar links HTTPS do frontend ao app. Para receber `/agendar/<companyId>`, adicionar uma entrada correspondente e encaminhá-la ao mesmo fluxo de validação usado pelo campo de link. A abertura automática de HTTPS exige configuração de Android App Links/iOS Universal Links e associação no domínio. Registrar essa dependência externa para a implantação; não é necessária para a alternativa de colar o link manualmente. Referência: [links de entrada no Expo](https://docs.expo.dev/linking/into-your-app/).

**Aceite:** abertura com app fechado/aberto, acesso direto, recarga web e retorno do sistema não pulam pré-requisitos nem reutilizam dados de outra empresa.

### R09 — Página institucional incompleta — P2

**Evidência:** `src/app/(dashboard)/about.tsx:145–146`.

“Onde estarão as informações da equipe” é um placeholder. Substituir por conteúdo real aprovado ou retirar a seção. Esse conteúdo não exige integração com os três endpoints públicos.

## 4. Camada de integração proposta

### Configuração e interfaces

- Definir URL base pública do backend por ambiente, por exemplo `EXPO_PUBLIC_API_URL`, sem credenciais. Não acrescentar `/api` aos caminhos documentados.
- Em aparelho físico, `localhost` aponta para o próprio aparelho: usar endereço acessível do servidor. Em produção, usar HTTPS.
- Manter cliente HTTP, tipos, schemas Zod e estado do fluxo fora de `src/app`, que deve conter rotas/layouts.
- Usar interfaces/tipos TypeScript explícitos e validação Zod nas fronteiras, conforme `AGENTS.md`; não usar `any`. Zod ainda não aparece nas dependências inspecionadas. Sua instalação futura deve seguir o procedimento do projeto, sem adicionar dependências nesta entrega documental.
- Representar separadamente empresa/serviços, slot, rascunho, payload da criação, resposta e erro `{ message }`. Não converter números em strings de exibição no modelo compartilhado.
- Guardar em memória o rascunho e a resposta durante a sessão. Sem persistência implementada, reinício/recarga deve recuperar uma entrada segura, não inventar confirmação.

### Matriz das chamadas

| Operação | Entrada | Resposta esperada | Comportamento da interface |
| --- | --- | --- | --- |
| `GET /public/companies/:companyId` | UUID v7 no caminho; sem body | `200`, `{ company }` | Mostrar nome, fuso, expediente e serviços; tratar lista vazia. |
| `GET /public/companies/:companyId/availability` | Somente `serviceId` UUID v7 e `date` real `YYYY-MM-DD` na query | `200`, `{ slots }` | Mostrar opções retornadas ou ausência de horários; descartar seleção antiga. |
| `POST /public/companies/:companyId/appointments` | JSON estrito; `Content-Type: application/json` | `201`, `{ appointment }` | Guardar resultado e navegar para sucesso. |

Não enviar token/cookie de sessão por exigência do fluxo: as três operações são públicas. Não chamar `/booking-link`, não buscar lista pública de empresas e não usar `POST /appointments`.

### Datas e dependências entre etapas

1. O link determina `companyId`; a consulta determina `timeZone` e os serviços disponíveis.
2. O serviço escolhido determina `serviceId`; data escolhida e serviço determinam a consulta de slots.
3. O slot escolhido fornece `startAt` original, com fuso explícito. Não reconstruir o instante a partir de `HH:mm` nem aplicar offset fixo.
4. A revisão agrega o rascunho sem transformá-lo diretamente em body; o payload é construído apenas com os campos aceitos.
5. A criação devolve o ID e o término definitivo. Mudanças na duração do serviço podem alterar o término em relação à consulta anterior.

Ao trocar empresa, descartar dados dependentes da anterior. Ao trocar serviço ou dia, limpar o slot. Preservar dados pessoais durante correções de horário dentro da mesma sessão e limpá-los ao abandonar/concluir o fluxo.

## 5. Tratamento de erros obrigatório

Tratar status HTTP junto com `message`. O mesmo status pode exigir ações diferentes; usar os textos exatos de `integracao.md` no mapeamento técnico e apresentar mensagens claras ao cliente.

| Resposta/situação | Ação recomendada |
| --- | --- |
| `404` — `Empresa não encontrada` | Interromper o fluxo dessa empresa e permitir informar outro link. |
| `404` — `Serviço não encontrado` | Recarregar serviços e invalidar serviço/slot anteriores. |
| `404` — `Não encontrado` | Verificar caminho/base da integração; não confundir automaticamente com empresa inexistente. |
| `409` — `Já existe um agendamento neste horário` | Invalidar slot, recarregar disponibilidade e pedir outra seleção, preservando formulário. |
| `422` — `Dados inválidos` | Revalidar UUIDs, query e body; mostrar erros locais por campo. O backend não devolve lista de erros por campo. |
| `422` — `A data do agendamento não pode estar no passado` | Atualizar disponibilidade e solicitar novo horário. |
| `422` — `O horário final deve ser posterior ao horário inicial` | Atualizar dados do serviço e tratar inconsistência; não mandar `endAt` calculado pelo cliente. |
| `422` — `O agendamento não pode terminar no dia seguinte` | Solicitar outro horário e atualizar a disponibilidade. |
| `422` — `Não há agenda cadastrada para este dia` | Oferecer outra data e atualizar a consulta. |
| `422` — `O agendamento está fora do horário de funcionamento` | Invalidar o slot e recarregar horários. |
| `500` — `Erro interno do servidor` | Exibir falha; não apresentar sucesso. |
| Falha de rede em consulta | Mostrar erro e ação de tentar novamente, sem confundir com lista vazia. |
| Timeout/falha de rede após envio do `POST` | Informar que não foi possível confirmar o resultado. Não reenviar automaticamente e não anunciar sucesso. |
| Resposta inesperada/malformada | Tratar como falha de integração, sem preencher a interface com dados fictícios. |

A consulta de disponibilidade não reserva o horário. O servidor revalida na criação. Não existe chave de idempotência nem consulta pública para reconciliar uma criação com resposta perdida. Um `409` em tentativa posterior não prova que a reserva anterior pertence ao cliente. Se houver nova tentativa manual, deixar claro o resultado incerto anterior.

## 6. Qualidade técnica e experiência mobile

### T01 — Efeito assíncrono durante renderização — P1

**Evidência:** `src/hooks/useSafeColor.ts:6`.

`NavigationBar.setVisibilityAsync('hidden')` é executado a cada renderização do hook e sua Promise não recebe tratamento. Mover a operação para um efeito, aplicar controle de plataforma compatível com a API e tratar falhas. Verificar se ocultar a barra do sistema é realmente desejado em todas as telas. A API tem finalidade Android; não afirmar falha em iOS sem teste. Referência: [NavigationBar, SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/navigation-bar/).

**Aceite:** a renderização não dispara repetidamente o efeito; falhas não produzem rejeições não tratadas; navegação do sistema permanece utilizável.

### T02 — Layout, teclado e áreas seguras — P2, a validar em dispositivo

**Evidência:** `src/components/layout.tsx:53–60`, `src/components/layout-noimages.tsx:43–50`, posicionamento absoluto em dashboard/about e layouts dos grupos.

Os wrappers posicionam conteúdo absolutamente com largura/altura totais da janela, enquanto os layouts também reservam espaço superior. Isso cria risco de extrapolar o espaço útil. A página institucional não tem rolagem para seu conteúdo extenso; textos maiores podem não caber. Login/link não possuem o mesmo tratamento explícito de teclado que `personal-info`.

Revisar o uso de `flex`, áreas seguras superior/inferior, rolagem e teclado em telas pequenas. Verificar se os providers distribuídos entre grupos são necessários, sem pressupor que o Expo Router não forneça contexto. Não classificar recorte ou sobreposição como reproduzidos sem teste visual.

**Aceite:** campos e ações continuam acessíveis com teclado aberto, fonte ampliada e diferentes áreas seguras, tanto no Android quanto no iOS.

### T03 — Estados desabilitados e acessibilidade — P2

**Evidência:** `services.tsx:406–415` altera opacidade, mas não passa `disabled`; `datetime.tsx:442` e `:484` deixam o componente acionável e fazem bloqueio dentro do handler.

Aplicar `disabled` e estado de acessibilidade quando ações estiverem indisponíveis. Identificar seleção de serviço/horário e fornecer rótulos para botões apenas com ícones. Dias passados devem ser distinguíveis visualmente e pelo leitor de tela. Erros de formulário não devem depender apenas de alerta global.

**Aceite:** leitor de tela comunica rótulos e estados; botões sem pré-requisitos não parecem ações disponíveis.

### T04 — Ferramentas e manutenção — P2

- Não há configuração ESLint nem dependências correspondentes declaradas. `npx expo lint` tenta iniciar a configuração em vez de auditar. Preparar lint em uma alteração técnica própria e então revisar os avisos.
- `package.json` declara Expo `~58.0.20`, enquanto o lockfile inspecionado declara `^58.0.19` na raiz e a instalação local informa `58.0.19`. Sincronizar manifesto, lockfile e instalação com ferramentas compatíveis do SDK. Essa divergência não demonstra, isoladamente, falha de runtime.
- `package.json:42` aponta `reset-project` para `scripts/reset-project.js`, que não foi encontrado. Remover o script e a orientação correspondente do README ou fornecer uma implementação adequada; não executá-lo como parte da integração.
- Há imports sem uso, como `Fonts`, `Colors` e `StatusBar` no layout raiz, e imports de navegação/área segura redundantes nos layouts. Limpar após configuração de lint, sem misturar isso com mudanças funcionais críticas.
- A página `about` contém conteúdo provisório e o README ainda descreve o template, sem instruções específicas para o backend. Atualizar instruções de configuração quando a integração existir.

## 7. Sequência recomendada de correção

| Etapa | Entrega | Dependência/critério de conclusão |
| --- | --- | --- |
| 1 | Corrigir rotas, entrada pública e nome `success`; definir caminho próprio do dashboard | Nenhuma ação aponta para tela inexistente; login não bloqueia agendamento. |
| 2 | Introduzir tipos, schemas Zod, cliente HTTP e estado compartilhado | Configuração por ambiente; payloads tipados; dados pessoais fora das URLs. |
| 3 | Integrar link/empresa/serviços | Empresa real carregada; sem mocks; listas vazias tratadas. |
| 4 | Integrar calendário/disponibilidade | Fuso correto; slots reais; proteção contra respostas antigas. |
| 5 | Alinhar validações e revisão | Limites do contrato e campos obrigatórios respeitados; resumo consistente. |
| 6 | Integrar criação e conclusão | Sucesso somente após `201`; erros e resultado incerto tratados; submissão duplicada bloqueada. |
| 7 | Guardas, histórico e abertura de links | Acesso direto/retorno seguros; links HTTPS validados após configuração de domínio. |
| 8 | Ajustes mobile, acessibilidade e ferramentas | Validação Android/iOS, lint e TypeScript; remoção de conteúdo provisório. |

Autenticação, histórico, cancelamento, remarcação, endereço da empresa e notificações devem permanecer fora da integração pública inicial, salvo novo contrato explícito.

## 8. Casos de teste e critérios de aceite

### Navegação

- Abrir o app normalmente e iniciar uma reserva sem login.
- Verificar todos os botões e destinos do mapa de rotas, incluindo página institucional e retorno.
- Abrir diretamente serviços, data, dados pessoais, revisão e sucesso sem estado: redirecionar com segurança, sem falso sucesso.
- Voltar para editar serviço/data e verificar invalidação do slot; voltar da revisão e preservar formulário.
- Concluir e pressionar voltar no Android/gesto de retorno: não reabrir um formulário capaz de reenviar a reserva concluída.
- Abrir link com app fechado e aberto; trocar para link de outra empresa sem reaproveitar dados anteriores.
- Verificar `/`, rota própria do dashboard e recarga web, sem resolução ambígua.

### Empresa e disponibilidade

- Link vazio, URL inválida, caminho incorreto, UUID inválido e UUID de versão diferente de 7.
- Empresa inexistente, empresa sem serviços, descrição/preço nulos e expediente vazio.
- Serviços com mesmo nome e IDs diferentes: seleção deve usar ID.
- Data impossível, dia anterior, dia sem expediente e dia atual sem horários futuros.
- Empresa com abertura `09:07`: apresentar slots como `09:07`, `09:22` quando retornados, sem arredondamento local.
- Troca rápida de dia/serviço com respostas em ordem invertida: somente a consulta vigente altera a tela.
- Aparelho em fuso diferente da empresa, próximo da meia-noite e em data com mudança de offset, quando aplicável.

### Dados e criação

- Nome vazio após `trim`, nomes com 1/150 caracteres e rejeição acima de 150.
- E-mail vazio, formato inválido, endereço válido no limite e acima de 254 caracteres.
- Telefone com máscara documentada, número sem DDD, DDD/prefixo inválido e entrada longa que hoje seria truncada.
- Observações omitidas/null e, se houver campo, limite de 2.000 após `trim`.
- Garantir ausência de propriedades extras no body e query; IDs devem ser UUID v7.
- Garantir que `startAt` enviado é o do slot, sem reconstrução local; respeitar fuso explícito e precisão de minutos.
- `201` válido: mostrar ID e horários definitivos; `endAt` retornado prevalece sobre qualquer estimativa.
- Cada erro da matriz da seção 5, inclusive `409` por disputa entre clientes e horário vencido entre consulta e envio.
- Toque duplo: uma única submissão em andamento. Timeout: nenhum reenvio automático e nenhuma mensagem de sucesso.
- Resposta malformada ou falha de conexão: exibir erro, sem substituir por mocks.

### Dispositivos e verificações técnicas

- Executar lint e `tsc --noEmit` após as correções. TypeScript aprovado não substitui teste de navegação: a rota relativa incorreta atual passou nessa verificação.

## 9. Verificações realizadas nesta auditoria

| Verificação | Resultado |
| --- | --- |
| Leitura de telas, layouts, hooks e configuração | Concluída; achados acima derivados do código local. |
| Cruzamento com `integracao.md` | Concluído; o documento foi tratado como contrato do backend. |
| `npx --no-install tsc --noEmit` | Aprovado, sem diagnósticos. |
| `npx --no-install expo lint` | Bloqueado: ESLint não configurado. A instalação automática foi recusada para não alterar dependências/configuração durante a auditoria. |
| Testes em dispositivo/backend | Não executados; cenários propostos na seção 8. |

O escopo desta entrega é documentação. Nenhuma das correções descritas foi aplicada ao aplicativo.

## 10. Referências

- [Contrato local de integração](./integracao.md).
- [Instruções locais do projeto](./AGENTS.md), incluindo uso de Zod e tipos TypeScript sem `any`.
- [Referência Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/).
- [Índice oficial Expo para consulta técnica](https://docs.expo.dev/llms.txt).
- [Notação de rotas](https://docs.expo.dev/router/basics/notation/).
- [Abertura de links no aplicativo](https://docs.expo.dev/linking/into-your-app/).
- [NavigationBar no SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/navigation-bar/).
