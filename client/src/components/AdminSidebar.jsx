import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import SocketContext from '../contexts/SocketContext';

const AdminSidebar = ({ activePage, adminUser: adminUserProp }) => {
    const navigate = useNavigate();
    const { t } = useLang();
    const socket = useContext(SocketContext);
    const [adminUser, setAdminUser] = useState(adminUserProp || null);
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem('adminSidebarCollapsed') === 'true';
    });

    const sidebarWidth = isCollapsed ? '4.5rem' : '16rem';

    // Keep adminUser in sync when prop changes (e.g. from AdminDashboard)
    useEffect(() => {
        if (adminUserProp) setAdminUser(adminUserProp);
    }, [adminUserProp]);

    // Self-fetch admin profile
    const fetchAdminUser = async () => {
        try {
            const res = await fetch('/api/admin/me');
            if (res.ok) {
                const data = await res.json();
                if (data.user) setAdminUser(data.user);
            }
        } catch (err) {
            console.error('AdminSidebar: failed to fetch admin', err);
        }
    };

    useEffect(() => {
        if (!adminUserProp) fetchAdminUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Real-time update: listen for profile changes via socket
    useEffect(() => {
        if (!socket) return;
        const handleUserUpdated = (payload) => {
            if (payload?.type === 'admin') fetchAdminUser();
        };
        socket.on('user:updated', handleUserUpdated);
        return () => socket.off('user:updated', handleUserUpdated);
    }, [socket]);

    // Cross-device: re-fetch when window regains focus
    useEffect(() => {
        const handleFocus = () => fetchAdminUser();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    useEffect(() => {
        localStorage.setItem('adminSidebarCollapsed', isCollapsed);
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
        { page: 'dashboard', icon: 'dashboard', label: t('sidebar.admin.dashboard'), href: '/admin-dashboard' },
        { page: 'inbox', icon: 'inbox', label: t('sidebar.admin.inbox'), href: '/admin-inbox' },
        { page: 'validate', icon: 'verified', label: t('sidebar.admin.validate'), href: '/candidate-tracking-admin' },
        { page: 'stats', icon: 'bar_chart', label: t('sidebar.admin.stats'), href: '/university-placement-analytics' },
    ];

    return (
        <>
            {/* Sidebar */}
            <aside
                className="fixed left-0 top-16 bottom-0 flex flex-col p-3 gap-2 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hidden md:flex z-40 transition-all duration-300 ease-in-out overflow-hidden"
                style={{ width: sidebarWidth }}
            >
                {/* Admin Header */}
                <div
                    onClick={() => navigate('/edit-admin-profile')}
                    className="flex items-center gap-3 px-2 py-3 mb-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors flex-shrink-0"
                >
                    <div 
                        className="h-10 w-10 shrink-0 rounded-full bg-primary/20 ring-2 ring-primary/10 flex items-center justify-center overflow-hidden bg-cover bg-center text-primary shadow-sm"
                        style={{ backgroundImage: adminUser?.profilePicture ? `url('${adminUser.profilePicture}?t=${localStorage.getItem('adminProfilePicUpdatedAt') || ''}')` : 'none' }}
                    >
                        {!adminUser?.profilePicture && <span className="material-symbols-outlined text-[20px]">school</span>}
                    </div>
                    <div className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate">{adminUser?.fullName || 'Loading...'}</h2>
                        <p className="text-xs text-slate-500 truncate">{adminUser?.universityName || t('sidebar.admin.portal')}</p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
                    {navItems.map(({ page, icon, label, href }) => (
                        <a key={page} className={getNavClass(page)} href={href} title={isCollapsed ? label : undefined}>
                            <span
                                className="material-symbols-outlined shrink-0"
                                style={activePage === page ? { fontVariationSettings: "'FILL' 1" } : {}}
                            >
                                {icon}
                            </span>
                            <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                                {label}
                            </span>
                        </a>
                    ))}
                </nav>

                {/* Bottom Buttons */}
                <div className="flex flex-col gap-2 flex-shrink-0 border-t border-slate-200 dark:border-slate-800 pt-3 mt-2">
                    <button
                        onClick={() => navigate('/contact-us')}
                        title={isCollapsed ? t('sidebar.admin.help') : undefined}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all w-full"
                    >
                        <span className="material-symbols-outlined shrink-0">help</span>
                        <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                            {t('sidebar.admin.help')}
                        </span>
                    </button>
                    <button
                        onClick={async () => {
                            await fetch('/api/logout', { method: 'POST' });
                            window.location.href = '/';
                        }}
                        title={isCollapsed ? t('sidebar.admin.logout') : undefined}
                        className="flex items-center justify-center gap-2 py-3 px-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all border border-red-100 shadow-sm w-full"
                    >
                        <span className="material-symbols-outlined text-lg shrink-0">logout</span>
                        <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                            {t('sidebar.admin.logout')}
                        </span>
                    </button>
                </div>
            </aside>

            {/* Toggle Button — fixed, tracks the right edge of the sidebar */}
            <button
                onClick={() => setIsCollapsed(prev => !prev)}
                title={isCollapsed ? t('sidebar.admin.expandSidebar') : t('sidebar.admin.collapseSidebar')}
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

export default AdminSidebar;
