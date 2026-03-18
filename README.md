# Innovation - v6.0.0

O Innovation é uma plataforma White Label completa para atendimento via WhatsApp, focada em produtividade e organização para equipes de vendas e suporte.

## 🚀 Novidades da Versão 6.0.0

- **Revitalização da Interface de Autenticação**: Reformulação visual moderna e limpa para as telas de Login, Cadastro e Recuperação de Senha.
- **Tema Adaptativo Inteligente**: Suporte nativo a temas **Claro** e **Escuro** em toda a área de login e menus, garantindo conforto visual e legibilidade em qualquer ambiente.
- **Responsividade Mobile Aprimorada**: Layouts reconstruídos para se adaptarem perfeitamente a qualquer dispositivo (Mobile, Tablet e Desktop).
- **Correções de UI/UX**: Resolução de problemas de visibilidade em ícones de senha e seletores de idioma, garantindo contraste perfeito.
- **Otimização de Performance**: Limpeza de código legado e correção de imports corrompidos de ícones.

## 📁 Estrutura do Projeto

O repositório do Innovation possui 3 pastas principais:
- **backend**: Servidor em Express com toda a lógica de negócio e banco de dados.
- **frontend**: Aplicação React.js que gerencia a interface do usuário.
- **instalador**: Ferramenta para clonagem e instalação automática em servidores home.

Link para o repositório do instalador:
- [Instalador](https://github.com/innovation-org/instalador)

## 📋 Pré-requisitos

```
- Node.js v20.x
- PostgreSQL (V12+)
- NPM (Latest)
- Docker & Docker Compose
- Redis
```

## 🔧 Instalação e Configuração

Consulte as instruções detalhadas dentro de cada pasta para configurar o `.env`.

### Dependências
```bash
cd backend/ && npm install --force
cd ../frontend/ && npm install --force
```

### Rodando Localmente
```bash
# Terminal 1 - Backend
cd backend/ && npm run dev:server

# Terminal 2 - Frontend
cd frontend/ && npm start
```

## 📦 Implantação em Produção

Certifique-se de estar logado com o usuário de deploy:

```bash
su - deploy
git pull
# Seguir passos de build documentados na pasta build/
```

## 🛠️ Tecnologias Utilizadas

* [Express](https://expressjs.com/pt-br/) - Backend Framework
* [React](https://react.dev/) - Frontend Framework
* [NPM](https://www.npmjs.com/) - Package Manager
* [Material UI](https://mui.com/) - UI Components

## 📌 Versão
**6.0.0** (2026)

---
⌨️ com ❤️ por [Innovation](https://innovation.com) 😊
Todos os direitos reservados.
