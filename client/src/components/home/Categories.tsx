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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                {categories.map((category) => {
                    const categoryName = (language === "ru" ? category.name_ru : category.name_ky) || (category.nameKey ? t(category.nameKey, language) : category.id);
                    const categoryDesc = (language === "ru" ? category.desc_ru : category.desc_ky) || (category.descriptionKey ? t(category.descriptionKey, language) : "");
                    
                    return (
                        <div key={category.id} className="group glass p-3 md:p-8 rounded-2xl hover-scale transition-all cursor-pointer" onClick={() => {
                            setSelectedCategory(category.id);
                            setTimeout(() => {
                                document.getElementById('popular-products')?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                        }}>
                            <img
                                src={category.image}
                                alt={categoryName}
                                className="w-full h-24 md:h-64 object-cover rounded-xl mb-3 md:mb-6 group-hover:shadow-xl transition-shadow"
                                loading="lazy"
                            />
                            <h3 className="text-sm md:text-2xl font-poppins font-bold text-gray-900 dark:text-white mb-1 md:mb-2">{categoryName}</h3>
                            <p className="text-xs md:text-base text-gray-600 dark:text-gray-400 mb-2 md:mb-6 line-clamp-2">{categoryDesc}</p>
                            <Button className="gradient-orange text-white w-full rounded-lg hover-scale text-xs md:text-base py-1 h-8 md:h-10">
                                {t("categories.view_products", language)}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
