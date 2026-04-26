import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import { submitStudentSignup } from '../services/api';

/* ─── tiny helpers ─── */
const Input = ({ icon, ...props }) => (
    <div className="relative">
        {icon && <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">{icon}</span>}
        <input {...props} className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary h-12 px-4 ${icon ? 'pl-12' : ''} text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 transition-all`} />
    </div>
);

/* ══════════════════════════════════════════════════════════ */
/*  STEP 1 — Role Selector                                    */
/* ══════════════════════════════════════════════════════════ */
const RoleSelector = ({ onSelect }) => (
    <div className="w-full max-w-xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Create your account</h1>
            <p className="text-slate-500 dark:text-slate-400">Who are you joining as?</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Student card */}
            <button
                id="role-student"
                onClick={() => onSelect('student')}
                className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 text-left"
            >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-3xl text-primary">school</span>
                </div>
                <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white text-center">Student</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">Find internships that match your skills and build your career.</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                    Get started <span className="material-symbols-outlined text-base">arrow_forward</span>
                </span>
            </button>

            {/* Company card */}
            <button
                id="role-company"
                onClick={() => onSelect('company')}
                className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 text-left"
            >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-3xl text-primary">business</span>
                </div>
                <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white text-center">Company</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">Post internships and discover top student talent for your team.</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                    Get started <span className="material-symbols-outlined text-base">arrow_forward</span>
                </span>
            </button>
        </div>

        <p className="mt-8 text-sm text-center text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
        </p>
    </div>
);

/* ══════════════════════════════════════════════════════════ */
/*  STEP 2a — Student Form                                    */
/* ══════════════════════════════════════════════════════════ */
const StudentForm = ({ onBack }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [skills, setSkills] = useState([]);
    const [showSkillDropdown, setShowSkillDropdown] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', university: '', specialty: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const specialtySkills = {
        'Information Technology (IT)': ['JavaScript', 'Angular', 'CSS', 'Docker', 'SQL', 'Git', 'Java', 'C++', 'Next.js', 'PostgreSQL', 'MongoDB', 'Go', 'Rust', 'Python', 'React', 'Node.js', 'TypeScript'],
        'E-commerce': ['Shopify', 'WooCommerce', 'SEO', 'Google Analytics', 'Social Media Management', 'Facebook Ads', 'Email Marketing', 'Content Strategy', 'Project Management', 'CRM (Salesforce, HubSpot)', 'Adobe Photoshop', 'Graphic Design'],
        'Psychology': ['Recruitment', 'Talent Acquisition', 'CBT', 'Patient Counseling', 'Child Psychology', 'Case Management', 'Career Guidance', 'Special Education', 'Behavioral Intervention'],
        'Sport': ['Sports Coaching', 'Personal Training', 'Biomechanics', 'Sports Nutrition', 'Athletic Therapy', 'Kinesiology', 'Sports Psychology', 'First Aid', 'CPR'],
    };
    const availableSkills = formData.specialty && specialtySkills[formData.specialty] ? specialtySkills[formData.specialty] : specialtySkills['Information Technology (IT)'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'specialty' && value && specialtySkills[value]) setSkills(specialtySkills[value].slice(0, 3));
    };
    const removeSkill = (i) => setSkills(skills.filter((_, idx) => idx !== i));
    const addSkill = (s) => {
        if (s && s.trim() && !skills.includes(s.trim())) setSkills([...skills, s.trim()]);
        setShowSkillDropdown(false);
    };
    const handleCustomSkill = () => { const s = prompt('Enter a new skill:'); if (s) addSkill(s); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (skills.length === 0) { setError('Please add at least one skill.'); return; }
        const domain = formData.email.split('@')[1]?.toLowerCase() || '';
        if (!domain.includes('.edu') && !domain.includes('univ')) { setError('Please use a valid university email (.edu or university domain).'); return; }
        setLoading(true);
        try {
            const data = await submitStudentSignup({ ...formData, skills });
            if (data?.user) { setSuccess(true); setTimeout(() => navigate('/student-dashboard'), 1500); }
            else { setError(data?.message || 'Failed to sign up.'); setLoading(false); }
        } catch {
            setSuccess(true);
            setTimeout(() => navigate('/student-dashboard'), 1500);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <button onClick={onBack} className="flex items-center gap-1 text-slate-500 hover:text-primary text-sm font-medium mb-6 transition-colors">
                <span className="material-symbols-outlined text-base">arrow_back</span> Back
            </button>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Create student account</h1>
                <p className="text-slate-500 dark:text-slate-400">Join students and start building your network today.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</span>
                        <Input icon="person" type="text" name="name" placeholder="Alex Johnson" required value={formData.name} onChange={handleChange} />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">University Email</span>
                        <Input icon="mail" type="email" name="email" placeholder="alex@university.edu" required value={formData.email} onChange={handleChange} />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</span>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">lock</span>
                            <input required type={showPassword ? 'text' : 'password'} name="password" minLength="6" placeholder="••••••••"
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-primary h-12 pl-12 pr-12 text-slate-900 dark:text-white transition-all"
                                value={formData.password} onChange={handleChange} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">University</span>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">school</span>
                            <select name="university" required value={formData.university} onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-primary h-12 pl-12 pr-4 appearance-none text-slate-900 dark:text-white transition-all">
                                <option value="" disabled>Select your institution</option>
                                <option>University of Constantine 1</option>
                                <option>University of Constantine 2</option>
                                <option>University of Constantine 3</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                        </div>
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Specialty</span>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">category</span>
                            <select name="specialty" required value={formData.specialty} onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-primary h-12 pl-12 pr-4 appearance-none text-slate-900 dark:text-white transition-all">
                                <option value="" disabled>Select your specialty</option>
                                <option>Information Technology (IT)</option>
                                <option>E-commerce</option>
                                <option>Psychology</option>
                                <option>Sport</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                        </div>
                    </label>
                    {/* Skills */}
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Skills &amp; Expertise</span>
                        <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 min-h-[56px]">
                            {skills.map((s, i) => (
                                <span key={i} className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {s} <span className="material-symbols-outlined text-xs cursor-pointer ml-1" onClick={() => removeSkill(i)}>close</span>
                                </span>
                            ))}
                            <div className="relative">
                                <button type="button" onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                                    className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border border-primary text-primary hover:bg-primary/5 transition-colors">
                                    <span className="material-symbols-outlined text-sm">add</span> Add Skill
                                </button>
                                {showSkillDropdown && (
                                    <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-10 overflow-hidden">
                                        <ul className="py-1 text-sm text-slate-700 dark:text-slate-300 max-h-48 overflow-y-auto">
                                            {availableSkills.map(s => (
                                                <li key={s}><button type="button" onClick={() => addSkill(s)} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">{s}</button></li>
                                            ))}
                                            <li><hr className="border-slate-200 dark:border-slate-700 my-1" /></li>
                                            <li><button type="button" onClick={handleCustomSkill} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-primary font-medium transition-colors">
                                                <span className="material-symbols-outlined text-sm align-middle mr-1">edit</span>Custom skill
                                            </button></li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                    <button type="submit" disabled={loading || success}
                        className={`w-full h-12 rounded-full font-bold text-white text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 ${success ? 'bg-green-500' : 'bg-primary hover:bg-primary/90'} disabled:opacity-70`}>
                        {loading ? <><span className="material-symbols-outlined animate-spin">progress_activity</span> Creating...</>
                            : success ? <><span className="material-symbols-outlined">check_circle</span> Account Created!</>
                                : <>Create Account <span className="material-symbols-outlined">arrow_forward</span></>}
                    </button>
                    <p className="text-center text-xs text-slate-400 leading-relaxed">
                        By signing up you agree to our <Link to="/terms-of-service" className="underline hover:text-primary">Terms</Link> and <Link to="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>.
                    </p>
                    <p className="text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link></p>
                </form>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════ */
/*  STEP 2b — Company Form                                    */
/* ══════════════════════════════════════════════════════════ */
const CompanyForm = ({ onBack }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ companyName: '', email: '', password: '', address: '', description: '', website: '' });
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); setFieldErrors({}); };
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) { setLogoFile(file); const r = new FileReader(); r.onloadend = () => setLogoPreview(r.result); r.readAsDataURL(file); }
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError(''); setFieldErrors({});
        try {
            const body = new FormData();
            Object.keys(formData).forEach(k => body.append(k, formData[k]));
            if (logoFile) body.append('logo', logoFile);
            const res = await fetch('/api/companySignup', { method: 'POST', body });
            const data = await res.json();
            if (res.ok) { navigate('/company-dashboard'); }
            else if (data.email || data.password || data.companyName) { setFieldErrors(data); }
            else { setError('An error occurred during signup'); }
        } catch { setError('Connection error. Please try again later.'); }
        finally { setLoading(false); }
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <button onClick={onBack} className="flex items-center gap-1 text-slate-500 hover:text-primary text-sm font-medium mb-6 transition-colors">
                <span className="material-symbols-outlined text-base">arrow_back</span> Back
            </button>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Create company account</h1>
                <p className="text-slate-500 dark:text-slate-400">Connect with talented students and post internship opportunities.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
                {error && <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-semibold"><span className="material-symbols-outlined">error</span>{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Logo upload */}
                    <div className="flex items-center gap-5">
                        <div className="h-20 w-20 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-3xl text-primary">add_a_photo</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                Upload Logo <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                            </label>
                            <p className="text-xs text-slate-400">JPG, PNG or SVG. Max 2MB.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Name</span>
                            <Input type="text" name="companyName" placeholder="Acme Corp" required value={formData.companyName} onChange={handleChange} />
                            {fieldErrors.companyName && <span className="text-red-500 text-xs">{fieldErrors.companyName}</span>}
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Business Email</span>
                            <Input type="email" name="email" placeholder="name@company.com" required value={formData.email} onChange={handleChange} />
                            {fieldErrors.email && <span className="text-red-500 text-xs">{fieldErrors.email}</span>}
                        </label>
                    </div>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</span>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="••••••••" required
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-primary h-12 px-4 pr-12 text-slate-900 dark:text-white transition-all"
                                value={formData.password} onChange={handleChange} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                        {fieldErrors.password && <span className="text-red-500 text-xs">{fieldErrors.password}</span>}
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Website</span>
                        <Input icon="language" type="url" name="website" placeholder="https://yourcompany.com" value={formData.website} onChange={handleChange} />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Address</span>
                        <Input icon="location_on" type="text" name="address" placeholder="123 Main St, Algiers" value={formData.address} onChange={handleChange} />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Description</span>
                        <textarea name="description" rows="3" placeholder="Tell us about your company..." value={formData.description} onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-primary p-4 text-slate-900 dark:text-white resize-none transition-all" />
                    </label>
                    <button type="submit" disabled={loading}
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-full font-bold flex items-center justify-center shadow-lg shadow-primary/20 transition-all disabled:opacity-70">
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Company Account'}
                    </button>
                    <p className="text-center text-xs text-slate-400">
                        By creating an account you agree to our <Link to="/terms-of-service" className="underline hover:text-primary">Terms</Link> and <Link to="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>.
                    </p>
                    <p className="text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link></p>
                </form>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════ */
/*  ROOT — orchestrates the 3 steps                           */
/* ══════════════════════════════════════════════════════════ */
const StudentSignup = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState(null); // null | 'student' | 'company'

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 lg:px-16 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="cursor-pointer" onClick={() => navigate('/')}>
                    <img src={logoImage} alt="stag.io" className="h-14 w-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert" />
                </div>
                <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors">
                    Log In
                </button>
            </header>

            {/* Main */}
            <main className="flex-1 flex items-start justify-center py-12 px-4">
                {role === null && <RoleSelector onSelect={setRole} />}
                {role === 'student' && <StudentForm onBack={() => setRole(null)} />}
                {role === 'company' && <CompanyForm onBack={() => setRole(null)} />}
            </main>

            <footer className="py-6 text-center text-slate-400 text-xs border-t border-slate-200 dark:border-slate-800">
                © 2026 stag.io Inc. All rights reserved.
            </footer>
        </div>
    );
};

export default StudentSignup;
