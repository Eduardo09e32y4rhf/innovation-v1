import React, { useState, useEffect } from "react";
import qs from 'query-string'
import LanguageControl from "../../components/LanguageControl";

import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import usePlans from "../../hooks/usePlans";
import {
	Button,
	CssBaseline,
	TextField,
	Link,
	Grid,
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
	Container,
	Grow,
	Fade,
	makeStyles,
	useTheme
} from "@material-ui/core";
import InputMask from 'react-input-mask';
import { i18n } from "../../translate/i18n";

import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";
import logo from "../../assets/logo.png";
const Copyright = () => {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{"Copyright © "}
			<Link color="inherit" href="#">
				PLW
			</Link>{" "}
		   {new Date().getFullYear()}
			{"."}
		</Typography>
	);
};


const useStyles = makeStyles(theme => ({
	root: {
		width: "100%",
		minHeight: "100vh",
		background: theme.palette.type === 'light' 
			? "radial-gradient(circle at 10% 10%, rgba(124, 58, 237, 0.05) 0, transparent 40%), radial-gradient(circle at 90% 90%, rgba(236, 72, 153, 0.05) 0, transparent 40%), #F8FAFC"
			: "radial-gradient(circle at 10% 10%, rgba(124, 58, 237, 0.1) 0, transparent 40%), radial-gradient(circle at 90% 90%, rgba(30, 41, 59, 0.5) 0, transparent 40%), #0f172a",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
		padding: theme.spacing(4, 0),
		position: "relative",
		overflow: "hidden",
	},
	paper: {
		backgroundColor: theme.palette.type === 'light' ? "rgba(255, 255, 255, 0.85)" : "rgba(30, 41, 59, 0.7)",
		backdropFilter: "blur(20px)",
		WebkitBackdropFilter: "blur(20px)",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: "48px",
		borderRadius: "28px",
		border: `1px solid ${theme.palette.type === 'light' ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.1)"}`,
		boxShadow: theme.palette.type === 'light' 
			? "0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
			: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
		width: "100%",
		transition: "all 0.3s ease",
		[theme.breakpoints.down("xs")]: {
			padding: "32px 24px",
		},
	},
	form: {
		width: "100%", 
		marginTop: theme.spacing(4),
	},
	title: {
		fontWeight: 900,
		marginBottom: theme.spacing(1),
		background: theme.palette.type === 'light' 
			? "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)" 
			: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		fontSize: "2.25rem",
	},
	logo: {
		width: "120px",
		marginBottom: theme.spacing(3),
		filter: "drop-shadow(0 10px 15px rgba(124, 58, 237, 0.2))",
	},
	textField: {
		marginBottom: theme.spacing(1),
		"& .MuiOutlinedInput-root": {
			borderRadius: "16px",
			backgroundColor: theme.palette.type === 'light' ? "rgba(255, 255, 255, 0.5)" : "rgba(15, 23, 42, 0.3)",
			transition: "all 0.2s ease",
			"& fieldset": {
				borderColor: theme.palette.type === 'light' ? "#e2e8f0" : "#334155",
			},
			"&:hover fieldset": {
				borderColor: theme.palette.primary.main,
			},
			"&.Mui-focused fieldset": {
				borderWidth: "2px",
			},
		},
		"& input:-webkit-autofill": {
			"-webkit-box-shadow": `0 0 0 100px ${theme.palette.background.paper} inset !important`,
			"-webkit-text-fill-color": `${theme.palette.text.primary} !important`,
		},
	},
	select: {
		color: theme.palette.text.primary,
		textAlign: "left",
		borderRadius: "16px",
		backgroundColor: theme.palette.type === 'light' ? "rgba(255, 255, 255, 0.5)" : "rgba(15, 23, 42, 0.3)",
		"& .MuiOutlinedInput-notchedOutline": {
			borderColor: theme.palette.type === 'light' ? "#e2e8f0" : "#334155",
		},
		"&:hover .MuiOutlinedInput-notchedOutline": {
			borderColor: theme.palette.primary.main,
		},
		"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
			borderWidth: "2px",
		},
	},
	submit: {
		margin: theme.spacing(4, 0, 2),
		padding: "16px",
		borderRadius: "16px",
		background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
		color: "white",
		fontWeight: 700,
		fontSize: "1.1rem",
		boxShadow: `0 10px 15px -3px ${theme.palette.type === 'light' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
		transition: "all 0.3s ease",
		"&:hover": {
			background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
			transform: "translateY(-2px)",
			boxShadow: `0 20px 25px -5px ${theme.palette.type === 'light' ? 'rgba(124, 58, 237, 0.4)' : 'rgba(0, 0, 0, 0.4)'}`,
		}
	},
	link: {
		color: theme.palette.primary.main,
		fontWeight: 600,
		fontSize: "0.9rem",
		textDecoration: "none",
		transition: "all 0.2s ease",
		"&:hover": {
			color: theme.palette.primary.dark,
			textDecoration: "underline"
		}
	},
	inputLabel: {
		color: theme.palette.text.secondary,
		marginBottom: theme.spacing(1),
		textAlign: "left",
		width: "100%",
		fontWeight: 600,
		marginLeft: theme.spacing(1),
	},
	languageControl: {
		position: "absolute",
		top: 30,
		right: 30,
		zIndex: 10,
		padding: "8px",
		borderRadius: "12px",
		backgroundColor: theme.palette.type === 'light' ? "rgba(255, 255, 255, 0.5)" : "rgba(30, 41, 59, 0.5)",
		backdropFilter: "blur(8px)",
	}
}));

const UserSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, i18n.t("signup.formErrors.name.short"))
		.max(50, i18n.t("signup.formErrors.name.long"))
		.required(i18n.t("signup.formErrors.name.required")),
	password: Yup.string().min(5, i18n.t("signup.formErrors.password.short")).max(50, i18n.t("signup.formErrors.password.long")),
	email: Yup.string().email(i18n.t("signup.formErrors.email.invalid")).required(i18n.t("signup.formErrors.email.required")),
});
const SignUp = () => {
	const classes = useStyles();
	const theme = useTheme();
	const history = useHistory();
	let companyId = null;

	const params = qs.parse(window.location.search);
	if (params.companyId !== undefined) {
		companyId = params.companyId;
	}

	const initialState = { name: "", email: "", phone: "", password: "", planId: "", };

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

	const [plans, setPlans] = useState([]);
	const { list: listPlans } = usePlans();

	useEffect(() => {
		async function fetchData() {
			const list = await listPlans();
			setPlans(list);
		}
		fetchData();
	}, [listPlans]);

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
							<Typography component="h1" variant="h4" className={classes.title}>
								{i18n.t("signup.title")}
							</Typography>
						</div>
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
							{({ touched, errors, isSubmitting }) => (
								<Form className={classes.form}>
									<Grid container spacing={2}>
										<Grid item xs={12}>
											<Fade in={show} timeout={1500}>
												<Field
													as={TextField}
													autoComplete="name"
													name="name"
													error={touched.name && Boolean(errors.name)}
													helperText={touched.name && errors.name}
													variant="outlined"
													fullWidth
													id="name"
													label={i18n.t("signup.form.name")}
													className={classes.textField}
												/>
											</Fade>
										</Grid>

										<Grid item xs={12}>
											<Fade in={show} timeout={1800}>
												<Field
													as={TextField}
													variant="outlined"
													fullWidth
													id="email"
													label={i18n.t("signup.form.email")}
													name="email"
													error={touched.email && Boolean(errors.email)}
													helperText={touched.email && errors.email}
													autoComplete="email"
													required
													className={classes.textField}
												/>
											</Fade>
										</Grid>
										
										<Grid item xs={12}>
											<Fade in={show} timeout={2100}>
												<Field
													as={InputMask}
													mask="(99) 99999-9999"
													variant="outlined"
													fullWidth
													id="phone"
													name="phone"
													error={touched.phone && Boolean(errors.phone)}
													helperText={touched.phone && errors.phone}
													autoComplete="phone"
													required
												>
													{({ field }) => (
														<TextField
															{...field}
															variant="outlined"
															fullWidth
															label={i18n.t("signup.form.phone")}
															inputProps={{ maxLength: 11 }}
															className={classes.textField}
														/>
													)}
												</Field>
											</Fade>
										</Grid>

										<Grid item xs={12}>
											<Fade in={show} timeout={2400}>
												<Field
													as={TextField}
													variant="outlined"
													fullWidth
													name="password"
													error={touched.password && Boolean(errors.password)}
													helperText={touched.password && errors.password}
													label={i18n.t("signup.form.password")}
													type="password"
													id="password"
													autoComplete="current-password"
													required
													className={classes.textField}
												/>
											</Fade>
										</Grid>

										<Grid item xs={12}>
											<Fade in={show} timeout={2700}>
												<div style={{ textAlign: "left" }}>
													<InputLabel htmlFor="plan-selection" className={classes.inputLabel}>
														{i18n.t("signup.form.plan")}
													</InputLabel>
													<Field
														as={Select}
														variant="outlined"
														fullWidth
														id="plan-selection"
														name="planId"
														required
														className={classes.select}
														displayEmpty
													>
														<MenuItem value="" disabled>
															<em>Selecione um plano</em>
														</MenuItem>
														{plans.map((plan, key) => (
															<MenuItem key={key} value={plan.id}>
																{plan.name} - R$ {plan.value}
															</MenuItem>
														))}
													</Field>
												</div>
											</Fade>
										</Grid>
									</Grid>

									<Grow in={show} timeout={3000}>
										<Button
											type="submit"
											fullWidth
											variant="contained"
											className={classes.submit}
											disabled={isSubmitting}
										>
											{i18n.t("signup.buttons.submit")}
										</Button>
									</Grow>

									<Grid container justify="flex-end">
										<Grid item>
											<Fade in={show} timeout={3300}>
												<Link
													component={RouterLink}
													to="/login"
													className={classes.link}
												>
													{i18n.t("signup.buttons.login")}
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
					<Box mt={5}><Copyright /></Box>
				</Fade>
			</Container>
		</div>
	);

};

export default SignUp;
