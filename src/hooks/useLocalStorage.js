import { useState} from 'react'

/**
 * Hook personnalisé pour synchroniser un état avec le localStorage
 * Permet de persister la donnée entre les sessions navigateur
 * @param {string} key - Clé du localStorage
 * @param {any} initialValue - Valeur initiale
 * @returns {[any, function]} Valeur stockée et setter
 */
export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(error)
            return initialValue
        }
    })

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
            console.error(error)
        }
    }

    return [storedValue, setValue]
}