import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import ThemeToggle from './ThemeToggle';

const AdminNavbar = ({ admin: adminProp }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [admin, setAdmin] = useState(adminProp || null);
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        if (adminProp) return;
        const fetchAdmin = async () => {
            try {
                const res = await fetch('/api/admin/me');
                if (res.ok) {
                    const data = await res.json();
                    setAdmin(data.user || null);
                }
            } catch (err) {
                console.error('AdminNavbar: failed to fetch admin', err);
            }
        };
        fetchAdmin();
    }, [adminProp]);

    useEffect(() => {
        const checkInbox = async () => {
            try {
                const res = await fetch('/api/inbox/messages');
                if (res.ok) {
                    const data = await res.json();
                    setHasUnread((data.messages || []).some(m => m.unread));
                }
            } catch { /* ignore */ }
        };
        checkInbox();
    }, []);

    const isActive = (...paths) => paths.includes(location.pathname);

    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 lg:px-12 h-16">

                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <img src={logoImage} alt="stage.io logo" className="h-8 w-auto object-contain dark:brightness-0 dark:invert dark:sepia dark:saturate-[10] dark:hue-rotate-[350deg] mix-blend-multiply dark:mix-blend-screen" />
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-6">
                        <button
                            onClick={() => navigate('/admin-dashboard')}
                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/admin-dashboard') ? 'text-primary font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/candidate-tracking-admin')}
                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/candidate-tracking-admin') ? 'text-primary font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Validations
                        </button>
                        <button
                            onClick={() => navigate('/admin-inbox')}
                            className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 ${isActive('/admin-inbox') ? 'text-primary font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
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
                            placeholder="Search records..."
                            type="text"
                        />
                    </div>

                    <ThemeToggle />

                    {/* Notification bell */}
                    <button
                        className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        onClick={() => navigate('/admin-inbox')}
                        title="Inbox"
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        {hasUnread && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        )}
                    </button>

                    {/* Admin Avatar */}
                    <div
                        className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all"
                        onClick={() => navigate('/edit-admin-profile')}
                        title={admin?.fullName || 'Admin'}
                    >
                        {admin?.profilePicture ? (
                            <img alt="Admin profile" className="w-full h-full object-cover" src={admin.profilePicture} />
                        ) : (
                            <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
