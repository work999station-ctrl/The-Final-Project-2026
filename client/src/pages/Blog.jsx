import React, { useEffect } from 'react';
import Footer from '../components/Footer';
import LandingNavBar from '../components/LandingNavBar';

const Blog = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-body min-h-screen antialiased flex flex-col">
            {/* Top Navigation */}
            <LandingNavBar />

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
                                {/* <div className="flex items-center gap-2 text-white/90">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    <span className="text-sm">8 min read</span>
                                </div> */}
                                <a href="/" className="hidden sm:flex items-center gap-2 bg-white text-slate-900 px-6 py-2.5 rounded-full font-semibold shadow-lg hover:bg-slate-100 transition-all">

                                    <span>Read More</span>
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Category Pills */}
                <section className="mb-10 flex flex-wrap gap-3">
                    <button className="whitespace-nowrap bg-indigo-600 text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-sm">All Stories</button>
                    {/* <button className="whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Career Advice</button>
                    <button className="whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Skill Up</button>
                    <button className="whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Student Life</button> */}
                </section>

                {/* Recent Posts Grid */}
                <section className="space-y-6">
                    <div className="flex justify-between items-end mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                        <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Recent Posts</h3>
                        <a href="/student-signup" className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline flex items-center gap-1">
                            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Post Card 1 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex gap-5 hover:shadow-md hover:-translate-y-1 transition-all group">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                <img alt="Career advice" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" />
                            </div>
                            <div className="flex flex-col justify-between py-1">
                                <div>
                                    <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">Career Advice</span>
                                    <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Mastering Your First Interview: A Student's Guide</h4>
                                </div>
                                {/* <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-xs mt-3">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">timer</span> 5 min read</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span> 2 days ago</span>
                                </div> */}
                            </div>
                        </div>

                        {/* Post Card 2 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex gap-5 hover:shadow-md hover:-translate-y-1 transition-all group">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                <img alt="Team meeting" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" />
                            </div>
                            <div className="flex flex-col justify-between py-1">
                                <div>
                                    <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">Community</span>
                                    <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">How to Build a Network from Scratch as a Freshman</h4>
                                </div>
                                {/* <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-xs mt-3">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">timer</span> 4 min read</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span> Oct 12</span>
                                </div> */}
                            </div>
                        </div>

                        {/* Post Card 3 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex gap-5 hover:shadow-md hover:-translate-y-1 transition-all group">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                <img alt="Code editor" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" />
                            </div>
                            <div className="flex flex-col justify-between py-1">
                                <div>
                                    <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">Skill Up</span>
                                    <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">10 Programming Languages Recruiters Crave in 2024</h4>
                                </div>
                                {/* <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-xs mt-3">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">timer</span> 12 min read</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span> Oct 10</span>
                                </div> */}
                            </div>
                        </div>

                        {/* Post Card 4 */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex gap-5 hover:shadow-md hover:-translate-y-1 transition-all group">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                <img alt="Agreement paperwork" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" />
                            </div>
                            <div className="flex flex-col justify-between py-1">
                                <div>
                                    <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">Admin Help</span>
                                    <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Everything You Need to Know About Internship Agreements</h4>
                                </div>
                                {/* <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-xs mt-3">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">timer</span> 6 min read</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span> Oct 08</span>
                                </div> */}
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

export default Blog;
