import { Phone, MessageCircle, X } from "lucide-react";
import { t, type Language } from "@/lib/i18n";
import { managers } from "@/lib/data";

interface ManagerSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (managerPhone: string) => void;
    language: Language;
}

export function ManagerSelectionModal({ isOpen, onClose, onSelect, language }: ManagerSelectionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t("managers.select_title", language)}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t("managers.select_subtitle", language)}</p>

                <div className="grid grid-cols-1 gap-3">
                    {managers.map((manager, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                onSelect(manager.whatsapp);
                                onClose();
                            }}
                            className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all group"
                        >
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Phone className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900 dark:text-white">{t("managers.manager", language)} {index + 1}</p>
                                <p className="text-sm text-gray-500 font-mono">{manager.phone}</p>
                            </div>
                            <MessageCircle className="w-5 h-5 ml-auto text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
