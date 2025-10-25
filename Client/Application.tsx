import * as React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router';
import { BottomNavigation, BottomNavigationAction, Box, createTheme, Divider, ThemeProvider } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { osmAuthService } from './OsmAuthService';
import MapPage from './Pages/MapPage';
import SearchEditPage from './Pages/SearchEditPage';
import { AboutPage } from './Pages/AboutPage';
import EditNodePage from './Pages/EditNodePage';
import ReviewPage from './Pages/ReviewPage';
import SnackbarProvider from './Components/SnackbarProvider';

function AppRoot(): React.ReactNode {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = createTheme({ typography: { fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif` } });

  function executeNavigate(path: string) {
    if (path.at(0) == ':')
      window.location.href = path.substring(1);
    else
      navigate(path);
  }
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100dvw', height: '100dvh', display: 'flex', flexDirection: 'column' }}>

        <SnackbarProvider>
          <Box sx={{ flex: 1, overflow: 'scroll' }}>
            <Routes>
              <Route index element={<MapPage />} />
              <Route path="/edit" element={<SearchEditPage />} />
              <Route path="/edit/:elementType/:elementId" element={<EditNodePage />} />
              <Route path="/review" element={<ReviewPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Box>
        </SnackbarProvider>

        <Divider />

        <BottomNavigation showLabels value={location.pathname} onChange={(_event, value) => executeNavigate(value)}>
          <BottomNavigationAction label={t('navigation.map')} icon={<MapIcon />} value="/" />
          <BottomNavigationAction label={t('navigation.edit')} icon={<EditIcon />} value="/edit" />
          {LoginOrContributeNavigationAction()}
          <BottomNavigationAction label={t('navigation.about')} icon={<InfoIcon />} value="/about" />
        </BottomNavigation>
      </Box>
    </ThemeProvider>
  );
}

function LoginOrContributeNavigationAction(): React.ReactNode {
  const { t } = useTranslation();
  if (osmAuthService.isLoggedIn()) {
    return <BottomNavigationAction label={t('navigation.review')} icon={<ChecklistIcon />} value="/review" />;
  } else {
    return <BottomNavigationAction label={t('navigation.login')} icon={<LoginIcon />} value=":/osm_auth/login" />;
  }
}

export default function App(): React.ReactNode {
  return (
    <BrowserRouter>
      <AppRoot />
    </BrowserRouter>
  );
}
