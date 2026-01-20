import { useState, useEffect, useMemo } from 'react'
import { useApi } from '../hooks/useApi'
import { usePagination } from '../hooks/usePagination'
import { productsService } from '../services/productsService'
import {
    Table,
    TableHead,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from '../components/ui/Table'
import { Card, CardContent } from '../components/ui/Card'
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { useConfirmation } from '../hooks/useConfirmation';
import { useNotification } from '../hooks/useNotification';
import Button from '../components/ui/Button'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import EmptyState from '../components/common/EmptyState'
import Modal from '../components/ui/Modal'
import { Edit, Trash2, Star, Tag, Search, PackagePlus, PackageCheck, Image as ImageIcon, DollarSign } from 'lucide-react'
import { ITEMS_PER_PAGE } from '../utils/constants'
import { formatCurrency } from '../utils/helpers'

const Products = () => {
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: '',
        image: '',
    })
    const [categories, setCategories] = useState([])

    const productsApi = useApi(productsService.getProducts)
    const { confirmationState, askConfirmation, closeConfirmation } = useConfirmation()
    const { showSuccess, showError } = useNotification()

    useEffect(() => {
        loadProducts()
        loadCategories()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadProducts = async () => {
        try {
            await productsApi.execute()
        } catch (error) {
            showError('Erreur lors du chargement des produits')
            console.log(error);
        }
    }

    const loadCategories = async () => {
        try {
            const data = await productsService.getCategories()
            setCategories(data)
        } catch (error) {
            console.error('Error loading categories:', error)
        }
    }

    const filteredProducts = useMemo(() => {
        if (!productsApi.data) return []
        return productsApi.data.filter(product =>
            product.title.toLowerCase().includes(search.toLowerCase()) ||
            product.description.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase())
        )
    }, [productsApi.data, search])

    const pagination = usePagination(filteredProducts, ITEMS_PER_PAGE)

    const handleEdit = (product) => {
        setSelectedProduct(product)
        setFormData({
            title: product.title,
            price: product.price.toString(),
            description: product.description,
            category: product.category,
            image: product.image,
        })
        setIsModalOpen(true)
    }

    const handleDelete = (product) => {
        askConfirmation({
            title: 'Supprimer le produit',
            message: `Êtes-vous sûr de vouloir supprimer "${product.title}" ? Cette action est irréversible.`,
            type: 'error',
            confirmText: 'Supprimer',
            destructive: true,
            async onConfirm() {
                setIsDeleting(true)
                try {
                    await productsService.deleteProduct(product.id)
                    await loadProducts()
                    showSuccess(`Produit "${product.title}" supprimé avec succès`)
                } catch (error) {
                    showError('Erreur lors de la suppression du produit')
                    console.log(error);
                } finally {
                    setIsDeleting(false)
                }
            },
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.title.trim()) {
            showError('Le titre du produit est obligatoire', 'Champ manquant')
            return
        }

        if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
            showError('Le prix doit être un nombre positif', 'Prix invalide')
            return
        }

        setIsSaving(true)
        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                rating: selectedProduct?.rating || { rate: 0, count: 0 }
            }

            if (selectedProduct) {
                await productsService.updateProduct(selectedProduct.id, productData)
                showSuccess(`Produit "${formData.title}" mis à jour avec succès`)
            } else {
                await productsService.createProduct(productData)
                showSuccess(`Produit "${formData.title}" créé avec succès`)
            }

            setIsModalOpen(false)
            setSelectedProduct(null)
            setFormData({
                title: '',
                price: '',
                description: '',
                category: '',
                image: '',
            })
            await loadProducts()
        } catch (error) {
            showError(selectedProduct
                ? 'Erreur lors de la mise à jour du produit'
                : 'Erreur lors de la création du produit'
            )
            console.log(error);
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        if (formData.title || formData.price) {
            askConfirmation({
                title: 'Annuler les modifications',
                message: 'Les modifications non enregistrées seront perdues. Continuer ?',
                type: 'warning',
                confirmText: 'Oui, annuler',
                onConfirm: () => {
                    setIsModalOpen(false)
                    setSelectedProduct(null)
                    setFormData({
                        title: '',
                        price: '',
                        description: '',
                        category: '',
                        image: '',
                    })
                },
            })
        } else {
            setIsModalOpen(false)
            setSelectedProduct(null)
        }
    }

    const handleImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/150?text=Image+non+disponible'
    }

    if (productsApi.loading && !productsApi.data) {
        return <LoadingSpinner className="min-h-100" />
    }

    if (productsApi.error) {
        return (
            <ErrorMessage
                message="Erreur lors du chargement des produits"
                onRetry={loadProducts}
                className="min-h-100"
            />
        )
    }

    // ... dans le composant, remplacer la partie état vide par :
    if (filteredProducts.length === 0 && !productsApi.loading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* ... même en-tête que ci-dessus ... */}
                </div>

                <Card>
                    <CardContent className="p-12">
                        <EmptyState
                            type={search ? "search" : "products"}
                            title={search ? "Aucun produit trouvé" : "Commencez par ajouter un produit"}
                            description={search
                                ? "Essayez d'autres termes de recherche."
                                : "Ajoutez votre premier produit à votre catalogue."
                            }
                            actionLabel={search ? "Voir tous les produits" : "Ajouter un produit"}
                            onAction={() => {
                                if (search) {
                                    setSearch('')
                                } else {
                                    setSelectedProduct(null)
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
                        Gestion des produits
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                        {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Rechercher un produit..."
                        className="sm:w-48 lg:w-64"
                    />
                    <Button
                        onClick={() => {
                            setSelectedProduct(null)
                            setFormData({
                                title: '',
                                price: '',
                                description: '',
                                category: '',
                                image: '',
                            })
                            setIsModalOpen(true)
                        }}
                        className="flex items-center justify-center gap-2"
                    >
                        <PackagePlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Nouveau produit</span>
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
                                    <TableHeader>Produit</TableHeader>
                                    <TableHeader className="hidden lg:table-cell">Catégorie</TableHeader>
                                    <TableHeader>Prix</TableHeader>
                                    <TableHeader className="hidden lg:table-cell">Évaluation</TableHeader>
                                    <TableHeader className="text-right">Actions</TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pagination.paginatedItems.map((product) => (
                                    <TableRow key={product.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <TableCell className="font-mono text-sm text-gray-600 dark:text-gray-400">
                                            {product.id}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-10 h-10 object-cover rounded-lg mr-3 shrink-0"
                                                    onError={handleImageError}
                                                />
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                        {product.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block truncate">
                                                        {product.description.substring(0, 60)}...
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex items-center">
                                                <Tag className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                                                <span className="capitalize text-gray-700 dark:text-gray-300">
                                                    {product.category}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                {formatCurrency(product.price)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1 shrink-0" />
                                                <span className="text-gray-900 dark:text-gray-100">
                                                    {product.rating?.rate?.toFixed(1) || 'N/A'}
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm">
                                                    ({product.rating?.count || 0})
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(product)}
                                                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                    title="Modifier"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(product)}
                                                    className="hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
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

            {/* Version mobile */}
            <div className="md:hidden space-y-3">
                {pagination.paginatedItems.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-16 h-16 object-cover rounded-lg shrink-0"
                                    onError={handleImageError}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                                                {product.title}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {formatCurrency(product.price)}
                                            </p>
                                            <div className="flex items-center mt-2">
                                                <Tag className="w-3 h-3 mr-1 text-gray-400" />
                                                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                    {product.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end space-y-2 ml-2">
                                            <div className="flex items-center">
                                                <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                                                <span className="text-xs">{product.rating?.rate?.toFixed(1) || 'N/A'}</span>
                                            </div>
                                            <div className="flex space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(product)}
                                                    className="h-8 w-8 p-0"
                                                    aria-label="Modifier"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(product)}
                                                    className="h-8 w-8 p-0"
                                                    aria-label="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                        {product.description}
                                    </p>
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
                title={selectedProduct ? 'Modifier le produit' : 'Nouveau produit'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nom du produit *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Nom du produit"
                                required
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Prix (€) *
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="19.99"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Catégorie *
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </option>
                                    ))}
                                    <option value="other">Autre</option>
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Description détaillée du produit..."
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                URL de l'image
                            </label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            {formData.image && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Aperçu :</p>
                                    <img
                                        src={formData.image}
                                        alt="Aperçu"
                                        className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                        onError={handleImageError}
                                    />
                                </div>
                            )}
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
                            {selectedProduct ? (
                                <>
                                    <PackageCheck className="w-4 h-4" />
                                    Mettre à jour
                                </>
                            ) : (
                                <>
                                    <PackagePlus className="w-4 h-4" />
                                    Créer le produit
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
        </div>
    )
}


export default Products;