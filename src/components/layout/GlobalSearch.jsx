import { useState, useEffect, useRef } from 'react'
import { Search, Command } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Modal from '../ui/Modal'

const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef(null)

  // Shortcut clavier Cmd+K / Ctrl+K
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

  // Focus sur l'input quand modal ouvert
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      setQuery('')
    }
  }

  const suggestions = [
    { label: 'Utilisateurs', action: () => navigate('/users') },
    { label: 'Produits', action: () => navigate('/products') },
    { label: 'Paramètres', action: () => navigate('/settings') },
  ]

  return (
    <>
      {/* Bouton de déclenchement */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="text-gray-600 dark:text-gray-400">Rechercher...</span>
        <kbd className="ml-4 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900">
          {navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'}
        </kbd>
      </button>

      {/* Modal de recherche */}
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        size="lg"
        hideCloseButton
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
                className="w-full pl-12 pr-4 py-3 text-lg border-0 focus:ring-0 focus:outline-none bg-transparent"
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
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
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

export default GlobalSearch;