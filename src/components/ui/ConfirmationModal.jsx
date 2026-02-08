import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import Button from './Button'

const icons = {
    warning: AlertTriangle,
    success: CheckCircle,
    info: Info,
    error: XCircle,
}

const colors = {
    warning: {
        bg: 'bg-yellow-50',
        icon: 'text-yellow-600',
        button: 'bg-yellow-600 hover:bg-yellow-700',
    },
    success: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
    },
    info: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
    },
    error: {
        bg: 'bg-red-50',
        icon: 'text-red-600',
        button: 'bg-red-600 hover:bg-red-700',
    },
}

/**
 * Composant ConfirmationModal : modale de confirmation d'action
 * Affiche un message, icône, boutons et gère les types (warning, success, error, info)
 */
const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    type = 'warning',
    isLoading = false,
    destructive = false,
}) => {
    const Icon = icons[type]
    const colorScheme = colors[type]

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                                <div className="flex flex-col items-center text-center">
                                    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${colorScheme.bg}`}>
                                        <Icon className={`h-6 w-6 ${colorScheme.icon}`} />
                                    </div>

                                    <div className="mt-4">
                                        <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {title}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {message}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex w-full gap-3">
                                        <Button
                                            variant="ghost"
                                            onClick={onClose}
                                            disabled={isLoading}
                                            className="flex-1"
                                        >
                                            {cancelText}
                                        </Button>
                                        <Button
                                            variant={destructive ? 'danger' : 'primary'}
                                            onClick={onConfirm}
                                            loading={isLoading}
                                            className="flex-1"
                                        >
                                            {confirmText}
                                        </Button>
                                    </div>

                                    {destructive && (
                                        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                                            Cette action est irréversible.
                                        </p>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ConfirmationModal;