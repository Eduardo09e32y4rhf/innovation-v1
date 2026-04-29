import nodemailer from "nodemailer";
import { config } from "dotenv";
config();

const SendWelcomeMail = async (email: string, name: string) => {
  const urlSmtp = process.env.MAIL_HOST;
  const userSmtp = process.env.MAIL_USER;
  const passwordSmpt = process.env.MAIL_PASS;
  const fromEmail = process.env.MAIL_FROM;

  if (!urlSmtp || !userSmtp || !passwordSmpt) {
    console.log("Credenciais de e-mail não configuradas no .env");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: urlSmtp,
    port: Number(process.env.MAIL_PORT),
    secure: true,
    auth: { user: userSmtp, pass: passwordSmpt }
  });

  try {
    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: "Bem-vindo à Innovation IA!",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background-color: #1d4ed8; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">INNOVATION</h1>
            </div>
            <div style="padding: 32px 24px;">
              <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">Olá, ${name}!</h2>
              <p style="color: #475569; line-height: 1.6; font-size: 16px;">
                Seu cadastro foi realizado com sucesso. Estamos muito felizes em ter você conosco!
              </p>
              <p style="color: #475569; line-height: 1.6; font-size: 16px;">
                A <strong>Innovation IA</strong> é a plataforma definitiva para alavancar seu atendimento e vendas.
              </p>
              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}" style="background-color: #1d4ed8; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Acessar minha conta</a>
              </div>
            </div>
            <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
              &copy; ${new Date().getFullYear()} Innovation IA. Todos os direitos reservados.
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail de boas-vindas enviado: " + info.response);
  } catch (error) {
    console.log("Erro ao enviar e-mail de boas-vindas: ", error);
  }
};

export default SendWelcomeMail;
