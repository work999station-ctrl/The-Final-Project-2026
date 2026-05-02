import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '../contexts/LanguageContext';

const LANGS = [
    { code: 'EN', label: 'English', short: 'EN', flag: '🇬🇧' },
    { code: 'FR', label: 'Français', short: 'FR', flag: '🇫🇷' },
    { code: 'AR', label: 'العربية', short: 'AR', flag: '🇩🇿' },
];

const LanguageSwitcher = ({ compact = false }) => {
    const { lang, setLang } = useLang();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    const current = LANGS.find(l => l.code === lang) || LANGS[0];

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`flex items-center gap-1.5 rounded-full transition-all ${
                    compact
                        ? 'h-9 px-3 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold'
                        : 'h-10 px-3.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-sm text-slate-700 dark:text-slate-200 font-semibold'
                }`}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="material-symbols-outlined text-base">language</span>
                <span className="tracking-wide">{current.short}</span>
                <span className={`material-symbols-outlined text-base transition-transform ${open ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            {open && (
                <div className="absolute end-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-pop-in">
                    <ul role="listbox" className="py-1">
                        {LANGS.map(l => (
                            <li key={l.code}>
                                <button
                                    onClick={() => { setLang(l.code); setOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors ${
                                        l.code === lang ? 'text-primary font-bold bg-primary/5' : 'text-slate-700 dark:text-slate-200 font-medium'
                                    }`}
                                    role="option"
                                    aria-selected={l.code === lang}
                                >
                                    <span className="text-lg leading-none">{l.flag}</span>
                                    <span className="flex-1 text-start">{l.label}</span>
                                    {l.code === lang && (
                                        <span className="material-symbols-outlined text-primary text-base">check</span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
