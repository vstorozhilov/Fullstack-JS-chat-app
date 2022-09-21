import { createTheme } from '@mui/material';

const Theme = createTheme({
  palette: {
    primary: {
      main: '#246bfd',
      dark: '#3062c8',
      light: '#3e7dfe',
      contrastText: '#f5f5f5'
    },
    secondary: {
      main: '#246bfd',
      contrastText: '#ebebeb',
      text: '#ffffff'
    },
    action: {
      focus: '#eef4ff'
    },
    divider: '#ffffff'
  },
  typography: {
    fontFamily: 'Urbanist',
    fontWeightLight: '300',
    fontWeightRegular: '400',
    fontWeightMedium: '500',
    fontWeightBold: '600',
    fontWeightExtraBold: '900'
  },
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 600,
      laptop: 1024,
      desktop: 1200
    }
  }
});

export default Theme;
