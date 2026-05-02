import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                if (data.role === 'company') navigate('/company-dashboard');
                else if (data.role === 'admin') navigate('/admin-dashboard');
                else navigate('/student-dashboard');
            } else {
                if (data.errors) {
                    setError(data.errors.email || data.errors.password || 'Invalid login credentials');
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
        <div className="min-h-screen flex font-display bg-white dark:bg-background-dark">

            {/* ── Left decorative panel ───────────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] relative overflow-hidden bg-gradient-to-br from-primary via-violet-600 to-indigo-800 flex-col">
                {/* Background layers */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full opacity-30"
                        style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.25) 0%, transparent 55%)' }} />
                    <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cyan-400/25 blur-3xl" />
                    <div className="absolute top-10 right-0 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
                    {/* Grid */}
                    <div className="absolute inset-0 opacity-[0.06]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.8) 1px, transparent 1px)',
                            backgroundSize: '44px 44px'
                        }}
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full p-12">
                    {/* Logo */}
                    <div className="mb-auto [&_.logo-wordmark]:!text-white">
                        <Logo size={38} onClick={() => navigate('/')} />
                    </div>

                    {/* Main copy */}
                    <div className="py-12">
                        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-3.5 py-1.5 rounded-full text-white/80 text-[11px] font-bold uppercase tracking-widest mb-8">
                            <span className="size-1.5 rounded-full bg-white" />
                            Trusted by 500+ institutions
                        </div>
                        <h2 className="text-3xl xl:text-4xl font-black text-white mb-5 leading-tight">
                            Your next career<br />milestone starts here.
                        </h2>
                        <p className="text-white/65 text-base leading-relaxed mb-10 max-w-sm">
                            Join thousands of students and companies who've streamlined their internship journey through stage.io.
                        </p>

                        {/* Stats row */}
                        <div className="flex gap-8 mb-10">
                            {[
                                { n: '15K+', l: 'Students placed' },
                                { n: '500+', l: 'Companies' },
                                { n: '98%',  l: 'Satisfaction' },
                            ].map(s => (
                                <div key={s.l}>
                                    <div className="text-2xl font-black text-white">{s.n}</div>
                                    <div className="text-[11px] text-white/55 font-medium mt-0.5">{s.l}</div>
                                </div>
                            ))}
                        </div>

                        {/* Testimonial */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6">
                            <div className="flex gap-0.5 mb-4">
                                {[1,2,3,4,5].map(s => (
                                    <span key={s} className="material-symbols-outlined text-amber-300 text-sm"
                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                ))}
                            </div>
                            <p className="text-white/85 text-sm leading-relaxed mb-5 italic">
                                "stage.io reduced our internship onboarding from 3 weeks to 2 days. The automated contracting is an absolute game-changer."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    SB
                                </div>
                                <div>
                                    <div className="text-white font-semibold text-sm">Sarah B.</div>
                                    <div className="text-white/50 text-xs">HR Lead, TechCorp</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-white/30 text-xs mt-auto">© 2026 stage.io Inc. All rights reserved.</p>
                </div>
            </div>

            {/* ── Right form panel ────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col bg-white dark:bg-[#07090F]">
                {/* Top bar */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-white/[0.05]">
                    <div className="lg:hidden">
                        <Logo size={32} onClick={() => navigate('/')} />
                    </div>
                    <div className="lg:ml-auto flex items-center gap-3">
                        <span className="text-slate-400 dark:text-slate-500 text-sm hidden sm:block">New here?</span>
                        <button onClick={() => navigate('/student-signup')}
                            className="h-9 px-5 bg-primary/10 text-primary text-sm font-bold rounded-full hover:bg-primary/20 transition-colors">
                            Create account
                        </button>
                    </div>
                </div>

                {/* Form container */}
                <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
                    <div className="w-full max-w-[420px]">
                        {/* Heading */}
                        <div className="mb-10">
                            <div className="inline-flex items-center gap-2 bg-primary/8 dark:bg-primary/15 text-primary px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6">
                                <span className="size-1.5 rounded-full bg-primary" />
                                Secure login
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                                Welcome back
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base">
                                Sign in to manage your internship network.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-semibold">
                                <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Email address
                                </label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none">
                                        <span className="material-symbols-outlined text-xl">mail</span>
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                    <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</a>
                                </div>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none">
                                        <span className="material-symbols-outlined text-xl">lock</span>
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        className="w-full h-12 pl-12 pr-12 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-primary transition-colors"
                                        aria-label="Toggle password visibility"
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center mt-1"
                            >
                                {loading ? (
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign in
                                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                    </span>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative flex items-center gap-4 py-1">
                                <div className="flex-1 h-px bg-slate-200 dark:bg-white/[0.07]" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or</span>
                                <div className="flex-1 h-px bg-slate-200 dark:bg-white/[0.07]" />
                            </div>

                            {/* Google */}
                            <button
                                type="button"
                                className="w-full h-12 flex items-center justify-center gap-3 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <img
                                    alt="Google"
                                    className="size-5"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMiBk_67zbYSCe3p9BBE_9vtuoCG60_jKT3gVElh7q_u75sWE8Qui-tCz-WgdyU2gy_QvJVYsi6WAIw4SswMZZ4ImNM5QcEdK0iOP2Ybtn8-B5xg9ZoKhR9hmcQVA52Z3pK5UV3KyyHPGAlmzEj9mZmfteswwyZcI1U-b8UxGGd8JuMi4bIh6ZJsL0vwEe5zkVUGUon9iSrHeNVlLeozqNn5Rwr70f1O9odqrh2Yh__xI_tI7rKAauLXkI09NSjAE39ySM75PpcMU"
                                />
                                Continue with Google
                            </button>
                        </form>

                        {/* Legal */}
                        <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
                            By signing in, you agree to our{' '}
                            <Link to="/terms-of-service" className="text-slate-600 dark:text-slate-400 font-semibold hover:text-primary dark:hover:text-primary transition-colors">
                                Terms
                            </Link>
                            {' '}and{' '}
                            <Link to="/privacy-policy" className="text-slate-600 dark:text-slate-400 font-semibold hover:text-primary dark:hover:text-primary transition-colors">
                                Privacy Policy
                            </Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
