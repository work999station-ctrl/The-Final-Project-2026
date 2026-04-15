import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CompanyNavbar = ({ company: companyProp }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [company, setCompany] = useState(companyProp || null);
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        if (companyProp) return; // use value from props, set during useState init
        // Auto-fetch company if not passed as prop
        const fetchCompany = async () => {
            try {
                const res = await fetch('/api/company/me');
                if (res.ok) {
                    const data = await res.json();
                    setCompany(data.user || data.company || null);
                }
            } catch (err) {
                console.error('CompanyNavbar: failed to fetch company', err);
            }
        };
        fetchCompany();
    }, [companyProp]);

    useEffect(() => {
        // Check for unread inbox messages
        const checkInbox = async () => {
            try {
                const res = await fetch('/api/inbox/messages');
                if (res.ok) {
                    const data = await res.json();
                    setHasUnread((data.messages || []).some(m => m.unread));
                }
            } catch { /* ignore inbox errors */ }
        };
        checkInbox();
    }, []);

    const isActive = (...paths) => paths.includes(location.pathname);

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/';
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 lg:px-12 py-4">

                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white">
                            <span className="material-symbols-outlined font-bold">hub</span>
                        </div>
                        <h2 className="text-xl font-bold font-header tracking-tight text-slate-900 dark:text-white hidden sm:block">
                            stage.io
                        </h2>
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-6">
                        <button
                            onClick={() => navigate('/company-dashboard')}
                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/company-dashboard') ? 'text-primary font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/opportunities')}
                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/opportunities', '/create-offer') ? 'text-primary font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            My Offers
                        </button>
                        <button
                            onClick={() => navigate('/candidate-tracking-statistics')}
                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/candidate-tracking-statistics') ? 'text-primary font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Candidates
                        </button>
                        <button
                            onClick={() => navigate('/company-inbox')}
                            className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 ${isActive('/company-inbox') ? 'text-primary font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">mail</span>
                            Inbox
                        </button>
                    </nav>
                </div>

                {/* Right: Search + Actions */}
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative hidden sm:block">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            className="bg-slate-100 dark:bg-slate-800 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 w-56 outline-none text-slate-700 dark:text-slate-200"
                            placeholder="Search students..."
                            type="text"
                        />
                    </div>

                    {/* Notification bell */}
                    <button
                        className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        onClick={() => navigate('/company-inbox')}
                        title="Inbox"
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        {hasUnread && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        )}
                    </button>



                    {/* Company Avatar */}
                    <div
                        className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all"
                        onClick={() => navigate('/company-dashboard')}
                        title={company?.companyName || 'Company'}
                    >
                        {company?.logo ? (
                            <img alt="Company logo" className="w-full h-full object-cover" src={company.logo} />
                        ) : (
                            <span className="material-symbols-outlined text-primary">business</span>
                        )}
                    </div>


                </div>
            </div>
        </header>
    );
};

export default CompanyNavbar;
