import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import ThemeToggle from '../components/ThemeToggle';

const Students = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-body min-h-screen antialiased flex flex-col">
            {/* Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <img src={logoImage} alt="stage.io logo" className="h-12 w-auto object-contain dark:invert dark:hue-rotate-180 mix-blend-multiply dark:mix-blend-screen" />
                    </div>
                    <nav className="hidden md:flex items-center space-x-8 font-display text-sm font-medium tracking-tight">
                        <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200">Platform</Link>
                        <Link to="/companies" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">Companies</Link>
                        <Link to="/universities" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">Universities</Link>
                        <Link to="/about-us" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200">About</Link>
                        <Link to="/students" className="text-primary font-bold">Students</Link>
                    </nav>
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />
                        <Link to="/login" className="font-display text-sm font-medium tracking-tight text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200">Sign In</Link>
                        <Link to="/student-signup" className="bg-primary text-white font-display text-sm font-medium tracking-tight px-6 py-2.5 rounded-full hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/20">Get Started</Link>
                    </div>
                </div>
            </header>

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
                                <span>For Future Builders</span>
                            </div>
                            <h1 className="font-display text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
                                Fast-track your <span className="text-primary">internship search.</span>
                            </h1>
                            <p className="font-body text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                                Connect directly with top tech companies, skip the endless paperwork, and land the role that fits your stack perfectly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/student-signup" className="bg-primary text-white font-display font-bold px-8 py-4 rounded-full shadow-xl shadow-primary/25 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                                    Join stag.io today
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                                <Link to="/opportunities" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-display font-bold px-8 py-4 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 flex items-center justify-center">
                                    View Open Roles
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
                                            <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">New Match</div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Frontend Engineering Intern</h3>
                                        <p className="text-slate-400 mb-6 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            Stripe - Dublin
                                        </p>
                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Match Score</span>
                                                <span className="text-emerald-400 font-bold">98%</span>
                                            </div>
                                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                                <div className="bg-emerald-400 h-full w-[98%]"></div>
                                            </div>
                                        </div>
                                        <button className="w-full bg-primary text-white font-bold py-3 rounded-xl">Apply with One Click</button>
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 max-w-xs transform rotate-3">
                                        <p className="text-sm font-medium italic text-slate-600 dark:text-slate-300">
                                            "Landing my internship at Stripe was seamless. No black holes, just results."
                                        </p>
                                        <div className="mt-4 flex items-center gap-3">
                                            <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                                            <div>
                                                <p className="text-xs font-bold dark:text-white">Marcus Chen</p>
                                                <p className="text-[10px] text-slate-400">EPITA Student</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <h2 className="font-display text-4xl font-bold mb-6 tracking-tight">The end of the black hole search.</h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                    We've eliminated the friction from finding an internship. No more black-hole job boards or manual PDF filling.
                                </p>
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                            <span className="material-symbols-outlined">psychology</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Skill-Based Matching</h4>
                                            <p className="text-slate-500 text-sm">Find internships that actually fit your tech stack. Our matching engine pairs your skills with precise employer requirements.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                            <span className="material-symbols-outlined">touch_app</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">One-Click Apply</h4>
                                            <p className="text-slate-500 text-sm">Skip the repetitive paperwork. Build your profile once and apply to dozens of tailored roles in seconds.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                            <span className="material-symbols-outlined">verified</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Digital Agreements</h4>
                                            <p className="text-slate-500 text-sm">Automatically generate and sign your convention de stage. We handle the bureaucratic back-and-forth securely.</p>
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
                        <h2 className="font-display text-4xl font-bold mb-4 tracking-tight">Your path to day one.</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">From profile creation to your first day, we streamline every step of the journey so you can focus on writing great code.</p>
                    </div>
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Create Profile', desc: 'Upload your resume, connect GitHub, and define your tech stack.' },
                            { step: '02', title: 'Discover Offers', desc: 'Browse curated opportunities matched precisely to your skill level.' },
                            { step: '03', title: 'Get Accepted', desc: 'Track your applications through a clean Kanban board.' },
                            { step: '04', title: 'Sign Agreement', desc: 'Generate your convention de stage automatically and sign digitally.' }
                        ].map((item, i) => (
                            <div key={i} className="relative group">
                                <div className="text-6xl font-display font-black text-slate-200 dark:text-slate-800 mb-4 transition-colors group-hover:text-primary/20">{item.step}</div>
                                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-20 text-center">
                        <Link to="/student-signup" className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-display font-bold px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all">
                            Create Free Profile
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto">
                <div className="max-w-7xl mx-auto py-16 px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <img src={logoImage} alt="stage.io logo" className="h-12 w-auto object-contain dark:invert dark:hue-rotate-180 mix-blend-multiply dark:mix-blend-screen mb-6" />
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Empowering the next generation of talent through seamless digital connectivity.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-6">Platform</h4>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li><Link to="/students" className="hover:text-primary transition-colors">Students</Link></li>
                                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                                <li><Link to="/opportunities" className="hover:text-primary transition-colors">Opportunities</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li><Link to="/about-us" className="hover:text-primary transition-colors">About Us</Link></li>
                                <li><Link to="/companies" className="hover:text-primary transition-colors">Companies</Link></li>
                                <li><Link to="/universities" className="hover:text-primary transition-colors">Universities</Link></li>
                                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                                <li><Link to="/contact-us" className="hover:text-primary transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-6">Legal</h4>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                                <li><Link to="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-xs text-slate-400">
                            © {new Date().getFullYear()} stag.io Inc. All rights reserved.
                        </div>
                        <div className="flex gap-6">
                            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><i className="fab fa-github"></i></a>
                            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><i className="fab fa-linkedin"></i></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Students;
