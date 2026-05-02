import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ userProfile }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(userProfile || null);
    const [loading, setLoading] = useState(!userProfile);

    useEffect(() => {
        if (userProfile) {
            setUser(userProfile);
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                // Try student endpoint first
                const studentRes = await fetch('/api/student/me');
                if (studentRes.ok) {
                    const data = await studentRes.json();
                    setUser(data.user);
                    return;
                }
                // Fallback: try company endpoint
                const companyRes = await fetch('/api/company/me');
                if (companyRes.ok) {
                    const data = await companyRes.json();
                    setUser({ ...data.company, role: 'company' });
                    return;
                }
            } catch (err) {
                console.error('Auth check failed:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userProfile]);

    const handleDashboardClick = () => {
        if (!user) return;
        const role = user.role?.toLowerCase();
        if (role === 'admin') navigate('/admin-dashboard');
        else if (role === 'company') navigate('/company-dashboard');
        else navigate('/student-dashboard');
    };

    const isActive = (...paths) => paths.includes(location.pathname);

    const role = user?.role?.toLowerCase();
    const isCompany = role === 'company';

    return (
        <header className="sticky top-0 z-50 w-full border-b border-solid border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
            <div className="flex items-center justify-between px-6 lg:px-10 py-3 mx-auto w-full">

                {/* Logo */}
                <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                    <img src={logoImage} alt="stage.io logo" className="h-16 w-auto object-contain dark:brightness-0 dark:invert dark:sepia dark:saturate-[10] dark:hue-rotate-[350deg] mix-blend-multiply dark:mix-blend-screen" />
                </div>

                {/* Right side */}
                <div className="flex flex-1 justify-end gap-6 items-center">

                    {/* Nav links */}
                    <nav className="hidden md:flex items-center gap-8">
                        {user ? (
                            isCompany ? (
                                /* ── Company Nav ── */
                                <>
                                    <button
                                        onClick={() => navigate('/company-dashboard')}
                                        className={`text-sm font-medium transition-colors hover:text-[#4F46E5] ${isActive('/company-dashboard') ? 'text-[#4F46E5] font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={() => navigate('/internship-offers')}
                                        className={`text-sm font-medium transition-colors hover:text-[#4F46E5] ${isActive('/internship-offers', '/create-offer') ? 'text-[#4F46E5] font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
                                    >
                                        My Offers
                                    </button>
                                    <button
                                        onClick={() => navigate('/candidate-tracking')}
                                        className={`text-sm font-medium transition-colors hover:text-[#4F46E5] ${isActive('/candidate-tracking') ? 'text-[#4F46E5] font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
                                    >
                                        Candidates
                                    </button>
                                    <button
                                        onClick={() => navigate('/company-inbox')}
                                        className={`text-sm font-medium transition-colors hover:text-[#4F46E5] flex items-center gap-1.5 ${isActive('/company-inbox') ? 'text-[#4F46E5] font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">mail</span>
                                        Inbox
                                    </button>
                                </>
                            ) : (
                                /* ── Student / Admin Nav ── */
                                <>
                                    <button
                                        onClick={handleDashboardClick}
                                        className={`text-sm font-medium transition-colors hover:text-[#4F46E5] ${isActive('/student-dashboard', '/admin-dashboard') ? 'text-[#4F46E5] font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={() => navigate('/opportunities')}
                                        className={`text-sm font-medium transition-colors hover:text-[#4F46E5] ${isActive('/opportunities') ? 'text-[#4F46E5] font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
                                    >
                                        Offer Discovery
                                    </button>
                                    <button
                                        onClick={() => navigate('/student-inbox')}
                                        className={`text-sm font-medium transition-colors hover:text-[#4F46E5] flex items-center gap-1.5 ${isActive('/student-inbox') ? 'text-[#4F46E5] font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">mail</span>
                                        Messages
                                    </button>
                                </>
                            )
                        ) : (
                            /* ── Logged-out ── */
                            <>
                                <Link className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#4F46E5] transition-colors" to="/students">Students</Link>
                                <Link className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#4F46E5] transition-colors" to="/companies">Companies</Link>
                                <Link className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#4F46E5] transition-colors" to="/universities">Universities</Link>
                            </>
                        )}
                    </nav>

                    {/* User actions */}
                    <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800">
                        {!loading && (
                            user ? (
                                <>
                                    {/* Theme Toggle */}
                                    <ThemeToggle />

                                    {/* Notification bell */}
                                    <button className="flex items-center justify-center rounded-full size-9 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition-all relative">
                                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                                    </button>

                                    {/* Avatar */}
                                    <div
                                        className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-[#4F46E5]/20 overflow-hidden cursor-pointer hover:ring-[#4F46E5] transition-all"
                                        style={{ backgroundImage: user.profilePicture || user.logo ? `url('${user.profilePicture || user.logo}')` : 'none' }}
                                        onClick={handleDashboardClick}
                                        title="View Profile"
                                    >
                                        {!(user.profilePicture || user.logo) && (
                                            <div className="w-full h-full bg-[#4F46E5]/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[#4F46E5]">
                                                    {isCompany ? 'business' : 'person'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Theme Toggle */}
                                    <ThemeToggle />

                                    <button
                                        className="hidden sm:block text-sm font-bold px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-[#4F46E5] transition-colors"
                                        onClick={() => navigate('/login')}
                                    >
                                        Log In
                                    </button>
                                    <button
                                        className="bg-[#4F46E5] text-white text-sm font-bold py-2.5 px-6 rounded-full hover:opacity-90 transition-all shadow-lg shadow-[#4F46E5]/20"
                                        onClick={() => navigate('/student-signup')}
                                    >
                                        Get Started
                                    </button>
                                </>
                            )
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
