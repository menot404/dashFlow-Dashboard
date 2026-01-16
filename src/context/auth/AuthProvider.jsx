import { useState, useEffect, useCallback } from 'react'
import { LOCAL_STORAGE_KEYS } from '../../utils/constants'
import { AuthContext } from './AuthContext'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER)
        if (storedUser) {
          // Utiliser setTimeout pour éviter les re-renders en cascade
          setTimeout(() => {
            setUser(JSON.parse(storedUser))
            setLoading(false)
          }, 0)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = useCallback(async (email) => {
    // Fake authentication - ignorer le password
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
    setUser(null)
  }, [])

  const updateUser = useCallback((userData) => {
    setUser(prev => {
      const updatedUser = { ...prev, ...userData }
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(updatedUser))
      return updatedUser
    })
  }, [])

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