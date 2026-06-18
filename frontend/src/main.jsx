import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import store from './store/store'
import { CartDrawerProvider } from './context/CartDrawerContext'
import { QuickViewProvider } from './context/QuickViewContext'
import App from './App.jsx'
import './index.css'
import ProgressBar from './components/ProgressBar'
import { HelmetProvider } from 'react-helmet-async'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <CartDrawerProvider>
            <QuickViewProvider>
              <ProgressBar />
              <App />
              <Toaster position="top-right" />
            </QuickViewProvider>
          </CartDrawerProvider>
        </BrowserRouter>
      </Provider>
</HelmetProvider>
  </StrictMode>,
)