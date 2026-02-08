// Importation des outils de navigation et du hook d'authentification
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../common/LoadingSpinner'

/**
 * Composant ProtectedRoute : protège l'accès aux routes privées
 * - Affiche un loader si l'état d'authentification est en cours
 * - Redirige vers /login si l'utilisateur n'est pas authentifié
 * - Affiche le contenu protégé sinon
 */
const ProtectedRoute = ({ children }) => {
  // Récupère l'état d'authentification et de chargement via le hook personnalisé
  const { isAuthenticated, loading } = useAuth()

  // Affiche un spinner pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Redirige vers la page de login si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Affiche le contenu de la route protégée
  return children
}

// Export du composant pour utilisation dans le routeur
export default ProtectedRoute;