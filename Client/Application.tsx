import * as React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router';
import { BottomNavigation, BottomNavigationAction, Box, createTheme, Divider, ThemeProvider } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';

import MapPage from './Pages/MapPage';
import SearchEditPage from './Pages/SearchEditPage';
import { useLocation } from 'react-router';
import { AboutPage } from './Pages/AboutPage';

function AppRoot(): React.ReactNode {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = createTheme({ typography: { fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif` } });
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100dvw', height: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, overflow: 'scroll' }}>
          <Routes>
            <Route index element={<MapPage />} />
            <Route path="/search" element={<SearchEditPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Box>

        <Divider />

        <BottomNavigation showLabels value={location.pathname} onChange={(_event, value) => navigate(value)}>
          <BottomNavigationAction label="Map" icon={<MapIcon />} value="/" />
          <BottomNavigationAction label="Modify" icon={<EditIcon />} value="/search" />
          <BottomNavigationAction label="About" icon={<InfoIcon />} value="/about" />
        </BottomNavigation>
      </Box>
    </ThemeProvider>
  );
}

export default function App(): React.ReactNode {
  return (
    <BrowserRouter>
      <AppRoot />
    </BrowserRouter>
  );
}