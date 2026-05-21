import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    
    // Setup state
    const [isInitialized, setIsInitialized] = useState(null); // null = checking, false = needs setup, true = initialized
    const [setupForm, setSetupForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [setupLoading, setSetupLoading] = useState(false);
    const [setupErrors, setSetupErrors] = useState({});

    // Dashboard stats state
    const [stats, setStats] = useState({
        students: 0,
        companies: 0,
        admins: 0,
        offers: 0,
        applications: 0
    });
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    const checkSetupAndLoad = async () => {
        setLoading(true);
        try {
            // First check if SuperAdmin exists
            const checkRes = await fetch('/api/superadmin/check');
            if (checkRes.ok) {
                const checkData = await checkRes.json();
                setIsInitialized(checkData.exists);
                
                if (checkData.exists) {
                    // A SuperAdmin exists, try to load stats
                    const statsRes = await fetch('/api/superadmin/stats');
                    if (statsRes.ok) {
                        const data = await statsRes.json();
                        if (data.stats) setStats(data.stats);
                        if (data.allUsers) setAllUsers(data.allUsers);
                    } else {
                        if (statsRes.status === 401 || statsRes.status === 403) {
                            navigate('/login');
                        } else {
                            setError('Failed to load system statistics.');
                        }
                    }
                } else {
                    // No SuperAdmin exists, we show setup
                }
            } else {
                setError('Failed to query system status.');
            }
        } catch (err) {
            console.error('Failed to load SuperAdmin stats:', err);
            setError('Connection error. Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkSetupAndLoad();
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSetupSubmit = async (e) => {
        e.preventDefault();
        setSetupLoading(true);
        setError('');
        setSetupErrors({});

        try {
            const res = await fetch('/api/superadmin/setup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(setupForm)
            });

            const data = await res.json();

            if (res.ok) {
                // Successfully set up, now load the dashboard data
                setIsInitialized(true);
                checkSetupAndLoad();
            } else {
                if (data.errors) {
                    setSetupErrors(data.errors);
                } else if (data.error) {
                    setError(data.error);
                } else {
                    setError('An error occurred during SuperAdmin setup.');
                }
            }
        } catch (err) {
            console.error('Setup error:', err);
            setError('Connection error. Please try again.');
        } finally {
            setSetupLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/logout', { method: 'POST' });
            if (res.ok) {
                navigate('/login');
            }
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const handleDeleteUser = async (role, userId) => {
        if (!window.confirm(`Are you sure you want to permanently delete this ${role} account?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/superadmin/users/${role}/${userId}`, {
                method: 'DELETE'
            });

            const data = await res.json();
            if (res.ok) {
                checkSetupAndLoad();
            } else {
                setError(data.error || 'Failed to delete the account.');
            }
        } catch (err) {
            console.error('Delete user error:', err);
            setError('Connection error. Failed to delete the account.');
        }
    };

    if (loading && isInitialized === null) {
        return (
            <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center font-sans">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Render Setup Page if not initialized
    if (isInitialized === false) {
        return (
            <div className="bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col justify-between overflow-x-hidden">
                <header className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-slate-800 px-6 lg:px-40 py-4 bg-white dark:bg-slate-900 sticky top-0 z-50">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <img src={logoImage} alt="stage.io logo" className="h-16 w-auto object-contain dark:brightness-0 dark:invert" />
                    </div>
                    <button onClick={() => navigate('/login')} className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-full h-10 px-6 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors shadow-sm">
                        Log In
                    </button>
                </header>

                <main className="flex-1 flex items-center justify-center py-12 px-4">
                    <div className="w-full max-w-[500px] flex flex-col gap-8">
                        <div className="flex flex-col gap-2 text-center">
                            <h1 className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-tight">SuperAdmin Setup</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
                                Initialize the master SuperAdmin profile. This setup can only be done once.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-semibold">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    {error}
                                </div>
                            )}

                            <form className="flex flex-col gap-6" onSubmit={handleSetupSubmit}>
                                <label className="flex flex-col gap-2 relative">
                                    <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold tracking-wide">Master Email</span>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">mail</span>
                                        <input
                                            className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-indigo-600 h-12 pl-12 pr-4 transition-all outline-none border focus:bg-white"
                                            placeholder="master@stage.io"
                                            type="email"
                                            name="email"
                                            value={setupForm.email}
                                            onChange={(e) => {
                                                setSetupForm({ ...setupForm, email: e.target.value });
                                                setError('');
                                                setSetupErrors({});
                                            }}
                                            required
                                        />
                                    </div>
                                    {setupErrors.email && <span className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">warning</span>{setupErrors.email}</span>}
                                </label>

                                <label className="flex flex-col gap-2 relative">
                                    <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold tracking-wide">Password</span>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">lock</span>
                                        <input
                                            className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-indigo-600 h-12 pl-12 pr-12 transition-all outline-none border focus:bg-white"
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={setupForm.password}
                                            onChange={(e) => {
                                                setSetupForm({ ...setupForm, password: e.target.value });
                                                setError('');
                                                setSetupErrors({});
                                            }}
                                            required
                                            minLength="6"
                                        />
                                        <button
                                            className="absolute right-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors flex items-center justify-center"
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                        </button>
                                    </div>
                                    {setupErrors.password && <span className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">warning</span>{setupErrors.password}</span>}
                                </label>

                                <button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-14 rounded-xl transition-all shadow-[0_8px_16px_rgba(79,70,229,0.2)] hover:shadow-indigo-600/30 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none active:scale-[0.98] mt-4"
                                    type="submit"
                                    disabled={setupLoading}
                                >
                                    {setupLoading ? (
                                        <div className="size-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Initialize SuperAdmin <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        <div className="flex justify-center flex-wrap items-center gap-6 py-4 text-slate-400">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">shield</span>
                                <span className="font-bold text-xs sm:text-sm tracking-wide">Master Security</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">database</span>
                                <span className="font-bold text-xs sm:text-sm tracking-wide">One-Time Initialization</span>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} stage.io. All rights reserved.
                </footer>
            </div>
        );
    }

    // Render full Master Control Dashboard if initialized and logged in
    return (
        <div className="bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
            {/* SuperAdmin Header */}
            <header className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-slate-800 px-6 lg:px-40 py-4 bg-white dark:bg-slate-900 sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <img src={logoImage} alt="stage.io logo" className="h-12 w-auto object-contain dark:brightness-0 dark:invert" />
                    <span className="bg-indigo-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        SuperAdmin
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="hidden sm:inline text-xs text-slate-500 font-medium">
                        {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} - {currentTime.toLocaleTimeString()}
                    </span>
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-2 cursor-pointer rounded-full h-10 px-6 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-100 dark:hover:bg-red-950/30 transition-all active:scale-[0.98]"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Log Out
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col gap-10">
                {/* Dashboard Title */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                        System Control Room
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base">
                        Real-time master dashboard overseeing all departments, users, and platform applications.
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-semibold">
                        <span className="material-symbols-outlined text-lg">error</span>
                        {error}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                    {/* Stat Card: Students */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Students</span>
                            <span className="material-symbols-outlined text-indigo-500 text-[28px] bg-indigo-50 dark:bg-indigo-950/50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">school</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">{stats.students}</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Registered Candidate Profiles</p>
                        </div>
                    </div>

                    {/* Stat Card: Companies */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Companies</span>
                            <span className="material-symbols-outlined text-teal-500 text-[28px] bg-teal-50 dark:bg-teal-950/50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">corporate_fare</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">{stats.companies}</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Enterprise Partners</p>
                        </div>
                    </div>

                    {/* Stat Card: Admins */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Admins</span>
                            <span className="material-symbols-outlined text-emerald-500 text-[28px] bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">admin_panel_settings</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">{stats.admins}</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Department Coordinators</p>
                        </div>
                    </div>

                    {/* Stat Card: Offers */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Job Offers</span>
                            <span className="material-symbols-outlined text-amber-500 text-[28px] bg-amber-50 dark:bg-amber-950/50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">work</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">{stats.offers}</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Total Postings</p>
                        </div>
                    </div>

                    {/* Stat Card: Applications */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Applications</span>
                            <span className="material-symbols-outlined text-violet-500 text-[28px] bg-violet-50 dark:bg-violet-950/50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">assignment</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">{stats.applications}</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Total Applied Records</p>
                        </div>
                    </div>
                </div>

                {/* Admins & Activities */}
                <div className="grid grid-cols-1 gap-8">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-indigo-600 text-2xl">supervisor_account</span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Registered Platform Users</h3>
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
                                Total Users: {allUsers.length}
                            </span>
                        </div>

                        {allUsers.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-4xl text-slate-300">group_off</span>
                                <p className="font-semibold text-sm">No registered platform users yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                            <th className="py-4 px-4">Profile</th>
                                            <th className="py-4 px-4">Name</th>
                                            <th className="py-4 px-4">Role</th>
                                            <th className="py-4 px-4">Email</th>
                                            <th className="py-4 px-4">Phone</th>
                                            <th className="py-4 px-4">University / Affiliation</th>
                                            <th className="py-4 px-4">Dept / Speciality</th>
                                            <th className="py-4 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {allUsers.map((user) => (
                                            <tr key={user._id} className="text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800">
                                                        {user.profilePicture ? (
                                                            <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="material-symbols-outlined text-indigo-500">person</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                                                    {user.name}
                                                </td>
                                                <td className="py-4 px-4">
                                                    {user.role === 'admin' && (
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 rounded-full font-bold text-xs border border-blue-200/50 dark:border-blue-900/50">
                                                            Admin
                                                        </span>
                                                    )}
                                                    {user.role === 'company' && (
                                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-full font-bold text-xs border border-emerald-200/50 dark:border-emerald-900/50">
                                                            Company
                                                        </span>
                                                    )}
                                                    {user.role === 'student' && (
                                                        <span className="px-3 py-1 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 rounded-full font-bold text-xs border border-violet-200/50 dark:border-violet-900/50">
                                                            Student
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 font-mono text-xs">
                                                    {user.email}
                                                </td>
                                                <td className="py-4 px-4">
                                                    {user.phone || 'N/A'}
                                                </td>
                                                <td className="py-4 px-4">
                                                    {user.details?.university || 'N/A'}
                                                </td>
                                                <td className="py-4 px-4">
                                                    {user.details?.department ? (
                                                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full font-semibold text-xs text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                                                            {user.details.department}
                                                        </span>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.role, user._id)}
                                                        className="p-2 cursor-pointer rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30 transition-all hover:scale-105 active:scale-95"
                                                        title={`Delete ${user.role} Account`}
                                                    >
                                                        <span className="material-symbols-outlined text-[20px] flex items-center justify-center">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SuperAdminDashboard;
