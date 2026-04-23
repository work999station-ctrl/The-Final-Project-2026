import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import ThemeToggle from './ThemeToggle';

const StudentNavbar = ({ student: studentProp }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [student, setStudent] = useState(studentProp || null);
    const [hasUnread, setHasUnread] = useState(false);

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

    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 lg:px-12 py-4">

                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <img src={logoImage} alt="stage.io logo" className="h-16 w-auto object-contain dark:invert dark:hue-rotate-180 mix-blend-multiply dark:mix-blend-screen" />
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-6">
                        <button
                            onClick={() => navigate('/student-dashboard')}
                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/student-dashboard') ? 'text-primary font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/opportunities')}
                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/opportunities') ? 'text-primary font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Offer Discovery
                        </button>
                        <button
                            onClick={() => navigate('/ApplicationTracker')}
                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/ApplicationTracker') ? 'text-primary font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Applications
                        </button>
                        <button
                            onClick={() => navigate('/student-inbox')}
                            className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 ${isActive('/student-inbox') ? 'text-primary font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">mail</span>
                            Messages
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
                            placeholder="Search offers..."
                            type="text"
                        />
                    </div>

                    <ThemeToggle />

                    {/* Notification bell */}
                    <button
                        className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        onClick={() => navigate('/student-inbox')}
                        title="Messages"
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        {hasUnread && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        )}
                    </button>

                    {/* Student Avatar */}
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
        </header>
    );
};

export default StudentNavbar;
