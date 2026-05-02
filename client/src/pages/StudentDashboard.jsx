import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import StudentNavbar from '../components/StudentNavbar';
import { useLang } from '../contexts/LanguageContext';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { t, lang } = useLang();

    const [user, setUser] = useState({
        name: 'Student Name',
        email: 'student@university.edu',
        phoneNumber: '',
        university: 'University',
        currentYear: '',
        country: 'Location',
        githubPortfolio: 'github.com',
        skills: [],
        createdAt: new Date(),
        profilePicture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjBPPlZgqCxXn4rLkoiUfFHy3MP2QaQAbHzCF--6xNTr52Hop8mjrnlAeaIN-fCEshDEM6yUsNXF0GTpdEmLd_HxUV25KKAkcvhbYOTiZ2-t2MXeOexxuRZ3AXjdAYkGHQZkSS_KBwH14mHdxTRwTuzl_hmkabWkPMyWilyA5bApTa4vFXFuW7MjFwQCE6XUlleuLy2M-TUhBAaD_-MM92RVVtnN6fSGGoH-coRgTEIZdsXtrPeNx8JRpzFeGPOkfqcyWdRU8ZdBo'
    });

    const [offers, setOffers] = useState([]);
    const [offersLoading, setOffersLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMoreOffers, setHasMoreOffers] = useState(true);
    const [applyingTo, setApplyingTo] = useState(null);
    const [applications, setApplications] = useState([]);
    const [applyModal, setApplyModal] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    const localeCode = lang === 'AR' ? 'ar' : lang === 'FR' ? 'fr' : 'en-US';
    const firstName = (user.name || '').split(' ')[0] || '';

    const greeting = useMemo(() => {
        const h = new Date().getHours();
        if (h < 12) return { text: t('dashboard.goodMorning'), emoji: '☀️' };
        if (h < 18) return { text: t('dashboard.goodAfternoon'), emoji: '🌤️' };
        return { text: t('dashboard.goodEvening'), emoji: '🌙' };
    }, [t]);

    const profileFields = [
        user.name, user.email, user.phoneNumber, user.university,
        user.currentYear, user.country, user.githubPortfolio,
        user.skills?.length > 0, user.profilePicture,
    ];
    const completedCount = profileFields.filter(Boolean).length;
    const completionPct = Math.round((completedCount / profileFields.length) * 100);
    const isProfileComplete = completionPct === 100;

    const stats = useMemo(() => {
        const total = applications.length;
        const inReview = applications.filter(a => a.status === 'applied').length;
        const accepted = applications.filter(a => a.status === 'accepted' || a.status === 'validated').length;
        const successRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
        return { total, inReview, accepted, successRate };
    }, [applications]);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'applied': return { text: t('dashboard.inReview'), color: 'amber', icon: 'hourglass_top' };
            case 'accepted': return { text: t('dashboard.accepted'), color: 'indigo', icon: 'thumb_up' };
            case 'rejected': return { text: t('dashboard.refused'), color: 'red', icon: 'cancel' };
            case 'validated': return { text: t('dashboard.validated'), color: 'emerald', icon: 'verified' };
            default: return { text: '—', color: 'slate', icon: 'help' };
        }
    };

    const fetchOffers = async (pageNum) => {
        setOffersLoading(true);
        try {
            const skip = (pageNum - 1) * 3;
            const offersRes = await fetch(`/api/offers?limit=3&skip=${skip}`);
            if (offersRes.ok) {
                const offersData = await offersRes.json();
                if (offersData.success) {
                    setOffers(offersData.offers);
                    setHasMoreOffers(offersData.offers.length === 3);
                }
            }
        } catch (err) {
            console.error('Failed to fetch dashboard offers:', err);
        } finally {
            setOffersLoading(false);
        }
    };

    const openApplyModal = (e, offer) => {
        e.stopPropagation();
        setApplyModal({ offerId: offer._id, title: offer.title, company: offer.company?.name || t('dashboard.company') });
    };

    const handleApply = async () => {
        if (!applyModal) return;
        const offerId = applyModal.offerId;
        setApplyingTo(offerId);
        setApplyModal(null);
        try {
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ offerId })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setToastMessage({ type: 'success', text: t('dashboard.applySuccess') });
                setTimeout(() => setToastMessage(null), 4000);
                setOffers(prev => prev.map(o => o._id === offerId ? { ...o, isApplied: true } : o));
            } else {
                setToastMessage({ type: 'error', text: data.message || t('dashboard.applyFailed') });
                setTimeout(() => setToastMessage(null), 4000);
            }
        } catch (err) {
            console.error('Error applying:', err);
            setToastMessage({ type: 'error', text: t('dashboard.applyError') });
            setTimeout(() => setToastMessage(null), 4000);
        } finally {
            setApplyingTo(null);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/student/me');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.user) {
                        setUser(prev => ({ ...prev, ...data.user, skills: data.user.skills || [] }));
                    }
                } else if (res.status === 401) {
                    window.location.href = '/student-signup';
                }
            } catch (err) { console.error(err); }
        };
        fetchUserData();
    }, []);

    useEffect(() => { fetchOffers(page); }, [page]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch('/api/student/applications');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) setApplications(data.applications);
                }
            } catch (err) { console.error(err); }
        };
        fetchApplications();
    }, []);

    const recentApplications = useMemo(
        () => [...applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3),
        [applications]
    );

    return (
        <>
            <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 font-body min-h-screen flex flex-col antialiased selection:bg-primary/20 selection:text-primary">
                <StudentNavbar student={user} />

                <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

                    {/* HERO BANNER */}
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-violet-600 to-secondary p-6 sm:p-8 lg:p-10 mb-6 shadow-2xl shadow-primary/20">
                        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-32 -end-32 w-[28rem] h-[28rem] bg-white/20 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-40 -start-32 w-[28rem] h-[28rem] bg-secondary/40 rounded-full blur-3xl"></div>
                        </div>
                        <div aria-hidden="true" className="absolute inset-0 opacity-[0.07]" style={{
                            backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                            backgroundSize: '24px 24px'
                        }}></div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            <div className="lg:col-span-7 text-white">
                                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full ps-2 pe-3 py-1 mb-4 text-xs font-bold">
                                    <span className="text-base leading-none">{greeting.emoji}</span>
                                    <span>{greeting.text} • {moment().locale(lang === 'AR' ? 'ar' : lang === 'FR' ? 'fr' : 'en').format('dddd, MMMM D')}</span>
                                </div>
                                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-3">
                                    {greeting.text}, <span className="bg-gradient-to-r from-yellow-300 to-orange-200 bg-clip-text text-transparent">{firstName}</span>
                                </h1>
                                <p className="text-white/85 text-base sm:text-lg max-w-xl mb-6">{t('dashboard.tagline')}</p>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => navigate('/opportunities')}
                                        className="group bg-white text-primary font-bold px-5 py-3 rounded-xl hover:bg-white/95 transition-all shadow-xl flex items-center gap-2 text-sm hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <span className="material-symbols-outlined text-lg">travel_explore</span>
                                        {t('dashboard.offers')}
                                        <span className="material-symbols-outlined text-base rtl-flip group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                    </button>
                                    <button
                                        onClick={() => navigate('/ApplicationTracker')}
                                        className="bg-white/15 backdrop-blur-md text-white font-bold px-5 py-3 rounded-xl hover:bg-white/25 transition-all border border-white/30 flex items-center gap-2 text-sm"
                                    >
                                        <span className="material-symbols-outlined text-lg">task_alt</span>
                                        {t('dashboard.myApplications')}
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-5 flex justify-center lg:justify-end">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 sm:p-6 w-full max-w-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="relative size-20 flex-shrink-0">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
                                                <path className="text-white/20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                                <path className="text-white" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${completionPct}, 100`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.8s ease-out' }} />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="font-display text-xl font-bold text-white">{completionPct}%</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1">{t('dashboard.profileCompletion')}</p>
                                            <p className="text-white text-sm font-bold leading-tight mb-2">
                                                {isProfileComplete ? t('dashboard.allSet') : completionPct >= 70 ? t('dashboard.greatProgress') : t('dashboard.keepItUp')}
                                            </p>
                                            {!isProfileComplete && (
                                                <button onClick={() => navigate('/edit-student-profile')} className="text-xs font-bold text-white/90 hover:text-white inline-flex items-center gap-1 group">
                                                    {t('dashboard.completeProfile')}
                                                    <span className="material-symbols-outlined text-sm rtl-flip group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* STATS */}
                    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                        <StatCard label={t('dashboard.statTotal')} value={stats.total} icon="description" tone="primary" onClick={() => navigate('/ApplicationTracker')} />
                        <StatCard label={t('dashboard.inReview')} value={stats.inReview} icon="hourglass_top" tone="amber" />
                        <StatCard label={t('dashboard.accepted')} value={stats.accepted} icon="check_circle" tone="emerald" />
                        <StatCard label={t('dashboard.statSuccess')} value={`${stats.successRate}%`} icon="trending_up" tone="secondary" />
                    </section>

                    {/* MAIN GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* SIDEBAR */}
                        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
                            <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 border border-border-color dark:border-slate-700/50 shadow-soft lg:sticky lg:top-24">
                                {/* Banner (clipped) */}
                                <div className="relative h-20 -mx-6 -mt-6 rounded-t-3xl bg-gradient-to-br from-primary/90 via-violet-600/90 to-secondary/90 overflow-hidden">
                                    <div aria-hidden="true" className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '14px 14px' }}></div>
                                </div>

                                {/* Avatar — sibling, overlaps banner so the bottom half is fully visible */}
                                <div className="relative -mt-10 mb-4 flex justify-center">
                                    <div className="relative">
                                        <div className="size-20 rounded-full border-4 border-white dark:border-slate-800 shadow-xl bg-cover bg-center" style={{ backgroundImage: `url('${user.profilePicture}')` }}></div>
                                        <div className="absolute bottom-0 end-0 w-5 h-5 bg-emerald-500 rounded-full ring-4 ring-white dark:ring-slate-800 flex items-center justify-center" title={t('dashboard.online')}>
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h2 className="font-display text-lg font-bold text-text-main dark:text-gray-100 leading-tight">{user.name}</h2>
                                    {user.specialty && <p className="text-primary font-semibold text-sm mt-0.5">{user.specialty}</p>}
                                    <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                        {t('dashboard.readyToWork')}
                                    </div>
                                </div>

                                <div className="my-5 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>

                                <ul className="space-y-2.5">
                                    <InfoRow icon="mail" value={user.email} href={`mailto:${user.email}`} />
                                    <InfoRow icon="phone" value={user.phoneNumber || '—'} />
                                    <InfoRow icon="school" value={user.university} />
                                    <InfoRow icon="calendar_month" value={user.currentYear || '—'} />
                                    <InfoRow icon="location_on" value={user.country} />
                                    {user.githubPortfolio && (
                                        <InfoRow icon="code" value={user.githubPortfolio} href={user.githubPortfolio.startsWith('http') ? user.githubPortfolio : `https://${user.githubPortfolio}`} external mono />
                                    )}
                                </ul>

                                <div className="my-5 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-text-muted dark:text-gray-400">{t('dashboard.mySkills')}</h3>
                                        {user.skills.length > 0 && (
                                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{user.skills.length}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {user.skills.length === 0 ? (
                                            <button onClick={() => navigate('/edit-student-profile')} className="text-[11px] text-primary hover:underline italic">+ {t('dashboard.editProfile')}</button>
                                        ) : user.skills.map(skill => (
                                            <span key={skill} className="px-2 py-0.5 bg-primary/5 dark:bg-primary/10 text-primary rounded-md font-mono text-[10px] border border-primary/15 hover:bg-primary hover:text-white transition-all cursor-default">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="my-5 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>

                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-text-muted dark:text-gray-400 mb-1">{t('dashboard.sinceJoined')}</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-center justify-center gap-1.5">
                                        <span className="material-symbols-outlined text-base text-secondary">workspace_premium</span>
                                        {moment(user.createdAt).format('MMMM YYYY')}
                                    </p>
                                </div>

                                <div className="mt-5 space-y-2">
                                    <button onClick={() => navigate('/edit-student-profile')} className="w-full py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:scale-[1.01] active:scale-[0.99]">
                                        <span className="material-symbols-outlined text-base">edit</span>
                                        {t('dashboard.editProfile')}
                                    </button>
                                    <button
                                        onClick={async () => { await fetch('/api/logout', { method: 'POST' }); window.location.href = '/'; }}
                                        className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-base">logout</span>
                                        {t('dashboard.logout')}
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* RIGHT */}
                        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">

                            {/* QUICK ACTIONS */}
                            <section>
                                <h2 className="font-display text-base font-bold text-text-main dark:text-gray-100 mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">bolt</span>
                                    {t('dashboard.quickActions')}
                                </h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                    <QuickAction icon="travel_explore" label={t('dashboard.browseOffers')} accent="from-primary to-violet-600" onClick={() => navigate('/opportunities')} />
                                    <QuickAction icon="task_alt" label={t('dashboard.myApplications')} accent="from-amber-500 to-orange-500" badge={stats.total > 0 ? stats.total : undefined} onClick={() => navigate('/ApplicationTracker')} />
                                    <QuickAction icon="mail" label={t('dashboard.myInbox')} accent="from-secondary to-cyan-500" onClick={() => navigate('/student-inbox')} />
                                    <QuickAction icon="upload_file" label={t('dashboard.updateCv')} accent="from-emerald-500 to-green-600" onClick={() => navigate('/edit-student-profile')} />
                                </div>
                            </section>

                            {/* APPLICATIONS */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-display text-lg font-bold text-text-main dark:text-gray-100 flex items-center gap-2">
                                        <span className="size-2 bg-primary rounded-full animate-pulse"></span>
                                        {t('dashboard.activeApplications')}
                                    </h2>
                                    {applications.length > 0 && (
                                        <button onClick={() => navigate('/ApplicationTracker')} className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1 group">
                                            {t('dashboard.viewAllCount')} ({applications.length})
                                            <span className="material-symbols-outlined text-sm rtl-flip group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                        </button>
                                    )}
                                </div>

                                {applications.length === 0 ? (
                                    <EmptyState icon="description" title={t('dashboard.noApplicationsTitle')} subtitle={t('dashboard.noApplicationsSub')} ctaLabel={t('dashboard.offers')} ctaIcon="travel_explore" onCta={() => navigate('/opportunities')} />
                                ) : (
                                    <ul className="space-y-3">
                                        {recentApplications.map((app) => (
                                            <ApplicationRow key={app._id || app.id || app.createdAt} app={app} getStatusInfo={getStatusInfo} t={t} localeCode={localeCode} onClick={() => navigate('/ApplicationTracker')} />
                                        ))}
                                    </ul>
                                )}
                            </section>

                            {/* SUGGESTED OFFERS */}
                            <section>
                                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="font-display text-lg font-bold text-text-main dark:text-gray-100">{t('dashboard.suggestedForYou')}</h2>
                                        <span className="bg-gradient-to-r from-secondary to-cyan-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                            <span className="material-symbols-outlined text-xs">auto_awesome</span>
                                            {t('dashboard.aiMatched')}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={`size-9 rounded-full bg-white dark:bg-slate-800 border border-border-color dark:border-slate-700/50 flex items-center justify-center transition-all ${page === 1 ? 'text-gray-300 cursor-not-allowed opacity-50' : 'text-text-muted dark:text-gray-400 hover:border-primary hover:text-primary cursor-pointer hover:scale-105'}`}>
                                            <span className="material-symbols-outlined text-lg rtl-flip">chevron_left</span>
                                        </button>
                                        <button onClick={() => setPage(p => p + 1)} disabled={!hasMoreOffers} className={`size-9 rounded-full bg-white dark:bg-slate-800 border border-border-color dark:border-slate-700/50 flex items-center justify-center transition-all ${!hasMoreOffers ? 'text-gray-300 cursor-not-allowed opacity-50' : 'text-text-muted dark:text-gray-400 hover:border-primary hover:text-primary cursor-pointer hover:scale-105'}`}>
                                            <span className="material-symbols-outlined text-lg rtl-flip">chevron_right</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {offersLoading ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="bg-surface-light dark:bg-surface-dark rounded-2xl h-[280px] border border-border-color dark:border-slate-700/50 overflow-hidden">
                                                <div className="h-full p-5 space-y-3 animate-pulse">
                                                    <div className="flex justify-between">
                                                        <div className="size-11 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
                                                        <div className="size-11 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                                    </div>
                                                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                                    <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                                    <div className="flex gap-2 pt-2">
                                                        <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                                        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : offers.length === 0 ? (
                                        <div className="col-span-full">
                                            <EmptyState icon="inbox" title={t('dashboard.noOffers')} subtitle="" ctaLabel={t('dashboard.offers')} ctaIcon="travel_explore" onCta={() => navigate('/opportunities')} />
                                        </div>
                                    ) : offers.map((offer) => {
                                        const allTags = offer.techStack ? offer.techStack.flatMap(stack => stack.tags || []) : [];
                                        const score = offer.matchPercentage !== undefined ? Math.round(offer.matchPercentage) : 0;
                                        const matchColor = score >= 70 ? 'text-emerald-500' : score >= 40 ? 'text-amber-500' : 'text-red-500';
                                        const matchBg = score >= 70 ? 'bg-emerald-50 dark:bg-emerald-900/20' : score >= 40 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20';
                                        const isClosed = offer.status === 'Closed' || (offer.endDateOfApplay && moment().isAfter(moment(offer.endDateOfApplay).endOf('day')));

                                        return (
                                            <article key={offer._id} onClick={() => navigate(`/offer-details/${offer._id}`)} className="group relative bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft hover:shadow-lift border border-border-color dark:border-slate-700/50 p-5 flex flex-col transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
                                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="size-12 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
                                                        {offer.company?.logo ? (
                                                            <img alt="" className="w-full h-full object-cover" src={offer.company.logo} />
                                                        ) : (
                                                            <span className="material-symbols-outlined text-gray-400">corporate_fare</span>
                                                        )}
                                                    </div>
                                                    <div className={`flex items-center gap-1.5 ${matchBg} ${matchColor} px-2 py-1 rounded-full border border-current/20`}>
                                                        <div className="relative size-4">
                                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                                <path className="opacity-30" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="6"></path>
                                                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${score}, 100`} strokeWidth="6" strokeLinecap="round"></path>
                                                            </svg>
                                                        </div>
                                                        <span className="text-[10px] font-bold">{score}%</span>
                                                    </div>
                                                </div>

                                                <h3 className="font-display font-bold text-base text-text-main dark:text-gray-100 leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">{offer.title}</h3>
                                                <p className="text-xs text-text-muted dark:text-gray-400 mb-3 flex items-center gap-1 truncate">
                                                    <span className="material-symbols-outlined text-sm flex-shrink-0">apartment</span>
                                                    <span className="truncate">{offer.company?.name || t('dashboard.company')}</span>
                                                    <span className="text-slate-300 dark:text-slate-600">•</span>
                                                    <span className="truncate">{offer.wilaya || 'Algeria'}</span>
                                                </p>

                                                <div className="flex flex-wrap gap-1.5 mb-3 min-h-[1.5rem]">
                                                    {allTags.slice(0, 3).map((tag, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-primary/5 text-primary rounded-md text-[10px] font-mono border border-primary/10">{tag}</span>
                                                    ))}
                                                    {allTags.length > 3 && (
                                                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md text-[10px] font-mono">+{allTags.length - 3}</span>
                                                    )}
                                                    {allTags.length === 0 && (
                                                        <span className="text-[10px] text-gray-400 italic">{t('dashboard.noSkillsListed')}</span>
                                                    )}
                                                </div>

                                                <p className="text-xs text-text-muted dark:text-gray-400 line-clamp-2 mb-4 flex-1">{offer.description || ''}</p>

                                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                                                    <span className="text-[10px] text-slate-400 font-medium">{offer.endDateOfApplay && moment(offer.endDateOfApplay).fromNow()}</span>
                                                    <button
                                                        onClick={(e) => openApplyModal(e, offer)}
                                                        disabled={applyingTo === offer._id || offer.isApplied || isClosed}
                                                        className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                                                            offer.isApplied ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30 cursor-default'
                                                            : isClosed ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                                                            : applyingTo === offer._id ? 'bg-indigo-400 text-white cursor-not-allowed'
                                                            : 'bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 hover:scale-105'
                                                        }`}
                                                    >
                                                        {offer.isApplied ? t('common.applied') : isClosed ? t('common.offerClosed') : applyingTo === offer._id ? t('common.applying') : t('common.apply')}
                                                        {offer.isApplied && <span className="material-symbols-outlined text-[14px]">check_circle</span>}
                                                        {isClosed && <span className="material-symbols-outlined text-[14px]">lock</span>}
                                                        {applyingTo === offer._id && <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>}
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* PRO TIP CTA */}
                            {!isProfileComplete && (
                                <section className="bg-gradient-to-br from-primary via-violet-600 to-secondary rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                                    <div aria-hidden="true" className="absolute top-0 end-0 -me-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                                    <div aria-hidden="true" className="absolute bottom-0 start-0 -ms-16 -mb-16 w-64 h-64 rounded-full bg-secondary/30 blur-3xl"></div>

                                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                                        <div className="flex-1">
                                            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
                                                <span className="material-symbols-outlined text-sm">tips_and_updates</span>
                                                {t('dashboard.proTip')}
                                            </div>
                                            <h3 className="font-display text-xl sm:text-2xl font-bold mb-2 leading-tight">{t('dashboard.enhanceCvTitle')}</h3>
                                            <p className="text-white/85 text-sm max-w-xl">{t('dashboard.enhanceCvSub')}</p>
                                        </div>
                                        <button onClick={() => navigate('/edit-student-profile')} className="group bg-white text-primary font-bold px-5 py-3 rounded-xl hover:bg-gray-50 transition-all shadow-lg whitespace-nowrap flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
                                            {t('dashboard.enhanceCv')}
                                            <span className="material-symbols-outlined text-base rtl-flip group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                        </button>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* APPLY MODAL */}
            {applyModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up" onClick={() => setApplyModal(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-7 max-w-sm w-full text-center border border-slate-100 dark:border-slate-800 animate-pop-in" onClick={(e) => e.stopPropagation()}>
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-violet-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined text-3xl">send</span>
                        </div>
                        <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">{t('dashboard.applyConfirmTitle')}</h3>
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-1">{applyModal.title}</p>
                        <p className="text-slate-400 text-xs mb-7">{t('dashboard.applyConfirmAt')} {applyModal.company}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setApplyModal(null)} className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl transition-all">
                                {t('common.cancel')}
                            </button>
                            <button onClick={handleApply} className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">send</span>
                                {t('common.apply')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST */}
            {toastMessage && (
                <div className="fixed bottom-6 end-6 z-[200] animate-fade-in-up">
                    <div className={`${toastMessage.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm`}>
                        <div className="bg-white/20 p-2 rounded-full flex-shrink-0">
                            <span className="material-symbols-outlined text-white text-xl">{toastMessage.type === 'success' ? 'check_circle' : 'error'}</span>
                        </div>
                        <p className="text-sm font-semibold">{toastMessage.text}</p>
                        <button onClick={() => setToastMessage(null)} className="ms-auto text-white/80 hover:text-white transition-colors" aria-label={t('common.close')}>
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const StatCard = ({ label, value, icon, tone, onClick }) => {
    const toneMap = {
        primary: { bg: 'bg-primary/10', text: 'text-primary', gradient: 'from-primary to-violet-600' },
        amber: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', gradient: 'from-amber-400 to-orange-500' },
        emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', gradient: 'from-emerald-400 to-green-600' },
        secondary: { bg: 'bg-secondary/10', text: 'text-secondary', gradient: 'from-secondary to-cyan-500' },
    };
    const styles = toneMap[tone] || toneMap.primary;
    const Comp = onClick ? 'button' : 'div';
    return (
        <Comp onClick={onClick} className={`group relative overflow-hidden bg-surface-light dark:bg-surface-dark rounded-2xl p-4 sm:p-5 border border-border-color dark:border-slate-700/50 shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-300 text-start ${onClick ? 'cursor-pointer' : ''}`}>
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${styles.bg}`}>
                    <span className={`material-symbols-outlined ${styles.text} text-lg`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </div>
                {onClick && (<span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-base opacity-0 group-hover:opacity-100 transition-opacity rtl-flip">arrow_forward</span>)}
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-text-main dark:text-gray-100 mb-1 leading-none">{value}</div>
            <p className="text-[10px] sm:text-xs font-bold text-text-muted dark:text-gray-400 uppercase tracking-wider line-clamp-1">{label}</p>
            <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
        </Comp>
    );
};

const QuickAction = ({ icon, label, accent, badge, onClick }) => (
    <button onClick={onClick} className="group relative bg-surface-light dark:bg-surface-dark rounded-2xl p-4 border border-border-color dark:border-slate-700/50 shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-300 text-start overflow-hidden">
        <div className={`size-10 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
            <span className="material-symbols-outlined text-white text-lg">{icon}</span>
        </div>
        <p className="font-bold text-sm text-text-main dark:text-gray-100 leading-tight">{label}</p>
        {badge !== undefined && (
            <span className="absolute top-3 end-3 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{badge}</span>
        )}
    </button>
);

const InfoRow = ({ icon, value, href, external, mono }) => {
    const cls = `text-xs font-semibold text-slate-700 dark:text-slate-200 truncate ${mono ? 'font-mono' : ''}`;
    return (
        <li className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-base flex-shrink-0">{icon}</span>
            {href ? (
                <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={`${cls} hover:text-primary transition-colors flex-1 min-w-0`}>{value}</a>
            ) : (
                <span className={`${cls} flex-1 min-w-0`}>{value}</span>
            )}
        </li>
    );
};

const ApplicationRow = ({ app, getStatusInfo, t, localeCode, onClick }) => {
    const info = getStatusInfo(app.status);
    const dateApplied = new Date(app.createdAt).toLocaleDateString(localeCode, { month: 'short', day: 'numeric' });
    const statusStep = app.status === 'applied' ? 1 : ['accepted', 'rejected'].includes(app.status) ? 2 : app.status === 'validated' ? 3 : 0;
    return (
        <li>
            <button onClick={onClick} className="w-full text-start group bg-surface-light dark:bg-surface-dark rounded-2xl p-4 sm:p-5 border border-border-color dark:border-slate-700/50 shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center justify-center p-1 overflow-hidden shadow-sm flex-shrink-0">
                        {app.offerId?.companyId?.logo ? (
                            <img alt="" className="w-full h-full object-contain" src={`http://localhost:3000${app.offerId.companyId.logo}`} />
                        ) : (
                            <span className="material-symbols-outlined text-gray-400">business</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-sm sm:text-base text-text-main dark:text-gray-100 truncate group-hover:text-primary transition-colors">
                            {app.offerId?.title || t('dashboard.position')}
                        </h3>
                        <p className="text-xs text-text-muted dark:text-gray-400 truncate flex items-center gap-1.5">
                            <span>{app.offerId?.companyId?.companyName || t('dashboard.company')}</span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span>{dateApplied}</span>
                        </p>
                    </div>
                    <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-${info.color}-100 dark:bg-${info.color}-900/20 text-${info.color}-700 dark:text-${info.color}-400 border border-${info.color}-200 dark:border-${info.color}-800/30 flex-shrink-0`}>
                        <span className="material-symbols-outlined text-sm">{info.icon}</span>
                        {info.text}
                    </span>
                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-base group-hover:text-primary transition-colors rtl-flip flex-shrink-0">chevron_right</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${app.status === 'rejected' ? 'bg-red-500' : app.status === 'validated' ? 'bg-emerald-500' : app.status === 'accepted' ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{ width: `${(statusStep / 3) * 100}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-text-muted dark:text-gray-400 sm:hidden">{info.text}</span>
                </div>
            </button>
        </li>
    );
};

const EmptyState = ({ icon, title, subtitle, ctaLabel, ctaIcon, onCta }) => (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 sm:p-10 border border-dashed border-border-color dark:border-slate-700/50 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
        </div>
        <div>
            <p className="font-display text-base font-bold text-text-main dark:text-gray-100 mb-1">{title}</p>
            {subtitle && <p className="text-text-muted dark:text-gray-400 text-sm">{subtitle}</p>}
        </div>
        {onCta && (
            <button onClick={onCta} className="bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all text-sm flex items-center gap-2 shadow-md shadow-primary/20">
                <span className="material-symbols-outlined text-base">{ctaIcon}</span>
                {ctaLabel}
            </button>
        )}
    </div>
);

export default StudentDashboard;
