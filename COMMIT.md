fix(schedule): ajusta rolagem dos formulários com o teclado aberto

- Usa KeyboardAwareScrollView nas telas de link e dados pessoais.
- Aciona a rolagem ao focar os campos de dados pessoais, com margem extra de 50 acima do teclado.
- Ajusta o alinhamento da tela de link e a cor do texto do input.
- Altera o redirecionamento inicial para a seleção de serviços do agendamento.
- Adiciona a configuração do ESLint para Expo e atualiza as dependências e o lockfile.

Validação: TypeScript sem erros; lint sem erros, com 11 avisos existentes.
