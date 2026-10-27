# Welcome to your Expo app 👋

## Links de agendamento

O aplicativo aceita o caminho `/agendar/<companyId>`, com UUID v7, inclusive pelo esquema `agendeimobile://agendar/<companyId>`. Também é possível colar no aplicativo um link HTTPS da origem configurada em `EXPO_PUBLIC_FRONTEND_URL`; configure `EXPO_PUBLIC_API_URL` separadamente, conforme `.env.example`.

Para que links HTTPS do site abram o aplicativo instalado, a publicação ainda precisa configurar [Android App Links](https://docs.expo.dev/linking/android-app-links/) e [iOS Universal Links](https://docs.expo.dev/linking/ios-universal-links/): definir o domínio real, o pacote Android e o bundle identifier iOS no app, e publicar no domínio os arquivos de associação exigidos, com as assinaturas corretas. Isso exige uma nova build e acesso à configuração do domínio; o esquema personalizado, por si só, não associa links HTTPS. Teste a abertura com o app fechado e aberto em ambas as plataformas.

A versão web está configurada para saída estática. URLs dinâmicas desconhecidas durante a build, incluindo `/agendar/<companyId>`, exigem configuração de hospedagem ou servidor para abertura direta e recarga; não há listagem pública de empresas para pré-gerar esses caminhos. Consulte a documentação do Expo sobre [rotas dinâmicas na renderização estática](https://docs.expo.dev/router/web/static-rendering/#dynamic-routes).

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
