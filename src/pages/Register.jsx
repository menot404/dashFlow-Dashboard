import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { isValidEmail, isValidPassword } from '../utils/validators'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!formData.name.trim()) {
            setError('Veuillez entrer votre nom complet')
            return
        }

        if (!isValidEmail(formData.email)) {
            setError('Veuillez entrer un email valide')
            return
        }

        if (!isValidPassword(formData.password)) {
            setError('Le mot de passe doit contenir au moins 6 caractères')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            return
        }

        try {
            setLoading(true)
            // Fake registration - just log in the user
            await login(formData.email, formData.password)
            navigate('/')
        } catch (err) {
            setError(`Une erreur est survenue lors de l'inscription: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-6 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-500 mb-2">
                        DashFlow
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                        Créez votre compte
                    </p>
                </div>

                <Card className="shadow-lg sm:shadow-xl dark:shadow-gray-900/20">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg sm:text-xl font-semibold">
                            Inscription
                        </CardTitle>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-3 sm:space-y-4">
                            {error && (
                                <div className="flex items-center p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg animate-fade-in">
                                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" />
                                    <span className="text-xs sm:text-sm">{error}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nom complet
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                                                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                                    text-sm sm:text-base
                                                    placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        placeholder="John Doe"
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                                                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                                    text-sm sm:text-base
                                                    placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        placeholder="admin@example.com"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                                                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                                    text-sm sm:text-base
                                                    placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        placeholder="••••••••"
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Confirmer le mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                                                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                                    text-sm sm:text-base
                                                    placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        placeholder="••••••••"
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-3 sm:space-y-4 pt-4">
                            <Button
                                type="submit"
                                loading={loading}
                                className="w-full py-2.5 sm:py-3 text-sm sm:text-base font-medium"
                                disabled={loading}
                            >
                                {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                            </Button>

                            <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                <p className="mt-1 sm:mt-2">
                                    <span className="text-gray-500 dark:text-gray-400">Vous avez déjà un compte? </span>
                                    <Link
                                        to="/login"
                                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                                    >
                                        Se connecter
                                    </Link>
                                </p>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                {/* Ajout d'une note informative en bas */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        En vous inscrivant, vous acceptez nos conditions d'utilisation
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register;