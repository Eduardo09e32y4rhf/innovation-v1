import React, { useState, useEffect, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import { i18n } from "../../translate/i18n";

import { Stack } from "@mui/material";
import { AddCircle, Delete } from "@mui/icons-material";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1
  },

  extraAttr: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  btnWrapper: {
    position: "relative"
  },

  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  }
}));

  const FlowBuilderMenuModal = ({ open, onSave, onUpdate, data, close }) => {
  const classes = useStyles();
  const isMounted = useRef(true);

  const [activeModal, setActiveModal] = useState(false);

  const [textDig, setTextDig] = useState();

  const [arrayOption, setArrayOption] = useState([]);

  const [labels, setLabels] = useState({
    title: "Adicionar menu ao fluxo",
    btn: "Adicionar"
  });

  useEffect(() => {
    if (open === "edit") {
      setLabels({
        title: "Editar menu",
        btn: "Salvar"
      });
      setTextDig(data.data.message);
      setArrayOption(data.data.arrayOption);
      setActiveModal(true);
    } else if (open === "create") {
      setLabels({
        title: "Adicionar menu ao fluxo",
        btn: "Adicionar"
      });
      setTextDig();
      setArrayOption([]);
      setActiveModal(true);
    } else {
      setActiveModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleClose = () => {
    close(null);
    setActiveModal(false);
  };

  const handleSaveContact = async () => {
    if (open === "edit") {
      handleClose();
      onUpdate({
        ...data,
        data: { message: textDig, arrayOption: arrayOption }
      });
      return;
    } else if (open === "create") {
      handleClose();
      onSave({
        message: textDig,
        arrayOption: arrayOption
      });
    }
  };

  const removeOption = number => {
    setArrayOption(old => old.filter(item => item.number !== number));
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={activeModal}
        onClose={handleClose}
        fullWidth="md"
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">{labels.title}</DialogTitle>
        <Stack>
          <Stack dividers style={{ gap: "8px", padding: "16px" }}>
            <TextField
              label={"Mensagem de explicação do menu"}
              rows={4}
              name="text"
              multiline
              variant="outlined"
              value={textDig}
              onChange={e => setTextDig(e.target.value)}
              className={classes.textField}
              style={{ width: "100%" }}
            />
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography>Adicionar Opção</Typography>
              <Button
                onClick={() =>
                  setArrayOption(old => [
                    ...old,
                    { number: old.length + 1, value: "" }
                  ])
                }
                color="primary"
                variant="contained"
              >
                <AddCircle />
              </Button>
            </Stack>
            {arrayOption.map((item, index) => (
              <Stack width={"100%"} key={item.number}>
                <Typography>Digite {item.number}</Typography>
                <Stack direction={"row"} width={"100%"} style={{ gap: "8px" }}>
                  <TextField
                    placeholder={"Digite opção"}
                    variant="outlined"
                    defaultValue={item.value}
                    style={{ width: "100%" }}
                    onChange={event =>
                      setArrayOption(old => {
                        let newArr = old;
                        newArr[index].value = event.target.value;
                        return newArr;
                      })
                    }
                  />
                  {arrayOption.length === item.number && (
                    <IconButton onClick={() => removeOption(item.number)}>
                      <Delete />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
            ))}
          </Stack>
          <DialogActions>
            <Button onClick={handleClose} color="secondary" variant="outlined">
              {i18n.t("contactModal.buttons.cancel")}
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={classes.btnWrapper}
              onClick={() => handleSaveContact()}
            >
              {`${labels.btn}`}
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>
    </div>
  );
};

export default FlowBuilderMenuModal;
