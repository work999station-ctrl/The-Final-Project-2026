import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import CompanyNavbar from '../components/CompanyNavbar';
import logoImage from '../assets/logo.png';
import { QRCodeSVG } from 'qrcode.react';

const CompanyStatistics = () => {
    const navigate = useNavigate();
    const { t, lang, setLang } = useLang();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [company, setCompany] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, companyRes] = await Promise.all([
                    fetch('/api/company/dashboard-stats'),
                    fetch('/api/company/me')
                ]);
                const statsData = await statsRes.json();
                const companyData = await companyRes.json();
                if (statsRes.ok && statsData.success) setStats(statsData.stats);
                if (companyRes.ok && companyData.user) setCompany(companyData.user);
            } catch (error) {
                console.error("Failed to fetch statistics:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
                <CompanyNavbar company={company} />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 font-display uppercase tracking-widest">{t('statistics.compiling')}</p>
                </div>
            </div>
        );
    }

    const s = stats || {};
    const totalApplicants = s.totalApplicants || 0;
    const pendingReviews = s.pendingReviews || 0;
    const acceptedCount = s.acceptedCount || 0;
    const rejectedCount = s.rejectedCount || 0;
    const hiredCount = s.hiredCount || 0;
    const activeOffers = s.activeOffers || 0;
    const totalOffers = s.totalOffers || 0;
    const closedOffers = s.closedOffers || 0;
    const dailyApplications = s.dailyApplications || [];
    const applicantGrowth = s.applicantGrowth || "0.0";
    const offersGrowth = s.offersGrowth || "0.0";

    const reviewed = totalApplicants - pendingReviews;
    const acceptanceRate = reviewed > 0 ? ((acceptedCount / reviewed) * 100).toFixed(1) : "0.0";
    const pendingRate = totalApplicants > 0 ? ((pendingReviews / totalApplicants) * 100).toFixed(1) : "0.0";
    const maxDaily = Math.max(...dailyApplications.map(d => d.count), 1);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-body flex flex-col print:bg-white print:pt-0 print:block">
            {/* Standard Navbar - Hidden in Print */}
            <div className="print:hidden">
                <CompanyNavbar company={company} />
            </div>

            {/* Print Custom Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { margin: 0; size: A4; }
                    body { margin: 0; padding: 0 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .print-container { 
                        width: 100% !important; 
                        max-width: none !important; 
                        box-shadow: none !important; 
                        border: none !important; 
                        padding: 2cm !important;
                        margin: 0 !important;
                        background: white !important;
                    }
                    .dark { background: white !important; color: black !important; }
                    .no-print { display: none !important; }
                }
            ` }} />

            {/* MAIN CONTENT AREA */}
            <main className="max-w-[1600px] mx-auto w-full p-6 lg:p-12 flex-1 print:p-0 print:max-w-none">
                
                {/* SCREEN ONLY HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-8 mb-10 print:hidden">
                    <div>
                        <h1 className="text-4xl font-bold font-display tracking-tight text-slate-900 dark:text-white uppercase">{t('statistics.title')}</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base mt-2 font-medium">{t('statistics.subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-6 mt-6 md:mt-0">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{t('statistics.generatedOn')}</p>
                            <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{new Date().toLocaleDateString('en-GB')}</p>
                        </div>
                        <button 
                            onClick={() => window.print()}
                            className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none"
                        >
                            <span className="material-symbols-outlined text-lg">print</span>
                            <span>{t('statistics.exportReport')}</span>
                        </button>
                    </div>
                </div>

                {/* THE OFFICIAL DOCUMENT */}
                <div className="print-container bg-white dark:bg-transparent rounded-3xl overflow-hidden print:overflow-visible print:rounded-none relative shadow-soft print:shadow-none">
                    
                    {/* Watermark (Print Only) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0 hidden print:flex">
                        <span className="font-display font-bold text-[120px] -rotate-45 text-slate-900 uppercase">Official Analytics</span>
                    </div>

                    <div className="relative z-10 print:bg-white p-2 sm:p-0">
                        
                        {/* OFFICIAL HEADER */}
                        <div className="hidden print:flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-10">
                            <div className="flex items-center gap-4">
                                <img src={logoImage} alt="stag.io" className="h-14 w-auto object-contain dark:brightness-0 dark:invert dark:sepia dark:saturate-[10] dark:hue-rotate-[350deg] mix-blend-multiply dark:mix-blend-screen" />
                                <div className="h-12 w-px bg-slate-300"></div>
                                <div>
                                    <h2 className="font-display font-bold text-2xl uppercase tracking-tighter text-slate-900">STAG.IO</h2>
                                    <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em]">{t('statistics.gateway')}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h3 className="font-display font-bold text-slate-900 text-lg uppercase">{t('statistics.officialReport')}</h3>
                                <p className="font-mono text-xs text-slate-500">Ref: ST-REP-{company?._id?.slice(-6).toUpperCase()}-{new Date().getFullYear()}</p>
                            </div>
                        </div>

                        {/* Summary Block */}
                        <div className="hidden print:grid grid-cols-2 gap-8 mb-10 bg-slate-50 p-6 border border-slate-200 rounded-xl">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('statistics.companyEntity')}</p>
                                <p className="text-lg font-bold text-slate-900">{company?.companyName}</p>
                                <p className="text-xs text-slate-500 mt-1 italic">{t('statistics.verifiedPartner')} {new Date(company?.createdAt).getFullYear() || 2026}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('statistics.reportingPeriod')}</p>
                                <p className="text-lg font-bold text-slate-900">{t('statistics.annualReview')} - {new Date().getFullYear()}</p>
                                <p className="text-xs text-slate-500 mt-1 font-mono">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                        </div>

                        {/* DATA SECTIONS */}
                        <div className="space-y-12">
                            
                            {/* Article 1: Key Performance Indicators */}
                            <section>
                                <div className="hidden print:block mb-6">
                                    <h4 className="font-bold uppercase text-xs tracking-wider border-b border-slate-200 pb-1 mb-4 text-slate-500">{t('statistics.article1')}</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-6">{t('statistics.article1Desc')}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-4">
                                    {[
                                        { label: t('statistics.activeOffers'), value: activeOffers, icon: 'description', color: 'bg-blue-100 text-blue-600', growth: `${offersGrowth}%` },
                                        { label: t('statistics.totalApplicants'), value: totalApplicants, icon: 'group', color: 'bg-indigo-100 text-indigo-600', growth: `${applicantGrowth}%` },
                                        { label: t('statistics.pendingReviews'), value: pendingReviews, icon: 'pending_actions', color: 'bg-amber-100 text-amber-600', growth: pendingReviews > 0 ? t('statistics.urgent') : t('statistics.nominal') },
                                        { label: t('statistics.hiredInterns'), value: hiredCount, icon: 'verified', color: 'bg-emerald-100 text-emerald-600', growth: `${acceptanceRate}% ${t('statistics.yield')}` },
                                    ].map((kpi, i) => (
                                        <div key={i} className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft print:shadow-none print:border-slate-300">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`p-2.5 rounded-xl ${kpi.color} print:scale-90`}>
                                                    <span className="material-symbols-outlined text-xl">{kpi.icon}</span>
                                                </div>
                                                <div className="text-[10px] font-black uppercase tracking-tighter px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded">
                                                    {kpi.growth}
                                                </div>
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-display uppercase tracking-wider">{kpi.label}</p>
                                            <h3 className="text-2xl font-black mt-1 font-display">{kpi.value}</h3>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Article 2: Detailed Operational Breakdown */}
                            <section>
                                <div className="hidden print:block mb-6">
                                    <h4 className="font-bold uppercase text-xs tracking-wider border-b border-slate-200 pb-1 mb-4 text-slate-500">Article 2: Operational Pipeline Analysis</h4>
                                </div>
                                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft overflow-hidden print:shadow-none print:border-slate-300">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                <th className="py-4 px-6 border-b border-slate-100 dark:border-slate-800">{t('statistics.opRef')}</th>
                                                <th className="py-4 px-6 border-b border-slate-100 dark:border-slate-800 text-right">{t('statistics.value')}</th>
                                                <th className="py-4 px-6 border-b border-slate-100 dark:border-slate-800 text-right">{t('statistics.status')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { ref: 'OFF-ACT', name: 'Active Opportunities', val: activeOffers, status: 'Production' },
                                                { ref: 'APP-GROSS', name: 'Total Sourced Talent', val: totalApplicants, status: 'Historical' },
                                                { ref: 'REV-PEN', name: 'Evaluation Backlog', val: pendingReviews, status: 'Queue' },
                                                { ref: 'HIRE-VAL', name: 'Certified Placements', val: acceptedCount, status: 'Finalized' },
                                            ].map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                    <td className="py-4 px-6 border-b border-slate-50 dark:border-slate-800/50 font-bold text-slate-700 dark:text-slate-200">{row.name}</td>
                                                    <td className="py-4 px-6 border-b border-slate-50 dark:border-slate-800/50 text-right font-black font-display text-lg">{row.val}</td>
                                                    <td className="py-4 px-6 border-b border-slate-50 dark:border-slate-800/50 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.status}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Article 3: Temporal Trends (Chart) */}
                            <section className="print:break-inside-avoid">
                                <div className="hidden print:block mb-6">
                                    <h4 className="font-bold uppercase text-xs tracking-wider border-b border-slate-200 pb-1 mb-4 text-slate-500">{t('statistics.article3')}</h4>
                                </div>
                                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft p-8 print:shadow-none print:border-slate-300">
                                    <div className="h-48 flex items-end justify-between gap-[3px] border-l border-b border-slate-100 dark:border-slate-800 pb-2 pl-4">
                                        {dailyApplications.map((day, i) => {
                                            const heightPct = maxDaily > 0 ? (day.count / maxDaily) * 100 : 0;
                                            return (
                                                <div key={i} className="w-full bg-indigo-600/20 rounded-t-[2px] relative group" style={{ height: `${Math.max(heightPct, 4)}%` }}>
                                                    <div className="absolute bottom-0 left-0 w-full bg-indigo-600 rounded-t-[2px]" style={{ height: `${Math.min(heightPct, 100)}%` }}></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between mt-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-4">
                                        <span>{formatDate(dailyApplications[0]?.date)}</span>
                                        <span>{t('statistics.velocityTrendline')}</span>
                                        <span>{formatDate(dailyApplications[dailyApplications.length - 1]?.date)}</span>
                                    </div>
                                </div>
                            </section>

                            {/* QR AUTHENTICITY SECTION */}
                            <section className="hidden print:flex items-center justify-between gap-10 pt-10 mt-10 border-t border-slate-900 border-b border-slate-900 pb-10">
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-2">{t('statistics.authenticity')}</p>
                                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                        {t('statistics.authenticityDesc')}
                                    </p>
                                    <div className="mt-4 flex gap-6">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase">{t('statistics.integrityHash')}</p>
                                            <p className="font-mono text-[9px] text-slate-600 uppercase mt-1">SHA-256: {company?._id?.slice(0, 32).toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase">{t('statistics.validationStatus')}</p>
                                            <p className="text-[9px] font-bold text-emerald-600 uppercase mt-1">✓ {t('statistics.secureVerified')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2 shrink-0">
                                    <div className="p-3 bg-white border-4 border-slate-900 rounded-xl shadow-lg">
                                        <QRCodeSVG
                                            value={`${window.location.origin}/company-statistics?verify=${company?._id}`}
                                            size={100}
                                            level="H"
                                        />
                                    </div>
                                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">{t('statistics.scanToVerify')}</p>
                                </div>
                            </section>

                        </div>

                        {/* Footer */}
                        <div className="hidden print:block text-center mt-12 pb-6 border-t border-slate-100 pt-6">
                            <p className="text-[10px] font-black font-display uppercase tracking-[0.5em] text-slate-900">{t('statistics.allRightsReserved')}</p>
                            <p className="text-[8px] text-slate-400 mt-2 font-mono uppercase">{t('statistics.systemGenerated')}</p>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default CompanyStatistics;
