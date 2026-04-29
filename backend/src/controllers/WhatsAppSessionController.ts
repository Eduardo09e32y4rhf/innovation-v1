import { Request, Response } from "express";
import { getWbot } from "../libs/wbot";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";
import AppError from "../errors/AppError";

const store = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const { companyId } = req.user;

  const whatsapp = await ShowWhatsAppService(whatsappId, companyId);
  await StartWhatsAppSession(whatsapp, companyId);

  return res.status(200).json({ message: "Starting session." });
};

const update = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const { companyId } = req.user;

  const { whatsapp } = await UpdateWhatsAppService({
    whatsappId,
    companyId,
    whatsappData: { session: "" }
  });

  await StartWhatsAppSession(whatsapp, companyId);

  return res.status(200).json({ message: "Starting session." });
};

const remove = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const { companyId } = req.user;
  const whatsapp = await ShowWhatsAppService(whatsappId, companyId);

  if (whatsapp.session) {
    await whatsapp.update({ status: "DISCONNECTED", session: "" });
    const wbot = getWbot(whatsapp.id);
    await wbot.logout();
  }

  return res.status(200).json({ message: "Session disconnected." });
};

const requestPairingCode = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const { phoneNumber } = req.body;
  const { companyId } = req.user;

  if (!phoneNumber) {
    throw new AppError("ERR_PHONE_NUMBER_REQUIRED", 400);
  }

  // Número deve ter só dígitos com código do país (ex: 5511999999999)
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    throw new AppError("ERR_INVALID_PHONE_NUMBER", 400);
  }

  const whatsapp = await ShowWhatsAppService(whatsappId, companyId);

  // Inicia a sessão em modo pairing code (código será enviado via WebSocket)
  await StartWhatsAppSession(whatsapp, companyId, true, cleanPhone);

  return res.status(200).json({
    message: "Aguarde o código de pareamento chegar no seu WhatsApp.",
    status: "waiting_pairing_code"
  });
};

export default { store, remove, update, requestPairingCode };

