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

  const serializedUser = await SerializeUser(user);

  return {
    serializedUser,
    token,
    refreshToken
  };
};

export default AuthUserService;

