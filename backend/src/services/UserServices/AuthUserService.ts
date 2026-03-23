import User from "../../models/User";
import AppError from "../../errors/AppError";
import {
  createAccessToken,
  createRefreshToken
} from "../../helpers/CreateTokens";
import { SerializeUser } from "../../helpers/SerializeUser";
import Queue from "../../models/Queue";
import Company from "../../models/Company";
import Setting from "../../models/Setting";
import { addDays, isBefore, subDays, parseISO } from "date-fns";

interface SerializedUser {
  id: number;
  name: string;
  email: string;
  profile: string;
  queues: Queue[];
  companyId: number;
}

interface Request {
  email: string;
  password: string;
}

interface Response {
  serializedUser: SerializedUser;
  token: string;
  refreshToken: string;
}

const AuthUserService = async ({
  email,
  password
}: Request): Promise<Response> => {
  const user = await User.findOne({
    where: { email },
    include: ["queues", { model: Company, include: [{ model: Setting }] }]
  });

  // SEGURANÇA: Mesma mensagem de erro para usuário inexistente e senha errada.
  // Evita "user enumeration attack" — atacante não consegue descobrir
  // quais e-mails estão cadastrados testando o login.
  const GENERIC_AUTH_ERROR = "ERR_INVALID_CREDENTIALS";

  if (!user) {
    // Mesmo sem usuário, simular verificação para tempo constante (timing attack prevention)
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
    throw new AppError(GENERIC_AUTH_ERROR, 401);
  }

  if (!(await user.checkPassword(password))) {
    throw new AppError(GENERIC_AUTH_ERROR, 401);
  }

  const token = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  // REGRA VIP: Ciclo Infinito para o Desenvolvedor
  // Se for o e-mail do dono, garante que a empresa dele nunca expire
  if (user.email === "eduardo998468@gmail.com" && user.companyId) {
    const company = await Company.findByPk(user.companyId);
    if (company) {
      const now = new Date();
      const currentDueDate = company.dueDate ? parseISO(company.dueDate) : now;

      // Se vencer em menos de 10 dias ou já estiver vencido, renova para +30 dias
      if (isBefore(currentDueDate, addDays(now, 10))) {
        const newDueDate = addDays(now, 30);
        await company.update({
          dueDate: newDueDate.toISOString().split("T")[0] + " 23:59:59+00"
        });
        // Atualiza o objeto no contexto atual para o SerializeUser pegar o valor novo
        user.company.dueDate = company.dueDate;
      }
    }
  }

  const serializedUser = await SerializeUser(user);

  return {
    serializedUser,
    token,
    refreshToken
  };
};

export default AuthUserService;

