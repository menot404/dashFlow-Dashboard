/**
 * Service produit : gère les appels API pour CRUD produits
 */
import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

export const productsService = {
    /**
     * Récupère la liste des produits
     */
    async getProducts() {
        try {
            const response = await api.get(API_ENDPOINTS.PRODUCTS);
            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw new Error(
                "Impossible de charger les produits. Veuillez réessayer.",
            );
        }
    },

    /**
     * Récupère un produit par son id
     */
    async getProductById(id) {
        try {
            const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw new Error(`Impossible de charger le produit #${id}.`);
        }
    },

    /**
     * Crée un nouveau produit
     */
    async createProduct(productData) {
        try {
            // Simuler un délai pour l'UX
            await new Promise((resolve) => setTimeout(resolve, 500));
            const response = await api.post(API_ENDPOINTS.PRODUCTS, productData);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw new Error(
                "Impossible de créer le produit. Veuillez vérifier les données.",
            );
        }
    },

    /**
     * Met à jour un produit existant
     */
    async updateProduct(id, productData) {
        try {
            // Simuler un délai pour l'UX
            await new Promise((resolve) => setTimeout(resolve, 500));
            const response = await api.put(
                `${API_ENDPOINTS.PRODUCTS}/${id}`,
                productData,
            );
            return response.data;
        } catch (error) {
            console.error(`Error updating product ${id}:`, error);
            throw new Error(
                "Impossible de mettre à jour le produit. Veuillez réessayer.",
            );
        }
    },

    /**
     * Supprime un produit
     */
    async deleteProduct(id) {
        try {
            // Simuler un délai pour l'UX
            await new Promise((resolve) => setTimeout(resolve, 500));
            await api.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting product ${id}:`, error);
            throw new Error(
                "Impossible de supprimer le produit. Veuillez réessayer.",
            );
        }
    },

    async getCategories() {
        try {
            const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/categories`);
            return response.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            // Retourner des catégories par défaut en cas d'erreur
            return ["electronics", "jewelery", "men's clothing", "women's clothing"];
        }
    },
};
