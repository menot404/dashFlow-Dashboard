import React from 'react'
import clsx from 'clsx'

const SkeletonLoader = ({
    type = 'text',
    count = 1,
    className = '',
    width,
    height,
    rounded = 'default'
}) => {
    const getRoundedClass = () => {
        switch (rounded) {
            case 'full': return 'rounded-full'
            case 'lg': return 'rounded-lg'
            case 'xl': return 'rounded-xl'
            case 'none': return ''
            default: return 'rounded'
        }
    }

    const renderSkeleton = () => {
        const baseClass = `bg-gray-200 dark:bg-gray-700 animate-pulse ${getRoundedClass()}`

        switch (type) {
            case 'text':
                return (
                    <div
                        className={clsx(baseClass, 'h-4', className)}
                        style={{ width: width || '100%' }}
                    />
                )
            case 'avatar':
                return (
                    <div
                        className={clsx(baseClass, 'w-10 h-10', className)}
                        style={{ width: width, height: height }}
                    />
                )
            case 'card':
                return (
                    <div
                        className={clsx(baseClass, 'h-40', className)}
                        style={{ width: width, height: height }}
                    />
                )
            case 'button':
                return (
                    <div
                        className={clsx(baseClass, 'h-10', className)}
                        style={{ width: width || '100px', height: height }}
                    />
                )
            case 'input':
                return (
                    <div
                        className={clsx(baseClass, 'h-10', className)}
                        style={{ width: width || '100%', height: height }}
                    />
                )
            default:
                return (
                    <div
                        className={clsx(baseClass, 'h-4', className)}
                        style={{ width: width || '100%', height: height }}
                    />
                )
        }
    }

    if (count > 1) {
        return (
            <div className={clsx('space-y-2', className)}>
                {[...Array(count)].map((_, i) => (
                    <React.Fragment key={i}>
                        {renderSkeleton()}
                    </React.Fragment>
                ))}
            </div>
        )
    }

    return renderSkeleton()
}

// Variantes pré-définies
export const TableRowSkeleton = ({ columns = 5, rows = 5 }) => (
    <>
        {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
                {[...Array(columns)].map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </td>
                ))}
            </tr>
        ))}
    </>
)

export const CardSkeleton = ({ count = 1 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(count)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
        ))}
    </div>
)

export default SkeletonLoader;