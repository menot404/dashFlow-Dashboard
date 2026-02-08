/**
 * Hook personnalisé pour accéder au contexte d'authentification
 * Doit être utilisé dans un AuthProvider
 * @returns {Object} Contexte d'authentification
 */
import { useContext } from 'react'
import { AuthContext } from '../context/auth/AuthContext'

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}