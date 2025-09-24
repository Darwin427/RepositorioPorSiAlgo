import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0f5fa6', // azul institucional sobrio
      light: '#3f86c4',
      dark: '#0b4275',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f5b400', // acento inspirado en cintas doradas del branding
      dark: '#c48d00',
      contrastText: '#1b1b1f',
    },
    background: {
      default: '#0e1116', // para permitir contraste con fondos de imagen
      paper: 'rgba(255,255,255,0.9)', // tarjetas semi blancas estilo login
    },
    text: {
      primary: '#1b1b1f',
      secondary: 'rgba(27,27,31,0.7)',
    },
    divider: 'rgba(27,27,31,0.12)'
  },
  shape: {
    borderRadius: 16, // tarjetas y botones más redondeados (look moderno)
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.25rem', fontWeight: 700 },
    h2: { fontSize: '1.875rem', fontWeight: 700 },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    h5: { fontSize: '1.125rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    button: { fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'linear-gradient(180deg, rgba(8,20,32,0.88), rgba(8,20,32,0.88)), url(/bg-campus.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          backdropFilter: 'saturate(140%) blur(8px)',
        },
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: 'rgba(16,24,40,0.35)',
          backdropFilter: 'saturate(140%) blur(10px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.25)'
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
        },
        containedPrimary: {
          boxShadow: '0 6px 14px rgba(15,95,166,0.4)'
        }
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(16,24,40,0.55)',
          color: '#e6e6e9',
          backdropFilter: 'saturate(140%) blur(10px)'
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '4px 8px',
        },
      },
    },
  },
});
