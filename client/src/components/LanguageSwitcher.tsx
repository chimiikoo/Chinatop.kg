import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 md:gap-2">
      <Button
        variant={language === "ru" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("ru")}
        className="min-w-[45px] md:min-w-[60px] h-8 md:h-9 text-[10px] md:text-xs px-2 transition-all duration-300"
      >
        РУ
      </Button>
      <Button
        variant={language === "ky" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("ky")}
        className="min-w-[45px] md:min-w-[60px] h-8 md:h-9 text-[10px] md:text-xs px-2 transition-all duration-300"
      >
        КЫ
      </Button>
    </div>
  );
}
