# Innovation IA - Desktop App

Este é o aplicativo Desktop do **Innovation IA** (antigo Omnius AI 6.0), desenvolvido com Electron.
Ele atua como um wrapper (encapsulador) do sistema CRM, permitindo que a aplicação rode nativamente como um programa no Windows e possa ser distribuída via instalador.

## Estrutura de Pastas e Arquivos

- `assets/` - Contém os ícones e logos usados no aplicativo e no instalador (ex: `installer-icon.ico`, `new-logo.png`).
- `BuilderConfig/` - Arquivos de configuração e scripts para a geração do instalador NSIS (`installer.nsh`, `generate-license.js`, `license.txt`).
- `electron-starter.js` - Ponto de entrada principal da aplicação Electron. Configura a janela do aplicativo, gerencia o ciclo de vida e a comunicação com o backend/frontend.
- `build-installer.js` - Script responsável por usar o `electron-winstaller` para gerar o arquivo `.exe` (instalador) final.
- `convert-icon.js` - Script utilitário caso haja necessidade de conversão de imagens para os formatos de ícone.

## Scripts Disponíveis

No `package.json`, temos os seguintes comandos principais:

- `npm start`: Inicia o aplicativo localmente em ambiente de desenvolvimento.
- `npm run package`: (se configurado) Prepara os binários do Electron.
- `npm run build`: Roda o script de construção do instalador (`build-installer.js`), que vai ler os arquivos da pasta e gerar um executável para distribuição.

## Notas Importantes

- **Segurança:** O repositório está configurado para ignorar arquivos `.env`, `node_modules` e artefatos de build gerados (`v8_context_snapshot.bin`, etc), mantendo o código limpo e seguro contra vazamentos de senhas ou chaves.
- **Tokens de IA:** Como especificado nos termos (arquivos de licença), o Innovation IA não inclui tokens de IA de terceiros; estes devem ser fornecidos pelo usuário.

---
*⌨️ com ❤️ por Innovation 😊 Todos os direitos reservados.*
