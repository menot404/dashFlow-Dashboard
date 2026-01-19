import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, RefreshCw } from 'lucide-react'
import Button from '../components/ui/Button'

const NotFound = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const suggestions = [
    { path: '/', label: 'Tableau de bord', icon: Home },
    { path: '/users', label: 'Utilisateurs' },
    { path: '/products', label: 'Produits' },
    { path: '/settings', label: 'Paramètres' },
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="text-[120px] md:text-[160px] font-bold text-gray-900 dark:text-gray-100 leading-none">
              404
            </div>
            <div className="absolute inset-0 bg-linear-to-r from-red-500/20 to-orange-500/20 dark:from-red-600/30 dark:to-orange-600/30 blur-3xl" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Page introuvable
          </h1>
          
          <div className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-full mb-6">
            <Search className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
            <code className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
              {location.pathname}
            </code>
          </div>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            La page que vous recherchez n'existe pas ou a été déplacée.
            Voici quelques alternatives qui pourraient vous être utiles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {suggestions.map((item) => {
            const Icon = item.icon || Home
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-lg"
              >
                <div className="flex items-center">
                  <div className="mr-4 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {item.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retour en arrière
          </Button>
          
          <Button
            as={Link}
            to="/"
            variant="primary"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Tableau de bord principal
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Si vous pensez qu'il s'agit d'une erreur,{' '}
            <a
              href={`mailto:support@dashflow.com?subject=Page introuvable: ${location.pathname}`}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium underline decoration-primary-200 hover:decoration-primary-400"
            >
              contactez notre support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound;