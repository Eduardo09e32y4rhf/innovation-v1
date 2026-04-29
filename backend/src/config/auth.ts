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
  expiresIn: "8h",            // Access token 8h — equilibra segurança e UX SaaS
  refreshSecret: JWT_REFRESH_SECRET,
  refreshExpiresIn: "30d"     // Refresh token 30 dias — elimina logouts frequentes
};
