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
	makeStyles
} from "@material-ui/core";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import moment from "moment";
import { toast } from 'react-toastify'; 
import toastError from '../../errors/toastError';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-50%",
      left: "-50%",
      width: "200%",
      height: "200%",
      background: "radial-gradient(circle, rgba(255,0,255,0.05) 0%, transparent 50%)",
      animation: "$bgMove 20s linear infinite",
    }
  },
  "@keyframes bgMove": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" }
  },
  paper: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(15px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    width: "100%",
    position: "relative",
    zIndex: 1
  },
  form: {
    width: "100%", 
    marginTop: theme.spacing(3),
  },
  title: {
    fontWeight: 800,
    marginBottom: theme.spacing(3),
    color: "white",
    letterSpacing: "1px",
    textTransform: "uppercase"
  },
  textField: {
    marginBottom: theme.spacing(2),
    "& .MuiInputBase-root": {
      color: "white",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.6)",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: "12px",
      },
      "&:hover fieldset": {
        borderColor: "rgba(255, 255, 255, 0.6)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#682EE3",
      },
    },
    "& input:-webkit-autofill": {
      "-webkit-box-shadow": "0 0 0 100px #24243e inset !important",
      "-webkit-text-fill-color": "white !important",
    },
  },
  submit: {
    margin: theme.spacing(4, 0, 2),
    padding: "14px",
    borderRadius: "12px",
    backgroundColor: "#682EE3",
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#5225b2",
      transform: "translateY(-2px)",
      boxShadow: "0 5px 15px rgba(104, 46, 227, 0.4)",
    }
  },
  link: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "0.85rem",
    textDecoration: "none",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "white"
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
            <Typography component="h1" variant="h5" className={classes.title}>
              {i18n.t("resetPassword.title")}
            </Typography>
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
                                      style={{ color: "rgba(255, 255, 255, 0.6)" }}
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
                                      style={{ color: "rgba(255, 255, 255, 0.6)" }}
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
