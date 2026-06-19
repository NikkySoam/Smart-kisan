import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { registerSW } from "virtual:pwa-register";
import "./i18n";
import { syncWaterEntries } from "./utils/syncWaterEntries";

registerSW({ immediate: true,});

window.addEventListener(
  "online",
  () => {
    syncWaterEntries();
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
