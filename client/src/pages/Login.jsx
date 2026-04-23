import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                // Redirect based on role returned from backend
                if (data.role === 'company') {
                    navigate('/company-dashboard');
                } else if (data.role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/student-dashboard');
                }
            } else {
                // Handle errors from the backend (handelErrors)
                if (data.errors) {
                    if (data.errors.email) setError(data.errors.email);
                    else if (data.errors.password) setError(data.errors.password);
                    else setError('Invalid login credentials');
                } else {
                    setError('An error occurred during login');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Connection error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    {/* Header */}
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 lg:px-40 py-4 bg-white dark:bg-slate-900 sticky top-0 z-50">
                        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                            <img src={logoImage} alt="stage.io logo" className="h-16 w-auto object-contain dark:invert dark:hue-rotate-180 mix-blend-multiply dark:mix-blend-screen" />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="hidden md:block text-slate-500 text-sm">New here?</span>
                            <button onClick={() => navigate('/student-signup')} className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors">
                                Sign Up
                            </button>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex flex-1 items-center justify-center p-6 relative">
                        <div className="absolute inset-0 overflow-hidden -z-10">
                            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="w-full max-w-[480px] bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12 rounded-xl shadow-2xl shadow-primary/5">
                            <div className="flex flex-col gap-2 mb-10 text-center">
                                <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">Welcome Back</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-base">Login to manage your global network connections.</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-semibold">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    {error}
                                </div>
                            )}

                            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold px-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-xl">mail</span>
                                        </div>
                                        <input
                                            className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                            placeholder="name@company.com"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Password</label>
                                        <a className="text-primary text-xs font-bold hover:underline" href="#">Forgot Password?</a>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-xl">lock</span>
                                        </div>
                                        <input
                                            className="w-full pl-11 pr-12 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    className="w-full h-14 bg-primary text-white rounded-full font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex justify-center items-center"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        "Log In"
                                    )}
                                </button>

                                <div className="relative flex py-4 items-center">
                                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                                    <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Or continue with</span>
                                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                                </div>

                                <div className="grid gap-4 flex-col">
                                    <button type="button" className="flex items-center justify-center gap-2 h-12 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                        <img alt="" className="size-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMiBk_67zbYSCe3p9BBE_9vtuoCG60_jKT3gVElh7q_u75sWE8Qui-tCz-WgdyU2gy_QvJVYsi6WAIw4SswMZZ4ImNM5QcEdK0iOP2Ybtn8-B5xg9ZoKhR9hmcQVA52Z3pK5UV3KyyHPGAlmzEj9mZmfteswwyZcI1U-b8UxGGd8JuMi4bIh6ZJsL0vwEe5zkVUGUon9iSrHeNVlLeozqNn5Rwr70f1O9odqrh2Yh__xI_tI7rKAauLXkI09NSjAE39ySM75PpcMU" />
                                        <span className="text-sm font-semibold">Google</span>
                                    </button>
                                </div>
                            </form>

                            <div className="mt-10 text-center">
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    By logging in, you agree to our <Link className="text-slate-900 dark:text-white font-semibold hover:underline" to="/terms-of-service">Terms of Service</Link> and <Link className="text-slate-900 dark:text-white font-semibold hover:underline" to="/privacy-policy">Privacy Policy</Link>.
                                </p>
                            </div>
                        </div>
                    </main>

                    <footer className="p-8 text-center text-slate-400 text-xs font-medium tracking-tight mt-auto border-t border-slate-200 dark:border-slate-800">
                        © 2024 Modern Connectivity Platform. All rights reserved.
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Login;
