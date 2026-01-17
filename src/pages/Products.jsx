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
import Button from '../components/ui/Button'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import Modal from '../components/ui/Modal'
import { Edit, Trash2, Plus, Star, Tag } from 'lucide-react'
import { ITEMS_PER_PAGE } from '../utils/constants'
import { formatCurrency } from '../utils/helpers'

const Products = () => {
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        price: 0,
        description: '',
        category: '',
        image: '',
    })

    const productsApi = useApi(productsService.getProducts)

    useEffect(() => {
        productsApi.execute()
    }, [])

    const filteredProducts = useMemo(() => {
        if (!productsApi.data) return []
        return productsApi.data.filter(product =>
            product.title.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase())
        )
    }, [productsApi.data, search])

    const pagination = usePagination(filteredProducts, ITEMS_PER_PAGE)

    const handleEdit = (product) => {
        setSelectedProduct(product)
        setFormData({
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            image: product.image,
        })
        setIsModalOpen(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
            try {
                await productsService.deleteProduct(id)
                productsApi.execute() // Refresh data
            } catch (error) {
                console.error('Error deleting product:', error)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (selectedProduct) {
                await productsService.updateProduct(selectedProduct.id, formData)
            } else {
                await productsService.createProduct(formData)
            }
            setIsModalOpen(false)
            setSelectedProduct(null)
            productsApi.execute() // Refresh data
        } catch (error) {
            console.error('Error saving product:', error)
        }
    }

    if (productsApi.loading) {
        return <LoadingSpinner className="min-h-[400px]" />
    }

    if (productsApi.error) {
        return (
            <ErrorMessage
                message="Erreur lors du chargement des produits"
                onRetry={() => productsApi.execute()}
                className="min-h-[400px]"
            />
        )
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Produits</h1>
                    <p className="text-gray-600 dark:text-gray-400">Gérez les produits de votre boutique</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Rechercher des produits..."
                        className="sm:w-64"
                    />
                    <Button onClick={() => {
                        setSelectedProduct(null)
                        setFormData({
                            title: '',
                            price: 0,
                            description: '',
                            category: '',
                            image: '',
                        })
                        setIsModalOpen(true)
                    }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nouveau produit
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    {/* Version desktop */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader className="w-2/5">Produit</TableHeader>
                                    <TableHeader className="w-1/5">Catégorie</TableHeader>
                                    <TableHeader className="w-1/6">Prix</TableHeader>
                                    <TableHeader className="w-1/6">Évaluation</TableHeader>
                                    <TableHeader className="w-1/6 text-right">Actions</TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pagination.paginatedItems.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="w-2/5">
                                            <div className="flex items-center">
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-10 h-10 object-cover rounded-lg mr-3 flex-shrink-0"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                        {product.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                        {product.description.substring(0, 60)}...
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-1/5">
                                            <div className="flex items-center">
                                                <Tag className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                                                <span className="capitalize text-gray-700 dark:text-gray-300">
                                                    {product.category}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-1/6">
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                {formatCurrency(product.price)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="w-1/6">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1 flex-shrink-0" />
                                                <span className="text-gray-900 dark:text-gray-100">
                                                    {product.rating?.rate || 'N/A'}
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm">
                                                    ({product.rating?.count || 0})
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-1/6 text-right">
                                            <div className="flex justify-end space-x-2">
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
                                                    onClick={() => handleDelete(product.id)}
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

                    {/* Version mobile */}
                    <div className="md:hidden space-y-3 p-4">
                        {pagination.paginatedItems.map((product) => (
                            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                <div className="flex items-start space-x-3">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                    />
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
                                    <div className="flex flex-col items-end space-y-2">
                                        <div className="flex items-center">
                                            <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                                            <span className="text-xs">{product.rating?.rate || 'N/A'}</span>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
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
                title={selectedProduct ? 'Modifier le produit' : 'Nouveau produit'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nom du produit
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Prix (€)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Catégorie
                        </label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            URL de l'image
                        </label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        {formData.image && (
                            <img
                                src={formData.image}
                                alt="Preview"
                                className="mt-2 w-32 h-32 object-cover rounded-lg"
                            />
                        )}
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
                            {selectedProduct ? 'Mettre à jour' : 'Créer'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Products;