/**
 * ThemeProvider : Fournit le contexte de thème (clair/sombre) à l'application
 * Gère la persistance du thème dans le localStorage et l'application de la classe 'dark' sur le document
 */
import { useState, useEffect, useCallback } from 'react'
import { LOCAL_STORAGE_KEYS } from '../../utils/constants'
import { ThemeContext } from './ThemeContext'

const ThemeProvider = ({ children }) => {
    // État du thème actuel
    const [theme, setTheme] = useState('light')

    // Effet pour charger le thème au démarrage (localStorage ou préférence système)
    useEffect(() => {
        const loadTheme = () => {
            try {
                const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME)
                if (savedTheme) {
                    setTheme(savedTheme)
                    if (savedTheme === 'dark') {
                        document.documentElement.classList.add('dark')
                    }
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    setTheme('dark')
                    document.documentElement.classList.add('dark')
                }
            } catch (error) {
                console.error('Error loading theme:', error)
            }
        }
        loadTheme()
    }, [])

    // Fonction pour basculer le thème et mettre à jour le localStorage
    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme)

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme])

    // Valeur du contexte
    const value = {
        theme,
        toggleTheme,
        isDark: theme === 'dark',
    }

    // Fournit le contexte aux enfants
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider;