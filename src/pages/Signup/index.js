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
	makeStyles
} from "@material-ui/core";
import InputMask from 'react-input-mask';
import { i18n } from "../../translate/i18n";

import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";
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
		width: "100vw",
		minHeight: "100vh",
		background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
		position: "relative",
		overflowX: "hidden",
		padding: theme.spacing(4, 0),
		"&::before": {
			content: '""',
			position: "absolute",
			top: "-50%",
			left: "-50%",
			width: "200%",
			height: "200%",
			background: "radial-gradient(circle, rgba(255,0,255,0.05) 0%, transparent 50%)",
			animation: "$bgMove 20s linear infinite",
			zIndex: 0
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
	select: {
		color: "white",
		textAlign: "left",
		"& .MuiOutlinedInput-notchedOutline": {
			borderColor: "rgba(255, 255, 255, 0.3)",
			borderRadius: "12px",
		},
		"&:hover .MuiOutlinedInput-notchedOutline": {
			borderColor: "rgba(255, 255, 255, 0.6)",
		},
		"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
			borderColor: "#682EE3",
		},
		"& .MuiSvgIcon-root": {
			color: "rgba(255, 255, 255, 0.6)",
		}
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
	inputLabel: {
		color: "rgba(255, 255, 255, 0.6)",
		marginBottom: theme.spacing(1),
		textAlign: "left",
		width: "100%"
	},
	languageControl: {
		position: "absolute",
		top: 20,
		right: 20,
		zIndex: 10
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
						<Typography component="h1" variant="h4" className={classes.title}>
							{i18n.t("signup.title")}
						</Typography>
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
