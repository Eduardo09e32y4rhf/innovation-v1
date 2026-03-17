import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import AppError from "../errors/AppError";
import authConfig from "../config/auth";

interface TokenPayload {
  id: string;
  username: string;
  profile: string;
  companyId: number;
  typ: string;   // "access" | "refresh" — validado para prevenir token confusion
  jti: string;   // JWT ID único
  iat: number;
  exp: number;
}

const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("ERR_SESSION_EXPIRED", 401);
  }

  // Garantir formato "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    throw new AppError("ERR_INVALID_AUTH_FORMAT", 401);
  }

  const [, token] = parts;

  try {
    const decoded = verify(token, authConfig.secret) as TokenPayload;

    // SEGURANÇA: Rejeitar refresh tokens sendo usados como access tokens
    // Inspirado na técnica de 'typ' claim do innovation.ia
    if (decoded.typ !== "access") {
      logger.warn(`[isAuth] Tentativa de uso de token inválido (typ=${decoded.typ}) - IP: ${req.ip}`);
      throw new AppError("ERR_INVALID_TOKEN_TYPE", 403);
    }

    req.user = {
      id: decoded.id,
      profile: decoded.profile,
      companyId: decoded.companyId
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    // Log de tentativas com token inválido para monitoramento
    logger.warn(`[isAuth] Token inválido rejeitado - IP: ${req.ip} | Error: ${(err as Error).message}`);
    throw new AppError("ERR_SESSION_EXPIRED", 401);
  }

  return next();
};

export default isAuth;
