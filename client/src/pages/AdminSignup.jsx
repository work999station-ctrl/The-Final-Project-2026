import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        universityName: 'University of Constantine 1',
        role: 'Admin'
    });
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setFieldErrors({});
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});

        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });
            if (logoFile) {
                submitData.append('profilePicture', logoFile);
            }

            const res = await fetch('/api/adminSignup', {
                method: 'POST',
                body: submitData
            });

            const data = await res.json();

            if (res.ok) {
                navigate('/admin-dashboard');
            } else {
                if (data.email || data.password || data.fullName) {
                    setFieldErrors(data);
                } else {
                    setError('An error occurred during signup');
                }
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError('Connection error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <div className="relative flex min-h-screen flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    {/* Navigation Header */}
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 lg:px-40 py-4 bg-white dark:bg-slate-900 sticky top-0 z-50">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white">
                                <span className="material-symbols-outlined">hub</span>
                            </div>
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight shadow-sm md:shadow-none">CampusConnect</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="hidden md:block text-slate-500 text-sm font-medium">Already have an account?</span>
                            <button onClick={() => navigate('/login')} className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors shadow-sm focus:ring-2 focus:ring-primary/20">
                                Log In
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 flex justify-center py-12 px-4">
                        <div className="w-full max-w-[640px] flex flex-col gap-8">
                            {/* Header Text */}
                            <div className="flex flex-col gap-2 px-4 text-center md:text-left">
                                <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight font-headline">Create Admin Account</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-lg">Join the administrative team to manage university placements and records.</p>
                            </div>

                            {/* Sign-up Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-semibold">
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        {error}
                                    </div>
                                )}

                                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                                    {/* Logo Upload Area */}
                                    <div className="flex flex-col gap-3">
                                        <p className="text-slate-900 dark:text-slate-200 text-base font-semibold">Profile Photo</p>
                                        <div className="flex items-center gap-6">
                                            <div className="h-24 w-24 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center text-primary overflow-hidden flex-shrink-0 relative group">
                                                {logoPreview ? (
                                                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-white text-2xl">edit</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer inline-block text-center border-2 border-transparent focus-within:border-primary">
                                                    Upload Image
                                                    <input type="file" accept="image/*" onChange={handleLogoChange} className="absolute w-1 h-1 opacity-0 z-[-1]" />
                                                </label>
                                                <p className="text-xs text-slate-400 font-medium">JPG, PNG or SVG. Max size 2MB.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Full Name */}
                                        <label className="flex flex-col gap-2 relative">
                                            <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold tracking-wide">Full Name</span>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">person</span>
                                                <input
                                                    className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 pl-12 pr-4 transition-all"
                                                    placeholder="Dr. John Doe"
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            {fieldErrors.fullName && <span className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">warning</span>{fieldErrors.fullName}</span>}
                                        </label>

                                        {/* Email */}
                                        <label className="flex flex-col gap-2 relative">
                                            <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold tracking-wide">University Email</span>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">mail</span>
                                                <input
                                                    className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 pl-12 pr-4 transition-all"
                                                    placeholder="name@university.edu"
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            {fieldErrors.email && <span className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">warning</span>{fieldErrors.email}</span>}
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Phone Number */}
                                        <label className="flex flex-col gap-2 relative">
                                            <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold tracking-wide">Phone Number</span>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">call</span>
                                                <input
                                                    className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 pl-12 pr-4 transition-all"
                                                    placeholder="+213 555 123 456"
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </label>

                                        {/* Admin Role */}
                                        <label className="flex flex-col gap-2 relative">
                                            <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold tracking-wide">Admin Role</span>
                                            <div className="relative flex items-center">
                                                <span className="material-symbols-outlined absolute left-4 text-slate-400 text-[20px] pointer-events-none z-10 hidden sm:block">badge</span>
                                                <select
                                                    className="form-select w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 pl-4 sm:pl-12 pr-10 transition-all appearance-none outline-none font-medium cursor-pointer"
                                                    name="role"
                                                    value={formData.role}
                                                    onChange={handleChange}
                                                >
                                                    <option value="Internship_Office_Staff">Internship Office Staff</option>
                                                    <option value="Dept_Head">Department Head</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                                                    <span className="material-symbols-outlined text-xl">expand_more</span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {/* University Name */}
                                    <label className="flex flex-col gap-2 relative">
                                        <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold tracking-wide">University Name</span>
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-4 text-slate-400 text-[20px] pointer-events-none z-10">school</span>
                                            <select
                                                className="form-select w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 pl-12 pr-10 transition-all appearance-none outline-none font-medium cursor-pointer"
                                                name="universityName"
                                                value={formData.universityName}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="University of Constantine 1">University of Constantine 1</option>
                                                <option value="University of Constantine 2">University of Constantine 2</option>
                                                <option value="University of Constantine 3">University of Constantine 3</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                                                <span className="material-symbols-outlined text-xl">expand_more</span>
                                            </div>
                                        </div>
                                    </label>

                                    {/* Password */}
                                    <label className="flex flex-col gap-2 relative">
                                        <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold tracking-wide">Password</span>
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">lock</span>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 pl-12 pr-12 transition-all"
                                                placeholder="••••••••"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                minLength="6"
                                            />
                                            <button
                                                className="absolute right-3 text-slate-400 hover:text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors flex items-center justify-center"
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                            </button>
                                        </div>
                                        {fieldErrors.password && <span className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">warning</span>{fieldErrors.password}</span>}
                                    </label>

                                    {/* Submit */}
                                    <div className="flex flex-col gap-5 mt-4">
                                        <button
                                            className="w-full bg-primary text-white font-bold h-14 rounded-full hover:bg-primary/90 transition-all shadow-[0_8px_16px_rgba(79,70,229,0.2)] hover:shadow-primary/30 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none active:scale-[0.98]"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <div className="size-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    Create Admin Account <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                                                </>
                                            )}
                                        </button>
                                        <p className="text-center text-xs text-slate-500 font-medium px-4">
                                            By creating an account, you agree to our <a className="text-primary hover:underline font-bold" href="#">Terms of Service</a> and <a className="text-primary hover:underline font-bold" href="#">Privacy Policy</a>.
                                        </p>
                                    </div>
                                </form>
                            </div>

                            {/* Footer Decorative */}
                            <div className="flex justify-center flex-wrap items-center gap-6 sm:gap-10 py-6 text-slate-400 group">
                                <div className="flex items-center gap-2 transition-colors hover:text-slate-600 dark:hover:text-slate-300">
                                    <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
                                    <span className="font-bold text-sm tracking-wide">Admin Features</span>
                                </div>
                                <div className="flex items-center gap-2 transition-colors hover:text-slate-600 dark:hover:text-slate-300">
                                    <span className="material-symbols-outlined text-[22px]">verified_user</span>
                                    <span className="font-bold text-sm tracking-wide">Secure Analytics</span>
                                </div>
                                <div className="flex items-center gap-2 transition-colors hover:text-slate-600 dark:hover:text-slate-300">
                                    <span className="material-symbols-outlined text-[22px]">fact_check</span>
                                    <span className="font-bold text-sm tracking-wide">Validation Hub</span>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="py-8 text-center text-slate-400 text-sm font-medium border-t border-slate-100 dark:border-slate-800/50 mt-auto">
                        © 2024 CampusConnect Inc. All rights reserved.
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default AdminSignup;
