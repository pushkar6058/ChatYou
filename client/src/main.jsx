import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {CssBaseline} from '@mui/material'
import {HelmetProvider} from "react-helmet-async"
import {Toaster} from 'react-hot-toast'
import "./index.css"
import {Provider} from "react-redux";
import store from '../src/redux/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
      <CssBaseline/>
      <Toaster/>
      <div onContextMenu={(e)=>e.preventDefault()}>
        <App />
      </div>
    </HelmetProvider>
    </Provider>
  </StrictMode>,
)
