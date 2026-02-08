/**
 * Point d'entrée des contextes globaux
 * Exporte les providers et contextes pour l'application
 */
// Export des Providers
export { AuthProvider } from './auth/AuthProvider'
export { ThemeProvider } from './theme/ThemeProvider'
export { NotificationProvider } from './notification/NotificationProvider'

// Export des Contextes (utile pour les tests)
export { AuthContext } from './auth/AuthContext'
export { ThemeContext } from './theme/ThemeContext'
export { NotificationContext } from './notification/NotificationContext'