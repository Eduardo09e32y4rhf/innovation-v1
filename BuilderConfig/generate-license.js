const fs = require('fs');

const topics = [
  "Aceitação dos termos de licença de uso do software INNOVATION IA.",
  "Licença concedida de caráter não exclusivo, intransferível e limitada.",
  "Restrição de uso comercial não autorizado ou sublicenciamento do aplicativo.",
  "Proibição absoluta de engenharia reversa, descompilação ou modificação do código fonte.",
  "Propriedade intelectual mantida integralmente pelos desenvolvedores da INNOVATION IA.",
  "Responsabilidade do usuário sobre a guarda e uso de tokens de Inteligência Artificial (OpenAI, Anthropic, etc.).",
  "Isenção de responsabilidade da INNOVATION IA sobre bloqueios ou banimentos em plataformas de terceiros (ex: WhatsApp, Meta).",
  "Isenção de responsabilidade por mau uso ou envio massivo de mensagens (Spam).",
  "Ausência de garantia de que o software estará livre de bugs ou interrupções.",
  "O suporte técnico oferecido é limitado estritamente ao processo de instalação do aplicativo.",
  "O usuário é inteiramente responsável por realizar backup de seus dados e configurações.",
  "A INNOVATION IA não se responsabiliza por perdas financeiras ou de dados derivadas do uso do software.",
  "Aceitação das atualizações automáticas ou manuais disponibilizadas para o software.",
  "Coleta de dados anônimos de uso estritamente para melhoria de performance do software.",
  "O direito da INNOVATION IA de revogar a licença em caso de violação de qualquer termo.",
  "Uso do software em conformidade com as leis e regulamentações locais do usuário.",
  "Reconhecimento de que a INNOVATION IA atua apenas como uma ponte de comunicação de software.",
  "Proibição de utilizar o software para fins ilícitos, discriminatórios ou prejudiciais a terceiros.",
  "Consentimento com eventuais alterações futuras destes termos de serviço."
];

let content = "CONTRATO DE LICENÇA DE USUÁRIO FINAL (EULA) - INNOVATION IA SOFTWARE\n\n";
content += "Ao instalar este software, o usuário concorda com os seguintes termos e condições que regem o uso do aplicativo INNOVATION IA.\n\n";

for (let i = 1; i <= 199; i++) {
  const topicIndex = (i - 1) % topics.length;
  content += `${i}. ${topics[topicIndex]}\n`;
  if (i === 5) {
    content += "   1. A INNOVATION IA não fornece, não vende e não repassa tokens de IA. Essa é responsabilidade exclusiva do usuário final.\n";
  }
  if (i === 15) {
     content += "   1. Em nenhuma circunstância a INNOVATION IA será responsável por alterações de políticas do WhatsApp ou bloqueios numéricos causados pelas ações do usuário.\n";
  }
  if (i === 20) {
      content += "   1. O aplicativo é distribuído 'como está', sem suporte para customizações de uso além da instalação inicial.\n";
  }
}

content += "\nO usuário declara ter lido as 199 condições de software e aceita os termos para prosseguir com a instalação.\n";

fs.writeFileSync('license.txt', content);
console.log('Gerado license.txt com formato de software');
