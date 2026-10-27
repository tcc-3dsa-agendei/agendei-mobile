# Integração mobile — agendamento público

Este guia descreve o contrato implementado para o cliente consultar uma empresa, escolher um serviço e reservar um horário pelo aplicativo. Todas as três rotas abaixo são públicas: não exigem cadastro do cliente, login, token ou cookie de sessão.

## 1. Configuração e fluxo

Configure no aplicativo a URL base do backend, por exemplo `http://localhost:3333` em desenvolvimento. Em um dispositivo físico, use um endereço do servidor acessível pelo aparelho; `localhost` aponta para o próprio dispositivo. Em produção, use a URL HTTPS do backend.

Os caminhos deste guia são relativos à URL base e **não possuem o prefixo `/api`**. Envie `Content-Type: application/json` no `POST`. As respostas de sucesso e erro têm corpo JSON.

O aplicativo precisa receber previamente o `companyId`, que é o identificador da empresa (ID do usuário da empresa), em formato **UUID v7**. O link de reserva existente tem o formato `<FRONTEND_URL>/agendar/<companyId>`; o app pode extrair o ID desse caminho ao implementar a abertura do link. Esse endereço é uma página do frontend, não uma rota da API. Não existe uma rota pública para listar empresas nem é necessário chamar a rota administrativa `/booking-link` no fluxo do cliente.

Fluxo sugerido:

1. Receber o `companyId` e consultar os dados públicos da empresa.
2. Exibir os serviços e guardar o `id` do serviço escolhido como `serviceId`.
3. Selecionar uma data no fuso da empresa e consultar a disponibilidade.
4. Exibir os horários retornados e guardar o `startAt` do horário escolhido.
5. Coletar nome, e-mail, telefone e, opcionalmente, observações.
6. Criar a reserva e apresentar a confirmação somente após receber `201`.

Os IDs e as datas dos exemplos são ilustrativos. Substitua-os por uma empresa e um serviço existentes e por um horário futuro retornado pela API.

## 2. Resumo das rotas

| Método | Caminho exato | Entrada | Sucesso |
| --- | --- | --- | --- |
| `GET` | `/public/companies/:companyId` | `companyId` no caminho; sem body | `200`, objeto `company` |
| `GET` | `/public/companies/:companyId/availability` | `companyId` no caminho; `serviceId` e `date` na query; sem body | `200`, array `slots` |
| `POST` | `/public/companies/:companyId/appointments` | `companyId` no caminho; body JSON descrito abaixo | `201`, objeto `appointment` |

Em todas as rotas, `:companyId` deve ser substituído por um UUID v7 válido, sem os dois-pontos. `serviceId` também exige UUID v7.

## 3. Consultar empresa, serviços e expediente

```http
GET /public/companies/019c0000-0000-7000-8000-000000000001
```

**Body:** nenhum. **Query:** nenhuma necessária.

### Sucesso — `200 OK`

```json
{
  "company": {
    "name": "Salão Exemplo",
    "timeZone": "America/Sao_Paulo",
    "schedules": [
      {
        "weekDay": 1,
        "startTime": "09:00",
        "endTime": "10:00"
      }
    ],
    "services": [
      {
        "id": "019c0000-0000-7000-8000-000000000002",
        "name": "Corte de cabelo",
        "description": "Corte e finalização",
        "durationInMinutes": 30,
        "price": 50
      }
    ]
  }
}
```

| Campo | Tipo e significado |
| --- | --- |
| `company.name` | String com o nome da empresa. |
| `company.timeZone` | String com o fuso IANA configurado no backend. Use-a para exibir datas e horários. |
| `company.schedules` | Array de dias de atendimento, ordenado por `weekDay`. Pode ser vazio. |
| `schedules[].weekDay` | Inteiro: `0` domingo, `1` segunda, `2` terça, `3` quarta, `4` quinta, `5` sexta e `6` sábado. |
| `schedules[].startTime` / `endTime` | Strings `HH:mm`, no fuso de `company.timeZone`. Representam o expediente semanal. |
| `company.services` | Array de serviços, ordenado por nome e, em caso de empate, ID. Sem paginação; pode ser vazio. |
| `services[].id` | UUID v7 a enviar como `serviceId` nas próximas chamadas. |
| `services[].name` | String com o nome do serviço. |
| `services[].description` | String ou `null`. |
| `services[].durationInMinutes` | Inteiro entre `5` e `1440`, usado pelo servidor para calcular o término da reserva. |
| `services[].price` | Número ou `null`. O contrato não retorna um campo de moeda; `null` não significa preço zero. |

O expediente semanal não informa os horários livres. Consulte a rota de disponibilidade para oferecer uma seleção de horários. Se não houver serviços, o app não poderá prosseguir com uma reserva.

### Erros esperados

| HTTP | `message` exata | Quando ocorre |
| --- | --- | --- |
| `404` | `Empresa não encontrada` | O UUID é válido, mas a empresa não existe. |
| `422` | `Dados inválidos` | `companyId` não é UUID v7 válido. |
| `500` | `Erro interno do servidor` | Falha inesperada no backend. |

## 4. Consultar horários disponíveis

```http
GET /public/companies/019c0000-0000-7000-8000-000000000001/availability?serviceId=019c0000-0000-7000-8000-000000000002&date=2030-01-07
```

**Body:** nenhum.

| Query obrigatória | Tipo | Regra |
| --- | --- | --- |
| `serviceId` | String | UUID v7 de um serviço pertencente à empresa do caminho. |
| `date` | String | Data real no formato exato `YYYY-MM-DD`, interpretada como o dia no fuso da empresa. Não envie horário ou offset neste campo. |

Envie somente esses dois parâmetros de query; o schema rejeita campos adicionais.

### Sucesso — `200 OK`

```json
{
  "slots": [
    {
      "startAt": "2030-01-07T12:00:00.000Z",
      "endAt": "2030-01-07T12:30:00.000Z"
    },
    {
      "startAt": "2030-01-07T12:15:00.000Z",
      "endAt": "2030-01-07T12:45:00.000Z"
    },
    {
      "startAt": "2030-01-07T12:30:00.000Z",
      "endAt": "2030-01-07T13:00:00.000Z"
    }
  ]
}
```

`slots` contém os intervalos disponíveis, ordenados pelo instante de início. `startAt` e `endAt` são strings ISO 8601 em UTC, com sufixo `Z`. No exemplo, `12:00Z` corresponde a `09:00` em `America/Sao_Paulo` nessa data.

Regras aplicadas pelo backend:

- Os inícios seguem uma grade de **15 minutos a partir da abertura do expediente**. Se a abertura for `09:07`, a grade será `09:07`, `09:22`, `09:37` etc.
- A duração inteira do serviço precisa caber no expediente e no mesmo dia local.
- O instante de início precisa ser estritamente futuro.
- Qualquer agendamento não cancelado da mesma empresa bloqueia sobreposições, inclusive de outros serviços. Uma reserva pode começar exatamente quando outra termina.
- Os intervalos retornados são alternativas: podem se sobrepor entre si, como no exemplo acima.

Quando não há horários disponíveis, a resposta continua sendo **`200 OK`**:

```json
{
  "slots": []
}
```

Isso ocorre em dias sem expediente, datas passadas, quando a duração não cabe no expediente, quando todos os horários estão ocupados ou quando os horários do dia já passaram. Mostre um estado de “nenhum horário disponível” e permita escolher outra data ou serviço.

A consulta não bloqueia nem reserva o horário. A criação revalida a disponibilidade.

### Erros esperados

| HTTP | `message` exata | Quando ocorre |
| --- | --- | --- |
| `404` | `Empresa não encontrada` | A empresa não existe. |
| `404` | `Serviço não encontrado` | O serviço não existe ou pertence a outra empresa. |
| `422` | `Dados inválidos` | UUID inválido, query obrigatória ausente, parâmetro adicional ou data inválida, como `2030-02-30`. |
| `500` | `Erro interno do servidor` | Falha inesperada no backend. |

## 5. Criar o agendamento público

```http
POST /public/companies/019c0000-0000-7000-8000-000000000001/appointments
Content-Type: application/json
```

**Query:** nenhuma necessária. **Body JSON:**

```json
{
  "serviceId": "019c0000-0000-7000-8000-000000000002",
  "customerName": "Maria Silva",
  "customerEmail": "maria@example.com",
  "customerPhone": "11987654321",
  "startAt": "2030-01-07T12:00:00.000Z",
  "notes": "Primeira visita"
}
```

| Campo | Obrigatório | Tipo e validação |
| --- | --- | --- |
| `serviceId` | Sim | String UUID v7 de um serviço da empresa. |
| `customerName` | Sim | String; espaços nas extremidades são removidos. Deve conter de `1` a `150` caracteres após essa remoção. |
| `customerEmail` | Sim | String com e-mail válido, até `254` caracteres. Não aceita `null` nem string vazia. |
| `customerPhone` | Sim | String com telefone brasileiro válido, incluindo DDD. Exemplo: `11987654321`. A implementação também aceita a máscara `(11) 98765-4321` e normaliza esse exemplo para `11987654321`. |
| `startAt` | Sim | String ISO 8601 com `Z` ou offset explícito, com precisão de minutos. Prefira enviar exatamente o `startAt` recebido em `slots`. |
| `notes` | Não | String de até `2000` caracteres após remoção de espaços nas extremidades; aceita `null` ou omissão. |

Todos os campos obrigatórios rejeitam `null`. O body é estrito: propriedades adicionais, como `companyId`, `userId`, `endAt`, `status` ou `price`, causam `422`. A empresa é definida pelo caminho, o término pela duração atual do serviço e o status inicial pelo servidor.

Para `startAt`, `2030-01-07T12:00:00.000Z` e `2030-01-07T09:00:00-03:00` representam o mesmo instante e são aceitos. Segundos e frações, quando presentes, devem ser zero. Valores sem fuso, como `2030-01-07T09:00:00`, ou com segundos não nulos são inválidos.

### Sucesso — `201 Created`

```json
{
  "appointment": {
    "id": "019c0000-0000-7000-8000-000000000003",
    "serviceId": "019c0000-0000-7000-8000-000000000002",
    "startAt": "2030-01-07T12:00:00.000Z",
    "endAt": "2030-01-07T12:30:00.000Z",
    "status": "scheduled"
  }
}
```

Guarde o `appointment.id` e os horários retornados para a tela de confirmação. O servidor calcula `endAt` usando a duração do serviço no momento da criação; use o valor da resposta como definitivo. A resposta pública contém somente os cinco campos acima, sem dados pessoais do cliente, preço ou nome do serviço.

`scheduled` significa que o agendamento foi criado. Esse retorno não indica confirmação manual pela empresa nem comprova envio de e-mail ou SMS.

### Erros esperados

| HTTP | `message` exata | Quando ocorre / tratamento no app |
| --- | --- | --- |
| `404` | `Empresa não encontrada` | A empresa do caminho não existe. Interrompa o fluxo dessa empresa. |
| `404` | `Serviço não encontrado` | Serviço inexistente ou de outra empresa. Recarregue os serviços. |
| `409` | `Já existe um agendamento neste horário` | Há sobreposição com uma reserva não cancelada, inclusive se o horário ficou ocupado após a consulta. Recarregue a disponibilidade e peça outra seleção. |
| `422` | `Dados inválidos` | Body ausente/malformado, campo obrigatório ausente, campo extra, tipo ou formato inválido, limite de tamanho excedido ou `companyId` inválido. Corrija a entrada. |
| `422` | `A data do agendamento não pode estar no passado` | O início é anterior ou igual ao momento da validação no servidor, inclusive após aguardar outra requisição. Recarregue a disponibilidade. |
| `422` | `O horário final deve ser posterior ao horário inicial` | O intervalo calculado é inválido. O término é calculado pelo servidor; atualize os dados do serviço. |
| `422` | `O agendamento não pode terminar no dia seguinte` | Início e término ficam em dias diferentes no fuso da empresa. Escolha outro horário. |
| `422` | `Não há agenda cadastrada para este dia` | Não existe expediente para o dia da semana escolhido. Selecione outra data. |
| `422` | `O agendamento está fora do horário de funcionamento` | O intervalo não cabe no expediente ou o início não segue a grade de 15 minutos desde a abertura. Recarregue os horários. |
| `500` | `Erro interno do servidor` | Falha inesperada. Não apresente a reserva como confirmada. |

## 6. Tratamento de erros e comportamento no aplicativo

O formato de erro é sempre um objeto com `message`, por exemplo:

```json
{
  "message": "Já existe um agendamento neste horário"
}
```

Use o status HTTP junto com `message`: um mesmo status pode representar situações diferentes. Erros de schema, incluindo telefone e e-mail inválidos, chegam como `422` com `Dados inválidos`, sem uma lista de erros por campo. As mensagens internas específicas dos validadores não são devolvidas nesse caso. Um caminho inexistente retorna `404` com `Não encontrado`.

No aplicativo:

- Exiba datas e horários no fuso de `company.timeZone`, mesmo que o aparelho esteja em outro fuso. Monte `date` a partir do dia escolhido nesse fuso; não derive a data cortando uma string UTC com `toISOString().slice(0, 10)`.
- Preserve o instante de `slots[].startAt` ao enviar a reserva; não remonte a string usando apenas o horário exibido nem fixe o offset `-03:00` para todas as empresas e datas.
- Ao trocar serviço ou data, descarte o horário selecionado e consulte novamente a disponibilidade. O expediente retornado na primeira consulta serve apenas como referência semanal.
- Desabilite o botão de reserva enquanto o `POST` estiver em andamento para evitar envios duplicados.
- Em falhas de rede ou timeout, o app pode não saber se o servidor concluiu a reserva. A rota não implementa chave de idempotência nem oferece consulta pública para reconciliar o resultado; evite repetir automaticamente o `POST` e não anuncie sucesso sem receber `201`. Um `409` numa nova tentativa, isoladamente, não comprova que a tentativa anterior criou a reserva do cliente.

## 7. Limites do fluxo público

O backend oferece publicamente apenas consulta da empresa, consulta de disponibilidade e criação da reserva. Não há rota pública para consultar uma reserva pelo ID, listar reservas do cliente, remarcar, cancelar, excluir ou alterar status. As rotas administrativas de agendamentos exigem sessão da empresa e não fazem parte desta integração. A criação pública deve usar o caminho completo documentado neste guia; não existe `POST /appointments`.

## 8. Referências no repositório

- Consulte referências em https://github.com/tcc-3dsa-agendei/backend.git
