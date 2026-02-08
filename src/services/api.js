/**
 * Instance Axios configurée pour les appels API
 * Timeout et headers par défaut
 */
import axios from "axios";

const api = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;