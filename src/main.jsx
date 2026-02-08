/**
 * Point d'entrée principal de l'application React
 * Monte l'application dans le DOM et gère les erreurs globales
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Création de la racine React et gestion des erreurs
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
