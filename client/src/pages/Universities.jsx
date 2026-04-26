import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import ThemeToggle from '../components/ThemeToggle';

const Universities = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white dark:bg-slate-900 font-display text-slate-900 dark:text-slate-100 min-h-screen selection:bg-indigo-100 dark:selection:bg-indigo-900/30 antialiased flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-12">
                        <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.02] active:scale-[0.98]">
                            <img src={logoImage} alt="stage.io logo" className="h-12 w-auto object-contain dark:invert dark:hue-rotate-180 mix-blend-multiply dark:mix-blend-screen" />
                        </Link>
                        
                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                            <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Platform</Link>
                            <Link to="/students" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Students</Link>
                            <Link to="/companies" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Companies</Link>
                            <Link to="/universities" className="text-indigo-600 dark:text-indigo-400 font-bold underline underline-offset-8 decoration-2">Universities</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button 
                            onClick={() => navigate('/login')}
                            className="hidden sm:block text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-4"
                        >
                            Log In
                        </button>
                        <button 
                            onClick={() => navigate('/admin-signup')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2.5 px-6 rounded-full transition-all shadow-lg shadow-indigo-200 dark:shadow-none hover:translate-y-[-1px] active:translate-y-[1px]"
                        >
                            Partner With Us
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wider uppercase mb-8 border border-indigo-100 dark:border-indigo-800/50">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping"></span>
                            Education Ecosystem
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]">
                            Modernizing Academic <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Career Services.</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
                            Empower your students and eliminate paperwork with our automated placement ecosystem. Streamline internships from initial connection to the final contract.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button 
                                onClick={() => navigate('/admin-signup')}
                                className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-lg font-bold py-4 px-10 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
                            >
                                Get Started for Free
                            </button>
                            <button className="w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold py-4 px-10 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all flex items-center justify-center gap-2 group">
                                Watch Tutorial
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">play_arrow</span>
                            </button>
                        </div>

                        {/* Stats Bar */}
                        <div className="mt-24 pt-12 border-t border-slate-100 dark:border-slate-800/50 grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: 'Partner Universities', value: '150+' },
                                { label: 'Student Placements', value: '25k+' },
                                { label: 'Paperwork Saved', value: '100k+', suffix: ' hrs' },
                                { label: 'Global Network', value: '45', prefix: '#' }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                                        {stat.prefix}{stat.value}{stat.suffix}
                                    </div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bridge Section */}
                <section className="py-32 bg-slate-50 dark:bg-slate-800/50 relative">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">The Digital Bridge.</h2>
                            <p className="max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                stag.io replaces fragmented job boards with a unified ecosystem where verified employers actively seek emerging talent directly from your programs.
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { 
                                    icon: 'hub', 
                                    title: 'Unified Ecosystem', 
                                    desc: 'A single platform connecting students, companies, and academic administrators in real-time.' 
                                },
                                { 
                                    icon: 'verified', 
                                    title: 'Vetted Partners', 
                                    desc: 'Access to a premium network of companies pre-screened for quality internship experiences.' 
                                },
                                { 
                                    icon: 'bolt', 
                                    title: 'Algorithmic Matching', 
                                    desc: 'Direct matching aligns student skills with exact employer requirements automatically.' 
                                }
                            ].map((feature, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all hover:translate-y-[-8px] group">
                                    <div className="size-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Workflow Section */}
                <section className="py-32 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2">
                                <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-sm font-bold mb-6">
                                    Administrative Peace of Mind
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8 leading-tight">
                                    Zero Paperwork. <br />
                                    <span className="text-indigo-600">Full Compliance.</span>
                                </h2>
                                <div className="space-y-8">
                                    {[
                                        { title: 'Automated Contracts', desc: 'Generate internship agreements instantly using university-approved templates.' },
                                        { title: 'Tripartite Signatures', desc: 'Secure digital signing for students, company representatives, and academic tutors.' },
                                        { title: 'Real-time Monitoring', desc: 'Track placement status, student hours, and performance evaluations from one dashboard.' }
                                    ].map((item, i) => (
                                        <div key={i} className="relative pl-10">
                                            <div className="absolute left-0 top-1 size-6 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                                <span className="material-symbols-outlined text-sm">check</span>
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                                            <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="lg:w-1/2 relative">
                                <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-[3rem] p-1 shadow-2xl">
                                    <div className="bg-white dark:bg-slate-900 rounded-[2.9rem] overflow-hidden aspect-square flex flex-col">
                                        {/* Mock Admin UI */}
                                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                            <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                                        </div>
                                        <div className="flex-1 p-8 space-y-6">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="h-24 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50"></div>
                                                <div className="h-24 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50"></div>
                                                <div className="h-24 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"></div>
                                            </div>
                                            <div className="space-y-3">
                                                {[70, 90, 40, 60].map((w, i) => (
                                                    <div key={i} className="h-4 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${w}%` }}></div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="pt-4 grid grid-cols-2 gap-4">
                                                <div className="h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-slate-300">add_chart</span>
                                                </div>
                                                <div className="h-32 rounded-2xl bg-indigo-600 flex flex-col items-center justify-center text-white gap-2">
                                                    <span className="material-symbols-outlined">description</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Sign All</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute -top-12 -right-12 size-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-12 -left-12 size-48 bg-blue-500/10 rounded-full blur-3xl"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="bg-slate-900 dark:bg-white rounded-[4rem] p-12 lg:p-24 text-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
                            </div>
                            
                            <h2 className="text-4xl lg:text-6xl font-black text-white dark:text-slate-900 mb-8 relative z-10">
                                Ready to elevate your <br />placement office?
                            </h2>
                            <p className="max-w-2xl mx-auto text-slate-400 dark:text-slate-500 text-xl mb-12 relative z-10">
                                Join forward-thinking institutions that are redefining the student-to-professional transition.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                                <button 
                                    onClick={() => navigate('/admin-signup')}
                                    className="w-full sm:w-auto bg-indigo-600 text-white text-lg font-bold py-5 px-12 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-indigo-900/20"
                                >
                                    Become a Partner
                                </button>
                                <button className="w-full sm:w-auto bg-white/10 dark:bg-slate-100 text-white dark:text-slate-900 text-lg font-bold py-5 px-12 rounded-2xl hover:bg-white/20 dark:hover:bg-slate-200 transition-all border border-white/10 dark:border-slate-200">
                                    Request Information
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                        <div className="col-span-2 lg:col-span-2">
                            <Link to="/" className="flex items-center gap-2 mb-6">
                                <img src={logoImage} alt="stage.io logo" className="h-12 w-auto object-contain dark:invert dark:hue-rotate-180 mix-blend-multiply dark:mix-blend-screen" />
                            </Link>
                            <p className="text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                                Bridging the gap between academic potential and professional opportunity through intelligent automation.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Platform</h4>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                <li><Link to="/students" className="hover:text-indigo-600 transition-colors">Students</Link></li>
                                <li><Link to="/companies" className="hover:text-indigo-600 transition-colors">Companies</Link></li>
                                <li><Link to="/universities" className="hover:text-indigo-600 transition-colors">Universities</Link></li>
                                <li><Link to="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                <li><Link to="/about-us" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
                                <li><Link to="/careers" className="hover:text-indigo-600 transition-colors">Careers</Link></li>
                                <li><Link to="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
                                <li><Link to="/contact-us" className="hover:text-indigo-600 transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Legal</h4>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                <li><Link to="/privacy-policy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/terms-of-service" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
                                <li><Link to="/cookie-policy" className="hover:text-indigo-600 transition-colors">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-sm text-slate-500 dark:text-slate-400">© 2026 stag.io Inc. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><span className="material-symbols-outlined">school</span></a>
                            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><span className="material-symbols-outlined">hub</span></a>
                            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><span className="material-symbols-outlined">workspace_premium</span></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Universities;
