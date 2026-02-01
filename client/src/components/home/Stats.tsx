
import { t, type Language } from "@/lib/i18n";

interface StatsProps {
    language: Language;
}

export function Stats({ language }: StatsProps) {
    return (
        <div className="container">
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
        </div>
    );
}
