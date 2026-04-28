import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import Footer from '../components/Footer';
import LandingNavBar from '../components/LandingNavBar';

const ContactUs = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-body min-h-screen antialiased flex flex-col">
            {/* Top Navigation */}
            <LandingNavBar />

            {/* Main Content */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="text-center mb-16">
                    <h1 className="font-display text-4xl md:text-5xl lg:text-[56px] font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-[1.1]">
                        Let's Connect
                    </h1>
                    <p className="font-body text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Have questions about modern connectivity? Our team is ready to help you eliminate friction and accelerate your pipeline.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column: Contact Form */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
                        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">Send a Message</h2>
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="name" className="block font-body font-semibold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-2">FULL NAME</label>
                                <input type="text" id="name" name="name" placeholder="Jane Doe" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors outline-none text-slate-900 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block font-body font-semibold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-2">EMAIL ADDRESS</label>
                                <input type="email" id="email" name="email" placeholder="jane@company.com" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors outline-none text-slate-900 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block font-body font-semibold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-2">SUBJECT</label>
                                <input type="text" id="subject" name="subject" placeholder="How can we help?" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors outline-none text-slate-900 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block font-body font-semibold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-2">MESSAGE</label>
                                <textarea id="message" name="message" rows="5" placeholder="Your message here..." className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors outline-none text-slate-900 dark:text-white resize-none"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white font-display text-lg font-bold py-3 px-6 rounded-full hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                Send Message
                                <span className="material-symbols-outlined text-sm">send</span>
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Contact Details */}
                    <div className="flex flex-col gap-8">
                        {/* Contact Info Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex-grow">
                            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-8">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-indigo-50 dark:bg-slate-700 p-3 rounded-full text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <div>
                                        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Email</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mt-1">Support: <a href="mailto:support@stag.io" className="text-indigo-600 dark:text-indigo-400 hover:underline">support@stag.io</a></p>
                                        <p className="text-slate-500 dark:text-slate-400">Sales: <a href="mailto:sales@stag.io" className="text-indigo-600 dark:text-indigo-400 hover:underline">sales@stag.io</a></p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-indigo-50 dark:bg-slate-700 p-3 rounded-full text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                        <span className="material-symbols-outlined">call</span>
                                    </div>
                                    <div>
                                        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Phone</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mt-1">+1 (555) 123-4567</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Mon-Fri from 8am to 6pm PST</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-indigo-50 dark:bg-slate-700 p-3 rounded-full text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                        <span className="material-symbols-outlined">location_on</span>
                                    </div>
                                    <div>
                                        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Office</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mt-1">100 Innovation Drive<br />Suite 400<br />San Francisco, CA 94105</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                                <h3 className="font-body font-semibold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-4">CONNECT WITH US</h3>
                                <div className="flex gap-4">
                                    <a href="#" className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path>
                                        </svg>
                                    </a>
                                    <a href="#" className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Element / Map Placeholder */}
                        <div className="h-48 rounded-xl overflow-hidden shadow-sm relative group cursor-pointer border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Map" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-4">
                                <span className="text-white font-body font-semibold text-xs tracking-wider uppercase flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">explore</span>
                                    VIEW ON MAP
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ContactUs;
