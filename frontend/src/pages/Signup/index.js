import React, { useState, useEffect } from "react";
import qs from "query-string";

import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import usePlans from "../../hooks/usePlans";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import InputMask from "react-input-mask";
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	IconButton,
	Menu
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import logo from "../../assets/logo.png";
import { i18n } from "../../translate/i18n";
import { LanguageOutlined } from "@material-ui/icons";
import LanguageControl from "../../components/LanguageControl";

import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";

const Copyright = () => {
	return (
		<Typography variant="body2" align="center" style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
			{"© "}
			<Link style={{ color: "#1d4ed8", textDecoration: "none" }} href="#">
				Innovation IA
			</Link>{" "}
			{new Date().getFullYear()}
		</Typography>
	);
};

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
		marginBottom: 10,
	},
	selectControl: {
		marginBottom: 10,
		"& .MuiOutlinedInput-root": {
			borderRadius: 10,
			backgroundColor: "#f9fafb",
			"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
				borderColor: "#1d4ed8",
				borderWidth: 2,
			},
		},
		"& .MuiInputLabel-outlined.Mui-focused": {
			color: "#1d4ed8",
		},
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
		margin: "16px 0",
	},
	planCard: {
		border: "2px solid rgba(29,78,216,0.1)",
		borderRadius: 14,
		padding: "16px 12px",
		cursor: "pointer",
		transition: "all 0.25s ease",
		backgroundColor: "#ffffff",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
		"&:hover": {
			borderColor: "rgba(37,99,235,0.4)",
			backgroundColor: "#f8fafc",
			transform: "translateY(-2px)"
		}
	},
	planCardSelected: {
		borderColor: "#2563eb",
		backgroundColor: "#eff6ff",
		boxShadow: "0 4px 16px rgba(37,99,235,0.15)",
	},
	planName: {
		fontWeight: 700,
		color: "#1e293b",
		fontSize: "1.05rem",
		textTransform: "uppercase",
		letterSpacing: "0.5px"
	},
	planPrice: {
		color: "#1d4ed8",
		fontWeight: 800,
		fontSize: "1.4rem",
		margin: "8px 0"
	},
	planDetails: {
		fontSize: "0.8rem",
		color: "#64748b",
		textAlign: "center",
		fontWeight: 500,
		marginTop: 8
	},
	planBadge: {
		backgroundColor: "#dbeafe",
		color: "#1d4ed8",
		padding: "2px 8px",
		borderRadius: 12,
		fontSize: "0.7rem",
		fontWeight: 700,
		marginBottom: 8
	}
}));

const UserSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, i18n.t("signup.formErrors.name.short"))
		.max(50, i18n.t("signup.formErrors.name.long"))
		.required(i18n.t("signup.formErrors.name.required")),
	password: Yup.string()
		.min(5, i18n.t("signup.formErrors.password.short"))
		.max(50, i18n.t("signup.formErrors.password.long")),
	email: Yup.string()
		.email(i18n.t("signup.formErrors.email.invalid"))
		.required(i18n.t("signup.formErrors.email.required")),
	planId: Yup.number().required("Por favor, selecione um plano."),
});

const SignUp = () => {
	const classes = useStyles();
	const history = useHistory();
	let companyId = null;

	const params = qs.parse(window.location.search);
	if (params.companyId !== undefined) {
		companyId = params.companyId;
	}

	const initialState = { name: "", email: "", phone: "", password: "", planId: "" };

	const [user] = useState(initialState);
	const dueDate = moment().add(3, "day").format();

	const handleSignUp = async values => {
		Object.assign(values, { recurrence: "MENSAL" });
		Object.assign(values, { dueDate: dueDate });
		Object.assign(values, { status: "t" });
		Object.assign(values, { campaignsEnabled: true });
		try {
			await openApi.post("/companies/cadastro", values);
			toast.success(i18n.t("signup.toasts.success"));
			history.push("/login");
		} catch (err) {
			console.log(err);
			toastError(err);
		}
	};

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

	const [plans, setPlans] = useState([]);
	const { getPlanList: listPlans } = usePlans();

	useEffect(() => {
		async function fetchData() {
			const list = await listPlans({ listPublic: "false" });
			setPlans(list);
		}
		fetchData();
	}, []);

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

					<Typography className={classes.title}>{i18n.t("signup.greetings.welcome")}</Typography>
					<Typography className={classes.subtitle}>{i18n.t("signup.greetings.subtitle")}</Typography>

					<Formik
						initialValues={user}
						enableReinitialize={true}
						validationSchema={UserSchema}
						onSubmit={(values, actions) => {
							setTimeout(() => {
								handleSignUp(values);
								actions.setSubmitting(false);
							}, 400);
						}}
					>
						{({ touched, errors, isSubmitting, setFieldValue, values }) => (
							<Form className={classes.form}>
								<Grid container spacing={1}>
									<Grid item xs={12}>
										<Field
											as={TextField}
											className={classes.textField}
											autoComplete="name"
											name="name"
											error={touched.name && Boolean(errors.name)}
											helperText={touched.name && errors.name}
											variant="outlined"
											fullWidth
											size="small"
											id="name"
											label={i18n.t("signup.form.name")}
										/>
									</Grid>

									<Grid item xs={12}>
										<Field
											as={TextField}
											className={classes.textField}
											variant="outlined"
											fullWidth
											size="small"
											id="email"
											label={i18n.t("signup.form.email")}
											name="email"
											error={touched.email && Boolean(errors.email)}
											helperText={touched.email && errors.email}
											autoComplete="email"
											required
										/>
									</Grid>

									<Grid item xs={12}>
										<Field name="phone">
											{({ field, form }) => (
												<InputMask
													mask="(99) 99999-9999"
													{...field}
													onChange={e => form.setFieldValue("phone", e.target.value)}
												>
													{() => (
														<TextField
															className={classes.textField}
															variant="outlined"
															fullWidth
															size="small"
															id="phone"
															label={i18n.t("signup.form.phone")}
															error={form.touched.phone && Boolean(form.errors.phone)}
															helperText={form.touched.phone && form.errors.phone}
															autoComplete="phone"
															required
														/>
													)}
												</InputMask>
											)}
										</Field>
									</Grid>

									<Grid item xs={12}>
										<Field
											as={TextField}
											className={classes.textField}
											variant="outlined"
											fullWidth
											size="small"
											name="password"
											error={touched.password && Boolean(errors.password)}
											helperText={touched.password && errors.password}
											label={i18n.t("signup.form.password")}
											type="password"
											id="password"
											autoComplete="current-password"
											required
										/>
									</Grid>

									<Grid item xs={12}>
										<Typography variant="subtitle2" style={{marginBottom: 12, color: "#475569", fontWeight: 600, fontSize: "0.85rem"}}>
											ESCOLHA SEU PLANO:
										</Typography>
										<Grid container spacing={2}>
											{plans.map((plan, key) => (
												<Grid item xs={12} sm={6} key={key}>
													<div 
														className={`${classes.planCard} ${values.planId === plan.id ? classes.planCardSelected : ''}`}
														onClick={() => setFieldValue('planId', plan.id)}
													>
														<div className={classes.planBadge}>MAIS ESCOLHIDO</div>
														<Typography className={classes.planName}>{plan.name}</Typography>
														<Typography className={classes.planPrice}>
															R$ {plan.value}
															<span style={{fontSize: "0.8rem", color: "#64748b", fontWeight: 500}}> /mês</span>
														</Typography>
														<div style={{width: "80%", height: 1, backgroundColor: "#e2e8f0", margin: "8px 0"}}></div>
														<Typography className={classes.planDetails}>
															✓ {plan.users} Atendentes<br/>
															✓ {plan.connections} Conexões<br/>
															✓ {plan.queues} Filas
														</Typography>
													</div>
												</Grid>
											))}
										</Grid>
										{touched.planId && errors.planId && (
											<Typography variant="caption" color="error" style={{display: "block", marginTop: 8}}>{errors.planId}</Typography>
										)}
									</Grid>
								</Grid>

								<Button
									type="submit"
									fullWidth
									variant="contained"
									className={classes.submit}
									disabled={isSubmitting || !values.planId}
								>
									{i18n.t("signup.buttons.submit")}
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
											{i18n.t("signup.buttons.login")}
										</Link>
									</Grid>
								</Grid>
							</Form>
						)}
					</Formik>
				</div>

				<Box mt={3}>
					<Copyright />
				</Box>
			</Container>
		</div>
	);
};

export default SignUp;
