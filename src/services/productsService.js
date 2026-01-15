import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

export const productsService = {
    async getProducts() {
        try {
            const response = await api.get(API_ENDPOINTS.PRODUCTS);
            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },

    async getProductById(id) {
        try {
            const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw error;
        }
    },

    async createProduct(productData) {
        try {
            const response = await api.post(API_ENDPOINTS.PRODUCTS, productData);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    async updateProduct(id, productData) {
        try {
            const response = await api.put(
                `${API_ENDPOINTS.PRODUCTS}/${id}`,
                productData
            );
            return response.data;
        } catch (error) {
            console.error(`Error updating product ${id}:`, error);
            throw error;
        }
    },

    async deleteProduct(id) {
        try {
            await api.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting product ${id}:`, error);
            throw error;
        }
    },

    async getCategories() {
        try {
            const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/categories`);
            return response.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    },
};
