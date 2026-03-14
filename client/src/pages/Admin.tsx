import { useState, useEffect } from "react";
import { useProducts, type Category, type Product } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Trash2, Plus, LogOut, Save, ImageIcon, Search, LayoutDashboard, Settings, Eye, ChevronRight, Languages, Layers, Activity, Package, Camera, Type, Globe2, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Admin() {
    const { categories: initialCategories, refresh } = useProducts();
    const [categories, setCategories] = useState<Category[]>([]);
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState("");
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (initialCategories.length > 0) {
            setCategories(initialCategories);
            if (!activeTab && initialCategories.length > 0) {
                setActiveTab(initialCategories[0].id);
            }
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
                toast.error(data.error || `Error ${res.status}: Access Denied`);
                return;
            }

            if (data.success) {
                setToken(data.token);
                localStorage.setItem("adminToken", data.token);
                setIsAuthenticated(true);
                toast.success("Welcome back, Admin");
            } else {
                toast.error("Invalid password");
            }
        } catch (e) {
            toast.error("Login failed: could not connect to server");
        }
    };

    const handleSave = async () => {
        const loadingToast = toast.loading("Saving changes...");
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
                toast.dismiss(loadingToast);
                toast.success("All changes saved successfully");
                refresh();
            } else {
                const data = await res.json();
                toast.dismiss(loadingToast);
                toast.error(data.error || "Failed to save changes");
            }
        } catch (e) {
            toast.dismiss(loadingToast);
            toast.error("Error connecting to server");
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
                nameKey: "",
                name_ru: "Новый товар",
                name_ky: "Жаңы товар",
                price: 0,
                rating: 0, // Used as stock quantity
                reviews: 0,
                descriptionKey: "",
                desc_ru: "Описание товара",
                desc_ky: "Товардын сүрөттөмөсү",
                featuresKeys: ["product_detail.warranty"],
                image: "/images/placeholder.png"
            };
            newCategory.products = [newProduct, ...newCategory.products];
            newCategories[catIndex] = newCategory;
            return newCategories;
        });
        toast.info("Product added to top");
    };

    const removeProduct = (catIndex: number, prodIndex: number) => {
        if (confirm("Удалить этот товар?")) {
            setCategories(prevCategories => {
                const newCategories = [...prevCategories];
                const newCategory = { ...newCategories[catIndex] };
                newCategory.products = newCategory.products.filter((_, index) => index !== prodIndex);
                newCategories[catIndex] = newCategory;
                return newCategories;
            });
        }
    };

    const addCategory = () => {
        const newCat: Category = {
            id: `cat-${Date.now()}`,
            nameKey: "",
            name_ru: "Новая Категория",
            name_ky: "Жаңы Категория",
            descriptionKey: "",
            desc_ru: "Краткое описание категории",
            desc_ky: "Категориянын кыскача сүрөттөмөсү",
            image: "/images/placeholder.png",
            products: []
        };
        setCategories([newCat, ...categories]);
        setActiveTab(newCat.id);
        toast.info("New category created");
    };

    const removeCategory = (catIndex: number) => {
        if (confirm("Вы уверены, что хотите удалить ВСЮ КАТЕГОРИЮ со всеми товарами?")) {
            setCategories(prevCategories => prevCategories.filter((_, index) => index !== catIndex));
            setActiveTab(categories[0]?.id || null);
        }
    };

    const handleImageUpload = async (catIndex: number, prodIndex: number | null, file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        const loadingUpload = toast.loading("Uploading image...");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            toast.dismiss(loadingUpload);
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
                toast.success("Image updated");
            }
        } catch (e) {
            toast.dismiss(loadingUpload);
            toast.error("Upload failed");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#020617] px-4 overflow-hidden relative">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md z-10"
                >
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="w-24 h-24 mb-6 rounded-[2rem] bg-gradient-to-br from-orange-500 to-amber-600 p-0.5 shadow-2xl">
                             <div className="w-full h-full bg-[#020617] rounded-[1.9rem] flex items-center justify-center overflow-hidden">
                                <img src="/images/chinatop-logo.png" alt="ChinaTop" className="w-16 h-16 object-contain" />
                             </div>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">CHINATOP</h1>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.3em]">Administrative Portal</p>
                    </div>

                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-3xl shadow-2xl overflow-hidden rounded-[2.5rem]">
                        <CardHeader className="pt-10 text-center border-b border-white/5 pb-8">
                            <CardTitle className="text-white text-xl">Secure Access</CardTitle>
                            <CardDescription className="text-slate-400">Restricted personnel only</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-10 px-8 pb-10">
                            <div className="space-y-3">
                                <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-1">Access Token / Password</Label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter ChinaTop Access Code"
                                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                    className="bg-black/40 border-white/10 text-white h-14 rounded-2xl focus:ring-orange-500/30 focus:border-orange-500 transition-all px-6 text-center tracking-[0.2em]"
                                />
                            </div>
                            <Button 
                                onClick={handleLogin} 
                                className="w-full h-14 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-lg shadow-[0_10px_30px_rgba(234,88,12,0.3)] hover:shadow-[0_15px_40px_rgba(234,88,12,0.4)] active:scale-[0.98] transition-all"
                            >
                                AUTHORIZE SYSTEM
                            </Button>
                        </CardContent>
                    </Card>
                    <p className="text-center text-slate-600 mt-10 text-[10px] font-bold uppercase tracking-widest">Digital Infrastructure © 2026</p>
                </motion.div>
            </div>
        );
    }

    const activeCategoryIndex = categories.findIndex(c => c.id === activeTab);
    const activeCategory = categories[activeCategoryIndex];

    const filteredProducts = activeCategory?.products.filter(p => {
        const nameRu = p.name_ru || "";
        const nameKy = p.name_ky || "";
        const search = searchTerm.toLowerCase();
        return nameRu.toLowerCase().includes(search) || nameKy.toLowerCase().includes(search);
    }) || [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Premium Navigation Hub */}
            <header className="sticky top-0 z-50">
                <div className="absolute inset-0 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-2xl border-b border-slate-200 dark:border-white/5" />
                <div className="container mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-0.5 shadow-xl transition-transform hover:rotate-6">
                            <div className="w-full h-full bg-white dark:bg-[#020617] rounded-[0.7rem] md:rounded-[0.9rem] flex items-center justify-center">
                                <img src="/images/chinatop-logo.png" alt="Logo" className="w-6 h-6 md:w-10 md:h-10" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-sm md:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 uppercase">MNGMT HUB</h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                <span className="text-[8px] md:text-[10px] font-black text-orange-600 tracking-widest uppercase truncate max-w-[120px] md:max-w-none">Status: Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button 
                            onClick={handleSave}
                            className="hidden md:flex h-12 px-8 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
                        >
                            <Save className="w-4 h-4" />
                            Save Configuration
                        </Button>
                        <Button 
                            onClick={handleSave}
                            className="md:hidden h-12 w-12 p-0 rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                        >
                            <Save className="w-5 h-5" />
                        </Button>
                        <button 
                            onClick={() => { localStorage.removeItem("adminToken"); setIsAuthenticated(false); }}
                            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
                    
                    {/* Sidebar Collections */}
                    <aside className="w-full lg:w-80 shrink-0 space-y-8">
                        <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-4 shadow-xl">
                            <div className="flex items-center justify-between px-4 py-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <Layers className="w-3 h-3 md:w-4 md:h-4 text-orange-600" />
                                    <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-500">Inventory Zones</h3>
                                </div>
                                <button 
                                    onClick={addCategory}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-600 text-white hover:rotate-90 transition-transform shadow-lg shadow-orange-600/20"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => { setActiveTab(cat.id); setSearchTerm(""); }}
                                        className={`flex-none lg:w-full group relative flex items-center gap-4 p-4 rounded-[1.5rem] transition-all duration-300 ${
                                            activeTab === cat.id 
                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl scale-[1.02]" 
                                            : "hover:bg-white dark:hover:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-transform ${activeTab === cat.id ? "border-orange-500" : "border-slate-200 dark:border-white/10"}`}>
                                            <img src={cat.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex flex-col items-start text-left min-w-0">
                                            <span className="font-bold text-sm tracking-tight truncate w-full">{cat.name_ru || "New Category"}</span>
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${activeTab === cat.id ? "text-orange-500" : "text-slate-400"}`}>{cat.products.length} Units</span>
                                        </div>
                                        {activeTab === cat.id && (
                                            <ChevronRight className="w-4 h-4 text-orange-500 ml-auto hidden lg:block" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Inventory Stats */}
                        <div className="hidden lg:block relative group overflow-hidden bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[2.5rem] p-8 text-white shadow-2xl transition-all hover:scale-[1.02]">
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-600/20 rounded-full blur-[60px]" />
                            <div className="relative z-10">
                                <Activity className="w-10 h-10 text-orange-500 mb-6" />
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Total Stock Value</p>
                                    <h4 className="text-4xl font-black tracking-tighter">
                                        {categories.reduce((acc, c) => acc + c.products.reduce((pAcc, p) => pAcc + (p.rating || 0), 0), 0)}
                                        <span className="text-sm font-bold ml-3 text-orange-500">Units</span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Editor Content Area */}
                    <main className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            {activeCategory ? (
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="space-y-12 pb-24"
                                >
                                    {/* Category Branding Section */}
                                    <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
                                        <div className="h-48 md:h-64 relative bg-slate-100 dark:bg-black/20">
                                            <img src={activeCategory.image} className="w-full h-full object-cover opacity-50 blur-xl" alt="" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#020617] via-transparent to-transparent" />
                                            
                                            <div className="absolute inset-x-0 bottom-0 px-4 md:px-12 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 pb-6 md:pb-12 text-center md:text-left">
                                                <div className="relative group/cover shrink-0">
                                                    <div className="w-24 h-24 md:w-44 md:h-44 rounded-[2rem] md:rounded-[3.5rem] border-[4px] md:border-[10px] border-white dark:border-[#020617] overflow-hidden shadow-2xl relative z-10 transition-transform group-hover/cover:scale-[1.05] duration-500">
                                                        <img src={activeCategory.image} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <label className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover/cover:opacity-100 cursor-pointer rounded-[2rem] md:rounded-[3.5rem] transition-all backdrop-blur-sm">
                                                        <div className="flex flex-col items-center gap-1 md:gap-2">
                                                            <div className="p-2 md:p-4 bg-white/20 rounded-full"><Upload className="w-4 h-4 md:w-6 md:h-6" /></div>
                                                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Update</span>
                                                        </div>
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleImageUpload(activeCategoryIndex, null, file);
                                                        }} />
                                                    </label>
                                                </div>
                                                <div className="flex-1 mb-2 md:mb-4 min-w-0">
                                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2 md:mb-3">
                                                        <span className="px-3 py-1 bg-orange-600 text-white text-[8px] md:text-[10px] font-black rounded-full shadow-lg shadow-orange-600/30 tracking-widest uppercase">Global Category</span>
                                                        <span className="text-slate-400 dark:text-slate-500 text-[8px] md:text-[10px] font-bold tracking-widest">#{activeCategory.id.slice(0, 8)}</span>
                                                    </div>
                                                    <h2 className="text-2xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white truncate w-full">
                                                        {activeCategory.name_ru || "Unidentified Zone"}
                                                    </h2>
                                                </div>
                                                <button 
                                                    onClick={() => removeCategory(activeCategoryIndex)}
                                                    className="mb-8 p-4 rounded-3xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl hover:shadow-red-500/20"
                                                >
                                                    <Trash2 className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="px-4 md:px-12 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
                                            <div className="space-y-4 md:space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                        <Type className="w-3 h-3 md:w-4 md:h-4" />
                                                    </div>
                                                    <span className="text-[8px] md:text-[10px] font-black tracking-[0.3em] uppercase text-blue-500">Russian (RU)</span>
                                                </div>
                                                <Input 
                                                    value={activeCategory.name_ru || ""} 
                                                    onChange={(e) => {
                                                        const newCats = [...categories];
                                                        newCats[activeCategoryIndex] = { ...newCats[activeCategoryIndex], name_ru: e.target.value };
                                                        setCategories(newCats);
                                                    }}
                                                    className="h-12 md:h-16 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 rounded-xl md:rounded-2xl md:text-xl font-black px-6 md:px-8 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                                                    placeholder="Category Identity..."
                                                />
                                                <Textarea 
                                                    value={activeCategory.desc_ru || ""} 
                                                    onChange={(e) => {
                                                        const newCats = [...categories];
                                                        newCats[activeCategoryIndex] = { ...newCats[activeCategoryIndex], desc_ru: e.target.value };
                                                        setCategories(newCats);
                                                    }}
                                                    className="min-h-[100px] md:min-h-[140px] bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-6 resize-none text-slate-600 dark:text-slate-400 font-medium leading-relaxed shadow-inner text-sm"
                                                    placeholder="Description in Russian..."
                                                />
                                            </div>
                                            <div className="space-y-4 md:space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                        <Globe2 className="w-3 h-3 md:w-4 md:h-4" />
                                                    </div>
                                                    <span className="text-[8px] md:text-[10px] font-black tracking-[0.3em] uppercase text-orange-500">Kyrgyz (KY)</span>
                                                </div>
                                                <Input 
                                                    value={activeCategory.name_ky || ""} 
                                                    onChange={(e) => {
                                                        const newCats = [...categories];
                                                        newCats[activeCategoryIndex] = { ...newCats[activeCategoryIndex], name_ky: e.target.value };
                                                        setCategories(newCats);
                                                    }}
                                                    className="h-12 md:h-16 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 rounded-xl md:rounded-2xl md:text-xl font-black px-6 md:px-8 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-inner"
                                                    placeholder="Категория аталышы..."
                                                />
                                                <Textarea 
                                                    value={activeCategory.desc_ky || ""} 
                                                    onChange={(e) => {
                                                        const newCats = [...categories];
                                                        newCats[activeCategoryIndex] = { ...newCats[activeCategoryIndex], desc_ky: e.target.value };
                                                        setCategories(newCats);
                                                    }}
                                                    className="min-h-[100px] md:min-h-[140px] bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-6 resize-none text-slate-600 dark:text-slate-400 font-medium leading-relaxed shadow-inner text-sm"
                                                    placeholder="Кыргызча сүрөттөмөсү..."
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Inventory & Units Section */}
                                    <section className="space-y-10">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter">DATASET</h3>
                                                    <span className="px-3 py-1 bg-orange-600/10 text-orange-600 text-xs font-black rounded-full border border-orange-600/20">{activeCategory.products.length} ENTITIES</span>
                                                </div>
                                                <p className="text-slate-500 font-bold max-w-sm">Refine individual unit specifications and operational stock levels.</p>
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                <div className="relative group/search">
                                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/search:text-orange-500 transition-colors" />
                                                    <Input 
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        placeholder="Filter Nomenclature..." 
                                                        className="w-full md:w-80 pl-16 h-14 bg-white dark:bg-white/5 rounded-2xl border-slate-200 dark:border-white/5 focus:ring-4 focus:ring-orange-500/10 shadow-xl"
                                                    />
                                                </div>
                                                <Button 
                                                    onClick={() => addProduct(activeCategoryIndex)}
                                                    className="h-14 px-10 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black shadow-2xl shadow-orange-600/20 flex items-center gap-3 active:scale-[0.98] transition-all"
                                                >
                                                    <Plus className="w-6 h-6" />
                                                    <span className="hidden sm:inline">DEPLOY UNIT</span>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 md:gap-10">
                                            {filteredProducts.map((prod, prodIndex) => (
                                                <motion.div 
                                                    key={prod.id}
                                                    layout
                                                    className="group/card relative bg-white dark:bg-white/5 rounded-[2rem] md:rounded-[3.5rem] border border-slate-200 dark:border-white/5 p-4 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col xl:grid xl:grid-cols-12 gap-6 md:gap-10"
                                                >
                                                    <div className="xl:col-span-3 space-y-4 md:space-y-8">
                                                        <div className="relative group/unit-img rounded-[1.5rem] md:rounded-[3rem] overflow-hidden bg-slate-50 dark:bg-black/40 aspect-square border border-slate-200 dark:border-white/5 shadow-inner">
                                                            <img src={prod.image} className="w-full h-full object-contain p-4 md:p-10 scale-95 group-hover/unit-img:scale-100 transition-transform duration-700" alt="" />
                                                            <label className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/80 text-white opacity-0 group-hover/unit-img:opacity-100 cursor-pointer transition-all duration-300 backdrop-blur-md">
                                                                <div className="flex flex-col items-center gap-2 md:gap-3 scale-75 md:scale-100 transition-transform">
                                                                    <div className="p-3 md:p-5 bg-white/20 rounded-full shadow-2xl"><Camera className="w-6 h-6 md:w-8 md:h-8" /></div>
                                                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Update</span>
                                                                </div>
                                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) handleImageUpload(activeCategoryIndex, prodIndex, file);
                                                                }} />
                                                            </label>
                                                        </div>

                                                        <div className="space-y-4 md:space-y-6">
                                                            <div className="grid grid-cols-2 xl:grid-cols-1 gap-3 md:gap-4">
                                                                <div className="space-y-1 md:space-y-2">
                                                                    <span className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Price (KGS)</span>
                                                                    <Input 
                                                                        type="number"
                                                                        value={prod.price}
                                                                        onChange={(e) => updateProduct(activeCategoryIndex, prodIndex, 'price', Number(e.target.value))}
                                                                        className="h-10 md:h-14 bg-slate-50 dark:bg-black/20 border-none rounded-xl md:rounded-2xl font-black text-slate-900 dark:text-white text-center shadow-inner text-xs md:text-base"
                                                                    />
                                                                </div>
                                                                <div className="space-y-1 md:space-y-2">
                                                                    <div className="flex items-center gap-1.5 ml-1">
                                                                        <span className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">Stock</span>
                                                                        <Package className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-500" />
                                                                    </div>
                                                                    <Input 
                                                                        type="number"
                                                                        value={prod.rating}
                                                                        onChange={(e) => updateProduct(activeCategoryIndex, prodIndex, 'rating', Number(e.target.value))}
                                                                        className="h-10 md:h-14 bg-slate-50 dark:bg-black/20 border-none rounded-xl md:rounded-2xl font-black text-slate-900 dark:text-white text-center shadow-inner text-xs md:text-base"
                                                                    />
                                                                </div>
                                                            </div>
                                                            
                                                            <Button 
                                                                variant="ghost" 
                                                                onClick={() => removeProduct(activeCategoryIndex, prodIndex)}
                                                                className="w-full h-10 md:h-14 rounded-xl md:rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] border border-red-500/10"
                                                            >
                                                                <Trash2 className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                                                                DELETE UNIT
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="xl:col-span-9 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-12 h-full">
                                                        <div className="space-y-4 md:space-y-6 bg-slate-50/50 dark:bg-black/20 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-transparent hover:border-blue-500/20 transition-all shadow-inner">
                                                            <div className="flex items-center gap-2 md:gap-3">
                                                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-600" />
                                                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Spec Node: RU</span>
                                                            </div>
                                                            <div className="space-y-3 md:space-y-4">
                                                                <Input 
                                                                    value={prod.name_ru || ""} 
                                                                    placeholder="Unit Nomenclature"
                                                                    onChange={(e) => updateProduct(activeCategoryIndex, prodIndex, 'name_ru', e.target.value)}
                                                                    className="h-10 md:h-14 bg-white dark:bg-white/5 border-none rounded-lg md:rounded-xl font-bold tracking-tight shadow-sm text-xs md:text-base"
                                                                />
                                                                <Textarea 
                                                                    value={prod.desc_ru || ""} 
                                                                    placeholder="Technical specifications..."
                                                                    onChange={(e) => updateProduct(activeCategoryIndex, prodIndex, 'desc_ru', e.target.value)}
                                                                    className="min-h-[80px] md:min-h-[220px] bg-white dark:bg-white/5 border-none rounded-lg md:rounded-xl py-4 md:py-6 scrollbar-hide text-[11px] md:text-sm leading-relaxed shadow-sm font-medium"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4 md:space-y-6 bg-orange-500/5 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-transparent hover:border-orange-500/20 transition-all shadow-inner">
                                                            <div className="flex items-center gap-2 md:gap-3">
                                                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-orange-600" />
                                                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">Spec Node: KY</span>
                                                            </div>
                                                            <div className="space-y-3 md:space-y-4">
                                                                <Input 
                                                                    value={prod.name_ky || ""} 
                                                                    placeholder="Бирдик номенклатурасы"
                                                                    onChange={(e) => updateProduct(activeCategoryIndex, prodIndex, 'name_ky', e.target.value)}
                                                                    className="h-10 md:h-14 bg-white dark:bg-white/5 border-none rounded-lg md:rounded-xl font-bold tracking-tight shadow-sm text-xs md:text-base"
                                                                />
                                                                <Textarea 
                                                                    value={prod.desc_ky || ""} 
                                                                    placeholder="Техникалык мүнөздөмөлөрү..."
                                                                    onChange={(e) => updateProduct(activeCategoryIndex, prodIndex, 'desc_ky', e.target.value)}
                                                                    className="min-h-[80px] md:min-h-[220px] bg-white dark:bg-white/5 border-none rounded-lg md:rounded-xl py-4 md:py-6 scrollbar-hide text-[11px] md:text-sm leading-relaxed shadow-sm font-medium"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {filteredProducts.length === 0 && (
                                                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center bg-white/30 dark:bg-white/5 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                                                    <div className="p-8 bg-slate-100 dark:bg-white/5 rounded-full mb-8">
                                                        <Search className="w-16 h-16 text-slate-300 dark:text-slate-700" />
                                                    </div>
                                                    <h4 className="text-2xl font-black mb-2">No Matching Units</h4>
                                                    <p className="text-slate-500 font-bold max-w-xs">Zero operational assets match your current filtering criteria.</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                </motion.div>
                            ) : (
                                <div className="h-[75vh] flex flex-col items-center justify-center text-center p-16 bg-white/50 dark:bg-white/5 backdrop-blur-2xl rounded-[4rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    <motion.div 
                                        animate={{ scale: [1, 1.1, 1] }} 
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="w-40 h-40 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-10 shadow-inner relative z-10"
                                    >
                                        <Layers className="w-16 h-16 text-slate-300 dark:text-slate-700" />
                                    </motion.div>
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 relative z-10">Select Operations Zone</h2>
                                    <p className="text-slate-500 max-w-sm font-bold mb-12 leading-relaxed relative z-10">Access the control nexus via the sidebar to perform configuration overrides or add new operational categories.</p>
                                    <Button 
                                        onClick={addCategory}
                                        className="h-16 px-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black flex items-center gap-4 shadow-2xl active:scale-95 transition-all text-lg relative z-10"
                                    >
                                        <Plus className="w-7 h-7" />
                                        INITIALIZE CATEGORY
                                    </Button>
                                </div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            {/* Mobile Float Action */}
            {activeCategory && (
                <div className="fixed bottom-8 right-8 lg:hidden z-50">
                    <Button 
                        onClick={() => addProduct(activeCategoryIndex)}
                        className="w-20 h-20 rounded-[2.5rem] bg-orange-600 dark:bg-white text-white dark:text-slate-900 shadow-[0_20px_50px_rgba(234,88,12,0.4)] flex items-center justify-center active:scale-90 transition-all border-[6px] border-orange-600/20 dark:border-white/20"
                    >
                        <Plus className="w-10 h-10" />
                    </Button>
                </div>
            )}
        </div>
    );
}
