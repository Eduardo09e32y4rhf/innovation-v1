import React, { useState } from "react";
import qs from "query-string";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Menu } from "@material-ui/core";
import { LanguageOutlined } from "@material-ui/icons";
import LanguageControl from "../../components/LanguageControl";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import moment from "moment";
import logo from "../../assets/logo.png";
import { toast } from "react-toastify";
import toastError from "../../errors/toastError";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles(theme => ({
	root: {
		width: "100vw",
		minHeight: "100vh",
		background: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 40%, #f5f7ff 100%)",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: "24px 0",
		position: "relative",
		fontFamily: "'Inter', 'Segoe UI', sans-serif",
	},
	decorCircle1: {
		position: "fixed",
		width: 400,
		height: 400,
		borderRadius: "50%",
		background: "radial-gradient(circle, rgba(29,78,216,0.07) 0%, rgba(29,78,216,0) 70%)",
		top: "-80px",
		right: "-60px",
		pointerEvents: "none",
	},
	decorCircle2: {
		position: "fixed",
		width: 300,
		height: 300,
		borderRadius: "50%",
		background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(99,102,241,0) 70%)",
		bottom: "-50px",
		left: "-40px",
		pointerEvents: "none",
	},
	paper: {
		backgroundColor: "#ffffff",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: "40px 40px 32px",
		borderRadius: "20px",
		boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 60px -10px rgba(29,78,216,0.12), 0 0 0 1px rgba(29,78,216,0.06)",
		position: "relative",
		overflow: "hidden",
		animation: "$fadeInUp 0.5s ease",
	},
	"@keyframes fadeInUp": {
		from: { opacity: 0, transform: "translateY(20px)" },
		to: { opacity: 1, transform: "translateY(0)" },
	},
	accentBar: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: 4,
		background: "linear-gradient(90deg, #1d4ed8, #4f46e5, #1d4ed8)",
		backgroundSize: "200% 100%",
		animation: "$shimmer 3s linear infinite",
	},
	"@keyframes shimmer": {
		"0%": { backgroundPosition: "0% 0%" },
		"100%": { backgroundPosition: "200% 0%" },
	},
	logoContainer: {
		marginBottom: 20,
		padding: "8px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
		"&::after": {
			content: '""',
			position: "absolute",
			width: "120%",
			height: "50%",
			bottom: "-10px",
			background: "radial-gradient(ellipse at center, rgba(29,78,216,0.15) 0%, rgba(255,255,255,0) 70%)",
			zIndex: -1,
			filter: "blur(5px)",
		}
	},
	logoText: {
		fontSize: "2.4rem",
		fontWeight: 900,
		letterSpacing: "-1.5px",
		background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		textTransform: "uppercase",
		margin: 0,
		filter: "drop-shadow(0px 4px 6px rgba(29,78,216,0.15))",
	},
	title: {
		fontSize: "1.35rem",
		fontWeight: 700,
		color: "#111827",
		marginBottom: 4,
		letterSpacing: "-0.3px",
	},
	subtitle: {
		fontSize: "0.875rem",
		color: "#6b7280",
		marginBottom: 20,
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(1),
	},
	textField: {
		"& .MuiOutlinedInput-root": {
			borderRadius: 10,
			backgroundColor: "#f9fafb",
			"&:hover .MuiOutlinedInput-notchedOutline": {
				borderColor: "#93c5fd",
			},
			"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
				borderColor: "#1d4ed8",
				borderWidth: 2,
			},
		},
		"& .MuiInputLabel-outlined": {
			color: "#6b7280",
		},
		"& .MuiInputLabel-outlined.Mui-focused": {
			color: "#1d4ed8",
		},
		marginBottom: 12,
	},
	submit: {
		margin: theme.spacing(2, 0, 1.5),
		borderRadius: 10,
		padding: "12px 0",
		background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
		color: "#fff",
		fontWeight: 700,
		fontSize: "0.95rem",
		letterSpacing: "0.5px",
		textTransform: "uppercase",
		boxShadow: "0 4px 14px rgba(29,78,216,0.35)",
		transition: "all 0.25s ease",
		"&:hover": {
			background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
			boxShadow: "0 6px 20px rgba(29,78,216,0.45)",
			transform: "translateY(-1px)",
		},
	},
	linkText: {
		color: "#1d4ed8",
		fontWeight: 500,
		fontSize: "0.875rem",
		textDecoration: "none",
		"&:hover": {
			textDecoration: "underline",
		},
	},
	languageControl: {
		position: "absolute",
		top: 12,
		left: 12,
		zIndex: 10,
	},
	langIcon: {
		color: "#6b7280",
		"&:hover": { color: "#1d4ed8" },
	},
	divider: {
		width: "100%",
		height: 1,
		background: "linear-gradient(90deg, transparent, #e5e7eb, transparent)",
		margin: "12px 0",
	},
	infoBox: {
		width: "100%",
		background: "linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)",
		border: "1px solid rgba(29,78,216,0.15)",
		borderRadius: 10,
		padding: "12px 16px",
		marginBottom: 16,
		textAlign: "left",
	},
	infoText: {
		color: "#1d4ed8",
		fontSize: "0.82rem",
		fontWeight: 500,
	},
	successBox: {
		width: "100%",
		background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
		border: "1px solid rgba(22,163,74,0.2)",
		borderRadius: 10,
		padding: "12px 16px",
		marginBottom: 16,
		textAlign: "center",
	},
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
	const [emailSent, setEmailSent] = useState(false);

	const [anchorElLanguage, setAnchorElLanguage] = useState(null);
	const [menuLanguageOpen, setMenuLanguageOpen] = useState(false);

	const handlemenuLanguage = event => {
		setAnchorElLanguage(event.currentTarget);
		setMenuLanguageOpen(true);
	};

	const handleCloseMenuLanguage = () => {
		setAnchorElLanguage(null);
		setMenuLanguageOpen(false);
	};

	const togglePasswordVisibility = () => setShowPassword(!showPassword);
	const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

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

	const handleSendEmail = async values => {
		const email = values.email;
		try {
			const response = await api.post(
				`${process.env.REACT_APP_BACKEND_URL}/forgetpassword/${email}`
			);
			if (response.data.status === 404) {
				toast.error(i18n.t("resetPassword.toasts.emailNotFound"));
			} else {
				setEmailSent(true);
				toast.success(i18n.t("resetPassword.toasts.emailSent"));
			}
		} catch (err) {
			toastError(err);
		}
	};

	const handleResetPassword = async values => {
		const { email, token, newPassword, confirmPassword } = values;
		if (newPassword === confirmPassword) {
			try {
				await api.post(
					`${process.env.REACT_APP_BACKEND_URL}/resetpasswords/${email}/${token}/${newPassword}`
				);
				toast.success(i18n.t("resetPassword.toasts.passwordUpdated"));
				history.push("/login");
			} catch (err) {
				console.log(err);
			}
		}
	};

	const isResetPasswordButtonClicked = showResetPasswordButton;
	const UserSchema = Yup.object().shape({
		email: Yup.string()
			.email(i18n.t("resetPassword.formErrors.email.invalid"))
			.required(i18n.t("resetPassword.formErrors.email.required")),
		newPassword: isResetPasswordButtonClicked
			? Yup.string()
					.required(i18n.t("resetPassword.formErrors.newPassword.required"))
					.matches(passwordRegex, i18n.t("resetPassword.formErrors.newPassword.matches"))
			: Yup.string(),
		confirmPassword: Yup.string().when("newPassword", {
			is: newPassword => isResetPasswordButtonClicked && newPassword,
			then: Yup.string()
				.oneOf([Yup.ref("newPassword"), null], i18n.t("resetPassword.formErrors.confirmPassword.matches"))
				.required(i18n.t("resetPassword.formErrors.confirmPassword.required")),
			otherwise: Yup.string(),
		}),
	});

	return (
		<div className={classes.root}>
			<div className={classes.decorCircle1} />
			<div className={classes.decorCircle2} />

			<div className={classes.languageControl}>
				<IconButton size="small">
					<LanguageOutlined
						aria-label="language"
						aria-controls="menu-appbar"
						aria-haspopup="true"
						onClick={handlemenuLanguage}
						className={classes.langIcon}
					/>
				</IconButton>
				<Menu
					id="menu-appbar-language"
					anchorEl={anchorElLanguage}
					getContentAnchorEl={null}
					anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
					transformOrigin={{ vertical: "top", horizontal: "right" }}
					open={menuLanguageOpen}
					onClose={handleCloseMenuLanguage}
				>
					<LanguageControl />
				</Menu>
			</div>

			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<div className={classes.accentBar} />

					<div className={classes.logoContainer}>
						<Typography className={classes.logoText}>INNOVATION</Typography>
					</div>

					<Typography className={classes.title}>
						{showAdditionalFields ? i18n.t("resetPassword.greetings.welcomeReset") : i18n.t("resetPassword.greetings.welcome")}
					</Typography>
					<Typography className={classes.subtitle}>
						{showAdditionalFields
							? i18n.t("resetPassword.greetings.subtitleReset")
							: i18n.t("resetPassword.greetings.subtitle")}
					</Typography>

					{emailSent && !showAdditionalFields && (
						<div className={classes.successBox}>
							<Typography style={{ color: "#16a34a", fontSize: "0.85rem", fontWeight: 600 }}>
								{i18n.t("resetPassword.greetings.emailSent")}
							</Typography>
						</div>
					)}

					<Formik
						initialValues={{ email: "", token: "", newPassword: "", confirmPassword: "" }}
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
								<Grid container spacing={1}>
									<Grid item xs={12}>
										<Field
											as={TextField}
											className={classes.textField}
											variant="outlined"
											fullWidth
											size="small"
											id="email"
											label={i18n.t("resetPassword.form.email")}
											name="email"
											error={touched.email && Boolean(errors.email)}
											helperText={touched.email && errors.email}
											autoComplete="email"
											required
										/>
									</Grid>

									{showAdditionalFields && (
										<>
											<Grid item xs={12}>
												<div className={classes.infoBox}>
													<Typography className={classes.infoText}>
														{i18n.t("resetPassword.greetings.instruction")}
													</Typography>
												</div>
											</Grid>
											<Grid item xs={12}>
												<Field
													as={TextField}
													className={classes.textField}
													variant="outlined"
													fullWidth
													size="small"
													id="token"
													label={i18n.t("resetPassword.form.verificationCode")}
													name="token"
													error={touched.token && Boolean(errors.token)}
													helperText={touched.token && errors.token}
													autoComplete="off"
													required
												/>
											</Grid>
											<Grid item xs={12}>
												<Field
													as={TextField}
													className={classes.textField}
													variant="outlined"
													fullWidth
													size="small"
													type={showPassword ? "text" : "password"}
													id="newPassword"
													label={i18n.t("resetPassword.form.newPassword")}
													name="newPassword"
													error={touched.newPassword && Boolean(errors.newPassword)}
													helperText={touched.newPassword && errors.newPassword}
													autoComplete="off"
													required
													InputProps={{
														endAdornment: (
															<InputAdornment position="end">
																<IconButton onClick={togglePasswordVisibility} size="small">
																	{showPassword ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
																</IconButton>
															</InputAdornment>
														),
													}}
												/>
											</Grid>
											<Grid item xs={12}>
												<Field
													as={TextField}
													className={classes.textField}
													variant="outlined"
													fullWidth
													size="small"
													type={showConfirmPassword ? "text" : "password"}
													id="confirmPassword"
													label={i18n.t("resetPassword.form.confirmPassword")}
													name="confirmPassword"
													error={touched.confirmPassword && Boolean(errors.confirmPassword)}
													helperText={touched.confirmPassword && errors.confirmPassword}
													autoComplete="off"
													required
													InputProps={{
														endAdornment: (
															<InputAdornment position="end">
																<IconButton onClick={toggleConfirmPasswordVisibility} size="small">
																	{showConfirmPassword ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
																</IconButton>
															</InputAdornment>
														),
													}}
												/>
											</Grid>
										</>
									)}
								</Grid>

								<Button
									type="submit"
									fullWidth
									variant="contained"
									className={classes.submit}
									disabled={isSubmitting}
								>
									{showResetPasswordButton
										? i18n.t("resetPassword.buttons.submitPassword")
										: i18n.t("resetPassword.buttons.submitEmail")}
								</Button>

								<div className={classes.divider} />

								<Grid container justify="center">
									<Grid item>
										<Link
											href="#"
											variant="body2"
											component={RouterLink}
											to="/login"
											className={classes.linkText}
										>
											{i18n.t("login.greetings.backToLogin")}
										</Link>
									</Grid>
								</Grid>
							</Form>
						)}
					</Formik>
				</div>

				<Box mt={3}>
					<Typography variant="body2" align="center" style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
						© Innovation IA {new Date().getFullYear()}
					</Typography>
				</Box>
			</Container>
		</div>
	);
};

export default ForgetPassword;
