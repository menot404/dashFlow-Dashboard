import { useState, useMemo } from 'react'

export function usePagination(items, itemsPerPage) {
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = useMemo(() => {
        return Math.ceil(items.length / itemsPerPage)
    }, [items, itemsPerPage])

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return items.slice(startIndex, startIndex + itemsPerPage)
    }, [items, currentPage, itemsPerPage])

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    return {
        currentPage,
        totalPages,
        paginatedItems,
        goToPage,
        nextPage,
        prevPage,
    }
}