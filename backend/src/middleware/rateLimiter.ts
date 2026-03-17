import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import AppError from "../errors/AppError";
import { get, set } from "../libs/cache";

/**
 * Rate Limiter com Redis para proteção de rotas de autenticação.
 *
 * SEGURANÇA (inspirado no innovation.ia @limiter.limit("5/minute")):
 * - Máx. 5 tentativas de login por IP em 60 segundos
 * - Após exceder, o IP é bloqueado por 15 minutos
 * - Usa Redis (ou ioredis-mock em dev) para consistência entre instâncias
 * - Headers Retry-After informam o cliente quando tentar novamente
 */

const MAX_ATTEMPTS = 5;
const WINDOW_SECS = 60;       // janela de 60 segundos
const BLOCK_SECS = 15 * 60;   // bloqueio de 15 minutos

interface RateLimitData {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

function getClientIP(req: Request): string {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.ip ||
    "unknown"
  );
}

async function getRateLimitData(ip: string): Promise<RateLimitData | null> {
  try {
    const raw = await get(`ratelimit:login:${ip}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function setRateLimitData(
  ip: string,
  data: RateLimitData,
  ttlSecs: number
): Promise<void> {
  try {
    await set(`ratelimit:login:${ip}`, JSON.stringify(data), "EX", ttlSecs);
  } catch (err) {
    logger.error(`[RateLimit] Erro ao salvar no Redis: ${err}`);
  }
}

/**
 * Middleware de rate limiting via Redis para o endpoint de login.
 * Registrado apenas na rota POST /auth/login.
 */
export const loginRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const ip = getClientIP(req);
  const now = Date.now();
  const entry = await getRateLimitData(ip);

  if (entry) {
    // ── IP está no período de bloqueio ──
    if (entry.blockedUntil && now < entry.blockedUntil) {
      const remainingSecs = Math.ceil((entry.blockedUntil - now) / 1000);
      logger.warn(`[RateLimit] IP bloqueado: ${ip} | Restante: ${remainingSecs}s`);
      res.setHeader("Retry-After", String(remainingSecs));
      throw new AppError(
        `ERR_RATE_LIMIT: Muitas tentativas. Aguarde ${remainingSecs} segundos.`,
        429
      );
    }

    const windowExpired = now - entry.firstAttempt > WINDOW_SECS * 1000;

    if (windowExpired) {
      // Janela expirou — reinicia contagem
      await setRateLimitData(ip, { count: 1, firstAttempt: now }, WINDOW_SECS);
    } else {
      entry.count++;

      if (entry.count > MAX_ATTEMPTS) {
        entry.blockedUntil = now + BLOCK_SECS * 1000;
        await setRateLimitData(ip, entry, BLOCK_SECS);
        logger.warn(
          `[RateLimit] IP BLOQUEADO 15min: ${ip} | ${entry.count} tentativas em ${WINDOW_SECS}s`
        );
        res.setHeader("Retry-After", String(BLOCK_SECS));
        throw new AppError(
          "ERR_RATE_LIMIT: Muitas tentativas de login. Bloqueado por 15 minutos.",
          429
        );
      }

      // TTL restante da janela atual
      const remainingWindow = Math.ceil(
        (WINDOW_SECS * 1000 - (now - entry.firstAttempt)) / 1000
      );
      await setRateLimitData(ip, entry, Math.max(remainingWindow, 1));
    }
  } else {
    // Primeira tentativa do IP
    await setRateLimitData(ip, { count: 1, firstAttempt: now }, WINDOW_SECS);
  }

  return next();
};

/**
 * Reseta o contador de tentativas após login bem-sucedido.
 * Impede que o usuário legítimo seja bloqueado por erros anteriores.
 */
export const resetLoginAttempts = async (req: Request): Promise<void> => {
  const ip = getClientIP(req);
  try {
    await set(`ratelimit:login:${ip}`, "", "EX", 1);
  } catch (err) {
    logger.error(`[RateLimit] Erro ao resetar contagem: ${err}`);
  }
};
