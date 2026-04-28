import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';
import LandingNavBar from '../components/LandingNavBar';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        { id: 'information-we-collect', title: 'Information We Collect' },
        { id: 'how-we-use', title: 'How We Use Your Information' },
        { id: 'data-security', title: 'Data Security' },
        { id: 'your-rights', title: 'Your Rights' }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col">
            {/* Navigation Header */}
            <LandingNavBar />

            <main className="flex-1 container mx-auto px-6 py-12 md:py-20">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sticky Sidebar Navigation */}
                    <aside className="lg:w-64 shrink-0">
                        <div className="sticky top-32">
                            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Table of Contents</h5>
                            <nav className="flex flex-col gap-4">
                                {sections.map((section) => (
                                    <a 
                                        key={section.id}
                                        href={`#${section.id}`}
                                        className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                                    >
                                        {section.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <article className="flex-1 max-w-4xl">
                        <div className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Privacy Policy</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Last Updated: April 22, 2026</p>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none space-y-12 text-slate-600 dark:text-slate-400 leading-relaxed">
                            <section>
                                <p className="text-lg">
                                    At stag.io, we are committed to protecting the privacy of our students, university partners, and corporate recruiters. 
                                    The information we collect falls into several categories designed to facilitate efficient opportunity matching.
                                </p>
                            </section>

                            <section id="information-we-collect" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Information We Collect</h2>
                                
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Student Data</h3>
                                        <ul className="space-y-3">
                                            <li className="flex gap-3"><span className="text-primary">•</span> Profile Information: Names, academic institutions, graduation dates, and contact details.</li>
                                            <li className="flex gap-3"><span className="text-primary">•</span> Professional Assets: Uploaded CVs, portfolios, and structured skill datasets.</li>
                                            <li className="flex gap-3"><span className="text-primary">•</span> Platform Activity: Application history, saved opportunities, and match preferences.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Company Data</h3>
                                        <ul className="space-y-3">
                                            <li className="flex gap-3"><span className="text-primary">•</span> Corporate Profiles: Company details, active role listings, and recruiter contact information.</li>
                                            <li className="flex gap-3"><span className="text-primary">•</span> Interaction Metrics: Candidate viewing history, interview scheduling data, and pipeline stages.</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section id="how-we-use" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How We Use Your Information</h2>
                                <p className="mb-8">
                                    We leverage the collected data strictly to operate, maintain, and enhance the stag.io ecosystem. 
                                    Our primary objective is to eliminate friction in the talent acquisition process.
                                </p>
                                
                                <div className="space-y-6">
                                    <div className="flex gap-6 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <span className="material-symbols-outlined">handshake</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Matchmaking Algorithms</h4>
                                            <p className="text-sm">We use student skill data and company role requirements to generate accurate Match Scores.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <span className="material-symbols-outlined">insights</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Administrative Analytics</h4>
                                            <p className="text-sm">Providing universities with aggregated, anonymized placement data and KPI tracking.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="data-security" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Data Security</h2>
                                <p>
                                    We implement robust, industry-standard security measures to protect your administrative, corporate, and personal data from unauthorized access or disclosure.
                                </p>
                                <p className="mt-4">
                                    Data is encrypted both in transit and at rest. Access to backend systems is strictly limited to authorized personnel and is subject to rigorous audit logging.
                                </p>
                            </section>

                            <section id="your-rights" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Rights</h2>
                                <p className="mb-6">You maintain full control over your data on stag.io. You have the right to:</p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                                        <span>Access the personal data we hold about you.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                                        <span>Request corrections to inaccurate or incomplete information.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                                        <span>Request deletion of your account and associated data (Right to be Forgotten).</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                                        <span>Opt-out of non-essential communications.</span>
                                    </li>
                                </ul>
                                <div className="p-8 rounded-3xl bg-slate-900 text-white text-center">
                                    <h4 className="text-xl font-bold mb-4">Questions about your privacy?</h4>
                                    <p className="text-slate-400 mb-6">Contact our Data Protection Officer for any inquiries or to exercise your rights.</p>
                                    <a 
                                        href="mailto:privacy@stag.io" 
                                        className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
                                    >
                                        <span className="material-symbols-outlined text-sm">mail</span>
                                        privacy@stag.io
                                    </a>
                                </div>
                            </section>
                        </div>
                    </article>
                </div>
            </main>

            {/* Simple Footer for Legal Pages */}
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
