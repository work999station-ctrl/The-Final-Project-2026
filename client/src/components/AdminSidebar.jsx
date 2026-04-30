import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ activePage, adminUser }) => {
    const navigate = useNavigate();

    const getNavClass = (page) => {
        return activePage === page
            ? "flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full px-4 py-2 transition-all duration-300 ease-in-out"
            : "flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-2 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 rounded-full transition-all duration-300 ease-in-out";
    };

    return (
        <aside className="fixed left-0 top-16 flex flex-col p-4 bg-slate-50 dark:bg-slate-950 h-[calc(100vh-4rem)] w-64 border-r-0 z-40">
            <div className="flex items-center gap-3 px-2 py-3 mb-6 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors" onClick={() => navigate('/edit-admin-profile')}>
                {adminUser?.profilePicture ? (
                    <img alt="Admin Avatar" className="w-10 h-10 rounded-lg object-cover" src={adminUser.profilePicture} />
                ) : (
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold italic">
                        {adminUser?.fullName?.substring(0, 2).toUpperCase() || 'AD'}
                    </div>
                )}
                <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate w-36">{adminUser?.fullName || 'Loading...'}</h2>
                    <p className="text-xs text-slate-500 truncate w-36">{adminUser?.universityName || 'University Admin'}</p>
                </div>
            </div>
            <nav className="flex-1 space-y-2">
                <a className={getNavClass('dashboard')} href="/admin-dashboard">
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="font-['Inter'] font-medium text-sm">Dashboard</span>
                </a>
                <a className={getNavClass('inbox')} href="/admin-inbox">
                    <span className="material-symbols-outlined">inbox</span>
                    <span className="font-['Inter'] font-medium text-sm">Inbox</span>
                </a>
                <a className={getNavClass('validate')} href="/candidate-tracking-admin">
                    <span className="material-symbols-outlined" style={activePage === 'validate' ? { fontVariationSettings: "'FILL' 1" } : {}}>verified</span>
                    <span className="font-['Inter'] font-medium text-sm">Validate</span>
                </a>
                <a className={getNavClass('stats')} href="/university-placement-analytics">
                    <span className="material-symbols-outlined" style={activePage === 'stats' ? { fontVariationSettings: "'FILL' 1" } : {}}>bar_chart</span>
                    <span className="font-['Inter'] font-medium text-sm">Stats</span>
                </a>
            </nav>
            <div className="mt-auto space-y-2 border-t border-outline-variant/10 pt-4">
                <a className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-2 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 rounded-full transition-all duration-300" href="#">
                    <span className="material-symbols-outlined">help</span>
                    <span className="font-['Inter'] font-medium text-sm">Help</span>
                </a>
                <button
                    onClick={async () => {
                        await fetch('/api/logout', { method: 'POST' });
                        window.location.href = '/';
                    }}
                    className="w-full flex items-center gap-3 text-red-600 dark:text-red-400 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-300 text-sm font-medium"
                >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span className="font-['Inter']">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
