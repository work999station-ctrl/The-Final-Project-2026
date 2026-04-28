import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const Footer = () => {
    return (
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
    );
};

export default Footer;
