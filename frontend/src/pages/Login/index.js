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
		background: theme.palette.type === 'light' 
			? "radial-gradient(circle at 10% 10%, rgba(124, 58, 237, 0.05) 0, transparent 40%), radial-gradient(circle at 90% 90%, rgba(236, 72, 153, 0.05) 0, transparent 40%), #f5f5f5"
			: "radial-gradient(circle at 10% 10%, rgba(124, 58, 237, 0.1) 0, transparent 40%), radial-gradient(circle at 90% 90%, rgba(30, 41, 59, 0.5) 0, transparent 40%), #0f172a",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
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
		width: "140px",
		marginBottom: theme.spacing(3),
		filter: "drop-shadow(0 10px 15px rgba(124, 58, 237, 0.2))",
	},
	textField: {
		marginBottom: theme.spacing(2.5),
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
	signUpText: {
		marginTop: theme.spacing(5),
		color: theme.palette.text.secondary,
		fontSize: "0.95rem"
	},
	signUpLink: {
		color: theme.palette.primary.main,
		fontWeight: 800,
		marginLeft: theme.spacing(1),
		cursor: "pointer",
		"&:hover": {
			textDecoration: "underline"
		}
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
