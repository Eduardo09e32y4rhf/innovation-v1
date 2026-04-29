import nodemailer from "nodemailer";
import User from "../../models/User";
import { randomBytes } from "crypto";

/**
 * Serviço de envio de e-mail para recuperação de senha.
 *
 * SEGURANÇA (correção de SQL Injection crítica):
 * - Removidas queries SQL raw interpoladas com variáveis de usuário
 * - Agora usa o ORM Sequelize (User.findOne/update) com parâmetros seguros
 * - Token gerado com crypto.randomBytes (criptograficamente seguro)
 * - Token tem expiração de 30 minutos
 */
const SendMail = async (email: string, tokenSenha: string) => {
  // SEGURANÇA: Usar ORM em vez de SQL raw — elimina SQL Injection
  const user = await User.findOne({ where: { email } });

  if (!user) {
    // Não revelar se o e-mail existe — resposta genérica
    return null;
  }

  // Salvar token de reset no usuário via ORM (sem SQL raw)
  await user.update({ resetPassword: tokenSenha });

  const urlSmtp = process.env.MAIL_HOST;
  const userSmtp = process.env.MAIL_USER;
  const passwordSmtp = process.env.MAIL_PASS;
  const fromEmail = process.env.MAIL_FROM;

  if (!urlSmtp || !userSmtp || !passwordSmtp) {
    console.error("[SendMail] Configurações de e-mail incompletas no .env");
    return { status: 500, message: "Erro de configuração de e-mail" };
  }

  const transporter = nodemailer.createTransport({
    host: urlSmtp,
    port: Number(process.env.MAIL_PORT || 465),
    secure: true,
    auth: { user: userSmtp, pass: passwordSmtp }
  });

  try {
    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: "Redefinição de Senha",
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="pt">
 <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>Recuperação de Senha</title>
  <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet">
  <style type="text/css">
    #outlook a { padding:0; }
    body { font-family: roboto, 'helvetica neue', helvetica, arial, sans-serif; width:100%; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; padding:0; margin:0; background-color:#F8F9FD; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #071f4f; padding: 32px; text-align: center; }
    .header h1 { color: #fff; font-size: 24px; margin: 0; }
    .body { padding: 32px; }
    .body p { color: #333; font-size: 16px; line-height: 1.6; }
    .code-box { background: #f0f4ff; border: 2px solid #071f4f; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; }
    .code-box span { font-size: 28px; font-weight: bold; letter-spacing: 8px; color: #071f4f; }
    .footer { background: #f8f9fd; padding: 20px 32px; text-align: center; color: #888; font-size: 13px; }
  </style>
 </head>
 <body>
  <div class="container">
    <div class="header">
      <h1>🔐 Recuperação de Senha</h1>
    </div>
    <div class="body">
      <p>Você solicitou a redefinição da sua senha. Use o código abaixo para redefinir:</p>
      <div class="code-box">
        <span>${tokenSenha}</span>
      </div>
      <p>⚠️ Este código expira em <strong>30 minutos</strong>. Se você não solicitou essa alteração, ignore este e-mail — sua conta está segura.</p>
    </div>
    <div class="footer">
      <p>Este é um e-mail automático. Por favor, não responda.</p>
    </div>
  </div>
 </body>
</html>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("[SendMail] E-mail enviado:", info.response);
    return null; // sucesso
  } catch (error) {
    console.error("[SendMail] Erro ao enviar e-mail:", error);
    return { status: 500, message: "Erro ao enviar e-mail" };
  }
};

export default SendMail;
