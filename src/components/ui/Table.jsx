import clsx from 'clsx'

export const Table = ({ children, className = '' }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className={clsx('w-full border-collapse table-auto', className)}>
                {children}
            </table>
        </div>
    )
}

export const TableHead = ({ children }) => (
    <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>{children}</tr>
    </thead>
)

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

export const TableBody = ({ children }) => (
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {children}
    </tbody>
)

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