import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";

import {enUS, ptBR, esES} from "@material-ui/core/locale";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import ColorModeContext from "./layout/themeContext";
import { SocketContext, SocketManager } from './context/Socket/SocketContext';

import Routes from "./routes";

const queryClient = new QueryClient();

const App = () => {
    const [locale, setLocale] = useState();

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const preferredTheme = window.localStorage.getItem("preferredTheme");
    const [mode, setMode] = useState(preferredTheme ? preferredTheme : prefersDarkMode ? "dark" : "light");

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    const theme = createTheme(
        {
            typography: {
                fontFamily: [
                    'Inter',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                ].join(','),
            },
            scrollbarStyles: {
                "&::-webkit-scrollbar": {
                    width: '6px',
                    height: '6px',
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#cbd5e1",
                    borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#94a3b8",
                },
            },
            scrollbarStylesSoft: {
                "&::-webkit-scrollbar": {
                    width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: mode === "light" ? "#cbd5e1" : "#475569",
                    borderRadius: "10px",
                },
            },
            palette: {
                type: mode,
                primary: { main: mode === "light" ? "#7c3aed" : "#a78bfa" }, // brand-600
                background: {
                    default: mode === "light" ? "#F8FAFC" : "#0f172a", // slate-50 / slate-900
                    paper: mode === "light" ? "#FFFFFF" : "#1e293b",
                },
                text: {
                    primary: mode === "light" ? "#0f172a" : "#f8fafc",
                    secondary: mode === "light" ? "#64748b" : "#94a3b8",
                },
                tabHeaderBackground: mode === "light" ? "#f1f5f9" : "#334155",
                optionsBackground: mode === "light" ? "#f8fafc" : "#1e293b",
                fancyBackground: mode === "light" ? "#F8FAFC" : "#0f172a",
                barraSuperior: mode === "light" ? "#FFFFFF" : "#1e293b",
                boxticket: mode === "light" ? "#f1f5f9" : "#334155",
            },
            mode,
            shape: {
                borderRadius: 12,
            },
        },
        locale
    );

    useEffect(() => {
        const i18nlocale = localStorage.getItem("i18nextLng");
        const browserLocale = i18nlocale?.substring(0, 2) ?? 'pt';

        if (browserLocale === "pt"){
            setLocale(ptBR);
        }else if( browserLocale === "en" ) {
            setLocale(enUS)
        }else if( browserLocale === "es" )
            setLocale(esES)

    }, []);

    useEffect(() => {
        window.localStorage.setItem("preferredTheme", mode);
    }, [mode]);



    return (
        <ColorModeContext.Provider value={{ colorMode }}>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                  <SocketContext.Provider value={SocketManager}>
                      <Routes />
                  </SocketContext.Provider>
                </QueryClientProvider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default App;
