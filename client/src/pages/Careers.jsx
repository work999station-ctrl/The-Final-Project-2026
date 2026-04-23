import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const Careers = () => {
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
                        <Link to="/about-us" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200">Culture</Link>
                        <Link to="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200">Pricing</Link>
                        <Link to="/careers" className="text-primary border-b-2 border-primary pb-1 hover:opacity-80 transition-all duration-200">Team</Link>
                    </nav>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/login" className="font-display text-sm font-medium tracking-tight text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200">Sign In</Link>
                        <Link to="/student-signup" className="bg-primary text-white font-display text-sm font-medium tracking-tight px-4 py-2 rounded-full hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md">Apply Now</Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow pt-16 pb-20">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
                    <h1 className="font-display text-4xl md:text-5xl lg:text-[56px] font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
                        Build the Future of Connectivity
                    </h1>
                    <p className="font-body text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
                        We are on a mission to eliminate friction in the talent ecosystem. Join us in building a high-energy, modern platform that connects ambition with opportunity.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="#openings" className="bg-indigo-600 hover:bg-indigo-700 text-white font-body font-medium rounded-full px-8 py-3 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 inline-flex items-center gap-2">
                            View Openings
                            <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
                        </a>
                    </div>
                </section>

                {/* Image Banner */}
                <section className="max-w-7xl mx-auto px-6 mb-32">
                    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 relative group">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80" alt="Team working together" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                    </div>
                </section>

                {/* Culture / Benefits */}
                <section className="max-w-7xl mx-auto px-6 mb-32">
                    <div className="text-center mb-16">
                        <span className="font-body font-semibold text-xs tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-4 block">
                            WHY JOIN US
                        </span>
                        <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Designed for Impact</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Benefit Card 1 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                                <span className="material-symbols-outlined text-[28px]">public</span>
                            </div>
                            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-3">Remote First</h3>
                            <p className="font-body text-base text-slate-500 dark:text-slate-400">
                                Work from anywhere. We believe in outcomes over hours, giving you the flexibility to manage your own environment.
                            </p>
                        </div>
                        {/* Benefit Card 2 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                                <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
                            </div>
                            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-3">Skill Development</h3>
                            <p className="font-body text-base text-slate-500 dark:text-slate-400">
                                Continuous learning is baked into our DNA. Access dedicated budgets for courses, conferences, and certifications.
                            </p>
                        </div>
                        {/* Benefit Card 3 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                                <span className="material-symbols-outlined text-[28px]">lightbulb</span>
                            </div>
                            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-3">Impactful Work</h3>
                            <p className="font-body text-base text-slate-500 dark:text-slate-400">
                                No cogs in a machine here. Your code, designs, and strategies directly shape the product and user experience.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Social Proof / Testimonial */}
                <section className="max-w-7xl mx-auto px-6 mb-32">
                    <div className="bg-indigo-600 rounded-2xl overflow-hidden relative shadow-xl">
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                            <span className="material-symbols-outlined text-[180px] text-white">format_quote</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="p-12 md:p-16 flex flex-col justify-center text-white relative z-10">
                                <p className="font-display text-2xl md:text-3xl font-medium leading-tight mb-8">
                                    "Joining stag.io means working alongside incredibly sharp minds who actually care about the problem we're solving. The autonomy here is unmatched."
                                </p>
                                <div className="flex items-center gap-4">
                                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80" alt="Sarah Jenkins" className="w-12 h-12 rounded-full border-2 border-indigo-400 object-cover" />
                                    <div>
                                        <h4 className="font-display text-lg font-bold text-white m-0">Sarah Jenkins</h4>
                                        <span className="font-body text-sm text-indigo-200">Lead Product Designer</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block bg-indigo-700 relative">
                                <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Working together" className="w-full h-full object-cover mix-blend-overlay opacity-50" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Open Positions */}
                <section id="openings" className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                        <div>
                            <span className="font-body font-semibold text-xs tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-2 block">
                                WE ARE HIRING
                            </span>
                            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Open Positions</h2>
                        </div>
                        <div className="w-full md:w-auto relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">search</span>
                            <input type="text" placeholder="Search roles..." className="w-full md:w-[320px] h-12 pl-12 pr-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-base font-body text-slate-900 dark:text-white shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-colors" />
                        </div>
                    </div>
                    
                    <div className="grid gap-4">
                        {/* Job Card 1 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group cursor-pointer">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 flex-shrink-0">
                                    <span className="material-symbols-outlined">code</span>
                                </div>
                                <div>
                                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                                        Senior Full Stack Developer
                                    </h3>
                                    <div className="flex flex-wrap gap-3 items-center mt-2">
                                        <span className="font-mono text-sm bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-md">
                                            Engineering
                                        </span>
                                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-body text-sm">
                                            <span className="material-symbols-outlined text-[16px]">location_on</span> Remote
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-body text-sm">
                                            <span className="material-symbols-outlined text-[16px]">schedule</span> Full-time
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-auto flex justify-end">
                                <button className="font-body font-medium text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-6 py-2 rounded-full transition-all w-full md:w-auto">
                                    View Details
                                </button>
                            </div>
                        </div>

                        {/* Job Card 2 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group cursor-pointer">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 flex-shrink-0">
                                    <span className="material-symbols-outlined">brush</span>
                                </div>
                                <div>
                                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                                        UI/UX Designer
                                    </h3>
                                    <div className="flex flex-wrap gap-3 items-center mt-2">
                                        <span className="font-mono text-sm bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-md">
                                            Design
                                        </span>
                                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-body text-sm">
                                            <span className="material-symbols-outlined text-[16px]">location_on</span> Hybrid (Algiers)
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-body text-sm">
                                            <span className="material-symbols-outlined text-[16px]">schedule</span> Full-time
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-auto flex justify-end">
                                <button className="font-body font-medium text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-6 py-2 rounded-full transition-all w-full md:w-auto">
                                    View Details
                                </button>
                            </div>
                        </div>

                        {/* Job Card 3 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group cursor-pointer">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 flex-shrink-0">
                                    <span className="material-symbols-outlined">campaign</span>
                                </div>
                                <div>
                                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                                        Marketing Lead
                                    </h3>
                                    <div className="flex flex-wrap gap-3 items-center mt-2">
                                        <span className="font-mono text-sm bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-md">
                                            Marketing
                                        </span>
                                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-body text-sm">
                                            <span className="material-symbols-outlined text-[16px]">location_on</span> Remote
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-body text-sm">
                                            <span className="material-symbols-outlined text-[16px]">schedule</span> Full-time
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-auto flex justify-end">
                                <button className="font-body font-medium text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-6 py-2 rounded-full transition-all w-full md:w-auto">
                                    View Details
                                </button>
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
                        <Link to="/about-us" className="text-slate-500 hover:text-primary hover:underline decoration-primary/30 transition-colors duration-200">About Us</Link>
                        <Link to="/" className="text-slate-500 hover:text-primary hover:underline decoration-primary/30 transition-colors duration-200">Platform</Link>
                        <Link to="/about-us" className="text-slate-500 hover:text-primary hover:underline decoration-primary/30 transition-colors duration-200">Mission</Link>
                        <Link to="/careers" className="text-primary font-semibold hover:underline decoration-primary/30 transition-colors duration-200">Careers</Link>
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

export default Careers;
