import React, { createContext, useState, useEffect, useCallback } from 'react'
import { LOCAL_STORAGE_KEYS } from '../utils/constants'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Charger l'utilisateur depuis localStorage au démarrage
    useEffect(() => {
        const loadUser = () => {
            try {
                const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER)
                if (storedUser) {
                    // Mettre à jour l'état de manière asynchrone
                    requestAnimationFrame(() => {
                        setUser(JSON.parse(storedUser))
                    })
                }
            } catch (error) {
                console.error('Error loading user:', error)
            } finally {
                // Delay setLoading pour éviter les re-renders en cascade
                setTimeout(() => setLoading(false), 0)
            }
        }

        loadUser()
    }, [])

    const login = useCallback(async (email, password) => {
        // Fake authentication
        const fakeUser = {
            id: 1,
            email,
            name: 'Admin User',
            role: 'admin',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3b82f6&color=fff`,
        }

        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(fakeUser))
        setUser(fakeUser)
        return fakeUser
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
        // Mettre à jour l'état de manière asynchrone
        requestAnimationFrame(() => {
            setUser(null)
        })
    }, [])

    const updateUser = useCallback((userData) => {
        const updatedUser = { ...user, ...userData }
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(updatedUser))
        setUser(updatedUser)
    }, [user])

    const value = {
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}