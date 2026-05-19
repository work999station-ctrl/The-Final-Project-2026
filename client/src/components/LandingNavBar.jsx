import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import { useLang } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const LandingNavBar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const [studentRes, companyRes, adminRes] = await Promise.all([
                    fetch('/api/student/me').catch(() => ({ ok: false })),
                    fetch('/api/company/me').catch(() => ({ ok: false })),
                    fetch('/api/admin/me').catch(() => ({ ok: false }))
                ]);

                if (studentRes.ok) {
                    const data = await studentRes.json();
                    setUser({ ...data.user, role: data.user.role || 'student' });
                } else if (companyRes.ok) {
                    const data = await companyRes.json();
                    setUser({ ...data.user, role: data.user.role || 'company' });
                } else if (adminRes.ok) {
                    const data = await adminRes.json();
                    setUser({ ...data.user, role: data.user.role || 'admin' });
                }
            } catch (err) {
                console.error("Auth check failed:", err);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();

        // Add scroll effect to header
        const header = document.querySelector('header');

        const scrollEffect = () => {
            if (header) {
                if (window.scrollY > 10) {
                    header.classList.add('shadow-md');
                } else {
                    header.classList.remove('shadow-md');
                }
            }
        };

        window.addEventListener('scroll', scrollEffect);

        return () => {
            window.removeEventListener('scroll', scrollEffect);
        }
    }, []);

    const { t } = useLang();

    const handleDashboardClick = () => {
        if (!user) return;

        const role = user.role?.toLowerCase();
        if (role === 'admin') {
            navigate('/admin-dashboard');
        } else if (role === 'company') {
            navigate('/company-dashboard');
        } else {
            // Default to student dashboard
            navigate('/student-dashboard');
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
                <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                    <Logo size={36} onClick={() => navigate('/')} />
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <Link className="text-sm font-semibold hover:text-primary transition-colors" to="/students">{t('nav.students')}</Link>
                    <Link className="text-sm font-semibold hover:text-primary transition-colors" to="/companies">{t('nav.companies')}</Link>
                    <Link className="text-sm font-semibold hover:text-primary transition-colors" to="/universities">{t('nav.universities')}</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    {!loading && (
                        user ? (
                            <div className="flex items-center gap-4">
                                <ThemeToggle />
                                <button onClick={handleDashboardClick} className="text-sm font-bold text-primary hover:underline">{t('nav.dashboard')}</button>
                                <div
                                    className="size-10 rounded-full border-2 border-primary bg-cover bg-center cursor-pointer shadow-sm"
                                    style={{ backgroundImage: `url('${user.profilePicture || user.logo || '/images/default-avatar.png'}')` }}
                                    onClick={handleDashboardClick}
                                    title="View Profile"
                                ></div>
                            </div>
                        ) : (
                            <>
                                <ThemeToggle />
                                <button className="hidden sm:block text-sm font-bold px-4 py-2 hover:text-primary" onClick={() => navigate('/login')}>{t('nav.login')}</button>
                                <button className="bg-primary text-white text-sm font-bold py-2.5 px-6 rounded-full hover:opacity-90 transition-all shadow-lg shadow-primary/20" onClick={() => navigate('/student-signup')}>
                                    {t('nav.signup')}
                                </button>
                            </>
                        )
                    )}
                </div>
            </div>
        </header>
    );
};

export default LandingNavBar;
