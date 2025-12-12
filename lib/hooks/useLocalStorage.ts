import { useEffect } from "react";
import { Product } from "../../types/product";

export function useLocalStorage() {
    // Load products from localStorage on mount and after every navigation
    useEffect(() => {
        const stored = localStorage.getItem("products");
        if (stored) {
            try {
                const products = JSON.parse(stored);
                // Store in a way that the server can access it
                // This triggers a re-fetch via the API
                window.dispatchEvent(
                    new CustomEvent("productsLoaded", { detail: products })
                );
            } catch (error) {
                console.error("Failed to parse stored products:", error);
            }
        }
    }, []);

    const saveProducts = (products: Product[]) => {
        try {
            localStorage.setItem("products", JSON.stringify(products));
        } catch (error) {
            console.error("Failed to save products to localStorage:", error);
        }
    };

    const getProducts = (): Product[] => {
        if (typeof window === "undefined") return [];
        try {
            const stored = localStorage.getItem("products");
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Failed to get products from localStorage:", error);
            return [];
        }
    };

    return { saveProducts, getProducts };
}
