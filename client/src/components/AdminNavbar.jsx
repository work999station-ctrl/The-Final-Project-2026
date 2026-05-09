import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

const AdminNavbar = ({ admin: adminProp }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [admin, setAdmin] = useState(adminProp || null);
    const [hasUnread, setHasUnread] = useState(false);
    const [messages, setMessages] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (adminProp) {
            setAdmin(adminProp);
            return;
        }
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
                    setMessages(data.messages || []);
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
                            defaultValue={new URLSearchParams(location.search).get('search') || ''}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    navigate(`/candidate-tracking-admin?search=${encodeURIComponent(e.target.value)}`);
                                }
                            }}
                        />
                    </div>

                    <LanguageSwitcher compact />
                    <ThemeToggle />

                    {/* Notification bell + dropdown */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            onClick={() => setShowNotifications(!showNotifications)}
                            title="Notifications"
                        >
                            <span className="material-symbols-outlined">notifications</span>
                            {hasUnread && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Notifications</span>
                                </div>
                                <div className="max-h-72 overflow-y-auto">
                                    {messages.length > 0 ? (
                                        messages.slice(0, 5).map((msg, i) => (
                                            <div 
                                                key={i} 
                                                className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${msg.unread ? 'bg-primary/5' : ''}`} 
                                                onClick={() => {
                                                    setShowNotifications(false);
                                                    if (msg.unread) {
                                                        fetch(`/api/inbox/mark-as-read/${msg.id}`, {
                                                            method: 'PUT',
                                                            headers: { 'Content-Type': 'application/json' }
                                                        }).catch(err => console.error("Error marking as read:", err));
                                                        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, unread: false } : m));
                                                    }
                                                    navigate(`/NotificationDetails/${msg.id}`);
                                                }}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate pr-2">{msg.companyName || msg.senderName || 'Notification'}</p>
                                                    {msg.unread && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></span>}
                                                </div>
                                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{msg.title}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{msg.snippet}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-6 text-center text-slate-500 text-sm font-medium">
                                            No new notifications
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => { setShowNotifications(false); navigate('/admin-inbox'); }}
                                        className="w-full text-center px-4 py-3 text-sm font-bold text-primary hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                        View All
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Admin Avatar */}
                    <div
                        className="h-10 w-10 shrink-0 rounded-full bg-primary/20 ring-2 ring-primary/10 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-4 hover:ring-primary/20 transition-all bg-cover bg-center text-primary shadow-sm"
                        style={{ backgroundImage: admin?.profilePicture ? `url('${admin.profilePicture}')` : 'none' }}
                        onClick={() => navigate('/edit-admin-profile')}
                        title={admin?.fullName || 'Admin'}
                    >
                        {!admin?.profilePicture && <span className="material-symbols-outlined text-[20px]">school</span>}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
