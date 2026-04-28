import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';
import LandingNavBar from '../components/LandingNavBar';

const Companies = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-slate-900 font-display text-slate-900 dark:text-slate-100 min-h-screen selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            {/* Header */}
            <LandingNavBar />

            <main>
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wider uppercase mb-8 border border-indigo-100 dark:border-indigo-800/50">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping"></span>
                            Recruitment 2.0
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]">
                            Scale Your Team with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Top Academic Talent.</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
                            Eliminate the friction of internship recruitment. stag.io connects you with vetted students and automates your administrative workflow from discovery to agreement.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => navigate('/company-signup')}
                                className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-lg font-bold py-4 px-10 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
                            >
                                Start Hiring Now
                            </button>
                            <a href="/careers">
                                <button className="w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold py-4 px-10 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all flex items-center justify-center gap-2 group">
                                    View Demo
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">play_arrow</span>
                                </button>
                            </a>
                        </div>

                        {/* Trust Bar */}
                        <div className="mt-24 pt-12 border-t border-slate-100 dark:border-slate-800/50">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">Trusted by innovative companies worldwide</p>
                            <div className="flex flex-wrap justify-center gap-12 lg:gap-20 opacity-40 grayscale contrast-125 dark:invert">
                                <div className="flex items-center gap-2 text-2xl font-black tracking-tighter">
                                    <span className="size-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-base">T</span> TECH_CORP
                                </div>
                                <div className="flex items-center gap-2 text-2xl font-black tracking-tighter">
                                    <span className="size-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-base">S</span> SOFT_SOL
                                </div>
                                <div className="flex items-center gap-2 text-2xl font-black tracking-tighter">
                                    <span className="size-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-base">N</span> NEXUS_INC
                                </div>
                                <div className="flex items-center gap-2 text-2xl font-black tracking-tighter">
                                    <span className="size-8 bg-slate-900 rounded-lg rotate-45 flex items-center justify-center text-white text-base">
                                        <span className="-rotate-45 font-black">A</span>
                                    </span> APEX_LABS
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-32 bg-slate-50 dark:bg-slate-800/50 relative">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                                    Everything you need to <br />
                                    <span className="text-indigo-600">manage internships.</span>
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                                    Stop wasting time on manual paperwork and unvetted candidates. stag.io provides a centralized command center for your entire internship program.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        { icon: 'verified_user', title: 'Vetted Candidates', desc: 'Access a curated pool of students with verified academic backgrounds and skills.' },
                                        { icon: 'auto_mode', title: 'Automated Workflows', desc: 'Generate and sign internship agreements automatically with our tripartite signature system.' },
                                        { icon: 'analytics', title: 'Recruitment Analytics', desc: 'Track your hiring pipeline and internship success rates with real-time data.' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:translate-x-2">
                                            <div className="size-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                                <span className="material-symbols-outlined">{item.icon}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                                <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden aspect-[4/3] flex items-center justify-center p-8">
                                    {/* Mock UI Element */}
                                    <div className="w-full h-full bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-indigo-600"></div>
                                                <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                                <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="h-12 w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center px-4 gap-4 animate-pulse">
                                                <div className="size-6 rounded-md bg-green-500/20 text-green-500 flex items-center justify-center"><span className="material-symbols-outlined text-sm">check</span></div>
                                                <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                                <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                            </div>
                                            <div className="h-12 w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center px-4 gap-4 animate-pulse" style={{ animationDelay: '0.2s' }}>
                                                <div className="size-6 rounded-md bg-blue-500/20 text-blue-500 flex items-center justify-center"><span className="material-symbols-outlined text-sm">edit</span></div>
                                                <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                                <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                            </div>
                                            <div className="h-12 w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center px-4 gap-4 animate-pulse" style={{ animationDelay: '0.4s' }}>
                                                <div className="size-6 rounded-md bg-indigo-500/20 text-indigo-500 flex items-center justify-center"><span className="material-symbols-outlined text-sm">search</span></div>
                                                <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                                <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="mt-12 h-32 w-full bg-indigo-600/5 dark:bg-indigo-400/5 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800 flex flex-col items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-indigo-600 text-3xl">upload_file</span>
                                            <div className="h-2 w-32 bg-indigo-200 dark:bg-indigo-800 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing / CTA Section */}
                <section className="py-32">
                    <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center bg-indigo-600 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl lg:text-5xl font-black text-white mb-8">Ready to transform your <br />internship program?</h2>
                            <p className="text-indigo-100 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                                Join hundreds of innovative companies already using stag.io to discover and manage their future talent.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <button
                                    onClick={() => navigate('/company-signup')}
                                    className="w-full sm:w-auto bg-white text-indigo-600 text-lg font-bold py-4 px-12 rounded-2xl hover:scale-105 transition-all shadow-xl"
                                >
                                    Get Started for Free
                                </button>
                                {/* <button 
                                    onClick={() => navigate('/pricing')}
                                    className="w-full sm:w-auto bg-indigo-500/30 text-white border border-indigo-400/30 text-lg font-bold py-4 px-12 rounded-2xl hover:bg-indigo-500/40 transition-all"
                                >
                                    View Pricing
                                </button> */}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Companies;
