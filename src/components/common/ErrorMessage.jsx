// Importation de l'icône d'alerte
import { AlertCircle } from "lucide-react";

/**
 * Composant ErrorMessage : affiche un message d'erreur avec option de réessai
 * @param {string} message - Message d'erreur à afficher
 * @param {function} onRetry - Callback pour réessayer l'action
 * @param {string} className - Classes CSS additionnelles
 */
const ErrorMessage = ({ message, onRetry, className = '' }) => {
    return (
        <>
            <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
                {/* Icône d'erreur */}
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                {/* Message d'erreur */}
                <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
                {/* Bouton de réessai si callback fourni */}
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Réessayer
                    </button>
                )}
            </div>
        </>
    );
}

export default ErrorMessage;