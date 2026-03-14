import { MapPin, Phone, Clock, Instagram, Send } from "lucide-react";
import { t, type Language } from "@/lib/i18n";

interface FooterProps {
    language: Language;
    setSelectedCategory?: (id: string) => void;
    handleWhatsAppClick: (product?: any, managerPhone?: string, customMessage?: string) => void;
}

export function Footer({ language, setSelectedCategory, handleWhatsAppClick }: FooterProps) {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCategoryClick = (id: string) => {
        if (setSelectedCategory) {
            setSelectedCategory(id);
            setTimeout(() => {
                document.getElementById('popular-products')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <footer className="bg-[#0a0c10] text-gray-300 pt-20 pb-10 border-t border-white/5" role="contentinfo">
            <div className="container px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-3 group cursor-pointer" onClick={scrollToTop}>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-0.5 shadow-xl transition-transform group-hover:rotate-6">
                                <div className="w-full h-full bg-[#0a0c10] rounded-[0.9rem] flex items-center justify-center">
                                    <img src="/images/chinatop-logo.png" alt="ChinaTop Logo" className="w-8 h-8" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-poppins font-black text-white tracking-tighter">ChinaTop</h2>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                          {language === "ru" 
                            ? "Ведущий поставщик премиальных массажных кресел и профессионального спортивного оборудования в Кыргызстане. Прямые поставки из Китая." 
                            : "Кыргызстандагы премиалдык массаж креслолорунун жана профессионалдык спорттук жабдуулардын алдыңкы жеткирүүчүсү. Кытайдан түз жеткирүүлөр."}
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <a 
                                href="https://instagram.com/chinatop.kg" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Instagram"
                                className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-orange-600 hover:text-white transition-all transform hover:scale-110"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <button 
                                onClick={() => handleWhatsAppClick()}
                                aria-label="WhatsApp"
                                className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-green-600 hover:text-white transition-all transform hover:scale-110"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-widest text-xs">{language === "ru" ? "Навигация" : "Навигация"}</h3>
                        <ul className="space-y-4">
                            <li><a href="#products" className="text-gray-400 hover:text-orange-500 transition-colors py-1 inline-block">{t("nav.products", language)}</a></li>
                            <li><a href="#about" className="text-gray-400 hover:text-orange-500 transition-colors py-1 inline-block">{t("nav.about", language)}</a></li>
                            <li><a href="#location" className="text-gray-400 hover:text-orange-500 transition-colors py-1 inline-block">{t("nav.location", language)}</a></li>
                            <li><a href="#contact" className="text-gray-400 hover:text-orange-500 transition-colors py-1 inline-block">{t("nav.contacts", language)}</a></li>
                        </ul>
                    </nav>

                    {/* Service Categories */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-widest text-xs">{language === "ru" ? "Категории" : "Категориялар"}</h3>
                        <ul className="space-y-4">
                            <li>
                                <button onClick={() => handleCategoryClick("massage-chairs")} className="text-gray-400 hover:text-orange-500 transition-colors py-1">{t("categories.massage_chairs", language)}</button>
                            </li>
                            <li>
                                <button onClick={() => handleCategoryClick("sports-equipment")} className="text-gray-400 hover:text-orange-500 transition-colors py-1">{t("categories.sports_equipment", language)}</button>
                            </li>
                            <li>
                                <button onClick={() => handleCategoryClick("for-gyms")} className="text-gray-400 hover:text-orange-500 transition-colors py-1 font-bold text-orange-500/80">{t("categories.for_gyms", language)}</button>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information (SEO Rich) */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-widest text-xs">{language === "ru" ? "Контакты" : "Байланыш"}</h3>
                        <address className="not-italic space-y-5">
                            <div className="flex items-start justify-center md:justify-start gap-4">
                                <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-1" />
                                <span className="text-sm leading-relaxed text-gray-400">{t("map.address", language)}</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <Phone className="w-5 h-5 text-orange-600 shrink-0" />
                                <a href="tel:+996507120110" className="text-sm text-gray-400 hover:text-orange-500 transition-colors tracking-wide">{t("map.phone", language)}</a>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <Clock className="w-5 h-5 text-orange-600 shrink-0" />
                                <span className="text-sm text-gray-400">{t("map.working_hours", language)}</span>
                            </div>
                        </address>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[12px] text-gray-500 font-medium">
                        © 2026 ChinaTop Logistics Group. {language === "ru" ? "Все права защищены." : "Бардык укуктар сакталган."}
                    </p>
                    <div className="flex gap-8 text-[12px] text-gray-500">
                        <a href="#" className="hover:text-gray-300 underline underline-offset-4 decoration-white/10">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-300 underline underline-offset-4 decoration-white/10">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
