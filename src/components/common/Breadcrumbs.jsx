// Importation des dépendances React, navigation, icônes et utilitaire clsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import clsx from 'clsx'

// Noms lisibles pour chaque route
const routeNames = {
  '': 'Dashboard',
  'users': 'Utilisateurs',
  'products': 'Produits',
  'settings': 'Paramètres',
  'login': 'Connexion',
  'register': 'Inscription',
}

/**
 * Composant Breadcrumbs (fil d'Ariane)
 * Affiche la navigation hiérarchique selon l'URL courante.
 * Utilise les noms de routes pour une meilleure lisibilité.
 */
const Breadcrumbs = () => {
  // Récupère l'objet de localisation et découpe l'URL en segments
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  // Rendu principal du fil d'Ariane : dashboard, segments, liens
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      {/* Lien vers la racine (dashboard) */}
      <Link 
        to="/" 
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {/* Segments de l'URL sous forme de fil d'Ariane */}
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        
        return (
          <React.Fragment key={name}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className={clsx(
              isLast 
                ? 'text-gray-900 dark:text-gray-100 font-medium' 
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
            )}>
              {isLast ? (
                routeNames[name] || name.charAt(0).toUpperCase() + name.slice(1)
              ) : (
                <Link to={routeTo}>
                  {routeNames[name] || name.charAt(0).toUpperCase() + name.slice(1)}
                </Link>
              )}
            </span>
          </React.Fragment>
        )
      })}
    </nav>
  )
}
export default Breadcrumbs;