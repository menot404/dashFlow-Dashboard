import { useState, useCallback } from "react";

/**
 * Hook personnalisé pour gérer les confirmations utilisateur (modale)
 * Fournit l'état, la fonction pour demander et fermer la confirmation
 * @returns {Object} confirmationState, askConfirmation, closeConfirmation
 */
export const useConfirmation = () => {
    const [confirmationState, setConfirmationState] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null,
        type: "warning",
        confirmText: "Confirmer",
        cancelText: "Annuler",
        destructive: false,
    });

    const askConfirmation = useCallback(
        ({
            title,
            message,
            onConfirm,
            type = "warning",
            confirmText = "Confirmer",
            cancelText = "Annuler",
            destructive = false,
        }) => {
            setConfirmationState({
                isOpen: true,
                title,
                message,
                onConfirm: async () => {
                    if (onConfirm) {
                        await onConfirm();
                    }
                    setConfirmationState((prev) => ({ ...prev, isOpen: false }));
                },
                type,
                confirmText,
                cancelText,
                destructive,
            });
        },
        [],
    );

    const closeConfirmation = useCallback(() => {
        setConfirmationState((prev) => ({ ...prev, isOpen: false }));
    }, []);

    return {
        confirmationState,
        askConfirmation,
        closeConfirmation,
    };
};
