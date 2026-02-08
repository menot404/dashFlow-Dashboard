/**
 * Hook personnalisé pour accéder au contexte de notification
 * Doit être utilisé dans un NotificationProvider
 * @returns {Object} Contexte de notification
 */
import { useContext } from 'react'
import { NotificationContext } from '../context/notification/NotificationContext'

export const useNotification = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }
    return context
}