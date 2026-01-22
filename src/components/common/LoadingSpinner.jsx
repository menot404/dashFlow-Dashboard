import { Loader2 } from "lucide-react";
import clsx from "clsx";

const LoadingSpinner = ({ size = 'md', fullscreen = false, text = 'Chargement...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const containerClasses = fullscreen 
    ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center'
    : 'flex flex-col items-center justify-center'

  return (
    <div className={clsx(containerClasses, className)}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600`} />
      {text && <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  )
}

export default LoadingSpinner;