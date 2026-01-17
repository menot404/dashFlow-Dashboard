import React, { useState, useEffect, useCallback } from 'react'
import { LOCAL_STORAGE_KEYS } from '../../utils/constants'
import { ThemeContext } from './ThemeContext'

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light')

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

    const value = {
        theme,
        toggleTheme,
        isDark: theme === 'dark',
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider;