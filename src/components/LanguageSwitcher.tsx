import { useI18n } from "../contexts/I18nContext";
import { languages, type Language } from "../i18n";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();

  const handleLanguageChange = (langCode: Language) => {
    console.log("Changing language to:", langCode);
    setLanguage(langCode);
  };

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
            language === lang.code
              ? "ring-2 ring-offset-2"
              : "hover:ring-1 hover:ring-offset-1"
          }`}
          style={{
            backgroundColor:
              language === lang.code ? "var(--primary)" : "var(--card-bg)",
            color: language === lang.code ? "#ffffff" : "var(--text-secondary)",
            border:
              language === lang.code ? "none" : "1px solid var(--border-color)",
            boxShadow:
              language === lang.code
                ? "0 4px 12px rgba(26, 25, 83, 0.3)"
                : "none",
          }}
          title={lang.name}
        >
          <span className="font-medium">{lang.name}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
