import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    Package,
    Settings,
    LogOut,
    X,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import clsx from 'clsx'

const navigation = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Utilisateurs', to: '/users', icon: Users },
    { name: 'Produits', to: '/products', icon: Package },
    { name: 'Paramètres', to: '/settings', icon: Settings },
]

const Sidebar = ({ onClose }) => {
    const { logout, user } = useAuth()

    return (
        <aside className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {/* En-tête de la sidebar avec bouton fermer sur mobile */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold text-primary-600">DashFlow</h1>
                </div>
                <button
                    onClick={onClose}
                    className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Fermer le menu"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-4 space-y-1">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                clsx(
                                    'flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors',
                                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                                    isActive
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                        : 'text-gray-700 dark:text-gray-300'
                                )
                            }
                            onClick={onClose}
                        >
                            <item.icon className="mr-3 w-5 h-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Section utilisateur et déconnexion */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full mr-3"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                            <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email}
                        </p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <LogOut className="mr-2 w-4 h-4" />
                    Déconnexion
                </button>
            </div>
        </aside>
    )
}

export default Sidebar;