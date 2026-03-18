import React, { useState, useContext, useEffect } from "react";
import clsx from "clsx";
import moment from "moment";
import {
  makeStyles,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  MenuItem,
  IconButton,
  Menu,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircle from "@material-ui/icons/AccountCircle";
import CachedIcon from "@material-ui/icons/Cached";

import MainListItems from "./MainListItems";
import NotificationsPopOver from "../components/NotificationsPopOver";
import NotificationsVolume from "../components/NotificationsVolume";
import UserModal from "../components/UserModal";
import { AuthContext } from "../context/Auth/AuthContext";
import BackdropLoading from "../components/BackdropLoading";
import DarkMode from "../components/DarkMode";
import { i18n } from "../translate/i18n";
import toastError from "../errors/toastError";
import AnnouncementsPopover from "../components/AnnouncementsPopover";

import logo from "../assets/logo.png";
import { SocketContext } from "../context/Socket/SocketContext";
import ChatPopover from "../pages/Chat/ChatPopover";

import { useDate } from "../hooks/useDate";

import ColorModeContext from "../layout/themeContext";
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import LanguageControl from "../components/LanguageControl";
import { LanguageOutlined, SettingsOutlined } from "@material-ui/icons";
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import Avatar from "@material-ui/core/Avatar";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    backgroundColor: theme.palette.type === 'light' ? '#f8fafc' : '#0f172a',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.type === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.8)',
    backdropFilter: "blur(12px)",
    color: theme.palette.text.primary,
    boxShadow: "none",
    borderBottom: `1px solid ${theme.palette.type === 'light' ? '#f1f5f9' : '#1e293b'}`,
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: {
    paddingRight: 24,
    minHeight: 64,
  },
  drawerPaper: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: theme.palette.type === 'light' ? '#ffffff' : '#0f172a',
    borderRight: `1px solid ${theme.palette.type === 'light' ? '#f1f5f9' : '#1e293b'}`,
    boxShadow: "none",
    overflowX: "hidden",
    position: "relative",
    ...theme.scrollbarStylesSoft,
  },
  drawerPaperClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(9),
    overflowX: "hidden",
  },
  content: {
    flex: 1,
    height: "100vh",
    overflow: "auto",
    padding: theme.spacing(3),
  },
  appBarSpacer: {
    minHeight: 64,
  },
  title: {
    flexGrow: 1,
    fontSize: "1.25rem",
    fontWeight: 700,
    color: theme.palette.type === 'light' ? "#682ee2" : theme.palette.primary.main, // Innovation Violet / adapted
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
    maxHeight: 32,
    objectFit: "contain",
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "0 24px",
    minHeight: 64,
  },
  greeting: {
    fontSize: "0.875rem",
    color: theme.palette.type === 'light' ? "#64748b" : "#cbd5e1",
    marginBottom: theme.spacing(3),
    "& span": {
      fontWeight: 600,
      color: theme.palette.type === 'light' ? "#682ee2" : theme.palette.primary.main,
    },
  },
  avatar: {
    width: 32,
    height: 32,
    fontSize: "0.75rem",
    fontWeight: 600,
    backgroundColor: "#682ee2",
    color: "#ffffff",
  },
  containerWithScroll: {
    flex: 1,
    overflowY: "auto",
    ...theme.scrollbarStylesSoft,
  },
}));

const LoggedInLayout = ({ children, themeToggle }) => {
  const classes = useStyles();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleLogout, loading } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerVariant, setDrawerVariant] = useState("permanent");
  // const [dueDate, setDueDate] = useState("");
  const { user } = useContext(AuthContext);

  const theme = useTheme();
  const { colorMode } = useContext(ColorModeContext);
  const greaterThenSm = useMediaQuery(theme.breakpoints.up("sm"));

  const [volume, setVolume] = useState(localStorage.getItem("volume") || 1);

  const { dateToClient } = useDate();

  // Languages
  const [anchorElLanguage, setAnchorElLanguage] = useState(null);
  const [menuLanguageOpen, setMenuLanguageOpen] = useState(false);

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    if (document.body.offsetWidth > 1200) {
      setDrawerOpen(true);
    }
  }, []);

  useEffect(() => {
    if (document.body.offsetWidth < 600) {
      setDrawerVariant("temporary");
    } else {
      setDrawerVariant("permanent");
    }
  }, [drawerOpen]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const userId = localStorage.getItem("userId");

    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-auth`, (data) => {
      if (data.user.id === +userId) {
        toastError("Sua conta foi acessada em outro computador.");
        setTimeout(() => {
          localStorage.clear();
          window.location.reload();
        }, 1000);
      }
    });

    socket.emit("userStatus");
    const interval = setInterval(() => {
      socket.emit("userStatus");
    }, 1000 * 60 * 5);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [socketManager]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handlemenuLanguage = ( event ) => {
    setAnchorElLanguage(event.currentTarget);
    setMenuLanguageOpen( true );
  }

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleCloseMenuLanguage = (  ) => {
    setAnchorElLanguage(null);
    setMenuLanguageOpen(false);
  }

  const handleOpenUserModal = () => {
    setUserModalOpen(true);
    handleCloseMenu();
  };

  const handleClickLogout = () => {
    handleCloseMenu();
    handleLogout();
  };

  const drawerClose = () => {
    if (document.body.offsetWidth < 600) {
      setDrawerOpen(false);
    }
  };

  const handleRefreshPage = () => {
    window.location.reload(false);
  }

  const handleMenuItemClick = () => {
    const { innerWidth: width } = window;
    if (width <= 600) {
      setDrawerOpen(false);
    }
  };

  const toggleColorMode = () => {
    colorMode.toggleColorMode();
  }

  if (loading) {
    return <BackdropLoading />;
  }

  return (
    <div className={classes.root}>
      <Drawer
        variant={drawerVariant}
        className={drawerOpen ? classes.drawerPaper : classes.drawerPaperClose}
        classes={{
          paper: clsx(
            classes.drawerPaper,
            !drawerOpen && classes.drawerPaperClose
          ),
        }}
        open={drawerOpen}
      >
        <div className={classes.toolbarIcon}>
          <img src={logo} className={classes.logo} alt="logo" />
          <Typography variant="h6" className={classes.title} style={{ marginLeft: 12, fontSize: "1.25rem" }}>
            Innovation
          </Typography>
        </div>
        <List className={classes.containerWithScroll}>
          <MainListItems drawerClose={drawerClose} collapsed={!drawerOpen} />
        </List>
      </Drawer>
      <UserModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        userId={user?.id}
      />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}
        elevation={0}
      >
        <Toolbar variant="dense" className={classes.toolbar}>
          <IconButton
            edge="start"
            aria-label="open drawer"
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={clsx(
              classes.menuButton,
              drawerOpen && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            component="h2"
            variant="h6"
            noWrap
            className={classes.title}
          >
            {/* Title can be empty or dynamically set per page */}
          </Typography>
          
          <div>
            <IconButton edge="start">
              <LanguageOutlined
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handlemenuLanguage}
                style={{ color: theme.palette.text.primary, marginRight:10 }}
              />
            </IconButton>
            <Menu
              id="menu-appbar-language"
              anchorEl={anchorElLanguage}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={menuLanguageOpen}
              onClose={handleCloseMenuLanguage}
            >
              <MenuItem>
                <LanguageControl />
              </MenuItem>
            </Menu>
          </div>          

          <IconButton edge="start" onClick={toggleColorMode}>
            {theme.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <NotificationsVolume
            setVolume={setVolume}
            volume={volume}
          />

          <IconButton
            onClick={handleRefreshPage}
            aria-label={i18n.t("mainDrawer.appBar.refresh")}
            color="inherit"
          >
            <CachedIcon />
          </IconButton>

          {user.id && <NotificationsPopOver volume={volume} />}

          <AnnouncementsPopover />

          <ChatPopover />

          <IconButton color="inherit">
            <NotificationsNoneOutlinedIcon />
          </IconButton>

          <IconButton color="inherit">
            <SettingsOutlined />
          </IconButton>

          <div style={{ marginLeft: 12 }}>
            <Avatar 
              className={classes.avatar}
              onClick={handleMenu}
              style={{ cursor: "pointer" }}
            >
              {user.name ? user.name.substring(0, 2).toUpperCase() : "IN"}
            </Avatar>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={menuOpen}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleOpenUserModal}>
                {i18n.t("mainDrawer.appBar.user.profile")}
              </MenuItem>
              <MenuItem onClick={handleClickLogout}>
                {i18n.t("mainDrawer.appBar.user.logout")}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Typography className={classes.greeting}>
          Olá <span>{user.name}</span>, bem-vindo de volta!
        </Typography>
        {children ? children : null}
      </main>
    </div>
  );
};

export default LoggedInLayout;
