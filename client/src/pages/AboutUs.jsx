import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const AboutUs = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-body min-h-screen antialiased flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <img src={logoImage} alt="stage.io logo" className="h-12 w-auto object-contain dark:invert dark:hue-rotate-180 mix-blend-multiply dark:mix-blend-screen" />
                    </div>
                    <nav className="hidden md:flex items-center space-x-8 font-display text-sm font-medium tracking-tight">
                        <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200">Platform</Link>
                        <Link to="/students" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200">Students</Link>
                        <Link to="/companies" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200">Companies</Link>
                        <Link to="/universities" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200">Universities</Link>
                        <Link to="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200">Pricing</Link>
                        <Link to="/about-us" className="text-primary border-b-2 border-primary pb-1 hover:opacity-80 transition-all duration-200">Impact</Link>
                    </nav>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/login" className="font-display text-sm font-medium tracking-tight text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200">Sign In</Link>
                        <Link to="/student-signup" className="bg-primary text-white font-display text-sm font-medium tracking-tight px-4 py-2 rounded-full hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md">Join Now</Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow pt-16 pb-20">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#eae6f4] text-primary font-bold text-xs tracking-wider uppercase">
                            OUR MISSION
                        </span>
                        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Bridging the Gap Between Potential and Opportunity
                        </h1>
                        <p className="font-body text-base leading-relaxed text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                            We are building a frictionless ecosystem where academic talent meets industry demand. No noise, just precise alignment.
                        </p>
                    </div>
                    
                    <div className="mt-12 h-64 md:h-96 w-full rounded-xl overflow-hidden shadow-sm relative group bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900">
                        <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-[2px]"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                             <span className="material-symbols-outlined text-9xl text-indigo-200 dark:text-slate-700 opacity-50">hub</span>
                        </div>
                    </div>
                </section>

                {/* By the Numbers (Impact Stats) */}
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">By the Numbers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Stat 1 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-slate-700 flex items-center justify-center mb-4 text-primary">
                                <span className="material-symbols-outlined">groups</span>
                            </div>
                            <h3 className="font-display text-4xl font-bold text-primary mb-2">50k+</h3>
                            <p className="font-body text-base text-slate-500 dark:text-slate-400">Students Placed</p>
                        </div>
                        {/* Stat 2 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-slate-700 flex items-center justify-center mb-4 text-primary">
                                <span className="material-symbols-outlined">domain</span>
                            </div>
                            <h3 className="font-display text-4xl font-bold text-primary mb-2">2,500</h3>
                            <p className="font-body text-base text-slate-500 dark:text-slate-400">Active Partners</p>
                        </div>
                        {/* Stat 3 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-slate-700 flex items-center justify-center mb-4 text-primary">
                                <span className="material-symbols-outlined">trending_up</span>
                            </div>
                            <h3 className="font-display text-4xl font-bold text-primary mb-2">94%</h3>
                            <p className="font-body text-base text-slate-500 dark:text-slate-400">Success Rate</p>
                        </div>
                    </div>
                </section>

                {/* Our Journey */}
                <section className="bg-indigo-50/50 dark:bg-slate-900 py-24 mt-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-6">
                                <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Our Journey</h2>
                                <p className="font-body text-base text-slate-500 dark:text-slate-400">
                                    Founded in 2020 out of a shared frustration with fragmented recruiting platforms, Modern Connectivity started as a simple algorithm to match engineering students with local startups.
                                </p>
                                <p className="font-body text-base text-slate-500 dark:text-slate-400">
                                    Today, we've evolved into a comprehensive infrastructure powering career transitions across the globe. We believe that talent is universally distributed, but opportunity is not. Our platform is designed to fix that equation.
                                </p>
                            </div>
                            <div className="relative h-80 rounded-xl overflow-hidden shadow-sm">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent flex items-center justify-center">
                                    <span className="material-symbols-outlined text-9xl text-primary opacity-20">rocket_launch</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Pillars */}
                <section className="max-w-7xl mx-auto px-6 py-24">
                    <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-16 text-center">Core Pillars</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#eae6f4] dark:bg-slate-700 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined">bolt</span>
                                </div>
                                <div>
                                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">Velocity</h3>
                                    <p className="font-body text-base text-slate-500 dark:text-slate-400">Eliminating friction from the hiring process. We optimize for speed without compromising on match quality.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#eae6f4] dark:bg-slate-700 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined">target</span>
                                </div>
                                <div>
                                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">Precision</h3>
                                    <p className="font-body text-base text-slate-500 dark:text-slate-400">Data-driven matchmaking. Our models analyze subtle skill adjacencies to find perfect fits that traditional filters miss.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#eae6f4] dark:bg-slate-700 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined">verified</span>
                                </div>
                                <div>
                                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">Integrity</h3>
                                    <p className="font-body text-base text-slate-500 dark:text-slate-400">Transparent algorithms and unbiased evaluation. We build trust by ensuring every candidate is evaluated purely on merit.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#eae6f4] dark:bg-slate-700 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined">public</span>
                                </div>
                                <div>
                                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">Access</h3>
                                    <p className="font-body text-base text-slate-500 dark:text-slate-400">Democratizing opportunity. We actively break down geographic and institutional barriers to connect talent everywhere.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-auto">
                <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center">
                         <img src={logoImage} alt="stage.io logo" className="h-10 w-auto object-contain dark:invert dark:hue-rotate-180 mix-blend-multiply dark:mix-blend-screen" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 font-display text-sm text-slate-500 dark:text-slate-400">
                        <Link to="/about-us" className="text-primary font-semibold hover:underline decoration-primary/30 transition-colors duration-200">About Us</Link>
                        <Link to="/" className="text-slate-500 hover:text-primary hover:underline decoration-primary/30 transition-colors duration-200">Platform</Link>
                        <button onClick={() => window.scrollTo(0, 0)} className="text-slate-500 hover:text-primary hover:underline decoration-primary/30 transition-colors duration-200">Mission</button>
                        <Link to="/careers" className="text-slate-500 hover:text-primary hover:underline decoration-primary/30 transition-colors duration-200">Careers</Link>
                        <Link to="/blog" className="text-slate-500 hover:text-primary hover:underline decoration-primary/30 transition-colors duration-200">Blog</Link>
                        <Link to="/contact-us" className="text-slate-500 hover:text-primary hover:underline decoration-primary/30 transition-colors duration-200">Contact Us</Link>
                        <Link to="/students" className="text-slate-500 hover:text-primary hover:underline decoration-primary/30 transition-colors duration-200">Students</Link>
                        <Link to="/companies" className="text-slate-500 hover:text-primary hover:underline decoration-primary/30 transition-colors duration-200">Companies</Link>
                        <Link to="/universities" className="text-slate-500 hover:text-primary hover:underline decoration-primary/30 transition-colors duration-200">Universities</Link>
                        <Link to="/pricing" className="text-slate-500 hover:text-primary hover:underline decoration-primary/30 transition-colors duration-200">Pricing</Link>
                        <Link to="/privacy-policy" className="text-slate-500 hover:text-primary hover:underline decoration-primary/30 transition-colors duration-200">Privacy Policy</Link>
                        <Link to="/cookie-policy" className="text-slate-500 hover:text-primary hover:underline decoration-primary/30 transition-colors duration-200">Cookie Policy</Link>
                        <Link to="/terms-of-service" className="text-slate-500 hover:text-primary hover:underline decoration-primary/30 transition-colors duration-200">Terms of Service</Link>
                    </div>
                    <div className="font-display text-sm text-slate-500 dark:text-slate-400 text-center md:text-right">
                        © {new Date().getFullYear()} stage.io Inc. Bridging the gap between potential and opportunity.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AboutUs;
