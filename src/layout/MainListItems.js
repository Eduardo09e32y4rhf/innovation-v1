import React, { useContext, useEffect, useReducer, useState } from "react";
import clsx from "clsx";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import { Badge, Collapse, List } from "@material-ui/core";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import ChatOutlinedIcon from "@material-ui/icons/ChatOutlined";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import FlashOnOutlinedIcon from "@material-ui/icons/FlashOnOutlined";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import CodeRoundedIcon from "@material-ui/icons/CodeRounded";
import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import EventAvailableOutlinedIcon from "@material-ui/icons/EventAvailableOutlined";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PeopleOutlinedIcon from "@material-ui/icons/PeopleOutlined";
import ListOutlinedIcon from "@material-ui/icons/ListAltOutlined";
import AnnouncementOutlinedIcon from "@material-ui/icons/AnnouncementOutlined";
import ForumOutlinedIcon from "@material-ui/icons/ForumOutlined";
import LocalAtmOutlinedIcon from '@material-ui/icons/LocalAtmOutlined';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import ViewQuiltOutlinedIcon from '@material-ui/icons/ViewQuiltOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import SchemaOutlinedIcon from '@material-ui/icons/AccountTreeOutlined';
import RotateRight from "@material-ui/icons/RotateRight";
import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import LoyaltyRoundedIcon from '@material-ui/icons/LoyaltyRounded';
import { Can } from "../components/Can";
import { SocketContext } from "../context/Socket/SocketContext";
import { isArray } from "lodash";
import TableChartIcon from '@material-ui/icons/TableChart';
import api from "../services/api";
import BorderColorIcon from '@material-ui/icons/BorderColor';
import ToDoList from "../pages/ToDoList/";
import toastError from "../errors/toastError";
import { makeStyles } from "@material-ui/core/styles";
import { AccountTree, AllInclusive, AttachFile, BlurCircular, Chat, DeviceHubOutlined, Schedule } from '@material-ui/icons';
import usePlans from "../hooks/usePlans";
import Typography from "@material-ui/core/Typography";
import { ShapeLine } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  ListSubheader: {
    height: 36,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    color: theme.palette.type === 'light' ? "#64748b" : "#94a3b8", // Slate 500 / Slate 400
    fontWeight: 700,
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    paddingLeft: theme.spacing(3),
    display: "flex",
    alignItems: "center",
  },
  listItem: {
    margin: "4px 16px",
    borderRadius: "10px",
    minHeight: "44px",
    transition: "all 0.2s ease-in-out",
    color: theme.palette.type === 'light' ? "#64748b" : "#94a3b8",
    "&:hover": {
      backgroundColor: theme.palette.type === 'light' ? "#f8fafc" : "rgba(255, 255, 255, 0.05)",
      color: theme.palette.type === 'light' ? "#682ee2" : "#a78bfa",
      "& .MuiListItemIcon-root": {
        color: theme.palette.type === 'light' ? "#682ee2" : "#a78bfa",
      },
    },
    "&.Mui-selected": {
      backgroundColor: theme.palette.type === 'light' ? "#f3f0ff" : "rgba(167, 139, 250, 0.1)",
      color: theme.palette.type === 'light' ? "#682ee2" : "#a78bfa",
      "& .MuiListItemIcon-root": {
        color: theme.palette.type === 'light' ? "#682ee2" : "#a78bfa",
      },
      "& .MuiListItemText-primary": {
        fontWeight: 600,
      },
      "&:hover": {
        backgroundColor: theme.palette.type === 'light' ? "#f3f0ff" : "rgba(167, 139, 250, 0.15)",
      },
    },
  },
  listItemIcon: {
    minWidth: 40,
    color: theme.palette.type === 'light' ? "#64748b" : "#94a3b8",
  },
  listItemText: {
    "& .MuiListItemText-primary": {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
  },
}));


function ListItemLink(props) {
  const { icon, primary, to, className } = props;
  const location = useLocation();
  const classes = useStyles();
  const selected = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem 
        button 
        dense 
        component={renderLink} 
        className={clsx(classes.listItem, className)}
        selected={selected}
      >
        {icon ? <ListItemIcon className={classes.listItemIcon}>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} className={classes.listItemText} />
      </ListItem>
    </li>
  );
}

const reducer = (state, action) => {
  if (action.type === "LOAD_CHATS") {
    const chats = action.payload;
    const newChats = [];

    if (isArray(chats)) {
      chats.forEach((chat) => {
        const chatIndex = state.findIndex((u) => u.id === chat.id);
        if (chatIndex !== -1) {
          state[chatIndex] = chat;
        } else {
          newChats.push(chat);
        }
      });
    }

    return [...state, ...newChats];
  }

  if (action.type === "UPDATE_CHATS") {
    const chat = action.payload;
    const chatIndex = state.findIndex((u) => u.id === chat.id);

    if (chatIndex !== -1) {
      state[chatIndex] = chat;
      return [...state];
    } else {
      return [chat, ...state];
    }
  }

  if (action.type === "DELETE_CHAT") {
    const chatId = action.payload;

    const chatIndex = state.findIndex((u) => u.id === chatId);
    if (chatIndex !== -1) {
      state.splice(chatIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }

  if (action.type === "CHANGE_CHAT") {
    const changedChats = state.map((chat) => {
      if (chat.id === action.payload.chat.id) {
        return action.payload.chat;
      }
      return chat;
    });
    return changedChats;
  }
};

const MainListItems = (props) => {
  const classes = useStyles();
  const { drawerClose, collapsed } = props;
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user, handleLogout } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);
  const [openCampaignSubmenu, setOpenCampaignSubmenu] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [showKanban, setShowKanban] = useState(false);
  const [showOpenAi, setShowOpenAi] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false); const history = useHistory();
  const [showSchedules, setShowSchedules] = useState(false);
  const [showInternalChat, setShowInternalChat] = useState(false);
  const [showExternalApi, setShowExternalApi] = useState(false);


  const [invisible, setInvisible] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam] = useState("");
  const [chats, dispatch] = useReducer(reducer, []);
  const { getPlanCompany } = usePlans();
  
  const [openFlowsSubmenu, setOpenFlowsSubmenu] = useState(false);

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const planConfigs = await getPlanCompany(undefined, companyId);

      setShowCampaigns(planConfigs.plan.useCampaigns);
      setShowKanban(planConfigs.plan.useKanban);
      setShowOpenAi(planConfigs.plan.useOpenAi);
      setShowIntegrations(planConfigs.plan.useIntegrations);
      setShowSchedules(planConfigs.plan.useSchedules);
      setShowInternalChat(planConfigs.plan.useInternalChat);
      setShowExternalApi(planConfigs.plan.useExternalApi);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchChats();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-chat`, (data) => {
      if (data.action === "new-message") {
        dispatch({ type: "CHANGE_CHAT", payload: data });
      }
      if (data.action === "update") {
        dispatch({ type: "CHANGE_CHAT", payload: data });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  useEffect(() => {
    let unreadsCount = 0;
    if (chats.length > 0) {
      for (let chat of chats) {
        for (let chatUser of chat.users) {
          if (chatUser.userId === user.id) {
            unreadsCount += chatUser.unreads;
          }
        }
      }
    }
    if (unreadsCount > 0) {
      setInvisible(false);
    } else {
      setInvisible(true);
    }
  }, [chats, user.id]);

  useEffect(() => {
    if (localStorage.getItem("cshow")) {
      setShowCampaigns(true);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/chats/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_CHATS", payload: data.records });
    } catch (err) {
      toastError(err);
    }
  };

  const handleClickLogout = () => {
    //handleCloseMenu();
    handleLogout();
  };

  return (
    <div onClick={drawerClose}>
      <ListSubheader className={classes.ListSubheader} inset={false} hidden={collapsed}>
        PRINCIPAL
      </ListSubheader>
      <Can
        role={user.profile}
        perform="dashboard:view"
        yes={() => (
          <ListItemLink
            to="/"
            primary="Dashboard"
            icon={<DashboardOutlinedIcon />}
          />
        )}
      />

      <ListItemLink
        to="/tickets"
        primary={i18n.t("mainDrawer.listItems.tickets")}
        icon={<ChatOutlinedIcon />}
      />
	  
	{showKanban && (  
	  <ListItemLink
        to="/kanban"
        primary={`Kanban`}
        icon={<ViewQuiltOutlinedIcon />}
      />
	  )}


      <ListItemLink
        to="/quick-messages"
        primary={i18n.t("mainDrawer.listItems.quickMessages")}
        icon={<FlashOnOutlinedIcon />}
      />
	  
	  <ListItemLink
        to="/todolist"
        primary={i18n.t("mainDrawer.listItems.tasks")}
        icon={<AssignmentTurnedInOutlinedIcon />}
      />

      <ListItemLink
        to="/contacts"
        primary={i18n.t("mainDrawer.listItems.contacts")}
        icon={<ContactPhoneOutlinedIcon />}
      />

      <ListItemLink
        to="/schedules"
        primary={i18n.t("mainDrawer.listItems.schedules")}
        icon={<EventOutlinedIcon />}
      />

      <ListItemLink
        to="/tags"
        primary={i18n.t("mainDrawer.listItems.tags")}
        icon={<LocalOfferOutlinedIcon />}
      />

      <ListItemLink
        to="/chats"
        primary={i18n.t("mainDrawer.listItems.chats")}
        icon={
          <Badge color="secondary" variant="dot" invisible={invisible}>
            <ForumOutlinedIcon />
          </Badge>
        }
      />

      <ListItemLink
        to="/helps"
        primary={i18n.t("mainDrawer.listItems.helps")}
        icon={<HelpOutlineOutlinedIcon />}
      />

      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            <Divider style={{ margin: "16px 0" }} />
            <ListSubheader
              className={classes.ListSubheader}
              hidden={collapsed}
              inset={false}
              color="inherit">
              ADMINISTRAÇÃO
            </ListSubheader>
			
            {showCampaigns && (
              <>
                <ListItem
                  button
                  onClick={() => setOpenCampaignSubmenu((prev) => !prev)}
                  className={classes.listItem}
                >
                  <ListItemIcon className={classes.listItemIcon}>
                    <CampaignOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={i18n.t("mainDrawer.listItems.campaigns")}
                    className={classes.listItemText}
                  />
                  {openCampaignSubmenu ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </ListItem>
                <Collapse
                  style={{ paddingLeft: 15 }}
                  in={openCampaignSubmenu}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItem 
                      onClick={() => history.push("/campaigns")} 
                      button
                      className={classes.listItem}
                    >
                      <ListItemIcon className={classes.listItemIcon}>
                        <ListOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Listagem" className={classes.listItemText} />
                    </ListItem>
                    <ListItem
                      onClick={() => history.push("/contact-lists")}
                      button
                      className={classes.listItem}
                    >
                      <ListItemIcon className={classes.listItemIcon}>
                        <PeopleOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Listas de Contatos" className={classes.listItemText} />
                    </ListItem>
                    <ListItem
                      onClick={() => history.push("/campaigns-config")}
                      button
                      className={classes.listItem}
                    >
                      <ListItemIcon className={classes.listItemIcon}>
                        <SettingsOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Configurações" className={classes.listItemText} />
                    </ListItem>
                  </List>
                </Collapse>
                {/* Flow builder */}
                <ListItem
                    button
                    onClick={() => setOpenFlowsSubmenu((prev) => !prev)}
                    className={classes.listItem}
                >
                  <ListItemIcon className={classes.listItemIcon}>
                    <SchemaOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                      primary={i18n.t("mainDrawer.listItems.flows")}
                  />
                  {openCampaignSubmenu ? (
                      <ExpandLessIcon />
                  ) : (
                      <ExpandMoreIcon />
                  )}
                </ListItem>

                <Collapse
                    style={{ paddingLeft: 15 }}
                    in={openFlowsSubmenu}
                    timeout="auto"
                    unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItem
                        onClick={() => history.push("/phrase-lists")}
                        button
                    >
                      <ListItemIcon>
                        <EventAvailableOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Campanha" />
                    </ListItem>

                    <ListItem
                        onClick={() => history.push("/flowbuilders")}
                        button
                    >
                      <ListItemIcon>
                        <ShapeLine />
                      </ListItemIcon>
                      <ListItemText primary="Conversa" />
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}

            {user.super && (
              <ListItemLink
                to="/announcements"
                primary={i18n.t("mainDrawer.listItems.annoucements")}
                icon={<AnnouncementOutlinedIcon />}
              />
            )}
            {showOpenAi && (
              <ListItemLink
                to="/prompts"
                primary={i18n.t("mainDrawer.listItems.prompts")}
                icon={<AllInclusive />}
              />
            )}

            {showIntegrations && (
              <ListItemLink
                to="/queue-integration"
                primary={i18n.t("mainDrawer.listItems.queueIntegration")}
                icon={<DeviceHubOutlined />}
              />
            )}
            <ListItemLink
              to="/connections"
              primary={i18n.t("mainDrawer.listItems.connections")}
              icon={
                <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
                  <SyncAltIcon />
                </Badge>
              }
            />
            <ListItemLink
              to="/files"
              primary={i18n.t("mainDrawer.listItems.files")}
              icon={<AttachFile />}
            />
            <ListItemLink
              to="/queues"
              primary={i18n.t("mainDrawer.listItems.queues")}
              icon={<AccountTreeOutlinedIcon />}
            />
            <ListItemLink
              to="/users"
              primary={i18n.t("mainDrawer.listItems.users")}
              icon={<PeopleAltOutlinedIcon />}
            />
            {showExternalApi && (
              <>
                <ListItemLink
                  to="/messages-api"
                  primary={i18n.t("mainDrawer.listItems.messagesAPI")}
                  icon={<CodeRoundedIcon />}
                />
              </>
            )}
            <ListItemLink
              to="/financeiro"
              primary={i18n.t("mainDrawer.listItems.financeiro")}
              icon={<LocalAtmOutlinedIcon />}
            />

            <ListItemLink
              to="/settings"
              primary={i18n.t("mainDrawer.listItems.settings")}
              icon={<SettingsOutlinedIcon />}
            />
			
			
            {!collapsed && <React.Fragment>
              <Divider />
              {/* 
              // IMAGEM NO MENU
              <Hidden only={['sm', 'xs']}>
                <img style={{ width: "100%", padding: "10px" }} src={logo} alt="image" />            
              </Hidden> 
              */}
              <Typography style={{ fontSize: "12px", padding: "10px", textAlign: "right", fontWeight: "bold" }}>
                8.0.1
              </Typography>
            </React.Fragment>
            }
			
          </>
        )}
      />
    </div>
  );
};

export default MainListItems;
