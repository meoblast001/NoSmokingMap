import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

import MapPage from './Pages/MapPage';

export default class App extends React.Component {
  render(): React.ReactNode {
    return (
      <BrowserRouter>
        <Routes>
          <Route index element={<MapPage />} />
        </Routes>
      </BrowserRouter>
    );
  }
}