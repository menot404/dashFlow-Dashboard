import { useState, useEffect, useMemo } from 'react'
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
import { Eye, Edit, Trash2, Mail, Phone, Globe, PackagePlus, UserPlus, UserCheck, Search, MoreVertical, Copy, Share2, User, MapPin, Building } from 'lucide-react'
import { ITEMS_PER_PAGE } from '../utils/constants'

export const Users = () => {
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [viewingUser, setViewingUser] = useState(null)
const [userDetailModalOpen, setUserDetailModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        website: '',
        company: { name: '' },
    })

    const usersApi = useApi(usersService.getUsers)
    const { confirmationState, askConfirmation, closeConfirmation } = useConfirmation()
    const { showSuccess, showError } = useNotification()

    useEffect(() => {
        loadUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadUsers = async () => {
        try {
            await usersApi.execute()
        } catch (error) {
            showError('Erreur lors du chargement des utilisateurs')
            console.error(error);
        }
    }

    //Fonction pour voir les détails de l'utilisateur 

    const handleViewUserDetails = (user) => {
  setViewingUser(user)
  setUserDetailModalOpen(true)
}

const handleCopyUserDetails = () => {
  if (viewingUser) {
    const details = `
Utilisateur: ${viewingUser.name}
Email: ${viewingUser.email}
Téléphone: ${viewingUser.phone}
Entreprise: ${viewingUser.company?.name}
    `.trim()
    
    navigator.clipboard.writeText(details)
    showSuccess('Détails copiés dans le presse-papier')
  }
}

    const filteredUsers = useMemo(() => {
        if (!usersApi.data) return []
        return usersApi.data.filter(user =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.company.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [usersApi.data, search])

    const pagination = usePagination(filteredUsers, ITEMS_PER_PAGE)

    const handleEdit = (user) => {
        setSelectedUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            website: user.website,
            company: { name: user.company.name },
        })
        setIsModalOpen(true)
    }
//Fonction pour obtenir les initiales
    const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

    const handleDelete = (user) => {
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
                    console.error(error);
                } finally {
                    setIsDeleting(false)
                }
            },
        })
    }

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
            console.error(error);
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
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
                    })
                },
            })
        } else {
            setIsModalOpen(false)
            setSelectedUser(null)
        }
    }

    if (usersApi.loading && !usersApi.data) {
        return <LoadingSpinner className="min-h-100" />
    }

    if (usersApi.error) {
        return (
            <ErrorMessage
                message="Erreur lors du chargement des utilisateurs"
                onRetry={loadUsers}
                className="min-h-100"
            />
        )
    }
    // ... dans le composant, remplacer la partie état vide par :
    if (filteredUsers.length === 0 && !usersApi.loading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* ... même en-tête que ci-dessus ... */}
                </div>

                <Card>
                    <CardContent className="p-12">
                        <EmptyState
                            type={search ? "search" : "users"}
                            title={search ? "Aucun utilisateur trouvé" : "Commencez par ajouter un utilisateur"}
                            description={search
                                ? "Essayez d'autres termes de recherche."
                                : "Ajoutez votre premier utilisateur à votre système."
                            }
                            actionLabel={search ? "Voir tous les utilisateurs" : "Ajouter un utilisateur"}
                            onAction={() => {
                                if (search) {
                                    setSearch('')
                                } else {
                                    setSelectedUser(null)
                                    setFormData({
                                        title: '',
                                        price: '',
                                        description: '',
                                        category: '',
                                        image: '',
                                    })
                                    setIsModalOpen(true)
                                }
                            }}
                            actionIcon={search ? Search : PackagePlus}
                        />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Gestion des utilisateurs
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                        {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Rechercher un utilisateur..."
                        className="sm:w-48 lg:w-64"
                    />
                    <Button
                        onClick={() => {
                            setSelectedUser(null)
                            setFormData({
                                name: '',
                                email: '',
                                phone: '',
                                website: '',
                                company: { name: '' },
                            })
                            setIsModalOpen(true)
                        }}
                        className="flex items-center justify-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Nouvel utilisateur</span>
                        <span className="sm:hidden">Nouveau</span>
                    </Button>
                </div>
            </div>

            {/* Tableau desktop */}
            <div className="hidden md:block">
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader className="w-12">ID</TableHeader>
                                    <TableHeader>Nom</TableHeader>
                                    <TableHeader>Email</TableHeader>
                                    <TableHeader className="hidden lg:table-cell">Téléphone</TableHeader>
                                    <TableHeader className="hidden lg:table-cell">Entreprise</TableHeader>
                                    <TableHeader className="text-right">Actions</TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pagination.paginatedItems.map((user) => (
                                    <TableRow key={user.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <TableCell className="font-mono text-sm text-gray-600 dark:text-gray-400">
                                            {user.id}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3 shrink-0">
                                                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                                        {user.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                                                        {user.username || 'Utilisateur'}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                <Mail className="w-4 h-4 mr-2 shrink-0" />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                <Phone className="w-4 h-4 mr-2 shrink-0" />
                                                <span className="truncate">{user.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                <Globe className="w-4 h-4 mr-2 shrink-0" />
                                                <span className="truncate">{user.company.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-1">
    {/* Bouton Voir */}
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleViewUserDetails(user)}
      className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
      title="Voir détails"
    >
      <Eye className="w-4 h-4" />
    </Button>
    
    {/* Bouton Modifier */}
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleEdit(user)}
      className="opacity-0 group-hover:opacity-100 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-opacity"
      title="Modifier"
    >
      <Edit className="w-4 h-4" />
    </Button>
    
    {/* Bouton Supprimer */}
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleDelete(user)}
      className="opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 transition-opacity"
      title="Supprimer"
    >
      <Trash2 className="w-4 h-4 text-red-600" />
    </Button>
    
    {/* Menu déroulant */}
    <div className="relative inline-block">
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-opacity"
        title="Plus d'actions"
        onClick={(e) => {
          e.stopPropagation()
          const menu = document.getElementById(`user-menu-${user.id}`)
          menu?.classList.toggle('hidden')
        }}
      >
        <MoreVertical className="w-4 h-4" />
      </Button>
      
      <div 
        id={`user-menu-${user.id}`}
        className="hidden absolute right-0 z-10 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
      >
        <div className="py-1">
          <button
            onClick={() => {
              navigator.clipboard.writeText(user.id.toString())
              showSuccess('ID copié')
              document.getElementById(`user-menu-${user.id}`).classList.add('hidden')
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copier l'ID
          </button>
          
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: user.name,
                  text: `Contact: ${user.name} - ${user.email}`,
                  url: window.location.href,
                })
              }
              document.getElementById(`user-menu-${user.id}`).classList.add('hidden')
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </button>
        </div>
      </div>
    </div>
  </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Version mobile */}
            <div className="md:hidden space-y-3">
                {pagination.paginatedItems.map((user) => (
                    <Card key={user.id} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3 shrink-0">
                                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                            {user.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
  <Button
    variant="ghost"
    size="sm"
    onClick={() => handleViewUserDetails(user)}
    className="h-10 w-10 p-0 flex items-center justify-center"
    aria-label="Voir détails"
  >
    <Eye className="w-4 h-4" />
  </Button>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => handleEdit(user)}
    className="h-10 w-10 p-0 flex items-center justify-center"
    aria-label="Modifier"
  >
    <Edit className="w-4 h-4" />
  </Button>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => handleDelete(user)}
    className="h-10 w-10 p-0 flex items-center justify-center"
    aria-label="Supprimer"
  >
    <Trash2 className="w-4 h-4 text-red-600" />
  </Button>
</div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                                <div className="flex items-center">
                                    <Phone className="w-3 h-3 mr-2 text-gray-400" />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {user.phone}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Globe className="w-3 h-3 mr-2 text-gray-400" />
                                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                        {user.company.name}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={pagination.goToPage}
                    />
                </div>
            )}

            {/* Modal de création/édition */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCancel}
                title={selectedUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nom complet *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="John Doe"
                                required
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Entreprise
                            </label>
                            <input
                                type="text"
                                value={formData.company.name}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    company: { ...formData.company, name: e.target.value }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Nom de l'entreprise"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleCancel}
                            disabled={isSaving}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            loading={isSaving}
                            className="flex items-center gap-2"
                        >
                            {selectedUser ? (
                                <>
                                    <UserCheck className="w-4 h-4" />
                                    Mettre à jour
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Créer l'utilisateur
                                </>
                            )}
                        </Button>
                    </div>
                </form>
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
            {/* Modal de détails de l'utilisateur */}
<Modal
  isOpen={userDetailModalOpen}
  onClose={() => setUserDetailModalOpen(false)}
  title="Détails de l'utilisateur"
  size="xl"
>
  {viewingUser && (
    <div className="space-y-6">
      {/* Header avec avatar et infos */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="shrink-0">
          <div className="w-32 h-32 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
            {getInitials(viewingUser.name)}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {viewingUser.name}
              </h2>
              <div className="flex items-center space-x-4 mb-4">
                <span className="flex items-center text-gray-700 dark:text-gray-300">
                  <Mail className="w-4 h-4 mr-2" />
                  {viewingUser.email}
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                  {viewingUser.company?.name}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyUserDetails}
                title="Copier les détails"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: viewingUser.name,
                      text: `Contact: ${viewingUser.name} - ${viewingUser.email}`,
                      url: window.location.href,
                    })
                  }
                }}
                title="Partager"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <Phone className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">{viewingUser.phone}</span>
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 text-gray-400 mr-2" />
              <a 
                href={`https://${viewingUser.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {viewingUser.website}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sections détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations professionnelles */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <Building className="w-4 h-4 mr-2" />
            Entreprise
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Nom</span>
              <span className="font-medium">{viewingUser.company?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Slogan</span>
              <span className="font-medium">{viewingUser.company?.catchPhrase}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Domaine</span>
              <span className="font-medium">{viewingUser.company?.bs}</span>
            </div>
          </div>
        </div>
        
        {/* Informations de contact */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Adresse
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Rue</span>
              <span className="font-medium">{viewingUser.address?.street}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Ville</span>
              <span className="font-medium">{viewingUser.address?.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Code postal</span>
              <span className="font-medium">{viewingUser.address?.zipcode}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" onClick={() => setUserDetailModalOpen(false)}>
          Fermer
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setUserDetailModalOpen(false)
            setTimeout(() => handleEdit(viewingUser), 300)
          }}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Modifier cet utilisateur
        </Button>
      </div>
    </div>
  )}
</Modal>
        </div>
    )
}

export default Users