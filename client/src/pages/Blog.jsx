import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const Blog = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-body min-h-screen antialiased flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <img src={logoImage} alt="stage.io logo" className="h-12 w-auto object-contain dark:invert dark:hue-rotate-180 mix-blend-multiply dark:mix-blend-screen" />
                    </div>
                    <nav className="hidden md:flex items-center space-x-8 font-display text-sm font-medium tracking-tight">
                        <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all duration-200">Platform</Link>
                        <Link to="/students" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all duration-200">Students</Link>
                        <Link to="/companies" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all duration-200">Companies</Link>
                        <Link to="/universities" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all duration-200">Universities</Link>
                        <Link to="/about-us" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all duration-200">Culture</Link>
                        <Link to="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all duration-200">Pricing</Link>
                        <Link to="/careers" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all duration-200">Team</Link>
                    </nav>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/login" className="font-display text-sm font-medium tracking-tight text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all duration-200">Sign In</Link>
                        <Link to="/student-signup" className="bg-indigo-600 text-white font-display text-sm font-medium tracking-tight px-4 py-2 rounded-full hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md">Apply Now</Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-12 md:py-16">
                
                {/* Header Title */}
                <div className="mb-10">
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Insights & News
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        The latest career tips, industry insights, and updates from stag.io.
                    </p>
                </div>

                {/* Featured Article */}
                <section className="mb-12">
                    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-md group cursor-pointer border border-slate-200 dark:border-slate-700">
                        <div className="aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
                            <img alt="Modern workspace" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                            <div className="flex gap-2 mb-4">
                                <span className="bg-indigo-600 px-3 py-1 rounded-md text-[13px] font-mono uppercase tracking-wider text-white">Featured</span>
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-md text-[13px] font-mono uppercase tracking-wider text-white">Industry Insights</span>
                            </div>
                            <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-4 line-clamp-2 leading-tight">The Future of Tech Internships in the AI Era</h2>
                            <div className="flex items-center justify-between mt-6">
                                <div className="flex items-center gap-2 text-white/90">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    <span className="text-sm">8 min read</span>
                                </div>
                                <button className="hidden sm:flex items-center gap-2 bg-white text-slate-900 px-6 py-2.5 rounded-full font-semibold shadow-lg hover:bg-slate-100 transition-all">
                                    <span>Read More</span>
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Category Pills */}
                <section className="mb-10 flex flex-wrap gap-3">
                    <button className="whitespace-nowrap bg-indigo-600 text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-sm">All Stories</button>
                    <button className="whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Career Advice</button>
                    <button className="whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Skill Up</button>
                    <button className="whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Student Life</button>
                </section>

                {/* Recent Posts Grid */}
                <section className="space-y-6">
                    <div className="flex justify-between items-end mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                        <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Recent Posts</h3>
                        <a href="#" className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline flex items-center gap-1">
                            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Post Card 1 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex gap-5 hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                <img alt="Career advice" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" />
                            </div>
                            <div className="flex flex-col justify-between py-1">
                                <div>
                                    <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">Career Advice</span>
                                    <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Mastering Your First Interview: A Student's Guide</h4>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-xs mt-3">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">timer</span> 5 min read</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span> 2 days ago</span>
                                </div>
                            </div>
                        </div>

                        {/* Post Card 2 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex gap-5 hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                <img alt="Team meeting" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" />
                            </div>
                            <div className="flex flex-col justify-between py-1">
                                <div>
                                    <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">Community</span>
                                    <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">How to Build a Network from Scratch as a Freshman</h4>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-xs mt-3">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">timer</span> 4 min read</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span> Oct 12</span>
                                </div>
                            </div>
                        </div>

                        {/* Post Card 3 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex gap-5 hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                <img alt="Code editor" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" />
                            </div>
                            <div className="flex flex-col justify-between py-1">
                                <div>
                                    <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">Skill Up</span>
                                    <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">10 Programming Languages Recruiters Crave in 2024</h4>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-xs mt-3">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">timer</span> 12 min read</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span> Oct 10</span>
                                </div>
                            </div>
                        </div>

                        {/* Post Card 4 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex gap-5 hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                <img alt="Agreement paperwork" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" />
                            </div>
                            <div className="flex flex-col justify-between py-1">
                                <div>
                                    <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">Admin Help</span>
                                    <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Everything You Need to Know About Internship Agreements</h4>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-xs mt-3">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">timer</span> 6 min read</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span> Oct 08</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Newsletter CTA */}
                <section className="mt-16 bg-white dark:bg-slate-800 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 max-w-lg mx-auto">
                        <span className="material-symbols-outlined text-4xl text-indigo-500 mb-4">mail</span>
                        <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-3">Stay Connected</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">Get the latest career tips and internship offers delivered right to your inbox.</p>
                        
                        <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="flex-grow px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all shadow-sm"
                            />
                            <button 
                                type="submit" 
                                className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 active:scale-95 transition-all whitespace-nowrap"
                            >
                                Subscribe Now
                            </button>
                        </form>
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
                        <Link to="/about-us" className="text-slate-500 hover:text-indigo-600 hover:underline decoration-indigo-600/30 transition-colors duration-200">About Us</Link>
                        <Link to="/" className="text-slate-500 hover:text-indigo-600 hover:underline decoration-indigo-600/30 transition-colors duration-200">Platform</Link>
                        <Link to="/about-us" className="text-slate-500 hover:text-indigo-600 hover:underline decoration-indigo-600/30 transition-colors duration-200">Mission</Link>
                        <Link to="/careers" className="text-slate-500 hover:text-indigo-600 hover:underline decoration-primary/30 transition-colors duration-200">Careers</Link>
                        <Link to="/blog" className="text-indigo-600 font-semibold hover:underline decoration-indigo-600/30 transition-colors duration-200">Blog</Link>
                        <Link to="/contact-us" className="text-slate-500 hover:text-indigo-600 hover:underline decoration-indigo-600/30 transition-colors duration-200">Contact Us</Link>
                        <Link to="/students" className="text-slate-500 hover:text-indigo-600 hover:underline decoration-indigo-600/30 transition-colors duration-200">Students</Link>
                        <Link to="/companies" className="text-slate-500 hover:text-indigo-600 hover:underline decoration-indigo-600/30 transition-colors duration-200">Companies</Link>
                        <Link to="/universities" className="text-slate-500 hover:text-indigo-600 hover:underline decoration-indigo-600/30 transition-colors duration-200">Universities</Link>
                        <Link to="/pricing" className="text-slate-500 hover:text-indigo-600 hover:underline decoration-indigo-600/30 transition-colors duration-200">Pricing</Link>
                        <Link to="/privacy-policy" className="text-slate-500 hover:text-indigo-600 hover:underline decoration-indigo-600/30 transition-colors duration-200">Privacy Policy</Link>
                        <Link to="/cookie-policy" className="text-slate-500 hover:text-indigo-600 hover:underline decoration-indigo-600/30 transition-colors duration-200">Cookie Policy</Link>
                        <Link to="/terms-of-service" className="text-slate-500 hover:text-indigo-600 hover:underline decoration-indigo-600/30 transition-colors duration-200">Terms of Service</Link>
                    </div>
                    <div className="font-display text-sm text-slate-500 dark:text-slate-400 text-center md:text-right">
                        © {new Date().getFullYear()} stage.io Inc. Bridging the gap between potential and opportunity.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Blog;
