// Logging des erreurs côté client
export const logError = (error, errorInfo) => {
  if (import.meta.env.Dev) {
    console.error('Error:', error, errorInfo)
  }
  
  // Envoyer à un service de monitoring (Sentry, etc.)
  // Example: Sentry.captureException(error, { extra: errorInfo })
}

// Gestionnaire d'erreurs pour les routes
export const handleRouteError = (error) => {
  logError(error, { type: 'ROUTE_ERROR' })
  
  // Retourner une réponse d'erreur structurée
  return {
    error: true,
    message: 'Route non disponible',
    code: 'ROUTE_404',
    timestamp: new Date().toISOString(),
  }
}