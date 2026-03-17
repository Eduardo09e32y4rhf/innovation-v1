import React, { useEffect, useState } from 'react';
import { changeLanguage } from "../../translate/i18n";
import { makeStyles, Button, ButtonGroup } from '@material-ui/core';
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 8px',
        borderRadius: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    labelButton: {
        fontSize: '0.85rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        margin: '0 10px',
        padding: '4px 8px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        color: 'rgba(255, 255, 255, 0.5)',
        '&:hover': {
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
    },
    selectedLabel: {
        color: 'white',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    }
}));

const LanguageControl = () => {
    const classes = useStyles();
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const handleLanguageChange = async (newLanguage) => {
        setSelectedLanguage(newLanguage);
        changeLanguage(newLanguage);
        
        try {
            await api.post(`/users/set-language/${newLanguage}`);
        } catch (error) {
            console.error(error);
        }

        // Force reload to apply translations everywhere
        window.location.reload();
    };

    useEffect(() => {
        const saveLanguage = localStorage.getItem('i18nextLng') || 'en';
        setSelectedLanguage(saveLanguage.split('-')[0]); 
    }, []);

    const languages = [
        { code: 'pt', label: 'PT' },
        { code: 'en', label: 'EN' },
        { code: 'es', label: 'ES' },
    ];

    return (
        <div className={classes.container}>
            {languages.map((lang) => (
                <span
                    key={lang.code}
                    className={`${classes.labelButton} ${selectedLanguage === lang.code ? classes.selectedLabel : ''}`}
                    onClick={() => handleLanguageChange(lang.code)}
                >
                    {lang.label}
                </span>
            ))}
        </div>
    );
};

export default LanguageControl;