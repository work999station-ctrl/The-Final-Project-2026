import React from 'react';
import { useNavigate } from 'react-router-dom';

const CompanySidebar = ({ company, activePage, topOffset = "top-16" }) => {
    const navigate = useNavigate();

    const getNavClass = (page) => {
        return activePage === page
            ? "flex items-center gap-3 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium"
            : "flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all rounded-lg text-sm font-medium";
    };

    return (
        <aside className={`fixed left-0 ${topOffset} bottom-0 flex flex-col p-4 gap-2 h-screen w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hidden md:flex z-40`}>
            <div onClick={() => navigate('/edit-company-profile')} className="flex items-center gap-3 px-2 py-3 mb-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors">
                {company?.logo ? (
                    <img alt="Company Logo" className="w-10 h-10 rounded-lg object-cover" src={company.logo} />
                ) : (
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold italic">
                        {company?.name?.substring(0, 2) || 'CP'}
                    </div>
                )}
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight">{company?.name || 'TechCorp Inc.'}</h2>
                    <p className="text-xs text-slate-500">Recruiter Dashboard</p>
                </div>
            </div>
            <nav className="flex flex-col gap-1 flex-1">
                <a className={getNavClass('overview')} href="/company-dashboard">
                    <span className="material-symbols-outlined">business</span> Dashboard
                </a>
                <a className={getNavClass('offers')} href="/opportunities">
                    <span className="material-symbols-outlined">work</span> My Offers
                </a>
                <a className={getNavClass('applications')} href="/candidate-tracking-statistics">
                    <span className="material-symbols-outlined">groups</span> Applications
                </a>
                <a className={getNavClass('create-offer')} href="/create-offer">
                    <span className="material-symbols-outlined">add_box</span> Create Offer
                </a>
                <a className={getNavClass('inbox')} href="/company-inbox">
                    <span className="material-symbols-outlined">inbox</span> Inbox
                </a>
                <a className={getNavClass('settings')} href="/edit-company-profile">
                    <span className="material-symbols-outlined">settings_applications</span> Settings
                </a>
            </nav>
            <div className="flex flex-col gap-3 mt-auto mb-16 md:mb-0 pb-16">
                <button
                    onClick={() => navigate('/edit-company-profile')}
                    className="w-full py-3 px-4 rounded-xl border border-primary/20 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">edit</span>
                    Edit Profile
                </button>
                <button
                    onClick={async () => {
                        await fetch('/api/logout', { method: 'POST' });
                        window.location.href = '/';
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all border border-red-100 group shadow-sm shadow-red-50"
                >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default CompanySidebar;
