import { useState, useCallback } from 'react'

/**
 * Hook personnalisé pour gérer les appels API asynchrones
 * Fournit l'état, la donnée, l'erreur et la fonction d'exécution
 * @param {function} apiFunction - Fonction API à exécuter
 * @returns {Object} data, loading, error, execute
 */
export function useApi(apiFunction) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true)
            setError(null)
            const result = await apiFunction(...args)
            setData(result)
            return result
        } catch (err) {
            setError(err.message || 'An error occurred')
            throw err
        } finally {
            setLoading(false)
        }
    }, [apiFunction])

    return { data, loading, error, execute }
}