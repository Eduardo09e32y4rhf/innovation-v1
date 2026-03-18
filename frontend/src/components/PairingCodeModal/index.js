import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  CircularProgress,
  makeStyles,
  IconButton,
  InputAdornment,
  Paper,
} from "@material-ui/core";
import PhoneIcon from "@material-ui/icons/Phone";
import CloseIcon from "@material-ui/icons/Close";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { SocketContext } from "../../context/Socket/SocketContext";

const useStyles = makeStyles((theme) => ({
  dialog: {
    "& .MuiDialog-paper": {
      borderRadius: 20,
      padding: theme.spacing(1),
      minWidth: 380,
      background: theme.palette.type === "light"
        ? "linear-gradient(135deg, #fff 0%, #f8fafc 100%)"
        : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    },
  },
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 0,
  },
  titleText: {
    fontWeight: 800,
    fontSize: "1.1rem",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  stepContainer: {
    padding: theme.spacing(2, 1),
  },
  phoneInput: {
    marginBottom: theme.spacing(2),
    "& .MuiOutlinedInput-root": {
      borderRadius: 14,
    },
  },
  generateBtn: {
    borderRadius: 14,
    padding: "12px 0",
    fontWeight: 700,
    fontSize: "0.95rem",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #6d28d9, #db2777)",
      boxShadow: "0 6px 20px rgba(124, 58, 237, 0.4)",
      transform: "translateY(-2px)",
    },
    "&:disabled": {
      background: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
      boxShadow: "none",
      transform: "none",
    },
  },
  codeBox: {
    background: theme.palette.type === "light"
      ? "linear-gradient(135deg, #f5f3ff, #fdf2f8)"
      : "linear-gradient(135deg, #4c1d95, #831843)",
    border: `2px solid ${theme.palette.type === "light" ? "#ddd6fe" : "#7c3aed"}`,
    borderRadius: 16,
    padding: theme.spacing(3, 2),
    textAlign: "center",
    margin: theme.spacing(2, 0),
  },
  codeText: {
    fontFamily: "'Courier New', monospace",
    fontSize: "2.2rem",
    fontWeight: 900,
    letterSpacing: "0.3em",
    color: theme.palette.type === "light" ? "#7c3aed" : "#c4b5fd",
    lineHeight: 1,
  },
  codeLabel: {
    fontSize: "0.75rem",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  timer: {
    fontSize: "0.85rem",
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
  },
  timerRed: {
    color: "#ef4444",
    fontWeight: 700,
  },
  steps: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    background: theme.palette.type === "light" ? "#f1f5f9" : "#1e293b",
    borderRadius: 12,
  },
  step: {
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(0.8),
    fontSize: "0.82rem",
    color: theme.palette.text.secondary,
    "&:last-child": { marginBottom: 0 },
  },
  stepNum: {
    minWidth: 22,
    height: 22,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    fontWeight: 800,
    flexShrink: 0,
  },
  successBox: {
    textAlign: "center",
    padding: theme.spacing(3),
  },
  successIcon: {
    color: "#22c55e",
    fontSize: 64,
    marginBottom: theme.spacing(1),
  },
}));

const EXPIRY_SECONDS = 60;

const PairingCodeModal = ({ open, onClose, whatsAppId }) => {
  const classes = useStyles();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("input"); // input | loading | code | success
  const [pairingCode, setPairingCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(EXPIRY_SECONDS);
  const timerRef = useRef(null);
  const socketManager = useContext(SocketContext);

  useEffect(() => {
    if (!open) {
      setPhone("");
      setStep("input");
      setPairingCode("");
      setTimeLeft(EXPIRY_SECONDS);
      clearInterval(timerRef.current);
    }
  }, [open]);

  useEffect(() => {
    if (!whatsAppId || !open) return;
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    const handler = (data) => {
      if (data.action === "pairingCode" && data.session.id === whatsAppId) {
        setPairingCode(data.session.pairingCode);
        setStep("code");
        setTimeLeft(EXPIRY_SECONDS);
        // Inicia contador regressivo
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      // Conexão estabelecida com sucesso!
      if (
        data.action === "update" &&
        data.session.id === whatsAppId &&
        data.session.status === "CONNECTED"
      ) {
        clearInterval(timerRef.current);
        setStep("success");
        setTimeout(() => onClose(), 2000);
      }
    };

    socket.on(`company-${companyId}-whatsappSession`, handler);
    return () => {
      socket.off(`company-${companyId}-whatsappSession`, handler);
    };
  }, [whatsAppId, open, onClose, socketManager]);

  const handleRequestCode = async () => {
    if (!phone.trim()) return;
    setStep("loading");
    try {
      await api.post(`/whatsappsession/${whatsAppId}/pairing-code`, {
        phoneNumber: phone,
      });
      // Código chegará via WebSocket
    } catch (err) {
      toastError(err);
      setStep("input");
    }
  };

  const handlePhoneChange = (e) => {
    // Aceita apenas dígitos, +, -, (, ), espaços
    const val = e.target.value.replace(/[^0-9+\-() ]/g, "");
    setPhone(val);
  };

  const formatCode = (code) => {
    // Formata como XXXX-XXXX
    if (!code) return "";
    const clean = code.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    if (clean.length <= 4) return clean;
    return `${clean.slice(0, 4)}-${clean.slice(4)}`;
  };

  return (
    <Dialog open={open} onClose={onClose} className={classes.dialog} maxWidth="xs" fullWidth>
      <DialogTitle className={classes.title} disableTypography>
        <Typography className={classes.titleText}>
          📱 Conectar com Número
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent className={classes.stepContainer}>
        {/* ETAPA 1: Input do telefone */}
        {step === "input" && (
          <>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
              Digite o número do WhatsApp com o código do país. Um código de verificação será enviado para ele.
            </Typography>
            <TextField
              className={classes.phoneInput}
              fullWidth
              variant="outlined"
              label="Número do WhatsApp"
              placeholder="+55 11 99999-9999"
              value={phone}
              onChange={handlePhoneChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon style={{ color: "#7c3aed" }} />
                  </InputAdornment>
                ),
              }}
              onKeyPress={(e) => e.key === "Enter" && handleRequestCode()}
            />
            <Button
              className={classes.generateBtn}
              fullWidth
              variant="contained"
              onClick={handleRequestCode}
              disabled={!phone.trim()}
            >
              Gerar Código de Verificação
            </Button>

            <div className={classes.steps}>
              {[
                "Abra o WhatsApp no celular",
                "Vá em Menu (⋮) → Dispositivos vinculados",
                'Toque em "Vincular um aparelho"',
                "Digite o código que aparecer aqui",
              ].map((text, i) => (
                <div key={i} className={classes.step}>
                  <span className={classes.stepNum}>{i + 1}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ETAPA 2: Carregando */}
        {step === "loading" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <CircularProgress style={{ color: "#7c3aed" }} size={48} />
            <Typography variant="body2" color="textSecondary" style={{ marginTop: 16 }}>
              Solicitando código ao WhatsApp...
            </Typography>
          </div>
        )}

        {/* ETAPA 3: Exibir código */}
        {step === "code" && (
          <>
            <div className={classes.codeBox}>
              <Typography className={classes.codeLabel}>
                Seu código de verificação
              </Typography>
              <Typography className={classes.codeText}>
                {formatCode(pairingCode)}
              </Typography>
              <Typography className={classes.timer}>
                {timeLeft > 0 ? (
                  <>
                    Expira em{" "}
                    <span className={timeLeft <= 15 ? classes.timerRed : ""}>
                      {timeLeft}s
                    </span>
                  </>
                ) : (
                  <span className={classes.timerRed}>
                    Código expirado — solicite um novo
                  </span>
                )}
              </Typography>
            </div>

            <div className={classes.steps}>
              {[
                "Abra o WhatsApp no celular",
                "Vá em Menu (⋮) → Dispositivos vinculados",
                'Toque em "Vincular um aparelho"',
                "Digite o código acima no campo indicado",
              ].map((text, i) => (
                <div key={i} className={classes.step}>
                  <span className={classes.stepNum}>{i + 1}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {timeLeft === 0 && (
              <Button
                className={classes.generateBtn}
                fullWidth
                variant="contained"
                style={{ marginTop: 16 }}
                onClick={() => {
                  setStep("input");
                  setPairingCode("");
                }}
              >
                Solicitar Novo Código
              </Button>
            )}
          </>
        )}

        {/* ETAPA 4: Sucesso */}
        {step === "success" && (
          <div className={classes.successBox}>
            <CheckCircleOutlineIcon className={classes.successIcon} />
            <Typography variant="h6" style={{ fontWeight: 700 }}>
              Conectado com sucesso! ✅
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Seu WhatsApp foi vinculado.
            </Typography>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PairingCodeModal;
