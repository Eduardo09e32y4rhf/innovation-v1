import User from "../../models/User";
import { hash } from "bcryptjs";

/**
 * Serviço de redefinição de senha.
 *
 * SEGURANÇA (correção de SQL Injection crítica):
 * - Removidas TODAS as queries SQL raw com interpolação de variáveis
 * - Agora usa User.findOne() e user.update() via ORM Sequelize
 * - bcrypt rounds aumentado de 8 para 12 (compatível com User.ts)
 * - Limpa o token após uso bem-sucedido (one-time use)
 */
const ResetPassword = async (
  email: string,
  token: string,
  password: string
) => {
  // SEGURANÇA: ORM com parâmetros — sem SQL Injection
  const user = await User.findOne({
    where: { email }
  });

  if (!user) {
    return { status: 404, message: "E-mail não encontrado" };
  }

  // Verifica se o token bate com o salvo no banco
  // resetPassword existe no banco (migration 20231111) mas não no modelo TS
  const resetToken = user.getDataValue("resetPassword" as any);
  if (!resetToken || resetToken !== token) {
    return { status: 400, message: "Token inválido ou expirado" };
  }

  try {
    // SEGURANÇA: rounds=12 consistente com User.ts
    const convertPassword: string = await hash(password, 12);

    // Atualiza senha e limpa o token (one-time use)
    await (user as any).update({
      passwordHash: convertPassword,
      resetPassword: null
    });

    return null; // sucesso
  } catch (err) {
    console.error("[ResetPassword] Erro ao redefinir senha:", err);
    return { status: 500, message: "Erro interno ao redefinir senha" };
  }
};

export default ResetPassword;
