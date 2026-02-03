import { useState, useEffect, useMemo, useRef } from 'react'
import { useApi } from '../hooks/useApi'
import { usePagination } from '../hooks/usePagination'
import { productsService } from '../services/productsService'
import SkeletonLoader from '../components/common/SkeletonLoader'
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
import { Eye, Edit, Trash2, Star, Tag, PackagePlus, PackageCheck, Image as ImageIcon, DollarSign, Copy, Share2, Grid, List, Filter, SortAsc, SortDesc, TrendingUp, AlertCircle } from 'lucide-react'
import { ITEMS_PER_PAGE } from '../utils/constants'
import { formatCurrency, formatNumber } from '../utils/helpers'

const Products = () => {
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [viewingProduct, setViewingProduct] = useState(null)
    const [detailModalOpen, setDetailModalOpen] = useState(false)
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
    const [viewMode, setViewMode] = useState('grid') // Démarrer avec la vue grille
    const [sortField, setSortField] = useState('title')
    const [sortDirection, setSortDirection] = useState('asc')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState([0, 1000])

    const productsApi = useApi(productsService.getProducts)
    const { confirmationState, askConfirmation, closeConfirmation } = useConfirmation()
    const { showSuccess, showError } = useNotification()
    const filterRef = useRef(null)

    useEffect(() => {
        loadProducts()
        loadCategories()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Désactiver la vue tableau pour les écrans < 1024
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setViewMode('grid')
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Fermer le filtre quand on clique à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
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

    const handleViewDetails = (product) => {
        setViewingProduct(product)
        setDetailModalOpen(true)
    }

    const handleCopyDetails = () => {
        if (viewingProduct) {
            const details = `
Produit: ${viewingProduct.title}
Prix: ${formatCurrency(viewingProduct.price)}
Catégorie: ${viewingProduct.category}
Description: ${viewingProduct.description}
            `.trim()

            navigator.clipboard.writeText(details)
            showSuccess('Détails copiés dans le presse-papier')
        }
    }

    const filteredProducts = useMemo(() => {
        if (!productsApi.data) return []

        let filtered = productsApi.data.filter(product => {
            const matchesSearch =
                product.title.toLowerCase().includes(search.toLowerCase()) ||
                product.description.toLowerCase().includes(search.toLowerCase()) ||
                product.category.toLowerCase().includes(search.toLowerCase())

            const matchesCategory = selectedCategories.length === 0 ||
                selectedCategories.includes(product.category)

            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

            return matchesSearch && matchesCategory && matchesPrice
        })

        // Trier les produits
        filtered.sort((a, b) => {
            let aValue = a[sortField]
            let bValue = b[sortField]

            if (sortField === 'price') {
                aValue = parseFloat(aValue)
                bValue = parseFloat(bValue)
            }

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1
            } else {
                return aValue < bValue ? 1 : -1
            }
        })

        return filtered
    }, [productsApi.data, search, selectedCategories, priceRange, sortField, sortDirection])

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

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const toggleCategoryFilter = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        )
    }

    const clearFilters = () => {
        setSelectedCategories([])
        setPriceRange([0, 1000])
        setSearch('')
        setSortField('title')
        setSortDirection('asc')
    }

    // Statistiques
    const stats = useMemo(() => {
        if (!productsApi.data) return {}

        const totalProducts = filteredProducts.length
        const averagePrice = filteredProducts.reduce((sum, p) => sum + p.price, 0) / totalProducts || 0
        const highRatingProducts = filteredProducts.filter(p => p.rating?.rate >= 4).length
        const lowStockProducts = filteredProducts.filter(p => p.rating?.count < 10).length

        return {
            totalProducts,
            averagePrice,
            highRatingProducts,
            lowStockProducts
        }
    }, [filteredProducts, productsApi.data])

    if (productsApi.loading && !productsApi.data) {
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

    if (productsApi.error) {
        return (
            <ErrorMessage
                message="Erreur lors du chargement des produits"
                onRetry={loadProducts}
                className="min-h-100"
            />
        )
    }

    if (filteredProducts.length === 0 && !productsApi.loading) {
        return (
            <div className="space-y-4 p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Gestion des produits
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Gérez votre catalogue de produits
                        </p>
                    </div>
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

                <Card>
                    <CardContent className="p-6 sm:p-8">
                        <EmptyState
                            type={search || selectedCategories.length > 0 ? "search" : "products"}
                            title={search || selectedCategories.length > 0 ? "Aucun produit trouvé" : "Commencez par ajouter un produit"}
                            description={search || selectedCategories.length > 0
                                ? "Essayez de modifier vos critères de recherche ou de filtres."
                                : "Ajoutez votre premier produit à votre catalogue."
                            }
                            actionLabel={search || selectedCategories.length > 0 ? "Réinitialiser les filtres" : "Ajouter un produit"}
                            onAction={() => {
                                if (search || selectedCategories.length > 0) {
                                    clearFilters()
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
                            actionIcon={search || selectedCategories.length > 0 ? Filter : PackagePlus}
                        />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-4 p-3 sm:p-4 md:p-6">
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Gestion des produits
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <Filter className="w-4 h-4" />
                        </button>

                        {isFilterOpen && (
                            <div className="absolute left-50 transform -translate-x-1/2 sm:left-auto sm:transform-none  mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-4">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">Catégories</h3>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {categories.map((category) => (
                                                <label key={category} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(category)}
                                                        onChange={() => toggleCategoryFilter(category)}
                                                        className="rounded border-gray-300 dark:border-gray-600"
                                                    />
                                                    <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                                                        {category}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                                            Prix: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                                        </h3>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1000"
                                            step="10"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="w-full"
                                        />
                                    </div>

                                    <button
                                        onClick={clearFilters}
                                        className="w-full text-sm py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                    >
                                        Réinitialiser les filtres
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Vue seulement grille pour < 1024 */}
                    <div className="hidden lg:flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded flex items-center justify-center ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                            title="Vue grille"
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded flex items-center justify-center ${viewMode === 'table' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                            title="Vue tableau"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    <button
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
                        className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center gap-2"
                    >
                        <PackagePlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Nouveau</span>
                    </button>
                </div>
            </div>

            {/* Barre de recherche et tris */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Rechercher un produit..."
                        className="w-full"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                    <button
                        onClick={() => handleSort('title')}
                        className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                        <span>Nom</span>
                        {sortField === 'title' && (
                            sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                    </button>

                    <button
                        onClick={() => handleSort('price')}
                        className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                        <span>Prix</span>
                        {sortField === 'price' && (
                            sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                    </button>
                </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                    <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-blue-600 dark:text-blue-400">Total</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {formatNumber(stats.totalProducts)}
                                </p>
                            </div>
                            <PackageCheck className="w-6 h-6 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                    <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-green-600 dark:text-green-400">Prix moyen</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(stats.averagePrice)}
                                </p>
                            </div>
                            <TrendingUp className="w-6 h-6 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                    <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-yellow-600 dark:text-yellow-400">Bien notés</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {formatNumber(stats.highRatingProducts)}
                                </p>
                            </div>
                            <Star className="w-6 h-6 text-yellow-500 fill-current" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                    <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-red-600 dark:text-red-400">Stock faible</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {formatNumber(stats.lowStockProducts)}
                                </p>
                            </div>
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Vue Tableau (Desktop seulement) */}
            {viewMode === 'table' && (
                <div className="hidden lg:block">
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableHeader className="w-16">
                                                <button
                                                    onClick={() => handleSort('id')}
                                                    className="flex items-center justify-center gap-1 w-full"
                                                >
                                                    ID
                                                    {sortField === 'id' && (
                                                        sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                                                    )}
                                                </button>
                                            </TableHeader>
                                            <TableHeader>
                                                <button
                                                    onClick={() => handleSort('title')}
                                                    className="flex items-center justify-center gap-1 w-full"
                                                >
                                                    Produit
                                                    {sortField === 'title' && (
                                                        sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                                                    )}
                                                </button>
                                            </TableHeader>
                                            <TableHeader>Catégorie</TableHeader>
                                            <TableHeader>
                                                <button
                                                    onClick={() => handleSort('price')}
                                                    className="flex items-center justify-center gap-1 w-full"
                                                >
                                                    Prix
                                                    {sortField === 'price' && (
                                                        sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                                                    )}
                                                </button>
                                            </TableHeader>
                                            <TableHeader>Évaluation</TableHeader>
                                            <TableHeader className="w-28 text-center">Actions</TableHeader>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pagination.paginatedItems.map((product) => (
                                            <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <TableCell className="font-mono text-sm text-gray-600 dark:text-gray-400 text-center">
                                                    #{product.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={product.image}
                                                            alt={product.title}
                                                            className="w-10 h-10 object-cover rounded-lg shrink-0"
                                                            onError={handleImageError}
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-gray-900 dark:text-white truncate">
                                                                {product.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                {product.description.substring(0, 40)}...
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 capitalize">
                                                        {product.category}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-bold text-gray-900 dark:text-white">
                                                        {formatCurrency(product.price)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                                        <span className="font-medium">
                                                            {product.rating?.rate?.toFixed(1) || 'N/A'}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                                            ({product.rating?.count || 0})
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center gap-1">
                                                        <button
                                                            onClick={() => handleViewDetails(product)}
                                                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                            title="Voir détails"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product)}
                                                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Vue Grille (Tous les écrans) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {pagination.paginatedItems.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-3">
                            <div className="flex flex-col h-full">
                                {/* Image */}
                                <div className="relative mb-3">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-40 object-contain bg-gray-100 dark:bg-gray-800 rounded-lg"
                                        onError={handleImageError}
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                                            {formatCurrency(product.price)}
                                        </span>
                                    </div>
                                </div>

                                {/* Contenu */}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm">
                                        {product.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between mb-3">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                                            {product.category}
                                        </span>
                                        <div className="flex items-center">
                                            <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                                            <span className="text-xs font-medium">
                                                {product.rating?.rate?.toFixed(1) || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => handleViewDetails(product)}
                                        className="flex-1 flex items-center justify-center py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        title="Voir détails"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="flex-1 flex items-center justify-center py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        title="Modifier"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product)}
                                        className="flex-1 flex items-center justify-center py-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
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
                className="p-4 sm:p-6"
            >
                <div className='max-h-[70vh] sm:max-h-96 overflow-y-auto px-2 py-15 sm:py-2'>

                    <div className='pb-4'>
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

                            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full sm:w-auto px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    {isSaving ? (
                                        'Chargement...'
                                    ) : selectedProduct ? (
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
                                </button>
                            </div>
                        </form>

                    </div>

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

            {/* Modal de détails du produit */}
            <Modal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                title="Détails du produit"
                size="xl"
                className="p-4 sm:p-6"
            >
                <div className="max-h-[70vh] sm:max-h-95 overflow-y-auto px-2 py-15 sm:py-2">
                    {viewingProduct && (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="shrink-0 flex justify-center">
                                    <img
                                        src={viewingProduct.image}
                                        alt={viewingProduct.title}
                                        className="w-full max-w-xs md:w-64 md:h-64 object-contain bg-gray-100 dark:bg-gray-800 rounded-xl p-4"
                                        onError={handleImageError}
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                {viewingProduct.title}
                                            </h2>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                                                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                                    {formatCurrency(viewingProduct.price)}
                                                </span>
                                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium capitalize">
                                                    {viewingProduct.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleCopyDetails}
                                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                title="Copier les détails"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (navigator.share) {
                                                        navigator.share({
                                                            title: viewingProduct.title,
                                                            text: `Découvrez ${viewingProduct.title} - ${formatCurrency(viewingProduct.price)}`,
                                                            url: window.location.href,
                                                        })
                                                    }
                                                }}
                                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                title="Partager"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                                        <div className="flex items-center">
                                            <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                                            <span className="font-semibold">{viewingProduct.rating?.rate?.toFixed(1) || '0.0'}</span>
                                            <span className="text-gray-500 dark:text-gray-400 ml-1">
                                                ({viewingProduct.rating?.count || 0} avis)
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            ID: #{viewingProduct.id}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {viewingProduct.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Informations détaillées */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Caractéristiques</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Catégorie</span>
                                            <span className="font-medium capitalize">{viewingProduct.category}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Prix</span>
                                            <span className="font-medium">{formatCurrency(viewingProduct.price)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Disponibilité</span>
                                            <span className="text-green-600 dark:text-green-400 font-medium">En stock</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Statistiques</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Note moyenne</span>
                                            <span className="font-medium">{viewingProduct.rating?.rate?.toFixed(1) || 'N/A'}/5</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Nombre d'avis</span>
                                            <span className="font-medium">{viewingProduct.rating?.count || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Popularité</span>
                                            <span className="text-blue-600 dark:text-blue-400 font-medium">Élevée</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setDetailModalOpen(false)}
                                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Fermer
                                </button>
                                <button
                                    onClick={() => {
                                        setDetailModalOpen(false)
                                        setTimeout(() => handleEdit(viewingProduct), 300)
                                    }}
                                    className="w-full sm:w-auto px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                    Modifier ce produit
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
}

export default Products