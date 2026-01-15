import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    Package,
    Settings,
    LogOut,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import clsx from 'clsx'

const navigation = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Utilisateurs', to: '/users', icon: Users },
    { name: 'Produits', to: '/products', icon: Package },
    { name: 'Paramètres', to: '/settings', icon: Settings },
]

const Sidebar = () => {
    const { logout } = useAuth()

    return (
        <aside className="hidden md:flex md:w-64 md:flex-col">
            <div className="flex flex-col flex-1 min-h-0 border-r border-gray-200 dark:border-gray-700">
                <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-4 mb-8">
                        <h1 className="text-xl font-bold text-primary-600">DashFlow</h1>
                    </div>
                    <nav className="flex-1 px-4 space-y-1">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.to}
                                end={item.to === '/'}
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                                        isActive
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    )
                                }
                            >
                                <item.icon className="mr-3 w-5 h-5" />
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <LogOut className="mr-3 w-5 h-5" />
                        Déconnexion
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar;