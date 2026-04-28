import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CompanySidebar = ({ company, activePage, topOffset = "top-16" }) => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem('companySidebarCollapsed') === 'true';
    });

    const sidebarWidth = isCollapsed ? '4.5rem' : '16rem';

    useEffect(() => {
        localStorage.setItem('companySidebarCollapsed', isCollapsed);
        window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { isCollapsed } }));
    }, [isCollapsed]);

    const getNavClass = (page) => {
        const active = activePage === page;
        return `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${active
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`;
    };

    const navItems = [
        { page: 'overview', icon: 'business', label: 'Dashboard', href: '/company-dashboard' },
        { page: 'offers', icon: 'work', label: 'My Offers', href: '/company-offers' },
        { page: 'applications', icon: 'groups', label: 'Applications', href: '/candidate-tracking-statistics' },
        { page: 'create-offer', icon: 'add_box', label: 'Create Offer', href: '/create-offer' },
        { page: 'messages', icon: 'chat', label: 'Messages', href: '/company-direct-messages' },
        { page: 'inbox', icon: 'inbox', label: 'Inbox', href: '/company-inbox' },
    ];

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`fixed left-0 ${topOffset} bottom-0 flex flex-col p-3 gap-2 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hidden md:flex z-40 transition-all duration-300 ease-in-out overflow-hidden`}
                style={{ width: sidebarWidth, height: 'auto' }}
            >
                {/* Company Header */}
                <div
                    onClick={() => navigate('/edit-company-profile')}
                    className="flex items-center gap-3 px-2 py-3 mb-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors"
                >
                    <div className="shrink-0">
                        {company?.logo ? (
                            <img alt="Company Logo" className="w-10 h-10 rounded-lg object-cover" src={company.logo} />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold italic">
                                {company?.companyName?.substring(0, 2)?.toUpperCase() || 'CP'}
                            </div>
                        )}
                    </div>
                    <div className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate">{company?.companyName || '—'}</h2>
                        <p className="text-xs text-slate-500 truncate">Recruiter Dashboard</p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1 flex-1">
                    {navItems.map(({ page, icon, label, href }) => (
                        <a key={page} className={getNavClass(page)} href={href} title={isCollapsed ? label : undefined}>
                            <span className="material-symbols-outlined shrink-0">{icon}</span>
                            <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                                {label}
                            </span>
                        </a>
                    ))}
                </nav>

                {/* Bottom Buttons */}
                <div className="flex flex-col gap-3 mt-auto pb-4">
                    <button
                        onClick={() => navigate('/edit-company-profile')}
                        title={isCollapsed ? "Edit Profile" : undefined}
                        className="py-3 px-3 rounded-xl border border-primary/20 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center justify-center gap-2 w-full"
                    >
                        <span className="material-symbols-outlined text-lg shrink-0">edit</span>
                        <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                            Edit Profile
                        </span>
                    </button>
                    <button
                        onClick={async () => {
                            await fetch('/api/logout', { method: 'POST' });
                            window.location.href = '/';
                        }}
                        title={isCollapsed ? "Logout" : undefined}
                        className="flex items-center justify-center gap-2 py-3 px-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all border border-red-100 shadow-sm w-full"
                    >
                        <span className="material-symbols-outlined text-lg shrink-0">logout</span>
                        <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            {/* Toggle Button — fixed, tracks the right edge of the sidebar */}
            <button
                onClick={() => setIsCollapsed(prev => !prev)}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="fixed top-20 z-[60] w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hidden md:flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                style={{ left: `calc(${sidebarWidth} - 12px)`, transition: 'left 300ms ease-in-out' }}
            >
                <span
                    className="material-symbols-outlined transition-transform duration-300"
                    style={{ fontSize: '14px', transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
                >
                    chevron_right
                </span>
            </button>
        </>
    );
};

export default CompanySidebar;
