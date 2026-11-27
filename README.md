# Agendei Mobile

Aplicativo de agendamento público que permite ao cliente acessar a agenda de uma empresa, escolher um serviço e um horário disponível e enviar seus dados para confirmar a reserva. Desenvolvido com Expo, React Native, Expo Router e TypeScript, com validação de dados usando Zod.

## Como executar

**Requisitos:** Node.js 22.13 ou superior, npm e um dispositivo ou emulador compatível com Expo SDK 58. É necessário ter acesso ao backend do Agendei e a uma empresa cadastrada com serviços disponíveis.

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente em um arquivo `.env` na raiz do projeto:

   ```dotenv
   EXPO_PUBLIC_API_URL=https://api.exemplo.com
   EXPO_PUBLIC_FRONTEND_URL=https://www.exemplo.com
   ```

   Substitua os valores pelas origens reais. `EXPO_PUBLIC_API_URL` identifica o backend; `EXPO_PUBLIC_FRONTEND_URL`, a origem dos links de agenda aceitos no campo de entrada. Use somente a origem, sem caminhos como `/api`, parâmetros ou credenciais. Em desenvolvimento, o endereço do backend deve ser acessível pelo dispositivo; `localhost` no celular aponta para o próprio celular.

   As variáveis `EXPO_PUBLIC_*` são incluídas no aplicativo e **não devem conter segredos**. Em produção, use HTTPS.

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm start
   ```

   Abra o projeto com Expo Go, uma build de desenvolvimento ou um emulador. Também é possível usar `npm run android`, `npm run ios` ou `npm run web`.

## Fluxo de agendamento

1. Informe o link da empresa ou abra um link direto de agendamento.
2. Selecione um serviço e consulte os horários disponíveis para uma data.
3. Informe nome, e-mail e telefone.
4. Revise os dados e envie a solicitação. A tela de sucesso é exibida após a confirmação da API.

As datas e os horários são apresentados no fuso da empresa. O estado da reserva é mantido em memória durante o fluxo; ele não é persistido após o encerramento do aplicativo. Se o resultado do envio for incerto, confira com a empresa antes de tentar novamente para evitar reservas duplicadas.

Login e cadastro ainda não estão disponíveis. O fluxo público de agendamento não exige autenticação.

## Rotas do aplicativo

O Expo Router organiza as telas em `src/app/`. Os nomes entre parênteses indicam grupos de rotas e não fazem parte da URL pública.

| Caminho                | Descrição                                                      |
| ---------------------- | -------------------------------------------------------------- |
| `/`                    | Redireciona para a entrada do link de agendamento.             |
| `/link-page`           | Recebe o link da agenda e consulta a empresa.                  |
| `/agendar/[companyId]` | Abre diretamente a agenda da empresa identificada por UUID v7. |
| `/services`            | Exibe os serviços da empresa para seleção.                     |
| `/datetime`            | Consulta e permite selecionar data e horário.                  |
| `/personal-info`       | Coleta e valida os dados pessoais do cliente.                  |
| `/confirmation`        | Apresenta o resumo e envia a reserva.                          |
| `/success`             | Exibe os dados da reserva confirmada.                          |
| `/home` e `/about`     | Página inicial institucional e informações sobre o aplicativo. |
| `/login` e `/register` | Informam que login e cadastro estão indisponíveis.             |

As etapas de agendamento verificam seus pré-requisitos e redirecionam quando informações necessárias estão ausentes.

### Links de agendamento

O campo de entrada aceita links no formato `https://www.exemplo.com/agendar/<companyId>`, desde que a origem corresponda a `EXPO_PUBLIC_FRONTEND_URL`. O identificador deve ser um UUID v7. O aplicativo também possui o esquema `agendeimobile://agendar/<companyId>` para abertura direta.

Para que links HTTPS abram o aplicativo instalado, ainda é necessário configurar [Android App Links](https://docs.expo.dev/linking/android-app-links/) e [iOS Universal Links](https://docs.expo.dev/linking/ios-universal-links/), incluindo domínio, identificadores do aplicativo e arquivos de associação. Essa configuração requer uma nova build. O esquema personalizado, sozinho, não associa links HTTPS ao aplicativo.

A versão web usa saída estática. A abertura direta e a atualização de rotas dinâmicas como `/agendar/<companyId>` exigem configuração apropriada de hospedagem ou servidor; consulte a documentação do Expo sobre [rotas dinâmicas na renderização estática](https://docs.expo.dev/router/web/static-rendering/#dynamic-routes).

## Integração com o backend

O fluxo utiliza três endpoints públicos, sem prefixo `/api`:

| Método | Rota                                        | Finalidade                                        |
| ------ | ------------------------------------------- | ------------------------------------------------- |
| `GET`  | `/public/companies/:companyId`              | Consulta empresa, serviços e expediente.          |
| `GET`  | `/public/companies/:companyId/availability` | Consulta horários disponíveis por serviço e data. |
| `POST` | `/public/companies/:companyId/appointments` | Cria o agendamento.                               |

Consulte [integracao.md](./integracao.md) para detalhes de parâmetros, respostas e erros. A auditoria e as recomendações registradas durante a integração estão em [ajustes.md](./ajustes.md).

## Estrutura principal

- `src/app/`: telas e layouts de navegação.
- `src/components/`: componentes e layouts compartilhados.
- `src/contexts/`: estado compartilhado do fluxo de agendamento.
- `src/services/`: integração com a API, validações e regras do fluxo.
- `src/hooks/` e `src/constants/`: utilitários e constantes da interface.

## Verificações

```bash
npx tsc --noEmit
npx expo lint
```

O lint requer a configuração e as dependências do ESLint; o Expo pode oferecer configurá-las na primeira execução.
