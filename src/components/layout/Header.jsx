import { Moon, Sun, Bell, User, Menu } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'
import GlobalSearch from './GlobalSearch'

const Header = ({ onMenuClick }) => {
    const { theme, toggleTheme } = useTheme()
    const { user } = useAuth()

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center"
                    aria-label="Menu"
                >
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Dashboard
                </h2>

                {/* GlobalSearch uniquement sur desktop */}
                <div className="hidden md:block ml-4">
                    <GlobalSearch />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                    aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
                >
                    {theme === 'dark' ? (
                        <Sun className="w-5 h-5 text-yellow-500" />
                    ) : (
                        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                </button>

                <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-30">
                            {user?.name || 'Admin'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.role || 'Administrateur'}
                        </span>
                    </div>
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header