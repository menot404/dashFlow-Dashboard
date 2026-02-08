// Importation des hooks React, icônes, navigation et composant Modal
import { useState, useEffect, useRef } from 'react'
import { Search, Command } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Modal from '../ui/Modal'

/**
 * Composant GlobalSearch : barre de recherche globale accessible via raccourci clavier
 * Gère l'ouverture de la modal, la navigation, les suggestions et le focus automatique
 */
const GlobalSearch = () => {
  // État d'ouverture de la modal de recherche
  const [isOpen, setIsOpen] = useState(false)
  // Query de recherche
  const [query, setQuery] = useState('')
  // Hook de navigation
  const navigate = useNavigate()
  // Référence vers l'input pour focus
  const inputRef = useRef(null)

  // Gestion du raccourci clavier Cmd+K / Ctrl+K pour ouvrir la recherche
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus automatique sur l'input quand la modal est ouverte
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Gestion de la soumission du formulaire de recherche
  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      setQuery('')
    }
  }

  // Suggestions rapides pour la navigation
  const suggestions = [
    { label: 'Utilisateurs', action: () => navigate('/users') },
    { label: 'Produits', action: () => navigate('/products') },
    { label: 'Paramètres', action: () => navigate('/settings') },
  ]

  return (
    <>
      {/* Bouton de déclenchement (version desktop) */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
      >
        <Search className="w-4 h-4" />
        <span className="text-gray-600 dark:text-gray-400 hidden lg:inline">Rechercher...</span>
        <kbd className="hidden lg:inline ml-4 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900">
          {navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'}
        </kbd>
      </button>

      {/* Modal de recherche avec backdrop blur */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="lg"
        hideCloseButton
        className="p-4 sm:p-6 backdrop-blur-sm"
      >
        <div className="p-2">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher des utilisateurs, produits, paramètres..."
                className="w-full pl-12 pr-4 py-3 text-lg border-0 focus:ring-0 focus:outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400"
                autoComplete="off"
              />
            </div>
          </form>

          {/* Suggestions rapides */}
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Suggestions :</p>
            {suggestions.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action()
                  setIsOpen(false)
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-left"
              >
                <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                <Command className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}

export default GlobalSearch