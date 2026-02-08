/**
 * Hook personnalisé pour accéder au contexte de thème
 * Doit être utilisé dans un ThemeProvider
 * @returns {Object} Contexte du thème
 */
import { useContext } from 'react'
import { ThemeContext } from '../context/theme/ThemeContext'

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}