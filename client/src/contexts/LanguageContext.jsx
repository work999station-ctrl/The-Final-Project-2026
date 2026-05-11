import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

// Intl locale codes per language
const LOCALE = { AR: 'ar-DZ', EN: 'en-US', FR: 'fr-FR' };

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

    // ── t(path, vars?, fallback?) ────────────────────────────────────────────
    // vars  : optional plain object — its values replace {{key}} tokens.
    // fallback: optional string — returned when the key is missing entirely.
    // Backward-compat: if vars is a string it is treated as fallback (old API).
    // lang is the ONLY useCallback dependency; vars/fallback are runtime params.
    const t = useCallback((path, vars, fallback) => {
        // Backward-compat shim
        let _vars     = vars;
        let _fallback = fallback;
        if (typeof vars === 'string') {
            _vars     = undefined;
            _fallback = vars;
        }

        const dict  = translations[lang] || translations.EN;
        let   value = path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), dict);

        // Key not found in current lang → try EN
        if (value == null) {
            value = path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), translations.EN);
        }

        const result = value != null ? value : (_fallback ?? path);

        // Replace {{key}} tokens with vars values
        if (_vars && typeof _vars === 'object' && typeof result === 'string') {
            return result.replace(/\{\{(\w+)\}\}/g, (_, key) =>
                _vars[key] != null ? String(_vars[key]) : `{{${key}}}`
            );
        }
        return result;
    }, [lang]);

    // ── formatNumber(n) ──────────────────────────────────────────────────────
    const formatNumber = useCallback((n) => {
        const locale = LOCALE[lang] || 'en-US';
        return new Intl.NumberFormat(locale).format(n);
    }, [lang]);

    // ── formatDate(d, opts?) ─────────────────────────────────────────────────
    // d can be a Date, ISO string, or timestamp.
    // opts defaults to { year: 'numeric', month: 'long', day: 'numeric' }.
    const formatDate = useCallback((d, opts) => {
        const locale     = LOCALE[lang] || 'en-US';
        const defaultOpts = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat(locale, opts ?? defaultOpts).format(new Date(d));
    }, [lang]);

    // ── formatCurrency(amount) ───────────────────────────────────────────────
    // Uses DZD (Algerian Dinar) in both locales per project spec.
    const formatCurrency = useCallback((amount) => {
        const locale = LOCALE[lang] || 'en-US';
        return new Intl.NumberFormat(locale, {
            style               : 'currency',
            currency            : 'DZD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    }, [lang]);

    // ── pluralize(path, count) ───────────────────────────────────────────────
    // path  : dot-path to a translations object with keys zero|one|two|few|many|other.
    // count : the number to pluralize.
    // The matched template string may contain {{count}} which is replaced with
    // formatNumber(count) so Arabic numerals are used automatically in AR locale.
    const pluralize = useCallback((path, count) => {
        const locale = LOCALE[lang] || 'en-US';
        const form   = new Intl.PluralRules(locale).select(count);

        const dict    = translations[lang] || translations.EN;
        const enDict  = translations.EN;

        const forms =
            path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), dict) ??
            path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), enDict);

        if (!forms || typeof forms !== 'object') return String(count);

        const template = forms[form] ?? forms.other ?? String(count);

        // Format the number with the current locale so AR shows ٥ not 5
        const formattedCount = new Intl.NumberFormat(LOCALE[lang] || 'en-US').format(count);
        return template.replace(/\{\{count\}\}/g, formattedCount);
    }, [lang]);

    const isRTL = lang === 'AR';

    return (
        <LanguageContext.Provider value={{
            lang,
            setLang,
            t,
            isRTL,
            formatNumber,
            formatDate,
            formatCurrency,
            pluralize,
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLang = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
    return ctx;
};
