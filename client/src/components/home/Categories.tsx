import { Button } from "@/components/ui/button";
import { t, type Language } from "@/lib/i18n";
import type { Category } from "@/hooks/useProducts";

interface CategoriesProps {
    language: Language;
    setSelectedCategory: (id: string) => void;
    categories: Category[];
}

export function Categories({ language, setSelectedCategory, categories }: CategoriesProps) {
    return (
        <section id="products" className="container py-20">
            <h2 className="text-4xl font-poppins font-bold text-center text-gray-900 mb-4">{t("categories.title", language)}</h2>
            <p className="text-center text-gray-600 mb-12">{t("categories.subtitle", language)}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {categories.map((category) => (
                    <div key={category.id} className="group glass p-6 sm:p-8 rounded-2xl hover-scale transition-all cursor-pointer" onClick={() => {
                        setSelectedCategory(category.id);
                        setTimeout(() => {
                            document.getElementById('popular-products')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                    }}>
                        <img
                            src={category.image}
                            alt={t(category.nameKey, language)}
                            className="w-full h-48 sm:h-64 object-cover rounded-xl mb-6 group-hover:shadow-xl transition-shadow"
                            loading="lazy"
                        />
                        <h3 className="text-xl sm:text-2xl font-poppins font-bold text-gray-900 dark:text-white mb-2">{t(category.nameKey, language)}</h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">{t(category.descriptionKey, language)}</p>
                        <Button className="gradient-orange text-white w-full rounded-lg hover-scale">
                            {t("categories.view_products", language)}
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
}
