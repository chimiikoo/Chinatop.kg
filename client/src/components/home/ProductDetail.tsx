
import { Star, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { t, type Language } from "@/lib/i18n";

interface ProductDetailProps {
    language: Language;
    product: any;
    setSelectedProduct: (product: any) => void;
    handleWhatsAppClick: (product: any) => void;
    isSticky: boolean;
}

export function ProductDetail({
    language,
    product,
    setSelectedProduct,
    handleWhatsAppClick,
    isSticky
}: ProductDetailProps) {
    const productName = product.nameKey ? t(product.nameKey, language) : product.name;

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
                        <Button onClick={() => handleWhatsAppClick(product)} className="gradient-orange text-white">
                            WhatsApp
                        </Button>
                    </div>
                </div>
            </nav>

            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="animate-fade-in">
                        <img src={product.image} alt={productName} className="w-full h-96 object-cover rounded-2xl shadow-xl" />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6 animate-slide-in-right">
                        <div>
                            <h1 className="text-4xl font-poppins font-bold text-gray-900 mb-2">{productName}</h1>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-orange-400 text-orange-400" : "text-gray-300"}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">({product.reviews} {language === "ru" ? "отзывов" : "пикир"})</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="glass p-6 rounded-xl">
                            <p className="text-gray-600 text-sm mb-2">{t("product_detail.current_price", language)}</p>
                            <p className="text-4xl font-bold text-orange-600">{product.price.toLocaleString()} {language === "ru" ? "сом" : "сом"}</p>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-xl font-poppins font-bold text-gray-900 mb-3">{t("product_detail.description", language)}</h3>
                            <p className="text-gray-600 leading-relaxed">{t(product.descriptionKey, language)}</p>
                        </div>

                        {/* Features */}
                        <div>
                            <h3 className="text-xl font-poppins font-bold text-gray-900 mb-3">{t("product_detail.characteristics", language)}</h3>
                            <ul className="space-y-2">
                                {product.featuresKeys.map((featureKey: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700">
                                        <div className="w-2 h-2 rounded-full gradient-orange"></div>
                                        {t(featureKey, language)}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Button
                                onClick={() => handleWhatsAppClick(product)}
                                className="gradient-orange text-white px-8 py-6 text-lg rounded-xl hover-scale shadow-xl"
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                {t("product_detail.learn_more", language)}
                            </Button>
                            <Button
                                variant="outline"
                                className="border-2 border-orange-300 text-gray-900 px-8 py-6 text-lg rounded-xl hover:bg-orange-50 glass"
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
        </div>
    );
}
