import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import {
    Save, Moon, Sun, Bell, Shield, User, Mail, Download, Trash2, Lock, Database, Palette, Eye, EyeOff,
    Settings as SettingsIcon, Earth, LogOut, XCircle, Clock, Smartphone as Mobile, Laptop, Tablet
} from 'lucide-react'

const Settings = () => {
    const { theme, toggleTheme } = useTheme()
    const { user, updateUser, logout } = useAuth()
    const navigate = useNavigate()

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        weeklyDigest: true,
        marketing: false,
        security: true,
        newsletter: true,
    })

    const [security, setSecurity] = useState({
        twoFactor: false,
        sessionTimeout: '30',
        loginAlerts: true,
    })

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        website: user?.website || '',
        language: 'fr',
        timezone: 'Europe/Paris',
    })

    const [activeSection, setActiveSection] = useState('profile')
    const [isSaving, setIsSaving] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateUser(formData)
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            alert('Paramètres sauvegardés avec succès!')
        } catch (error) {
            alert('Erreur lors de la sauvegarde: ', error.message)
        } finally {
            setIsSaving(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const sections = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Sécurité', icon: Shield },
        { id: 'appearance', label: 'Apparence', icon: Palette },
        { id: 'account', label: 'Compte', icon: SettingsIcon },
    ]

    const notificationItems = [
        { id: 'email', label: 'Notifications par email', description: 'Recevez des notifications par email', icon: Mail },
        { id: 'push', label: 'Notifications push', description: 'Recevez des notifications push', icon: Bell },
        { id: 'weeklyDigest', label: 'Résumé hebdomadaire', description: 'Recevez un résumé hebdomadaire', icon: Database },
        { id: 'marketing', label: 'Emails marketing', description: 'Recevez des offres et promotions', icon: Earth },
        { id: 'security', label: 'Alertes de sécurité', description: 'Alertes en cas d\'activité suspecte', icon: Shield },
        { id: 'newsletter', label: 'Newsletter', description: 'Restez informé des nouveautés', icon: Mail },
    ]

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    ]

    const timezones = [
        { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
        { value: 'Europe/London', label: 'Londres (GMT+0)' },
        { value: 'America/New_York', label: 'New York (GMT-5)' },
        { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
    ]

    // Composant réutilisable pour les switch
    const ToggleSwitch = ({ checked, onChange, id }) => (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 
                dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 
                after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                dark:border-gray-600 peer-checked:bg-primary-600">
            </div>
        </label>
    )

    // Fonction pour obtenir les initiales
    const getInitials = (name) => {
        if (!name) return '??'
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Paramètres
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Gérez vos préférences et paramètres de compte
                            </p>
                        </div>
                        <Button
                            onClick={handleSave}
                            loading={isSaving}
                            className="flex items-center gap-2 px-4 py-2.5"
                        >
                            <Save className="w-4 h-4" />
                            <span className="hidden sm:inline">Sauvegarder</span>
                            <span className="sm:hidden">Sauvegarder</span>
                        </Button>
                    </div>

                    {/* Navigation mobile */}
                    <div className="lg:hidden mb-6">
                        <div className="flex overflow-x-auto pb-2 space-x-2">
                            {sections.map((section) => {
                                const Icon = section.icon
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`
                                            flex items-center px-4 py-3 rounded-xl whitespace-nowrap transition-all duration-200
                                            ${activeSection === section.id
                                                ? 'bg-white dark:bg-gray-800 shadow-md'
                                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }
                                        `}
                                    >
                                        <Icon className="w-4 h-4 mr-2" />
                                        <span className="text-sm font-medium">{section.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar desktop */}
                    <div className="hidden lg:block w-64 shrink-0">
                        <Card padding="md" className="sticky top-6">
                            <CardContent className="space-y-1">
                                {sections.map((section) => {
                                    const Icon = section.icon
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`
                                                w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200
                                                ${activeSection === section.id
                                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }
                                            `}
                                        >
                                            <Icon className="w-5 h-5 mr-3" />
                                            <span className="font-medium">{section.label}</span>
                                        </button>
                                    )
                                })}
                            </CardContent>
                        </Card>

                        {/* User info */}
                        <Card padding="md" className="mt-6">
                            <CardContent className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-linear-to-r from-primary-500 to-purple-500 
                                    flex items-center justify-center text-white font-bold">
                                    {getInitials(user?.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                        {user?.name || 'Utilisateur'}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                        {user?.email || 'email@example.com'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main content */}
                    <div className="flex-1">
                        <div className="space-y-6">
                            {/* Section Profil */}
                            {(activeSection === 'profile' || window.innerWidth >= 1024) && (
                                <>
                                    <Card padding="lg">
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <User className="w-5 h-5 mr-2" />
                                                Informations personnelles
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Avatar */}
                                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                                                <div className="relative">
                                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-r from-primary-500 to-purple-500 
                                                        flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                                                        {getInitials(user?.name)}
                                                    </div>
                                                    <button className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md">
                                                        <User className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="text-center sm:text-left">
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                                        {user?.name || 'John Doe'}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                                                        {user?.email || 'email@example.com'}
                                                    </p>
                                                    <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                        <span className="text-sm">Membre depuis 2023</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Form */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Nom complet
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                        placeholder="John Doe"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                        placeholder="email@example.com"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Téléphone
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                        placeholder="+226 67 54 32 76"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Site web
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={formData.website}
                                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                        placeholder="https://example.com"
                                                    />
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Langue
                                                    </label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        {languages.map((lang) => (
                                                            <button
                                                                key={lang.code}
                                                                onClick={() => setFormData({ ...formData, language: lang.code })}
                                                                className={`
                                                                    flex items-center justify-center p-3 rounded-lg border transition-all
                                                                    ${formData.language === lang.code
                                                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                                                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                                    }
                                                                `}
                                                            >
                                                                <span className="text-xl mr-2">{lang.flag}</span>
                                                                <span>{lang.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Fuseau horaire
                                                    </label>
                                                    <select
                                                        value={formData.timezone}
                                                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    >
                                                        {timezones.map((tz) => (
                                                            <option key={tz.value} value={tz.value}>
                                                                {tz.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            )}

                            {/* Section Notifications */}
                            {(activeSection === 'notifications' || window.innerWidth >= 1024) && (
                                <Card padding="lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Bell className="w-5 h-5 mr-2" />
                                            Notifications
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {notificationItems.map((item) => {
                                            const Icon = item.icon
                                            return (
                                                <div key={item.id}
                                                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                                    <div className="flex items-center space-x-3">
                                                        <Icon className="w-5 h-5 text-gray-400" />
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                                                        </div>
                                                    </div>
                                                    <ToggleSwitch
                                                        checked={notifications[item.id]}
                                                        onChange={() => setNotifications(prev => ({
                                                            ...prev,
                                                            [item.id]: !prev[item.id]
                                                        }))}
                                                        id={`notif-${item.id}`}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                                            <Button variant="outline" className="flex-1">
                                                <Bell className="w-4 h-4 mr-2" />
                                                Tout activer
                                            </Button>
                                            <Button variant="outline" className="flex-1">
                                                <Bell className="w-4 h-4 mr-2" />
                                                Tout désactiver
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            )}

                            {/* Section Sécurité */}
                            {(activeSection === 'security' || window.innerWidth >= 1024) && (
                                <Card padding="lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Shield className="w-5 h-5 mr-2" />
                                            Sécurité
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Mot de passe */}
                                        <div className="space-y-4">
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Changer le mot de passe</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Mot de passe actuel
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                                                                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-10"
                                                            placeholder="••••••••"
                                                        />
                                                        <button
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="w-5 h-5 text-gray-400" />
                                                            ) : (
                                                                <Eye className="w-5 h-5 text-gray-400" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Nouveau mot de passe
                                                    </label>
                                                    <input
                                                        type="password"
                                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* 2FA */}
                                        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center space-x-3">
                                                <Lock className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        Authentification à deux facteurs
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Ajoutez une couche de sécurité supplémentaire
                                                    </p>
                                                </div>
                                            </div>
                                            <ToggleSwitch
                                                checked={security.twoFactor}
                                                onChange={() => setSecurity(prev => ({ ...prev, twoFactor: !prev.twoFactor }))}
                                                id="two-factor"
                                            />
                                        </div>

                                        {/* Session timeout */}
                                        <div className="space-y-2">
                                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                                <Clock className="w-4 h-4 mr-2" />
                                                Durée de session
                                            </label>
                                            <select
                                                value={security.sessionTimeout}
                                                onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                                                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            >
                                                <option value="15">15 minutes</option>
                                                <option value="30">30 minutes</option>
                                                <option value="60">1 heure</option>
                                                <option value="120">2 heures</option>
                                                <option value="0">Jamais</option>
                                            </select>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Section Apparence */}
                            {(activeSection === 'appearance' || window.innerWidth >= 1024) && (
                                <Card padding="lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Palette className="w-5 h-5 mr-2" />
                                            Apparence
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Thème */}
                                        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center space-x-3">
                                                {theme === 'dark' ? (
                                                    <Moon className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <Sun className="w-5 h-5 text-gray-400" />
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        Mode sombre
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {theme === 'dark' ? 'Actuellement activé' : 'Actuellement désactivé'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={toggleTheme}
                                            >
                                                {theme === 'dark' ? 'Désactiver' : 'Activer'}
                                            </Button>
                                        </div>

                                        {/* Devices */}
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Appareils connectés</h4>
                                            <div className="space-y-3">
                                                {[
                                                    { device: 'Windows PC', browser: 'Chrome', lastActive: 'Maintenant', icon: Laptop },
                                                    { device: 'iPhone 13', browser: 'Safari', lastActive: 'Il y a 2 heures', icon: Mobile },
                                                    { device: 'iPad Pro', browser: 'Safari', lastActive: 'Hier', icon: Tablet },
                                                ].map((device, index) => {
                                                    const Icon = device.icon
                                                    return (
                                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                            <div className="flex items-center space-x-3">
                                                                <Icon className="w-5 h-5 text-gray-400" />
                                                                <div>
                                                                    <p className="font-medium text-gray-900 dark:text-gray-100">{device.device}</p>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{device.browser} • {device.lastActive}</p>
                                                                </div>
                                                            </div>
                                                            <Button variant="ghost" size="sm">
                                                                <XCircle className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Section Compte */}
                            {(activeSection === 'account' || window.innerWidth >= 1024) && (
                                <>
                                    <Card padding="lg">
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <SettingsIcon className="w-5 h-5 mr-2" />
                                                Actions du compte
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start h-auto py-4 px-4"
                                                >
                                                    <Download className="w-5 h-5 mr-3" />
                                                    <div className="text-left">
                                                        <p className="font-medium">Exporter les données</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Téléchargez vos données</p>
                                                    </div>
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start h-auto py-4 px-4 text-red-600 hover:text-red-700 
                                                        hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => {
                                                        if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
                                                            // Handle account deletion
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-5 h-5 mr-3" />
                                                    <div className="text-left">
                                                        <p className="font-medium">Supprimer le compte</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Action irréversible</p>
                                                    </div>
                                                </Button>
                                            </div>

                                            <Button
                                                variant="outline"
                                                className="w-full justify-start h-auto py-4 px-4"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="w-5 h-5 mr-3" />
                                                <div className="text-left">
                                                    <p className="font-medium">Se déconnecter</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Quitter cette session</p>
                                                </div>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </>
                            )}

                            {/* Toujours visible - Save button pour mobile */}
                            <div className="lg:hidden">
                                <Card padding="md">
                                    <CardContent>
                                        <Button
                                            onClick={handleSave}
                                            loading={isSaving}
                                            className="w-full"
                                        >
                                            <Save className="w-5 h-5 mr-2" />
                                            <span>
                                                Sauvegarder tous les changements
                                            </span>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings