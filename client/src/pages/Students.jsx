import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';
import LandingNavBar from '../components/LandingNavBar';
import { useLang } from '../contexts/LanguageContext';

const Students = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const { t, isRTL } = useLang();

    useEffect(() => {
        window.scrollTo(0, 0);
        const checkAuth = async () => {
            try {
                const [studentRes, companyRes, adminRes] = await Promise.all([
                    fetch('/api/student/me').catch(() => ({ ok: false })),
                    fetch('/api/company/me').catch(() => ({ ok: false })),
                    fetch('/api/admin/me').catch(() => ({ ok: false }))
                ]);
                
                if (studentRes.ok) {
                    const data = await studentRes.json();
                    setUserRole(data.user?.role || 'student');
                } else if (companyRes.ok) {
                    const data = await companyRes.json();
                    setUserRole(data.user?.role || 'company');
                } else if (adminRes.ok) {
                    const data = await adminRes.json();
                    setUserRole(data.user?.role || 'admin');
                }
            } catch (err) { /* ignore */ }
        };
        checkAuth();
    }, []);

    let browseOffersLink = '/login';
    if (userRole === 'student') browseOffersLink = '/opportunities';
    else if (userRole === 'company') browseOffersLink = '/create-offer';
    else if (userRole === 'admin') browseOffersLink = '/candidate-tracking-admin';

    return (
        <div className={`bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-body min-h-screen antialiased flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
            {/* Navigation */}
            <LandingNavBar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-32">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                <span>{t('studentsPage.hero.badge')}</span>
                            </div>
                            <h1 className="font-display text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
                                {t('studentsPage.hero.title1')} <span className="text-primary">{t('studentsPage.hero.title2')}</span>
                            </h1>
                            <p className="font-body text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                                {t('studentsPage.hero.subtitle')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/student-signup" className="bg-primary text-white font-display font-bold px-8 py-4 rounded-full shadow-xl shadow-primary/25 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                                    {t('studentsPage.hero.ctaPrimary')}
                                    <span className={`material-symbols-outlined text-sm ${isRTL ? 'rotate-180' : ''}`}>arrow_forward</span>
                                </Link>
                                <Link to={browseOffersLink} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-display font-bold px-8 py-4 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 flex items-center justify-center">
                                    {t('studentsPage.hero.ctaSecondary')}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -z-10 opacity-20 dark:opacity-40">
                        <div className="w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                    </div>
                </section>

                {/* Match Card Preview */}
                <section className="py-20 bg-white dark:bg-slate-900">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="order-2 lg:order-1">
                                <div className="relative">
                                    <div className="bg-slate-950 rounded-3xl p-8 shadow-2xl border border-slate-800 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-slate-950 font-black text-xl">S</div>
                                            <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{t('studentsPage.match.badge')}</div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{t('studentsPage.match.role')}</h3>
                                        <p className="text-slate-400 mb-6 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            {t('studentsPage.match.location')}
                                        </p>
                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">{t('studentsPage.match.scoreLabel')}</span>
                                                <span className="text-emerald-400 font-bold">98%</span>
                                            </div>
                                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                                <div className="bg-emerald-400 h-full w-[98%]"></div>
                                            </div>
                                        </div>
                                        <button className="w-full bg-primary text-white font-bold py-3 rounded-xl">{t('studentsPage.match.applyBtn')}</button>
                                    </div>
                                    <div className={`absolute -bottom-6 ${isRTL ? '-left-6' : '-right-6'} bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 max-w-xs transform ${isRTL ? '-rotate-3' : 'rotate-3'}`}>
                                        <p className="text-sm font-medium italic text-slate-600 dark:text-slate-300">
                                            {t('studentsPage.match.testimonial')}
                                        </p>
                                        <div className="mt-4 flex items-center gap-3">
                                            <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                                            <div>
                                                <p className="text-xs font-bold dark:text-white">{t('studentsPage.match.testimName')}</p>
                                                <p className="text-[10px] text-slate-400">{t('studentsPage.match.testimRole')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <h2 className="font-display text-4xl font-bold mb-6 tracking-tight">{t('studentsPage.features.title')}</h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                    {t('studentsPage.features.subtitle')}
                                </p>
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                            <span className="material-symbols-outlined">psychology</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">{t('studentsPage.features.f1Title')}</h4>
                                            <p className="text-slate-500 text-sm">{t('studentsPage.features.f1Desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                            <span className="material-symbols-outlined">touch_app</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">{t('studentsPage.features.f2Title')}</h4>
                                            <p className="text-slate-500 text-sm">{t('studentsPage.features.f2Desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                            <span className="material-symbols-outlined">verified</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">{t('studentsPage.features.f3Title')}</h4>
                                            <p className="text-slate-500 text-sm">{t('studentsPage.features.f3Desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Steps Section */}
                <section className="py-32">
                    <div className="max-w-7xl mx-auto px-6 text-center mb-20">
                        <h2 className="font-display text-4xl font-bold mb-4 tracking-tight">{t('studentsPage.steps.title')}</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">{t('studentsPage.steps.subtitle')}</p>
                    </div>
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: t('studentsPage.steps.s1Title'), desc: t('studentsPage.steps.s1Desc') },
                            { step: '02', title: t('studentsPage.steps.s2Title'), desc: t('studentsPage.steps.s2Desc') },
                            { step: '03', title: t('studentsPage.steps.s3Title'), desc: t('studentsPage.steps.s3Desc') },
                            { step: '04', title: t('studentsPage.steps.s4Title'), desc: t('studentsPage.steps.s4Desc') }
                        ].map((item, i) => (
                            <div key={i} className="relative group">
                                <div className={`text-6xl font-display font-black text-slate-200 dark:text-slate-800 mb-4 transition-colors group-hover:text-primary/20 ${isRTL ? 'text-right' : ''}`}>{item.step}</div>
                                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-20 text-center">
                        <Link to="/student-signup" className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-display font-bold px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all">
                            {t('studentsPage.steps.cta')}
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Students;
