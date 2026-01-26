import React, { Fragment, useEffect, useCallback } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Maximize2, Minimize2 } from 'lucide-react'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  hideCloseButton = false,
  fullScreen = false,
  showHeader = true,
  backdropBlur = true,
  closeOnBackdropClick = true,
  padding = 'default',
  borderRadius = 'xl'
}) => {
  // Empêcher le scroll du body quand modal ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none' // Empêche le défilement tactile
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'unset'
    }
  }, [isOpen])

  // Fermeture avec Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && isOpen) {
      onClose()
    }
  }, [isOpen, onClose])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const sizeClasses = {
    xs: 'max-w-xs sm:max-w-sm',
    sm: 'max-w-sm sm:max-w-md',
    md: 'max-w-md sm:max-w-lg lg:max-w-xl',
    lg: 'max-w-lg sm:max-w-xl lg:max-w-2xl xl:max-w-3xl',
    xl: 'max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl',
    '2xl': 'max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  }

  const paddingClasses = {
    none: 'p-0',
    tight: 'p-3 sm:p-4',
    default: 'p-4 sm:p-6',
    comfortable: 'p-6 sm:p-8',
    loose: 'p-8 sm:p-10',
  }

  const borderRadiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
  }

  // Classes responsive pour le contenu
  const contentClasses = {
    xs: 'max-h-[50vh]',
    sm: 'max-h-[60vh]',
    md: 'max-h-[70vh]',
    lg: 'max-h-[75vh]',
    xl: 'max-h-[80vh]',
    '2xl': 'max-h-[85vh]',
    full: 'max-h-[90vh]',
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={closeOnBackdropClick ? onClose : () => {}}
        static
      >
        {/* Backdrop amélioré */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div 
            className={`fixed inset-0 ${
              backdropBlur 
                ? 'bg-black/50 backdrop-blur-sm' 
                : 'bg-black/40'
            }`}
            aria-hidden="true"
          />
        </Transition.Child>

        {/* Modal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className={`flex ${
            fullScreen ? 'h-full items-stretch' : 'min-h-full items-center justify-center'
          } p-2 sm:p-4 md:p-6`}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 scale-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 scale-95 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className={`
                w-full ${sizeClasses[size]} ${borderRadiusClasses[borderRadius]}
                transform overflow-hidden
                bg-white dark:bg-gray-800 
                shadow-2xl shadow-black/20 dark:shadow-black/40
                transition-all duration-300
                ${fullScreen ? 'h-full max-h-[95vh] my-auto' : ''}
                ${!fullScreen && size !== 'full' ? contentClasses[size] : ''}
                border border-gray-200/50 dark:border-gray-700/50
                ${fullScreen ? 'relative' : 'mx-auto'}
              `}>
                {/* Header avec gradient moderne */}
                {showHeader && (
                  <div className={`
                    sticky top-0 z-10
                    ${paddingClasses[padding]} pb-4
                    border-b border-gray-100 dark:border-gray-700
                    bg-gradient-to-r from-gray-50 to-white 
                    dark:from-gray-800 dark:to-gray-900
                  `}>
                    <div className="flex items-center justify-between gap-4">
                      <Dialog.Title 
                        as="h3" 
                        className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate"
                      >
                        {title}
                      </Dialog.Title>
                      
                      {!hideCloseButton && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={onClose}
                            className={`
                              p-2 rounded-lg transition-all duration-200
                              hover:bg-gray-100 dark:hover:bg-gray-700
                              active:scale-95
                              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                              dark:focus:ring-offset-gray-800
                            `}
                            aria-label="Fermer"
                          >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Contenu avec défilement contrôlé */}
                <div className={`
                  ${paddingClasses[padding]} 
                  ${fullScreen ? 'h-[calc(100%-70px)]' : ''}
                  ${!showHeader ? paddingClasses[padding] : ''}
                  ${fullScreen ? 'overflow-y-auto' : 'overflow-y-auto'}
                  overscroll-contain
                `}>
                  {children}
                </div>

                {/* Indicateur de défilement pour mobile */}
                {!fullScreen && (
                  <div className="
                    absolute bottom-0 left-0 right-0
                    h-8 pointer-events-none
                    bg-gradient-to-t from-white dark:from-gray-800 to-transparent
                    opacity-50
                  " />
                )}

                {/* Bouton de fermeture flottant pour mobile */}
                {!showHeader && !hideCloseButton && (
                  <button
                    onClick={onClose}
                    className={`
                      fixed sm:absolute top-4 right-4
                      p-3 rounded-full shadow-lg
                      bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
                      hover:bg-white dark:hover:bg-gray-700
                      active:scale-95
                      transition-all duration-200
                      border border-gray-200 dark:border-gray-700
                      z-20
                      focus:outline-none focus:ring-2 focus:ring-primary-500
                    `}
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        {/* Indicateur visuel pour l'arrière-plan cliquable */}
        {closeOnBackdropClick && (
          <div className="
            fixed inset-0
            pointer-events-none
            flex items-center justify-center
            opacity-0 hover:opacity-100
            transition-opacity duration-300
            z-40
          ">
            <div className="
              absolute bottom-8
              px-4 py-2
              bg-black/70 text-white text-sm
              rounded-full backdrop-blur-sm
              animate-pulse
              hidden sm:block
            ">
              Cliquez à l'extérieur pour fermer
            </div>
          </div>
        )}
      </Dialog>
    </Transition>
  )
}

// Composant Modal.Body pour structurer le contenu
Modal.Body = ({ children, className = '' }) => (
  <div className={`text-gray-600 dark:text-gray-300 ${className}`}>
    {children}
  </div>
)

// Composant Modal.Footer pour les actions
Modal.Footer = ({ children, className = '' }) => (
  <div className={`
    mt-6 pt-4 
    border-t border-gray-100 dark:border-gray-700
    flex flex-col sm:flex-row gap-3 justify-end
    ${className}
  `}>
    {children}
  </div>
)

// Composant Modal.Title pour un titre personnalisé
Modal.Title = ({ children, className = '' }) => (
  <div className={`text-2xl font-bold text-gray-900 dark:text-white ${className}`}>
    {children}
  </div>
)

// Composant Modal.Description
Modal.Description = ({ children, className = '' }) => (
  <p className={`mt-2 text-gray-500 dark:text-gray-400 ${className}`}>
    {children}
  </p>
)

export default Modal
