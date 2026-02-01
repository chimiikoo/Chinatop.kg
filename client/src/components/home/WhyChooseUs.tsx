import { MapPin, Award, Zap, Users, Clock, Truck } from "lucide-react";
import { t, type Language } from "@/lib/i18n";

interface WhyChooseUsProps {
    language: Language;
}

export function WhyChooseUs({ language }: WhyChooseUsProps) {
    return (
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
    );
}
