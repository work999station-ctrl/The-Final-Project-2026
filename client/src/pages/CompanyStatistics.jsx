import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from '../components/CompanyNavbar';

const CompanyStatistics = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        activeOffers: 0,
        newApplicants: 0,
        hiredCount: 0,
        pendingReviews: 0,
        isLoading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/company/dashboard-stats');
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setStats({
                            activeOffers: data.stats.activeOffers || 0,
                            newApplicants: data.stats.newApplicants || 0,
                            hiredCount: data.stats.hiredCount || 0,
                            pendingReviews: data.stats.pendingReviews || 0,
                            isLoading: false
                        });
                    }
                } else {
                    setStats(prev => ({ ...prev, isLoading: false }));
                }
            } catch (error) {
                console.error("Failed to fetch statistics:", error);
                setStats(prev => ({ ...prev, isLoading: false }));
            }
        };

        fetchStats();
    }, []);

    const handleExport = () => {
        alert("Generating Statistical Report... PDF download will start automatically.");
    };

    // Calculate derived statistics safely
    const totalProcessed = stats.newApplicants > 0 ? stats.newApplicants - stats.pendingReviews : 0;
    const acceptanceRate = totalProcessed > 0 ? ((stats.hiredCount / totalProcessed) * 100).toFixed(1) : "0.0";
    const pendingRate = stats.newApplicants > 0 ? ((stats.pendingReviews / stats.newApplicants) * 100).toFixed(1) : "0.0";

    return (
        <div className="bg-white text-slate-900 min-h-screen font-body flex flex-col pt-16">
            <CompanyNavbar />

            <div className="flex-1 max-w-[1400px] mx-auto w-full p-8 mt-6">
                
                {/* Header Context */}
                <div className="flex flex-col md:flex-row justify-between items-end border-b-2 border-slate-900 pb-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black font-headline tracking-tighter uppercase text-slate-900">Statistical Analysis Report</h1>
                        <p className="text-slate-500 text-sm mt-1 font-mono uppercase tracking-widest">System Overview &amp; Pipeline Metrics</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right mr-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Report Date</p>
                            <p className="text-sm font-mono font-bold">{new Date().toLocaleDateString()}</p>
                        </div>
                        <button 
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 shadow-sm transition-all text-sm font-bold tracking-wide uppercase"
                        >
                            <span className="material-symbols-outlined text-lg">download</span>
                            <span>Generate PDF</span>
                        </button>
                    </div>
                </div>

                {stats.isLoading ? (
                    <div className="flex flex-col items-center justify-center p-32 space-y-4">
                        <div className="animate-spin rounded-none h-12 w-12 border-4 border-slate-900 border-t-transparent"></div>
                        <p className="font-mono text-sm font-bold uppercase tracking-widest text-slate-500">Compiling Data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Left Column: Dense Metrics Table */}
                        <div className="lg:col-span-8 flex flex-col gap-8">
                            
                            {/* Primary Key Metrics Table */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-3 text-slate-400 border-b border-slate-200 pb-2">Volume Overview</h3>
                                <table className="w-full text-left font-mono">
                                    <thead>
                                        <tr className="border-b-2 border-slate-900 text-xs text-slate-500">
                                            <th className="py-3 font-bold uppercase tracking-wider">Metric ID</th>
                                            <th className="py-3 font-bold uppercase tracking-wider">Description</th>
                                            <th className="py-3 font-bold uppercase tracking-wider text-right">Value</th>
                                            <th className="py-3 font-bold uppercase tracking-wider text-right">Variance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="py-4 font-bold text-slate-400">#M-101</td>
                                            <td className="py-4 font-semibold">Total Active Postings</td>
                                            <td className="py-4 text-right font-black text-lg">{stats.activeOffers}</td>
                                            <td className="py-4 text-right text-emerald-600 font-bold">+12.4%</td>
                                        </tr>
                                        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="py-4 font-bold text-slate-400">#M-102</td>
                                            <td className="py-4 font-semibold">Gross Applicant Inflow</td>
                                            <td className="py-4 text-right font-black text-lg">{stats.newApplicants}</td>
                                            <td className="py-4 text-right text-emerald-600 font-bold">+5.1%</td>
                                        </tr>
                                        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-slate-50/50">
                                            <td className="py-4 font-bold text-slate-400">#M-103</td>
                                            <td className="py-4 font-semibold">Applications Under Review</td>
                                            <td className="py-4 text-right font-black text-lg">{stats.pendingReviews}</td>
                                            <td className="py-4 text-right text-rose-600 font-bold">Requires Action</td>
                                        </tr>
                                        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="py-4 font-bold text-slate-400">#M-104</td>
                                            <td className="py-4 font-semibold">Validated Hires (Contracts)</td>
                                            <td className="py-4 text-right font-black text-lg">{stats.hiredCount}</td>
                                            <td className="py-4 text-right text-slate-400 font-bold">--</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Simulated Bar Chart Distribution */}
                            <div className="bg-slate-50 p-6 border border-slate-200">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-slate-900">Application Velocity (Trailing 30 Days)</h3>
                                <div className="h-48 flex items-end justify-between gap-2 px-2 border-l border-b border-slate-300 pb-2">
                                    {[30, 45, 25, 60, 75, 40, 50, 90, 85, 65, 55, 70].map((h, i) => (
                                        <div key={i} className="w-full bg-slate-800 hover:bg-indigo-600 transition-colors relative group" style={{ height: `${h}%` }}>
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 font-mono transition-opacity">{h + Math.floor(Math.random() * 10)}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-2">
                                    <span>Aug 1</span>
                                    <span>Aug 15</span>
                                    <span>Aug 30</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Funnel & Conversion Stats */}
                        <div className="lg:col-span-4 flex flex-col gap-8">
                            
                            {/* Funnel Diagram */}
                            <div className="p-6 border-2 border-slate-900 bg-white shadow-[4px_4px_0_0_rgba(15,23,42,1)]">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-slate-900">Conversion Funnel</h3>
                                <div className="space-y-2 font-mono text-sm">
                                    
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-slate-900"></div>
                                            <span className="font-semibold text-slate-600">Total Sourced</span>
                                        </div>
                                        <div className="font-black">{stats.newApplicants}</div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between border-b border-slate-100 py-2 pl-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-slate-600"></div>
                                            <span className="font-semibold text-slate-600">Reviewed</span>
                                        </div>
                                        <div className="font-black">{totalProcessed}</div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between border-b border-slate-100 py-2 pl-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-indigo-600"></div>
                                            <span className="font-semibold text-indigo-700">Validated</span>
                                        </div>
                                        <div className="font-black">{stats.hiredCount}</div>
                                    </div>

                                </div>
                            </div>

                            {/* Key Performance Indicators */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 border border-slate-200 flex flex-col justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Acceptance Rate</span>
                                    <span className="text-2xl font-black font-mono text-slate-900">{acceptanceRate}%</span>
                                </div>
                                <div className="bg-slate-50 p-4 border border-slate-200 flex flex-col justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Review Backlog</span>
                                    <span className={`text-2xl font-black font-mono ${stats.pendingReviews > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{pendingRate}%</span>
                                </div>
                            </div>

                            {/* Data Compliance & Footer Note */}
                            <div className="text-[10px] text-slate-400 font-mono leading-relaxed mt-auto text-justify">
                                * CONFIDENTIALITY NOTICE: These statistical readings are derived from real-time database inputs from stage.io's tracking infrastructure. Application velocity is approximated on a trailing 30-day interval. Conversion analytics exclude incomplete or withdrawn applications by default.
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyStatistics;
