import React, { useEffect, useState } from 'react';
import { changeLanguage, i18n } from "../../translate/i18n";
import api from "../../services/api";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: "8px 12px",
        minWidth: 220,
    },
    title: {
        fontSize: "0.85rem",
        fontWeight: 600,
        color: "#6b7280",
        marginBottom: 12,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    optionList: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    optionItem: {
        display: "flex",
        alignItems: "center",
        padding: "10px 14px",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        border: "1px solid transparent",
        backgroundColor: "#f9fafb",
        "&:hover": {
            backgroundColor: "#eff6ff",
            borderColor: "rgba(29, 78, 216, 0.15)",
            transform: "translateX(2px)",
        },
    },
    optionItemActive: {
        backgroundColor: "#eff6ff",
        border: "1px solid rgba(29, 78, 216, 0.3)",
        boxShadow: "0 2px 4px rgba(29, 78, 216, 0.05)",
    },
    flag: {
        fontSize: "1.2rem",
        marginRight: 10,
    },
    label: {
        fontSize: "0.95rem",
        fontWeight: 500,
        color: "#111827",
    },
    activeDot: {
        marginLeft: "auto",
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "#2563eb",
        boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.2)",
    }
}));

const languages = [
    { code: "pt", label: "Português (BR)", flag: "🇧🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },
];

const LanguageControl = () => {
    const classes = useStyles();
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const handleLanguageChange = async (newLanguage) => {
        setSelectedLanguage(newLanguage);
        changeLanguage(newLanguage);

        try {
            await api.post(`/users/set-language/${newLanguage}`);
        } catch(error) {
            console.error("Language sync error:", error);
        }

        window.location.reload();
    };

    useEffect(() => {
        const saveLanguage = localStorage.getItem('i18nextLng') || 'en';
        // handle slight variations like "pt-BR", "en-US"
        const baseLang = saveLanguage.split('-')[0];
        setSelectedLanguage(baseLang);
    }, []);

    return (
        <div className={classes.container}>
            <Typography variant="overline" display="block" className={classes.title}>
                {i18n.t("selectLanguage")}
            </Typography>
            <div className={classes.optionList}>
                {languages.map((lang) => {
                    const isActive = selectedLanguage === lang.code;
                    return (
                        <div
                            key={lang.code}
                            className={`${classes.optionItem} ${isActive ? classes.optionItemActive : ""}`}
                            onClick={() => handleLanguageChange(lang.code)}
                        >
                            <span className={classes.flag}>{lang.flag}</span>
                            <span className={classes.label}>{lang.label}</span>
                            {isActive && <div className={classes.activeDot} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LanguageControl;