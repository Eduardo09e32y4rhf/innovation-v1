import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { versionSystem } from "../../../package.json";
import { i18n } from "../../translate/i18n";
import { nomeEmpresa } from "../../../package.json";
import { AuthContext } from "../../context/Auth/AuthContext";
import logo from "../../assets/logo.png";
import { LanguageOutlined } from "@material-ui/icons";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import LanguageControl from "../../components/LanguageControl";

const Copyright = () => {
	return (
		<Typography variant="body2" align="center" style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
			{"© "}
			<Link style={{ color: "#1d4ed8", textDecoration: "none" }} href="#">
				{nomeEmpresa} - v{versionSystem}
			</Link>{" "}
			{new Date().getFullYear()}
		</Typography>
	);
};

const useStyles = makeStyles(theme => ({
	root: {
		width: "100vw",
		height: "100vh",
		background: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 40%, #f5f7ff 100%)",
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
		backgroundPosition: "center",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
		position: "relative",
		fontFamily: "'Inter', 'Segoe UI', sans-serif",
	},
	decorCircle1: {
		position: "absolute",
		width: 400,
		height: 400,
		borderRadius: "50%",
		background: "radial-gradient(circle, rgba(29,78,216,0.07) 0%, rgba(29,78,216,0) 70%)",
		top: "-80px",
		right: "-60px",
		pointerEvents: "none",
	},
	decorCircle2: {
		position: "absolute",
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
		padding: "48px 40px 40px",
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
		marginBottom: 24,
		padding: "10px",
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
		fontSize: "1.4rem",
		fontWeight: 700,
		color: "#111827",
		marginBottom: 4,
		letterSpacing: "-0.3px",
	},
	subtitle: {
		fontSize: "0.875rem",
		color: "#6b7280",
		marginBottom: 24,
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
		"&:active": {
			transform: "translateY(0)",
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
}));

const Login = () => {
	const classes = useStyles();

	const [user, setUser] = useState({ email: "", password: "" });

	const [anchorElLanguage, setAnchorElLanguage] = useState(null);
	const [menuLanguageOpen, setMenuLanguageOpen] = useState(false);

	const { handleLogin } = useContext(AuthContext);

	const handleChangeInput = e => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const handlSubmit = e => {
		e.preventDefault();
		handleLogin(user);
	};

	const handlemenuLanguage = event => {
		setAnchorElLanguage(event.currentTarget);
		setMenuLanguageOpen(true);
	};

	const handleCloseMenuLanguage = () => {
		setAnchorElLanguage(null);
		setMenuLanguageOpen(false);
	};

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

					<Typography className={classes.title}>{i18n.t("login.greetings.welcome")}</Typography>
					<Typography className={classes.subtitle}>{i18n.t("login.greetings.subtitle")}</Typography>

					<form className={classes.form} noValidate onSubmit={handlSubmit}>
						<TextField
							className={classes.textField}
							variant="outlined"
							margin="dense"
							required
							fullWidth
							id="email"
							label={i18n.t("login.form.email")}
							name="email"
							value={user.email}
							onChange={handleChangeInput}
							autoComplete="email"
							autoFocus
						/>
						<TextField
							className={classes.textField}
							variant="outlined"
							margin="dense"
							required
							fullWidth
							name="password"
							label={i18n.t("login.form.password")}
							type="password"
							id="password"
							value={user.password}
							onChange={handleChangeInput}
							autoComplete="current-password"
						/>

						<Grid container justify="flex-end" style={{ marginTop: 4 }}>
							<Grid item>
								<Link component={RouterLink} to="/forgetpsw" className={classes.linkText}>
									{i18n.t("login.greetings.forgotPassword")}
								</Link>
							</Grid>
						</Grid>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							className={classes.submit}
						>
							{i18n.t("login.buttons.submit")}
						</Button>

						<div className={classes.divider} />

						<Grid container justify="center">
							<Grid item>
								<Link
									href="#"
									variant="body2"
									component={RouterLink}
									to="/signup"
									className={classes.linkText}
								>
									{i18n.t("login.buttons.register")}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>

				<Box mt={3}>
					<Copyright />
				</Box>
			</Container>
		</div>
	);
};

export default Login;
