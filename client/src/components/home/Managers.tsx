import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t, type Language } from "@/lib/i18n";
import { managers } from "@/lib/data";

interface ManagersProps {
    language: Language;
}

export function Managers({ language }: ManagersProps) {
    return (
        <section id="managers" className="py-20 bg-orange-50/30 dark:bg-gray-900/30">
            <div className="container px-4">
                <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center text-gray-900 dark:text-white mb-4">
                    {t("managers.title", language)}
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                    {t("managers.subtitle", language)}
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {managers.map((manager, index) => (
                        <div key={index} className="glass p-3 md:p-6 rounded-2xl flex flex-col items-center text-center hover-scale border border-orange-100 dark:border-gray-800">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                                <Phone className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
                            </div>
                            <h3 className="text-sm md:text-xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
                                {t("managers.manager", language)} {index + 1}
                            </h3>
                            <p className="text-orange-600 text-[10px] md:text-base font-medium mb-4 md:mb-6 font-mono">{manager.phone}</p>

                            <div className="flex flex-col gap-2 w-full mt-auto">
                                <Button
                                    variant="outline"
                                    className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 h-8 md:h-10 text-[10px] md:text-sm"
                                    onClick={() => window.open(`https://wa.me/${manager.whatsapp}`, "_blank")}
                                >
                                    <MessageCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                    WhatsApp
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full text-gray-600 hover:text-orange-600 h-8 md:h-10 text-[10px] md:text-sm"
                                    onClick={() => window.location.href = `tel:${manager.phone.replace(/\s/g, "")}`}
                                >
                                    {t("managers.call", language)}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
