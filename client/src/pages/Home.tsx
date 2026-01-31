import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { MapPin, Phone, Clock, Truck, Award, Zap, Users, ChevronDown, Star, ArrowRight, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { MapView } from "@/components/Map";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";

/**
 * ChinaTop Modern Premium Design
 * - Glassmorphism effects with blur and transparency
 * - Dynamic animations and smooth transitions
 * - Glow effects and modern gradients
 * - Google Maps integration for branch location
 * - Product gallery with detailed pages
 * - Feedback form with pricing
 * - Mobile-first responsive design
 * - Multilingual support (Russian & Kyrgyz)
 */

// Product data structure
const productCategories = [
  {
    id: "sports-equipment",
    nameKey: "categories.sports_equipment",
    descriptionKey: "categories.sports_equipment_desc",
    image: "/images/treadmills-category.jpg",
    products: [
      {
        id: 1,
        nameKey: "products.treadmill_1",
        price: 25000,
        rating: 4.8,
        reviews: 42,
        descriptionKey: "products.treadmill_1_desc",
        featuresKeys: ["product_detail.warranty"],
        image: "/images/Chasall 25 000.png",
      },
      {
        id: 2,
        nameKey: "products.treadmill_2",
        price: 55000,
        rating: 4.9,
        reviews: 35,
        descriptionKey: "products.treadmill_2_desc",
        featuresKeys: ["product_detail.warranty"],
        image: "/images/Chasall 55 000.png",
      },
      {
        id: 3,
        nameKey: "products.treadmill_3",
        price: 70000,
        rating: 4.7,
        reviews: 28,
        descriptionKey: "products.treadmill_3_desc",
        featuresKeys: ["product_detail.warranty"],
        image: "/images/Chasall 70 000.png",
      },
      {
        id: 4,
        nameKey: "products.treadmill_4",
        price: 130000,
        rating: 5.0,
        reviews: 15,
        descriptionKey: "products.treadmill_4_desc",
        featuresKeys: ["product_detail.warranty"],
        image: "/images/Chasall 130 000.png",
      },
      {
        id: 5,
        nameKey: "products.treadmill_5",
        price: 75000,
        rating: 4.8,
        reviews: 22,
        descriptionKey: "products.treadmill_5_desc",
        featuresKeys: ["product_detail.warranty"],
        image: "/images/Chasall 75 000.png",
      },
      {
        id: 6,
        nameKey: "products.treadmill_6",
        price: 35000,
        rating: 4.6,
        reviews: 31,
        descriptionKey: "products.treadmill_6_desc",
        featuresKeys: ["product_detail.warranty"],
        image: "/images/Chasall 35 000.png",
      },
    ],
  },
  {
    id: "massage-chairs",
    nameKey: "categories.massage_chairs",
    descriptionKey: "categories.massage_chairs_desc",
    image: "/images/massage-chairs-category.jpg",
    products: [
      {
        id: 7,
        nameKey: "products.chair_1",
        price: 95000,
        rating: 4.7,
        reviews: 18,
        descriptionKey: "products.chair_1_desc",
        featuresKeys: ["product_detail.warranty"],
        image: "/images/Relax mini 95 000.png",
      },
      {
        id: 8,
        nameKey: "products.chair_2",
        price: 90000,
        rating: 4.9,
        reviews: 24,
        descriptionKey: "products.chair_2_desc",
        featuresKeys: ["product_detail.warranty"],
        image: "/images/COMFORT FU JU LUX 90 000.png",
      },
      {
        id: 9,
        nameKey: "products.chair_3",
        price: 142000,
        rating: 4.8,
        reviews: 12,
        descriptionKey: "products.chair_3_desc",
        featuresKeys: ["product_detail.warranty"],
        image: "/images/FAMILY LUX RK008 142 000.png",
      },
      {
        id: 10,
        nameKey: "products.chair_4",
        price: 172000,
        rating: 5.0,
        reviews: 9,
        descriptionKey: "products.chair_4_desc",
        featuresKeys: ["product_detail.warranty"],
        image: "/images/BUSINESS CLASS Z201 172 000.png",
      },
      {
        id: 11,
        nameKey: "products.chair_5",
        price: 152000,
        rating: 4.9,
        reviews: 14,
        descriptionKey: "products.chair_5_desc",
        featuresKeys: ["product_detail.warranty"],
        image: "/images/MASTER Z100 152 000.png",
      },
      {
        id: 12,
        nameKey: "products.chair_6",
        price: 185000,
        rating: 5.0,
        reviews: 7,
        descriptionKey: "products.chair_6_desc",
        featuresKeys: ["product_detail.warranty"],
        image: "/images/PREMIUM MAX 780  185 000.png",
      },
    ],
  },
];

export default function Home() {
  const { language } = useLanguage();
  const [isSticky, setIsSticky] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = selectedCategory
    ? productCategories
      .find((c) => c.id === selectedCategory)
      ?.products.filter((p) => {
        const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
        const productName = t(p.nameKey, language).toLowerCase();
        const productDesc = t(p.descriptionKey, language).toLowerCase();
        const matchesSearch = productName.includes(searchQuery.toLowerCase()) || productDesc.includes(searchQuery.toLowerCase());
        return matchesPrice && matchesSearch;
      })
    : [];

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

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feedbackText = language === "ru" ? "Обратная связь от" : "Пикир";
    const phoneText = language === "ru" ? "Телефон" : "Телефон";
    const message = `${feedbackText} ${formData.name}: ${formData.message}. ${phoneText}: ${formData.phone}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/996507120110?text=${encodedMessage}`, "_blank");
    setFormData({ name: "", phone: "", message: "" });
    setShowFeedbackForm(false);
  };


  // Show product detail view
  if (selectedProduct) {
    const product = selectedProduct;
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

      {/* Hero Section */}
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
            <img src="/images/massage-chairs-category.jpg" alt="Hero" className="w-full h-96 object-cover rounded-3xl shadow-2xl" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-20">
          {[
            { value: "5000+", label: t("stats.customers", language) },
            { value: "22K", label: t("stats.followers", language) },
            { value: "4+", label: t("stats.experience", language) },
          ].map((stat, i) => (
            <div key={i} className="glass p-4 sm:p-6 rounded-xl text-center hover-scale transition-all">
              <p className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white/50 backdrop-blur-md py-20">
        <div className="container">
          <h2 className="text-4xl font-poppins font-bold text-center text-gray-900 mb-4">{t("why_choose.title", language)}</h2>
          <p className="text-center text-gray-600 mb-12">{t("why_choose.subtitle", language)}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, titleKey: "why_choose.free_delivery", descKey: "why_choose.free_delivery_desc" },
              { icon: Award, titleKey: "why_choose.warranty", descKey: "why_choose.warranty_desc" },
              { icon: MapPin, titleKey: "why_choose.official_salon", descKey: "why_choose.official_salon_desc" },
              { icon: Zap, titleKey: "why_choose.prices", descKey: "why_choose.prices_desc" },
              { icon: Users, titleKey: "why_choose.consultation", descKey: "why_choose.consultation_desc" },
              { icon: Clock, titleKey: "why_choose.support", descKey: "why_choose.support_desc" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="glass p-6 rounded-xl hover-scale transition-all">
                  <Icon className="w-10 h-10 text-orange-600 mb-4" />
                  <h3 className="font-poppins font-bold text-gray-900 mb-2">{t(item.titleKey, language)}</h3>
                  <p className="text-gray-600 text-sm">{t(item.descKey, language)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="products" className="container py-20">
        <h2 className="text-4xl font-poppins font-bold text-center text-gray-900 mb-4">{t("categories.title", language)}</h2>
        <p className="text-center text-gray-600 mb-12">{t("categories.subtitle", language)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {productCategories.map((category) => (
            <div key={category.id} className="group glass p-6 sm:p-8 rounded-2xl hover-scale transition-all cursor-pointer" onClick={() => {
              setSelectedCategory(category.id);
              setTimeout(() => {
                document.getElementById('popular-products')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}>
              <img src={category.image} alt={t(category.nameKey, language)} className="w-full h-48 sm:h-64 object-cover rounded-xl mb-6 group-hover:shadow-xl transition-shadow" />
              <h3 className="text-xl sm:text-2xl font-poppins font-bold text-gray-900 dark:text-white mb-2">{t(category.nameKey, language)}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">{t(category.descriptionKey, language)}</p>
              <Button className="gradient-orange text-white w-full rounded-lg hover-scale">
                {t("categories.view_products", language)}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      {selectedCategory && (
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
      )}

      {/* About Section */}
      <section id="about" className="container py-20">
        <div className="glass p-12 rounded-2xl">
          <h2 className="text-4xl font-poppins font-bold text-gray-900 mb-6">{t("about.title", language)}</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>{t("about.description", language)}</p>
            <p>{t("about.mission", language)}</p>
            <p>{t("about.history", language)}</p>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-12">
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">5000+</p>
              <p className="text-gray-600">{t("about.stats_customers", language)}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">22K</p>
              <p className="text-gray-600">{t("about.stats_followers", language)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="location" className="bg-white/50 backdrop-blur-md py-20">
        <div className="container">
          <h2 className="text-4xl font-poppins font-bold text-center text-gray-900 mb-4">{t("map.title", language)}</h2>
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

      {/* Testimonials */}
      <section className="container py-20">
        <h2 className="text-4xl font-poppins font-bold text-center text-gray-900 mb-4">{t("testimonials.title", language)}</h2>
        <p className="text-center text-gray-600 mb-12">{t("testimonials.subtitle", language)}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { textKey: "testimonials.testimonial_1", authorKey: "testimonials.author_1" },
            { textKey: "testimonials.testimonial_2", authorKey: "testimonials.author_2" },
            { textKey: "testimonials.testimonial_3", authorKey: "testimonials.author_3" },
          ].map((item, i) => (
            <div key={i} className="glass p-6 rounded-xl">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{t(item.textKey, language)}"</p>
              <p className="font-poppins font-bold text-gray-900">{t(item.authorKey, language)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white/50 backdrop-blur-md py-20">
        <div className="container">
          <h2 className="text-4xl font-poppins font-bold text-center text-gray-900 mb-4">{t("contact.title", language)}</h2>
          <p className="text-center text-gray-600 mb-12">{t("contact.subtitle", language)}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Quick Contact */}
            <div className="glass p-8 rounded-xl">
              <h3 className="text-2xl font-poppins font-bold text-gray-900 mb-4">{t("contact.quick_contact", language)}</h3>
              <p className="text-gray-600 mb-6">{t("contact.quick_contact_desc", language)}</p>
              <Button onClick={() => handleWhatsAppClick()} className="gradient-orange text-white w-full rounded-lg hover-scale py-6">
                <MessageCircle className="w-5 h-5 mr-2" />
                {t("contact.write_whatsapp", language)}
              </Button>
            </div>

            {/* Feedback Form */}
            <div className="glass p-8 rounded-xl">
              <h3 className="text-2xl font-poppins font-bold text-gray-900 mb-6">{t("contact.feedback_form", language)}</h3>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder={t("contact.name", language)}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <input
                  type="tel"
                  placeholder={t("contact.phone", language)}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <textarea
                  placeholder={t("contact.message", language)}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24"
                  required
                ></textarea>
                <Button type="submit" className="gradient-orange text-white w-full rounded-lg hover-scale py-3">
                  {t("contact.send", language)}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

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
