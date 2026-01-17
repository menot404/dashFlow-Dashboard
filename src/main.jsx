import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root'),
  {
    onUncaughtError: (error, errorInfo) => {
      console.error('Uncaught error:', error, errorInfo)
    },
    onRecoverableError: (error, errorInfo) => {
      console.error('Recoverable error:', error, errorInfo)
    }
  }
).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
