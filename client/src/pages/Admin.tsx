import { useState, useEffect } from "react";
import { useProducts, type Category, type Product } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Trash2, Plus, LogOut, Save, ImageIcon } from "lucide-react";
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

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                toast.error(data.error || "Authentication failed");
                return;
            }

            if (data.success) {
                setToken(data.token);
                localStorage.setItem("adminToken", data.token);
                setIsAuthenticated(true);
                toast.success("Logged in successfully");
            } else {
                toast.error("Invalid password");
            }
        } catch (e) {
            console.error("Login Error:", e);
            toast.error("Login failed: could not connect to server");
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
        setCategories(prevCategories => {
            const newCategories = [...prevCategories];
            const newCategory = { ...newCategories[catIndex] };
            const newProducts = [...newCategory.products];
            newProducts[prodIndex] = {
                ...newProducts[prodIndex],
                [field]: value
            };
            newCategory.products = newProducts;
            newCategories[catIndex] = newCategory;
            return newCategories;
        });
    };

    const addProduct = (catIndex: number) => {
        setCategories(prevCategories => {
            const newCategories = [...prevCategories];
            const newCategory = { ...newCategories[catIndex] };
            const newProduct: Product = {
                id: Date.now(),
                nameKey: "new.product",
                price: 0,
                rating: 5,
                reviews: 0,
                descriptionKey: "new.product.desc",
                featuresKeys: ["product_detail.warranty"],
                image: "/images/placeholder.png"
            };
            newCategory.products = [...newCategory.products, newProduct];
            newCategories[catIndex] = newCategory;
            return newCategories;
        });
        toast.info("New product added. Don't forget to save!");
    };

    const removeProduct = (catIndex: number, prodIndex: number) => {
        setCategories(prevCategories => {
            const newCategories = [...prevCategories];
            const newCategory = { ...newCategories[catIndex] };
            newCategory.products = newCategory.products.filter((_, index) => index !== prodIndex);
            newCategories[catIndex] = newCategory;
            return newCategories;
        });
    };

    const addCategory = () => {
        const newCat: Category = {
            id: `new-category-${Date.now()}`,
            nameKey: "new.category",
            descriptionKey: "new.category.desc",
            image: "/images/placeholder.png",
            products: []
        };
        setCategories([...categories, newCat]);
        toast.info("New category added. Don't forget to save!");
    };

    const removeCategory = (catIndex: number) => {
        if (confirm("Are you sure you want to delete this entire category?")) {
            setCategories(prevCategories => prevCategories.filter((_, index) => index !== catIndex));
        }
    };

    const handleImageUpload = async (catIndex: number, prodIndex: number | null, file: File) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                if (prodIndex !== null) {
                    updateProduct(catIndex, prodIndex, 'image', data.url);
                } else {
                    setCategories(prev => {
                        const newCats = [...prev];
                        newCats[catIndex] = { ...newCats[catIndex], image: data.url };
                        return newCats;
                    });
                }
                toast.success("Image uploaded!");
            }
        } catch (e) {
            toast.error("Upload failed");
        }
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
                    <Button onClick={addCategory} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">Add Category</Button>
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">Save Changes</Button>
                    <Button variant="outline" onClick={() => {
                        localStorage.removeItem("adminToken");
                        setIsAuthenticated(false);
                    }}>Logout</Button>
                </div>
            </div>

            <div className="space-y-8">
                {categories.map((cat, catIndex) => (
                    <Card key={catIndex} className="relative">
                        <CardHeader className="bg-gray-50 dark:bg-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex-1 flex items-center gap-4">
                                <div className="relative group w-12 h-12">
                                    <img src={cat.image} alt="cat" className="w-12 h-12 object-cover rounded-md border bg-gray-100" />
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer rounded-md transition-opacity">
                                        <Upload className="w-4 h-4" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageUpload(catIndex, null, file);
                                            }}
                                        />
                                    </label>
                                </div>
                                <CardTitle className="text-xl capitalize flex items-center gap-4 flex-1">
                                    <Input
                                        value={cat.id}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setCategories(prev => {
                                                const newCats = [...prev];
                                                newCats[catIndex] = { ...newCats[catIndex], id: val };
                                                return newCats;
                                            });
                                        }}
                                        className="max-w-[200px] h-8 text-lg font-bold"
                                    />
                                    <Input
                                        value={cat.image}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setCategories(prev => {
                                                const newCats = [...prev];
                                                newCats[catIndex] = { ...newCats[catIndex], image: val };
                                                return newCats;
                                            });
                                        }}
                                        className="max-w-[300px] h-8 text-xs font-normal"
                                        placeholder="Category Image URL"
                                    />
                                </CardTitle>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <Button size="sm" onClick={() => addProduct(catIndex)} className="h-8">Add Product</Button>
                                <Button size="sm" variant="destructive" onClick={() => removeCategory(catIndex)} className="h-8">Delete Category</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {cat.products.map((prod, prodIndex) => (
                                <div key={prod.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b pb-4 last:border-0 last:pb-0">
                                    <div className="md:col-span-2 flex flex-col items-center gap-2">
                                        <div className="relative group w-16 h-16">
                                            <img src={prod.image} alt="prod" className="w-16 h-16 object-cover rounded-md border bg-gray-100" />
                                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer rounded-md transition-opacity">
                                                <Upload className="w-4 h-4" />
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleImageUpload(catIndex, prodIndex, file);
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        <Input
                                            value={prod.image}
                                            onChange={(e) => updateProduct(catIndex, prodIndex, 'image', e.target.value)}
                                            className="text-[10px] h-6 p-1"
                                            placeholder="Image URL"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label className="text-xs text-gray-500">Key Name</Label>
                                        <Input
                                            value={prod.nameKey}
                                            onChange={(e) => updateProduct(catIndex, prodIndex, 'nameKey', e.target.value)}
                                            className="h-8"
                                        />
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
                                    <div className="md:col-span-2">
                                        <Label>Quantity</Label>
                                        <Input
                                            type="number"
                                            value={prod.reviews}
                                            onChange={(e) => updateProduct(catIndex, prodIndex, 'reviews', Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex items-end pb-1">
                                        <Button variant="ghost" size="sm" onClick={() => removeProduct(catIndex, prodIndex)} className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full">
                                            Delete
                                        </Button>
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
