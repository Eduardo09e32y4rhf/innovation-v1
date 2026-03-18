import React, { useState, useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
	Button,
	CssBaseline,
	TextField,
	Link,
	Grid,
	Box,
	Typography,
	Container,
	InputAdornment,
	Grow,
	Fade,
	CircularProgress,
	makeStyles,
	useTheme
} from "@material-ui/core";
import {
	AccountCircle,
	Lock
} from "@material-ui/icons";

import { versionSystem } from "../../../package.json";
import { i18n } from "../../translate/i18n";
import { nomeEmpresa } from "../../../package.json";
import { AuthContext } from "../../context/Auth/AuthContext";
import logo from "../../assets/logo.png";
import LanguageControl from "../../components/LanguageControl";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";


const Copyright = () => {
	return (
		<Typography variant="body2" color="primary" align="center">
			{"Copyright "}
 			<Link color="primary" href="#">
 				{ nomeEmpresa } - v { versionSystem }
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
		background: theme.palette.type === 'light' ? "#f8fafc" : "#0f172a",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
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
			backgroundColor: theme.palette.type === 'light' ? "#5225b2" : "#9333ea", // slightly darker or different tone
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
	signUpText: {
		marginTop: theme.spacing(5),
		color: theme.palette.text.secondary,
		fontSize: "0.9rem"
	},
	signUpLink: {
		color: theme.palette.type === 'light' ? "#682EE3" : theme.palette.primary.main,
		fontWeight: "bold",
		marginLeft: theme.spacing(1),
		cursor: "pointer",
		"&:hover": {
			textDecoration: "underline"
		}
	},
	languageControl: {
		position: "absolute",
		top: 20,
		right: 20,
		zIndex: 10
	}
}));

const UserSchema = Yup.object().shape({
	email: Yup.string()
		.email("Invalid email")
		.required("Required"),
	password: Yup.string()
		.min(5, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
});

const Login = () => {
	const classes = useStyles();
	const theme = useTheme();
	const [show, setShow] = useState(false);
	const [user] = useState({ email: "", password: "" });

	useEffect(() => {
		setShow(true);
	}, []);

	const { handleLogin, loading } = useContext(AuthContext);

	const handleSubmit = values => {
		console.log("handleSubmit triggered with values:", values);
		handleLogin(values);
	};

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
						<Fade in={show} timeout={1500}>
							<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
								<img src={logo} alt="logo" className={classes.logo} />
								<Typography component="h1" variant="h4" className={classes.title}>
									{i18n.t("login.title")}
								</Typography>
							</div>
						</Fade>

						<Formik
							initialValues={user}
							enableReinitialize={true}
							validationSchema={UserSchema}
							onSubmit={(values, actions) => {
								console.log("Formik onSubmit triggered");
								handleSubmit(values);
								actions.setSubmitting(false);
							}}
						>
							{({ touched, errors, isSubmitting, values, handleChange }) => (
								<Form className={classes.form}>
									<Field
										as={TextField}
										variant="outlined"
										fullWidth
										id="email"
										label={i18n.t("login.form.email")}
										name="email"
										error={touched.email && Boolean(errors.email)}
										helperText={touched.email && errors.email}
										autoComplete="email"
										autoFocus
										className={classes.textField}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<AccountCircle style={{ color: theme.palette.text.secondary }} />
												</InputAdornment>
											),
										}}
									/>

									<Field
										as={TextField}
										variant="outlined"
										fullWidth
										name="password"
										id="password"
										label={i18n.t("login.form.password")}
										type="password"
										error={touched.password && Boolean(errors.password)}
										helperText={touched.password && errors.password}
										autoComplete="current-password"
										className={classes.textField}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<Lock style={{ color: theme.palette.text.secondary }} />
												</InputAdornment>
											),
										}}
									/>

									<Grid container justify="flex-end">
										<Link
											component={RouterLink}
											to="/forgetpsw"
											className={classes.link}
										>
											{i18n.t("login.buttons.forgetPassword")}
										</Link>
									</Grid>

									<Button
										type="submit"
										fullWidth
										variant="contained"
										className={classes.submit}
										// disabled={loading}
									>
										{loading ? <CircularProgress size={24} style={{ color: "white" }} /> : i18n.t("login.buttons.submit")}
									</Button>

									<Typography className={classes.signUpText}>
										{i18n.t("login.buttons.noAccount")}
										<Link
											component={RouterLink}
											to="/signup"
											className={classes.signUpLink}
											underline="none"
										>
											{i18n.t("login.buttons.register")}
										</Link>
									</Typography>
								</Form>
							)}
						</Formik>
					</div>
				</Grow>
				<Fade in={show} timeout={4000}>
					<Box mt={4}><Copyright /></Box>
				</Fade>
			</Container>
		</div>
	);
};

export default Login;
