import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const SuperAdminSetup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [exists, setExists] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkSuperAdmin = async () => {
            try {
                const res = await fetch('/api/superadmin/check');
                if (res.ok) {
                    const data = await res.json();
                    setExists(data.exists);
                }
            } catch (err) {
                console.error('Error checking superadmin:', err);
                setError('Failed to contact server for setup state.');
            } finally {
                setChecking(false);
            }
        };
        checkSuperAdmin();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setFieldErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});

        try {
            const res = await fetch('/api/superadmin/setup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                // Success: Redirect to login or home
                navigate('/login');
            } else {
                if (data.errors) {
                    setFieldErrors(data.errors);
                } else if (data.error) {
                    setError(data.error);
                } else {
                    setError('An error occurred during SuperAdmin setup.');
                }
            }
        } catch (err) {
            console.error('SuperAdmin setup error:', err);
            setError('Connection error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center font-sans">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (exists) {
        return (
            <div className="bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 text-center max-w-md w-full">
                    <span className="material-symbols-outlined text-emerald-500 text-6xl mb-4">verified_user</span>
                    <h2 className="text-2xl font-black mb-2 text-slate-900 dark:text-white">Setup Already Complete</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm sm:text-base leading-relaxed">
                        A SuperAdmin account has already been initialized in the system. To access the dashboard, please log in with your credentials.
                    </p>
                    <button 
                        onClick={() => navigate('/login')} 
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-[0_4px_12px_rgba(79,70,229,0.2)] focus:ring-2 focus:ring-indigo-500/20 active:scale-[0.98]"
                    >
                        Go to Log In
                    </button>
                </div>
            </div>
        );
    }

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

                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <label className="flex flex-col gap-2 relative">
                                <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold tracking-wide">Master Email</span>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">mail</span>
                                    <input
                                        className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-indigo-600 h-12 pl-12 pr-4 transition-all outline-none border focus:bg-white"
                                        placeholder="master@stage.io"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {fieldErrors.email && <span className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">warning</span>{fieldErrors.email}</span>}
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
                                        value={formData.password}
                                        onChange={handleChange}
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
                                {fieldErrors.password && <span className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">warning</span>{fieldErrors.password}</span>}
                            </label>

                            <button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-14 rounded-xl transition-all shadow-[0_8px_16px_rgba(79,70,229,0.2)] hover:shadow-indigo-600/30 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none active:scale-[0.98] mt-4"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
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
};

export default SuperAdminSetup;
