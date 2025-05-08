import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { BottomNavigation, BottomNavigationAction, Box, Divider } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';

import MapPage from './Pages/MapPage';

export default class App extends React.Component {
  render(): React.ReactNode {
    return (
      <BrowserRouter>
        <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route index element={<MapPage />} />
            </Routes>
          </Box>

          <Divider />

          <BottomNavigation showLabels>
            <BottomNavigationAction label="Map" icon={<MapIcon />} />
            <BottomNavigationAction label="Modify" icon={<EditIcon />} />
            <BottomNavigationAction label="About" icon={<InfoIcon />} />
          </BottomNavigation>
        </Box>
      </BrowserRouter>
    );
  }
}