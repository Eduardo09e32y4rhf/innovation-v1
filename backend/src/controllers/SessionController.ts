import { Request, Response } from "express";
import AppError from "../errors/AppError";
import { getIO } from "../libs/socket";

import AuthUserService from "../services/UserServices/AuthUserService";
import { SendRefreshToken } from "../helpers/SendRefreshToken";
import { RefreshTokenService } from "../services/AuthServices/RefreshTokenService";
import FindUserFromToken from "../services/AuthServices/FindUserFromToken";
import User from "../models/User";
import { resetLoginAttempts } from "../middleware/rateLimiter";
import { logSecurityEvent, getRequestMeta } from "../services/AuthServices/AuditLogService";

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  const { ip, userAgent } = getRequestMeta(req);

  try {
    const { token, serializedUser, refreshToken } = await AuthUserService({
      email,
      password
    });

    // SEGURANÇA: Resetar contador de tentativas após login bem-sucedido
    await resetLoginAttempts(req);

    // AUDIT: Registrar login bem-sucedido
    logSecurityEvent({
      event: "LOGIN_SUCCESS",
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      userId: serializedUser.id,
      companyId: serializedUser.companyId,
      details: `Login do usuário ${serializedUser.email}`
    });

    SendRefreshToken(res, refreshToken);

    const io = getIO();
    io.to(`user-${serializedUser.id}`).emit(`company-${serializedUser.companyId}-auth`, {
      action: "update",
      user: {
        id: serializedUser.id,
        email: serializedUser.email,
        companyId: serializedUser.companyId
      }
    });

    return res.status(200).json({
      token,
      user: serializedUser
    });
  } catch (err) {
    // AUDIT: Registrar falha de login (sem revelar o motivo)
    logSecurityEvent({
      event: "LOGIN_FAILED",
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      details: `Tentativa falha para: ${email}`
    });
    throw err; // Re-lança para o handler de erros global
  }
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {

  const token: string = req.cookies.jrt;

  if (!token) {
    throw new AppError("ERR_SESSION_EXPIRED", 401);
  }

  const { user, newToken, refreshToken } = await RefreshTokenService(
    res,
    token
  );

  SendRefreshToken(res, refreshToken);

  return res.json({ token: newToken, user });
};

export const me = async (req: Request, res: Response): Promise<Response> => {
  const token: string = req.cookies.jrt;

  if (!token) {
    throw new AppError("ERR_SESSION_EXPIRED", 401);
  }

  const user = await FindUserFromToken(token);
  const { id, profile, super: superAdmin } = user;

  return res.json({ id, profile, super: superAdmin });
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.user;
  const { ip, userAgent } = getRequestMeta(req);
  const user = await User.findByPk(id);
  await user.update({ online: false });

  // AUDIT: Registrar logout
  logSecurityEvent({
    event: "LOGOUT",
    timestamp: new Date().toISOString(),
    ip,
    userAgent,
    userId: id
  });

  // SEGURANÇA: Limpar cookie com as mesmas flags do SendRefreshToken
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("jrt", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/auth/refresh_token"
  });

  return res.send();
};
