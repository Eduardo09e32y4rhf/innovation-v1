import { Response } from "express";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === "production";

/**
 * Envia o refresh token como cookie httpOnly seguro.
 *
 * SEGURANÇA:
 * - httpOnly: impede acesso via JavaScript (proteção contra XSS)
 * - secure: força HTTPS em produção (impede interceptação)
 * - sameSite: "strict" impede envio cross-site (proteção contra CSRF)
 * - maxAge: define expiração explícita de 7 dias
 * - path: restrito ao endpoint de refresh (minimiza exposição)
 */
export const SendRefreshToken = (res: Response, token: string): void => {
  res.cookie("jrt", token, {
    httpOnly: true,
    secure: isProduction,          // HTTPS only em produção
    sameSite: "strict",            // Proteção CSRF
    maxAge: THIRTY_DAYS_MS,        // 30 dias em ms — igual ao refreshExpiresIn
    path: "/auth/refresh_token"    // Cookie enviado apenas para rota de refresh
  });
};

