import React, { useState, useEffect, useMemo } from 'react'
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

export const Products = () => {
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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Produit</TableHeader>
                                <TableHeader>Catégorie</TableHeader>
                                <TableHeader>Prix</TableHeader>
                                <TableHeader>Évaluation</TableHeader>
                                <TableHeader className="text-right">Actions</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pagination.paginatedItems.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-10 h-10 object-cover rounded-lg mr-3"
                                            />
                                            <div>
                                                <p className="font-medium line-clamp-1">{product.title}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                                    {product.description.substring(0, 50)}...
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Tag className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="capitalize">{product.category}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {formatCurrency(product.price)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                            <span>{product.rating?.rate || 'N/A'}</span>
                                            <span className="text-gray-500 ml-1">
                                                ({product.rating?.count || 0})
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
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
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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