import React, { useState, useCallback } from 'react'
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'
import { NotificationContext } from './NotificationContext'

const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
}

const NotificationComponent = React.memo(({ notifications, removeNotification }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {notifications.map((notification) => {
                const Icon = icons[notification.type]
                const bgColor = {
                    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
                    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
                    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
                    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
                }[notification.type]

                const textColor = {
                    success: 'text-green-800 dark:text-green-200',
                    error: 'text-red-800 dark:text-red-200',
                    warning: 'text-yellow-800 dark:text-yellow-200',
                    info: 'text-blue-800 dark:text-blue-200',
                }[notification.type]

                const iconColor = {
                    success: 'text-green-500',
                    error: 'text-red-500',
                    warning: 'text-yellow-500',
                    info: 'text-blue-500',
                }[notification.type]

                return (
                    <div
                        key={notification.id}
                        className={`${bgColor} border rounded-lg shadow-lg transform transition-all duration-300 animate-slide-in`}
                        style={{
                            animation: 'slideIn 0.3s ease-out',
                        }}
                    >
                        <div className="p-4">
                            <div className="flex items-start">
                                <div className="shrink-0">
                                    <Icon className={`w-5 h-5 ${iconColor}`} />
                                </div>
                                <div className="ml-3 w-0 flex-1">
                                    {notification.title && (
                                        <p className={`text-sm font-medium ${textColor}`}>
                                            {notification.title}
                                        </p>
                                    )}
                                    <p className={`mt-1 text-sm ${notification.title ? 'text-gray-600 dark:text-gray-300' : textColor}`}>
                                        {notification.message}
                                    </p>
                                    {notification.action && (
                                        <div className="mt-3">
                                            <button
                                                onClick={notification.action.onClick}
                                                className={`text-sm font-medium ${textColor} underline hover:no-underline`}
                                            >
                                                {notification.action.label}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4 shrink-0 flex">
                                    <button
                                        onClick={() => removeNotification(notification.id)}
                                        className="inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Barre de progression */}
                        {notification.duration && notification.duration > 0 && (
                            <div className="h-1 w-full bg-current opacity-20">
                                <div
                                    className="h-full bg-current transition-all duration-100 ease-linear"
                                    style={{
                                        width: `${notification.progress || 100}%`,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )
            })}
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
            // Animation de la barre de progression
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

    // Méthodes helpers pour les types de notifications courants
    const showSuccess = useCallback((message, title = 'Succès') => {
        return addNotification({
            title,
            message,
            type: 'success',
            duration: 3000,
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

export default NotificationProvider;