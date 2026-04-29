<div align="center">
  # Innovation IA - Plataforma de CRM & Automação de WhatsApp
  
  **Software independente, maduro e atualmente em uso em ambiente de produção.**
  
  ![Status](https://img.shields.io/badge/Status-Em%20Produção-success?style=for-the-badge)
  ![Plataforma](https://img.shields.io/badge/Plataforma-Desktop%20%7C%20Web-blue?style=for-the-badge)
</div>

---

## 🚀 Sobre o Projeto

O **Innovation IA** é uma solução completa e robusta de **Customer Relationship Management (CRM) focada na automação inteligente do WhatsApp**. Desenvolvido para escalar o atendimento e as vendas de empresas, este software atua de ponta a ponta na gestão do relacionamento com o cliente.

Não se trata apenas de uma prova de conceito, mas sim de uma plataforma corporativa madura, **100% pronta e em operação real em clientes**. O aplicativo desktop (empacotado via Electron) fornece aos usuários uma experiência fluida, estável e nativa, simplificando a complexidade de gerenciar múltiplos clientes, processar mídias e gerenciar compromissos diários.

## 🎯 Principais Funcionalidades

O sistema foi arquitetado para lidar com o fluxo de trabalho diário de alta demanda de equipes comerciais e de suporte, suportando de forma totalmente integrada:

- 🤖 **Automação Avançada de WhatsApp:** Fluxos inteligentes de mensagens, respostas assíncronas de alta performance e filas de atendimento, substituindo o trabalho manual repetitivo.
- 🎙️ **Processamento Nativo de Mídias:** Tratamento de ponta a ponta para envio e recebimento de **Áudios, Fotos e Documentos**, garantindo que as vendas e os atendimentos não percam o aspecto humano.
- 📅 **Gestão de Agendas e Funil de Vendas:** Sistema integrado (CRM) para controle total dos contatos, gestão de follow-ups, agendamentos, e acompanhamento em cada etapa do funil.
- 💻 **Aplicativo Desktop Multi-Plataforma (Desktop App):** Construído para desktop, permitindo um empacotamento completo (`.exe`) e distribuição simplificada através de um instalador próprio.
- 🔒 **Arquitetura Segura e Escalável:** Boas práticas de segurança implementadas desde a base. O sistema não expõe tokens proprietários e adota padrões rígidos de isolamento para privacidade e conformidade.

## 🛠️ Stack e Engenharia de Software

A construção desta solução exigiu o domínio de diversas disciplinas críticas:

- **Electron & Node.js:** Base do aplicativo desktop, garantindo integração profunda com o sistema operacional, controle de ciclo de vida e performance.
- **Integração de APIs de Mensageria:** Lidando com concorrência, webhooks e manipulação de fluxos assíncronos de dados do WhatsApp.
- **Pipeline de Distribuição:** Scripts automatizados (`build-installer.js`) para a geração de instaladores profissionais Windows (NSIS) usando `electron-winstaller`.

## 💼 Impacto do Projeto e Visão de Engenharia

O desenvolvimento do **Innovation IA** evidencia a capacidade de atuar em todo o **Ciclo de Vida de Software**:
1. **Concepção ao Deploy:** Integração da interface de front-end com um robusto back-end (Express/Node) e a criação de uma casca desktop independente.
2. **Resolução de Problemas Reais:** O software opera lidando com problemas reais de I/O, manipulação de arquivos binários (áudios/imagens) e estado assíncrono das comunicações de WhatsApp.
3. **Visão de Produto:** Entrega focada no cliente final (instalação com um clique e interface nativa e responsiva).

---

*Transformando complexidade operacional em produtividade automatizada.*
