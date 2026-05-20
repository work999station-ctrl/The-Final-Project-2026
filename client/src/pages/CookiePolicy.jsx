import React, { useEffect } from 'react';
import Footer from '../components/Footer';
import LandingNavBar from '../components/LandingNavBar';

const CookiePolicy = () => {
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
                        Cookie Policy
                    </h1>
                    <p className="font-body text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
                        This Cookie Policy explains how stag.io uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
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
                                <li><a className="font-body text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors" href="#what-are-cookies">What are cookies?</a></li>
                                <li><a className="font-body text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors" href="#how-we-use">How we use cookies</a></li>
                                <li><a className="font-body text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors" href="#types-of-cookies">Types of cookies</a></li>
                                <li><a className="font-body text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors" href="#manage-cookies">How to manage</a></li>
                            </ul>
                        </nav>
                    </div>

                    {/* Main Text Content */}
                    <div className="md:col-span-9 space-y-12">
                        <section className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700" id="what-are-cookies">
                            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">What are cookies?</h2>
                            <div className="space-y-4 text-slate-600 dark:text-slate-300">
                                <p>
                                    Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                                </p>
                                <p>
                                    Cookies set by the website owner (in this case, stag.io) are called "first party cookies". Cookies set by parties other than the website owner are called "third party cookies". Third party cookies enable third party features or functionality to be provided on or through the website (e.g. like advertising, interactive content and analytics).
                                </p>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700" id="how-we-use">
                            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">How we use cookies</h2>
                            <p className="text-slate-600 dark:text-slate-300">
                                We use first and third party cookies for several reasons. Some cookies are required for technical reasons in order for our Websites to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Websites for advertising, analytics and other purposes.
                            </p>
                        </section>

                        <section className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700" id="types-of-cookies">
                            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">Types of cookies we use</h2>
                            <div className="space-y-8">
                                {/* Essential Cookies */}
                                <div className="flex items-start gap-4">
                                    <div className="bg-indigo-50 dark:bg-slate-700 p-3 rounded-full shrink-0">
                                        <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">security</span>
                                    </div>
                                    <div>
                                        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">Essential Cookies</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">These cookies are strictly necessary to provide you with services available through our Websites and to use some of its features, such as access to secure areas.</p>
                                    </div>
                                </div>
                                {/* Performance Cookies */}
                                <div className="flex items-start gap-4">
                                    <div className="bg-indigo-50 dark:bg-slate-700 p-3 rounded-full shrink-0">
                                        <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">speed</span>
                                    </div>
                                    <div>
                                        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">Performance Cookies</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">These cookies are used to enhance the performance and functionality of our Websites but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.</p>
                                    </div>
                                </div>
                                {/* Functional Cookies */}
                                <div className="flex items-start gap-4">
                                    <div className="bg-indigo-50 dark:bg-slate-700 p-3 rounded-full shrink-0">
                                        <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">settings</span>
                                    </div>
                                    <div>
                                        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">Functional Cookies</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">These cookies collect information that is used either in aggregate form to help us understand how our Websites are being used or how effective our marketing campaigns are, or to help us customize our Websites for you.</p>
                                    </div>
                                </div>
                                {/* Targeting Cookies */}
                                <div className="flex items-start gap-4">
                                    <div className="bg-indigo-50 dark:bg-slate-700 p-3 rounded-full shrink-0">
                                        <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">track_changes</span>
                                    </div>
                                    <div>
                                        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">Targeting Cookies</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700" id="manage-cookies">
                            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">How to manage cookies</h2>
                            <div className="space-y-4 text-slate-600 dark:text-slate-300 mb-8">
                                <p>
                                    You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
                                </p>
                                <p>
                                    You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                                </p>
                            </div>
                            <button className="bg-indigo-600 text-white font-display font-bold px-8 py-3 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                                Open Cookie Preferences
                            </button>
                        </section>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CookiePolicy;
