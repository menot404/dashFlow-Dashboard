import clsx from 'clsx'

/**
 * Composant Card : carte stylisée pour afficher du contenu
 * Fournit des variantes de padding et effet hover
 */
export const Card = ({ children, className = '', padding = 'md', hoverable = false }) => {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    }

    return (
        <div
            className={clsx(
                'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm',
                paddingClasses[padding],
                hoverable && 'hover:shadow-md transition-shadow',
                className
            )}
        >
            {children}
        </div>
    )
}

/**
 * En-tête de la carte
 */
export const CardHeader = ({ children, className = '' }) => (
    <div className={clsx('mb-6', className)}>
        {children}
    </div>
)

/**
 * Titre de la carte
 */
export const CardTitle = ({ children, className = '' }) => (
    <h3 className={clsx('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}>
        {children}
    </h3>
)

/**
 * Contenu principal de la carte
 */
export const CardContent = ({ children, className = '' }) => (
    <div className={className}>
        {children}
    </div>
)

/**
 * Pied de la carte
 */
export const CardFooter = ({ children, className = '' }) => (
    <div className={clsx('mt-6 pt-6 border-t border-gray-200 dark:border-gray-700', className)}>
        {children}
    </div>
)