import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t, type Language } from "@/lib/i18n";
import type { Category } from "@/hooks/useProducts";

interface PopularProductsProps {
    language: Language;
    selectedCategory: string;
    setSelectedCategory: (id: string | null) => void;
    setSelectedProduct: (product: any) => void;
    handleWhatsAppClick: (product: any) => void;
    categories: Category[];
}

export function PopularProducts({
    language,
    selectedCategory,
    setSelectedCategory,
    setSelectedProduct,
    handleWhatsAppClick,
    categories,
}: PopularProductsProps) {
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = selectedCategory
        ? categories
            .find((c) => c.id === selectedCategory)
            ?.products.filter((p) => {
                const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
                const productName = t(p.nameKey, language).toLowerCase();
                const productDesc = t(p.descriptionKey, language).toLowerCase();
                const matchesSearch = productName.includes(searchQuery.toLowerCase()) || productDesc.includes(searchQuery.toLowerCase());
                return matchesPrice && matchesSearch;
            })
        : [];

    return (
        <section id="popular-products" className="bg-white/50 backdrop-blur-md py-20">
            <div className="container">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-4xl font-poppins font-bold text-gray-900">{t("popular_products.title", language)}</h2>
                        <p className="text-gray-600 mt-2">{t("popular_products.subtitle", language)}</p>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedCategory(null)} className="border-orange-300">
                        {t("gallery.close", language)}
                    </Button>
                </div>
                {/* Filters */}
                <div className="glass p-6 rounded-2xl mb-12 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {language === "ru" ? "Поиск по названию" : "Аты боюнча издөө"}
                            </label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={language === "ru" ? "Например: CHS581L..." : "Мисалы: CHS581L..."}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {language === "ru" ? "Цена до:" : "Баасы чейин:"} {priceRange[1].toLocaleString()} сом
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="200000"
                                step="5000"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>0 сом</span>
                                <span>200 000 сом</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {filteredProducts?.map((product) => (
                        <div key={product.id} className="glass p-6 rounded-xl hover-scale transition-all group">
                            <img src={product.image} alt={t(product.nameKey, language)} className="w-full h-48 object-cover rounded-lg mb-4 group-hover:shadow-lg transition-shadow" />
                            <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-orange-400 text-orange-400" : "text-gray-300"}`} />
                                ))}
                                <span className="text-xs text-gray-600 ml-2">({product.reviews})</span>
                            </div>
                            <h4 className="font-poppins font-bold text-gray-900 mb-2">{t(product.nameKey, language)}</h4>
                            <p className="text-2xl font-bold text-orange-600 mb-4">{product.price.toLocaleString()} {language === "ru" ? "сом" : "сом"}</p>
                            <div className="flex gap-2">
                                <Button onClick={() => setSelectedProduct(product)} className="flex-1 gradient-orange text-white rounded-lg hover-scale">
                                    {t("gallery.details", language)}
                                </Button>
                                <Button onClick={() => handleWhatsAppClick(product)} className="flex-1 gradient-orange text-white rounded-lg hover-scale">
                                    {t("popular_products.request_price", language)}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
