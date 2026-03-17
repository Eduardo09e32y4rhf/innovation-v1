import { randomInt } from "crypto";
import { get, set, del } from "../../libs/cache";
import { logger } from "../../utils/logger";
import nodemailer from "nodemailer";

/**
 * Serviço de autenticação em dois fatores (2FA) via e-mail.
 *
 * SEGURANÇA (baseado no two_factor_service.py do innovation.ia):
 * - Código 6 dígitos gerado com crypto.randomInt (criptograficamente seguro)
 * - Armazenado no Redis com TTL de 5 minutos
 * - Máximo de 3 tentativas incorretas antes de invalidar o código
 * - Cada usuário só pode ter 1 código ativo por vez
 * - Código invalidado após uso bem-sucedido (one-time use)
 */

const CODE_TTL_SECS = 300;    // 5 minutos
const MAX_ATTEMPTS = 3;        // Máximo de tentativas

interface TwoFAData {
  code: string;
  attempts: number;
  expiresAt: number;
}

function getTwoFAKey(userId: number | string): string {
  return `2fa:${userId}`;
}

/**
 * Gera e armazena um código 2FA para o usuário.
 * Remove qualquer código anterior (garante um único código ativo).
 */
export const generateTwoFACode = async (userId: number): Promise<string> => {
  // Gera código de 6 dígitos criptograficamente seguro
  const code = String(randomInt(0, 1000000)).padStart(6, "0");

  const data: TwoFAData = {
    code,
    attempts: 0,
    expiresAt: Date.now() + CODE_TTL_SECS * 1000
  };

  // Sobrescreve qualquer código anterior (apenas 1 ativo por vez)
  await set(getTwoFAKey(userId), JSON.stringify(data), "EX", CODE_TTL_SECS);

  logger.info(`[2FA] Código gerado para userId=${userId}`);
  return code;
};

/**
 * Verifica o código 2FA enviado pelo usuário.
 * Proteção contra brute-force: invalida após 3 tentativas incorretas.
 */
export const verifyTwoFACode = async (
  userId: number,
  submittedCode: string
): Promise<{ valid: boolean; reason?: string }> => {
  const key = getTwoFAKey(userId);

  const raw = await get(key);
  if (!raw) {
    logger.warn(`[2FA] Código não encontrado ou expirado para userId=${userId}`);
    return { valid: false, reason: "Código expirado ou não solicitado" };
  }

  const data: TwoFAData = JSON.parse(raw);

  // Verificar expiração (dupla verificação além do TTL do Redis)
  if (Date.now() > data.expiresAt) {
    await del(key);
    logger.warn(`[2FA] Código expirado para userId=${userId}`);
    return { valid: false, reason: "Código expirado" };
  }

  // Verificar limite de tentativas (proteção brute-force)
  if (data.attempts >= MAX_ATTEMPTS) {
    await del(key);
    logger.warn(`[2FA] Máximo de tentativas excedido para userId=${userId}`);
    return { valid: false, reason: "Muitas tentativas incorretas. Solicite um novo código." };
  }

  // Verificar código
  if (data.code !== submittedCode) {
    data.attempts++;
    const remainingTTL = Math.ceil((data.expiresAt - Date.now()) / 1000);
    await set(key, JSON.stringify(data), "EX", Math.max(remainingTTL, 1));
    logger.warn(
      `[2FA] Código incorreto para userId=${userId} (tentativa ${data.attempts}/${MAX_ATTEMPTS})`
    );
    return {
      valid: false,
      reason: `Código incorreto. ${MAX_ATTEMPTS - data.attempts} tentativas restantes.`
    };
  }

  // ✅ Código correto — invalidar (one-time use)
  await del(key);
  logger.info(`[2FA] Código verificado com sucesso para userId=${userId}`);
  return { valid: true };
};

/**
 * Envia o código 2FA por e-mail via nodemailer.
 */
export const sendTwoFAEmail = async (
  email: string,
  code: string
): Promise<boolean> => {
  const urlSmtp = process.env.MAIL_HOST;
  const userSmtp = process.env.MAIL_USER;
  const passwordSmtp = process.env.MAIL_PASS;
  const fromEmail = process.env.MAIL_FROM;

  if (!urlSmtp || !userSmtp || !passwordSmtp) {
    logger.error("[2FA] Configurações de e-mail ausentes no .env");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: urlSmtp,
    port: Number(process.env.MAIL_PORT || 465),
    secure: true,
    auth: { user: userSmtp, pass: passwordSmtp }
  });

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: "🔐 Código de Verificação — Login",
      html: `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código de Verificação</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #f0f4ff; margin: 0; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(7,31,79,0.12);">
    <div style="background: linear-gradient(135deg, #071f4f, #1a3a8a); padding: 32px; text-align: center;">
      <h1 style="color: #fff; font-size: 22px; margin: 0; font-weight: 600;">🔐 Verificação de Identidade</h1>
    </div>
    <div style="padding: 36px;">
      <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
        Uma tentativa de login foi detectada. Use o código abaixo para confirmar sua identidade:
      </p>
      <div style="background: #f0f4ff; border: 2px solid #071f4f; border-radius: 10px; padding: 24px; text-align: center; margin: 0 0 24px;">
        <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #071f4f; font-family: monospace;">${code}</span>
      </div>
      <p style="color: #666; font-size: 13px; line-height: 1.5; margin: 0;">
        ⏱️ Este código expira em <strong>5 minutos</strong>.<br>
        🛡️ Máximo de <strong>3 tentativas</strong> antes de ser invalidado.<br><br>
        Se você não fez esta solicitação, sua conta está segura e nenhuma ação é necessária.
      </p>
    </div>
    <div style="background: #f8f9fd; padding: 16px; text-align: center; color: #aaa; font-size: 12px;">
      Este e-mail foi gerado automaticamente. Não responda.
    </div>
  </div>
</body>
</html>`
    });

    logger.info(`[2FA] Código enviado por e-mail para ${email}`);
    return true;
  } catch (err) {
    logger.error(`[2FA] Erro ao enviar e-mail para ${email}: ${err}`);
    return false;
  }
};
