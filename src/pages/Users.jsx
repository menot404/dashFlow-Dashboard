import { useState, useEffect, useMemo, useCallback } from 'react'
import { useApi } from '../hooks/useApi'
import { usePagination } from '../hooks/usePagination'
import { usersService } from '../services/usersService'
import {
    Table,
    TableHead,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from '../components/ui/Table'
import { Card, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/common/EmptyState'
import ConfirmationModal from '../components/ui/ConfirmationModal'
import { useConfirmation } from '../hooks/useConfirmation'
import { useNotification } from '../hooks/useNotification'
import SkeletonLoader from '../components/common/SkeletonLoader'
import {
    Eye, Edit, Trash2, Mail, Phone, UserPlus,
    Search, Copy, User, MapPin, Building, Activity, Download, Filter, SortAsc, SortDesc,
    CheckCircle, XCircle, ExternalLink, Globe as GlobeIcon
} from 'lucide-react'
import { ITEMS_PER_PAGE } from '../utils/constants'

/**
 * Page de gestion des utilisateurs
 * Permet d'afficher, filtrer, trier, créer, éditer, supprimer et visualiser les utilisateurs.
 * Utilise de nombreux hooks pour la gestion d'état, l'appel API, la pagination, la notification et la confirmation.
 */
export const Users = () => {
    // search : terme de recherche utilisateur
    const [search, setSearch] = useState('')
    // isModalOpen : état du modal de création/édition
    const [isModalOpen, setIsModalOpen] = useState(false)
    // selectedUser : utilisateur sélectionné pour édition
    const [selectedUser, setSelectedUser] = useState(null)
    // isDeleting : état de suppression en cours
    const [isDeleting, setIsDeleting] = useState(false)
    // isSaving : état de sauvegarde en cours
    const [isSaving, setIsSaving] = useState(false)
    // viewingUser : utilisateur affiché dans le modal de détails
    const [viewingUser, setViewingUser] = useState(null)
    // userDetailModalOpen : état du modal de détails utilisateur
    const [userDetailModalOpen, setUserDetailModalOpen] = useState(false)
    // sortConfig : configuration du tri (clé et direction)
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
    // activeFilters : filtres actifs (statut, rôle)
    const [activeFilters, setActiveFilters] = useState({
        status: 'all',
        role: 'all'
    })
    // formData : état du formulaire utilisateur (création/édition)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        website: '',
        company: { name: '' },
        role: 'user',
        status: 'active'
    })

    // Hook pour charger les utilisateurs via API
    const usersApi = useApi(usersService.getUsers)
    // Hook pour la gestion des confirmations (modale)
    const { confirmationState, askConfirmation, closeConfirmation } = useConfirmation()
    // Hooks pour afficher les notifications de succès/erreur
    const { showSuccess, showError } = useNotification()

    /**
     * Effet de chargement initial : récupère la liste des utilisateurs
     */
    useEffect(() => {
        loadUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
     * Charge les utilisateurs depuis l'API et gère les erreurs
     */
    const loadUsers = useCallback(async () => {
        try {
            await usersApi.execute()
        } catch (error) {
            showError('Erreur lors du chargement des utilisateurs')
            console.error(error)
        }
    }, [usersApi, showError])

    /**
     * Ouvre le modal de détails pour un utilisateur donné
     */
    const handleViewUserDetails = useCallback((user) => {
        setViewingUser(user)
        setUserDetailModalOpen(true)
    }, [])

    /**
     * Copie les détails de l'utilisateur affiché dans le presse-papier
     */
    const handleCopyUserDetails = useCallback(() => {
        if (viewingUser) {
            const details = `
Utilisateur: ${viewingUser.name}
Email: ${viewingUser.email}
Téléphone: ${viewingUser.phone}
Entreprise: ${viewingUser.company?.name}
Rôle: ${viewingUser.role || 'Utilisateur'}
Statut: ${viewingUser.status === 'active' ? 'Actif' : 'Inactif'}
            `.trim()

            navigator.clipboard.writeText(details)
            showSuccess('Détails copiés dans le presse-papier')
        }
    }, [viewingUser, showSuccess])

    /**
     * Filtre et trie les utilisateurs selon la recherche, les filtres et le tri
     */
    const filteredUsers = useMemo(() => {
        if (!usersApi.data) return []

        let result = usersApi.data.filter(user =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.company.name.toLowerCase().includes(search.toLowerCase()) ||
            (user.username && user.username.toLowerCase().includes(search.toLowerCase()))
        )

        // Appliquer les filtres
        if (activeFilters.status !== 'all') {
            result = result.filter(user => user.status === activeFilters.status)
        }
        if (activeFilters.role !== 'all') {
            result = result.filter(user => user.role === activeFilters.role)
        }

        // Appliquer le tri
        result.sort((a, b) => {
            const aValue = a[sortConfig.key]?.toLowerCase?.() || a[sortConfig.key]
            const bValue = b[sortConfig.key]?.toLowerCase?.() || b[sortConfig.key]

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })

        return result
    }, [usersApi.data, search, activeFilters, sortConfig])

    // Hook de pagination pour les utilisateurs filtrés
    const pagination = usePagination(filteredUsers, ITEMS_PER_PAGE)

    /**
     * Prépare le formulaire pour l'édition d'un utilisateur
     */
    const handleEdit = useCallback((user) => {
        setSelectedUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            website: user.website || '',
            company: { name: user.company.name },
            role: user.role || 'user',
            status: user.status || 'active'
        })
        setIsModalOpen(true)
    }, [])

    /**
     * Retourne les initiales à partir d'un nom complet
     */
    const getInitials = useCallback((name) => {
        if (!name) return '??'
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }, [])

    /**
     * Demande confirmation puis supprime l'utilisateur
     */
    const handleDelete = useCallback((user) => {
        askConfirmation({
            title: 'Supprimer l\'utilisateur',
            message: `Êtes-vous sûr de vouloir supprimer "${user.name}" ? Cette action est irréversible.`,
            type: 'error',
            confirmText: 'Supprimer',
            destructive: true,
            async onConfirm() {
                setIsDeleting(true)
                try {
                    await usersService.deleteUser(user.id)
                    await loadUsers()
                    showSuccess(`Utilisateur "${user.name}" supprimé avec succès`)
                } catch (error) {
                    showError('Erreur lors de la suppression de l\'utilisateur')
                    console.error(error)
                } finally {
                    setIsDeleting(false)
                }
            },
        })
    }, [askConfirmation, showSuccess, showError, loadUsers])

    /**
     * Soumet le formulaire de création/édition utilisateur
     * Valide les champs, appelle l'API et affiche les notifications
     */
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name.trim() || !formData.email.trim()) {
            showError('Le nom et l\'email sont obligatoires', 'Champs manquants')
            return
        }

        setIsSaving(true)
        try {
            if (selectedUser) {
                await usersService.updateUser(selectedUser.id, formData)
                showSuccess(`Utilisateur "${formData.name}" mis à jour avec succès`)
            } else {
                await usersService.createUser(formData)
                showSuccess(`Utilisateur "${formData.name}" créé avec succès`)
            }

            setIsModalOpen(false)
            setSelectedUser(null)
            await loadUsers()
        } catch (error) {
            showError(selectedUser
                ? 'Erreur lors de la mise à jour de l\'utilisateur'
                : 'Erreur lors de la création de l\'utilisateur'
            )
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    /**
     * Annule la création/édition utilisateur avec confirmation si nécessaire
     */
    const handleCancel = useCallback(() => {
        if (formData.name || formData.email) {
            askConfirmation({
                title: 'Annuler les modifications',
                message: 'Les modifications non enregistrées seront perdues. Continuer ?',
                type: 'warning',
                confirmText: 'Oui, annuler',
                onConfirm: () => {
                    setIsModalOpen(false)
                    setSelectedUser(null)
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        website: '',
                        company: { name: '' },
                        role: 'user',
                        status: 'active'
                    })
                },
            })
        } else {
            setIsModalOpen(false)
            setSelectedUser(null)
        }
    }, [formData, askConfirmation])

    /**
     * Change la configuration du tri selon la colonne sélectionnée
     */
    const handleSort = useCallback((key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }))
    }, [])

    // Affichage du squelette de chargement pendant le fetch initial
    if (usersApi.loading && !usersApi.data) {
        return (
            <div className="space-y-6">
                {/* Même structure que Users mais adaptée aux produits */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <SkeletonLoader type="text" className="h-8 w-48 mb-2" />
                        <SkeletonLoader type="text" className="h-4 w-64" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <SkeletonLoader type="text" className="h-10 w-64" />
                        <SkeletonLoader type="text" className="h-10 w-40" />
                    </div>
                </div>
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {['Produit', 'Catégorie', 'Prix', 'Évaluation', 'Actions'].map((header) => (
                                        <TableHeader key={header}>
                                            <SkeletonLoader type="text" className="h-4 w-24" />
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[...Array(5)].map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <SkeletonLoader type="avatar" className="mr-3 w-10 h-10 rounded-lg" />
                                                <div>
                                                    <SkeletonLoader type="text" className="h-4 w-48 mb-1" />
                                                    <SkeletonLoader type="text" className="h-3 w-32" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell><SkeletonLoader type="text" className="h-4 w-24" /></TableCell>
                                        <TableCell><SkeletonLoader type="text" className="h-4 w-16" /></TableCell>
                                        <TableCell><SkeletonLoader type="text" className="h-4 w-20" /></TableCell>
                                        <TableCell>
                                            <div className="flex justify-end space-x-2">
                                                <SkeletonLoader type="text" className="h-8 w-8 rounded" />
                                                <SkeletonLoader type="text" className="h-8 w-8 rounded" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Affichage d'un message d'erreur si l'API échoue
    if (usersApi.error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <ErrorMessage
                    message="Erreur lors du chargement des utilisateurs"
                    onRetry={loadUsers}
                    className="max-w-md"
                />
            </div>
        )
    }

    // Affichage d'un état vide si aucun utilisateur ne correspond
    if (filteredUsers.length === 0 && !usersApi.loading) {
        return (
            <div className="space-y-6 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Gestion des utilisateurs
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Gérez les utilisateurs de votre application
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setSelectedUser(null)
                            setFormData({
                                name: '',
                                email: '',
                                phone: '',
                                website: '',
                                company: { name: '' },
                                role: 'user',
                                status: 'active'
                            })
                            setIsModalOpen(true)
                        }}
                        className="flex items-center gap-2 px-4 py-3"
                    >
                        <UserPlus className="w-5 h-5" />
                        <span>Nouvel utilisateur</span>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-8 sm:p-12">
                        <EmptyState
                            type={search ? "search" : "users"}
                            title={search ? "Aucun utilisateur trouvé" : "Aucun utilisateur"}
                            description={search
                                ? "Essayez d'autres termes de recherche ou modifiez vos filtres."
                                : "Commencez par ajouter votre premier utilisateur."
                            }
                            actionLabel={search ? "Réinitialiser la recherche" : "Ajouter un utilisateur"}
                            onAction={() => {
                                if (search) {
                                    setSearch('')
                                    setActiveFilters({ status: 'all', role: 'all' })
                                } else {
                                    setIsModalOpen(true)
                                }
                            }}
                            actionIcon={search ? Search : UserPlus}
                        />
                    </CardContent>
                </Card>
            </div>
        )
    }

    /**
     * Composant d'icône de tri pour les colonnes du tableau
     */
    const SortIcon = ({ column }) => (
        <button
            onClick={() => handleSort(column)}
            className="ml-1 hover:text-gray-700 dark:hover:text-gray-300"
        >
            {sortConfig.key === column ? (
                sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
            ) : (
                <SortAsc className="w-4 h-4 opacity-30" />
            )}
        </button>
    )

    // Rendu principal de la page utilisateurs : tableau, mobile, modals, pagination
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* En-tête amélioré */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Gestion des utilisateurs
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
                                {search && ` pour "${search}"`}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Exporter</span>
                            </Button>

                            <Button
                                onClick={() => {
                                    setSelectedUser(null)
                                    setFormData({
                                        name: '',
                                        email: '',
                                        phone: '',
                                        website: '',
                                        company: { name: '' },
                                        role: 'user',
                                        status: 'active'
                                    })
                                    setIsModalOpen(true)
                                }}
                                className="flex items-center gap-2"
                            >
                                <UserPlus className="w-5 h-5" />
                                <span>Nouvel utilisateur</span>
                            </Button>
                        </div>
                    </div>

                    {/* Barre de recherche et filtres */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                placeholder="Rechercher par nom, email, entreprise..."
                                className="w-full"
                                icon={Search}
                            />
                        </div>

                        <div className="flex gap-3">
                            <div className="relative">
                                <select
                                    value={activeFilters.status}
                                    onChange={(e) => setActiveFilters(prev => ({ ...prev, status: e.target.value }))}
                                    className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                                        rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 
                                        text-gray-900 dark:text-gray-100 text-sm"
                                >
                                    <option value="all">Tous les statuts</option>
                                    <option value="active">Actifs</option>
                                    <option value="inactive">Inactifs</option>
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tableau desktop */}
                <div className="hidden lg:block">
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHead className="bg-gray-50 dark:bg-gray-800/50">
                                    <TableRow>
                                        <TableHeader className="py-4 pl-6">
                                            <div className="flex items-center">
                                                Utilisateur
                                                <SortIcon column="name" />
                                            </div>
                                        </TableHeader>
                                        <TableHeader className="py-4">
                                            <div className="flex items-center">
                                                Email
                                                <SortIcon column="email" />
                                            </div>
                                        </TableHeader>
                                        <TableHeader className="py-4">Téléphone</TableHeader>
                                        <TableHeader className="py-4">
                                            <div className="flex items-center">
                                                Entreprise
                                                <SortIcon column="company" />
                                            </div>
                                        </TableHeader>
                                        <TableHeader className="py-4">Statut</TableHeader>
                                        <TableHeader className="py-4 pr-6 text-right">Actions</TableHeader>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pagination.paginatedItems.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/30 border-b border-gray-100 dark:border-gray-700 last:border-0"
                                        >
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 rounded-full bg-linear-to-r from-primary-500 to-purple-500 
                                                            flex items-center justify-center text-white font-bold text-lg">
                                                            {getInitials(user.name)}
                                                        </div>
                                                        {user.status === 'active' && (
                                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 
                                                                border-white dark:border-gray-800" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            @{user.username || user.name.toLowerCase().replace(/\s+/g, '.')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                                    <Mail className="w-4 h-4 mr-2 shrink-0" />
                                                    <span className="truncate">{user.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                                    <Phone className="w-4 h-4 mr-2 shrink-0" />
                                                    <span>{user.phone || 'Non renseigné'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center">
                                                    <Building className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                                                    <span className="text-gray-700 dark:text-gray-300">
                                                        {user.company.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                                    ${user.status === 'active'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                    }`}>
                                                    {user.status === 'active' ? (
                                                        <>
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Actif
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3 h-3 mr-1" />
                                                            Inactif
                                                        </>
                                                    )}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4 pr-6 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewUserDetails(user)}
                                                        className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                        title="Voir détails"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(user)}
                                                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        title="Modifier"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(user)}
                                                        className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Version mobile/tablette */}
                <div className="lg:hidden space-y-4">
                    {pagination.paginatedItems.map((user) => (
                        <Card key={user.id} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full bg-linear-to-r from-primary-500 to-purple-500 
                                                flex items-center justify-center text-white font-bold">
                                                {getInitials(user.name)}
                                            </div>
                                            {user.status === 'active' && (
                                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 
                                                    border-white dark:border-gray-800" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleViewUserDetails(user)}
                                            className="h-9 w-9 p-0"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(user)}
                                            className="h-9 w-9 p-0"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <Phone className="w-3 h-3 mr-2" />
                                            Téléphone
                                        </div>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                                            {user.phone || 'Non renseigné'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <Building className="w-3 h-3 mr-2" />
                                            Entreprise
                                        </div>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium truncate">
                                            {user.company.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                        ${user.status === 'active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                        }`}>
                                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(user)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="mt-6 sm:mt-8">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={pagination.goToPage}
                        />
                    </div>
                )}

                {/* Modal de création/édition - AVEC SCROLL INTERNE */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCancel}
                    title={selectedUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                    size="lg"
                    showHeader={true}
                    padding="default"
                >
                    <div className="max-h-[70vh] sm:max-h-96 overflow-y-auto px-2 py-15 sm:py-2">
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nom complet *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="John Doe"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="john@example.com"
                                        required
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
                                        placeholder="+33 1 23 45 67 89"
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

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Entreprise
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.company.name}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            company: { ...formData.company, name: e.target.value }
                                        })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Nom de l'entreprise"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Statut
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        <option value="active">Actif</option>
                                        <option value="inactive">Inactif</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700 mt-4 sm:mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    loading={isSaving}
                                    className="w-full sm:w-auto order-1 sm:order-2"
                                >
                                    {selectedUser ? 'Mettre à jour' : 'Créer l\'utilisateur'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>

                {/* Modal de confirmation */}
                <ConfirmationModal
                    isOpen={confirmationState.isOpen}
                    onClose={closeConfirmation}
                    onConfirm={confirmationState.onConfirm}
                    title={confirmationState.title}
                    message={confirmationState.message}
                    type={confirmationState.type}
                    confirmText={confirmationState.confirmText}
                    cancelText={confirmationState.cancelText}
                    destructive={confirmationState.destructive}
                    isLoading={isDeleting}
                />

                {/* Modal de détails de l'utilisateur - AVEC SCROLL INTERNE */}
                <Modal
                    isOpen={userDetailModalOpen}
                    onClose={() => setUserDetailModalOpen(false)}
                    title="Détails de l'utilisateur"
                    size="xl"
                    showHeader={true}
                    padding="default"
                >
                    <div className="max-h-[70vh] sm:max-h-96 overflow-y-auto px-2 py-15 sm:py-2">
                        {viewingUser && (
                            <div className="space-y-6 pb-4">
                                {/* Header avec avatar et infos */}
                                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                                    <div className="shrink-0 flex justify-center md:justify-start">
                                        <div className="relative">
                                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-linear-to-r from-primary-500 to-purple-500 
                                                flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                                                {getInitials(viewingUser.name)}
                                            </div>
                                            {viewingUser.status === 'active' && (
                                                <div className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 sm:border-4 
                                                    border-white dark:border-gray-800 flex items-center justify-center">
                                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                            <div className="flex-1">
                                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                                    {viewingUser.name}
                                                </h2>
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                                                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium
                                                        bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                        <User className="w-3 h-3 mr-1" />
                                                        {viewingUser.role || 'Utilisateur'}
                                                    </span>
                                                    <span className="inline-flex items-center text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                                        <Mail className="w-4 h-4 mr-2" />
                                                        {viewingUser.email}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleCopyUserDetails}
                                                    className="flex items-center gap-1 sm:gap-2"
                                                >
                                                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span className="hidden sm:inline">Copier</span>
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => {
                                                        setUserDetailModalOpen(false)
                                                        setTimeout(() => handleEdit(viewingUser), 300)
                                                    }}
                                                    className="flex items-center gap-1 sm:gap-2"
                                                >
                                                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span className="hidden sm:inline">Modifier</span>
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Informations de base */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                                            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {viewingUser.phone || 'Non renseigné'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                                <GlobeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Site web</p>
                                                    {viewingUser.website ? (
                                                        <a
                                                            href={`https://${viewingUser.website}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-medium text-primary-600 dark:text-primary-400 hover:underline 
                                                                flex items-center gap-1 text-sm sm:text-base"
                                                        >
                                                            {viewingUser.website}
                                                            <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    ) : (
                                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                                            Non renseigné
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sections détaillées */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    {/* Informations professionnelles */}
                                    <Card padding="md">
                                        <CardContent className="p-3 sm:p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center">
                                                <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                                Entreprise
                                            </h3>
                                            <div className="space-y-2 sm:space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Nom</span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                        {viewingUser.company?.name}
                                                    </span>
                                                </div>
                                                {viewingUser.company?.catchPhrase && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Slogan</span>
                                                        <span className="font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm text-right">
                                                            {viewingUser.company.catchPhrase}
                                                        </span>
                                                    </div>
                                                )}
                                                {viewingUser.company?.bs && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Domaine</span>
                                                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                            {viewingUser.company.bs}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Informations de contact */}
                                    <Card padding="md">
                                        <CardContent className="p-3 sm:p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center">
                                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                                Adresse
                                            </h3>
                                            <div className="space-y-2 sm:space-y-3">
                                                {viewingUser.address?.street && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Rue</span>
                                                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                            {viewingUser.address.street}
                                                        </span>
                                                    </div>
                                                )}
                                                {viewingUser.address?.city && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Ville</span>
                                                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                            {viewingUser.address.city}
                                                        </span>
                                                    </div>
                                                )}
                                                {viewingUser.address?.zipcode && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Code postal</span>
                                                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                            {viewingUser.address.zipcode}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Statistiques */}
                                <Card padding="md">
                                    <CardContent className="p-3 sm:p-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center">
                                            <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Activité
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">12</p>
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Projets</p>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">48</p>
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Tâches</p>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">92%</p>
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Actif</p>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">2j</p>
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Dern. connexion</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Button
                                        variant="outline"
                                        onClick={() => setUserDetailModalOpen(false)}
                                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Fermer
                                    </Button>
                                    <div className="flex gap-3 order-1 sm:order-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setUserDetailModalOpen(false)
                                                setTimeout(() => handleDelete(viewingUser), 300)
                                            }}
                                            className="w-full sm:w-auto px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            <span className="hidden sm:inline">Supprimer</span>
                                            <span className="sm:hidden">Supprimer</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default Users