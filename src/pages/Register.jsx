import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { isValidEmail, isValidPassword } from '../utils/validators'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'

export const Register = () => {
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
            setError('Une erreur est survenue lors de l\'inscription')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-600 mb-2">DashFlow</h1>
                    <p className="text-gray-600 dark:text-gray-400">Créez votre compte</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Inscription</CardTitle>
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
                                    Nom complet
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Confirmer le mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                                S'inscrire
                            </Button>

                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                <p className="mt-2">
                                    <span className="text-gray-500">Vous avez déjà un compte? </span>
                                    <Link
                                        to="/login"
                                        className="text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Se connecter
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