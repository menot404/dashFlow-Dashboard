// Importation des icônes, hooks de thème et d'authentification, et composant de recherche globale
import { Moon, Sun, Bell, User, Menu } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'
import GlobalSearch from './GlobalSearch'

/**
 * Composant Header (barre supérieure du dashboard)
 * Affiche le titre, la recherche globale, les boutons de thème, notifications et profil utilisateur.
 * Utilise les hooks de thème et d'authentification pour l'affichage dynamique.
 * @param {function} onMenuClick - callback pour ouvrir le menu latéral sur mobile
 */
/**
 * Composant Header (barre supérieure du dashboard)
 * Affiche le titre, la recherche globale, les boutons de thème, notifications et profil utilisateur.
 * Utilise les hooks de thème et d'authentification pour l'affichage dynamique.
 * @param {function} onMenuClick - callback pour ouvrir le menu latéral sur mobile
 */
const Header = ({ onMenuClick }) => {
    // Récupère le thème actuel et la fonction de bascule
    const { theme, toggleTheme } = useTheme()
    // Récupère les informations de l'utilisateur connecté
    const { user } = useAuth()

    // Rendu principal du header : menu, titre, recherche, actions utilisateur
    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                {/* Bouton menu latéral pour mobile */}
                <button
                    onClick={onMenuClick}
                    className="p-2 md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center"
                    aria-label="Menu"
                >
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Titre du dashboard */}
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Dashboard
                </h2>

                {/* Barre de recherche globale (desktop uniquement) */}
                <div className="hidden md:block ml-4">
                    <GlobalSearch />
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Bouton de bascule du thème (clair/sombre) */}
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

                {/* Bouton notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Affichage utilisateur connecté */}
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