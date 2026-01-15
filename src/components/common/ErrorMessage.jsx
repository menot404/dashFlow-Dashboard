import { AlertCircle } from "lucide-react";
const ErrorMessage = ({ message, onRetry, className = '' }) => {

    return ( 
        <>
            <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
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