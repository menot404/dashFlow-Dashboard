/**
 * NotificationProvider : Fournit le contexte de notification à l'application
 * Gère l'affichage, l'ajout et la suppression des notifications globales
 */
import React, { useState, useCallback } from 'react'
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'
import { NotificationContext } from './NotificationContext'

// Icônes associées à chaque type de notification
const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
}

/**
 * Composant d'affichage des notifications (mémoïsé)
 * Affiche chaque notification avec style, icône et bouton de fermeture
 */
const NotificationComponent = React.memo(({ notifications, removeNotification }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
            {notifications.map((notification) => {
                const Icon = icons[notification.type]

                // Styles dynamiques selon le type
                const styles = {
                    success: {
                        bg: 'bg-white dark:bg-gray-800',
                        border: 'border-l-4 border-green-500',
                        icon: 'text-green-500',
                        title: 'text-green-900 dark:text-green-100',
                        message: 'text-green-700 dark:text-green-200',
                        progress: 'bg-green-500',
                        shadow: 'shadow-lg shadow-green-500/10'
                    },
                    error: {
                        bg: 'bg-white dark:bg-gray-800',
                        border: 'border-l-4 border-red-500',
                        icon: 'text-red-500',
                        title: 'text-red-900 dark:text-red-100',
                        message: 'text-red-700 dark:text-red-200',
                        progress: 'bg-red-500',
                        shadow: 'shadow-lg shadow-red-500/10'
                    },
                    warning: {
                        bg: 'bg-white dark:bg-gray-800',
                        border: 'border-l-4 border-yellow-500',
                        icon: 'text-yellow-500',
                        title: 'text-yellow-900 dark:text-yellow-100',
                        message: 'text-yellow-700 dark:text-yellow-200',
                        progress: 'bg-yellow-500',
                        shadow: 'shadow-lg shadow-yellow-500/10'
                    },
                    info: {
                        bg: 'bg-white dark:bg-gray-800',
                        border: 'border-l-4 border-blue-500',
                        icon: 'text-blue-500',
                        title: 'text-blue-900 dark:text-blue-100',
                        message: 'text-blue-700 dark:text-blue-200',
                        progress: 'bg-blue-500',
                        shadow: 'shadow-lg shadow-blue-500/10'
                    },
                }[notification.type]

                return (
                    <div
                        key={notification.id}
                        className={`
                            ${styles.bg} ${styles.border} ${styles.shadow}
                            rounded-lg overflow-hidden
                            transform transition-all duration-300 
                            animate-slide-in backdrop-blur-sm
                            border border-gray-200 dark:border-gray-700
                        `}
                        style={{
                            animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    >
                        <div className="p-4">
                            <div className="flex items-start gap-3">
                                {/* Icône avec arrière-plan coloré */}
                                <div className={`
                                    shrink-0 rounded-full p-2
                                    ${notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' : ''}
                                    ${notification.type === 'error' ? 'bg-red-100 dark:bg-red-900/30' : ''}
                                    ${notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}
                                    ${notification.type === 'info' ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                                `}>
                                    <Icon className={`w-5 h-5 ${styles.icon}`} />
                                </div>

                                {/* Contenu */}
                                <div className="flex-1 min-w-0">
                                    {notification.title && (
                                        <p className={`text-sm font-semibold ${styles.title} mb-1`}>
                                            {notification.title}
                                        </p>
                                    )}
                                    <p className={`text-sm ${styles.message} leading-relaxed`}>
                                        {notification.message}
                                    </p>
                                    {notification.action && (
                                        <div className="mt-3">
                                            <button
                                                onClick={notification.action.onClick}
                                                className={`
                                                    text-sm font-medium ${styles.icon} 
                                                    hover:underline focus:outline-none 
                                                    focus:ring-2 focus:ring-offset-2 rounded-sm
                                                    ${notification.type === 'success' ? 'focus:ring-green-500' : ''}
                                                    ${notification.type === 'error' ? 'focus:ring-red-500' : ''}
                                                    ${notification.type === 'warning' ? 'focus:ring-yellow-500' : ''}
                                                    ${notification.type === 'info' ? 'focus:ring-blue-500' : ''}
                                                `}
                                            >
                                                {notification.action.label}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Bouton fermer */}
                                <button
                                    onClick={() => removeNotification(notification.id)}
                                    className="
                                        shrink-0 rounded-lg p-1.5
                                        text-gray-400 hover:text-gray-600 
                                        dark:text-gray-500 dark:hover:text-gray-300
                                        hover:bg-gray-100 dark:hover:bg-gray-700/50
                                        transition-colors duration-200
                                        focus:outline-none focus:ring-2 focus:ring-gray-400
                                    "
                                    aria-label="Fermer la notification"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Barre de progression améliorée */}
                        {notification.duration && notification.duration > 0 && (
                            <div className="h-1 w-full bg-gray-200 dark:bg-gray-700">
                                <div
                                    className={`h-full ${styles.progress} transition-all duration-100 ease-linear`}
                                    style={{
                                        width: `${notification.progress || 100}%`,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )
            })}

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100%) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }
                
                .animate-slide-in {
                    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    )
})

NotificationComponent.displayName = 'NotificationComponent'

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id))
    }, [])

    const addNotification = useCallback(({
        title,
        message,
        type = 'info',
        duration = 5000,
        action,
    }) => {
        const id = Date.now()
        const newNotification = { id, title, message, type, duration, action }

        setNotifications(prev => [...prev, newNotification])

        if (duration > 0) {
            const interval = 50
            const steps = duration / interval
            let step = 0

            const progressInterval = setInterval(() => {
                step += 1
                setNotifications(prev =>
                    prev.map(notification =>
                        notification.id === id
                            ? { ...notification, progress: 100 - ((step / steps) * 100) }
                            : notification
                    )
                )
            }, interval)

            setTimeout(() => {
                clearInterval(progressInterval)
                removeNotification(id)
            }, duration)
        }

        return id
    }, [removeNotification])

    const showSuccess = useCallback((message, title = 'Succès') => {
        return addNotification({
            title,
            message,
            type: 'success',
            duration: 4000,
        })
    }, [addNotification])

    const showError = useCallback((message, title = 'Erreur') => {
        return addNotification({
            title,
            message,
            type: 'error',
            duration: 5000,
        })
    }, [addNotification])

    const showWarning = useCallback((message, title = 'Attention') => {
        return addNotification({
            title,
            message,
            type: 'warning',
            duration: 4000,
        })
    }, [addNotification])

    const showInfo = useCallback((message, title = 'Information') => {
        return addNotification({
            title,
            message,
            type: 'info',
            duration: 3000,
        })
    }, [addNotification])

    const value = {
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationComponent
                notifications={notifications}
                removeNotification={removeNotification}
            />
        </NotificationContext.Provider>
    )
}

export default NotificationProvider