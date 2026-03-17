const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// SEGURANÇA: Falhar imediatamente se os secrets não estiverem configurados.
// Nunca usar fallback hardcoded em ambiente de produção.
if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error(
    "[SEGURANÇA CRÍTICA] JWT_SECRET e JWT_REFRESH_SECRET devem estar definidos no .env. " +
    "O servidor não pode iniciar sem chaves seguras."
  );
}

export default {
  secret: JWT_SECRET,
  expiresIn: "15m",           // Access token curto — limita janela de ataque
  refreshSecret: JWT_REFRESH_SECRET,
  refreshExpiresIn: "7d"      // Refresh token mais longo — renovado via httpOnly cookie
};
