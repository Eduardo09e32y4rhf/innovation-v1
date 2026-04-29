import { sign } from "jsonwebtoken";
import { randomUUID } from "crypto";
import authConfig from "../config/auth";
import User from "../models/User";

/**
 * Cria um access token JWT de curta duração (15 min).
 * Contém typ: "access" para prevenir uso de refresh tokens como access tokens.
 * Contém jti único para possibilitar revogação futura via blocklist.
 */
export const createAccessToken = (user: User): string => {
  const { secret, expiresIn } = authConfig;

  return sign(
    {
      username: user.name,         // corrigido: era 'usarname' (typo)
      profile: user.profile,
      id: user.id,
      companyId: user.companyId,
      typ: "access",               // SEGURANÇA: impede refresh token ser usado como access
      jti: randomUUID()            // JWT ID único — permite revogação individual
    },
    secret,
    { expiresIn }
  );
};

/**
 * Cria um refresh token JWT de longa duração (7d).
 * Contém tokenVersion para invalidação de todas as sessões do usuário.
 * Contém typ: "refresh" para não ser aceito como access token.
 */
export const createRefreshToken = (user: User): string => {
  const { refreshSecret, refreshExpiresIn } = authConfig;

  return sign(
    {
      id: user.id,
      tokenVersion: user.tokenVersion,
      companyId: user.companyId,
      typ: "refresh",              // SEGURANÇA: impede uso como access token
      jti: randomUUID()            // JWT ID único
    },
    refreshSecret,
    { expiresIn: refreshExpiresIn }
  );
};
