import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const CompanySignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        password: '',
        address: '',
        description: '',
        website: ''
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
                submitData.append('logo', logoFile);
            }

            const res = await fetch('/api/companySignup', {
                method: 'POST',
                body: submitData
            });

            const data = await res.json();

            if (res.ok) {
                navigate('/company-dashboard');
            } else {
                // data is the errors object from handelErrors
                if (data.email || data.password || data.companyName) {
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
                        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                            <img src={logoImage} alt="stage.io logo" className="h-16 w-auto object-contain" />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="hidden md:block text-slate-500 text-sm">Already have an account?</span>
                            <button onClick={() => navigate('/login')} className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors">
                                Log In
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 flex justify-center py-12 px-4">
                        <div className="w-full max-w-[640px] flex flex-col gap-8">
                            {/* Header Text */}
                            <div className="flex flex-col gap-2 px-4">
                                <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">Create Company Account</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-lg">Join our professional network and start connecting with industry leaders.</p>
                            </div>

                            {/* Sign-up Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8">
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-semibold">
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        {error}
                                    </div>
                                )}

                                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                                    {/* Logo Upload Area */}
                                    <div className="flex flex-col gap-3">
                                        <p className="text-slate-900 dark:text-slate-200 text-base font-semibold">Company Logo</p>
                                        <div className="flex items-center gap-6">
                                            <div className="h-24 w-24 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center text-primary overflow-hidden flex-shrink-0">
                                                {logoPreview ? (
                                                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer inline-block text-center">
                                                    Upload Image
                                                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                                </label>
                                                <p className="text-xs text-slate-400">JPG, PNG or SVG. Max size 2MB.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Company Name */}
                                        <label className="flex flex-col gap-2">
                                            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Company Name</span>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 px-4 transition-all"
                                                placeholder="e.g. Acme Corp"
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                                required
                                            />
                                            {fieldErrors.companyName && <span className="text-red-500 text-xs font-medium">{fieldErrors.companyName}</span>}
                                        </label>

                                        {/* Business Email */}
                                        <label className="flex flex-col gap-2">
                                            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Business Email</span>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 px-4 transition-all"
                                                placeholder="name@company.com"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                            {fieldErrors.email && <span className="text-red-500 text-xs font-medium">{fieldErrors.email}</span>}
                                        </label>
                                    </div>

                                    {/* Password */}
                                    <label className="flex flex-col gap-2">
                                        <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Password</span>
                                        <div className="relative flex items-center">
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 px-4 pr-12 transition-all"
                                                placeholder="••••••••"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <button
                                                className="absolute right-4 text-slate-400 hover:text-primary transition-colors"
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                            </button>
                                        </div>
                                        {fieldErrors.password && <span className="text-red-500 text-xs font-medium">{fieldErrors.password}</span>}
                                    </label>

                                    {/* Website */}
                                    <label className="flex flex-col gap-2">
                                        <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Website</span>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">language</span>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 pl-11 pr-4 transition-all"
                                                placeholder="https://yourcompany.com"
                                                type="url"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </label>

                                    {/* Address */}
                                    <label className="flex flex-col gap-2">
                                        <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Address</span>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">location_on</span>
                                            <input
                                                className="form-input w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 pl-11 pr-4 transition-all"
                                                placeholder="123 Main St, Algiers"
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </label>

                                    {/* Description */}
                                    <label className="flex flex-col gap-2">
                                        <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Company Description</span>
                                        <textarea
                                            className="form-textarea w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-primary p-4 transition-all resize-none"
                                            placeholder="Tell us about your company mission and values..."
                                            rows="4"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                        ></textarea>
                                    </label>

                                    {/* Submit */}
                                    <div className="flex flex-col gap-4 mt-2">
                                        <button
                                            className="w-full bg-primary text-white font-bold h-14 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center disabled:opacity-70"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                "Create My Account"
                                            )}
                                        </button>
                                        <p className="text-center text-xs text-slate-400">
                                            By creating an account, you agree to our <a className="text-primary hover:underline font-medium" href="#">Terms of Service</a> and <a className="text-primary hover:underline font-medium" href="#">Privacy Policy</a>.
                                        </p>
                                    </div>
                                </form>
                            </div>

                            {/* Footer Decorative */}
                            <div className="flex justify-center items-center gap-8 py-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                                <div className="h-6 w-auto flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl">shield_with_heart</span>
                                    <span className="font-bold text-sm">Secure Data</span>
                                </div>
                                <div className="h-6 w-auto flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl">cloud_done</span>
                                    <span className="font-bold text-sm">Cloud Sync</span>
                                </div>
                                <div className="h-6 w-auto flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl">support_agent</span>
                                    <span className="font-bold text-sm">24/7 Support</span>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="py-10 text-center text-slate-400 text-sm">
                        © 2024 stage.io Inc. All rights reserved.
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default CompanySignup;
