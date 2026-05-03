import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import AlgeriaFlag from './AlgeriaFlag';
import { useLang } from '../contexts/LanguageContext';

// ═══════════════════════════════════════════════════════════════════
// Premium animated footer for stage.io
// - Newsletter signup with animated input
// - Multi-column links with slide underline
// - Animated social icons with rotate
// - Gradient orb mesh background
// - Status indicator (live)
// - Scroll-to-top floating button
// - Language switcher
// ═══════════════════════════════════════════════════════════════════

const buildColumns = (t) => [
    {
        title: t('footer.columns.platform'),
        icon: 'rocket_launch',
        links: [
            { label: t('footer.links.forStudents'),     to: '/students' },
            { label: t('footer.links.forCompanies'),    to: '/companies' },
            { label: t('footer.links.forUniversities'), to: '/universities' },
            { label: t('footer.links.browseOffers'),    to: '/opportunities' },
        ],
    },
    {
        title: t('footer.columns.company'),
        icon: 'business_center',
        links: [
            { label: t('footer.links.aboutUs'), to: '/about-us' },
            { label: t('footer.links.careers'), to: '/careers', badge: t('footer.hiring') },
            { label: t('footer.links.blog'),    to: '/blog' },
            { label: t('footer.links.contact'), to: '/contact-us' },
        ],
    },
    {
        title: t('footer.columns.legal'),
        icon: 'gavel',
        links: [
            { label: t('footer.links.privacy'),  to: '/privacy-policy' },
            { label: t('footer.links.terms'),    to: '/terms-of-service' },
            { label: t('footer.links.cookies'),  to: '/cookie-policy' },
            { label: t('footer.links.security'), to: '/privacy-policy' },
        ],
    },
];

const SOCIAL_LINKS = [
    { label: 'Twitter',  icon: 'alternate_email', href: '#', color: 'hover:bg-sky-500' },
    { label: 'LinkedIn', icon: 'work',            href: '#', color: 'hover:bg-blue-600' },
    { label: 'GitHub',   icon: 'code',            href: '#', color: 'hover:bg-slate-700' },
    { label: 'YouTube',  icon: 'play_arrow',      href: '#', color: 'hover:bg-red-600' },
    { label: 'Email',    icon: 'mail',            href: '#', color: 'hover:bg-primary' },
];

const Footer = () => {
    const { lang, setLang, t, isRTL } = useLang();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showTop, setShowTop] = useState(false);
    const FOOTER_COLUMNS = buildColumns(t);

    useEffect(() => {
        const fn = () => setShowTop(window.scrollY > 600);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email) return;
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 4000);
        }, 900);
    };

    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer className="footer-root relative overflow-hidden bg-slate-950 text-slate-300">
            {/* ── Top wave divider ───────────────────────────────────────────── */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-40" />
            <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent blur-sm" />

            {/* ── Background orbs (aurora) ───────────────────────────────────── */}
            <div className="pointer-events-none absolute inset-0 -z-0 opacity-50">
                <div className="aurora-blob absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
                <div className="aurora-blob aurora-blob-2 absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[120px]" />
                <div className="aurora-blob aurora-blob-3 absolute -bottom-20 left-0 w-[350px] h-[350px] rounded-full bg-cyan-400/8 blur-[100px]" />
            </div>

            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgb(99 102 241) 1px, transparent 1px), linear-gradient(to right, rgb(99 102 241) 1px, transparent 1px)',
                    backgroundSize: '64px 64px'
                }} />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-8">

                {/* ── Newsletter Card ───────────────────────────────────────── */}
                <div className="relative mb-20">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-violet-500 to-cyan-400 rounded-3xl blur-xl opacity-30" />
                    <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/95 to-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-8 md:p-12 overflow-hidden">

                        {/* Decorative blob */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

                        <div className="relative grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 px-3 py-1 rounded-full text-primary-light text-[10px] font-bold uppercase tracking-widest mb-4">
                                    <span className="size-1.5 rounded-full bg-primary glow-pulse" />
                                    {t('footer.newsletter.badge')}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                                    {t('footer.newsletter.title')}
                                </h3>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                                    {t('footer.newsletter.subtitle')}
                                </p>
                            </div>

                            <form onSubmit={handleSubscribe} className="relative">
                                {!subscribed ? (
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-violet-500 to-cyan-400 rounded-2xl opacity-0 group-focus-within:opacity-60 blur transition-opacity duration-300" />
                                        <div className="relative flex flex-col sm:flex-row gap-2 p-1.5 bg-slate-900/90 border border-white/10 rounded-2xl backdrop-blur-sm">
                                            <div className="relative flex-1 flex items-center">
                                                <span className="material-symbols-outlined text-slate-500 text-xl absolute left-4">mail</span>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    placeholder={t('footer.newsletter.placeholder')}
                                                    required
                                                    className={`w-full h-12 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} bg-transparent text-white placeholder:text-slate-500 outline-none text-sm font-medium`}
                                                    style={isRTL ? { direction: 'rtl' } : undefined}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="h-12 px-6 bg-gradient-to-r from-primary to-violet-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-70 disabled:cursor-wait min-w-[130px]"
                                            >
                                                {submitting ? (
                                                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        {t('footer.newsletter.submit')}
                                                        <span className={`material-symbols-outlined text-base ${isRTL ? 'rotate-180' : ''}`}>send</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 font-semibold text-sm animate-[stagger-in_0.5s_ease-out_forwards]">
                                        <span className="material-symbols-outlined text-2xl"
                                            style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        {t('footer.newsletter.success')}
                                    </div>
                                )}
                                <p className="mt-3 text-xs text-slate-500 px-1">
                                    {t('footer.newsletter.privacy')}{' '}
                                    <Link to="/privacy-policy" className="text-slate-400 hover:text-white transition-colors underline">
                                        {t('footer.newsletter.privacyLink')}
                                    </Link>.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>

                {/* ── Main grid ─────────────────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-12 gap-10 mb-16">

                    {/* Brand column */}
                    <div className="col-span-2 md:col-span-4">
                        <div className="[&_.logo-wordmark]:!text-white mb-6">
                            <Logo size={38} />
                        </div>
                        <p className="text-sm leading-relaxed mb-6 max-w-sm text-slate-400">
                            {t('footer.description')}
                        </p>

                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {[
                                { label: 'SOC 2', icon: 'verified_user' },
                                { label: 'GDPR',  icon: 'shield' },
                                { label: '99.9% uptime', icon: 'cloud_done' },
                            ].map(b => (
                                <div key={b.label}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] border border-white/10 rounded-full text-[10px] font-bold text-slate-400 hover:text-white hover:border-primary/40 transition-all">
                                    <span className="material-symbols-outlined text-xs text-emerald-400">{b.icon}</span>
                                    {b.label}
                                </div>
                            ))}
                        </div>

                        {/* Social icons */}
                        <div className="flex flex-wrap gap-2">
                            {SOCIAL_LINKS.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className={`social-icon group w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 ${s.color} flex items-center justify-center text-slate-400 hover:text-white hover:border-transparent hover:-translate-y-1 hover:rotate-[-8deg] transition-all duration-300`}
                                >
                                    <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform">
                                        {s.icon}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {FOOTER_COLUMNS.map(col => (
                        <div key={col.title} className="col-span-1 md:col-span-2 lg:col-span-2">
                            <h6 className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest mb-5">
                                <span className="material-symbols-outlined text-sm text-primary">{col.icon}</span>
                                {col.title}
                            </h6>
                            <ul className="space-y-3">
                                {col.links.map(l => (
                                    <li key={l.label}>
                                        <Link
                                            to={l.to}
                                            className="footer-link group inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                                        >
                                            <span className="footer-link-arrow w-0 overflow-hidden inline-flex transition-all duration-300 group-hover:w-4">
                                                <span className="material-symbols-outlined text-xs text-primary">arrow_forward</span>
                                            </span>
                                            <span className="group-hover:translate-x-0 transition-transform">
                                                {l.label}
                                            </span>
                                            {l.badge && (
                                                <span className="ml-1 px-1.5 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase tracking-wider rounded-full glow-pulse">
                                                    {l.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* App downloads / contact column */}
                    <div className="col-span-2 md:col-span-2 lg:col-span-2">
                        <h6 className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest mb-5">
                            <span className="material-symbols-outlined text-sm text-primary">download</span>
                            {t('footer.columns.getApp')}
                        </h6>
                        <div className="flex flex-col gap-2">
                            {[
                                { label: 'App Store',    sub: 'iOS',     icon: 'apple' },
                                { label: 'Google Play',  sub: 'Android', icon: 'android' },
                            ].map(app => (
                                <a
                                    key={app.label}
                                    href="#"
                                    className="group flex items-center gap-3 px-3 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-primary/40 rounded-xl transition-all hover:-translate-y-0.5"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-white text-base">smartphone</span>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">{app.sub}</div>
                                        <div className="text-xs font-bold text-white">{app.label}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Divider with gradient line ────────────────────────────── */}
                <div className="relative h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                {/* ── Bottom bar ────────────────────────────────────────────── */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    {/* Left: copyright + status */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                        <p className="text-xs text-slate-500">
                            © 2026 <span className="text-slate-300 font-semibold">stage.io Inc.</span> {t('footer.copyright')}
                        </p>

                        {/* Status indicator */}
                        <a href="#" className="group inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 rounded-full transition-all">
                            <span className="relative flex size-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full size-2 bg-emerald-400" />
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-400">{t('footer.status')}</span>
                        </a>
                    </div>

                    {/* Right: lang switcher + made with */}
                    <div className="flex items-center gap-4">
                        {/* Language switcher */}
                        <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-full p-0.5">
                            {['EN', 'FR', 'AR'].map(code => (
                                <button
                                    key={code}
                                    onClick={() => setLang(code)}
                                    className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all ${
                                        lang === code
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {code}
                                </button>
                            ))}
                        </div>

                        <div className="text-[11px] text-slate-400 flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-full hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group cursor-default">
                            <span>{t('footer.madeWith')}</span>
                            <span className="material-symbols-outlined text-sm text-red-400 group-hover:scale-125 transition-transform"
                                style={{
                                    fontVariationSettings: "'FILL' 1",
                                    animation: 'heart-beat 1.5s ease-in-out infinite'
                                }}>favorite</span>
                            <span>{t('footer.inAlgeria')}</span>
                            <AlgeriaFlag size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Scroll-to-top floating button ──────────────────────────────── */}
            <button
                onClick={scrollTop}
                aria-label="Back to top"
                className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-violet-600 text-white shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 hover:shadow-primary/60 active:scale-95 transition-all duration-300 ${
                    showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
                }`}
            >
                <span className="material-symbols-outlined">arrow_upward</span>
                <span className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-75" />
            </button>

            <style>{`
                @keyframes stagger-in {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes heart-beat {
                    0%, 100% { transform: scale(1); }
                    25%      { transform: scale(1.2); }
                    50%      { transform: scale(0.95); }
                    75%      { transform: scale(1.15); }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
