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
import { Edit, Trash2, Plus, Mail, Phone, Globe } from 'lucide-react'
import { ITEMS_PER_PAGE } from '../utils/constants'

const Users = () => {
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        website: '',
        company: { name: '' },
    })

    const usersApi = useApi(usersService.getUsers)

    useEffect(() => {
        usersApi.execute()
    }, [])

    const filteredUsers = useMemo(() => {
        if (!usersApi.data) return []
        return usersApi.data.filter(user =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
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

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
            try {
                await usersService.deleteUser(id)
                usersApi.execute() // Refresh data
            } catch (error) {
                console.error('Error deleting user:', error)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (selectedUser) {
                await usersService.updateUser(selectedUser.id, formData)
            } else {
                await usersService.createUser(formData)
            }
            setIsModalOpen(false)
            setSelectedUser(null)
            usersApi.execute() // Refresh data
        } catch (error) {
            console.error('Error saving user:', error)
        }
    }

    if (usersApi.loading) {
        return <LoadingSpinner className="min-h-[400px]" />
    }

    if (usersApi.error) {
        return (
            <ErrorMessage
                message="Erreur lors du chargement des utilisateurs"
                onRetry={() => usersApi.execute()}
                className="min-h-[400px]"
            />
        )
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Utilisateurs</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                        Gérez les utilisateurs de votre application
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Rechercher..."
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
                        className="flex items-center justify-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Nouvel utilisateur</span>
                        <span className="sm:hidden">Nouveau</span>
                    </Button>
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    {/* Version table pour desktop */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader className="w-1/12">ID</TableHeader>
                                    <TableHeader className="w-3/12">Nom</TableHeader>
                                    <TableHeader className="w-4/12">Email</TableHeader>
                                    <TableHeader className="w-2/12">Téléphone</TableHeader>
                                    <TableHeader className="w-2/12 text-right">Actions</TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pagination.paginatedItems.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="w-1/12 font-mono text-sm text-gray-600 dark:text-gray-400">
                                            {user.id}
                                        </TableCell>
                                        <TableCell className="w-3/12">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3 flex-shrink-0">
                                                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                                        {user.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-4/12">
                                            <div className="flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300 truncate">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-2/12">
                                            <div className="flex items-center">
                                                <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {user.phone}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-2/12 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(user)}
                                                    className="h-8 w-8 p-0"
                                                    aria-label="Modifier"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(user.id)}
                                                    className="h-8 w-8 p-0"
                                                    aria-label="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Version cartes pour mobile */}
                    <div className="md:hidden space-y-3 p-4">
                        {pagination.paginatedItems.map((user) => (
                            <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center flex-1 min-w-0">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3 flex-shrink-0">
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
                                            <div className="flex items-center mt-1">
                                                <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {user.phone}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1 ml-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(user)}
                                            aria-label="Modifier"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(user.id)}
                                            aria-label="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center">
                                        <Globe className="w-3 h-3 mr-1 text-gray-400" />
                                        <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                            {user.company.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

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

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nom complet
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                        />
                    </div>

                    <div>
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
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button type="submit">
                            {selectedUser ? 'Mettre à jour' : 'Créer'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Users;