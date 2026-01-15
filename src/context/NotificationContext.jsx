import React, { createContext, useState, useCallback } from 'react'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'

const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
}

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id))
    }, [])

    const addNotification = useCallback(({ title, message, type = 'info', duration = 5000 }) => {
        const id = Date.now()
        const newNotification = { id, title, message, type }

        setNotifications(prev => [...prev, newNotification])

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id)
            }, duration)
        }

        return id
    }, [])

    const NotificationComponent = () => (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => {
                const Icon = icons[notification.type]
                return (
                    <div
                        key={notification.id}
                        className={`
              flex items-start p-4 rounded-lg shadow-lg max-w-sm
              ${notification.type === 'success' ? 'bg-green-50 border border-green-200' : ''}
              ${notification.type === 'error' ? 'bg-red-50 border border-red-200' : ''}
              ${notification.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : ''}
              ${notification.type === 'info' ? 'bg-blue-50 border border-blue-200' : ''}
            `}
                    >
                        <Icon className={`
              mt-0.5 mr-3 flex shrink-0
              ${notification.type === 'success' ? 'text-green-500' : ''}
              ${notification.type === 'error' ? 'text-red-500' : ''}
              ${notification.type === 'warning' ? 'text-yellow-500' : ''}
              ${notification.type === 'info' ? 'text-blue-500' : ''}
            `} />
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="ml-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                )
            })}
        </div>
    )

    const value = {
        notifications,
        addNotification,
        removeNotification,
        NotificationComponent,
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationComponent />
        </NotificationContext.Provider>
    )
}