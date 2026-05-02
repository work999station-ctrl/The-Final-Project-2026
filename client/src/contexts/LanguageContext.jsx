import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
    const [lang, setLangState] = useState(() => localStorage.getItem('lang') || 'EN');

    // Apply dir + lang on <html>
    useEffect(() => {
        const html = document.documentElement;
        html.lang = lang.toLowerCase();
        html.dir = lang === 'AR' ? 'rtl' : 'ltr';
        localStorage.setItem('lang', lang);
    }, [lang]);

    const setLang = (next) => setLangState(next);

    const t = useCallback((path, fallback = '') => {
        const dict = translations[lang] || translations.EN;
        const value = path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), dict);
        if (value != null) return value;
        // Fallback to EN
        const en = path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), translations.EN);
        return en != null ? en : fallback || path;
    }, [lang]);

    const isRTL = lang === 'AR';

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLang = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
    return ctx;
};
