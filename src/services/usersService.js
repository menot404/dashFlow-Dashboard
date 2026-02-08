/**
 * Service utilisateur : gère les appels API pour CRUD utilisateurs
 */
import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

export const usersService = {
    /**
     * Récupère la liste des utilisateurs
     */
    async getUsers() {
        try {
            const response = await api.get(API_ENDPOINTS.USERS);
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    /**
     * Récupère un utilisateur par son id
     */
    async getUserById(id) {
        try {
            const response = await api.get(`${API_ENDPOINTS.USERS}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching user ${id}:`, error);
            throw error;
        }
    },

    /**
     * Crée un nouvel utilisateur
     */
    async createUser(userData) {
        try {
            const response = await api.post(API_ENDPOINTS.USERS, userData);
            return response.data;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    /**
     * Met à jour un utilisateur existant
     */
    async updateUser(id, userData) {
        try {
            const response = await api.put(`${API_ENDPOINTS.USERS}/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error(`Error updating user ${id}:`, error);
            throw error;
        }
    },

    /**
     * Supprime un utilisateur
     */
    async deleteUser(id) {
        try {
            await api.delete(`${API_ENDPOINTS.USERS}/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting user ${id}:`, error);
            throw error;
        }
    },
};
