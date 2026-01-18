import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

export const productsService = {
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

    async getProductById(id) {
        try {
            const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw new Error(`Impossible de charger le produit #${id}.`);
        }
    },

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
