import { Star, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { t, type Language } from "@/lib/i18n";
import { useState } from "react";
import { ManagerSelectionModal } from "./ManagerSelectionModal";

interface ProductDetailProps {
    language: Language;
    product: any;
    setSelectedProduct: (product: any) => void;
    handleWhatsAppClick: (product: any, managerPhone?: string, customMessage?: string) => void;
    isSticky: boolean;
}

export function ProductDetail({
    language,
    product,
    setSelectedProduct,
    handleWhatsAppClick,
    isSticky
}: ProductDetailProps) {
    const [showManagerSelect, setShowManagerSelect] = useState(false);
    
    const productName = (language === "ru" ? product.name_ru : product.name_ky) || (product.nameKey ? t(product.nameKey, language) : product.name || "");
    const productDesc = (language === "ru" ? product.desc_ru : product.desc_ky) || (product.descriptionKey ? t(product.descriptionKey, language) : product.description || "");

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
            {/* Navigation */}
            <nav className={`sticky top-0 z-40 transition-all duration-300 ${isSticky ? "glass shadow-lg" : "bg-white/50 dark:bg-gray-900/50 backdrop-blur-md"}`}>
                <div className="container flex items-center justify-between py-4">
                    <button onClick={() => setSelectedProduct(null)} className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-all">
                        <ChevronDown className="w-5 h-5 rotate-90" />
                        <span className="font-medium">{t("product_detail.back", language)}</span>
                    </button>
                    <img src="/images/chinatop-logo.png" alt="ChinaTop" className="w-10 h-10 rounded-full" />
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <Button onClick={() => setShowManagerSelect(true)} className="gradient-orange text-white">
                            WhatsApp
                        </Button>
                    </div>
                </div>
            </nav>

            <div className="container py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="animate-fade-in">
                        <img src={product.image} alt={productName} className="w-full h-auto md:h-96 object-cover rounded-2xl shadow-xl" />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6 animate-slide-in-right">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-2">{productName}</h1>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 dark:bg-green-950/30 px-3 py-1 rounded-full border border-green-200 dark:border-green-800">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-sm">
                                        {language === "ru" ? "В наличии:" : "Кампада:"} {product.rating} шт.
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="glass p-6 rounded-xl">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{t("product_detail.current_price", language)}</p>
                            <p className="text-3xl md:text-4xl font-bold text-orange-600">{product.price.toLocaleString()} {language === "ru" ? "сом" : "сом"}</p>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-xl font-poppins font-bold text-gray-900 dark:text-white mb-3">{t("product_detail.description", language)}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{productDesc}</p>
                        </div>

                        {/* Features */}
                        <div>
                            <h3 className="text-xl font-poppins font-bold text-gray-900 dark:text-white mb-3">{t("product_detail.characteristics", language)}</h3>
                            <ul className="space-y-2">
                                {product.featuresKeys.map((featureKey: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <div className="w-2 h-2 rounded-full gradient-orange shrink-0"></div>
                                        {t(featureKey, language)}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Button
                                onClick={() => setShowManagerSelect(true)}
                                className="gradient-orange text-white px-8 py-6 text-lg rounded-xl hover-scale shadow-xl"
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                {t("product_detail.learn_more", language)}
                            </Button>
                            <Button
                                variant="outline"
                                className="border-2 border-orange-300 text-gray-900 dark:text-white px-8 py-6 text-lg rounded-xl hover:bg-orange-50 glass"
                                onClick={() => {
                                    setSelectedProduct(null);
                                    setTimeout(() => {
                                        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                                    }, 100);
                                }}
                            >
                                {t("product_detail.view_other", language)}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <ManagerSelectionModal
                isOpen={showManagerSelect}
                language={language}
                onClose={() => setShowManagerSelect(false)}
                onSelect={(phone) => handleWhatsAppClick(product, phone)}
            />
        </div>
    );
}
