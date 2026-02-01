import { Star } from "lucide-react";
import { t, type Language } from "@/lib/i18n";

interface TestimonialsProps {
    language: Language;
}

export function Testimonials({ language }: TestimonialsProps) {
    return (
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
    );
}
