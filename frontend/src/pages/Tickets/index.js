import React from "react";
import { useParams, useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme, useMediaQuery } from "@material-ui/core";

import TicketsManager from "../../components/TicketsManager/";
import Ticket from "../../components/Ticket/";

import logo from "../../assets/logo.png";

const useStyles = makeStyles(theme => ({
  chatContainer: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(0),
    height: `calc(100% - 48px)`,
    overflowY: "hidden",
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(1),
    },
  },

  chatPapper: {
    backgroundColor: theme.palette.background.default,
    display: "flex",
    height: "100%",
  },

  contactsWrapper: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflowY: "hidden",
  },
  messagesWrapper: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    backgroundColor: theme.palette.background.default,
  },
  welcomeMsg: {
    backgroundColor: theme.palette.background.default,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    textAlign: "center",
    border: "none",
    boxShadow: "none",
  },
}));

const Chat = () => {
  const classes = useStyles();
  const { ticketId } = useParams();
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs")); // < 600px

  // Em mobile: se tiver ticketId, mostrar só o ticket; se não, só a lista
  // Em desktop: mostrar ambos lado a lado
  if (isMobile) {
    return (
      <div className={classes.chatContainer} style={{ padding: 0 }}>
        {ticketId ? (
          <Ticket />
        ) : (
          <TicketsManager />
        )}
      </div>
    );
  }

  return (
    <div className={classes.chatContainer}>
      <div className={classes.chatPapper}>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={4} md={4} className={classes.contactsWrapper}>
            <TicketsManager />
          </Grid>
          <Grid item xs={12} sm={8} md={8} className={classes.messagesWrapper}>
            {ticketId ? (
              <>
                <Ticket />
              </>
            ) : (
              <Paper square elevation={0} className={classes.welcomeMsg}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                  <img style={{ width: "80%", maxWidth: "500px" }} src={logo} alt="logologin" />
                </div>
              </Paper>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Chat;
