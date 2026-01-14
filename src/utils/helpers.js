export const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount)
}

export const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
        clearTimeout(timeout)
        func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}