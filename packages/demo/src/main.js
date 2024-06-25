import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GridEngine } from '@lazymonkey/grid-engine-rc';

import App from './App';

GridEngine.settings.NUMBER_OF_COLUMNS = 12;
GridEngine.settings.ELEMENT_SPACING = 16;

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
