import { useState, useEffect } from "react";
import { productCategories as initialCategories } from "@/lib/data";

// Define Types based on data.ts structure
export interface Product {
    id: number;
    nameKey: string;
    price: number;
    rating: number;
    reviews: number;
    descriptionKey: string;
    featuresKeys: string[];
    image: string;
    name?: string; // Fallback if not using keys
    description?: string; // Fallback
}

export interface Category {
    id: string;
    nameKey: string;
    descriptionKey: string;
    image: string;
    products: Product[];
}

export function useProducts() {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products");
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data = await response.json();
            setCategories(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching products, using fallback:", err);
            // Fallback to static data is already set initally, or we can reset it here
            // setCategories(initialCategories); 
            setLoading(false);
            setError("Failed to load latest products");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { categories, loading, error, refresh: fetchProducts };
}
