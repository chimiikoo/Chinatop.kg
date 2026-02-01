
import { Button } from "@/components/ui/button";
import { t, type Language } from "@/lib/i18n";

interface HeroProps {
    language: Language;
    handleWhatsAppClick: (product?: any) => void;
}

export function Hero({ language, handleWhatsAppClick }: HeroProps) {
    return (
        <section className="container py-20 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 animate-fade-in">
                    <div className="inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">
                        {t("hero.badge", language)}
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-poppins font-bold text-gray-900 dark:text-white leading-tight break-words">
                        {t("hero.title", language)}
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                        {t("hero.description", language)}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={() => handleWhatsAppClick()} className="gradient-orange text-white px-8 py-6 text-lg rounded-xl hover-scale shadow-xl">
                            {t("hero.cta_whatsapp", language)}
                        </Button>
                        <Button
                            variant="outline"
                            className="border-2 border-orange-300 text-gray-900 px-8 py-6 text-lg rounded-xl hover:bg-orange-50 glass"
                            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            {t("hero.cta_products", language)}
                        </Button>
                    </div>
                </div>
                <div className="animate-slide-in-right">
                    <img
                        src="/images/massage-chairs-category.jpg"
                        alt="Hero"
                        className="w-full h-96 object-cover rounded-3xl shadow-2xl"
                        fetchPriority="high" // Key optimization
                        loading="eager"
                    />
                </div>
            </div>
        </section>
    );
}
