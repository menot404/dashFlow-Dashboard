import { useState, useEffect, useCallback } from 'react'
import { LOCAL_STORAGE_KEYS } from '../../utils/constants'
import { AuthContext } from './AuthContext'

/**
 * Fournisseur de contexte d'authentification
 * Gère l'état utilisateur, la connexion, la déconnexion et la mise à jour du profil.
 * Persiste l'utilisateur dans le localStorage.
 * @param {ReactNode} children - Composants enfants
 */
const AuthProvider = ({ children }) => {
  // user : informations de l'utilisateur connecté
  const [user, setUser] = useState(null)
  // loading : état de chargement initial
  const [loading, setLoading] = useState(true)

  /**
   * Effet de chargement initial : récupère l'utilisateur depuis le localStorage
   */
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

  /**
   * Connecte l'utilisateur (fake auth)
   * @param {string} email - Email utilisateur
   * @returns {Object} Utilisateur connecté
   */
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

  /**
   * Déconnecte l'utilisateur et nettoie le localStorage
   */
  const logout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
    setUser(null)
  }, [])

  /**
   * Met à jour le profil utilisateur et persiste dans le localStorage
   * @param {Object} userData - Données à mettre à jour
   */
  const updateUser = useCallback((userData) => {
    setUser(prev => {
      const updatedUser = { ...prev, ...userData }
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(updatedUser))
      return updatedUser
    })
  }, [])

  // Objet de contexte fourni aux enfants
  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }

  // Rendu du provider avec le contexte d'authentification
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;