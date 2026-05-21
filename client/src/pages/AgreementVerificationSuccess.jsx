import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';

const AgreementVerificationSuccess = () => {
    const { id } = useParams();
    const [application, setApplication] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplication = async () => {
            if (!id || id === 'DEMO') {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`/api/public/verify-agreement/${id}`);
                const data = await res.json();
                if (res.ok && data.success) {
                    setApplication(data.application);
                    setAdmin(data.admin);
                }
            } catch {
                console.error("Failed to load application data");
            } finally {
                setLoading(false);
            }
        };
        fetchApplication();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#121121] flex justify-center items-center">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
            </div>
        );
    }

    const offer = application?.offerId;

    // Process the deeply populated structure
    const data = application ? {
        studentName: application.studentId ? `${application.studentId.name}` : application.studentName || "Amine Benali",
        companyName: application.offerId?.companyId?.companyName || application.companyName || "TechCorp Solutions Inc.",
        duration: offer ?
            `${offer.createdAt ? moment(offer.createdAt).format('MMMM Do, YYYY') : moment().format('MMMM Do, YYYY')} — ${offer.durationMonths ? moment(offer.createdAt).add(offer.durationMonths, 'months').format('MMMM Do, YYYY') : moment().add(6, 'months').format('MMMM Do, YYYY')}`
            : "April 11th, 2026 — May 11th, 2026",
        universityName: admin?.universityName || application.studentId?.university || "University of Constantine 2",
        universityLogo: admin?.profilePicture || ""
    } : {
        studentName: "Salah",
        companyName: "Youcef / HR Management",
        duration: "April 11th, 2026 — May 11th, 2026",
        universityName: "University of Constantine 2",
        universityLogo: ""
    };

    return (
        <div className="bg-[#F8FAFC] dark:bg-[#121121] text-slate-900 dark:text-white min-h-screen font-body pb-24 md:pb-0 pt-16">
            <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center h-16 px-4 max-w-7xl mx-auto w-full">
                    <button className="text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors p-2 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
                    </button>
                    <h1 className="font-space-grotesk text-sm md:text-lg font-bold tracking-tight text-indigo-600 dark:text-indigo-400">Agreement Verifier</h1>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors p-2 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[24px]">account_circle</span>
                    </button>
                </div>
            </header>

            <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-144px)]">
                <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] border border-slate-200 dark:border-slate-700 overflow-hidden relative">
                    {/* Decorative Top Accent */}
                    <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-emerald-400"></div>
                    <div className="p-6 flex flex-col items-center text-center">
                        {/* Success Badge */}
                        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 relative z-10 shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                            <span className="material-symbols-outlined text-[40px] text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        </div>
                        <h2 className="font-space-grotesk text-2xl font-bold text-slate-900 dark:text-white mb-2">Authentic Document</h2>
                        <p className="font-body text-[15px] text-slate-500 dark:text-slate-400 mb-6">This internship agreement has been digitally verified and is currently active.</p>

                        {/* Data Display */}
                        <div className="w-full bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4 text-left mb-6 border border-slate-200 dark:border-slate-700">
                            <div className="mb-4 pb-2 border-b border-slate-200 dark:border-slate-700 last:border-0 last:mb-0 last:pb-0">
                                <span className="block font-inter text-[12px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase mb-1">Student</span>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-indigo-600 dark:text-indigo-400">person</span>
                                    <span className="font-inter text-[18px] font-semibold text-slate-900 dark:text-white">{data.studentName}</span>
                                </div>
                            </div>
                            <div className="mb-4 pb-2 border-b border-slate-200 dark:border-slate-700 last:border-0 last:mb-0 last:pb-0">
                                <span className="block font-inter text-[12px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase mb-1">Host Company</span>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-indigo-600 dark:text-indigo-400">corporate_fare</span>
                                    <span className="font-body text-[15px] text-slate-900 dark:text-white font-medium">{data.companyName}</span>
                                </div>
                            </div>
                            <div className="mb-4 pb-2 border-b border-slate-200 dark:border-slate-700 last:border-0 last:mb-0 last:pb-0">
                                <span className="block font-inter text-[12px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase mb-1">Duration</span>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-indigo-600 dark:text-indigo-400">calendar_month</span>
                                    <span className="font-body text-[15px] text-slate-900 dark:text-white font-medium">{data.duration}</span>
                                </div>
                            </div>
                            <div className="pt-2">
                                <span className="block font-inter text-[12px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase mb-1">Validated By</span>
                                <div className="flex items-center gap-3">
                                    {data.universityLogo ? (
                                        <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-1 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                                            <img src={data.universityLogo} alt="University Logo" className="w-full h-full object-contain" />
                                        </div>
                                    ) : (
                                        <span className="material-symbols-outlined text-[20px] text-indigo-600 dark:text-indigo-400 shrink-0">school</span>
                                    )}
                                    <div>
                                        <span className="font-body text-[15px] text-slate-900 dark:text-white font-semibold block leading-tight">{data.universityName}</span>
                                        <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Officially Validated via Digital Seal</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action */}
                        {/* <button className="w-full bg-indigo-600 text-white font-inter text-[18px] font-semibold py-3 px-6 rounded-full hover:shadow-[0_10px_15px_-3px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            Download Record
                        </button> */}
                    </div>
                </div>
            </main>

            {/* BottomNavBar (Mobile Only) */}
            <nav className="md:hidden fixed bottom-0 w-full z-50 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center h-20 px-6 pb-safe w-full">
                    <Link to="#" className="flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl px-4 py-1 hover:text-indigo-500 dark:hover:text-indigo-300">
                        <span className="material-symbols-outlined mb-1 text-[24px]">qr_code_scanner</span>
                        <span className="font-space-grotesk text-[10px] font-bold tracking-wider uppercase">Scan</span>
                    </Link>
                    <Link to="#" className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-300">
                        <span className="material-symbols-outlined mb-1 text-[24px]">history</span>
                        <span className="font-space-grotesk text-[10px] font-bold tracking-wider uppercase">History</span>
                    </Link>
                    <Link to="#" className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-300">
                        <span className="material-symbols-outlined mb-1 text-[24px]">contact_support</span>
                        <span className="font-space-grotesk text-[10px] font-bold tracking-wider uppercase">Support</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default AgreementVerificationSuccess;
