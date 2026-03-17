import "./bootstrap";
import "reflect-metadata";
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";

import "./database";
import uploadConfig from "./config/upload";
import AppError from "./errors/AppError";
import routes from "./routes";
import { logger } from "./utils/logger";
import { messageQueue, sendScheduledMessages } from "./queues";
import bodyParser from 'body-parser';

Sentry.init({ dsn: process.env.SENTRY_DSN });

const app = express();

app.set("queues", {
  messageQueue,
  sendScheduledMessages
});

// ─────────────────────────────────────────────────────
// SEGURANÇA: Remover header X-Powered-By (esconde Express)
// ─────────────────────────────────────────────────────
app.disable("x-powered-by");

// ─────────────────────────────────────────────────────
// SEGURANÇA: Headers HTTP de segurança (equivalente ao helmet)
// Inspirados nas melhores práticas do innovation.ia
// ─────────────────────────────────────────────────────
app.use((_req: Request, res: Response, next: NextFunction) => {
  // Impede que o browser faça MIME sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Impede que a página seja exibida em iframe (clickjacking)
  res.setHeader("X-Frame-Options", "DENY");
  // Ativa filtro XSS do browser (legado, mas ainda útil)
  res.setHeader("X-XSS-Protection", "1; mode=block");
  // Não enviar referrer para links externos
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // Desabilitar features desnecessárias do browser
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

const bodyparser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(Sentry.Handlers.requestHandler());
app.use("/public", express.static(uploadConfig.directory));
app.use(routes);

app.use(Sentry.Handlers.errorHandler());

app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {

  if (err instanceof AppError) {
    logger.warn(err);
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error(err);
  return res.status(500).json({ error: "ERR_INTERNAL_SERVER_ERROR" });
});

export default app;
