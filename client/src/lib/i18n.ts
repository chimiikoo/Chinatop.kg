import ru from "@/locales/ru.json";
import ky from "@/locales/ky.json";

export type Language = "ru" | "ky";

const translations = {
  ru,
  ky,
};

export function t(key: string, lang: Language): string {
  const keys = key.split(".");
  let value: any = translations[lang];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      // Fallback to Russian if key not found
      value = translations.ru;
      for (const fallbackKey of keys) {
        if (value && typeof value === "object" && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if not found
        }
      }
      return value;
    }
  }

  return typeof value === "string" ? value : key;
}

export function getLanguageName(lang: Language): string {
  return lang === "ru" ? "Русский" : "Кыргызча";
}
