import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@shared/i18n";

export function useTranslation() {
  const { language } = useLanguage();

  return (path: string, variables?: Record<string, string | number>) => {
    return t(language, path, variables);
  };
}
