import { MapPin, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useState, useEffect, Suspense, lazy } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";
import { useProducts } from "@/hooks/useProducts";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";

// Lazy load heavy components
const WhyChooseUs = lazy(() => import("@/components/home/WhyChooseUs").then(module => ({ default: module.WhyChooseUs })));
const Categories = lazy(() => import("@/components/home/Categories").then(module => ({ default: module.Categories })));
const PopularProducts = lazy(() => import("@/components/home/PopularProducts").then(module => ({ default: module.PopularProducts })));
const About = lazy(() => import("@/components/home/About").then(module => ({ default: module.About })));
const Testimonials = lazy(() => import("@/components/home/Testimonials").then(module => ({ default: module.Testimonials })));
const Contact = lazy(() => import("@/components/home/Contact").then(module => ({ default: module.Contact })));
const ProductDetail = lazy(() => import("@/components/home/ProductDetail").then(module => ({ default: module.ProductDetail })));
const MapView = lazy(() => import("@/components/Map").then(module => ({ default: module.MapView })));

// Loading fallback component
const SectionLoader = () => (
  <div className="w-full h-48 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin"></div>
  </div>
);

export default function Home() {
  const { language } = useLanguage();
  const { categories } = useProducts();
  const [isSticky, setIsSticky] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scrollY, setScrollY] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWhatsAppClick = (product?: any) => {
    let message = language === "ru" ? "Привет! Я интересуюсь вашими товарами." : "Салам! Мен сиздин товарларыңызга кызыкдам.";
    if (product) {
      const productName = product.nameKey ? t(product.nameKey, language) : product.name;
      message = language === "ru"
        ? `Привет! Я интересуюсь товаром: "${productName}" (${product.price} сом). Можете ли вы предоставить подробную информацию?`
        : `Салам! Мен бул товарга кызыкдам: "${productName}" (${product.price} сом). Сиз толук маалыматты бере аласыз?`;
    }
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/996507120110?text=${encodedMessage}`, "_blank");
  };

  // Show product detail view
  if (selectedProduct) {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><SectionLoader /></div>}>
        <ProductDetail
          language={language}
          product={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          handleWhatsAppClick={handleWhatsAppClick}
          isSticky={isSticky}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      {/* Navigation */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${isSticky ? "glass shadow-lg" : "bg-white/50 dark:bg-gray-900/50 backdrop-blur-md"}`}>
        <div className="container flex items-center justify-between py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-3">
            <img src="/images/chinatop-logo.png" alt="ChinaTop" className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
            <div className="hidden sm:block">
              <h2 className="font-poppins font-semibold text-gray-900 text-sm md:text-lg tracking-tight leading-tight">ChinaTop</h2>
              <p className="text-[10px] md:text-xs text-orange-600 leading-tight">Premium Logistics</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <a href="#products" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">{t("nav.products", language)}</a>
            <a href="#about" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">{t("nav.about", language)}</a>
            <a href="#location" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">{t("nav.location", language)}</a>
            <a href="#contact" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">{t("nav.contacts", language)}</a>
          </div>

          <div className="flex items-center gap-1.5 md:gap-4">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <Button onClick={() => handleWhatsAppClick()} className="gradient-orange text-white text-[10px] md:text-sm h-8 md:h-10 px-2 md:px-4">
              {t("nav.whatsapp", language)}
            </Button>
          </div>
        </div>
      </nav>

      <Hero language={language} handleWhatsAppClick={handleWhatsAppClick} />

      <Stats language={language} />

      <Suspense fallback={<SectionLoader />}>
        <WhyChooseUs language={language} />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Categories language={language} setSelectedCategory={setSelectedCategory} categories={categories} />
      </Suspense>

      {selectedCategory && (
        <Suspense fallback={<SectionLoader />}>
          <PopularProducts
            language={language}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSelectedProduct={setSelectedProduct}
            handleWhatsAppClick={handleWhatsAppClick}
            categories={categories}
          />
        </Suspense>
      )}

      <Suspense fallback={<SectionLoader />}>
        <About language={language} />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <section id="location" className="bg-white/50 backdrop-blur-md py-20">
          <div className="container">
            <h2 className="text-4xl font-poppins font-bold text-center text-gray-900 mb-4">{t("map.title", language)}</h2>
            <p className="text-center text-gray-600 mb-12">{t("map.subtitle", language)}</p>
            {/* Map details are statically rendered in MapView or we can duplicate the static text here if MapView is just the map. 
                 Checking MapView props... MapView component seems to be just the iframe. 
                 The Contact details (Address, Hours, Phone) were part of the Location section in original file.
                 I need to bring those back here or move them to MapView.
                 To keep MapView focused, I'll put them here or create a LocationSection wrapper.
                 Let's check Map.tsx content again.
             */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Quick inline content for location details to avoid another small component file */}
              <div className="glass p-6 rounded-xl">
                <MapPin className="w-8 h-8 text-orange-600 mb-3" />
                <h3 className="font-poppins font-bold text-gray-900 mb-2">{t("contact.address_label", language)}</h3>
                <p className="text-gray-600">{t("map.address", language)}</p>
              </div>
              <div className="glass p-6 rounded-xl">
                <Clock className="w-8 h-8 text-orange-600 mb-3" />
                <h3 className="font-poppins font-bold text-gray-900 mb-2">{t("contact.working_hours_label", language)}</h3>
                <p className="text-gray-600">{t("map.working_hours", language)}</p>
              </div>
              <div className="glass p-6 rounded-xl">
                <Phone className="w-8 h-8 text-orange-600 mb-3" />
                <h3 className="font-poppins font-bold text-gray-900 mb-2">{t("contact.phone_label", language)}</h3>
                <p className="text-gray-600">{t("map.phone", language)}</p>
              </div>
            </div>
            <MapView initialCenter={{ lat: 42.8765, lng: 74.5872 }} initialZoom={16} className="rounded-2xl shadow-xl" />
          </div>
        </section>
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Testimonials language={language} />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Contact language={language} handleWhatsAppClick={handleWhatsAppClick} />
      </Suspense>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container text-center">
          <p className="mb-2">© 2026 ChinaTop. {language === "ru" ? "Все права защищены." : "Бардык укуктар сакталган."}</p>
          <p className="text-gray-400">{language === "ru" ? "Доставка премиум товаров из Китая" : "Кытайдан премиум товарлар жеткирүү"}</p>
        </div>
      </footer>
    </div>
  );
}
