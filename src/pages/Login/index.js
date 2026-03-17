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
	makeStyles
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
			zIndex: -1,
			pointerEvents: "none"
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
		zIndex: 2,
		position: "relative",
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
	signUpText: {
		marginTop: theme.spacing(5),
		color: "rgba(255, 255, 255, 0.5)",
		fontSize: "0.9rem"
	},
	signUpLink: {
		color: "white",
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
							<Typography component="h1" variant="h4" className={classes.title}>
								{i18n.t("login.title")}
							</Typography>
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
													<AccountCircle style={{ color: "rgba(255, 255, 255, 0.4)" }} />
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
													<Lock style={{ color: "rgba(255, 255, 255, 0.4)" }} />
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

									{/* Temporary diagnostic button */}
									<Button
										fullWidth
										variant="outlined"
										style={{ color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.2)", marginTop: 8 }}
										onClick={() => {
											window.alert("Tentando login forçado com admin@admin.com");
											handleLogin({ email: 'admin@admin.com', password: 'password' });
										}}
									>
										DEBUG: FORCAR LOGIN
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
