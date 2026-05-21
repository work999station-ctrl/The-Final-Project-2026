import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import LandingNavBar from '../components/LandingNavBar';

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-body min-h-screen antialiased flex flex-col">
            {/* Top Navigation */}
            <LandingNavBar />

            {/* Main Content */}
            <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-12 md:py-16">
                {/* Header Section */}
                <header className="mb-12 pt-8">
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="font-body text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
                        Please read these terms carefully before using the stag.io platform. These Terms constitute a legally binding agreement between you and stag.io.
                    </p>
                    <div className="mt-4 text-xs font-mono text-slate-400 uppercase tracking-widest">
                        Last Updated: April 22, 2026
                    </div>
                </header>

                {/* Policy Content Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Sidebar Navigation */}
                    <div className="md:col-span-3 hidden md:block">
                        <nav className="sticky top-24 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                            <ul className="space-y-4">
                                <li><a className="font-body text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors" href="#introduction">1. Introduction</a></li>
                                <li><a className="font-body text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors" href="#user-accounts">2. User Accounts</a></li>
                                <li><a className="font-body text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors" href="#platform-usage">3. Platform Usage</a></li>
                                <li><a className="font-body text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors" href="#intellectual-property">4. Intellectual Property</a></li>
                                <li><a className="font-body text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors" href="#privacy">5. Privacy</a></li>
                                <li><a className="font-body text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors" href="#termination">6. Termination</a></li>
                                <li><a className="font-body text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors" href="#limitation-liability">7. Limitation of Liability</a></li>
                                <li>
                                    <a className="font-body text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1" href="#official-documents">
                                        <span className="material-symbols-outlined text-xs">verified</span>
                                        8. Official Digital Documents
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Main Text Content */}
                    <div className="md:col-span-9 space-y-12">
                        <section className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700" id="introduction">
                            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Introduction</h2>
                            <div className="space-y-4 text-slate-600 dark:text-slate-300">
                                <p>
                                    Welcome to stag.io. These Terms of Service ("Terms") constitute a legally binding agreement between you and stag.io ("Company," "we," "us," or "our") governing your access to and use of the stag.io website, mobile applications, and associated services (collectively, the "Platform").
                                </p>
                                <p>
                                    By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Platform.
                                </p>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700" id="user-accounts">
                            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">2. User Accounts</h2>
                            <div className="space-y-4 text-slate-600 dark:text-slate-300">
                                <p>
                                    To access certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Account Security:</strong> You are responsible for safeguarding your password and for all activities that occur under your account.</li>
                                    <li><strong>Eligibility:</strong> You must be at least 18 years old or the age of majority in your jurisdiction to create an account as an Employer or University representative. Students must be at least 16 years old.</li>
                                    <li><strong>Identity Verification:</strong> We reserve the right to verify your identity and employment or academic status.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700" id="platform-usage">
                            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Platform Usage & Conduct</h2>
                            <div className="space-y-4 text-slate-600 dark:text-slate-300">
                                <p>
                                    The Platform serves as a modern connectivity tool facilitating connections between students, universities, and employers. You agree to use the Platform only for lawful purposes and in accordance with these Terms.
                                </p>
                                <div className="bg-amber-50 dark:bg-slate-700 border-l-4 border-amber-400 p-4 rounded-r-lg">
                                    <h4 className="font-display font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">warning</span>
                                        Prohibited Activities
                                    </h4>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-amber-700 dark:text-amber-200">
                                        <li>Scraping, mining, or extracting data from the Platform using automated tools.</li>
                                        <li>Submitting false, inaccurate, or misleading profile information or job listings.</li>
                                        <li>Attempting to bypass or circumvent any security or authentication measures.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700" id="intellectual-property">
                            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Intellectual Property</h2>
                            <div className="space-y-4 text-slate-600 dark:text-slate-300">
                                <p>
                                    The Platform and its entire contents, features, and functionality are owned by stag.io, its licensors, or other providers and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                                </p>
                                <p>
                                    <strong>User Content:</strong> By posting, uploading, or submitting content to the Platform, you grant us a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your content in connection with operating and providing the Platform.
                                </p>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700" id="privacy">
                            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Privacy</h2>
                            <p className="text-slate-600 dark:text-slate-300">
                                Your privacy is critically important to us. Our data collection and use practices are described in our <Link to="/privacy-policy" className="text-indigo-600 hover:underline">Privacy Policy</Link>. By using the Platform, you agree to the terms outlined in the Privacy Policy.
                            </p>
                        </section>

                        <section className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700" id="termination">
                            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Termination</h2>
                            <p className="text-slate-600 dark:text-slate-300">
                                We may terminate or suspend your account and bar access to the Platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including breach of the Terms. Upon termination, your right to use the Platform will immediately cease.
                            </p>
                        </section>

                        <section className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700" id="limitation-liability">
                            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Limitation of Liability</h2>
                            <p className="text-slate-600 dark:text-slate-300 uppercase text-xs leading-relaxed italic">
                                IN NO EVENT SHALL STAG.IO, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE PLATFORM; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE PLATFORM.
                            </p>
                        </section>

                        {/* ── Section 8 — Official Digital Documents (highlighted) ── */}
                        <section id="official-documents" className="relative rounded-2xl overflow-hidden">
                            {/* Gradient glow border */}
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 opacity-80" />
                            <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8">

                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-5">
                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                    Official Notice
                                </div>

                                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    8. Official Digital Documents &amp; Legal Validity
                                </h2>

                                <div className="space-y-5 text-slate-600 dark:text-slate-300">

                                    {/* Point 1 */}
                                    <div className="flex gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                            <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                                        </div>
                                        <div>
                                            <h4 className="font-display font-bold text-slate-900 dark:text-white mb-1 text-base">Recognition by Ministry of Higher Education</h4>
                                            <p className="text-sm leading-relaxed">
                                                All documents generated through this platform are considered <strong className="text-slate-800 dark:text-slate-100">official digital documents</strong>. They are issued in accordance with the guidelines and standards established by the <strong className="text-slate-800 dark:text-slate-100">Ministry of Higher Education and Scientific Research</strong>, as outlined in the <strong className="text-slate-800 dark:text-slate-100">2024 national program</strong>.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Point 2 */}
                                    <div className="flex gap-4 p-5 bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/50 rounded-xl">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                                            <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>qr_code_2</span>
                                        </div>
                                        <div>
                                            <h4 className="font-display font-bold text-slate-900 dark:text-white mb-1 text-base">QR Code Authentication</h4>
                                            <p className="text-sm leading-relaxed">
                                                Each document is electronically generated and includes a <strong className="text-slate-800 dark:text-slate-100">unique QR code</strong> to ensure authenticity and traceability. This QR code allows verification that the document was officially issued by the Stag.io platform and <strong className="text-slate-800 dark:text-slate-100">has not been altered</strong>.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Point 3 — highlighted acknowledgement */}
                                    <div className="relative p-5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-500/20 overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                                        <div className="relative flex gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
                                            </div>
                                            <div>
                                                <h4 className="font-display font-bold text-white mb-1 text-base">User Acknowledgement &amp; Legal Acceptance</h4>
                                                <p className="text-sm leading-relaxed text-white/85">
                                                    By using this service, users <strong className="text-white">acknowledge and accept</strong> the legal and administrative validity of the documents generated through the platform.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </section>

                        <div className="flex justify-center pt-8">
                            <button className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-display font-bold px-8 py-3 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                                <span className="material-symbols-outlined">download</span>
                                Download PDF Version
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default TermsOfService;
