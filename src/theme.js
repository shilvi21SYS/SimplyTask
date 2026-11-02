import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb', dark: '#1d4ed8', light: '#3b82f6', contrastText: '#fff' },
    secondary: { main: '#64748b' },
    background: { default: '#f9fafb', paper: '#ffffff' },
    text: { primary: '#111827', secondary: '#6b7280' },
    success: { main: '#15803d' },
    warning: { main: '#b45309' },
    error: { main: '#b91c1c' }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 }
  },
  shape: { borderRadius: 6 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 6, paddingInline: 14, boxShadow: 'none' },
        containedPrimary: { '&:hover': { boxShadow: 'none' } }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: { border: '1px solid #e5e7eb', boxShadow: 'none' }
      }
    },
    MuiTextField: { defaultProps: { size: 'small', fullWidth: true } }
  }
});

export default theme;
