/**
 * Vérifie si une adresse email est valide
 * @param {string} email - Email à valider
 * @returns {boolean} true si valide
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Vérifie si un mot de passe est valide (min 6 caractères)
 * @param {string} password - Mot de passe à valider
 * @returns {boolean} true si valide
 */
export const isValidPassword = (password) => {
    return password.length >= 6
}