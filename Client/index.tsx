import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Application from './Application';
import { setupLeaflet } from './LeafletSetup';

setupLeaflet();

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>
);