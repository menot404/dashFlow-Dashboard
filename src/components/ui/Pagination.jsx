import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const delta = 2
        const range = []
        const rangeWithDots = []
        let l

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i)
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1)
                } else if (i - l !== 1) {
                    rangeWithDots.push('...')
                }
            }
            rangeWithDots.push(i)
            l = i
        })

        return rangeWithDots
    }

    if (totalPages <= 1) return null

    return (
        <nav className="flex items-center justify-center space-x-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...'}
                    className={clsx(
                        'min-w-[40px] h-10 flex items-center justify-center rounded-lg border',
                        page === currentPage
                            ? 'bg-primary-600 border-primary-600 text-white'
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700',
                        page === '...' && 'border-transparent'
                    )}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </nav>
    )
}

export default Pagination;