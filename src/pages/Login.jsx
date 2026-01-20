import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card'
import { isValidEmail } from '../utils/validators'
import { Mail, Lock, AlertCircle } from 'lucide-react'
const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

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
            await login(email, password)
            navigate('/')
        } catch (err) {
            setError('Identifiants incorrects')
            console.error('Login error:', err);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-600 mb-2">DashFlow</h1>
                    <p className="text-gray-600 dark:text-gray-400">Connectez-vous à votre dashboard</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Connexion</CardTitle>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="admin@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                loading={loading}
                                className="w-full"
                            >
                                Se connecter
                            </Button>

                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                <p>Utilisez n'importe quel email et mot de passe (min. 6 caractères)</p>
                                <p className="mt-2">
                                    <span className="text-gray-500">Pas de compte? </span>
                                    <Link
                                        to="/register"
                                        className="text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        S'inscrire
                                    </Link>
                                </p>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}


export  default Login;