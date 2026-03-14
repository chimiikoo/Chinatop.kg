import { MapPin, Clock, Phone, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useState, useEffect, Suspense, lazy } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";
import { useProducts } from "@/hooks/useProducts";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { ManagerSelectionModal } from "@/components/home/ManagerSelectionModal";
import { Footer } from "@/components/layout/Footer";

// Lazy load heavy components
const WhyChooseUs = lazy(() => import("@/components/home/WhyChooseUs").then(module => ({ default: module.WhyChooseUs })));
const Categories = lazy(() => import("@/components/home/Categories").then(module => ({ default: module.Categories })));
const PopularProducts = lazy(() => import("@/components/home/PopularProducts").then(module => ({ default: module.PopularProducts })));
const About = lazy(() => import("@/components/home/About").then(module => ({ default: module.About })));
const Testimonials = lazy(() => import("@/components/home/Testimonials").then(module => ({ default: module.Testimonials })));
const Contact = lazy(() => import("@/components/home/Contact").then(module => ({ default: module.Contact })));
const Managers = lazy(() => import("@/components/home/Managers").then(module => ({ default: module.Managers })));
const ProductDetail = lazy(() => import("@/components/home/ProductDetail").then(module => ({ default: module.ProductDetail })));
const MapView = lazy(() => import("@/components/Map").then(module => ({ default: module.MapView })));
const Instagram = lazy(() => import("@/components/home/Instagram").then(module => ({ default: module.Instagram })));

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
  const [managerSelectState, setManagerSelectState] = useState<{ isOpen: boolean; product?: any; message?: string }>({ isOpen: false });

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWhatsAppClick = (product?: any, managerPhone?: string, customMessage?: string) => {
    if (managerPhone) {
      let message = customMessage || (language === "ru" ? "Привет! Я интересуюсь вашими товарами." : "Салам! Мен сиздин товарларыңызга кызыгып жатам.");
      if (product && !customMessage) {
        const productName = (language === "ru" ? product.name_ru : product.name_ky) || (product.nameKey ? t(product.nameKey, language) : product.name || "");
        message = language === "ru"
          ? `Привет! Я интересуюсь товаром: "${productName}" (${product.price} сом). Можете ли вы предоставить подробную информацию?`
          : `Ассалому алейкум! Мен бул товарга кызыгып жатам: "${productName}" (${product.price} сом). Сиз толук маалыматты бере аласызбы?`;
      }
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${managerPhone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`, "_blank");
    } else {
      setManagerSelectState({ isOpen: true, product, message: customMessage });
    }
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
              <p className="text-[10px] md:text-xs text-orange-600 leading-tight">Премиум логистика</p>
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
          <div className="container px-4">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center text-gray-900 mb-4">{t("map.title", language)}</h2>
            <p className="text-center text-gray-600 mb-12">{t("map.subtitle", language)}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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

      <Suspense fallback={<SectionLoader />}>
        <Managers language={language} />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Instagram language={language} />
      </Suspense>

      {/* New Direction Promo Section */}
      <section className="py-24 bg-[#0a0c10] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-600/10 to-transparent pointer-events-none" />
        <div className="container px-4 relative z-10">
          <div className="glass p-12 md:p-20 rounded-[3rem] border-white/5 flex flex-col lg:flex-row items-center gap-12 md:gap-20">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-600/20">
                <Activity className="w-3 h-3" />
                New Direction
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9]">
                {t("about.new_direction_title", language)}
              </h2>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {language === "ru"
                  ? "ChinaTop официально открывает направление поставок для профессиональных спортивных залов и магазинов. Прямые контракты с заводами, оптовые цены и полное оснащение 'под ключ'."
                  : "ChinaTop спорттук залдар жана дүкөндөр үчүн профессионалдык жабдууларды жеткирүү багытын расмий түрдө ачат. Заводдор менен түз келишимдер, дүң баалар жана толук жабдуу."}
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Button
                  onClick={() => {
                    setSelectedCategory("for-gyms");
                    setTimeout(() => document.getElementById('popular-products')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className="h-14 px-10 rounded-2xl bg-white text-black font-black hover:bg-orange-600 hover:text-white transition-all shadow-2xl"
                >
                  {t("categories.view_products", language)}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleWhatsAppClick()}
                  className="h-14 px-10 rounded-2xl border-white/10 text-white font-black hover:bg-white/5"
                >
                  {language === "ru" ? "Сотрудничество" : "Кызматташуу"}
                </Button>
              </div>
            </div>
            <div className="lg:w-1/3 relative shrink-0">
               <div className="absolute inset-0 bg-orange-600 blur-[100px] opacity-20 animate-pulse" />
               <img src="/images/begovoi (1).png" alt="Gym Equipment" className="w-full h-auto relative z-10 drop-shadow-[0_20px_50px_rgba(234,88,12,0.3)] transform lg:-rotate-6" />
            </div>
          </div>
        </div>
      </section>

      <ManagerSelectionModal
        isOpen={managerSelectState.isOpen}
        language={language}
        onClose={() => setManagerSelectState({ isOpen: false })}
        onSelect={(phone) => handleWhatsAppClick(managerSelectState.product, phone, managerSelectState.message)}
      />

      <Footer 
        language={language} 
        setSelectedCategory={setSelectedCategory} 
        handleWhatsAppClick={handleWhatsAppClick} 
      />
    </div>
  );
}
