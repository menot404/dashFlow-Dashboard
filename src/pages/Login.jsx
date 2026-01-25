import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card'
import { isValidEmail } from '../utils/validators'
import { Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!isValidEmail(email)) {
            setError('Veuillez entrer un email valide')
            return
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères')
            return
        }

        try {
            setLoading(true)
            await login(email, password, rememberMe)
            navigate('/')
        } catch (err) {
            setError('Identifiants incorrects. Veuillez vérifier vos informations.')
            console.error('Login error:', err);
        } finally {
            setLoading(false)
        }
    }

    const handleDemoLogin = async () => {
        setEmail('admin@example.com')
        setPassword('admin123')
        
        try {
            setLoading(true)
            await login('admin@example.com', 'admin123', false)
            navigate('/')
        } catch (err) {
            setError('Erreur de connexion démo')
            console.error('Demo login error:', err);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4">
            <div className="w-full max-w-md mx-auto">
                {/* En-tête */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="flex justify-center mb-3 sm:mb-4">
                        <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg">
                            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        DashFlow
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Connectez-vous à votre espace d'administration
                    </p>
                </div>

                {/* Carte de connexion */}
                <Card className="w-full shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center">
                            Connexion
                        </CardTitle>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
                            {/* Message d'erreur */}
                            {error && (
                                <div className="flex items-start p-3 sm:p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                                </div>
                            )}

                            {/* Champ Email */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Adresse email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg
                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                            placeholder:text-gray-400 dark:placeholder:text-gray-500
                                            transition-all duration-200"
                                        placeholder="votre@email.com"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Champ Mot de passe */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Mot de passe
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                                    >
                                        {showPassword ? 'Masquer' : 'Afficher'}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 sm:pl-12 pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg
                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                            placeholder:text-gray-400 dark:placeholder:text-gray-500
                                            transition-all duration-200"
                                        placeholder="••••••••"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                        ) : (
                                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Se souvenir de moi
                                    </span>
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>

                            {/* Bouton de connexion démo */}
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={handleDemoLogin}
                                    disabled={loading}
                                    className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 
                                        border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 
                                        rounded-lg font-medium hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/40 dark:hover:to-blue-700/40
                                        transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2"
                                >
                                    <Shield className="w-4 h-4" />
                                    Connexion avec compte démo
                                </button>
                            </div>
                        </CardContent>

                        {/* Bouton de soumission */}
                        <CardFooter className="p-4 sm:p-6 pt-0">
                            <Button
                                type="submit"
                                loading={loading}
                                className="w-full py-3 sm:py-4 text-sm sm:text-base font-medium bg-gradient-to-r from-primary-600 to-primary-700 
                                    hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl
                                    transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {!loading && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                                {loading ? 'Connexion en cours...' : 'Se connecter'}
                            </Button>

                            {/* Liens supplémentaires */}
                            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-center space-y-2">
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                        En vous connectant, vous acceptez nos{' '}
                                        <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                                            conditions d'utilisation
                                        </Link>{' '}
                                        et notre{' '}
                                        <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                                            politique de confidentialité
                                        </Link>
                                    </p>
                                    
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                        <span className="text-gray-500 dark:text-gray-400">Pas encore de compte ? </span>
                                        <Link
                                            to="/register"
                                            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium inline-flex items-center gap-1"
                                        >
                                            Créer un compte
                                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </Link>
                                    </p>

                                    {/* Informations de test */}
                                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                                            💡 Pour tester rapidement :
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            Email: <span className="font-mono">admin@example.com</span>
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            Mot de passe: <span className="font-mono">admin123</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                {/* Footer */}
                <div className="mt-6 sm:mt-8 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        © {new Date().getFullYear()} DashFlow. Tous droits réservés.
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                        Version 1.0.0
                    </p>
                </div>

                {/* Design elements décoratifs */}
                <div className="fixed top-0 left-0 right-0 h-40 bg-gradient-to-r from-primary-500/10 to-blue-500/10 dark:from-primary-500/5 dark:to-blue-500/5 -z-10" />
                <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-r from-blue-500/10 to-primary-500/10 dark:from-blue-500/5 dark:to-primary-500/5 -z-10" />
            </div>
        </div>
    )
}

export default Login