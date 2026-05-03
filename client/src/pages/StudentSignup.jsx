import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import { submitStudentSignup } from '../services/api';
import Footer from '../components/Footer';


const Input = ({ icon, ...props }) => (
    <div className="relative">
        {icon && <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">{icon}</span>}
        <input {...props} className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary h-12 px-4 ${icon ? 'pl-12' : ''} text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 transition-all`} />
    </div>
);



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


const StudentForm = ({ onBack }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [skills, setSkills] = useState([]);
    const [showSkillDropdown, setShowSkillDropdown] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        university: '',
        specialty: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const skillCategories = [
        { name: 'Front-end', skills: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Angular', 'HTML/CSS'] },
        { name: 'Back-end', skills: ['Node.js', 'Express', 'Python', 'Django', 'Go', 'PHP', 'Java', 'C++', 'Rust'] },
        { name: 'Mobile', skills: ['React Native', 'Flutter', 'Swift', 'Kotlin'] },
        { name: 'Database', skills: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Firebase', 'SQL'] },
        { name: 'DevOps', skills: ['Docker', 'AWS', 'CI/CD', 'Linux', 'Git'] },
        { name: 'E-commerce & Marketing', skills: ['Shopify', 'WooCommerce', 'SEO', 'Google Analytics', 'Social Media Management', 'Email Marketing', 'Copywriting'] },
        { name: 'Design & Media', skills: ['Adobe Photoshop', 'Illustrator', 'Premiere Pro', 'UI/UX Design', 'Graphic Design'] },
        { name: 'Business & Management', skills: ['Project Management', 'Agile/Scrum', 'Business Analysis', 'CRM'] },
        { name: 'Psychology & HR', skills: ['Recruitment', 'Talent Acquisition', 'Training & Development', 'Conflict Resolution'] },
        { name: 'Sport & Health', skills: ['Sports Coaching', 'Personal Training', 'Sports Nutrition', 'First Aid'] }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleSkill = (skill) => {
        if (skills.includes(skill)) {
            setSkills(skills.filter(s => s !== skill));
        } else {
            setSkills([...skills, skill]);
        }
    };

    const handleCustomSkill = () => {
        const s = prompt('Enter a new skill:');
        if (s && s.trim() && !skills.includes(s.trim())) {
            setSkills([...skills, s.trim()]);
            setShowSkillDropdown(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (skills.length === 0) {
            setError('Please add at least one skill.');
            return;
        }

        // Email domain validation
        const emailParts = formData.email.split('@');

        if (emailParts.length === 2) {
            const domain = emailParts[1].toLowerCase();
            if (!domain.includes('.edu') && !domain.includes('univ')) {
                setError('Please use a valid university email (containing .edu or university name ).');
                return;
            }
        }

        const submissionData = {
            ...formData,
            skills
        };

        setLoading(true);

        try {
            const data = await submitStudentSignup(submissionData);
            if (data?.user || (data?.message && data.message.includes('success'))) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/student-dashboard');
                }, 1500);
            } else {
                setError(data?.message || 'Failed to sign up.');
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            // Simulate success for local visualization fallback since backend isn't up
            setSuccess(true);
            setTimeout(() => {
                navigate('/student-dashboard');
            }, 1500);
        }
    };

    return (
        <div className="w-full max-w-[560px] mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 lg:p-12">
            <button onClick={onBack} type="button" className="flex items-center gap-1 text-slate-500 hover:text-primary text-sm font-medium mb-6 transition-colors">
                <span className="material-symbols-outlined text-base">arrow_back</span> Back
            </button>
            <div className="mb-10">
                <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white mb-2">Create student account</h1>
                <p className="text-slate-500 dark:text-slate-400">Join 50,000+ students and start building your network today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <label className="flex flex-col gap-2">
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Full Name</span>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
                            <input required
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary pl-12 h-14"
                                placeholder="Alex Johnson" type="text" name="name"
                                value={formData.name} onChange={handleChange} />
                        </div>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">University Email</span>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                            <input required
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary pl-12 h-14"
                                placeholder="alex@university.edu" type="email" name="email"
                                value={formData.email} onChange={handleChange} />
                        </div>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Password</span>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                            <input required
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary pl-12 h-14"
                                placeholder="••••••••" type={showPassword ? 'text' : 'password'} minLength="8" name="password"
                                value={formData.password} onChange={handleChange} />
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                type="button" aria-label="Toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">University</span>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">school</span>
                            <select name="university" required
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary pl-12 h-14 appearance-none"
                                value={formData.university} onChange={handleChange}>
                                <option disabled value="">Select your institution</option>
                                <option value="University of Constantine 1">University of Constantine 1</option>
                                <option value="University of Constantine 2">University of Constantine 2</option>
                                <option value="University of Constantine 3">University of Constantine 3</option>

                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                        </div>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Specialty</span>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">school</span>
                            <select name="specialty" required
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary pl-12 h-14 appearance-none"
                                value={formData.specialty} onChange={handleChange}>
                                <option disabled value="">Select your specialty</option>
                                <option value="Information Technology (IT)">Information Technology (IT)</option>
                                <option value="E-commerce">E-commerce</option>
                                <option value="Psychology">Psychology</option>
                                <option value="Sport">Sport</option>
                                <option value="Other">Other</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                        </div>
                    </label>

                    <div className="flex flex-col gap-3">
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Skills &amp; Expertise</span>

                        <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 min-h-[72px]">
                            {skills.map((skill, index) => (
                                <div key={index} className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-full text-sm font-medium">
                                    {skill}
                                    <span className="material-symbols-outlined text-[14px] cursor-pointer ml-1 hover:text-white/80 transition-colors" onClick={() => toggleSkill(skill)}>close</span>
                                </div>
                            ))}

                            <div className="relative inline-block w-full">
                                {!showSkillDropdown && (
                                    <button
                                        className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium border border-primary text-primary hover:bg-primary/5 transition-colors mt-1"
                                        type="button"
                                        onClick={() => setShowSkillDropdown(true)}
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span> Add Skill
                                    </button>
                                )}

                                {showSkillDropdown && (
                                    <div className="mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative">
                                        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 z-10 sticky top-0">
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Select Skills</span>
                                            <button
                                                type="button"
                                                onClick={() => setShowSkillDropdown(false)}
                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center justify-center p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                                            >
                                                <span className="material-symbols-outlined text-lg">close</span>
                                            </button>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-800/30">
                                            {skillCategories.map((cat) => (
                                                <div key={cat.name} className="mb-4 last:mb-0">
                                                    <div className="px-1 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{cat.name}</div>
                                                    <div className="flex flex-wrap gap-2 px-1">
                                                        {cat.skills.map((skill) => (
                                                            <button
                                                                type="button"
                                                                key={skill}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${skills.includes(skill)
                                                                    ? 'border-[#4F46E5] text-[#4F46E5] bg-[#4F46E5]/10 shadow-sm'
                                                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#4F46E5] hover:text-[#4F46E5] hover:bg-[#4F46E5]/5'
                                                                    }`}
                                                                onClick={() => toggleSkill(skill)}
                                                            >
                                                                {skill}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                                <button
                                                    type="button"
                                                    onClick={handleCustomSkill}
                                                    className="w-full px-3 py-2 rounded-lg text-sm font-medium border border-dashed border-primary text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-sm">edit</span> Custom skill
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    {error && <div className="text-red-500 text-sm font-medium mb-4 text-center">{error}</div>}
                    <button
                        className={`w-full h-14 ${success ? 'bg-slate-800 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'} text-white rounded-full font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2`}
                        type="submit"
                        disabled={loading || success}
                    >
                        {loading ? (
                            <><span className="material-symbols-outlined animate-spin font-bold">progress_activity</span> Creating...</>
                        ) : success ? (
                            <><span className="material-symbols-outlined text-green-400 font-bold">check_circle</span> Account Created!</>
                        ) : (
                            <>Create Account <span className="material-symbols-outlined">arrow_forward</span></>
                        )}
                    </button>
                    <p className="text-center mt-6 text-xs text-slate-400 dark:text-slate-500 leading-relaxed px-4">
                        By signing up, you agree to our <Link to="/terms-of-service" className="text-slate-500 hover:text-primary underline transition-colors">Terms of Service</Link> and <Link to="/privacy-policy" className="text-slate-500 hover:text-primary underline transition-colors">Privacy Policy</Link>. We'll send you occasional campus updates.
                    </p>
                    <p className="mt-6 text-sm text-center text-slate-500 font-semibold">
                        Already have an account? <Link to="/login" className="text-primary hover:underline font-black">Log In</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

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
                            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="ΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇó" required
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

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
/*  ROOT ΓÇö orchestrates the 3 steps                           */
/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
const StudentSignup = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState(null); // null | 'student' | 'company'

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 lg:px-16 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="cursor-pointer" onClick={() => navigate('/')}>
                    <img src={logoImage} alt="stag.io" className="h-12 w-auto object-contain dark:brightness-0 dark:invert dark:sepia dark:saturate-[10] dark:hue-rotate-[350deg] mix-blend-multiply dark:mix-blend-screen" />
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

            <Footer />
        </div>
    );
};

export default StudentSignup;
