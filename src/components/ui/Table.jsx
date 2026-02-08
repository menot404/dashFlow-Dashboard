import clsx from 'clsx'

/**
 * Composant Table : table responsive stylisée
 * Fournit la structure principale du tableau
 */
export const Table = ({ children, className = '' }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className={clsx('w-full border-collapse table-auto', className)}>
                {children}
            </table>
        </div>
    )
}

/**
 * En-tête du tableau
 */
export const TableHead = ({ children }) => (
    <thead className="bg-gray-50 dark:bg-gray-800">
        {children}
    </thead>
)

/**
 * Cellule d'en-tête du tableau
 */
export const TableHeader = ({ children, className = '', align = 'left' }) => (
    <th
        className={clsx(
            'px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700',
            `text-${align}`,
            className
        )}
    >
        {children}
    </th>
)

/**
 * Corps du tableau
 */
export const TableBody = ({ children }) => (
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {children}
    </tbody>
)

/**
 * Ligne du tableau
 */
export const TableRow = ({ children, className = '', onClick }) => (
    <tr
        className={clsx(
            'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
            onClick && 'cursor-pointer',
            className
        )}
        onClick={onClick}
    >
        {children}
    </tr>
)

/**
 * Cellule du tableau
 */
export const TableCell = ({ children, className = '', align = 'left', colSpan }) => (
    <td
        className={clsx(
            'px-4 py-4 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700',
            `text-${align}`,
            className
        )}
        colSpan={colSpan}
    >
        {children}
    </td>
)