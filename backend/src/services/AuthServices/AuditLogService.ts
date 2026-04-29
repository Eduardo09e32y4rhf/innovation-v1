import { logger } from "../../utils/logger";

/**
 * Serviço de Audit Log de Segurança.
 *
 * Inspirado no audit_service.py do innovation.ia.
 * Registra eventos de segurança importantes para monitoramento e forense.
 *
 * Eventos rastreados:
 * - LOGIN_SUCCESS: Login bem-sucedido
 * - LOGIN_FAILED: Tentativa de login com credenciais inválidas
 * - LOGIN_BLOCKED: IP bloqueado por rate limiting
 * - LOGOUT: Logout explícito
 * - TOKEN_INVALID: Uso de token inválido ou expirado
 * - PASSWORD_RESET_REQUEST: Solicitação de reset de senha
 * - PASSWORD_CHANGED: Senha alterada com sucesso
 * - TWO_FA_SUCCESS: Código 2FA verificado com sucesso
 * - TWO_FA_FAILED: Código 2FA incorreto
 */

export type SecurityEvent =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGIN_BLOCKED"
  | "LOGOUT"
  | "TOKEN_INVALID"
  | "PASSWORD_RESET_REQUEST"
  | "PASSWORD_CHANGED"
  | "TWO_FA_SUCCESS"
  | "TWO_FA_FAILED";

interface AuditLogEntry {
  event: SecurityEvent;
  timestamp: string;
  ip?: string;
  userId?: number | string;
  companyId?: number;
  userAgent?: string;
  details?: string;
}

/**
 * Loga um evento de segurança no logger do sistema.
 * Em produção, substitua por gravação em banco (tabela AuditLogs).
 */
export function logSecurityEvent(entry: AuditLogEntry): void {
  const logLine = JSON.stringify({
    ...entry,
    timestamp: new Date().toISOString()
  });

  switch (entry.event) {
    case "LOGIN_SUCCESS":
    case "LOGOUT":
    case "TWO_FA_SUCCESS":
    case "PASSWORD_CHANGED":
      logger.info(`[AUDIT] ${logLine}`);
      break;

    case "LOGIN_FAILED":
    case "TWO_FA_FAILED":
    case "TOKEN_INVALID":
    case "PASSWORD_RESET_REQUEST":
      logger.warn(`[AUDIT] ${logLine}`);
      break;

    case "LOGIN_BLOCKED":
      logger.error(`[AUDIT] ${logLine}`);
      break;

    default:
      logger.info(`[AUDIT] ${logLine}`);
  }
}

/**
 * Helper para extrair IP e User-Agent de uma request Express.
 */
export function getRequestMeta(req: {
  headers: Record<string, string | string[] | undefined>;
  ip?: string;
}): { ip: string; userAgent: string } {
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.ip ||
    "unknown";

  const userAgent = (req.headers["user-agent"] as string) || "unknown";

  return { ip, userAgent };
}
