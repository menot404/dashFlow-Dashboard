// Importation de l'utilitaire clsx pour la gestion des classes
import clsx from "clsx";

/**
 * Composant LoadingSpinner : affiche un loader animé
 * @param {string} size - Taille du spinner ('sm', 'md', 'lg')
 * @param {boolean} fullscreen - Affiche le spinner en plein écran
 * @param {string} text - Texte d'accompagnement
 * @param {string} className - Classes CSS additionnelles
 */
const LoadingSpinner = ({ size = 'md', fullscreen = false, text = 'Chargement...', className = '' }) => {
  // Classes de taille du spinner
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  // Classes du conteneur selon le mode fullscreen
  const containerClasses = fullscreen 
    ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center'
    : 'flex flex-col items-center justify-center'

  return (
    <div className={clsx(containerClasses, className)}>
      {/* Spinner animé */}
      <div className={`${sizeClasses[size]} animate-spin text-primary-600 border border-t-3 border-b-3 border-primary-600 rounded-full`} />
      {/* Texte d'accompagnement */}
      {text && <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  )
}

export default LoadingSpinner;