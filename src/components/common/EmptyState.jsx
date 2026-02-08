// Importation des icônes et du composant Button
import { Package, ShoppingBag, Search, Plus } from 'lucide-react'
import Button from '../ui/Button'

/**
 * Composant EmptyState : affiche un état vide avec icône, titre, description et action
 * @param {string} type - Type d'état vide ('products', 'users', 'search')
 * @param {string} title - Titre personnalisé
 * @param {string} description - Description personnalisée
 * @param {string} actionLabel - Libellé du bouton d'action
 * @param {function} onAction - Callback du bouton d'action
 * @param {string} className - Classes CSS additionnelles
 */
const EmptyState = ({
    type = 'products',
    title,
    description,
    actionLabel,
    onAction,
    className = ''
}) => {
    // Définition des icônes selon le type
    const icons = {
        products: Package,
        users: ShoppingBag,
        search: Search,
        default: ShoppingBag,
    }

    // Textes par défaut selon le type
    const defaultTexts = {
        products: {
            title: 'Aucun produit trouvé',
            description: 'Commencez par ajouter votre premier produit à votre catalogue.',
        },
        users: {
            title: 'Aucun utilisateur trouvé',
            description: 'Commencez par ajouter votre premier utilisateur.',
        },
        search: {
            title: 'Aucun résultat',
            description: 'Essayez de modifier vos critères de recherche.',
        },
    }

    // Sélection de l'icône et du texte selon le type
    const Icon = icons[type] || icons.default
    const config = defaultTexts[type] || defaultTexts.products

    return (
        <div className={`text-center py-12 px-4 ${className}`}>
            {/* Icône d'état vide */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Icon className="w-8 h-8 text-gray-400" />
            </div>
            {/* Titre d'état vide */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {title || config.title}
            </h3>
            {/* Description d'état vide */}
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                {description || config.description}
            </p>
            {/* Bouton d'action si fourni */}
            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    className="inline-flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}

export default EmptyState;