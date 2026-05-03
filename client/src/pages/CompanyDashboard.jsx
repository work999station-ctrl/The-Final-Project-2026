import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import CompanyNavbar from '../components/CompanyNavbar';
import Footer from '../components/Footer';
import { useLang } from '../contexts/LanguageContext';

const CompanyDashboard = () => {
    const navigate = useNavigate();
    const { t, lang, setLang } = useLang();

    const [company, setCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [offers, setOffers] = useState([]);
    const [isLoadingOffers, setIsLoadingOffers] = useState(true);
    const [offerToDelete, setOfferToDelete] = useState(null);
    const [stats, setStats] = useState({
        activeOffers: 0,
        newApplicants: 0,
        hiredCount: 0,
        pendingReviews: 0
    });

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/company/me');
            if (!res.ok) {
                const errText = await res.text();
                console.error(`Failed to fetch company profile: ${res.status}`, errText);
                setIsLoading(false);
                return;
            }
            const data = await res.json();

            if (data.user) {
                setCompany({
                    companyName: data.user.companyName || 'Unknown Company',
                    description: data.user.description || 'No description provided.',
                    email: data.user.email || '',
                    phoneNumber: data.user.phoneNumber || 'Not set',
                    address: data.user.address || 'Not set',
                    website: data.user.website || 'Not set',
                    logo: data.user.logo || '',
                });

                try {
                    const offersRes = await fetch('/api/company/offers');
                    if (!offersRes.ok) throw new Error(`Offers fetch failed: ${offersRes.status}`);
                    const offersData = await offersRes.json();
                    if (offersData.offers) {
                        setOffers(offersData.offers);
                    }

                    const statsRes = await fetch('/api/company/dashboard-stats');
                    if (!statsRes.ok) throw new Error(`Stats fetch failed: ${statsRes.status}`);
                    const statsData = await statsRes.json();
                    if (statsData.success) {
                        setStats(statsData.stats);
                    }
                } catch (err) {
                    console.error('Error fetching dashboard sub-data:', err);
                } finally {
                    setIsLoadingOffers(false);
                }
            }
        } catch (err) {
            console.error('Network error fetching company profile:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        window.addEventListener('focus', fetchDashboardData);
        return () => window.removeEventListener('focus', fetchDashboardData);
    }, [navigate]);

    const confirmDeleteOffer = async () => {
        if (!offerToDelete) return;
        try {
            const res = await fetch(`/api/offers/${offerToDelete}`, { method: 'DELETE' });
            if (res.ok) {
                setOffers(offers.filter(offer => offer._id !== offerToDelete));
                setOfferToDelete(null);
            } else {
                alert("Failed to delete offer");
                setOfferToDelete(null);
            }
        } catch (err) {
            console.error(err);
            setOfferToDelete(null);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setCompany(prev => ({ ...prev, logo: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    if (isLoading) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center font-body">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center gap-4 text-text-main dark:text-gray-100 font-body">
                <span className="material-symbols-outlined text-6xl text-text-muted dark:text-gray-400">error</span>
                <p>{t('companyDashboard.loadingProfile')}</p>
                <button onClick={() => navigate('/company-Signup')} className="text-primary hover:underline">{t('companyDashboard.returnSignup')}</button>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 min-h-screen flex flex-col font-body">
            <CompanyNavbar company={company} />

            <main className="max-w-[1600px] mx-auto w-full p-6 lg:p-12 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">

                    {/* Left Sidebar: Company Information */}
                    <aside className="lg:col-span-3 space-y-6 sticky top-28">
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color dark:border-slate-700/50 shadow-soft overflow-hidden">

                            <div className="p-8 text-center border-b border-border-color dark:border-slate-700/50">
                                <label className="relative cursor-pointer group flex mx-auto h-24 w-24 rounded-2xl bg-primary/10 border-2 border-primary/20 items-center justify-center overflow-hidden mb-4 transition-transform hover:scale-105">
                                    {company.logo ? (
                                        <img src={company.logo} alt="Company logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-5xl text-primary">corporate_fare</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                </label>

                                <h2 className="text-2xl font-bold font-display text-text-main dark:text-gray-100">
                                    {company.companyName}
                                </h2>
                                <p className="text-sm text-text-muted dark:text-gray-400 mt-1">{t('companyDashboard.enterprisePartner')}</p>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-gray-400">{t('companyDashboard.about')}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {company.description}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-gray-400">{t('companyDashboard.contactDetails')}</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 w-full">
                                            <span className="material-symbols-outlined text-primary text-lg">mail</span>
                                            <a href={`mailto:${company.email}`} className="text-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-colors truncate">
                                                {company.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3 w-full">
                                            <span className="material-symbols-outlined text-primary text-lg">phone</span>
                                            <span className="text-sm text-slate-600 dark:text-slate-300 truncate">
                                                {company.phoneNumber}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 w-full">
                                            <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                            <span className="text-sm text-slate-600 dark:text-slate-300 truncate">
                                                {company.address}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 w-full">
                                            <span className="material-symbols-outlined text-primary text-lg">language</span>
                                            <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-colors truncate">
                                                {company.website}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => navigate('/edit-company-profile')}
                                        className="w-full py-3 px-4 rounded-xl border border-primary/20 text-primary font-semibold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                        {t('companyDashboard.editProfile')}
                                    </button>
                                    <button
                                        onClick={async () => {
                                            await fetch('/api/logout', { method: 'POST' });
                                            window.location.href = '/';
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all border border-red-100 group shadow-sm shadow-red-50"
                                    >
                                        <span className="material-symbols-outlined text-lg">logout</span>
                                        {t('companyDashboard.logout')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right Content Area */}
                    <div className="lg:col-span-9 space-y-8">

                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold font-display tracking-tight text-text-main dark:text-gray-100">{t('companyDashboard.portalTitle')}</h1>
                                <p className="text-text-muted dark:text-gray-400 mt-1">{t('companyDashboard.portalSubtitle')}</p>
                            </div>
                            <button onClick={() => navigate('/create-offer')} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95">
                                <span className="material-symbols-outlined">add</span>
                                <span>{t('companyDashboard.createNewOffer')}</span>
                            </button>
                        </div>

                        {/* KPI Cards Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-color dark:border-slate-700/50 shadow-soft hover:shadow-lift transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                                        <span className="material-symbols-outlined">description</span>
                                    </div>
                                    <span className="text-emerald-500 text-xs font-bold flex items-center">{t('companyDashboard.live')} <span className="material-symbols-outlined text-xs ml-0.5">rss_feed</span></span>
                                </div>
                                <p className="text-text-muted dark:text-gray-400 text-sm font-medium">{t('companyDashboard.activeOffers')}</p>
                                <h3 className="text-2xl font-bold mt-1 text-text-main dark:text-gray-100 font-display">{stats.activeOffers}</h3>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-color dark:border-slate-700/50 shadow-soft hover:shadow-lift transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-primary/10 text-primary rounded-full">
                                        <span className="material-symbols-outlined">group</span>
                                    </div>
                                    <span className="text-emerald-500 text-xs font-bold flex items-center">{t('companyDashboard.new')} <span className="material-symbols-outlined text-xs ml-0.5">trending_up</span></span>
                                </div>
                                <p className="text-text-muted dark:text-gray-400 text-sm font-medium">{t('companyDashboard.recentApplicants')}</p>
                                <h3 className="text-2xl font-bold mt-1 text-text-main dark:text-gray-100 font-display">{stats.newApplicants}</h3>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-color dark:border-slate-700/50 shadow-soft hover:shadow-lift transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full">
                                        <span className="material-symbols-outlined">pending_actions</span>
                                    </div>
                                    <span className="text-text-muted dark:text-gray-400 text-xs font-bold flex items-center">{t('companyDashboard.toReview')} <span className="material-symbols-outlined text-xs ml-0.5">visibility</span></span>
                                </div>
                                <p className="text-text-muted dark:text-gray-400 text-sm font-medium">{t('companyDashboard.pendingReviews')}</p>
                                <h3 className="text-2xl font-bold mt-1 text-text-main dark:text-gray-100 font-display">{stats.pendingReviews}</h3>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-color dark:border-slate-700/50 shadow-soft hover:shadow-lift transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full">
                                        <span className="material-symbols-outlined">verified</span>
                                    </div>
                                    <span className="text-emerald-500 text-xs font-bold flex items-center">{t('companyDashboard.total')} <span className="material-symbols-outlined text-xs ml-0.5">check_circle</span></span>
                                </div>
                                <p className="text-text-muted dark:text-gray-400 text-sm font-medium">{t('companyDashboard.validatedInterns')}</p>
                                <h3 className="text-2xl font-bold mt-1 text-text-main dark:text-gray-100 font-display">{stats.hiredCount}</h3>
                            </div>
                        </div>

                        {/* Main Grid Layout */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                            {/* Left Main Column: Active Internship Offers */}
                            <div className="xl:col-span-8 space-y-6">
                                <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color dark:border-slate-700/50 shadow-soft overflow-hidden flex flex-col h-full">
                                    <div className="p-6 border-b border-border-color dark:border-slate-700/50 flex items-center justify-between">
                                        <h2 className="text-xl font-bold font-display text-text-main dark:text-gray-100">{t('companyDashboard.activeInternshipOffers')}</h2>
                                        <button onClick={() => navigate('/company-offers')} className="text-primary text-sm font-semibold hover:underline">{t('companyDashboard.viewAll')}</button>
                                    </div>
                                    <div className="divide-y divide-border-color dark:divide-slate-700/50 flex-1">
                                        {isLoadingOffers ? (
                                            <div className="p-6 text-center text-text-muted dark:text-gray-400">{t('companyDashboard.loadingOffers')}</div>
                                        ) : offers.length === 0 ? (
                                            <div className="p-6 flex flex-col items-center justify-center text-center">
                                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">inbox</span>
                                                <h4 className="font-semibold text-text-main dark:text-gray-100">{t('companyDashboard.noActiveOffers')}</h4>
                                                <p className="text-sm text-text-muted dark:text-gray-400">{t('companyDashboard.noActiveOffersSub')}</p>
                                            </div>
                                        ) : (
                                            offers.slice(0, 5).map((offer) => (
                                                <div key={offer._id} onClick={() => navigate(`/offer-details/${offer._id}`)} className="p-8 relative hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer">
                                                    {/* Top-right Time */}
                                                    <div className="absolute top-6 right-8 text-text-muted dark:text-gray-400 text-xs font-semibold tracking-wide">
                                                        {moment(offer.createdAt).startOf('day').fromNow()}
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex flex-shrink-0 items-center justify-center text-primary overflow-hidden">
                                                            {company.logo ? (
                                                                <img src={company.logo} alt="logo" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="material-symbols-outlined text-3xl">terminal</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col justify-center py-1">
                                                            <h4 className="font-bold font-display text-lg text-text-main dark:text-gray-100 mb-0.5">{offer.title}</h4>
                                                            <div className="flex items-center gap-4 text-sm text-text-muted dark:text-gray-400 mt-1">
                                                                <span className="flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                                                    {offer.slotsAvailable} {t('companyDashboard.totalSeats')}
                                                                </span>
                                                                <span className="flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-[18px]">paid</span>
                                                                    {offer.salary}.00 DA
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md border border-border-color dark:border-slate-700/50">
                                                                    {offer.internshipType}
                                                                </span>
                                                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md border border-border-color dark:border-slate-700/50 flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                                                    {offer.durationMonths} {t('companyDashboard.months')}
                                                                </span>
                                                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md border border-border-color dark:border-slate-700/50 flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-[16px]">group</span>
                                                                    {offer.applicantCount || 0} {t('companyDashboard.applicants')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {(() => {
                                                            const isClosed = offer.status === 'Closed' || (offer.endDateOfApplay && moment().isAfter(moment(offer.endDateOfApplay).endOf('day')));
                                                            return (
                                                                <span className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase ${isClosed ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                                                    {isClosed ? t('companyDashboard.closed') : t('companyDashboard.open')}
                                                                </span>
                                                            );
                                                        })()}
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                className="p-2.5 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700 rounded-full transition-colors flex-shrink-0 text-text-muted dark:text-gray-400 hover:text-primary"
                                                                title={t('companyDashboard.editOffer')}
                                                                onClick={(e) => { e.stopPropagation(); navigate(`/edit-offer/${offer._id}`); }}
                                                            >
                                                                <span className="material-symbols-outlined text-base">edit</span>
                                                            </button>
                                                            <button
                                                                className="p-2.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors flex-shrink-0 text-text-muted dark:text-gray-400 hover:text-red-500"
                                                                title={t('companyDashboard.deleteOffer')}
                                                                onClick={(e) => { e.stopPropagation(); setOfferToDelete(offer._id); }}
                                                            >
                                                                <span className="material-symbols-outlined text-base">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar Inset: Recent Activity & Quick Actions */}
                            <div className="xl:col-span-4 space-y-8">

                                {/* Quick Actions */}
                                <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color dark:border-slate-700/50 shadow-soft overflow-hidden">
                                    <div className="p-6 border-b border-border-color dark:border-slate-700/50">
                                        <h2 className="text-lg font-bold font-display text-text-main dark:text-gray-100">{t('companyDashboard.quickActions')}</h2>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 gap-3">
                                        <button onClick={() => navigate('/company-direct-messages')} className="flex flex-col items-center justify-center p-4 rounded-xl border border-border-color dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all gap-2 group text-text-main dark:text-gray-100">
                                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">chat</span>
                                            <span className="text-xs font-semibold text-center">{t('companyDashboard.directMessages')}</span>
                                        </button>
                                        <button onClick={() => navigate('/company-statistics')} className="flex flex-col items-center justify-center p-4 rounded-xl border border-border-color dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all gap-2 group text-text-main dark:text-gray-100">
                                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">bar_chart</span>
                                            <span className="text-xs font-semibold text-center">{t('companyDashboard.exportReports')}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Delete Offer Confirmation Modal */}
            {offerToDelete && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-border-color dark:border-slate-700/50">
                        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 rounded-full flex items-center justify-center text-rose-600 mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <h3 className="text-2xl font-black text-text-main dark:text-gray-100 font-display tracking-tight mb-2">{t('companyDashboard.deleteOfferTitle')}</h3>
                        <p className="text-text-muted dark:text-gray-400 text-sm mb-8 font-medium leading-relaxed">{t('companyDashboard.deleteOfferSub')}</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setOfferToDelete(null)} 
                                className="flex-1 py-3 bg-white dark:bg-slate-800 border border-border-color dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 text-text-main dark:text-gray-100 font-bold text-sm uppercase tracking-wider rounded-xl transition-all"
                            >
                                {t('companyDashboard.cancel')}
                            </button>
                            <button 
                                onClick={() => confirmDeleteOffer()} 
                                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-rose-600/20"
                            >
                                {t('companyDashboard.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyDashboard;
