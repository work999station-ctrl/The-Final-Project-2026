import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useLang } from '../contexts/LanguageContext';

const StudentNavbar = ({ student: studentProp }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLang();
    const [student, setStudent] = useState(studentProp || null);
    const [hasUnread, setHasUnread] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (studentProp) return;
        const fetchStudent = async () => {
            try {
                const res = await fetch('/api/student/me');
                if (res.ok) {
                    const data = await res.json();
                    setStudent(data.user || null);
                }
            } catch (err) {
                console.error('StudentNavbar: failed to fetch student', err);
            }
        };
        fetchStudent();
    }, [studentProp]);

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

    const navLinks = [
        { path: '/student-dashboard', icon: 'dashboard', label: t('dashboard.dashboardLink') },
        { path: '/opportunities', icon: 'travel_explore', label: t('dashboard.offers') },
        { path: '/ApplicationTracker', icon: 'task_alt', label: t('dashboard.myApplications') },
        { path: '/student-inbox', icon: 'mail', label: t('dashboard.messages') },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white/85 dark:bg-slate-900/85 border-b border-slate-200 dark:border-slate-800 backdrop-blur-xl">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-12 h-16">

                {/* Left */}
                <div className="flex items-center gap-6 lg:gap-10">
                    <button
                        type="button"
                        className="md:hidden p-2 -ms-2 text-slate-500 hover:text-primary transition-colors"
                        onClick={() => setMobileOpen(o => !o)}
                        aria-label="Menu"
                    >
                        <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
                    </button>

                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <img src={logoImage} alt="stage.io" className="h-8 w-auto object-contain dark:invert dark:hue-rotate-180 mix-blend-multiply dark:mix-blend-screen" />
                    </div>

                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    isActive(link.path)
                                        ? 'text-primary bg-primary/10'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                                <span>{link.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative hidden lg:block">
                        <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            className="bg-slate-100 dark:bg-slate-800 border-none rounded-full ps-10 pe-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 w-56 outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                            placeholder={t('common.search')}
                            type="text"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    navigate(`/opportunities?search=${encodeURIComponent(e.target.value)}`);
                                }
                            }}
                        />
                    </div>

                    <LanguageSwitcher compact />
                    <ThemeToggle />

                    <button
                        className="relative p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        onClick={() => navigate('/student-inbox')}
                        title={t('dashboard.notifications')}
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        {hasUnread && (
                            <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                        )}
                    </button>

                    <div
                        className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all bg-cover bg-center"
                        style={{ backgroundImage: student?.profilePicture ? `url('${student.profilePicture}')` : 'none' }}
                        onClick={() => navigate('/edit-student-profile')}
                        title={student?.name || 'Profile'}
                    >
                        {!student?.profilePicture && (
                            <span className="material-symbols-outlined text-primary">person</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
                    {navLinks.map(link => (
                        <button
                            key={link.path}
                            onClick={() => { setMobileOpen(false); navigate(link.path); }}
                            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive(link.path)
                                    ? 'text-primary bg-primary/10'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                            {link.label}
                        </button>
                    ))}
                </div>
            )}
        </header>
    );
};

export default StudentNavbar;
