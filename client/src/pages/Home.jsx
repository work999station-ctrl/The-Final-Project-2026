import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import logoImage from '../assets/logo.png';
import Footer from '../components/Footer';
import { useLang } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

// ─── Scroll progress bar ──────────────────────────────────────────────────────
const ScrollProgress = () => {
    const [scale, setScale] = useState(0);
    useEffect(() => {
        const fn = () => {
            const h = document.documentElement;
            const pct = h.scrollTop / (h.scrollHeight - h.clientHeight) || 0;
            setScale(pct);
        };
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);
    return <div className="scroll-progress" style={{ transform: `scaleX(${scale})`, width: '100%' }} />;
};

// ─── Mouse-tilt 3D card ───────────────────────────────────────────────────────
const TiltCard = ({ children, max = 8, className = '', innerClassName = '' }) => {
    const ref = useRef(null);
    const handleMove = useCallback((e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(1200px) rotateX(${-y * max}deg) rotateY(${x * max}deg) scale(1.02)`;
    }, [max]);
    const handleLeave = () => {
        if (ref.current) ref.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';
    };
    return (
        <div ref={ref} className={`tilt-card ${className}`} onMouseMove={handleMove} onMouseLeave={handleLeave}>
            <div className={`tilt-card-inner ${innerClassName}`}>{children}</div>
        </div>
    );
};

// ─── Magnetic button ──────────────────────────────────────────────────────────
const MagneticBtn = ({ children, className = '', strength = 0.3, ...props }) => {
    const ref = useRef(null);
    const handleMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const handleLeave = () => { if (ref.current) ref.current.style.transform = 'translate(0, 0)'; };
    return (
        <button ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
            className={`magnetic-btn ${className}`} {...props}>
            {children}
        </button>
    );
};

// ─── Spotlight card (cursor-follow gradient) ──────────────────────────────────
const SpotlightCard = ({ children, className = '' }) => {
    const ref = useRef(null);
    const handleMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };
    return (
        <div ref={ref} onMouseMove={handleMove} className={`spotlight ${className}`}>
            {children}
        </div>
    );
};

// ─── Floating particles background ────────────────────────────────────────────
const Particles = ({ count = 14 }) => {
    const particles = Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 12 + Math.random() * 12,
        size: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.4,
    }));
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map(p => (
                <span key={p.id} className="particle" style={{
                    left: `${p.left}%`,
                    bottom: '-10px',
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    animationDuration: `${p.duration}s`,
                    animationDelay: `${p.delay}s`,
                    opacity: p.opacity,
                }} />
            ))}
        </div>
    );
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

const useScrollY = () => {
    const [y, setY] = useState(0);
    useEffect(() => {
        const fn = () => setY(window.scrollY);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);
    return y;
};

const useInView = (threshold = 0.12) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, inView];
};

const useCounter = (target, duration = 2200) => {
    const [value, setValue] = useState(0);
    const [started, setStarted] = useState(false);
    const [ref, inView] = useInView(0.4);
    useEffect(() => {
        if (!inView || started) return;
        setStarted(true);
        const startTime = Date.now();
        const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [inView, started, target, duration]);
    return [ref, value];
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Reveal = ({ children, className = '', delay = 0 }) => {
    const [ref, inView] = useInView();
    return (
        <div ref={ref} className={className} style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(28px)',
            transition: `opacity 0.65s ease, transform 0.65s ease`,
            transitionDelay: `${delay}ms`,
        }}>
            {children}
        </div>
    );
};

const Stat = ({ target, suffix = '', label }) => {
    const [ref, value] = useCounter(target);
    return (
        <div ref={ref} className="flex flex-col gap-1">
            <div className="flex items-end gap-0.5">
                <span className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tabular-nums leading-none">
                    {value.toLocaleString()}
                </span>
                <span className="text-xl lg:text-2xl font-black text-primary mb-0.5 leading-none">{suffix}</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
        </div>
    );
};

const FeatureTag = ({ label, color }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${color}`}>{label}</span>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const Home = () => {
    const navigate = useNavigate();
    const { t, isRTL } = useLang();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const scrollY = useScrollY();
    const scrolled = scrollY > 16;

    const NAV_LINKS = [
        { label: t('nav.students'),     to: '/students' },
        { label: t('nav.companies'),    to: '/companies' },
        { label: t('nav.universities'), to: '/universities' },
    ];

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const [studentRes, companyRes, adminRes] = await Promise.all([
                    fetch('/api/student/me').catch(() => ({ ok: false })),
                    fetch('/api/company/me').catch(() => ({ ok: false })),
                    fetch('/api/admin/me').catch(() => ({ ok: false }))
                ]);
                if (studentRes.ok) {
                    const data = await studentRes.json();
                    setUser({ ...data.user, role: 'student' });
                } else if (companyRes.ok) {
                    const data = await companyRes.json();
                    setUser({ ...data.user, role: 'company' });
                } else if (adminRes.ok) {
                    const data = await adminRes.json();
                    setUser({ ...data.user, role: 'admin' });
                }
            } catch (err) {
                console.error('Auth check failed:', err);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const handleDashboardClick = () => {
        const role = user?.role?.toLowerCase();
        if (role === 'admin') navigate('/admin-dashboard');
        else if (role === 'company') navigate('/company-dashboard');
        else navigate('/student-dashboard');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col overflow-x-hidden">

            {/* ── Scroll progress bar ─────────────────────────────────────────── */}
            <ScrollProgress />

            {/* ── Navbar ──────────────────────────────────────────────────────── */}
            <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                scrolled
                    ? 'bg-white/80 dark:bg-[#07090F]/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-white/[0.06] shadow-sm'
                    : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <img src={logoImage} alt="stage.io logo" className="h-16 w-auto object-contain dark:brightness-0 dark:invert dark:sepia dark:saturate-[10] dark:hue-rotate-[350deg] mix-blend-multiply dark:mix-blend-screen" />
                    </div>

                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(l => (
                            <Link key={l.label} to={l.to}
                                className="nav-underline px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary rounded-xl transition-colors">
                                {l.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        {!loading && (
                            user ? (
                                <>
                                    <ThemeToggle />
                                    <button onClick={handleDashboardClick}
                                        className="h-9 px-5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                                        {t('nav.dashboard')}
                                    </button>
                                    <div
                                        className="size-9 rounded-full border-2 border-primary/40 bg-cover bg-center cursor-pointer hover:border-primary transition-colors"
                                        style={{ backgroundImage: `url('${user.profilePicture || user.logo || '/images/default-avatar.png'}')` }}
                                        onClick={handleDashboardClick}
                                    />
                                </>
                            ) : (
                                <>
                                    <ThemeToggle />
                                    <button onClick={() => navigate('/login')}
                                        className="hidden sm:block h-9 px-5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                                        {t('nav.login')}
                                    </button>
                                    <button onClick={() => navigate('/student-signup')}
                                        className="h-9 px-5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                                        {t('nav.signup')}
                                    </button>
                                </>
                            )
                        )}
                        <div className="hidden sm:block border-l border-slate-200 dark:border-white/10 h-6 mx-1"></div>
                        <LanguageSwitcher compact={true} />
                        <button
                            className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                            onClick={() => setMobileOpen(v => !v)}
                            aria-label="Toggle menu"
                        >
                            <span className="material-symbols-outlined text-xl">{mobileOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <div className="md:hidden border-t border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#07090F] px-6 py-4 flex flex-col gap-1">
                        {NAV_LINKS.map(l => (
                            <Link key={l.label} to={l.to} onClick={() => setMobileOpen(false)}
                                className="py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors border-b border-slate-100 dark:border-white/[0.04] last:border-0">
                                {l.label}
                            </Link>
                        ))}
                        {!user && (
                            <button onClick={() => { navigate('/login'); setMobileOpen(false); }}
                                className="mt-2 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left hover:text-primary transition-colors">
                                Log in
                            </button>
                        )}
                    </div>
                )}
            </header>

            <main className="flex-1">

                {/* ── Hero ────────────────────────────────────────────────────── */}
                <section className="relative px-6 pt-20 pb-16 md:pt-28 md:pb-24 lg:pt-32 lg:pb-28 overflow-hidden">
                    {/* Aurora animated background */}
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="aurora-blob absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/15 blur-[100px]" />
                        <div className="aurora-blob aurora-blob-2 absolute top-1/2 -left-20 w-[450px] h-[450px] rounded-full bg-cyan-400/12 blur-[90px]" />
                        <div className="aurora-blob aurora-blob-3 absolute -bottom-20 right-1/3 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[80px]" />
                        {/* Subtle grid */}
                        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
                            style={{
                                backgroundImage: 'linear-gradient(rgb(99 102 241) 1px, transparent 1px), linear-gradient(to right, rgb(99 102 241) 1px, transparent 1px)',
                                backgroundSize: '64px 64px'
                            }}
                        />
                        {/* Floating particles */}
                        <Particles count={16} />
                    </div>

                    <div className="max-w-7xl mx-auto">
                        {/* Announcement badge */}
                        <div className="flex justify-center mb-8">
                            <div className="inline-flex items-center gap-2.5 bg-primary/10 dark:bg-primary/15 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-default">
                                <span className="size-1.5 rounded-full bg-primary glow-pulse" />
                                {t('hero.badge')}
                                <span className={`material-symbols-outlined text-sm ${isRTL ? 'rotate-180' : ''}`}>arrow_forward</span>
                            </div>
                        </div>

                        {/* Headline */}
                        <div className="text-center max-w-5xl mx-auto mb-7">
                            <h1 className="text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[5.25rem] font-black leading-[1.05] tracking-tight">
                                <span className="text-slate-900 dark:text-white">{t('hero.title1')}</span>
                                <br />
                                <span className="text-gradient-flow">{t('hero.title2')}</span>
                            </h1>
                        </div>

                        {/* Sub-headline */}
                        <p className="text-center text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            {t('hero.subtitle')}&nbsp;
                            <strong className="text-slate-700 dark:text-slate-200 font-semibold">{t('hero.subtitleStrong')}</strong>
                        </p>

                        {/* CTAs */}
                        {!user && (
                            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                                <MagneticBtn onClick={() => navigate('/student-signup')}
                                    className="group tap-bounce h-14 px-8 bg-primary text-white font-bold text-base rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/30 hover:shadow-primary/50 flex items-center justify-center gap-2 relative overflow-hidden">
                                    <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-primary to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <span className="relative">{t('hero.ctaPrimary')}</span>
                                    <span className={`material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform duration-200 relative ${isRTL ? 'rotate-180' : ''}`}>arrow_forward</span>
                                </MagneticBtn>
                                <MagneticBtn onClick={() => navigate('/company-signup')} strength={0.2}
                                    className="tap-bounce h-14 px-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-base rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 flex items-center justify-center gap-2 backdrop-blur-sm shadow-soft">
                                    <span className="material-symbols-outlined text-xl text-slate-400">business</span>
                                    {t('hero.ctaSecondary')}
                                </MagneticBtn>
                            </div>
                        )}

                        {/* Hero Showcase Image */}
                        <Reveal>
                            <TiltCard max={5} className="relative max-w-5xl mx-auto mb-16">
                                {/* Glow halo (animated) */}
                                <div className="absolute -inset-6 bg-gradient-to-tr from-primary/40 via-violet-500/30 to-cyan-400/30 rounded-[2.5rem] blur-3xl opacity-70 aurora-blob" />

                                {/* Image frame */}
                                <div className="relative rounded-[2rem] overflow-hidden border border-white/40 dark:border-white/10 shadow-2xl shadow-primary/20 bg-white dark:bg-white/5">
                                    {/* Browser-style top bar */}
                                    <div className="flex items-center gap-2 px-5 py-3 bg-slate-50/90 dark:bg-white/5 border-b border-slate-200/70 dark:border-white/[0.06] backdrop-blur-sm">
                                        <div className="flex gap-1.5">
                                            <span className="w-3 h-3 rounded-full bg-red-400/80" />
                                            <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                                            <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                                        </div>
                                        <div className="flex-1 flex justify-center">
                                            <div className="px-4 py-1 bg-white dark:bg-white/[0.06] rounded-md text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-xs">lock</span>
                                                stage.io / dashboard
                                            </div>
                                        </div>
                                    </div>

                                    {/* The image */}
                                    <img
                                        src="/images/hero-image.jpg"
                                        alt="Students and professionals collaborating"
                                        className="w-full h-auto object-cover aspect-[16/9]"
                                    />
                                </div>

                                {/* Floating badge — top left */}
                                <div className="hidden md:flex absolute -top-5 -left-5 items-center gap-3 bg-white dark:bg-surface-card border border-slate-100 dark:border-white/10 rounded-2xl px-4 py-3 shadow-xl animate-float">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-emerald-500 text-xl"
                                            style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-900 dark:text-white">Application Approved</div>
                                        <div className="text-[10px] text-slate-500">Just now · Google Inc.</div>
                                    </div>
                                </div>

                                {/* Floating badge — bottom right */}
                                <div className="hidden md:flex absolute -bottom-5 -right-5 items-center gap-3 bg-white dark:bg-surface-card border border-slate-100 dark:border-white/10 rounded-2xl px-4 py-3 shadow-xl animate-float" style={{ animationDelay: '1.5s' }}>
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-xl">trending_up</span>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-900 dark:text-white">+24% Match Rate</div>
                                        <div className="text-[10px] text-slate-500">vs. last quarter</div>
                                    </div>
                                </div>

                                {/* Floating badge — middle right */}
                                <div className="hidden lg:flex absolute top-1/2 -right-8 -translate-y-1/2 items-center gap-3 bg-white dark:bg-surface-card border border-slate-100 dark:border-white/10 rounded-2xl px-4 py-3 shadow-xl animate-float" style={{ animationDelay: '0.7s' }}>
                                    <div className="flex -space-x-2">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-violet-600 border-2 border-white dark:border-surface-card" />
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white dark:border-surface-card" />
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 border-2 border-white dark:border-surface-card" />
                                    </div>
                                    <div className="text-xs font-bold text-slate-900 dark:text-white">+15K students</div>
                                </div>
                            </TiltCard>
                        </Reveal>

                        {/* Animated Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto md:max-w-3xl">
                            <Stat target={15000} suffix="+" label={t('hero.stats.students')} />
                            <Stat target={500}   suffix="+" label={t('hero.stats.companies')} />
                            <Stat target={98}    suffix="%" label={t('hero.stats.satisfaction')} />
                            <Stat target={60}    suffix="%" label={t('hero.stats.hiring')} />
                        </div>
                    </div>
                </section>

                {/* ── Trust Bar — infinite marquee ─────────────────────────────── */}
                <section className="py-12 border-y border-slate-100 dark:border-white/[0.05] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-6">
                        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-8">
                            {t('trust')}
                        </p>
                        <div className="marquee-mask marquee-pause overflow-hidden">
                            <div className="marquee-track gap-14 items-center">
                                {[
                                    'MIT', 'STANFORD', 'GOOGLE', 'MICROSOFT', 'AMAZON',
                                    'ORACLE', 'ETH', 'HARVARD', 'META', 'NVIDIA', 'IBM', 'APPLE'
                                ].concat([
                                    'MIT', 'STANFORD', 'GOOGLE', 'MICROSOFT', 'AMAZON',
                                    'ORACLE', 'ETH', 'HARVARD', 'META', 'NVIDIA', 'IBM', 'APPLE'
                                ]).map((name, i) => (
                                    <span key={i}
                                        className="text-lg font-black text-slate-300 dark:text-slate-700 hover:text-primary dark:hover:text-primary transition-colors tracking-tight cursor-default select-none whitespace-nowrap">
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Features — Bento Grid ────────────────────────────────────── */}
                <section className="py-28 px-6" id="features">
                    <div className="max-w-7xl mx-auto">
                        <Reveal>
                            <div className="text-center max-w-3xl mx-auto mb-16">
                                <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4">{t('features.kicker')}</p>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight">
                                    {t('features.title1')}<br />{t('features.title2')}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                                    {t('features.subtitle')}
                                </p>
                            </div>
                        </Reveal>

                        {/* Bento */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                            {/* Hero card — large */}
                            <Reveal delay={0} className="lg:col-span-2">
                                <div className="relative h-full min-h-[300px] overflow-hidden rounded-4xl bg-gradient-to-br from-primary via-violet-600 to-indigo-700 p-9 flex flex-col justify-between group cursor-default">
                                    <div className="absolute inset-0 opacity-20 bg-gradient-radial from-white/30 to-transparent" />
                                    <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-700" />
                                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
                                    <div className="relative">
                                        <div className="w-13 h-13 w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                                            <span className="material-symbols-outlined text-white text-3xl">psychology</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight">
                                            {t('features.ai.title')}<br />{t('features.ai.title2')}
                                        </h3>
                                        <p className="text-white/75 text-base leading-relaxed max-w-md">
                                            {t('features.ai.desc')}
                                        </p>
                                    </div>
                                    <div className="relative mt-8 flex items-center gap-2 text-white/80 font-semibold text-sm group-hover:gap-3 transition-all">
                                        <span>{t('features.ai.cta')}</span>
                                        <span className={`material-symbols-outlined text-base ${isRTL ? 'rotate-180' : ''}`}>arrow_forward</span>
                                    </div>
                                </div>
                            </Reveal>

                            {/* Card 2 */}
                            <Reveal delay={80}>
                                <SpotlightCard className="conic-border h-full min-h-[220px] p-8 bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.07] rounded-4xl hover:shadow-card hover:-translate-y-1 transition-all duration-300 group cursor-default">
                                    <div className="w-11 h-11 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-amber-500 text-2xl">bolt</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('features.instant.title')}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                        {t('features.instant.desc')}
                                    </p>
                                </SpotlightCard>
                            </Reveal>

                            {/* Card 3 */}
                            <Reveal delay={140}>
                                <SpotlightCard className="conic-border h-full min-h-[220px] p-8 bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.07] rounded-4xl hover:shadow-card hover:-translate-y-1 transition-all duration-300 group cursor-default">
                                    <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-emerald-500 text-2xl">monitoring</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('features.analytics.title')}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                        {t('features.analytics.desc')}
                                    </p>
                                </SpotlightCard>
                            </Reveal>

                            {/* Card 4 — wide / horizontal */}
                            <Reveal delay={100} className="lg:col-span-3">
                                <SpotlightCard className="conic-border p-8 bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.07] rounded-4xl hover:shadow-card transition-all duration-300 cursor-default">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-start gap-5">
                                            <div className="w-11 h-11 bg-cyan-50 dark:bg-cyan-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                                                <span className="material-symbols-outlined text-cyan-500 text-2xl">school</span>
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('features.university.title')}</h4>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xl">
                                                    {t('features.university.desc')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 flex-shrink-0">
                                            <FeatureTag label="API-ready"  color="bg-primary/10 text-primary" />
                                            <FeatureTag label="SOC 2"      color="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
                                            <FeatureTag label="GDPR"       color="bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" />
                                            <FeatureTag label="SSO"        color="bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" />
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ── Stakeholders ─────────────────────────────────────────────── */}
                <section className="py-28 px-6 bg-slate-50/80 dark:bg-white/[0.02]">
                    <div className="max-w-7xl mx-auto">
                        <Reveal>
                            <div className="text-center mb-16">
                                <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4">{t('stakeholders.kicker')}</p>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
                                    {t('stakeholders.title')}
                                </h2>
                            </div>
                        </Reveal>

                        <div className="grid lg:grid-cols-3 gap-7">
                            {[
                                {
                                    title: t('stakeholders.students.title'),
                                    img: '/images/students.jpg',
                                    accentBg: 'bg-primary/5 dark:bg-primary/10',
                                    accentText: 'text-primary',
                                    items: t('stakeholders.students.items'),
                                    cta: t('stakeholders.students.cta'), href: '/student-signup',
                                },
                                {
                                    title: t('stakeholders.companies.title'),
                                    img: '/images/office.jpg',
                                    accentBg: 'bg-amber-500/5 dark:bg-amber-500/10',
                                    accentText: 'text-amber-500',
                                    items: t('stakeholders.companies.items'),
                                    cta: t('stakeholders.companies.cta'), href: '/company-signup',
                                },
                                {
                                    title: t('stakeholders.universities.title'),
                                    img: '/images/admin.jpg',
                                    accentBg: 'bg-emerald-500/5 dark:bg-emerald-500/10',
                                    accentText: 'text-emerald-500',
                                    items: t('stakeholders.universities.items'),
                                    cta: t('stakeholders.universities.cta'), href: '/contact-us',
                                },
                            ].map((card, i) => (
                                <Reveal key={card.title} delay={i * 90}>
                                    <div className={`h-full flex flex-col rounded-4xl overflow-hidden bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300`}>
                                        <div className="h-52 overflow-hidden">
                                            <img
                                                src={card.img}
                                                alt={card.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className={`p-8 flex flex-col flex-1 ${card.accentBg}`}>
                                            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">{card.title}</h3>
                                            <ul className="space-y-3.5 flex-1">
                                                {card.items.map(item => (
                                                    <li key={item} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
                                                        <span className={`material-symbols-outlined text-xl flex-shrink-0 mt-px ${card.accentText}`}
                                                            style={{ fontVariationSettings: "'FILL' 1" }}>
                                                            check_circle
                                                        </span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                            <a href={card.href}
                                                className="mt-8 inline-flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-white hover:text-primary dark:hover:text-primary transition-colors group">
                                                {card.cta}
                                                <span className={`material-symbols-outlined text-base group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`}>arrow_forward</span>
                                            </a>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── How It Works ─────────────────────────────────────────────── */}
                <section className="py-28 px-6">
                    <div className="max-w-7xl mx-auto">
                        <Reveal>
                            <div className="text-center mb-20">
                                <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4">{t('steps.kicker')}</p>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                                    {t('steps.title')}<br />{t('steps.title2')}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-base">{t('steps.subtitle')}</p>
                            </div>
                        </Reveal>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                            {/* Connector line */}
                            <div className="hidden lg:block absolute top-[30px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary via-violet-500 to-cyan-400 opacity-25" />

                            {[
                                { icon: 'person_add',    ...t('steps.list')[0] },
                                { icon: 'psychology',    ...t('steps.list')[1] },
                                { icon: 'draw',          ...t('steps.list')[2] },
                                { icon: 'rocket_launch', ...t('steps.list')[3] },
                            ].map((step, i) => (
                                <Reveal key={step.title} delay={i * 80}>
                                    <div className="relative flex flex-col items-center text-center group">
                                        <div className="relative w-[60px] h-[60px] mb-6">
                                            <div className="absolute inset-0 bg-primary/10 rounded-full"
                                                style={{ animation: `pulse 3s ease-in-out ${i * 0.6}s infinite` }} />
                                            <div className="relative w-full h-full bg-white dark:bg-white/5 border-2 border-primary/20 dark:border-primary/30 rounded-full flex items-center justify-center shadow-soft group-hover:border-primary/50 transition-colors duration-300">
                                                <span className="material-symbols-outlined text-primary text-2xl">{step.icon}</span>
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-primary/40">
                                                {i + 1}
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">{step.title}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Testimonials ─────────────────────────────────────────────── */}
                <section className="py-28 px-6 bg-slate-50/80 dark:bg-white/[0.02]">
                    <div className="max-w-7xl mx-auto">
                        <Reveal>
                            <div className="text-center mb-16">
                                <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4">{t('testimonials.kicker')}</p>
                                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">{t('testimonials.title')}</h2>
                            </div>
                        </Reveal>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    quote: '"stage.io reduced our internship onboarding from 3 weeks to 2 days. The automated contracting is a total game-changer for HR."',
                                    name: 'Sarah B.', role: 'HR Lead, TechCorp', initials: 'SB', color: 'bg-primary/20 text-primary'
                                },
                                {
                                    quote: '"I landed my dream internship at Google in under a week. The AI matching found opportunities I wouldn\'t have discovered on my own."',
                                    name: 'Ahmed L.', role: 'CS Student, MIT', initials: 'AL', color: 'bg-emerald-500/20 text-emerald-600'
                                },
                                {
                                    quote: '"Our placement rate went from 68% to 94% after integrating stage.io. The analytics dashboard gives us insights we never had before."',
                                    name: 'Prof. Marie C.', role: 'Career Director, Stanford', initials: 'MC', color: 'bg-amber-500/20 text-amber-600'
                                },
                            ].map((t, i) => (
                                <Reveal key={i} delay={i * 80}>
                                    <SpotlightCard className="conic-border h-full p-8 bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.07] rounded-4xl hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex gap-1 mb-5">
                                            {[1,2,3,4,5].map(s => (
                                                <span key={s} className="material-symbols-outlined text-amber-400 text-sm"
                                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            ))}
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">{t.quote}</p>
                                        <div className="flex items-center gap-3 mt-auto">
                                            <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                                                {t.initials}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</div>
                                                <div className="text-xs text-slate-400">{t.role}</div>
                                            </div>
                                        </div>
                                    </SpotlightCard>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Final CTA ────────────────────────────────────────────────── */}
                <section className="py-28 px-6">
                    <Reveal>
                        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-5xl bg-gradient-to-br from-primary via-violet-600 to-indigo-700 p-12 md:p-20 text-center">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
                            <div className="absolute inset-0 opacity-10 pointer-events-none"
                                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-widest mb-8">
                                    <span className="size-1.5 rounded-full bg-white animate-pulse" />
                                    {t('finalCta.badge')}
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.05]">
                                    {t('finalCta.title')}<br />{t('finalCta.title2')}
                                </h2>
                                <p className="text-white/70 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
                                    {t('finalCta.subtitle')}
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <MagneticBtn onClick={() => navigate('/student-signup')}
                                        className="tap-bounce h-14 px-10 bg-white text-primary font-bold text-base rounded-2xl hover:bg-white/95 shadow-xl">
                                        {t('finalCta.ctaPrimary')}
                                    </MagneticBtn>
                                    <MagneticBtn onClick={() => navigate('/contact-us')} strength={0.2}
                                        className="tap-bounce h-14 px-10 bg-white/10 border-2 border-white/20 text-white font-bold text-base rounded-2xl hover:bg-white/20 backdrop-blur-sm">
                                        {t('finalCta.ctaSecondary')}
                                    </MagneticBtn>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </section>
            </main>

            {/* ── Footer ──────────────────────────────────────────────────────── */}
            <Footer />
        </div>
    );
};

export default Home;
