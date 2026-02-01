import { t, type Language } from "@/lib/i18n";

interface AboutProps {
    language: Language;
}

export function About({ language }: AboutProps) {
    return (
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
    );
}
