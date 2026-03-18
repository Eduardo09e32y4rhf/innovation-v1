import React, { useContext, useState, useEffect } from "react";

import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";

import CallIcon from "@material-ui/icons/Call";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TimerIcon from '@material-ui/icons/Timer';
import FilterListIcon from '@material-ui/icons/FilterList';

import { makeStyles } from "@material-ui/core/styles";
import { grey, blue } from "@material-ui/core/colors";
import { toast } from "react-toastify";

import ButtonWithSpinner from "../../components/ButtonWithSpinner";

import TableAttendantsStatus from "../../components/Dashboard/TableAttendantsStatus";
import { isArray } from "lodash";

import useDashboard from "../../hooks/useDashboard";
import useContacts from "../../hooks/useContacts";
import { ChatsUser } from "./ChartsUser"

import { isEmpty } from "lodash";
import moment from "moment";
import { ChartsDate } from "./ChartsDate";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles((theme) => ({
  containerLayout: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.type === 'light' ? '#f8fafc' : '#0f172a',
  },
  mainCard: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: theme.spacing(3),
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
  },
  cardValue: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#0f172a",
    lineHeight: 1,
  },
  cardLabel: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#64748b",
    marginBottom: theme.spacing(1),
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& svg": {
      fontSize: 28,
    },
  },
  filterSection: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: theme.spacing(3),
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  filterGrid: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    gap: theme.spacing(3),
  },
  filterItem: {
    flex: 1,
    minWidth: 240,
  },
  filterLabel: {
    fontSize: "0.8125rem",
    fontWeight: 500,
    color: "#64748b",
    marginBottom: theme.spacing(1),
  },
  selectField: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f8fafc",
      borderRadius: "12px",
      "& fieldset": {
        borderColor: "#e2e8f0",
      },
    },
  },
  filterButton: {
    backgroundColor: "#682ee2",
    color: "white",
    borderRadius: "12px",
    padding: "12px 32px",
    fontWeight: 600,
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#5a25c7",
    },
  },
  chartContainer: {
    background: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    marginTop: theme.spacing(4),
  },
  chartHeader: {
    padding: theme.spacing(3),
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chartTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#0f172a",
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [counters, setCounters] = useState({});
  const [attendants, setAttendants] = useState([]);
  const [period, setPeriod] = useState(0);
  const [filterType, setFilterType] = useState(1);
  const [dateFrom, setDateFrom] = useState(moment("1", "D").format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const { find } = useDashboard();

  useEffect(() => {
    async function firstLoad() {
      await fetchData();
    }
    setTimeout(() => {
      firstLoad();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
    async function handleChangePeriod(value) {
    setPeriod(value);
  }

  async function handleChangeFilterType(value) {
    setFilterType(value);
    if (value === 1) {
      setPeriod(0);
    } else {
      setDateFrom("");
      setDateTo("");
    }
  }

  async function fetchData() {
    setLoading(true);

    let params = {};

    if (period > 0) {
      params = {
        days: period,
      };
    }

    if (!isEmpty(dateFrom) && moment(dateFrom).isValid()) {
      params = {
        ...params,
        date_from: moment(dateFrom).format("YYYY-MM-DD"),
      };
    }

    if (!isEmpty(dateTo) && moment(dateTo).isValid()) {
      params = {
        ...params,
        date_to: moment(dateTo).format("YYYY-MM-DD"),
      };
    }

    if (Object.keys(params).length === 0) {
      toast.error(i18n.t("dashboard.toasts.selectFilterError"));
      setLoading(false);
      return;
    }

    const data = await find(params);

    setCounters(data.counters);
    if (isArray(data.attendants)) {
      setAttendants(data.attendants);
    } else {
      setAttendants([]);
    }

    setLoading(false);
  }

  function formatTime(minutes) {
    return moment()
      .startOf("day")
      .add(minutes, "minutes")
      .format("HH[h] mm[m]");
  }

    const GetContacts = (all) => {
    let props = {};
    if (all) {
      props = {};
    }
    const { count } = useContacts(props);
    return count;
  };
  
    function renderFilters() {
    return (
      <div className={classes.filterSection}>
        <div className={classes.filterGrid}>
          <div className={classes.filterItem}>
            <Typography className={classes.filterLabel}>{i18n.t("dashboard.filters.filterType.title")}</Typography>
            <Select
              variant="outlined"
              fullWidth
              value={filterType}
              onChange={(e) => handleChangeFilterType(e.target.value)}
              className={classes.selectField}
            >
              <MenuItem value={1}>{i18n.t("dashboard.filters.filterType.options.perDate")}</MenuItem>
              <MenuItem value={2}>{i18n.t("dashboard.filters.filterType.options.perPeriod")}</MenuItem>
            </Select>
          </div>

          {filterType === 1 ? (
            <>
              <div className={classes.filterItem}>
                <Typography className={classes.filterLabel}>{i18n.t("dashboard.filters.initialDate")}</Typography>
                <TextField
                  type="date"
                  variant="outlined"
                  fullWidth
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className={classes.selectField}
                />
              </div>
              <div className={classes.filterItem}>
                <Typography className={classes.filterLabel}>{i18n.t("dashboard.filters.finalDate")}</Typography>
                <TextField
                  type="date"
                  variant="outlined"
                  fullWidth
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className={classes.selectField}
                />
              </div>
            </>
          ) : (
            <div className={classes.filterItem}>
              <Typography className={classes.filterLabel}>{i18n.t("dashboard.filters.period")}</Typography>
              <Select
                variant="outlined"
                fullWidth
                value={period}
                onChange={(e) => handleChangePeriod(e.target.value)}
                className={classes.selectField}
              >
                <MenuItem value={0}>{i18n.t("dashboard.periodSelect.options.none")}</MenuItem>
                <MenuItem value={3}>{i18n.t("dashboard.periodSelect.options.last3")}</MenuItem>
                <MenuItem value={7}>{i18n.t("dashboard.periodSelect.options.last7")}</MenuItem>
                <MenuItem value={15}>{i18n.t("dashboard.periodSelect.options.last15")}</MenuItem>
                <MenuItem value={30}>{i18n.t("dashboard.periodSelect.options.last30")}</MenuItem>
                <MenuItem value={60}>{i18n.t("dashboard.periodSelect.options.last60")}</MenuItem>
                <MenuItem value={90}>{i18n.t("dashboard.periodSelect.options.last90")}</MenuItem>
              </Select>
            </div>
          )}

          <ButtonWithSpinner
            loading={loading}
            onClick={() => fetchData()}
            className={classes.filterButton}
            startIcon={<FilterListIcon />}
          >
            {i18n.t("dashboard.buttons.filter")}
          </ButtonWithSpinner>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.containerLayout}>
      <Grid container spacing={4}>
        {/* EM ATENDIMENTO */}
        <Grid item xs={12} sm={6} md={4}>
          <div className={classes.mainCard}>
            <div>
              <Typography className={classes.cardLabel}>
                {i18n.t("dashboard.counters.inTalk")}
              </Typography>
              <Typography className={classes.cardValue}>
                {counters.supportHappening}
              </Typography>
            </div>
            <div className={classes.iconBox} style={{ backgroundColor: "#f3f0ff", color: "#682ee2" }}>
              <CallIcon />
            </div>
          </div>
        </Grid>

        {/* AGUARDANDO */}
        <Grid item xs={12} sm={6} md={4}>
          <div className={classes.mainCard}>
            <div>
              <Typography className={classes.cardLabel}>
                {i18n.t("dashboard.counters.waiting")}
              </Typography>
              <Typography className={classes.cardValue}>
                {counters.supportPending}
              </Typography>
            </div>
            <div className={classes.iconBox} style={{ backgroundColor: "#fffbeb", color: "#f59e0b" }}>
              <HourglassEmptyIcon />
            </div>
          </div>
        </Grid>

        {/* FINALIZADOS */}
        <Grid item xs={12} sm={6} md={4}>
          <div className={classes.mainCard}>
            <div>
              <Typography className={classes.cardLabel}>
                {i18n.t("dashboard.counters.finished")}
              </Typography>
              <Typography className={classes.cardValue}>
                {counters.supportFinished}
              </Typography>
            </div>
            <div className={classes.iconBox} style={{ backgroundColor: "#e8faf0", color: "#10b981" }}>
              <CheckCircleIcon />
            </div>
          </div>
        </Grid>

        {/* NOVOS CONTATOS */}
        <Grid item xs={12} sm={6} md={4}>
          <div className={classes.mainCard}>
            <div>
              <Typography className={classes.cardLabel}>
                {i18n.t("dashboard.counters.newContacts")}
              </Typography>
              <Typography className={classes.cardValue}>
                {GetContacts(true)}
              </Typography>
            </div>
            <div className={classes.iconBox} style={{ backgroundColor: "#e0f2fe", color: "#0ea5e9" }}>
              <GroupAddIcon />
            </div>
          </div>
        </Grid>

        {/* T.M. DE CONVERSA */}
        <Grid item xs={12} sm={6} md={4}>
          <div className={classes.mainCard}>
            <div>
              <Typography className={classes.cardLabel}>
                {i18n.t("dashboard.counters.averageTalkTime")}
              </Typography>
              <Typography className={classes.cardValue}>
                {formatTime(counters.avgSupportTime)}
              </Typography>
            </div>
            <div className={classes.iconBox} style={{ backgroundColor: "#f3f0ff", color: "#682ee2" }}>
              <AccessAlarmIcon />
            </div>
          </div>
        </Grid>

        {/* T.M. DE ESPERA */}
        <Grid item xs={12} sm={6} md={4}>
          <div className={classes.mainCard}>
            <div>
              <Typography className={classes.cardLabel}>
                {i18n.t("dashboard.counters.averageWaitTime")}
              </Typography>
              <Typography className={classes.cardValue}>
                {formatTime(counters.avgWaitTime)}
              </Typography>
            </div>
            <div className={classes.iconBox} style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}>
              <TimerIcon />
            </div>
          </div>
        </Grid>
      </Grid>

      {/* FILTROS */}
      {renderFilters()}

      {/* USUARIOS ONLINE */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {attendants.length ? (
            <div className={classes.chartContainer}>
              <div className={classes.chartHeader}>
                <Typography className={classes.chartTitle}>Status dos Atendentes</Typography>
              </div>
              <div style={{ padding: 24 }}>
                <TableAttendantsStatus
                  attendants={attendants}
                  loading={loading}
                />
              </div>
            </div>
          ) : null}
        </Grid>

        {/* TOTAL DE ATENDIMENTOS POR USUARIO */}
        <Grid item xs={12}>
          <div className={classes.chartContainer}>
            <div className={classes.chartHeader}>
              <Typography className={classes.chartTitle}>Conversas por Usuário</Typography>
            </div>
            <div style={{ padding: 24 }}>
              <ChatsUser />
            </div>
          </div>
        </Grid>

        {/* TOTAL DE ATENDIMENTOS */}
        <Grid item xs={12}>
          <div className={classes.chartContainer}>
            <div className={classes.chartHeader}>
              <Typography className={classes.chartTitle}>Evolução de Atendimentos</Typography>
            </div>
            <div style={{ padding: 24 }}>
              <ChartsDate />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
