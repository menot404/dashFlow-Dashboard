import React from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from '../ui/Button'
import { logError } from '../../utils/errorHandler'

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        logError(error, errorInfo)

        // Réinitialiser l'état après un certain temps
        setTimeout(() => {
            this.setState({ hasError: false, error: null })
        }, 5000)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null })
        if (this.props.onReset) {
            this.props.onReset()
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex flex-col items-center justify-center p-6 animate-fade-in">
                    <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Oups, une erreur est survenue
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                        Nous avons rencontré un problème. Notre équipe a été notifiée.
                    </p>
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

        return this.props.children
    }
}