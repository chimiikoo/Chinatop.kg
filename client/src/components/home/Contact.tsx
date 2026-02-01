import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t, type Language } from "@/lib/i18n";

interface ContactProps {
    language: Language;
    handleWhatsAppClick: () => void;
}

export function Contact({ language, handleWhatsAppClick }: ContactProps) {
    const [formData, setFormData] = useState({ name: "", phone: "", message: "" });

    const handleFeedbackSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const feedbackText = language === "ru" ? "Обратная связь от" : "Пикир";
        const phoneText = language === "ru" ? "Телефон" : "Телефон";
        const message = `${feedbackText} ${formData.name}: ${formData.message}. ${phoneText}: ${formData.phone}`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/996507120110?text=${encodedMessage}`, "_blank");
        setFormData({ name: "", phone: "", message: "" });
    };

    return (
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
    );
}
