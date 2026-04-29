import React, { useState, useEffect } from "react";
import qs from "query-string";
import LanguageControl from "../../components/LanguageControl";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import {
	Button,
	CssBaseline,
	TextField,
	Link,
	Grid,
	Box,
	Typography,
	Container,
	Grow,
	Fade,
	makeStyles,
	useTheme
} from "@material-ui/core";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import moment from "moment";
import toastError from '../../errors/toastError';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../../assets/logo.png";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    minHeight: "100vh",
    background: theme.palette.type === 'light' ? "#f8fafc" : "#0f172a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: theme.spacing(4, 0),
  },
  paper: {
    backgroundColor: theme.palette.type === 'light' ? "#ffffff" : "#1e293b",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    borderRadius: "20px",
    border: `1px solid ${theme.palette.type === 'light' ? "#e2e8f0" : "#334155"}`,
    boxShadow: theme.palette.type === 'light' ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      padding: "24px 16px",
    },
  },
  form: {
    width: "100%", 
    marginTop: theme.spacing(3),
  },
  title: {
    fontWeight: 800,
    marginBottom: theme.spacing(3),
    color: theme.palette.type === 'light' ? "#682EE3" : theme.palette.primary.main,
    letterSpacing: "1px",
    textTransform: "uppercase"
  },
  logo: {
    width: "150px",
    marginBottom: theme.spacing(3),
  },
  textField: {
    marginBottom: theme.spacing(2),
    "& .MuiInputBase-root": {
      color: theme.palette.text.primary,
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.text.secondary,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme.palette.type === 'light' ? "#cbd5e1" : "#475569",
        borderRadius: "12px",
      },
      "&:hover fieldset": {
        borderColor: theme.palette.type === 'light' ? "#94a3b8" : "#94a3b8",
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& input:-webkit-autofill": {
      "-webkit-box-shadow": `0 0 0 100px ${theme.palette.background.paper} inset !important`,
      "-webkit-text-fill-color": `${theme.palette.text.primary} !important`,
    },
  },
  submit: {
    margin: theme.spacing(4, 0, 2),
    padding: "14px",
    borderRadius: "12px",
    backgroundColor: theme.palette.type === 'light' ? "#682EE3" : theme.palette.primary.main,
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: theme.palette.type === 'light' ? "#5225b2" : "#9333ea",
      transform: "translateY(-2px)",
      boxShadow: `0 5px 15px ${theme.palette.type === 'light' ? 'rgba(104, 46, 227, 0.4)' : 'rgba(167, 139, 250, 0.4)'}`,
    }
  },
  link: {
    color: theme.palette.type === 'light' ? "#64748b" : "#94a3b8",
    fontSize: "0.85rem",
    textDecoration: "none",
    transition: "color 0.3s ease",
    "&:hover": {
      color: theme.palette.type === 'light' ? "#0f172a" : "#f8fafc"
    }
  },
  languageControl: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10
  }
}));

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const ForgetPassword = () => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  let companyId = null;
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showResetPasswordButton, setShowResetPasswordButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(""); // Estado para mensagens de erro

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
    if (showAdditionalFields) {
      setShowResetPasswordButton(false);
    } else {
      setShowResetPasswordButton(true);
    }
  };

  const params = qs.parse(window.location.search);
  if (params.companyId !== undefined) {
    companyId = params.companyId;
  }

  const initialState = { email: "" };

  const [user] = useState(initialState);
  const dueDate = moment().add(3, "day").format();

const handleSendEmail = async (values) => {
  const email = values.email;
  try {
    const response = await api.post(
      `${process.env.REACT_APP_BACKEND_URL}/forgetpassword/${email}`
    );
    console.log("API Response:", response.data);

    if (response.data.status === 404) {
      toast.error(i18n.t("resetPassword.toasts.emailNotFound"));
    } else {
      toast.success(i18n.t("resetPassword.toasts.emailSent"));
    }
  } catch (err) {
    console.log("API Error:", err);
    toastError(err);
  }
};

  const handleResetPassword = async (values) => {
    const email = values.email;
    const token = values.token;
    const newPassword = values.newPassword;
    const confirmPassword = values.confirmPassword;

    if (newPassword === confirmPassword) {
      try {
        await api.post(
          `${process.env.REACT_APP_BACKEND_URL}/resetpasswords/${email}/${token}/${newPassword}`
        );
        setError(""); // Limpe o erro se não houver erro
        toast.success(i18n.t("resetPassword.toasts.passwordUpdated"));
        history.push("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const isResetPasswordButtonClicked = showResetPasswordButton;
  const UserSchema = Yup.object().shape({
    email: Yup.string().email(i18n.t("resetPassword.formErrors.email.invalid")).required(i18n.t("resetPassword.formErrors.email.required")),
    newPassword: isResetPasswordButtonClicked
      ? Yup.string()
          .required(i18n.t("resetPassword.formErrors.newPassword.required"))
          .matches(
            passwordRegex,
            i18n.t("resetPassword.formErrors.newPassword.matches")
          )
      : Yup.string(), // Sem validação se não for redefinição de senha
    confirmPassword: Yup.string().when("newPassword", {
      is: (newPassword) => isResetPasswordButtonClicked && newPassword,
      then: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], i18n.t("resetPassword.formErrors.confirmPassword.matches"))
        .required(i18n.t("resetPassword.formErrors.confirmPassword.required")),
      otherwise: Yup.string(), // Sem validação se não for redefinição de senha
    }),
  });

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className={classes.root}>
      <Fade in={show} timeout={1000}>
        <div className={classes.languageControl}>
          <LanguageControl />
        </div>
      </Fade>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Grow in={show} timeout={1000}>
          <div className={classes.paper}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img src={logo} alt="logo" className={classes.logo} />
              <Typography component="h1" variant="h5" className={classes.title}>
                {i18n.t("resetPassword.title")}
              </Typography>
            </div>
            <Formik
              initialValues={{
                email: "",
                token: "",
                newPassword: "",
                confirmPassword: "",
              }}
              enableReinitialize={true}
              validationSchema={UserSchema}
              onSubmit={(values, actions) => {
                setTimeout(() => {
                  if (showResetPasswordButton) {
                    handleResetPassword(values);
                  } else {
                    handleSendEmail(values);
                  }
                  actions.setSubmitting(false);
                  toggleAdditionalFields();
                }, 400);
              }}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form className={classes.form}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Fade in={show} timeout={1500}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          id="email"
                          label={i18n.t("resetPassword.form.email")}
                          name="email"
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                          autoComplete="email"
                          required
                          className={classes.textField}
                        />
                      </Fade>
                    </Grid>
                    {showAdditionalFields && (
                      <>
                        <Grid item xs={12}>
                          <Fade in={show} timeout={1800}>
                            <Field
                              as={TextField}
                              variant="outlined"
                              fullWidth
                              id="token"
                              label={i18n.t("resetPassword.form.verificationCode")}
                              name="token"
                              error={touched.token && Boolean(errors.token)}
                              helperText={touched.token && errors.token}
                              autoComplete="off"
                              required
                              className={classes.textField}
                            />
                          </Fade>
                        </Grid>
                        <Grid item xs={12}>
                          <Fade in={show} timeout={2100}>
                            <Field
                              as={TextField}
                              variant="outlined"
                              fullWidth
                              type={showPassword ? "text" : "password"}
                              id="newPassword"
                              label={i18n.t("resetPassword.form.newPassword")}
                              name="newPassword"
                              error={
                                touched.newPassword &&
                                Boolean(errors.newPassword)
                              }
                              helperText={
                                touched.newPassword && errors.newPassword
                              }
                              autoComplete="off"
                              required
                              className={classes.textField}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={togglePasswordVisibility}
                                      style={{ color: theme.palette.text.secondary }}
                                    >
                                      {showPassword ? (
                                        <VisibilityIcon />
                                      ) : (
                                        <VisibilityOffIcon />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Fade>
                        </Grid>
                        <Grid item xs={12}>
                          <Fade in={show} timeout={2400}>
                            <Field
                              as={TextField}
                              variant="outlined"
                              fullWidth
                              type={showConfirmPassword ? "text" : "password"}
                              id="confirmPassword"
                              label={i18n.t("resetPassword.form.confirmPassword")}
                              name="confirmPassword"
                              error={
                                touched.confirmPassword &&
                                Boolean(errors.confirmPassword)
                              }
                              helperText={
                                touched.confirmPassword &&
                                errors.confirmPassword
                              }
                              autoComplete="off"
                              required
                              className={classes.textField}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={toggleConfirmPasswordVisibility}
                                      style={{ color: theme.palette.text.secondary }}
                                    >
                                      {showConfirmPassword ? (
                                        <VisibilityIcon />
                                      ) : (
                                        <VisibilityOffIcon />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Fade>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  
                  <Grow in={show} timeout={isResetPasswordButtonClicked ? 2700 : 1800}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      className={classes.submit}
                      disabled={isSubmitting}
                    >
                      {showResetPasswordButton 
                        ? i18n.t("resetPassword.buttons.submitPassword")
                        : i18n.t("resetPassword.buttons.submitEmail")
                      }
                    </Button>
                  </Grow>

                  <Grid container justify="flex-end">
                    <Grid item>
                      <Fade in={show} timeout={3000}>
                        <Link
                          component={RouterLink}
                          to="/signup"
                          className={classes.link}
                        >
                          {i18n.t("resetPassword.buttons.back")}
                        </Link>
                      </Fade>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </div>
        </Grow>
        <Fade in={show} timeout={3500}>
          <Box mt={5} />
        </Fade>
      </Container>
    </div>
  );
};

export default ForgetPassword;
