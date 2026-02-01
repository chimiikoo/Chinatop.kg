import { useState, useEffect } from "react";
import { useProducts, type Category, type Product } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Admin() {
    const { categories: initialCategories, refresh } = useProducts();
    const [categories, setCategories] = useState<Category[]>([]);
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState("");

    useEffect(() => {
        if (initialCategories.length > 0) {
            setCategories(initialCategories);
        }
    }, [initialCategories]);

    useEffect(() => {
        const storedToken = localStorage.getItem("adminToken");
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async () => {
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (data.success) {
                setToken(data.token);
                localStorage.setItem("adminToken", data.token);
                setIsAuthenticated(true);
                toast.success("Logged in successfully");
            } else {
                toast.error("Invalid password");
            }
        } catch (e) {
            toast.error("Login failed");
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(categories),
            });
            if (res.ok) {
                toast.success("Products saved successfully");
                refresh();
            } else {
                toast.error("Failed to save");
            }
        } catch (e) {
            toast.error("Error saving");
        }
    };

    const updateProduct = (catIndex: number, prodIndex: number, field: keyof Product, value: any) => {
        const newCats = [...categories];
        newCats[catIndex].products[prodIndex] = {
            ...newCats[catIndex].products[prodIndex],
            [field]: value
        };
        setCategories(newCats);
    };

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <Card className="w-96">
                    <CardHeader><CardTitle>Admin Login</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                        <Button onClick={handleLogin} className="w-full">Login</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Product Admin</h1>
                <div className="space-x-4">
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">Save Changes</Button>
                    <Button variant="outline" onClick={() => {
                        localStorage.removeItem("adminToken");
                        setIsAuthenticated(false);
                    }}>Logout</Button>
                </div>
            </div>

            <div className="space-y-8">
                {categories.map((cat, catIndex) => (
                    <Card key={cat.id}>
                        <CardHeader className="bg-gray-50 dark:bg-gray-800">
                            <CardTitle className="text-xl capitalize">{cat.id.replace(/-/g, ' ')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {cat.products.map((prod, prodIndex) => (
                                <div key={prod.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b pb-4 last:border-0 last:pb-0">
                                    <div className="md:col-span-1 flex justify-center md:block">
                                        <img src={prod.image} alt="prod" className="w-16 h-16 object-cover rounded-md border" />
                                    </div>
                                    <div className="md:col-span-3">
                                        <Label className="text-xs text-gray-500">Key: {prod.nameKey}</Label>
                                        <p className="font-medium truncate">{prod.nameKey}</p>
                                    </div>
                                    <div className="md:col-span-3">
                                        <Label>Price (SOM)</Label>
                                        <Input
                                            type="number"
                                            value={prod.price}
                                            onChange={(e) => updateProduct(catIndex, prodIndex, 'price', Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label>Rating</Label>
                                        <Input
                                            type="number" step="0.1" max="5"
                                            value={prod.rating}
                                            onChange={(e) => updateProduct(catIndex, prodIndex, 'rating', Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <Label>Reviews</Label>
                                        <Input
                                            type="number"
                                            value={prod.reviews}
                                            onChange={(e) => updateProduct(catIndex, prodIndex, 'reviews', Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
