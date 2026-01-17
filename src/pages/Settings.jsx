import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import { Save, Moon, Sun, Bell, Shield, User, Mail, Phone, Globe } from 'lucide-react'

const Settings = () => {
    const { theme, toggleTheme } = useTheme()
    const { user, updateUser } = useAuth()
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        weeklyDigest: true,
    })
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        website: '',
    })

    const handleSave = () => {
        updateUser(formData)
        alert('Paramètres sauvegardés avec succès!')
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Paramètres</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    Personnalisez votre expérience
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profil</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                                        <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Votre nom"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        <Mail className="w-4 h-4 inline mr-1" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        <Phone className="w-4 h-4 inline mr-1" />
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="+33 1 23 45 67 89"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        <Globe className="w-4 h-4 inline mr-1" />
                                        Site web
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { id: 'email', label: 'Notifications par email', description: 'Recevez des notifications par email' },
                                { id: 'push', label: 'Notifications push', description: 'Recevez des notifications push' },
                                { id: 'weeklyDigest', label: 'Résumé hebdomadaire', description: 'Recevez un résumé hebdomadaire' },
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <Bell className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notifications[item.id]}
                                            onChange={() => setNotifications(prev => ({
                                                ...prev,
                                                [item.id]: !prev[item.id]
                                            }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4
                                  peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800
                                  rounded-full peer dark:bg-gray-700
                                  peer-checked:after:translate-x-full peer-checked:after:border-white
                                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                  after:bg-white after:border-gray-300 after:border
                                  after:rounded-full after:h-5 after:w-5 after:transition-all
                                  dark:border-gray-600 peer-checked:bg-primary-600">
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4 sm:space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Préférences</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    {theme === 'dark' ? (
                                        <Moon className="w-5 h-5 text-gray-400 mr-3" />
                                    ) : (
                                        <Sun className="w-5 h-5 text-gray-400 mr-3" />
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">Mode sombre</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {theme === 'dark' ? 'Actif' : 'Inactif'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleTheme}
                                    className="whitespace-nowrap"
                                >
                                    {theme === 'dark' ? 'Désactiver' : 'Activer'}
                                </Button>
                            </div>

                            <div className="flex items-center">
                                <Shield className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">Sécurité</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Authentification à deux facteurs
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-left"
                            >
                                Exporter les données
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-left text-red-600 hover:text-red-700"
                            >
                                Supprimer le compte
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="w-full mt-2"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Sauvegarder
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Settings