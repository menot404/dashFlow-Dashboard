import React from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from '../ui/Button'
import { logError } from '../../utils/errorHandler'

/**
 * Composant ErrorBoundary : gestionnaire d'erreur React pour les composants enfants
 * Affiche une UI d'erreur et propose des actions de réinitialisation ou de rechargement
 * Log l'erreur côté client via logError
 */
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        // État local : erreur détectée et objet erreur
        this.state = { hasError: false, error: null }
    }

    // Méthode statique pour mettre à jour l'état en cas d'erreur
    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    // Log l'erreur et réinitialise l'état après un délai
    componentDidCatch(error, errorInfo) {
        logError(error, errorInfo)

        // Réinitialiser l'état après un certain temps
        setTimeout(() => {
            this.setState({ hasError: false, error: null })
        }, 5000)
    }

    // Handler pour réinitialiser l'état d'erreur
    handleReset = () => {
        this.setState({ hasError: false, error: null })
        if (this.props.onReset) {
            this.props.onReset()
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-100 flex flex-col items-center justify-center p-6 animate-fade-in">
                    {/* Icône d'alerte */}
                    <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
                    {/* Titre d'erreur */}
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Oups, une erreur est survenue
                    </h2>
                    {/* Message d'erreur */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                        Nous avons rencontré un problème. Notre équipe a été notifiée.
                    </p>
                    {/* Actions utilisateur */}
                    <div className="flex gap-3">
                        <Button onClick={this.handleReset}>
                            Réessayer
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => window.location.reload()}
                        >
                            Recharger
                        </Button>
                    </div>
                </div>
            )
        }

        // Affiche les enfants si pas d'erreur
        return this.props.children
    }
}